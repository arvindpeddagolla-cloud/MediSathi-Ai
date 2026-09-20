import './styles/index.css';
import { store } from './state/store.js';
import { renderHeader } from './components/Header.js';
import { renderBottomNav } from './components/BottomNav.js';
import { renderDemoControls } from './components/DeviceFrame.js';
import { showToast } from './components/Toast.js';
import { speech } from './utils/speech.js';

// Views
import { renderHomeView } from './views/HomeView.js';
import { renderMedicinesView } from './views/MedicinesView.js';
import { renderHealthTrackView } from './views/HealthTrackView.js';
import { renderReportsView } from './views/ReportsView.js';
import { renderAIAssistantView } from './views/AIAssistantView.js';
import { renderProfileView } from './views/ProfileView.js';

// Modals
import { renderPrescriptionScannerModal } from './modals/PrescriptionScannerModal.js';
import { renderMedicationReminderModal } from './modals/MedicationReminderModal.js';
import { renderSMSExperienceModal } from './modals/SMSExperienceModal.js';
import { renderVoiceCallModal } from './modals/VoiceCallModal.js';
import { renderMedicineDetailsModal } from './modals/MedicineDetailsModal.js';
import { renderCalendarPickerModal } from './modals/CalendarPickerModal.js';
import { renderCreateReminderModal } from './modals/CreateReminderModal.js';

// Scheduler & Tablet-based Trigger Engine
import { 
  triggerMedicineReminder, 
  startDemoCountdown, 
  formatMedicineSms, 
  startActiveScheduler 
} from './utils/scheduler.js';

// Expose Global Helper Handlers on window
window.showToast = showToast;
window.triggerMedicineReminder = triggerMedicineReminder;
window.startDemoCountdown = startDemoCountdown;
window.formatMedicineSms = formatMedicineSms;

// Start active background timing scheduler
startActiveScheduler();

window.navigateTab = (tabId) => {
  store.setActiveTab(tabId);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.setLanguage = (lang) => {
  store.setLanguage(lang);
  showToast(`Language set to ${lang.toUpperCase()}`, 'info', 1500);
};

window.cycleLanguage = () => {
  const order = ['en', 'te', 'hi', 'ta'];
  const curIdx = order.indexOf(store.state.currentLanguage);
  const nextLang = order[(curIdx + 1) % order.length];
  store.setLanguage(nextLang);
  showToast(`Language: ${nextLang.toUpperCase()}`, 'info', 1500);
};

window.openScannerModal = () => {
  store.openModal('scanner');
};

window.openReminderModal = () => {
  store.openModal('reminder');
  speech.playChime('reminder');
  setTimeout(() => {
    speech.speak(`నమస్కారం అరవింద్ గారు. ఇది పారాసిటమాల్ 500 ఎంజీ మందు వేసుకునే సమయం. ఆహారం తర్వాత వేసుకోండి.`, 'te');
  }, 400);
};

const DEFAULT_MED_REMINDER_SMS = `Reminder: It’s time to take your scheduled medicine.
Medicine: Paracetamol 500 mg
Instruction: After food
Please take it as prescribed by your doctor.`;

window.triggerRealTwilioSms = async (toPhone = '+918106890663', bodyText = DEFAULT_MED_REMINDER_SMS) => {
  showToast(`Sending real Twilio SMS to ${toPhone}...`, 'info', 2500);
  try {
    const res = await fetch('/api/send-sms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ to: toPhone, body: bodyText })
    });
    const data = await res.json();
    if (data.sid) {
      speech.playChime('success');
      showToast(`Twilio SMS Sent! SID: ${data.sid.slice(0, 12)}... (To: ${data.to}) ✓`, 'success', 5000);
      return data;
    } else {
      showToast(`Twilio Notice: ${data.message || 'Error sending SMS'}`, 'error', 4000);
    }
  } catch (err) {
    showToast(`Network error: ${err.message}`, 'error');
  }
};

window.openSMSModal = () => {
  store.openModal('sms');
  speech.playChime('reminder');
  window.triggerRealTwilioSms('+918106890663', DEFAULT_MED_REMINDER_SMS);
};

window.openVoiceCallModal = () => {
  store.openModal('voiceCall');
  speech.playChime('ringtone');
  setTimeout(() => {
    if (window.speakCallPrompt) window.speakCallPrompt();
  }, 600);
};

window.openCalendarModal = () => {
  store.openModal('calendarPicker');
};

window.openCreateReminderModal = () => {
  store.openModal('createReminder');
};

window.openMedicineDetailsById = (medId) => {
  const med = store.state.medications.find(m => m.id === medId);
  if (med) {
    store.openMedicineDetails(med);
  }
};

window.closeActiveModal = () => {
  speech.stop();
  store.closeModal();
};

window.handleMarkTaken = (medId) => {
  store.markDoseTaken(medId);
  speech.playChime('success');
  showToast('Medication marked as TAKEN ✓', 'success');
};

