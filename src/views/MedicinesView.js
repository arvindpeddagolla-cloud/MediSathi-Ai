import { store } from '../state/store.js';
import { t } from '../utils/i18n.js';

export function renderMedicinesView(state) {
  const lang = state.currentLanguage;
  const calendar = state.calendar;
  const selectedDate = calendar.selectedDate;
  const filter = state.medFilter || 'all';
  const channels = state.channels;

  // Filter medications
  let meds = state.medications;
  if (filter === 'morning') {
    meds = meds.filter(m => m.slot.toLowerCase() === 'morning');
  } else if (filter === 'lunch') {
    meds = meds.filter(m => m.slot.toLowerCase() === 'lunch');
  } else if (filter === 'dinner') {
    meds = meds.filter(m => m.slot.toLowerCase() === 'dinner');
  } else if (filter === 'unconfirmed') {
    meds = meds.filter(m => m.status === 'unconfirmed' || m.status === 'snoozed');
  }

  const takenCount = state.medications.filter(m => m.status === 'taken').length;
  const totalCount = state.medications.length;
  const percent = Math.round((takenCount / totalCount) * 100);
  const ringOffset = 251.2 - (251.2 * (percent / 100));

  return `
    <div class="flex flex-col w-full px-4 py-3 space-y-3.5 view-enter">
      
      <!-- Date Carousel & Header Info -->
      <div class="flex flex-col space-y-2 pt-1">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[11px] text-on-surface-variant uppercase tracking-wider font-bold">${t('todaysSchedule', lang)}</p>
            <h1 class="text-[24px] font-extrabold text-on-surface leading-tight">${t('todaysMedicines', lang)}</h1>
          </div>
          
          <!-- Month Chip (Clickable to open Full Month Calendar Picker) -->
          <button 
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-high hover:bg-surface-container-highest text-primary text-[12px] font-bold shadow-sm border border-outline-variant/30 active:scale-95 transition-all cursor-pointer"
            onclick="window.openCalendarModal()"
            title="Open Month Calendar"
          >
            <span class="material-symbols-outlined text-[16px]">calendar_month</span>
            <span>Sep ${selectedDate}, 2026</span>
          </button>
        </div>

        <!-- Date selector horizontal scroll (Fully Interactive) -->
        <div class="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar -mx-4 px-4">
          ${calendar.days.map(d => {
            const isSelected = d.day === selectedDate;
            const isToday = d.isToday;
            const isPast = d.day < 15;

            return `
              <button 
                class="flex flex-col items-center justify-center min-w-[52px] h-[66px] rounded-xl transition-all cursor-pointer active:scale-95 ${
                  isSelected ? 'bg-primary text-on-primary shadow-md ring-2 ring-primary-fixed scale-105' : 
                  (isToday ? 'bg-secondary-container text-on-secondary-container border border-secondary/30' : 
                  'bg-surface-container text-on-surface-variant border border-outline-variant/20 hover:bg-surface-container-high')
                }"
                type="button"
                onclick="window.selectDate(${d.day})"
              >
                <span class="text-[11px] ${isSelected ? 'font-bold opacity-90' : 'font-medium'}">${d.weekday}</span>
                <span class="text-[17px] font-extrabold leading-tight">${d.day}</span>
                <span class="w-1.5 h-1.5 rounded-full mt-0.5 ${
                  isSelected ? 'bg-secondary-container' : (isPast ? 'bg-tertiary' : 'bg-outline-variant')
                }"></span>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Adherence Hero Card -->
      <div class="relative overflow-hidden rounded-2xl bg-surface-container-lowest shadow-md p-4 flex flex-col space-y-3 border border-surface-container-high/60">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
              <span class="material-symbols-outlined text-[18px]">insights</span>
            </div>
            <span class="text-[15px] font-bold text-on-surface">${t('dailyAdherence', lang)} (Sep ${selectedDate})</span>
          </div>
          <span class="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary text-[11px] font-bold">
            ${takenCount} ${t('dosesCount', lang)}
          </span>
        </div>

        <!-- Visualization row -->
        <div class="flex items-center gap-3 bg-surface-container-low p-3 rounded-xl border border-surface-container-high/40">
          <!-- Circular Progress Ring SVG -->
          <div class="relative w-20 h-20 shrink-0 flex items-center justify-center">
            <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle class="text-surface-container-highest" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" stroke-width="9"></circle>
              <circle 
                class="text-tertiary transition-all duration-700 ease-out" 
                cx="50" 
                cy="50" 
                fill="transparent" 
                id="med-adherence-ring" 
                r="40" 
                stroke="currentColor" 
                stroke-dasharray="251.2" 
                stroke-dashoffset="${ringOffset}" 
                stroke-linecap="round" 
                stroke-width="9"
              ></circle>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-[18px] font-extrabold text-tertiary leading-none">${percent}%</span>
              <span class="text-[9px] text-on-surface-variant font-bold">${t('done', lang)}</span>
            </div>
          </div>

          <!-- Metric Highlights & Micro-chart -->
          <div class="flex flex-col min-w-0 flex-1 justify-center space-y-1">
            <div class="flex items-baseline justify-between">
              <span class="text-[12px] text-on-surface-variant font-medium">${t('weeklyAdherence', lang)}</span>
              <span class="text-[14px] text-primary font-bold">88%</span>
            </div>
            <!-- Sparkline bar representation -->
            <div class="flex items-end gap-1.5 h-6 pt-1">
              <div class="flex-1 bg-tertiary rounded-t-xs h-[80%]"></div>
              <div class="flex-1 bg-tertiary rounded-t-xs h-[100%]"></div>
              <div class="flex-1 bg-tertiary rounded-t-xs h-[90%]"></div>
              <div class="flex-1 bg-tertiary rounded-t-xs h-[85%]"></div>
              <div class="flex-1 bg-tertiary rounded-t-xs h-[95%]"></div>
              <div class="flex-1 bg-tertiary rounded-t-xs h-[75%]"></div>
              <div class="flex-1 bg-primary rounded-t-xs h-[${percent}%]"></div>
            </div>
            <p class="text-[10px] text-on-surface-variant pt-0.5 truncate font-medium">
              Consistent schedule improves clinical stability.
            </p>
          </div>
        </div>

        <!-- Status Legend Guide -->
        <div class="grid grid-cols-3 gap-2 pt-0.5">
          <div class="flex items-center gap-1.5 bg-surface-container-low px-2 py-1.5 rounded-lg cursor-pointer hover:bg-surface-container" onclick="window.setMedFilter('all')">
            <span class="w-2.5 h-2.5 rounded-full bg-tertiary shrink-0"></span>
            <div class="flex flex-col min-w-0">
              <span class="text-[11px] text-on-surface font-bold truncate">${t('taken', lang)}</span>
              <span class="text-[9px] text-on-surface-variant truncate">Logged</span>
            </div>
          </div>
          <div class="flex items-center gap-1.5 bg-surface-container-low px-2 py-1.5 rounded-lg cursor-pointer hover:bg-surface-container" onclick="window.setMedFilter('unconfirmed')">
            <span class="w-2.5 h-2.5 rounded-full bg-secondary shrink-0"></span>
            <div class="flex flex-col min-w-0">
              <span class="text-[11px] text-on-surface font-bold truncate">${t('snoozed', lang)}</span>
              <span class="text-[9px] text-on-surface-variant truncate">Remind 15m</span>
            </div>
          </div>
          <div class="flex items-center gap-1.5 bg-surface-container-low px-2 py-1.5 rounded-lg cursor-pointer hover:bg-surface-container" onclick="window.setMedFilter('unconfirmed')">
            <span class="w-2.5 h-2.5 rounded-full bg-outline-variant shrink-0"></span>
            <div class="flex flex-col min-w-0">
              <span class="text-[11px] text-on-surface font-bold truncate">${t('unconfirmed', lang)}</span>
              <span class="text-[9px] text-on-surface-variant truncate">Awaiting</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Medication Timeline Section with Filters -->
      <div class="flex flex-col space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <h2 class="text-[16px] font-bold text-on-surface">${t('timelineDoses', lang)}</h2>
            ${filter !== 'all' ? `
              <span class="px-2 py-0.2 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase">${filter}</span>
            ` : ''}
          </div>

          <!-- Filter Pills -->
          <div class="flex items-center gap-1 overflow-x-auto no-scrollbar">
            <button 
              class="px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all ${filter === 'all' ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'}"
              onclick="window.setMedFilter('all')"
            >All</button>
            <button 
              class="px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all ${filter === 'morning' ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'}"
              onclick="window.setMedFilter('morning')"
            >Morning</button>
            <button 
              class="px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all ${filter === 'lunch' ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'}"
              onclick="window.setMedFilter('lunch')"
            >Lunch</button>
            <button 
              class="px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all ${filter === 'dinner' ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'}"
              onclick="window.setMedFilter('dinner')"
            >Dinner</button>
          </div>
        </div>

        <!-- Timeline Wrapper -->
        <div class="relative flex flex-col space-y-3 pl-3">
          <!-- Vertical connecting line indicator -->
          <div class="absolute left-6 top-6 bottom-8 w-0.5 bg-surface-container-high z-0"></div>

          ${meds.length === 0 ? `
            <div class="p-6 text-center text-on-surface-variant bg-surface-container-low rounded-2xl">
              <span class="material-symbols-outlined text-[32px] text-outline mb-1">medication</span>
              <p class="text-xs font-semibold">No medicines in this filter.</p>
              <button class="text-xs text-primary font-bold mt-1 underline" onclick="window.setMedFilter('all')">View All</button>
            </div>
          ` : meds.map((med, index) => {
            const isDone = med.status === 'taken';
            const isSnoozed = med.status === 'snoozed';
            const isUnconfirmed = med.status === 'unconfirmed';
            const isPending = med.status === 'pending';

            return `
              <div class="relative z-10 flex items-start gap-3">
                <!-- Status icon circle -->
                <div class="w-7 h-7 rounded-full flex items-center justify-center shadow-sm shrink-0 mt-3.5 ${
                  isDone ? 'bg-tertiary text-on-tertiary' : 
                  (isSnoozed ? 'bg-secondary text-white' : 
                  (isUnconfirmed ? 'bg-primary text-on-primary animate-pulse' : 'bg-surface-container-high text-on-surface-variant'))
                }">
                  <span class="material-symbols-outlined text-[15px] font-bold">
                    ${isDone ? 'check' : (isSnoozed ? 'alarm' : (isUnconfirmed ? 'schedule' : 'nightlight'))}
                  </span>
                </div>

                <!-- Dose Card (Clickable to open Medicine Details) -->
                <div class="flex-1 rounded-2xl bg-surface-container-lowest p-3.5 shadow-sm border border-surface-container-high/60 flex flex-col space-y-2.5 hover:border-primary/40 transition-all">
                  <div class="flex items-start justify-between gap-2 cursor-pointer" onclick="window.openMedicineDetailsById('${med.id}')">
                    <div class="flex items-center gap-2.5">
                      <!-- Pill image thumbnail -->
                      <div class="w-11 h-11 rounded-xl bg-surface-container-low overflow-hidden shrink-0 flex items-center justify-center p-1 border border-surface-container-high/40">
                        <img class="w-full h-full object-cover rounded-lg" src="${med.imageUrl}" alt="${med.name}">
                      </div>
                      <div>
                        <span class="text-[11px] text-on-surface-variant font-medium">${med.time} • ${med.slot}</span>
                        <h3 class="text-[15px] font-bold text-on-surface leading-tight hover:text-primary transition-colors flex items-center gap-1">
                          <span>${med.name} ${med.strength}</span>
                          <span class="material-symbols-outlined text-[14px] text-outline">info</span>
                        </h3>
                      </div>
                    </div>
                    <span class="inline-flex items-center px-2 py-0.5 rounded-md bg-secondary-container text-on-secondary-container text-[11px] font-bold shrink-0">
                      ${lang === 'te' ? med.instructionTe : (lang === 'hi' ? med.instructionHi : (lang === 'ta' ? med.instructionTa : med.instruction))}
                    </span>
                  </div>

                  <!-- Per-Medicine Instant Trigger & Timing Controls -->
                  <div class="flex items-center justify-between pt-1 border-t border-surface-container-high/40 text-[11px]">
                    <div class="flex items-center gap-1.5">
                      <button 
                        class="px-2.5 py-1 rounded-lg bg-primary-fixed/40 hover:bg-primary-fixed text-primary font-bold text-[10px] flex items-center gap-1 active:scale-95 transition-all border border-primary/30"
                        onclick="window.triggerMedicineReminder('${med.id}')"
                        title="Send Real Twilio SMS for ${med.name} ${med.strength}"
                      >
                        <span class="material-symbols-outlined text-[13px]">sms</span>
                        <span>Trigger SMS</span>
                      </button>

                      <button 
                        class="px-2 py-1 rounded-lg bg-secondary-container/40 hover:bg-secondary-container text-secondary font-bold text-[10px] flex items-center gap-1 active:scale-95 transition-all"
                        onclick="window.startDemoCountdown('${med.id}', 5)"
                        title="Test automated trigger in 5 seconds"
                      >
                        <span class="material-symbols-outlined text-[13px]">timer</span>
                        <span>5s Test</span>
                      </button>
                    </div>

                    <span class="text-[10px] text-on-surface-variant font-semibold flex items-center gap-0.5">
                      <span class="material-symbols-outlined text-[12px] text-primary">alarm</span>
                      <span>Due: ${med.time}</span>
                    </span>
                  </div>

                  <!-- Status Banner and Interactive Buttons -->
                  ${isDone ? `
                    <div class="flex items-center justify-between pt-1 border-t border-surface-container-high/40">
                      <div class="flex items-center gap-1 text-tertiary">
                        <span class="material-symbols-outlined text-[17px]">check_circle</span>
                        <span class="text-[12px] font-bold">Taken at ${med.loggedTime || '09:05 AM'}</span>
                      </div>
                      <button class="text-xs text-primary font-bold underline" onclick="window.handleUndoDose('${med.id}')">
                        ${t('undo', lang)}
                      </button>
                    </div>
                  ` : (isUnconfirmed || isSnoozed ? `
                    <div class="flex items-center justify-between bg-surface-container-low px-2.5 py-1.5 rounded-lg text-xs">
                      <div class="flex items-center gap-1.5 text-on-surface-variant font-medium">
                        <span class="material-symbols-outlined text-[16px] text-outline">radio_button_unchecked</span>
                        <span>Status: <strong class="text-on-surface">${isSnoozed ? 'Snoozed (15m)' : 'Unconfirmed'}</strong></span>
                      </div>
                      <span class="text-[10px] text-on-surface-variant font-semibold">${t('windowOpen', lang)}</span>
                    </div>

                    <div class="grid grid-cols-2 gap-2 pt-0.5">
                      <button 
                        class="h-10 rounded-xl bg-surface-container text-on-surface text-[12px] font-bold flex items-center justify-center gap-1 active:scale-95 transition-all hover:bg-surface-variant"
                        type="button"
                        onclick="window.handleSnoozeDose('${med.id}')"
                      >
                        <span class="material-symbols-outlined text-[16px] text-secondary">alarm</span>
                        <span>Snooze 15m</span>
                      </button>
                      <button 
                        class="h-10 rounded-xl bg-primary text-on-primary text-[12px] font-bold shadow-md flex items-center justify-center gap-1 active:scale-95 transition-all hover:bg-primary-container"
                        type="button"
                        onclick="window.handleMarkTaken('${med.id}')"
                      >
                        <span class="material-symbols-outlined text-[16px]">check_circle</span>
                        <span>${t('markTaken', lang)}</span>
                      </button>
                    </div>
                  ` : `
                    <div class="flex items-center justify-between pt-1 border-t border-surface-container-high/40">
                      <span class="text-[11px] text-on-surface-variant flex items-center gap-1 font-medium">
                        <span class="material-symbols-outlined text-[15px] text-outline">schedule</span>
                        <span>${t('upcomingEvening', lang)}</span>
                      </span>
                      <button class="h-8 px-3 rounded-full bg-surface-container-high text-primary text-[11px] font-bold flex items-center gap-1 active:scale-95" type="button" onclick="window.triggerMedicineReminder('${med.id}')">
                        <span class="material-symbols-outlined text-[14px]">notifications_active</span>
                        <span>Trigger Now</span>
                      </button>
                    </div>
                  `)}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Reminder Delivery Preferences Card -->
      <div class="rounded-2xl bg-surface-container-lowest p-4 shadow-sm border border-surface-container-high/60 flex flex-col space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
              <span class="material-symbols-outlined text-[18px]">notifications_active</span>
            </div>
            <h3 class="text-[15px] font-bold text-on-surface">${t('deliveryPreferences', lang)}</h3>
          </div>
          <span class="text-[11px] text-tertiary font-bold flex items-center gap-0.5">
            <span class="w-2 h-2 rounded-full bg-tertiary"></span> Active
          </span>
        </div>

        <!-- Interactive Channel Toggles -->
        <div class="flex flex-col space-y-2">
          <!-- 1. App Push Notification -->
          <div class="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low min-h-[50px] border border-surface-container-high/40">
            <div class="flex items-center gap-2.5 min-w-0 pr-2">
              <div class="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                <span class="material-symbols-outlined text-[18px]">smartphone</span>
              </div>
              <div class="flex flex-col min-w-0">
                <span class="text-[13px] font-bold text-on-surface leading-snug">${t('pushNotifications', lang)}</span>
                <span class="text-[10px] text-on-surface-variant truncate">${t('pushDesc', lang)}</span>
              </div>
            </div>
            <button 
              class="relative w-11 h-6 ${channels.push ? 'bg-primary' : 'bg-outline-variant'} rounded-full p-0.5 transition-colors shrink-0"
              onclick="window.toggleChannel('push')"
            >
              <div class="w-5 h-5 bg-white rounded-full shadow-sm transform ${channels.push ? 'translate-x-5' : 'translate-x-0'} transition-transform"></div>
            </button>
          </div>

          <!-- 2. SMS Reminder -->
          <div class="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low min-h-[50px] border border-surface-container-high/40">
            <div class="flex items-center gap-2.5 min-w-0 pr-2">
              <div class="w-9 h-9 rounded-full bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
                <span class="material-symbols-outlined text-[18px]">sms</span>
              </div>
              <div class="flex flex-col min-w-0">
                <span class="text-[13px] font-bold text-on-surface leading-snug">${t('smsReminder', lang)}</span>
                <span class="text-[10px] text-on-surface-variant truncate">${t('smsDesc', lang)}</span>
              </div>
            </div>
            <button 
              class="relative w-11 h-6 ${channels.sms ? 'bg-primary' : 'bg-outline-variant'} rounded-full p-0.5 transition-colors shrink-0"
              onclick="window.toggleChannel('sms')"
            >
              <div class="w-5 h-5 bg-white rounded-full shadow-sm transform ${channels.sms ? 'translate-x-5' : 'translate-x-0'} transition-transform"></div>
            </button>
          </div>

          <!-- 3. AI Voice Call Reminder -->
          <div class="flex items-center justify-between p-2.5 rounded-xl bg-surface-container-low min-h-[50px] border border-surface-container-high/40">
            <div class="flex items-center gap-2.5 min-w-0 pr-2">
              <div class="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shrink-0">
                <span class="material-symbols-outlined text-[18px]">ring_volume</span>
              </div>
              <div class="flex flex-col min-w-0">
                <div class="flex items-center gap-1">
                  <span class="text-[13px] font-bold text-on-surface leading-snug">${t('voiceCallReminder', lang)}</span>
                  <span class="px-1.5 py-0.2 rounded bg-surface-container text-secondary text-[10px] font-bold">తెలుగు / EN</span>
                </div>
                <span class="text-[10px] text-on-surface-variant truncate">${t('voiceCallDesc', lang)}</span>
              </div>
            </div>
            <button 
              class="relative w-11 h-6 ${channels.voiceCall ? 'bg-primary' : 'bg-outline-variant'} rounded-full p-0.5 transition-colors shrink-0"
              onclick="window.toggleChannel('voiceCall')"
            >
              <div class="w-5 h-5 bg-white rounded-full shadow-sm transform ${channels.voiceCall ? 'translate-x-5' : 'translate-x-0'} transition-transform"></div>
            </button>
          </div>
        </div>
      </div>

      <!-- Action Buttons: Create Reminder & Scan Prescription -->
      <div class="grid grid-cols-2 gap-2 pt-1 pb-2">
        <button 
          class="h-12 rounded-2xl bg-primary text-on-primary shadow-md flex items-center justify-center gap-1.5 active:scale-98 transition-all hover:bg-primary-container font-bold text-[13px]" 
          type="button"
          onclick="window.openCreateReminderModal()"
        >
          <span class="material-symbols-outlined text-[18px]">alarm_add</span>
          <span>+ Create Reminder</span>
        </button>

        <button 
          class="h-12 rounded-2xl bg-secondary-container text-on-secondary-container shadow-sm flex items-center justify-center gap-1.5 active:scale-98 transition-all hover:bg-secondary-container/80 font-bold text-[13px]" 
          type="button"
          onclick="window.openScannerModal()"
        >
          <span class="material-symbols-outlined text-[18px]">document_scanner</span>
          <span>Scan Rx</span>
        </button>
      </div>

      <!-- Clinical Safety Disclaimer -->
      <div class="flex items-start gap-2.5 bg-surface-container-low p-3.5 rounded-xl text-on-surface-variant border border-surface-container-high/60">
        <span class="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">verified_user</span>
        <div class="flex flex-col">
          <p class="text-[11px] text-on-surface font-bold">${t('safetyNotice', lang)}</p>
          <p class="text-[11px] text-on-surface-variant leading-relaxed">
            ${t('safetyLong', lang)}
          </p>
        </div>
      </div>

    </div>
  `;
}

window.selectDate = (day) => {
  store.selectCalendarDate(day);
};

window.openCalendarModal = () => {
  store.openModal('calendarPicker');
};

window.setMedFilter = (filter) => {
  store.setMedFilter(filter);
};

window.openMedicineDetailsById = (medId) => {
  const med = store.state.medications.find(m => m.id === medId);
  if (med) {
    store.openMedicineDetails(med);
  }
};
