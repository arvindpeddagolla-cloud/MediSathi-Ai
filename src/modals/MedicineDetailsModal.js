import { store } from '../state/store.js';
import { t } from '../utils/i18n.js';
import { speech } from '../utils/speech.js';
import { showToast } from '../components/Toast.js';

export function renderMedicineDetailsModal(state) {
  const lang = state.currentLanguage;
  const med = state.selectedMedicineForDetails || state.medications[0];
  const isDone = med.status === 'taken';

  return `
    <div class="absolute inset-0 z-50 flex flex-col bg-surface rounded-[inherit] overflow-hidden view-enter">
      <div class="w-full h-full bg-surface flex flex-col relative overflow-hidden">
        
        <!-- Header -->
        <div class="h-14 px-4 bg-surface-container flex items-center justify-between border-b border-surface-container-high/60 shrink-0">
          <div class="flex items-center gap-2">
            <button 
              class="w-8 h-8 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container-highest active:scale-95"
              onclick="window.closeActiveModal()"
            >
              <span class="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <h3 class="text-[15px] font-bold text-on-surface truncate">Medicine Details</h3>
          </div>
          <button class="text-on-surface-variant hover:text-on-surface" onclick="window.closeActiveModal()">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <!-- Scrollable Details -->
        <div class="p-4 space-y-3.5 overflow-y-auto flex-1 no-scrollbar">
          
          <!-- Tablet Photo Card -->
          <div class="w-full h-40 rounded-2xl bg-surface-container-low overflow-hidden relative border border-surface-container-high/60 flex items-center justify-center p-2">
            <img class="w-full h-full object-cover rounded-xl" src="${med.imageUrl}" alt="${med.name}">
            <div class="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold">
              ${med.slot} • ${med.time}
            </div>
            <span class="absolute top-2 right-2 px-2.5 py-0.5 rounded-full ${isDone ? 'bg-tertiary text-white' : 'bg-primary text-white'} text-[10px] font-bold shadow-xs">
              ${isDone ? '✓ Taken' : 'Scheduled'}
            </span>
          </div>

          <!-- Basic Info -->
          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <h2 class="text-[20px] font-extrabold text-on-surface">${med.name} ${med.strength}</h2>
              <span class="text-[12px] font-bold text-secondary">${med.brand || 'Prescribed Drug'}</span>
            </div>
            <p class="text-[12px] text-on-surface-variant font-medium">
              ${lang === 'te' ? (med.purposeTe || med.purpose) : med.purpose}
            </p>
          </div>

          <!-- Doctor & Regimen Grid -->
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high/40 space-y-0.5">
              <span class="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">Food Instruction</span>
              <span class="text-[12px] font-bold text-tertiary block">
                ${lang === 'te' ? med.instructionTe : (lang === 'hi' ? med.instructionHi : (lang === 'ta' ? med.instructionTa : med.instruction))}
              </span>
            </div>

            <div class="p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high/40 space-y-0.5">
              <span class="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">Course Duration</span>
              <span class="text-[12px] font-bold text-on-surface block">5 Days Regular</span>
            </div>
          </div>

          <!-- Prescribed By Doctor -->
          <div class="p-3 rounded-xl bg-surface-container-low border border-surface-container-high/40 space-y-1">
            <div class="flex items-center gap-1.5 text-primary font-bold text-[11px]">
              <span class="material-symbols-outlined text-[16px]">stethoscope</span>
              <span>Prescribing Physician</span>
            </div>
            <p class="text-[12px] text-on-surface font-semibold">${med.doctor || 'Dr. K. S. Rao, MD (Apollo Hospital)'}</p>
          </div>

          <!-- Voice Instruction Button -->
          <button 
            class="w-full py-2.5 px-3 rounded-xl bg-secondary-container text-on-secondary-container font-bold text-[12px] flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all"
            onclick="window.playMedicineVoiceInstruction('${med.name}', '${med.strength}', '${med.instructionTe}')"
          >
            <span class="material-symbols-outlined text-[17px]">volume_up</span>
            <span>Listen Instructions in Telugu / English</span>
          </button>

          <!-- Primary Actions -->
          <div class="pt-1 space-y-2">
            ${!isDone ? `
              <button 
                class="w-full h-11 rounded-xl bg-tertiary text-on-tertiary font-bold text-[13px] flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all hover:bg-tertiary-container"
                onclick="window.handleMarkTaken('${med.id}'); window.closeActiveModal();"
              >
                <span class="material-symbols-outlined text-[18px]">check_circle</span>
                <span>Mark as TAKEN (వేసుకున్నాను)</span>
              </button>
            ` : `
              <button 
                class="w-full h-11 rounded-xl bg-surface-container-high text-primary font-bold text-[13px] flex items-center justify-center gap-1.5 active:scale-98 transition-all"
                onclick="window.handleUndoDose('${med.id}'); window.closeActiveModal();"
              >
                <span class="material-symbols-outlined text-[18px]">undo</span>
                <span>Undo / Mark as Unconfirmed</span>
              </button>
            `}
          </div>

        </div>

      </div>
    </div>
  `;
}

window.playMedicineVoiceInstruction = (name, strength, instructionTe) => {
  speech.playChime('reminder');
  speech.speak(`${name} ${strength}. ${instructionTe || 'ఆహారం తర్వాత గోరువెచ్చని నీటితో తీసుకోవాలి.'}`, 'te');
};
