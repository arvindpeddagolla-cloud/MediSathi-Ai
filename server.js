import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, 'dist');

function loadEnvFile() {
  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
          const eqIdx = trimmed.indexOf('=');
          if (eqIdx !== -1) {
            const key = trimmed.slice(0, eqIdx).trim();
            const val = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      });
    }
  } catch (e) {
    console.error('Error loading .env file:', e);
  }
}

loadEnvFile();

const PORT = process.env.PORT || 10000;
const getAccountSid = () => process.env.TWILIO_ACCOUNT_SID || "";
const getAuthToken = () => process.env.TWILIO_AUTH_TOKEN || "";
const getFromPhone = () => process.env.TWILIO_PHONE_NUMBER || "+17372508034";
const DEFAULT_TO = "+918106890663";

const DEFAULT_SMS_BODY = 
`Reminder: It’s time to take your scheduled medicine.
Medicine: Paracetamol 500 mg
Instruction: After food
Please take it as prescribed by your doctor.`;

const MIME_TYPES = {
  '.html': 'text/html; charset=UTF-8',
  '.js': 'application/javascript; charset=UTF-8',
  '.css': 'text/css; charset=UTF-8',
  '.json': 'application/json; charset=UTF-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  // Handle Twilio SMS API
  if (req.url === '/api/send-sms' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      let payload = {};
      try {
        payload = JSON.parse(body || '{}');
      } catch (e) {}

      const toPhone = payload.to || DEFAULT_TO;
      const msgBody = payload.body || DEFAULT_SMS_BODY;

      const sid = getAccountSid();
      const token = getAuthToken();
      const fromNum = getFromPhone();

      function sendTwilioRequest(textBody, callback) {
        const postData = new URLSearchParams({
          To: toPhone,
          From: fromNum,
          Body: textBody
        }).toString();

        const auth = Buffer.from(`${sid}:${token}`).toString('base64');

        const twilioReq = https.request({
          hostname: 'api.twilio.com',
          path: `/2010-04-01/Accounts/${sid}/Messages.json`,
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
          }
        }, (twilioRes) => {
          let twilioBody = '';
          twilioRes.on('data', d => { twilioBody += d; });
          twilioRes.on('end', () => {
            let parsed = {};
            try { parsed = JSON.parse(twilioBody); } catch (e) {}
            callback(null, twilioRes.statusCode, parsed, twilioBody);
          });
        });

        twilioReq.on('error', (err) => {
          callback(err);
        });

        twilioReq.write(postData);
        twilioReq.end();
      }

      sendTwilioRequest(msgBody, (err, statusCode, parsed, rawBody) => {
        if (err) {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 500;
          return res.end(JSON.stringify({ error: err.message }));
        }

        if (parsed && parsed.code === 572006 && msgBody !== 'sms_event_notifications') {
          console.log('Twilio Free Trial template restriction (code 572006). Retrying with trial template trigger...');
          sendTwilioRequest('sms_event_notifications', (err2, statusCode2, parsed2, rawBody2) => {
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = statusCode2 || 200;
            if (parsed2 && parsed2.sid) {
              parsed2.trialTemplateUsed = true;
              parsed2.medicineDetails = msgBody;
              parsed2.notice = "Twilio Trial Account delivered trigger SMS. Upgrade Twilio account to deliver custom medicine text.";
            }
            res.end(JSON.stringify(parsed2));
          });
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = statusCode || 200;
          if (parsed && parsed.sid) {
            parsed.customDelivered = true;
            parsed.medicineDetails = msgBody;
          }
          res.end(JSON.stringify(parsed));
        }
      });
    });
    return;
  }

  // Serve static files from dist/
  let reqPath = req.url.split('?')[0];
  if (reqPath === '/') reqPath = '/index.html';

  let filePath = path.join(DIST_DIR, reqPath);
  
  // Safe path check
  if (!filePath.startsWith(DIST_DIR)) {
    res.statusCode = 403;
    return res.end('Forbidden');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // SPA Fallback to index.html
      filePath = path.join(DIST_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.statusCode = 500;
        return res.end('Error loading file');
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`MediSathi AI production server listening on http://0.0.0.0:${PORT}`);
});
