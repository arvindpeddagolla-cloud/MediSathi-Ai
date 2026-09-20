import { store } from '../state/store.js';
import { t } from '../utils/i18n.js';
import { showToast } from '../components/Toast.js';

export function renderCalendarPickerModal(state) {
  const lang = state.currentLanguage;
  const currentSelected = state.calendar.selectedDate;

  // September 2026 days (30 days, 1st starts on Tuesday)
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);

  return `
    <div class="absolute inset-0 z-50 flex flex-col bg-surface rounded-[inherit] overflow-hidden view-enter">
      <div class="w-full h-full bg-surface flex flex-col relative overflow-hidden">
        
        <!-- Header -->
        <div class="h-14 px-4 bg-surface-container flex items-center justify-between border-b border-surface-container-high/60 shrink-0">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[20px] text-primary">calendar_month</span>
            <h3 class="text-[16px] font-bold text-on-surface">September 2026</h3>
          </div>
          <button class="text-on-surface-variant hover:text-on-surface" onclick="window.closeActiveModal()">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <!-- Month Grid Content -->
        <div class="p-4 space-y-3 flex-1 overflow-y-auto no-scrollbar">
          
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

          <!-- Calendar Days Grid -->
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
                    isSelected ? 'bg-primary text-white shadow-md ring-2 ring-primary-fixed' : 
                    (isToday ? 'bg-secondary-container text-on-secondary-container font-extrabold' : 
                    (isPast ? 'bg-surface-container-lowest text-on-surface hover:bg-surface-container' : 'bg-surface-container text-on-surface-variant opacity-75'))
                  }"
                  onclick="window.handleSelectCalendarDay(${day})"
                >
                  <span>${day}</span>
                  ${isPast ? `
                    <span class="w-1.5 h-1.5 rounded-full bg-tertiary mt-0.5"></span>
                  ` : (isToday ? `
                    <span class="w-1.5 h-1.5 rounded-full bg-primary mt-0.5 animate-pulse"></span>
                  ` : '')}
                </button>
              `;
            }).join('')}
          </div>

          <!-- Calendar Adherence Legend -->
          <div class="p-3 rounded-xl bg-surface-container-low border border-surface-container-high/40 flex items-center justify-around text-[10px] text-on-surface-variant font-bold pt-2">
            <span class="flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-tertiary"></span> 100% Adherence
            </span>
            <span class="flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-primary"></span> Today (Active)
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

window.handleSelectCalendarDay = (day) => {
  store.selectCalendarDate(day);
  store.closeModal();
  showToast(`Schedule loaded for September ${day}, 2026 📅`, 'info');
};
