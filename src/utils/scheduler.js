import { store } from '../state/store.js';
import { speech } from './speech.js';
import { showToast } from '../components/Toast.js';

// Format SMS text based on specific tablet and medicine details
export function formatMedicineSms(med, lang = (store && store.state ? store.state.currentLanguage : 'en')) {
  if (!med) {
    if (lang === 'te') {
      return (
        "రిమైండర్: మీ మందులు వేసుకునే సమయం అయింది.\n" +
        "మందు: పారాసిటమాల్ 500 mg\n" +
        "సూచన: ఆహారం తర్వాత\n" +
        "డాక్టర్ సూచించిన విధంగా వేసుకోండి."
      );
    }
    return (
      "Reminder: It’s time to take your scheduled medicine.\n" +
      "Medicine: Paracetamol 500 mg\n" +
      "Instruction: After food\n" +
      "Please take it as prescribed by your doctor."
    );
  }

  if (lang === 'te') {
    const teInstruction = med.instructionTe || 'ఆహారం తర్వాత';
    return (
      `రిమైండర్: మీ మందులు వేసుకునే సమయం అయింది.\n` +
      `మందు: ${med.name} ${med.strength}\n` +
      `సమయం: ${med.time}\n` +
      `సూచన: ${teInstruction}\n` +
      `డాక్టర్ సూచించిన విధంగా వేసుకోండి.`
    );
  }

  const instructionText = med.instruction || 'After food';
  return (
    `Reminder: It’s time to take your scheduled medicine.\n` +
    `Medicine: ${med.name} ${med.strength}\n` +
    `Timing: ${med.time}\n` +
    `Instruction: ${instructionText}\n` +
    `Please take it as prescribed by your doctor.`
  );
}

