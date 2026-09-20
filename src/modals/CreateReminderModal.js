import { store } from '../state/store.js';
import { t } from '../utils/i18n.js';
import { speech } from '../utils/speech.js';
import { showToast } from '../components/Toast.js';
import { triggerMedicineReminder, startDemoCountdown, formatToAmPm } from '../utils/scheduler.js';

export function renderCreateReminderModal(state) {
  const lang = state.currentLanguage;

  // Calculate current time + 1 min and + 2 min for quick one-click scheduling
  const now = new Date();
  const nowPlus1 = new Date(now.getTime() + 60000);
  const nowPlus2 = new Date(now.getTime() + 120000);

  const plus1Str = formatToAmPm(nowPlus1.getHours(), nowPlus1.getMinutes());
  const plus2Str = formatToAmPm(nowPlus2.getHours(), nowPlus2.getMinutes());
  const currentStr = formatToAmPm(now.getHours(), now.getMinutes());

  return `
    <div class="absolute inset-0 z-50 flex flex-col bg-surface rounded-[inherit] overflow-hidden view-enter select-none">
      <div class="w-full h-full bg-surface flex flex-col relative overflow-hidden">
        
        <!-- Header -->
        <div class="h-14 px-4 bg-surface-container flex items-center justify-between border-b border-surface-container-high/60 shrink-0">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">alarm_add</span>
            </div>
            <div>
              <h3 class="text-[15px] font-bold text-on-surface leading-tight">Create Medicine Reminder</h3>
              <span class="text-[10px] text-on-surface-variant">Scheduled Twilio SMS &amp; Mobile Voice Alerts</span>
            </div>
          </div>
          <button 
            class="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest active:scale-95 transition-all" 
            onclick="window.closeActiveModal()"
          >
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <!-- Scrollable Form Content -->
        <div class="p-4 space-y-3 flex-1 overflow-y-auto no-scrollbar">
          
          <!-- Mobile SMS Target Notification Card -->
          <div class="p-3 rounded-2xl bg-primary-fixed/25 border border-primary/40 flex items-center justify-between shadow-xs">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full bg-primary animate-ping shrink-0"></span>
              <div>
                <span class="text-[11px] font-bold text-primary block leading-tight">Twilio Mobile Gateway Active</span>
                <span class="text-[10px] text-on-surface font-semibold">Scheduled SMS Target: <strong class="text-primary">+91 81068 90663</strong></span>
              </div>
            </div>
            <span class="material-symbols-outlined text-primary text-[20px]">sms</span>
          </div>

          <!-- Form Fields -->
          <div class="space-y-3 bg-surface-container-lowest p-3.5 rounded-2xl border border-surface-container-high/60 shadow-sm">
            
            <!-- Medicine Name -->
            <div class="space-y-1">
              <label class="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider block">
                Medicine / Tablet Name
              </label>
              <div class="flex items-center gap-2 p-2 rounded-xl bg-surface-container-low border border-surface-container-high focus-within:border-primary">
                <span class="material-symbols-outlined text-[18px] text-primary">medication</span>
                <input 
                  id="reminder-med-name" 
                  class="flex-1 bg-transparent text-[13px] font-bold text-on-surface focus:outline-none placeholder:text-outline" 
                  placeholder="e.g. Paracetamol, Metformin, Amoxicillin" 
                  value="Paracetamol"
                />
              </div>
            </div>

            <!-- Dosage & Strength -->
            <div class="grid grid-cols-2 gap-2">
              <div class="space-y-1">
                <label class="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider block">
                  Strength / Dose
                </label>
                <div class="flex items-center gap-1.5 p-2 rounded-xl bg-surface-container-low border border-surface-container-high focus-within:border-primary">
                  <span class="material-symbols-outlined text-[16px] text-secondary">scale</span>
                  <input 
                    id="reminder-med-strength" 
                    class="w-full bg-transparent text-[12px] font-bold text-on-surface focus:outline-none placeholder:text-outline" 
                    placeholder="e.g. 500 mg" 
                    value="500 mg"
                  />
                </div>
              </div>

              <!-- Time Slot -->
              <div class="space-y-1">
                <label class="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider block">
                  Time Slot
                </label>
                <select 
                  id="reminder-med-slot" 
                  class="w-full p-2 rounded-xl bg-surface-container-low border border-surface-container-high text-[12px] font-bold text-on-surface focus:outline-none focus:border-primary"
                  onchange="window.handleSlotChange(this.value)"
                >
                  <option value="Morning">Morning (09:00 AM)</option>
                  <option value="Lunch">Lunch (02:00 PM)</option>
                  <option value="Dinner">Dinner (08:30 PM)</option>
                  <option value="Bedtime">Bedtime (10:00 PM)</option>
                  <option value="Custom" selected>Custom Scheduled Time</option>
                </select>
              </div>
            </div>

            <!-- Scheduled Trigger Time with Quick Presets -->
            <div class="space-y-1.5" id="custom-time-picker-container">
              <div class="flex items-center justify-between">
                <label class="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider block">
                  Scheduled Trigger Time (Clock Alarm &amp; SMS)
                </label>
                <span class="text-[10px] text-primary font-bold">Current: ${currentStr}</span>
              </div>
              
              <div class="flex items-center gap-2 p-2 rounded-xl bg-surface-container-low border border-surface-container-high focus-within:border-primary">
                <span class="material-symbols-outlined text-[18px] text-primary">schedule</span>
                <input 
                  id="reminder-med-time" 
                  type="text"
                  class="flex-1 bg-transparent text-[13px] font-bold text-on-surface focus:outline-none placeholder:text-outline" 
                  placeholder="e.g. ${plus1Str}" 
                  value="${plus1Str}"
                />
              </div>

              <!-- Quick Time Preset Chips -->
              <div class="pt-1">
                <span class="text-[10px] text-on-surface-variant font-semibold block mb-1">Quick Timing Presets:</span>
                <div class="flex flex-wrap gap-1.5">
                  <button 
                    type="button" 
                    class="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-bold border border-primary/30 hover:bg-primary hover:text-white transition-all active:scale-95"
                    onclick="window.setQuickReminderTime('${plus1Str}')"
                  >
                    ⚡ In 1 min (${plus1Str})
                  </button>
                  <button 
                    type="button" 
                    class="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[10px] font-bold border border-primary/30 hover:bg-primary hover:text-white transition-all active:scale-95"
                    onclick="window.setQuickReminderTime('${plus2Str}')"
                  >
                    ⚡ In 2 min (${plus2Str})
                  </button>
                  <button 
                    type="button" 
                    class="px-2 py-1 rounded-lg bg-surface-container-high text-on-surface text-[10px] font-semibold hover:bg-surface-variant transition-all"
                    onclick="window.setQuickReminderTime('09:00 AM')"
                  >
                    09:00 AM
                  </button>
                  <button 
                    type="button" 
                    class="px-2 py-1 rounded-lg bg-surface-container-high text-on-surface text-[10px] font-semibold hover:bg-surface-variant transition-all"
                    onclick="window.setQuickReminderTime('02:00 PM')"
                  >
                    02:00 PM
                  </button>
                  <button 
                    type="button" 
                    class="px-2 py-1 rounded-lg bg-surface-container-high text-on-surface text-[10px] font-semibold hover:bg-surface-variant transition-all"
                    onclick="window.setQuickReminderTime('08:30 PM')"
                  >
                    08:30 PM
                  </button>
                </div>
              </div>
            </div>

            <!-- Food Instruction -->
            <div class="space-y-1">
              <label class="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider block">
                Food Instruction
              </label>
              <select 
                id="reminder-med-instruction" 
                class="w-full p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high text-[12px] font-bold text-on-surface focus:outline-none focus:border-primary"
              >
                <option value="After food">After food (ఆహారం తర్వాత)</option>
                <option value="Before food">Before food (ఆహారానికి ముందు)</option>
                <option value="With food">With food (భోజనంతో పాటు)</option>
                <option value="Empty stomach">Empty stomach (ఖాళీ కడుపుతో)</option>
              </select>
            </div>

            <!-- Target Mobile Number -->
            <div class="space-y-1">
              <label class="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider block">
                Mobile Number for Real Twilio SMS
              </label>
              <div class="flex items-center gap-2 p-2 rounded-xl bg-surface-container-low border border-surface-container-high focus-within:border-primary">
                <span class="material-symbols-outlined text-[18px] text-tertiary">phone_android</span>
                <input 
                  id="reminder-target-phone" 
                  class="flex-1 bg-transparent text-[13px] font-bold text-on-surface focus:outline-none" 
                  value="+918106890663"
                />
              </div>
            </div>

          </div>

          <!-- Action Buttons -->
          <div class="space-y-2 pt-1">
            <!-- 1. Save and Auto-Trigger at Scheduled Time -->
            <button 
              type="button" 
              class="w-full h-12 rounded-2xl bg-primary text-on-primary font-bold text-[13px] flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all hover:bg-primary-container"
              onclick="window.handleCreateReminderAndSend(false)"
            >
              <span class="material-symbols-outlined text-[18px]">alarm_on</span>
              <span>Save &amp; Schedule SMS Trigger at Due Time</span>
            </button>

            <!-- 2. Save and Test 5-Second Countdown -->
            <button 
              type="button" 
              class="w-full h-11 rounded-2xl bg-secondary-container text-on-secondary-container font-bold text-[12px] flex items-center justify-center gap-1.5 active:scale-98 transition-all hover:opacity-90"
              onclick="window.handleCreateReminderAndCountdown(5)"
            >
              <span class="material-symbols-outlined text-[16px]">timer</span>
              <span>Save &amp; Test Live SMS in 5 Seconds ⚡</span>
            </button>

            <!-- 3. Immediate SMS trigger -->
            <button 
              type="button" 
              class="w-full h-10 rounded-2xl bg-surface-container-high text-on-surface font-semibold text-[11px] flex items-center justify-center gap-1.5 active:scale-98 transition-all hover:bg-surface-variant"
              onclick="window.handleCreateReminderAndSend(true)"
            >
              <span class="material-symbols-outlined text-[16px]">send</span>
              <span>Trigger Live SMS to +91 81068 90663 Right Now</span>
            </button>
          </div>

          <!-- Active Reminders Count Banner -->
          <div class="p-3 rounded-xl bg-surface-container text-on-surface-variant flex items-center justify-between text-[11px] font-semibold border border-surface-container-high/40">
            <span>Currently Active Reminders:</span>
            <span class="text-primary font-bold">${state.medications.length} scheduled medicines</span>
          </div>

        </div>

      </div>
    </div>
  `;
}

