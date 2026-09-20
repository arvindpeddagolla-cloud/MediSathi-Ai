import { store } from '../state/store.js';

export function renderDemoControls(state) {
  const lang = state.currentLanguage;
  
  return `
    <div class="w-full max-w-md mx-auto mb-3 px-3 py-2 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between gap-1 text-white text-xs select-none">
      <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <span class="text-slate-400 font-bold uppercase tracking-wider text-[10px] mr-0.5 shrink-0">Demo:</span>
        
        <!-- Scan Rx Shortcut -->
        <button 
          onclick="window.openScannerModal()" 
          class="px-2.5 py-1 rounded-lg bg-primary/20 hover:bg-primary/40 text-primary-fixed font-semibold flex items-center gap-1 shrink-0 active:scale-95 transition-all border border-primary/30"
          title="Simulate Prescription Scanner"
        >
          <span class="material-symbols-outlined text-[14px]">document_scanner</span>
          <span>Scan Rx</span>
        </button>

        <!-- Voice Call Shortcut -->
        <button 
          onclick="window.openVoiceCallModal()" 
          class="px-2.5 py-1 rounded-lg bg-secondary/20 hover:bg-secondary/40 text-secondary-fixed font-semibold flex items-center gap-1 shrink-0 active:scale-95 transition-all border border-secondary/30"
          title="Simulate AI Phone Call Reminder"
        >
          <span class="material-symbols-outlined text-[14px]">ring_volume</span>
          <span>Voice Call</span>
        </button>

        <!-- SMS Shortcut -->
        <button 
          onclick="window.openSMSModal()" 
          class="px-2.5 py-1 rounded-lg bg-tertiary/20 hover:bg-tertiary/40 text-tertiary-fixed font-semibold flex items-center gap-1 shrink-0 active:scale-95 transition-all border border-tertiary/30"
          title="Simulate SMS Reminder"
        >
          <span class="material-symbols-outlined text-[14px]">sms</span>
          <span>SMS</span>
        </button>

        <!-- Reminder Modal Shortcut -->
        <button 
          onclick="window.openReminderModal()" 
          class="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 font-semibold flex items-center gap-1 shrink-0 active:scale-95 transition-all border border-amber-500/30"
          title="Simulate Active Alarm Modal"
        >
          <span class="material-symbols-outlined text-[14px]">alarm</span>
          <span>Alarm</span>
        </button>
      </div>

      <!-- Language Quick Switcher -->
      <div class="flex items-center gap-1 shrink-0 border-l border-slate-700 pl-1.5 ml-1">
        <button 
          onclick="window.setLanguage('en')" 
          class="px-1.5 py-0.5 rounded text-[11px] font-bold ${lang === 'en' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}"
        >EN</button>
        <button 
          onclick="window.setLanguage('te')" 
          class="px-1.5 py-0.5 rounded text-[11px] font-bold ${lang === 'te' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}"
        >తె</button>
        <button 
          onclick="window.setLanguage('hi')" 
          class="px-1.5 py-0.5 rounded text-[11px] font-bold ${lang === 'hi' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}"
        >हि</button>
        <button 
          onclick="window.setLanguage('ta')" 
          class="px-1.5 py-0.5 rounded text-[11px] font-bold ${lang === 'ta' ? 'bg-primary text-white' : 'text-slate-400 hover:text-white'}"
        >த</button>
      </div>
    </div>
  `;
}
