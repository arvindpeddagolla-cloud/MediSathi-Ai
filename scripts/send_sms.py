import urllib.request
import urllib.parse
import base64
import json
import ssl
import sys

ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID", "")
AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN", "")
FROM_PHONE = os.environ.get("TWILIO_PHONE_NUMBER", "+17372508034")
TO_PHONE = "+918106890663"

# MediSathi AI Medication Reminder SMS Body
BODY_TEXT = (
    "Reminder: It’s time to take your scheduled medicine.\n"
    "Medicine: Paracetamol 500 mg\n"
    "Instruction: After food\n"
    "Please take it as prescribed by your doctor."
)

def send_twilio_sms(to_number=TO_PHONE, message_body=BODY_TEXT):
    url = f"https://api.twilio.com/2010-04-01/Accounts/{ACCOUNT_SID}/Messages.json"
    
    data = urllib.parse.urlencode({
        "To": to_number,
        "From": FROM_PHONE,
        "Body": message_body
    }).encode("utf-8")
    
    req = urllib.request.Request(url, data=data, method="POST")
    auth_header = base64.b64encode(f"{ACCOUNT_SID}:{AUTH_TOKEN}".encode("utf-8")).decode("ascii")
    req.add_header("Authorization", f"Basic {auth_header}")
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    
    ctx = ssl.create_default_context()
    
    try:
        with urllib.request.urlopen(req, context=ctx) as response:
            res_body = response.read().decode("utf-8")
            res_json = json.loads(res_body)
            print("SUCCESS! Twilio SMS sent.")
            print(f"Message SID: {res_json.get('sid')}")
            print(f"Status: {res_json.get('status')}")
            print(f"To: {res_json.get('to')}")
            print(f"From: {res_json.get('from')}")
            print(f"Date Created: {res_json.get('date_created')}")
            return res_json
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode("utf-8")
        print(f"Twilio HTTP Error {e.code}: {err_msg}")
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None

if __name__ == "__main__":
    msg = sys.argv[1] if len(sys.argv) > 1 else BODY_TEXT
    send_twilio_sms(message_body=msg)
