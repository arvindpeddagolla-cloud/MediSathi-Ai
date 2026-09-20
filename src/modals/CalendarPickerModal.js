import { store } from '../state/store.js';
import { t } from '../utils/i18n.js';
import { speech } from '../utils/speech.js';
import { showToast } from '../components/Toast.js';
import { triggerMedicineReminder } from '../utils/scheduler.js';

let isAddFormOpen = false;

export function renderCalendarPickerModal(state) {
  const lang = state.currentLanguage;
  const currentSelected = state.calendar.selectedDate;
  const meds = state.medications;

  // September 2026 days (30 days, 1st starts on Tuesday)
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  return `
    <div class="absolute inset-0 z-50 flex flex-col bg-surface rounded-[inherit] overflow-hidden view-enter select-none">
      <div class="w-full h-full bg-surface flex flex-col relative overflow-hidden">
        
        <!-- Header -->
        <div class="h-14 px-4 bg-surface-container flex items-center justify-between border-b border-surface-container-high/60 shrink-0">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px] text-primary">calendar_month</span>
            <div>
              <h3 class="text-[15px] font-bold text-on-surface leading-tight">Calendar &amp; Schedule Maker</h3>
              <span class="text-[10px] text-on-surface-variant">September 2026 • Daily Health Plan</span>
            </div>
          </div>
          <button class="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest active:scale-95" onclick="window.closeActiveModal()">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <!-- Scrollable Month Grid & Day Schedule Maker -->
        <div class="p-4 space-y-3.5 flex-1 overflow-y-auto no-scrollbar">
          
          <!-- Month Header & Toggle Add Schedule -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1.5">
              <span class="text-[14px] font-extrabold text-on-surface">September 2026</span>
              <span class="px-2 py-0.2 rounded-full bg-primary-fixed text-primary text-[10px] font-bold">Selected: Sep ${currentSelected}</span>
            </div>
            
            <button 
              class="px-2.5 py-1 rounded-xl ${isAddFormOpen ? 'bg-secondary text-white' : 'bg-primary text-on-primary'} font-bold text-[11px] flex items-center gap-1 shadow-xs active:scale-95 transition-all"
              onclick="window.toggleCalendarAddForm()"
            >
              <span class="material-symbols-outlined text-[14px]">${isAddFormOpen ? 'close' : 'add'}</span>
              <span>${isAddFormOpen ? 'Hide Form' : '+ Add Medicine'}</span>
            </button>
          </div>

          <!-- Weekday Labels -->
          <div class="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-on-surface-variant">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <!-- Calendar Days Grid (30 Days) -->
          <div class="grid grid-cols-7 gap-1.5 text-center">
            <!-- Offset for September 1 (starts on Tuesday = 2 empty cells) -->
            <div></div>
            <div></div>

            ${daysInMonth.map(day => {
              const isToday = day === 15;
              const isSelected = day === currentSelected;
              const isPast = day < 15;
              
              return `
                <button 
                  class="h-10 rounded-xl flex flex-col items-center justify-center text-xs font-bold transition-all relative ${
                    isSelected ? 'bg-primary text-white shadow-md ring-2 ring-primary-fixed scale-105' : 
                    (isToday ? 'bg-secondary-container text-on-secondary-container font-extrabold ring-1 ring-secondary/40' : 
                    (isPast ? 'bg-surface-container-lowest text-on-surface hover:bg-surface-container' : 'bg-surface-container text-on-surface-variant opacity-80 hover:opacity-100'))
                  }"
                  onclick="window.handleSelectCalendarDay(${day})"
                >
                  <span>${day}</span>
                  ${isPast ? `
                    <span class="w-1.5 h-1.5 rounded-full bg-tertiary mt-0.5"></span>
                  ` : (isToday ? `
                    <span class="w-1.5 h-1.5 rounded-full bg-primary mt-0.5 animate-pulse"></span>
                  ` : `
                    <span class="w-1 h-1 rounded-full bg-outline-variant mt-0.5"></span>
                  `)}
                </button>
              `;
            }).join('')}
          </div>

          <!-- Interactive Add Medicine Schedule Form -->
          ${isAddFormOpen ? `
            <div class="p-3.5 rounded-2xl bg-surface-container-lowest border-2 border-primary/40 shadow-md space-y-3 view-enter">
              <div class="flex items-center justify-between border-b border-surface-container-high/60 pb-1.5">
                <div class="flex items-center gap-1.5 text-primary font-bold text-[13px]">
                  <span class="material-symbols-outlined text-[17px]">medication_liquid</span>
                  <span>Add Medicine to Schedule</span>
                </div>
                <span class="text-[10px] text-secondary font-bold">Sep ${currentSelected}, 2026</span>
              </div>

              <!-- Medicine Name & Strength -->
              <div class="grid grid-cols-2 gap-2">
                <div class="space-y-0.5">
                  <label class="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">Medicine Name</label>
                  <input 
                    id="new-med-name" 
                    class="w-full px-2.5 py-1.5 rounded-xl bg-surface-container-low border border-surface-container-high text-[12px] font-bold text-on-surface focus:outline-none focus:border-primary" 
                    placeholder="e.g. Amoxicillin" 
                    value="Amoxicillin"
                  />
                </div>
                <div class="space-y-0.5">
                  <label class="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">Strength / Dose</label>
                  <input 
                    id="new-med-strength" 
                    class="w-full px-2.5 py-1.5 rounded-xl bg-surface-container-low border border-surface-container-high text-[12px] font-bold text-on-surface focus:outline-none focus:border-primary" 
                    placeholder="e.g. 500 mg" 
                    value="500 mg"
                  />
                </div>
              </div>

              <!-- Time & Slot -->
              <div class="grid grid-cols-2 gap-2">
                <div class="space-y-0.5">
                  <label class="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">Time Slot</label>
                  <select 
                    id="new-med-slot" 
                    class="w-full px-2.5 py-1.5 rounded-xl bg-surface-container-low border border-surface-container-high text-[12px] font-bold text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="Morning">Morning (09:00 AM)</option>
                    <option value="Lunch">Lunch (02:00 PM)</option>
                    <option value="Dinner">Dinner (08:30 PM)</option>
                    <option value="Night">Bedtime (10:00 PM)</option>
                  </select>
                </div>
                <div class="space-y-0.5">
                  <label class="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">Food Instruction</label>
                  <select 
                    id="new-med-instruction" 
                    class="w-full px-2.5 py-1.5 rounded-xl bg-surface-container-low border border-surface-container-high text-[12px] font-bold text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="After food">After food (ఆహారం తర్వాత)</option>
                    <option value="Before food">Before food (ఆహారానికి ముందు)</option>
                    <option value="With food">With food (భోజనంతో)</option>
                  </select>
                </div>
              </div>

              <!-- Duration Selector -->
              <div class="space-y-0.5">
                <label class="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">Duration</label>
                <div class="grid grid-cols-4 gap-1.5">
                  <button type="button" class="py-1 rounded-lg bg-surface-container text-on-surface text-[11px] font-bold hover:bg-primary-fixed focus:bg-primary focus:text-white" onclick="document.getElementById('new-med-duration').value = '5 Days'">5 Days</button>
                  <button type="button" class="py-1 rounded-lg bg-surface-container text-on-surface text-[11px] font-bold hover:bg-primary-fixed focus:bg-primary focus:text-white" onclick="document.getElementById('new-med-duration').value = '10 Days'">10 Days</button>
                  <button type="button" class="py-1 rounded-lg bg-surface-container text-on-surface text-[11px] font-bold hover:bg-primary-fixed focus:bg-primary focus:text-white" onclick="document.getElementById('new-med-duration').value = '30 Days'">30 Days</button>
                  <input id="new-med-duration" value="5 Days" class="py-1 px-1.5 text-center rounded-lg bg-surface-container-low border border-surface-container-high text-[11px] font-bold text-on-surface" />
                </div>
              </div>

              <!-- Submit Button -->
              <button 
                type="button" 
                class="w-full h-11 rounded-xl bg-primary text-on-primary font-bold text-[13px] flex items-center justify-center gap-1.5 shadow-md active:scale-98 transition-all hover:bg-primary-container"
                onclick="window.handleSaveCalendarMedicine()"
              >
                <span class="material-symbols-outlined text-[17px]">save</span>
                <span>Save Medicine to Calendar Schedule</span>
              </button>
            </div>
          ` : ''}

          <!-- Scheduled Medicines for Selected Date (Sep {currentSelected}) -->
          <div class="p-3.5 rounded-2xl bg-surface-container-lowest border border-surface-container-high/60 space-y-2.5">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-[18px] text-primary">schedule</span>
                <h4 class="text-[13px] font-bold text-on-surface">Schedule for Sep ${currentSelected}, 2026</h4>
              </div>
              <span class="text-[10px] text-tertiary font-bold">${meds.length} Medicines</span>
            </div>

            <div class="space-y-2">
              ${meds.map(m => `
                <div class="p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high/40 flex items-center justify-between gap-2">
                  <div class="flex items-center gap-2 min-w-0 flex-1">
                    <div class="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                      <span class="material-symbols-outlined text-[16px]">pill</span>
                    </div>
                    <div class="min-w-0 flex-1">
                      <span class="text-[12px] font-bold text-on-surface block truncate">${m.name} ${m.strength}</span>
                      <span class="text-[10px] text-on-surface-variant font-medium">${m.time} • ${m.instruction}</span>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-1.5 shrink-0">
                    <button 
                      class="px-2 py-1 rounded-lg bg-primary text-on-primary text-[10px] font-bold shadow-xs active:scale-95 transition-all flex items-center gap-0.5"
                      onclick="window.triggerMedicineReminder('${m.id}')"
                      title="Send SMS"
                    >
                      <span class="material-symbols-outlined text-[12px]">sms</span>
                      <span>SMS</span>
                    </button>

                    <button 
                      class="w-6 h-6 rounded-lg bg-surface-container hover:bg-error/10 text-on-surface-variant hover:text-error flex items-center justify-center active:scale-95 transition-all"
                      onclick="window.handleDeleteMedicine('${m.id}')"
                      title="Delete reminder"
                    >
                      <span class="material-symbols-outlined text-[14px]">delete_outline</span>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Calendar Adherence Legend -->
          <div class="p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high/40 flex items-center justify-around text-[10px] text-on-surface-variant font-bold">
            <span class="flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-tertiary"></span> 100% Adherence
            </span>
            <span class="flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-primary"></span> Active Date
            </span>
            <span class="flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-outline-variant"></span> Scheduled
            </span>
          </div>

        </div>

      </div>
    </div>
  `;
}

window.toggleCalendarAddForm = () => {
  isAddFormOpen = !isAddFormOpen;
  store.notify();
};

window.handleSelectCalendarDay = (day) => {
  store.selectCalendarDate(day);
  showToast(`Schedule loaded for September ${day}, 2026 📅`, 'info', 1500);
};

window.handleSaveCalendarMedicine = () => {
  const nameInput = document.getElementById('new-med-name');
  const strengthInput = document.getElementById('new-med-strength');
  const slotSelect = document.getElementById('new-med-slot');
  const instructionSelect = document.getElementById('new-med-instruction');
  const durationInput = document.getElementById('new-med-duration');

  const name = nameInput ? nameInput.value.trim() : 'Amoxicillin';
  const strength = strengthInput ? strengthInput.value.trim() : '500 mg';
  const slot = slotSelect ? slotSelect.value : 'Morning';
  const instruction = instructionSelect ? instructionSelect.value : 'After food';
  const duration = durationInput ? durationInput.value : '5 Days';

  const timeMap = {
    'Morning': '09:00 AM',
    'Lunch': '02:00 PM',
    'Dinner': '08:30 PM',
    'Night': '10:00 PM'
  };

  const newMed = store.addCustomScheduleMedicine({
    name: name,
    strength: strength,
    slot: slot,
    time: timeMap[slot] || '09:00 AM',
    instruction: instruction,
    purpose: `Doctor Prescribed Treatment for ${duration}`,
    purposeTe: `${duration} రోజుల పాటు వైద్యులు సూచించిన చికిత్స`
  });

  isAddFormOpen = false;
  speech.playChime('success');
  store.notify();

  showToast(`✓ ${name} ${strength} added to Calendar schedule (${slot})!`, 'success', 3500);

  // Multilingual voice confirmation
  setTimeout(() => {
    speech.speak(
      `${name} ${strength} మందు క్యాలెండర్ షెడ్యూల్‌లో చేర్చబడింది. సమయం: ${slot}.`,
      'te'
    );
  }, 400);
};
