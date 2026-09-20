import { store } from '../state/store.js';
import { speech } from './speech.js';
import { showToast } from '../components/Toast.js';

// Format SMS text based on specific tablet and medicine details
export function formatMedicineSms(med) {
  if (!med) {
    return (
      "Reminder: It’s time to take your scheduled medicine.\n" +
      "Medicine: Paracetamol 500 mg\n" +
      "Instruction: After food\n" +
      "Please take it as prescribed by your doctor."
    );
  }

  const instructionText = med.instruction || 'After food';
  const instructionTe = med.instructionTe ? ` (${med.instructionTe})` : '';

  return (
    `Reminder: It’s time to take your scheduled medicine.\n` +
    `Medicine: ${med.name} ${med.strength}\n` +
    `Timing: ${med.time} (${med.slot || 'Scheduled'})\n` +
    `Instruction: ${instructionText}${instructionTe}\n` +
    `Please take it as prescribed by your doctor.`
  );
}

// Parse various time string representations into { hours, minutes } 24-hour format
export function parseTimeString(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return null;
  const str = timeStr.trim();

  // Pattern: "09:00 AM", "9:00 PM", "1:15pm", "9am", etc.
  const ampmMatch = str.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM|am|pm)$/i);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1], 10);
    const minutes = ampmMatch[2] ? parseInt(ampmMatch[2], 10) : 0;
    const isPM = ampmMatch[3].toUpperCase() === 'PM';

    if (isPM && hours < 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;
    return { hours, minutes };
  }

  // Pattern: "14:30", "09:00", "9:00" (24-hour or 12-hour without AM/PM)
  const plainMatch = str.match(/^(\d{1,2}):(\d{2})$/);
  if (plainMatch) {
    const hours = parseInt(plainMatch[1], 10);
    const minutes = parseInt(plainMatch[2], 10);
    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
      return { hours, minutes };
    }
  }

  return null;
}

// Convert 24-hour {hours, minutes} to standard display "09:00 AM" format
export function formatToAmPm(hours, minutes) {
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = (hours % 12 || 12).toString().padStart(2, '0');
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${displayHours}:${displayMinutes} ${ampm}`;
}

// Trigger real Twilio SMS and In-App Alarm for a specific medicine
export async function triggerMedicineReminder(medIdOrObject, targetPhone = '+918106890663') {
  let med = null;
  if (typeof medIdOrObject === 'string') {
    med = store.state.medications.find(m => m.id === medIdOrObject) || store.state.medications[0];
  } else if (medIdOrObject && medIdOrObject.name) {
    med = medIdOrObject;
  } else {
    med = store.state.medications[0];
  }

  const smsText = formatMedicineSms(med);
  showToast(`⏰ Scheduled Reminder Triggered: ${med.name} ${med.strength}`, 'info', 3000);

  // 1. Play Audio Chime & Trigger Telugu/English Voice Announcement
  speech.playChime('reminder');
  setTimeout(() => {
    const teInstruction = med.instructionTe || 'ఆహారం తర్వాత తీసుకోవాలి';
    speech.speak(
      `నమస్కారం అరవింద్ గారు. ఇది ${med.name} ${med.strength} మందు వేసుకునే సమయం. ${teInstruction}.`,
      'te'
    );
  }, 400);

  // 2. Open Alarm Modal for this medicine
  store.openMedicineDetails(med);

  // 3. Send Real Live Twilio SMS to user's mobile
  try {
    const res = await fetch('/api/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: targetPhone,
        body: smsText,
        medicineName: med.name,
        strength: med.strength,
        instruction: med.instruction,
        timing: med.time
      })
    });
    
    const data = await res.json();
    if (data.sid) {
      speech.playChime('success');
      showToast(`✓ Twilio SMS Sent to ${targetPhone}! SID: ${data.sid.slice(0, 10)}...`, 'success', 5000);
      return data;
    } else {
      showToast(`Twilio SMS Status: ${data.message || 'Processed'}`, 'info', 4000);
    }
  } catch (err) {
    console.warn('SMS API notice:', err);
    showToast(`Reminder alert triggered for ${med.name} ${med.strength}`, 'info', 3000);
  }
}

// Active Clock Scheduler Engine: Checks timings every 2 seconds for high precision
let schedulerInterval = null;
const firedToday = new Set();

export function startActiveScheduler() {
  if (schedulerInterval) clearInterval(schedulerInterval);

  schedulerInterval = setInterval(() => {
    const now = new Date();
    const curHours = now.getHours();
    const curMinutes = now.getMinutes();
    const dateKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

    store.state.medications.forEach(med => {
      const parsed = parseTimeString(med.time);
      if (parsed) {
        if (parsed.hours === curHours && parsed.minutes === curMinutes) {
          const fireKey = `${med.id}-${dateKey}-${curHours}-${curMinutes}`;
          if (!firedToday.has(fireKey)) {
            firedToday.add(fireKey);
            console.log(`[Scheduler] Clock match for ${med.name} (${med.time}) -> Triggering SMS!`);
            triggerMedicineReminder(med);
          }
        }
      }
    });
  }, 2000);
}

// Quick Countdown Timer for demo / instant testing
let countdownTimer = null;

export function startDemoCountdown(medId, seconds = 5) {
  if (countdownTimer) clearInterval(countdownTimer);

  const med = store.state.medications.find(m => m.id === medId) || store.state.medications[0];
  let remaining = seconds;
  showToast(`⏱️ Countdown set: ${med.name} SMS in ${remaining}s...`, 'info', 1500);

  countdownTimer = setInterval(() => {
    remaining -= 1;
    if (remaining > 0) {
      showToast(`⏱️ ${med.name} SMS trigger in ${remaining}s...`, 'info', 1000);
    } else {
      clearInterval(countdownTimer);
      triggerMedicineReminder(med);
    }
  }, 1000);
}