window.setQuickReminderTime = (timeStr) => {
  const timeInput = document.getElementById('reminder-med-time');
  if (timeInput) {
    timeInput.value = timeStr;
    showToast(`Scheduled time set to ${timeStr} ⏰`, 'info', 1200);
  }
};

window.handleSlotChange = (slotValue) => {
  const timeInput = document.getElementById('reminder-med-time');
  if (!timeInput) return;
  
  const timeMap = {
    'Morning': '09:00 AM',
    'Lunch': '02:00 PM',
    'Dinner': '08:30 PM',
    'Bedtime': '10:00 PM'
  };

  if (timeMap[slotValue]) {
    timeInput.value = timeMap[slotValue];
  }
};

window.handleCreateReminderAndSend = async (sendImmediateSms = false) => {
  const nameInput = document.getElementById('reminder-med-name');
  const strengthInput = document.getElementById('reminder-med-strength');
  const slotSelect = document.getElementById('reminder-med-slot');
  const timeInput = document.getElementById('reminder-med-time');
  const instructionSelect = document.getElementById('reminder-med-instruction');
  const phoneInput = document.getElementById('reminder-target-phone');

  const name = nameInput ? nameInput.value.trim() : 'Paracetamol';
  const strength = strengthInput ? strengthInput.value.trim() : '500 mg';
  const slot = slotSelect ? slotSelect.value : 'Morning';
  const time = timeInput ? timeInput.value.trim() : '09:00 AM';
  const instruction = instructionSelect ? instructionSelect.value : 'After food';
  const targetPhone = phoneInput ? phoneInput.value.trim() : '+918106890663';

  // Add to store
  const newMed = store.addCustomScheduleMedicine({
    name: name,
    strength: strength,
    slot: slot,
    time: time,
    instruction: instruction,
    purpose: 'Scheduled Medication Reminder',
    purposeTe: 'షెడ్యూల్ చేయబడిన మందుల రిమైండర్'
  });

  speech.playChime('success');
  store.closeModal();

  showToast(`✓ Scheduled reminder created for ${name} ${strength} at ${time}!`, 'success', 4000);

  // Telugu voice announcement
  setTimeout(() => {
    speech.speak(
      `${name} ${strength} రిమైండర్ సమయం: ${time}. షెడ్యూల్ చేయబడింది.`,
      'te'
    );
  }, 400);

  if (sendImmediateSms) {
    setTimeout(() => {
      triggerMedicineReminder(newMed, targetPhone);
    }, 600);
  }
};

