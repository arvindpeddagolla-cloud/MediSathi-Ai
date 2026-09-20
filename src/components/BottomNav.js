import { t } from '../utils/i18n.js';

export function renderBottomNav(state) {
  const lang = state.currentLanguage;
  const currentTab = state.activeTab;

  const tabs = [
    { id: 'home', labelKey: 'navHome', icon: 'home' },
    { id: 'medicines', labelKey: 'navMedicines', icon: 'pill' },
    { id: 'health', labelKey: 'navHealth', icon: 'favorite' },
    { id: 'reports', labelKey: 'navReports', icon: 'description' },
    { id: 'ai', labelKey: 'navAI', icon: 'smart_toy' }
  ];

  return `
    <nav class="w-full shrink-0 z-30 bg-surface-container/95 backdrop-blur-xl border-t border-surface-container-high/80 shadow-[0_-2px_12px_rgba(0,0,0,0.06)] select-none">
      <div class="flex justify-around items-center h-15 px-1 pt-1">
        ${tabs.map(tab => {
          const isActive = currentTab === tab.id;
          return `
            <button 
              class="flex flex-col items-center justify-center min-w-[54px] min-h-[44px] py-1 px-1 transition-all active:scale-95 group ${isActive ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'}"
              type="button"
              onclick="window.navigateTab('${tab.id}')"
              data-tab="${tab.id}"
            >
              <div class="w-13 h-7 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-primary-fixed/60 text-on-primary-fixed shadow-xs' : 'group-hover:bg-surface-container-high/50'}">
                <span class="material-symbols-outlined text-[20px] ${isActive ? 'material-symbols-filled font-bold text-primary' : ''}">${tab.icon}</span>
              </div>
              <span class="text-[10px] mt-0.5 ${isActive ? 'font-bold text-primary' : 'font-medium'} truncate max-w-[64px]">
                ${t(tab.labelKey, lang)}
              </span>
            </button>
          `;
        }).join('')}
      </div>

      <!-- Android Gesture Bar Handle -->
      <div class="w-full flex justify-center pb-1.5 pt-0.5 pointer-events-none">
        <div class="w-28 h-1 rounded-full bg-on-surface/30"></div>
      </div>
    </nav>
  `;
}
