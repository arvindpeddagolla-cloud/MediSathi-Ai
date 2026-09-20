import { store } from '../state/store.js';
import { t } from '../utils/i18n.js';

export function renderHeader(state) {
  const lang = state.currentLanguage;
  const langLabels = {
    en: 'English',
    te: 'తెలుగు',
    hi: 'हिंदी',
    ta: 'தமிழ்'
  };

  const tabTitles = {
    home: 'Dashboard • Home',
    medicines: 'Medicines Schedule',
    health: 'Health Track & Vitals',
    reports: 'Medical Reports AI',
    ai: 'Clinical AI Assistant',
    profile: 'Profile & Settings'
  };

  return `
    <header class="w-full shrink-0 z-30 bg-surface/95 backdrop-blur-xl border-b border-surface-container-high/60 shadow-xs select-none">
      <!-- Android Material 3 Status Bar with Camera Punchhole clearance -->
      <div class="w-full h-8 px-5 pt-1.5 flex items-center justify-between text-on-surface text-[12px] font-semibold tracking-tight">
        <span class="font-bold pl-1">9:41</span>
        
        <!-- Status Bar Icons -->
        <div class="flex items-center gap-1.5 text-on-surface">
          <span class="material-symbols-outlined text-[15px]">signal_cellular_4_bar</span>
          <span class="material-symbols-outlined text-[15px]">wifi</span>
          <div class="flex items-center gap-0.5 ml-0.5">
            <span class="text-[11px] font-bold">98%</span>
            <span class="material-symbols-outlined text-[16px]">battery_full</span>
          </div>
        </div>
      </div>

      <!-- Material 3 Top App Bar -->
      <div class="h-14 px-4 flex items-center justify-between gap-2">
        <!-- Logo & Title -->
        <div class="flex items-center gap-2.5 min-w-0 cursor-pointer" onclick="window.navigateTab('home')">
          <div class="w-9 h-9 rounded-xl bg-white p-1 shadow-sm flex items-center justify-center shrink-0 border border-surface-container-high">
            <img alt="MediSathi AI Logo" class="w-full h-full object-contain" src="${state.patient.logoUrl}">
          </div>
          <div class="flex flex-col truncate">
            <span class="font-bold text-[18px] text-primary truncate leading-tight tracking-tight">MediSathi AI</span>
            <span class="text-[12px] text-on-surface-variant truncate font-medium">${tabTitles[state.activeTab] || 'Health Assistant'}</span>
          </div>
        </div>

        <!-- Language Pill & Arvind Profile Avatar -->
        <div class="flex items-center gap-2 shrink-0">
          <button 
            id="btn-switch-lang" 
            aria-label="Switch Language" 
            class="h-8 px-2.5 rounded-full bg-surface-container-high/80 hover:bg-surface-container-highest flex items-center justify-center text-primary font-semibold text-[12px] active:scale-95 transition-all shadow-xs border border-outline-variant/30"
            type="button"
            onclick="window.cycleLanguage()"
          >
            <span class="material-symbols-outlined text-[16px] mr-1">translate</span>
            <span>${langLabels[lang]}</span>
          </button>
          
          <button 
            id="btn-header-profile" 
            aria-label="Profile" 
            class="w-9 h-9 rounded-full flex items-center justify-center p-0.5 ring-2 ring-primary/30 active:scale-95 transition-all relative cursor-pointer" 
            type="button"
            onclick="window.navigateTab('profile')"
          >
            <img alt="Arvind Profile" class="w-8 h-8 rounded-full object-cover" src="${state.patient.avatarUrl}">
            <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-tertiary border-2 border-white rounded-full"></span>
          </button>
        </div>
      </div>

      <!-- Clinical Safety Disclaimer Sub-bar -->
      <div class="bg-secondary-container/40 px-4 py-1 flex items-center justify-center gap-1.5 border-t border-secondary-container/30">
        <span class="material-symbols-outlined text-secondary text-[15px]">verified_user</span>
        <p class="text-[11px] text-secondary tracking-wide font-semibold">${t('safetyNotice', lang)}</p>
      </div>
    </header>
  `;
}