window.handleCreateReminderAndCountdown = async (seconds = 5) => {
  const nameInput = document.getElementById('reminder-med-name');
  const strengthInput = document.getElementById('reminder-med-strength');
  const slotSelect = document.getElementById('reminder-med-slot');
  const timeInput = document.getElementById('reminder-med-time');
  const instructionSelect = document.getElementById('reminder-med-instruction');
  const phoneInput = document.getElementById('reminder-target-phone');

  const name = nameInput ? nameInput.value.trim() : 'Paracetamol';
  const strength = strengthInput ? strengthInput.value.trim() : '500 mg';
  const slot = slotSelect ? slotSelect.value : 'Morning';
  const time = timeInput ? timeInput.value.trim() : '09:00 AM';
  const instruction = instructionSelect ? instructionSelect.value : 'After food';
  const targetPhone = phoneInput ? phoneInput.value.trim() : '+918106890663';

  // Add to store
  const newMed = store.addCustomScheduleMedicine({
    name: name,
    strength: strength,
    slot: slot,
    time: time,
    instruction: instruction,
    purpose: 'Scheduled Medication Reminder',
    purposeTe: 'షెడ్యూల్ చేయబడిన మందుల రిమైండర్'
  });

  speech.playChime('success');
  store.closeModal();

  showToast(`✓ Scheduled for ${time}. Starting ${seconds}s demo countdown...`, 'info', 2500);

  // Start demo countdown
  startDemoCountdown(newMed.id, seconds);
};
