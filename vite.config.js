import { defineConfig } from 'vite';
import https from 'node:https';

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "";
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "";
const FROM_PHONE = process.env.TWILIO_PHONE_NUMBER || "+17372508034";
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

              const postData = new URLSearchParams({
                To: toPhone,
                From: FROM_PHONE,
                Body: msgBody
              }).toString();

              const auth = Buffer.from(`${ACCOUNT_SID}:${AUTH_TOKEN}`).toString('base64');

              const twilioReq = https.request({
                hostname: 'api.twilio.com',
                path: `/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`,
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
                  res.setHeader('Content-Type', 'application/json');
                  res.statusCode = twilioRes.statusCode || 200;
                  res.end(twilioBody);
                });
              });

              twilioReq.on('error', (err) => {
                res.setHeader('Content-Type', 'application/json');
                res.statusCode = 500;
                res.end(JSON.stringify({ error: err.message }));
              });

              twilioReq.write(postData);
              twilioReq.end();
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

