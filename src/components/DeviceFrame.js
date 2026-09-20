import { store } from '../state/store.js';

export function renderDemoControls(state) {
  const lang = state.currentLanguage;
  
  return `
    <div class="w-full max-w-md mx-auto mb-3 px-3 py-2 bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl flex items-center justify-between gap-1 text-white text-xs select-none">
      <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <span class="text-slate-400 font-bold uppercase tracking-wider text-[10px] mr-0.5 shrink-0">Demo:</span>
        
        <!-- Create Reminder Shortcut -->
        <button 
          onclick="window.openCreateReminderModal()" 
          class="px-2.5 py-1 rounded-lg bg-primary text-on-primary font-bold text-[11px] flex items-center gap-1 shrink-0 active:scale-95 transition-all shadow-xs"
          title="Create New Scheduled Medication Reminder"
        >
          <span class="material-symbols-outlined text-[14px]">alarm_add</span>
          <span>+ New Reminder</span>
        </button>
        
        <!-- Paracetamol 9AM Trigger -->
        <button 
          onclick="window.triggerMedicineReminder('med-1')" 
          class="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-300 font-semibold flex items-center gap-1 shrink-0 active:scale-95 transition-all border border-emerald-500/30"
          title="Trigger Paracetamol (09:00 AM)"
        >
          <span class="material-symbols-outlined text-[13px]">medication</span>
          <span>Paracetamol (9 AM)</span>
        </button>

        <!-- Metformin 2PM Trigger -->
        <button 
          onclick="window.triggerMedicineReminder('med-2')" 
          class="px-2 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/40 text-teal-300 font-semibold flex items-center gap-1 shrink-0 active:scale-95 transition-all border border-teal-500/30"
          title="Trigger Metformin (02:00 PM)"
        >
          <span class="material-symbols-outlined text-[13px]">medication</span>
          <span>Metformin (2 PM)</span>
        </button>

        <!-- Atorvastatin 8PM Trigger -->
        <button 
          onclick="window.triggerMedicineReminder('med-3')" 
          class="px-2 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-300 font-semibold flex items-center gap-1 shrink-0 active:scale-95 transition-all border border-indigo-500/30"
          title="Trigger Atorvastatin (08:00 PM)"
        >
          <span class="material-symbols-outlined text-[13px]">medication</span>
          <span>Atorvastatin (8 PM)</span>
        </button>

        <!-- Scan Rx Shortcut -->
        <button 
          onclick="window.openScannerModal()" 
          class="px-2 py-1 rounded-lg bg-primary/20 hover:bg-primary/40 text-primary-fixed font-semibold flex items-center gap-1 shrink-0 active:scale-95 transition-all border border-primary/30"
          title="Simulate Prescription Scanner"
        >
          <span class="material-symbols-outlined text-[13px]">document_scanner</span>
          <span>Scan Rx</span>
        </button>

        <!-- Voice Call Shortcut -->
        <button 
          onclick="window.openVoiceCallModal()" 
          class="px-2 py-1 rounded-lg bg-secondary/20 hover:bg-secondary/40 text-secondary-fixed font-semibold flex items-center gap-1 shrink-0 active:scale-95 transition-all border border-secondary/30"
          title="Simulate AI Phone Call Reminder"
        >
          <span class="material-symbols-outlined text-[13px]">ring_volume</span>
          <span>Voice Call</span>
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
