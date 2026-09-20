import { store } from '../state/store.js';
import { t } from '../utils/i18n.js';
import { speech } from '../utils/speech.js';
import { showToast } from '../components/Toast.js';

let isConfirmed = false;

export function renderPrescriptionScannerModal(state) {
  const lang = state.currentLanguage;

  return `
    <div class="absolute inset-0 z-50 flex flex-col bg-surface overflow-hidden rounded-[inherit] view-enter">
      <div class="w-full h-full bg-surface flex flex-col relative overflow-hidden">
        
        <!-- Modal Top App Bar -->
        <div class="h-14 px-4 bg-surface-container/90 backdrop-blur-md flex items-center justify-between border-b border-surface-container-high/60 shrink-0">
          <div class="flex items-center gap-2">
            <button 
              class="w-9 h-9 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container-highest active:scale-95 transition-all"
              onclick="window.closeActiveModal()"
            >
              <span class="material-symbols-outlined text-[22px]">close</span>
            </button>
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-[20px] text-primary">document_scanner</span>
              <h2 class="text-[16px] font-bold text-on-surface">${t('scannerTitle', lang)}</h2>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[11px] font-bold">
            Multimodal AI
          </span>
        </div>

        <!-- Scrollable Modal Content -->
        <div class="p-4 space-y-4 overflow-y-auto flex-1 no-scrollbar">
          
          <!-- Live Scanning Viewport (Reticles, Paper Simulation & Laser Beam) -->
          <div class="relative w-full rounded-2xl overflow-hidden bg-surface-container-highest shadow-md min-h-[250px] flex flex-col justify-between p-3 select-none border border-primary/30">
            <!-- Simulated Doctor Prescription Sheet -->
            <div class="absolute inset-0 opacity-90 mix-blend-multiply flex flex-col justify-between p-4 bg-surface-container-lowest">
              <div class="flex justify-between items-start">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary font-bold text-[16px]">
                    Rx
                  </div>
                  <div>
                    <div class="h-3 w-28 bg-on-surface-variant/20 rounded mb-1"></div>
                    <div class="h-2 w-16 bg-on-surface-variant/15 rounded"></div>
                  </div>
                </div>
                <div class="h-2.5 w-14 bg-on-surface-variant/20 rounded"></div>
              </div>

              <!-- AI Detection Overlay Boxes -->
              <div class="space-y-2.5 my-auto">
                <div class="h-2 w-36 bg-on-surface-variant/15 rounded"></div>
                
                <!-- Box 1: Medicine -->
                <div class="relative p-2 rounded-lg bg-primary-fixed/50 border border-primary/40 transition-all duration-300">
                  <div class="flex items-center justify-between">
                    <span class="text-[13px] font-extrabold text-on-primary-fixed">Rx: Tab Paracetamol 500mg</span>
                    <span class="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-primary text-on-primary">99.4% Match</span>
                  </div>
                  <div class="absolute -top-1 -left-1 w-2 h-2 bg-primary rounded-full"></div>
                  <div class="absolute -bottom-1 -right-1 w-2 h-2 bg-primary rounded-full"></div>
                </div>

                <!-- Box 2: Timing -->
                <div class="relative p-2 rounded-lg bg-secondary-fixed/50 border border-secondary/40 transition-all duration-300">
                  <div class="flex items-center justify-between">
                    <span class="text-[12px] font-bold text-on-secondary-fixed">1 Tab BD - After Food x 5 days</span>
                    <span class="material-symbols-outlined text-secondary text-[16px]">auto_awesome</span>
                  </div>
                  <div class="absolute -top-1 -left-1 w-2 h-2 bg-secondary rounded-full"></div>
                  <div class="absolute -bottom-1 -right-1 w-2 h-2 bg-secondary rounded-full"></div>
                </div>

                <div class="h-2 w-1/2 bg-on-surface-variant/15 rounded"></div>
              </div>

              <div class="flex justify-end pt-1">
                <div class="h-5 w-20 bg-on-surface-variant/20 rounded-md rotate-[-4deg]"></div>
              </div>
            </div>

            <!-- Animated Laser Scanner Line -->
            <div class="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_16px_4px_rgba(0,123,185,0.8)] animate-laser pointer-events-none z-10"></div>

            <!-- Framing Reticles -->
            <div class="relative z-20 flex justify-between pointer-events-none">
              <div class="w-6 h-6 rounded-tl-xl border-t-2 border-l-2 border-primary"></div>
              <div class="w-6 h-6 rounded-tr-xl border-t-2 border-r-2 border-primary"></div>
            </div>

            <!-- Dynamic AI OCR Status Pill -->
            <div class="relative z-20 mx-auto my-auto py-1 px-3 rounded-full bg-surface/90 backdrop-blur-md shadow-lg flex items-center gap-2 border border-outline-variant/30">
              <span class="w-2 h-2 rounded-full bg-tertiary animate-ping"></span>
              <span class="text-[11px] text-on-surface font-bold tracking-wide" id="ocrStatusModalText">OCR extracting characters...</span>
            </div>

            <div class="relative z-20 flex justify-between pointer-events-none">
              <div class="w-6 h-6 rounded-bl-xl border-b-2 border-l-2 border-primary"></div>
              <div class="w-6 h-6 rounded-br-xl border-b-2 border-r-2 border-primary"></div>
            </div>
          </div>

          <!-- Extracted Details (Editable) -->
          <div class="bg-surface-container-lowest rounded-2xl p-4 shadow-sm border border-surface-container-high/60 space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <h3 class="text-[15px] font-bold text-on-surface">${t('prescriptionDetails', lang)}</h3>
                <p class="text-[10px] text-on-surface-variant">${t('extractedViaVision', lang)}</p>
              </div>
              <div class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-tertiary-container/15 text-tertiary text-[11px] font-bold">
                <span class="material-symbols-outlined text-[14px]">verified</span>
                <span>${t('aiVerified', lang)}</span>
              </div>
            </div>

            <!-- Editable Fields -->
            <div class="space-y-2">
              <!-- Name -->
              <div class="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between gap-2 border border-surface-container-high/40">
                <div class="flex items-center gap-2 min-w-0 flex-1">
                  <div class="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-[18px]">medication</span>
                  </div>
                  <div class="min-w-0 flex-1">
                    <span class="text-[10px] text-on-surface-variant uppercase tracking-wider block font-bold">${t('medName', lang)}</span>
                    <input class="text-[14px] font-bold text-on-surface bg-transparent focus:outline-none w-full" id="edit-med-name" value="Paracetamol" />
                  </div>
                </div>
                <span class="material-symbols-outlined text-[16px] text-primary">edit</span>
              </div>

              <!-- Dosage -->
              <div class="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between gap-2 border border-surface-container-high/40">
                <div class="flex items-center gap-2 min-w-0 flex-1">
                  <div class="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-[18px]">scale</span>
                  </div>
                  <div class="min-w-0 flex-1">
                    <span class="text-[10px] text-on-surface-variant uppercase tracking-wider block font-bold">${t('dosageStrength', lang)}</span>
                    <input class="text-[14px] font-bold text-on-surface bg-transparent focus:outline-none w-full" id="edit-med-dosage" value="500 mg" />
                  </div>
                </div>
                <span class="material-symbols-outlined text-[16px] text-secondary">edit</span>
              </div>

              <!-- Frequency -->
              <div class="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between gap-2 border border-surface-container-high/40">
                <div class="flex items-center gap-2 min-w-0 flex-1">
                  <div class="w-8 h-8 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-[18px]">schedule</span>
                  </div>
                  <div class="min-w-0 flex-1">
                    <span class="text-[10px] text-on-surface-variant uppercase tracking-wider block font-bold">${t('frequency', lang)}</span>
                    <span class="text-[13px] font-bold text-on-surface">2 times / day (BD)</span>
                  </div>
                </div>
                <span class="px-2 py-0.5 rounded bg-surface text-secondary text-[11px] font-bold">BD</span>
              </div>

              <!-- Duration -->
              <div class="p-2.5 rounded-xl bg-surface-container-low flex items-center justify-between gap-2 border border-surface-container-high/40">
                <div class="flex items-center gap-2 min-w-0 flex-1">
                  <div class="w-8 h-8 rounded-full bg-surface-container text-on-surface-variant flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-[18px]">date_range</span>
                  </div>
                  <div class="min-w-0 flex-1">
                    <span class="text-[10px] text-on-surface-variant uppercase tracking-wider block font-bold">${t('duration', lang)}</span>
                    <span class="text-[13px] font-bold text-on-surface">5 days (10 tablets total)</span>
                  </div>
                </div>
                <span class="material-symbols-outlined text-[18px] text-tertiary">check_circle</span>
              </div>

              <!-- Instruction -->
              <div class="p-2.5 rounded-xl bg-surface-container-low flex items-center gap-2 border border-surface-container-high/40">
                <div class="w-8 h-8 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-[18px]">restaurant</span>
                </div>
                <div class="min-w-0 flex-1">
                  <span class="text-[10px] text-on-surface-variant uppercase tracking-wider block font-bold">${t('specialInstructions', lang)}</span>
                  <span class="text-[13px] font-bold text-tertiary">After food (ఆహారం తర్వాత)</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Post-confirmation Success Card -->
          ${isConfirmed ? `
            <div class="w-full bg-gradient-to-br from-tertiary-fixed/50 via-surface-container to-surface-container-high rounded-2xl p-4 shadow-md space-y-2 border-2 border-tertiary">
              <div class="flex items-center gap-2.5">
                <div class="w-10 h-10 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center shadow-md shrink-0">
                  <span class="material-symbols-outlined text-[22px]">check</span>
                </div>
                <div>
                  <h3 class="text-[15px] font-bold text-on-surface">✓ ${t('prescriptionConfirmed', lang)}</h3>
                  <p class="text-[11px] text-tertiary font-bold">Active in Telugu &amp; English Reminders</p>
                </div>
              </div>
              <p class="text-[12px] text-on-surface-variant leading-snug">
                ${t('scheduleCreatedDesc', lang)}
              </p>
              <div class="p-2 rounded-xl bg-surface/90 flex items-center justify-between">
                <div class="flex items-center gap-1.5 min-w-0">
                  <span class="material-symbols-outlined text-secondary text-[16px] animate-pulse">volume_up</span>
                  <span class="text-[11px] text-on-surface truncate">First dose: <strong>8:30 PM (రాత్రి భోజనం తర్వాత)</strong></span>
                </div>
                <span class="material-symbols-outlined text-tertiary text-[18px]">notifications_active</span>
              </div>
            </div>
          ` : ''}

          <!-- Modal Action Triggers -->
          <div class="space-y-2 pt-1">
            <button 
              class="w-full h-12 rounded-full bg-primary text-on-primary font-bold text-[14px] flex items-center justify-center gap-2 shadow-md hover:bg-primary-container active:scale-98 transition-all"
              type="button"
              onclick="window.handleConfirmPrescription()"
            >
              <span class="material-symbols-outlined text-[18px]">check_circle</span>
              <span>${t('confirmCreateSchedule', lang)}</span>
            </button>

            <button 
              class="w-full h-11 rounded-full bg-surface-container-high text-primary font-bold text-[13px] flex items-center justify-center gap-1.5 hover:bg-surface-container-highest active:scale-98 transition-all"
              type="button"
              onclick="document.getElementById('edit-med-name').focus()"
            >
              <span class="material-symbols-outlined text-[16px]">edit</span>
              <span>${t('editDetails', lang)}</span>
            </button>
          </div>

          <!-- Clinical Safety Notice -->
          <div class="p-3 rounded-xl bg-surface-container text-on-surface-variant flex items-start gap-2 border border-surface-container-high/60">
            <span class="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">verified_user</span>
            <p class="text-[10px] leading-relaxed">
              <strong class="font-bold text-on-surface">${t('safetyNotice', lang)}</strong> Always verify with your original printed prescription before consuming medication.
            </p>
          </div>

        </div>
      </div>
    </div>
  `;
}

