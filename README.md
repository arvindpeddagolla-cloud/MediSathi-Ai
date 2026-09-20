# MediSathi AI 💙

### AI-Powered Medication and Medical Report Assistant

**"Your medicines. Your health. Your reports. Your language."**

MediSathi AI is an AI-powered personal health assistant designed to make medication and medical information easier to understand, manage, and act on.

The platform is especially designed for elderly people, patients managing multiple medicines, caregivers, and users who may find medical terminology or English-only healthcare information difficult to understand.

---

## 🏥 The Problem

Many patients struggle with:

- Remembering which medicine to take
- Knowing when to take each medicine
- Understanding prescription instructions
- Understanding complicated medical reports
- Understanding medical information available only in English
- Maintaining medication adherence
- Organizing previous medical reports
- Communicating health information with caregivers and healthcare professionals

These challenges can become more difficult for elderly patients and people managing multiple medications.

---

## 💡 Our Solution

MediSathi AI combines medication assistance and medical report understanding into one easy-to-use platform.

The system provides two major workflows:

### 1. 💊 Medication Assistant

```
Prescription
  ↓
AI/OCR Extraction
  ↓
Patient Confirmation
  ↓
Personalized Medication Schedule
  ↓
Native-Language Reminder
  ↓
Adherence Tracking
```

Users can upload or scan a doctor's prescription.

AI and OCR extract:
- **Medicine name**
- **Dosage**
- **Frequency**
- **Duration**
- **Before/after food instructions**
- **Additional instructions**

Before creating the medication schedule, the patient can review and confirm the extracted information.

The system can then create personalized medication reminders delivered through:
- **In-App Alerts**
- **SMS Reminders**
- **Automated Voice Phone Calls**
- **Preferred Regional Language** (English, Telugu తెలుగు, Hindi हिंदी, Tamil தமிழ்)

---

## 🗣️ Native-Language Voice Reminders

Instead of showing only a standard notification such as:
> *"Take your medicine."*

MediSathi AI provides personalized voice reminders in the user's preferred language.

The reminder can be delivered through:
- **In-app voice notification**
- **SMS text reminder**
- **Automated voice phone call**

For example, instead of requiring the patient to open the application, MediSathi AI can place an automated voice call in the patient's preferred language informing them that it is time to take their scheduled medicine.

This helps make medication reminders more accessible to users who are more comfortable with regional languages or may not regularly use smartphone applications.

---

## 📄 2. AI Medical Report Simplifier

```
Medical Report
  ↓
OCR & Entity Extraction
  ↓
AI Understanding
  ↓
Reference-Range Analysis
  ↓
Simple Explanation
  ↓
Patient Questions & Audio
  ↓
Report History
```

Users can upload medical reports such as blood-test reports (CBC, HbA1c, Lipid panel) and other health documents.

The system extracts important biomarkers and explains medical terminology in simple, everyday language.

It also identifies values that are outside the laboratory reference range.

**Example: Hemoglobin**
- **Result:** 11.2 g/dL
- **Reference Range:** 12.0 – 16.0 g/dL
- **Clinical Notice:** *Below reference range shown in this report.*

The application provides a simplified explanation in English, Telugu, Hindi, or Tamil and encourages the user to discuss the result with their healthcare professional.

---

## 🤖 Ask Questions About Your Report

Users can interact with their uploaded report using natural language.

**Example questions:**
- *What does this test mean?*
- *Which values are outside the normal reference range?*
- *Explain this report in Telugu (తెలుగులో వివరించండి).*
- *What does this medical term mean?*

The goal is to make medical information easier to understand without replacing professional medical advice.

---

## 📊 Medical Report History & Health Trends

MediSathi AI maintains a comprehensive history of uploaded reports and vitals telemetry:
- **Previous Lab Reports & Biomarkers**
- **Telemetry Trends** (Heart Rate with live ECG flow, Blood Pressure, Weight, Sleep, Hydration)
- **7D / 30D / 3M Visual Trend Charts**
- **Daily Adherence Consistency**

---

## ✅ Medication Adherence

After receiving a medication reminder, the patient can confirm that they took the medicine:
- **Taken** (వేసుకున్నాను)
- **Remind Later** (15-minute Snooze)
- **Unconfirmed** (Awaiting confirmation)

If the user does not respond, the system records the dose as **Unconfirmed**. It does **NOT** automatically assume that the patient missed the dose.

With the user's permission, repeated unconfirmed doses can optionally trigger an alert to an authorized caregiver.

---

## 👨‍👩‍👧 Caregiver Support

Users can connect an authorized caregiver (e.g., family members).
- With user permission, caregivers receive notifications when medication doses remain unconfirmed.
- The patient remains in full control of caregiver permissions and notification channels.

---

## 🔐 Safety First & Clinical Governance

MediSathi AI is designed to **assist patients, not replace doctors**.

The system does not:
- Independently alter prescriptions
- Provide definitive medical diagnoses
- Replace qualified healthcare professionals
- Assume an unconfirmed dose was missed
- Make treatment decisions on behalf of doctors

AI-generated information is intended to help users understand and organize their healthcare information. Always consult a qualified healthcare professional for diagnosis and treatment decisions.

---

## 🎯 Target Users

MediSathi AI is designed particularly for:
- Elderly patients
- Patients managing multiple chronic medicines
- Caregivers & family members
- Patients who prefer regional languages (Telugu, Hindi, Tamil)
- People who find complex medical terminology difficult to navigate

---

## 🛠️ Technology Stack

- **Frontend:** Modern Vanilla JavaScript (ES Modules), Tailwind CSS, Material 3 Design Tokens, Google Material Symbols, Plus Jakarta Sans & Noto Sans Fonts.
- **Build Tool:** Vite 6
- **Server:** Node.js Production Server (`server.js`) & Python Fallback (`app.py`)
- **Telephony & SMS API:** Twilio REST API for automated SMS and voice reminder triggers
- **Speech Synthesis:** Web Speech API & Web Audio API for multilingual voice playback

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18+)
- Python 3.9+ *(optional)*

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/arvindpeddagolla-cloud/MediSathi-Ai.git
   cd MediSathi-Ai
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to `.env` and fill in your Twilio credentials:
   ```env
   TWILIO_ACCOUNT_SID=your_account_sid_here
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_PHONE_NUMBER=+17372508034
   PORT=10000
   ```

4. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in your browser.

5. **Build and Run Production Server:**
   ```bash
   npm run build
   npm run start
   ```

---

## 🌐 Deploying on Render

1. Create a new **Web Service** on [Render](https://render.com) connected to this repository.
2. Configure the build & start settings:
   - **Runtime:** `Node`
   - **Root Directory:** *(Leave blank)*
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `node server.js`
3. Add your Twilio environment variables under Render **Settings ➔ Environment**:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_PHONE_NUMBER`

---

## ⚠️ Medical Disclaimer

MediSathi AI is a health-technology prototype intended for healthcare-information assistance and organization. It is not a substitute for professional medical diagnosis, treatment, or clinical advice. Always consult a qualified physician or healthcare professional for medical decisions.
