import { store } from '../state/store.js';
import { t } from '../utils/i18n.js';
import { speech } from '../utils/speech.js';
import { showToast } from '../components/Toast.js';

export function renderMedicationReminderModal(state) {
  const lang = state.currentLanguage;
  const med = state.medications[0]; // Paracetamol

  return `
    <div class="absolute inset-0 z-50 flex flex-col items-center justify-center p-3 bg-black/80 backdrop-blur-md rounded-[inherit] overflow-y-auto view-enter">
      <div class="w-full bg-surface rounded-3xl overflow-hidden shadow-2xl border-2 border-primary flex flex-col relative">
        
        <!-- Header with Alarm Glow -->
        <div class="p-4 bg-gradient-to-br from-primary to-primary-container text-on-primary text-center relative overflow-hidden">
          <div class="absolute -right-8 -top-8 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
          
          <div class="w-14 h-14 mx-auto mb-2 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/20">
            <span class="material-symbols-outlined text-[32px] animate-bounce">alarm</span>
          </div>

          <span class="px-3 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-extrabold uppercase tracking-wider">
            Medication Reminder • 09:00 AM
          </span>
          <h2 class="text-[20px] font-extrabold mt-1">Time for Your Medicine</h2>
          <p class="text-[12px] text-on-primary/80">మందు వేసుకునే సమయం అయింది</p>
        </div>

        <!-- Medicine Information -->
        <div class="p-4 space-y-3.5 bg-surface">
          <div class="flex items-center gap-3 p-3 rounded-2xl bg-surface-container-low border border-surface-container-high/60">
            <div class="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-[28px] text-primary">pill</span>
            </div>
            <div class="min-w-0 flex-1">
              <h3 class="text-[17px] font-extrabold text-on-surface">${med.name} ${med.strength}</h3>
              <p class="text-[12px] text-primary font-bold">1 Tablet • ${t('afterFood', lang)} (ఆహారం తర్వాత)</p>
            </div>
          </div>

          <!-- Multilingual Voice Waveform Simulator -->
          <div class="p-3 rounded-2xl bg-surface-container flex flex-col space-y-2 border border-surface-container-high/60">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5 text-secondary font-bold text-[12px]">
                <span class="material-symbols-outlined text-[17px]">graphic_eq</span>
                <span>Multilingual Voice Announcement</span>
              </div>
              <span class="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container text-[10px] font-bold">
                Telugu / English
              </span>
            </div>

            <div class="flex items-center justify-center gap-1.5 h-8 bg-surface-container-lowest rounded-xl px-3 border border-outline-variant/30">
              <span class="w-1 bg-secondary rounded-full h-3 wave-bar-1"></span>
              <span class="w-1 bg-secondary rounded-full h-6 wave-bar-2"></span>
              <span class="w-1 bg-secondary rounded-full h-4 wave-bar-3"></span>
              <span class="w-1 bg-secondary rounded-full h-7 wave-bar-4"></span>
              <span class="w-1 bg-secondary rounded-full h-5 wave-bar-5"></span>
              <span class="w-1 bg-secondary rounded-full h-3 wave-bar-6"></span>
              <span class="w-1 bg-secondary rounded-full h-6 wave-bar-2"></span>
              <span class="w-1 bg-secondary rounded-full h-4 wave-bar-4"></span>
            </div>

            <button 
              class="text-xs text-primary font-bold flex items-center justify-center gap-1 hover:underline pt-0.5"
              onclick="window.playReminderAudio('${med.name}')"
            >
              <span class="material-symbols-outlined text-[15px]">volume_up</span>
              <span>Replay Voice Reminder</span>
            </button>
          </div>

          <!-- Delivery Mode Badges -->
          <div class="flex items-center justify-between text-[11px] text-on-surface-variant font-medium px-1">
            <span class="flex items-center gap-1 text-tertiary font-bold">
              <span class="material-symbols-outlined text-[14px]">smartphone</span> App
            </span>
            <span class="flex items-center gap-1 text-tertiary font-bold">
              <span class="material-symbols-outlined text-[14px]">sms</span> SMS
            </span>
            <span class="flex items-center gap-1 text-tertiary font-bold">
              <span class="material-symbols-outlined text-[14px]">ring_volume</span> Voice Call
            </span>
          </div>

          <!-- Action Buttons (TAKEN vs REMIND ME LATER) -->
          <div class="space-y-2 pt-1">
            <button 
              class="w-full h-12 rounded-xl bg-tertiary text-on-tertiary font-bold text-[14px] flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all hover:bg-tertiary-container"
              onclick="window.handleReminderTaken('${med.id}')"
            >
              <span class="material-symbols-outlined text-[20px]">check_circle</span>
              <span>TAKEN (వేసుకున్నాను)</span>
            </button>

            <button 
              class="w-full h-11 rounded-xl bg-surface-container-highest text-on-surface font-bold text-[13px] flex items-center justify-center gap-1.5 active:scale-98 transition-all hover:bg-surface-variant"
              onclick="window.handleReminderSnooze('${med.id}')"
            >
              <span class="material-symbols-outlined text-[18px]">schedule</span>
              <span>REMIND ME LATER (15m Snooze)</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  `;
}

window.handleReminderTaken = (medId) => {
  store.markDoseTaken(medId);
  speech.playChime('success');
  store.closeModal();
  showToast('Paracetamol 500mg logged as TAKEN ✓', 'success');
};

window.handleReminderSnooze = (medId) => {
  store.snoozeDose(medId);
  store.closeModal();
  showToast('Reminder snoozed for 15 minutes ⏰', 'info');
};

window.playReminderAudio = (medName) => {
  speech.speak(`నమస్కారం అరవింద్ గారు. ఇది పారాసిటమాల్ 500 ఎంజీ మందు వేసుకునే సమయం. ఆహారం తర్వాత వేసుకోండి.`, 'te');
};