// Rotate OCR status stages
setInterval(() => {
  const el = document.getElementById('ocrStatusModalText');
  if (el) {
    const stages = [
      'Scanning prescription...',
      'OCR extracting characters...',
      'AI medical entity understanding...',
      'Verified with doctor signature ✓'
    ];
    const curIdx = stages.indexOf(el.textContent);
    el.textContent = stages[(curIdx + 1) % stages.length];
  }
}, 2400);

window.handleConfirmPrescription = () => {
  const nameInput = document.getElementById('edit-med-name');
  const doseInput = document.getElementById('edit-med-dosage');
  
  const medName = nameInput ? nameInput.value : 'Paracetamol';
  const medDose = doseInput ? doseInput.value : '500 mg';

  store.addPrescriptionMedicine({
    name: medName,
    strength: medDose,
    time: '08:30 PM',
    slot: 'Dinner',
    instruction: 'After food'
  });

  isConfirmed = true;
  speech.playChime('success');
  store.notify();

  showToast(`Prescription confirmed: ${medName} ${medDose} scheduled ✓`, 'success');

  // Speak announcement in Telugu & English
  setTimeout(() => {
    speech.speak(`పారాసిటమాల్ 500 ఎంజీ షెడ్యూల్ సృష్టించబడింది. రాత్రి భోజనం తర్వాత వేసుకోవాలి.`, 'te');
  }, 500);
};