// Parse various time string representations into { hours, minutes } 24-hour format
export function parseTimeString(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return null;
  const str = timeStr.trim().toLowerCase();
  const now = new Date();
  const curHours = now.getHours();

  // Pattern: "09:00 am", "9:00 pm", "1:15pm", "9am", "9 pm", "02:15 pm"
  const ampmMatch = str.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)$/i);
  if (ampmMatch) {
    let hours = parseInt(ampmMatch[1], 10);
    const minutes = ampmMatch[2] ? parseInt(ampmMatch[2], 10) : 0;
    const isPM = ampmMatch[3].toLowerCase() === 'pm';

    if (isPM && hours < 12) hours += 12;
    if (!isPM && hours === 12) hours = 0;
    return { hours, minutes };
  }

  // Pattern: "14:30", "09:00", "9:00", "2:15" (24-hour or simple time without AM/PM)
  const plainMatch = str.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (plainMatch) {
    let hours = parseInt(plainMatch[1], 10);
    const minutes = parseInt(plainMatch[2], 10);
    if (hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59) {
      // Smart AM/PM inference: if hours < 12, and current time is afternoon (>= 12),
      // check if treating as PM makes it upcoming today or closer to now
      if (hours < 12 && curHours >= 12) {
        const pmHours = hours + 12;
        if (pmHours >= curHours || curHours - pmHours <= 2) {
          hours = pmHours;
        }
      }
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

// Calculate seconds from now until target { hours, minutes }
export function getSecondsUntilTime(targetHours, targetMinutes) {
  const now = new Date();
  const curSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const targetSec = targetHours * 3600 + targetMinutes * 60;
  let diff = targetSec - curSeconds;
  return diff;
}

// Global state for fired triggers and timers
const firedToday = new Set();
const activeTimeouts = new Map();
let schedulerInterval = null;

// Trigger real Twilio SMS and In-App Alarm for a specific medicine
export async function triggerMedicineReminder(medIdOrObject, targetPhone = '+918106890663') {
  let med = null;
  if (typeof medIdOrObject === 'string') {
    med = (store && store.state && store.state.medications)
      ? store.state.medications.find(m => m.id === medIdOrObject) || store.state.medications[0]
      : null;
  } else if (medIdOrObject && medIdOrObject.name) {
    med = medIdOrObject;
  } else {
    med = store && store.state ? store.state.medications[0] : null;
  }

  if (!med) {
    console.warn('[Scheduler] No medicine found to trigger reminder.');
    return;
  }

  const effectivePhone = (med && med.targetPhone) ? med.targetPhone : targetPhone;
  const lang = (store && store.state) ? store.state.currentLanguage : 'en';
  const smsText = formatMedicineSms(med, lang);

  console.log(`[Scheduler] >>> TRIGGERING REMINDER FOR ${med.name} (${med.time}) TO ${effectivePhone} <<<`);
  showToast(`⏰ Scheduled Reminder Triggered: ${med.name} ${med.strength}`, 'info', 4000);

  // 1. Play Audio Chime & Trigger Telugu/English Voice Announcement
  try {
    speech.playChime('reminder');
    setTimeout(() => {
      if (lang === 'te') {
        const teInstruction = med.instructionTe || 'ఆహారం తర్వాత తీసుకోవాలి';
        speech.speak(
          `నమస్కారం అరవింద్ గారు. ఇది ${med.name} ${med.strength} మందు వేసుకునే సమయం. ${teInstruction}.`,
          'te'
        );
      } else {
        const enInstruction = med.instruction || 'After food';
        speech.speak(
          `Hello Arvind. It is time to take your scheduled medicine, ${med.name} ${med.strength}. ${enInstruction}.`,
          'en'
        );
      }
    }, 300);
  } catch (err) {
    console.warn('Speech error in reminder:', err);
  }

  // 2. Open Alarm Modal with Siren & Interactive TAKEN / Snooze
  try {
    if (store && typeof store.openReminderAlarm === 'function') {
      store.openReminderAlarm(med);
    }
  } catch (err) {
    console.warn('Modal open error:', err);
  }

  // 3. Send Real Live Twilio SMS to user's mobile
  try {
    console.log(`[Scheduler] Dispatching Twilio SMS to ${effectivePhone}...`);
    const res = await fetch('/api/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: effectivePhone,
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
      showToast(`✓ Twilio SMS Sent to ${effectivePhone}! SID: ${data.sid.slice(0, 12)}...`, 'success', 6000);
      console.log(`[Scheduler] SMS delivered successfully. SID: ${data.sid}`);
      return data;
    } else {
      showToast(`Twilio SMS Status: ${data.message || 'Queued'}`, 'info', 4000);
      console.log(`[Scheduler] SMS API response:`, data);
    }
  } catch (err) {
    console.warn('[Scheduler] SMS API network error:', err);
    showToast(`Reminder alert triggered for ${med.name} ${med.strength}`, 'info', 3000);
  }
}

export function scheduleMedicationTimer(med) {
  if (!med || !med.time) return;
  const parsed = parseTimeString(med.time);
  if (!parsed) {
    console.warn(`[Scheduler] Could not parse time string: "${med.time}" for ${med.name}`);
    return;
  }

  const diffSeconds = getSecondsUntilTime(parsed.hours, parsed.minutes);
  const now = new Date();
  const dateKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  const fireKey = `${med.id}-${dateKey}-${parsed.hours}-${parsed.minutes}`;

  console.log(`[Scheduler] Registered medication "${med.name}" (${med.time}) -> Diff seconds: ${diffSeconds}s`);

  // If time is right now or within last 60 seconds and hasn't fired yet
  if (diffSeconds >= -60 && diffSeconds <= 1) {
    if (!firedToday.has(fireKey)) {
      firedToday.add(fireKey);
      console.log(`[Scheduler] Immediate match for ${med.name} (${med.time}) -> Triggering Live SMS & Alarm!`);
      setTimeout(() => {
        triggerMedicineReminder(med, med.targetPhone || '+918106890663');
      }, 400);
    }
  } else if (diffSeconds > 1 && diffSeconds <= 86400) {
    // Schedule exact timeout for today
    if (activeTimeouts.has(med.id)) {
      clearTimeout(activeTimeouts.get(med.id));
    }

    console.log(`[Scheduler] Setting precision timer for ${med.name} at ${med.time} (in ${diffSeconds} seconds)`);
    const timerId = setTimeout(() => {
      if (!firedToday.has(fireKey)) {
        firedToday.add(fireKey);
        console.log(`[Scheduler] Precision timer fired for ${med.name} (${med.time})!`);
        triggerMedicineReminder(med, med.targetPhone || '+918106890663');
      }
    }, diffSeconds * 1000);

    activeTimeouts.set(med.id, timerId);
  }
}

export function startActiveScheduler() {
  if (schedulerInterval) clearInterval(schedulerInterval);

  // Check all medications immediately on start
  if (store && store.state && store.state.medications) {
    store.state.medications.forEach(med => {
      scheduleMedicationTimer(med);
    });
  }

  schedulerInterval = setInterval(() => {
    const now = new Date();
    const curHours = now.getHours();
    const curMinutes = now.getMinutes();
    const dateKey = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

    if (!store || !store.state || !store.state.medications) return;

    store.state.medications.forEach(med => {
      const parsed = parseTimeString(med.time);
      if (parsed) {
        if (parsed.hours === curHours && parsed.minutes === curMinutes) {
          const fireKey = `${med.id}-${dateKey}-${curHours}-${curMinutes}`;
          if (!firedToday.has(fireKey)) {
            firedToday.add(fireKey);
            console.log(`[Scheduler] 1-sec clock interval matched for ${med.name} (${med.time})!`);
            triggerMedicineReminder(med, med.targetPhone || '+918106890663');
          }
        }
      }
    });
  }, 1000);
}

// Quick Countdown Timer for demo / instant testing
let countdownTimer = null;

export function startDemoCountdown(medId, seconds = 5, targetPhone = '+918106890663') {
  if (countdownTimer) clearInterval(countdownTimer);

  const med = (store && store.state && store.state.medications)
    ? store.state.medications.find(m => m.id === medId) || store.state.medications[0]
    : null;
    
  if (!med) return;

  let remaining = seconds;
  showToast(`⏱️ Countdown started: ${med.name} alert in ${remaining}s...`, 'info', 1500);

  countdownTimer = setInterval(() => {
    remaining -= 1;
    if (remaining > 0) {
      showToast(`⏱️ ${med.name} alert & SMS in ${remaining}s...`, 'info', 1000);
    } else {
      clearInterval(countdownTimer);
      triggerMedicineReminder(med, targetPhone);
    }
  }, 1000);
}

