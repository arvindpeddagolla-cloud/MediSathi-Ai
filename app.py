import os
import json
import base64
import urllib.request
import urllib.parse
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = int(os.environ.get("PORT", 10000))
DIST_DIR = os.path.join(os.path.dirname(__file__), "dist")

ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID", "")
AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN", "")
FROM_PHONE = os.environ.get("TWILIO_PHONE_NUMBER", "+17372508034")
DEFAULT_TO = "+918106890663"

DEFAULT_SMS_BODY = (
    "Reminder: It’s time to take your scheduled medicine.\n"
    "Medicine: Paracetamol 500 mg\n"
    "Instruction: After food\n"
    "Please take it as prescribed by your doctor."
)

class MediSathiHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIST_DIR, **kwargs)

    def do_POST(self):
        if self.path == "/api/send-sms":
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length).decode("utf-8")
            
            try:
                payload = json.loads(post_data) if post_data else {}
            except Exception:
                payload = {}

            to_phone = payload.get("to", DEFAULT_TO)
            body_text = payload.get("body", DEFAULT_SMS_BODY)

            # Send via Twilio REST API
            url = f"https://api.twilio.com/2010-04-01/Accounts/{ACCOUNT_SID}/Messages.json"
            data = urllib.parse.urlencode({
                "To": to_phone,
                "From": FROM_PHONE,
                "Body": body_text
            }).encode("utf-8")

            req = urllib.request.Request(url, data=data, method="POST")
            auth_header = base64.b64encode(f"{ACCOUNT_SID}:{AUTH_TOKEN}".encode("utf-8")).decode("ascii")
            req.add_header("Authorization", f"Basic {auth_header}")
            req.add_header("Content-Type", "application/x-www-form-urlencoded")

            try:
                with urllib.request.urlopen(req) as resp:
                    res_json = resp.read()
                    self.send_response(resp.status)
                    self.send_header("Content-Type", "application/json")
                    self.end_headers()
                    self.wfile.write(res_json)
            except urllib.error.HTTPError as e:
                err_body = e.read()
                self.send_response(e.code)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(err_body)
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()

    def do_GET(self):
        # Fallback to index.html for Single Page App routing
        target_path = os.path.join(DIST_DIR, self.path.lstrip("/").split("?")[0])
        if not os.path.exists(target_path) or os.path.isdir(target_path):
            self.path = "/index.html"
        return super().do_GET()

if __name__ == "__main__":
    print(f"MediSathi AI server starting on port {PORT}...")
    httpd = HTTPServer(("0.0.0.0", PORT), MediSathiHandler)
    httpd.serve_forever()
