import { defineConfig } from 'vite';
import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';

// Helper to load .env variables into process.env
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

const getAccountSid = () => process.env.TWILIO_ACCOUNT_SID || "";
const getAuthToken = () => process.env.TWILIO_AUTH_TOKEN || "";
const getFromPhone = () => process.env.TWILIO_PHONE_NUMBER || "+17372508034";
const DEFAULT_TO = "+918106890663";

export default defineConfig({
  server: {
    port: 5173,
    host: true,
    open: false
  },
  plugins: [
    {
      name: 'twilio-sms-api',
      configureServer(server) {
        server.middlewares.use('/api/send-sms', (req, res) => {
          if (req.method === 'POST') {
            let body = '';
            req.on('data', chunk => { body += chunk; });
            req.on('end', () => {
              let payload = {};
              try {
                payload = JSON.parse(body || '{}');
              } catch (e) {}

              const toPhone = payload.to || DEFAULT_TO;
              const msgBody = payload.body || 
`Reminder: It’s time to take your scheduled medicine.
Medicine: Paracetamol 500 mg
Instruction: After food
Please take it as prescribed by your doctor.`;

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

              // Send custom SMS, fallback to trial template if restricted
              sendTwilioRequest(msgBody, (err, statusCode, parsed, rawBody) => {
                if (err) {
                  res.setHeader('Content-Type', 'application/json');
                  res.statusCode = 500;
                  return res.end(JSON.stringify({ error: err.message }));
                }

                // If trial account template error (code 572006) and msgBody was custom
                if (parsed && parsed.code === 572006 && msgBody !== 'sms_appointment_reminders') {
                  console.log('Twilio Free Trial template restriction (code 572006). Retrying with sms_appointment_reminders template...');
                  sendTwilioRequest('sms_appointment_reminders', (err2, statusCode2, parsed2, rawBody2) => {
                    res.setHeader('Content-Type', 'application/json');
                    res.statusCode = statusCode2 || 200;
                    if (parsed2 && parsed2.sid) {
                      parsed2.trialTemplateUsed = true;
                      parsed2.medicineDetails = msgBody;
                      parsed2.notice = "Twilio Trial Account delivered reminder SMS. To customize exact medicine text, upgrade your Twilio account.";
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
          } else {
            res.statusCode = 405;
            res.end('Method Not Allowed');
          }
        });
      }
    }
  ]
});

