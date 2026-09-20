import { store } from '../state/store.js';
import { t } from '../utils/i18n.js';
import { speech } from '../utils/speech.js';
import { showToast } from '../components/Toast.js';

export function renderMedicationReminderModal(state) {
  const lang = state.currentLanguage;
  const med = state.selectedMedicineForDetails || state.medications[0];

  return `
    <div class="absolute inset-0 z-50 flex flex-col items-center justify-center p-3 bg-black/80 backdrop-blur-md rounded-[inherit] overflow-y-auto no-scrollbar view-enter">
      <div class="w-full max-w-sm bg-surface rounded-3xl overflow-hidden shadow-2xl border-2 border-primary flex flex-col relative my-auto">
        
        <!-- Header with Alarm Glow & Close Button -->
        <div class="p-4 bg-gradient-to-br from-primary to-primary-container text-on-primary text-center relative overflow-hidden">
          <button 
            class="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center active:scale-95 transition-all z-20"
            onclick="window.closeActiveModal()"
            title="Dismiss"
          >
            <span class="material-symbols-outlined text-[16px]">close</span>
          </button>

          <div class="absolute -right-8 -top-8 w-24 h-24 bg-white/20 rounded-full blur-xl pointer-events-none"></div>
          
          <div class="w-12 h-12 mx-auto mb-1.5 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shadow-inner border border-white/20">
            <span class="material-symbols-outlined text-[28px] animate-bounce">alarm</span>
          </div>

          <span class="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-extrabold uppercase tracking-wider">
            Medication Reminder • ${med.time}
          </span>
          <h2 class="text-[19px] font-extrabold mt-0.5 leading-tight">Time for Your Medicine</h2>
          <p class="text-[11px] text-on-primary/85">మందు వేసుకునే సమయం అయింది</p>
        </div>

        <!-- Medicine Information & Live Controls -->
        <div class="p-3.5 space-y-3 bg-surface">
          <!-- Tablet Info Card -->
          <div class="flex items-center gap-2.5 p-2.5 rounded-2xl bg-surface-container-low border border-surface-container-high/60">
            <div class="w-11 h-11 rounded-xl bg-surface-container-highest flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-[24px] text-primary">pill</span>
            </div>
            <div class="min-w-0 flex-1">
              <h3 class="text-[16px] font-extrabold text-on-surface leading-tight">${med.name} ${med.strength}</h3>
              <p class="text-[11px] text-primary font-bold">1 Dose • ${med.instruction} (${lang === 'te' ? med.instructionTe : 'ఆహారం తర్వాత'})</p>
            </div>
          </div>

          <!-- Multilingual Voice Waveform Simulator -->
          <div class="p-2.5 rounded-2xl bg-surface-container flex flex-col space-y-1.5 border border-surface-container-high/60">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5 text-secondary font-bold text-[11px]">
                <span class="material-symbols-outlined text-[15px]">graphic_eq</span>
                <span>Voice Announcement</span>
              </div>
              <span class="px-2 py-0.2 rounded bg-secondary-container text-on-secondary-container text-[9px] font-bold">
                Telugu / English
              </span>
            </div>

            <div class="flex items-center justify-center gap-1.5 h-7 bg-surface-container-lowest rounded-xl px-3 border border-outline-variant/30">
              <span class="w-1 bg-secondary rounded-full h-3 wave-bar-1"></span>
              <span class="w-1 bg-secondary rounded-full h-5 wave-bar-2"></span>
              <span class="w-1 bg-secondary rounded-full h-3 wave-bar-3"></span>
              <span class="w-1 bg-secondary rounded-full h-6 wave-bar-4"></span>
              <span class="w-1 bg-secondary rounded-full h-4 wave-bar-5"></span>
              <span class="w-1 bg-secondary rounded-full h-3 wave-bar-6"></span>
              <span class="w-1 bg-secondary rounded-full h-5 wave-bar-2"></span>
              <span class="w-1 bg-secondary rounded-full h-3 wave-bar-4"></span>
            </div>

            <button 
              class="text-[11px] text-primary font-bold flex items-center justify-center gap-1 hover:underline pt-0.5"
              onclick="window.playReminderAudio('${med.name}', '${med.strength}', '${med.instructionTe}')"
            >
              <span class="material-symbols-outlined text-[14px]">volume_up</span>
              <span>Replay Telugu / English Voice</span>
            </button>
          </div>

          <!-- Active Delivery Channels (Interactive triggers) -->
          <div class="flex items-center justify-around text-[10px] text-on-surface-variant font-bold p-1 bg-surface-container-low rounded-xl border border-surface-container-high/40">
            <span class="flex items-center gap-1 text-tertiary">
              <span class="material-symbols-outlined text-[13px]">smartphone</span> App Alert
            </span>
            <button class="flex items-center gap-1 text-primary hover:underline cursor-pointer" onclick="window.triggerMedicineReminder('${med.id}')">
              <span class="material-symbols-outlined text-[13px]">sms</span> SMS Trigger
            </button>
            <button class="flex items-center gap-1 text-secondary hover:underline cursor-pointer" onclick="window.openVoiceCallModal()">
              <span class="material-symbols-outlined text-[13px]">ring_volume</span> Voice Call
            </button>
          </div>

          <!-- Action Buttons (TAKEN vs REMIND ME LATER) -->
          <div class="space-y-2 pt-0.5">
            <button 
              class="w-full h-11 rounded-xl bg-tertiary text-on-tertiary font-bold text-[13px] flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all hover:bg-tertiary-container"
              onclick="window.handleReminderTaken('${med.id}')"
            >
              <span class="material-symbols-outlined text-[18px]">check_circle</span>
              <span>TAKEN (వేసుకున్నాను)</span>
            </button>

            <button 
              class="w-full h-10 rounded-xl bg-surface-container-highest text-on-surface font-bold text-[12px] flex items-center justify-center gap-1.5 active:scale-98 transition-all hover:bg-surface-variant"
              onclick="window.handleReminderSnooze('${med.id}')"
            >
              <span class="material-symbols-outlined text-[16px]">schedule</span>
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
  showToast('Medication dose logged as TAKEN ✓', 'success');
};

window.handleReminderSnooze = (medId) => {
  store.snoozeDose(medId);
  store.closeModal();
  showToast('Reminder snoozed for 15 minutes ⏰', 'info');
};

window.playReminderAudio = (medName, strength, instructionTe) => {
  speech.speak(`నమస్కారం అరవింద్ గారు. ఇది ${medName || 'పారాసిటమాల్'} ${strength || '500 ఎంజీ'} మందు వేసుకునే సమయం. ${instructionTe || 'ఆహారం తర్వాత వేసుకోండి'}.`, 'te');
};
