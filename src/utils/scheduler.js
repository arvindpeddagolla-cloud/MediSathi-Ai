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
    `Timing: ${med.time} (${med.slot})\n` +
    `Instruction: ${instructionText}${instructionTe}\n` +
    `Please take it as prescribed by your doctor.`
  );
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
  showToast(`⏰ Triggering reminder for ${med.name} ${med.strength}...`, 'info', 2000);

  // 1. Play Audio Chime & Trigger Voice Announcement
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

  // 3. Send Real Live Twilio SMS
  try {
    const res = await fetch('/api/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: targetPhone,
        body: smsText,
        medicineName: med.name,
        strength: med.strength,
        instruction: med.instruction
      })
    });
    
    const data = await res.json();
    if (data.sid) {
      speech.playChime('success');
      showToast(`✓ Twilio SMS Sent for ${med.name} ${med.strength}! SID: ${data.sid.slice(0, 10)}...`, 'success', 5000);
      return data;
    } else {
      showToast(`Twilio SMS Notice: ${data.message || 'SMS processed'}`, 'info', 4000);
    }
  } catch (err) {
    console.warn('SMS Network notice:', err);
    showToast(`Reminder simulated for ${med.name} ${med.strength}`, 'info', 3000);
  }
}

// Active Clock Scheduler Engine: Checks timings every 30 seconds
let schedulerInterval = null;
const firedToday = new Set();

export function startActiveScheduler() {
  if (schedulerInterval) clearInterval(schedulerInterval);

  schedulerInterval = setInterval(() => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const currentTimeStr = `${formattedHours}:${formattedMinutes} ${ampm}`;

    // Check if any medication matches current time
    store.state.medications.forEach(med => {
      if (med.time === currentTimeStr && !firedToday.has(`${med.id}-${currentTimeStr}`)) {
        firedToday.add(`${med.id}-${currentTimeStr}`);
        triggerMedicineReminder(med);
      }
    });
  }, 30000);
}

// Quick Countdown Timer for judges & instant demo
let countdownTimer = null;

export function startDemoCountdown(medId, seconds = 5) {
  if (countdownTimer) clearInterval(countdownTimer);

  const med = store.state.medications.find(m => m.id === medId) || store.state.medications[0];
  let remaining = seconds;
  showToast(`⏱️ Timer set: ${med.name} reminder in ${remaining}s...`, 'info', 1500);

  countdownTimer = setInterval(() => {
    remaining -= 1;
    if (remaining > 0) {
      showToast(`⏱️ ${med.name} reminder in ${remaining}s...`, 'info', 1000);
    } else {
      clearInterval(countdownTimer);
      triggerMedicineReminder(med);
    }
  }, 1000);
}