window.handleDeleteMedicine = (medId) => {
  const med = store.state.medications.find(m => m.id === medId);
  const name = med ? `${med.name} ${med.strength}` : 'Medicine';
  store.deleteMedication(medId);
  speech.playChime('success');
  showToast(`🗑️ Reminder for ${name} has been deleted.`, 'info', 3000);
};

window.handleSnoozeDose = (medId) => {
  store.snoozeDose(medId);
  showToast('Medication reminder snoozed for 15 minutes ⏰', 'info');
};

window.handleUndoDose = (medId) => {
  store.undoDose(medId);
  showToast('Dose status reverted to Unconfirmed', 'info');
};

window.handleLogWater = () => {
  store.logWater();
  speech.playChime('success');
  showToast(`Logged +250ml water (Total: ${store.state.vitals.waterLiters}L) 💧`, 'success');
};

window.toggleChannel = (channelKey) => {
  store.toggleChannel(channelKey);
  const isEnabled = store.state.channels[channelKey];
  showToast(`${channelKey.toUpperCase()} reminder ${isEnabled ? 'enabled' : 'disabled'}`, 'info');
};

window.toggleHomeVoiceWave = () => {
  const container = document.getElementById('home-voice-wave-container');
  const icon = document.getElementById('home-mic-icon');
  if (container) {
    const isHidden = container.classList.contains('hidden');
    container.classList.toggle('hidden');
    if (icon) {
      icon.textContent = isHidden ? 'mic_off' : 'mic';
    }
    if (isHidden) {
      speech.playChime('reminder');
      speech.speak('మందు ఎప్పుడు వేసుకోవాలి? మీరు అడిగిన ప్రశ్నకు సమాధానం: ఉదయం అల్పాహారం తర్వాత వేసుకోవాలి.', 'te');
    } else {
      speech.stop();
    }
  }
};

// Main App Render Function
function renderApp(state) {
  const root = document.getElementById('app-root');
  if (!root) return;

  // Choose active view based on state
  let viewHtml = '';
  switch (state.activeTab) {
    case 'home':
      viewHtml = renderHomeView(state);
      break;
    case 'medicines':
      viewHtml = renderMedicinesView(state);
      break;
    case 'health':
      viewHtml = renderHealthTrackView(state);
      break;
    case 'reports':
      viewHtml = renderReportsView(state);
      break;
    case 'ai':
      viewHtml = renderAIAssistantView(state);
      break;
    case 'profile':
      viewHtml = renderProfileView(state);
      break;
    default:
      viewHtml = renderHomeView(state);
  }

  // Choose modal if active
  let modalHtml = '';
  if (state.activeModal === 'scanner') {
    modalHtml = renderPrescriptionScannerModal(state);
  } else if (state.activeModal === 'reminder') {
    modalHtml = renderMedicationReminderModal(state);
  } else if (state.activeModal === 'sms') {
    modalHtml = renderSMSExperienceModal(state);
  } else if (state.activeModal === 'voiceCall') {
    modalHtml = renderVoiceCallModal(state);
  } else if (state.activeModal === 'medDetails') {
    modalHtml = renderMedicineDetailsModal(state);
  } else if (state.activeModal === 'calendarPicker') {
    modalHtml = renderCalendarPickerModal(state);
  } else if (state.activeModal === 'createReminder') {
    modalHtml = renderCreateReminderModal(state);
  }

  root.innerHTML = `
    <!-- Top Demo Toolbar for Testing & Judge Presentations -->
    ${renderDemoControls(state)}

    <!-- Android Phone Simulator Container -->
    <div class="relative w-full max-w-[412px] h-[100dvh] sm:h-[860px] sm:max-h-[94vh] flex flex-col bg-surface sm:rounded-[44px] sm:border-[10px] sm:border-slate-900 sm:ring-1 sm:ring-slate-700/60 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden select-none">
      
      <!-- Android Hardware Camera Punch Hole & Speaker Grille -->
      <div class="hidden sm:block absolute top-2.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-slate-950 ring-1 ring-slate-800 pointer-events-none z-40"></div>
      <div class="hidden sm:block absolute top-1 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-slate-800/80 pointer-events-none z-40"></div>
      
      <!-- Subtle Side Hardware Buttons -->
      <div class="hidden sm:block android-power-button"></div>
      <div class="hidden sm:block android-volume-button"></div>

      <!-- Top Fixed Header & Status Bar -->
      ${renderHeader(state)}

      <!-- Scrollable Screen Content Container -->
      <main class="w-full flex-1 bg-surface overflow-y-auto overscroll-contain overflow-x-hidden no-scrollbar relative flex flex-col">
        ${viewHtml}
      </main>

      <!-- Bottom Fixed Navigation Dock with Gesture Bar -->
      ${renderBottomNav(state)}

      <!-- Active Modals & Overlays (Contained inside Android screen) -->
      ${modalHtml}
    </div>
  `;
}

// Subscribe to state changes
store.subscribe((state) => {
  renderApp(state);
});

// Initial render
renderApp(store.state);
