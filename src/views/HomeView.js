import { store } from '../state/store.js';
import { t } from '../utils/i18n.js';
import { speech } from '../utils/speech.js';

export function renderHomeView(state) {
  const lang = state.currentLanguage;
  const patient = state.patient;
  const vitals = state.vitals;
  const primaryMed = state.medications.find(m => m.id === 'med-1') || state.medications[0];
  const isTaken = primaryMed && primaryMed.status === 'taken';

  // Calculate adherence
  const totalMeds = state.medications.length;
  const takenMeds = state.medications.filter(m => m.status === 'taken').length;
  const medPercent = Math.round((takenMeds / totalMeds) * 100);

  // SVG dash offset calculation for Score (Radius 40, circumference 251.2)
  const scoreOffset = 251.2 - (251.2 * (vitals.score / 100));

  return `
    <div class="flex flex-col w-full space-y-3.5 px-4 py-3 view-enter">
      
      <!-- Arvind Greeting Banner -->
      <section class="flex flex-col space-y-1">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            <span class="text-[16px] font-bold text-primary flex items-center">
              ${t('greeting', lang)} <span class="ml-1 inline-block animate-bounce">👋</span>
            </span>
            <span class="text-[10px] px-2 py-0.2 rounded-full bg-secondary-container text-on-secondary-container font-bold">
              ${lang === 'te' ? 'Good Morning' : 'శుభోదయం'}
            </span>
          </div>
          <div class="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container shadow-xs border border-outline-variant/30">
            <span class="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
            <span class="text-[10px] text-on-surface font-semibold">${t('vitalsSynced', lang)}</span>
          </div>
        </div>
        
        <h1 class="text-[24px] font-extrabold text-on-surface tracking-tight leading-tight">
          ${patient.name}
        </h1>

        <div class="inline-flex items-center gap-1.5 self-start px-2 py-0.5 rounded-full bg-secondary-container/50 text-secondary text-[11px] font-semibold border border-secondary/20">
          <span class="material-symbols-outlined text-[14px]">verified_user</span>
          <span>${t('safetyNotice', lang)}</span>
        </div>
      </section>

      <!-- Health Gauge Bento Card -->
      <section class="w-full rounded-2xl bg-surface-container-lowest p-3.5 shadow-sm relative overflow-hidden border border-surface-container-high/60 cursor-pointer hover:border-primary/40 transition-all" onclick="window.navigateTab('health')">
        <div class="absolute -right-8 -top-8 w-36 h-36 bg-primary-fixed/40 rounded-full blur-2xl pointer-events-none"></div>
        
        <div class="flex items-center justify-between mb-1.5">
          <div class="flex flex-col">
            <span class="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">${t('healthScore', lang)}</span>
            <span class="text-[16px] text-on-surface font-bold">${t('healthCondition', lang)}</span>
          </div>
          <span class="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold flex items-center gap-1 shadow-xs">
            <span class="material-symbols-outlined text-[13px]">check_circle</span> ${t('healthStatusGood', lang)}
          </span>
        </div>

        <div class="flex items-center gap-3 py-0.5">
          <!-- SVG Animated Ring -->
          <div class="relative w-20 h-20 shrink-0 flex items-center justify-center">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle class="text-surface-container-high" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" stroke-width="8"></circle>
              <circle 
                class="transition-all duration-1000 ease-out" 
                cx="50" 
                cy="50" 
                fill="transparent" 
                id="score-circle" 
                r="40" 
                stroke="url(#score-gradient)" 
                stroke-dasharray="251.2" 
                stroke-dashoffset="${scoreOffset}" 
                stroke-linecap="round" 
                stroke-width="8"
              ></circle>
              <defs>
                <linearGradient id="score-gradient" x1="0%" x2="100%" y1="0%" y2="100%">
                  <stop offset="0%" stop-color="#00855b"></stop>
                  <stop offset="100%" stop-color="#007bb9"></stop>
                </linearGradient>
              </defs>
            </svg>
            <div class="absolute flex flex-col items-center">
              <span class="text-[22px] font-extrabold text-on-surface leading-none">${vitals.score}</span>
              <span class="text-[9px] text-on-surface-variant font-bold">/ 100</span>
            </div>
          </div>

          <div class="flex flex-col justify-center space-y-0.5 min-w-0 flex-1">
            <div class="flex items-center gap-1 text-secondary">
              <span class="material-symbols-outlined text-[15px]">ecg_heart</span>
              <span class="text-[12px] font-bold truncate">${t('vitalsSteady', lang)}</span>
            </div>
            <p class="text-[11px] text-on-surface-variant leading-snug">
              ${t('vitalsSteadyDesc', lang)}
            </p>
            <div class="flex items-center gap-1.5 pt-0.5">
              <span class="inline-flex items-center gap-1 text-[10px] text-primary font-bold">
                <span class="material-symbols-outlined text-[12px]">schedule</span> 09:00 AM Today
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Upcoming Dose Card (Interactive & Opens Medicine Details) -->
      <section class="w-full rounded-2xl bg-gradient-to-br from-surface-container-high/90 to-surface-container-lowest p-3.5 shadow-sm transition-all duration-300 border border-primary/20 ${isTaken ? 'bg-tertiary-container/10 border-tertiary/30' : ''}" id="home-dose-card">
        <div class="flex items-start justify-between gap-2">
          <div class="flex items-center gap-2 cursor-pointer" onclick="window.openMedicineDetailsById('${primaryMed.id}')">
            <div class="w-9 h-9 rounded-xl ${isTaken ? 'bg-tertiary' : 'bg-primary'} text-on-primary flex items-center justify-center shrink-0 shadow-xs">
              <span class="material-symbols-outlined text-[20px]">${isTaken ? 'check_circle' : 'pill'}</span>
            </div>
            <div>
              <span class="text-[10px] ${isTaken ? 'text-tertiary' : 'text-primary'} font-bold uppercase tracking-wider block">
                ${isTaken ? 'Logged Dose' : t('upcomingDose', lang)}
              </span>
              <h2 class="text-[15px] text-on-surface font-bold hover:text-primary transition-colors flex items-center gap-1">
                <span>${primaryMed.name} ${primaryMed.strength}</span>
                <span class="material-symbols-outlined text-[13px] text-outline">info</span>
              </h2>
            </div>
          </div>
          <span class="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold shrink-0">
            ${lang === 'te' ? primaryMed.instructionTe : (lang === 'hi' ? primaryMed.instructionHi : (lang === 'ta' ? primaryMed.instructionTa : primaryMed.instruction))}
          </span>
        </div>

        <p class="text-[12px] text-on-surface-variant mt-1.5 mb-2.5 flex items-center gap-1">
          <span class="material-symbols-outlined text-[15px] text-primary">info</span>
          <span>${t('doseDesc', lang)}</span>
        </p>

        <!-- Interactive Dose Buttons -->
        ${!isTaken ? `
          <div class="grid grid-cols-2 gap-2" id="home-dose-actions">
            <button 
              class="h-10 rounded-xl bg-tertiary-container text-on-tertiary flex items-center justify-center gap-1.5 text-[12px] font-bold shadow-xs active:scale-95 transition-all hover:bg-tertiary" 
              type="button"
              onclick="window.handleMarkTaken('${primaryMed.id}')"
            >
              <span class="material-symbols-outlined text-[16px]">check</span>
              <span>${t('markTaken', lang)}</span>
            </button>
            <button 
              class="h-10 rounded-xl bg-surface-container-highest text-on-surface flex items-center justify-center gap-1.5 text-[12px] font-bold active:scale-95 transition-all hover:bg-surface-variant" 
              type="button"
              onclick="window.handleSnoozeDose('${primaryMed.id}')"
            >
              <span class="material-symbols-outlined text-[16px] text-on-surface-variant">schedule</span>
              <span>${t('remindLater', lang)}</span>
            </button>
          </div>
        ` : `
          <div class="flex items-center justify-between p-2.5 rounded-xl bg-tertiary-container/20 text-tertiary text-[12px] font-bold border border-tertiary/30">
            <span class="flex items-center gap-1">
              <span class="material-symbols-outlined text-[16px]">verified</span>
              <span>Morning dose logged at ${primaryMed.loggedTime || '08:15 AM'}</span>
            </span>
            <button class="underline text-primary font-bold ml-2 text-xs" onclick="window.handleUndoDose('${primaryMed.id}')">
              ${t('undo', lang)}
            </button>
          </div>
        `}
      </section>

      <!-- Quick Statistics Grid (2x2) -->
      <section class="grid grid-cols-2 gap-2.5">
        <!-- Stat 1: Medication -->
        <div class="rounded-2xl bg-surface-container-lowest p-3 shadow-xs border border-surface-container-high/60 flex flex-col justify-between space-y-2 cursor-pointer hover:border-primary/40 transition-all" onclick="window.navigateTab('medicines')">
          <div class="flex items-center justify-between">
            <div class="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span class="material-symbols-outlined text-[18px]">medication</span>
            </div>
            <span class="text-[10px] font-bold text-tertiary flex items-center gap-0.5">
              <span class="material-symbols-outlined text-[12px]">check</span> ${medPercent}%
            </span>
          </div>
          <div>
            <span class="text-[10px] text-on-surface-variant block font-medium">${t('medicationStat', lang)}</span>
            <span class="text-[16px] text-on-surface font-extrabold">${takenMeds} / ${totalMeds}</span>
            <span class="text-[9px] text-on-surface-variant block">${t('confirmed', lang)}</span>
          </div>
          <div class="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
            <div class="bg-tertiary h-1.5 rounded-full transition-all duration-700" style="width: ${medPercent}%"></div>
          </div>
        </div>

        <!-- Stat 2: Next Reminder -->
        <div class="rounded-2xl bg-surface-container-lowest p-3 shadow-xs border border-surface-container-high/60 flex flex-col justify-between space-y-2 cursor-pointer hover:border-secondary/40 transition-all" onclick="window.openReminderModal()">
          <div class="flex items-center justify-between">
            <div class="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-secondary">
              <span class="material-symbols-outlined text-[18px]">alarm</span>
            </div>
            <span class="px-1.5 py-0.2 rounded bg-secondary-container/70 text-on-secondary-container text-[9px] font-bold">
              ${t('afterFood', lang)}
            </span>
          </div>
          <div>
            <span class="text-[10px] text-on-surface-variant block font-medium">${t('nextReminder', lang)}</span>
            <span class="text-[16px] text-on-surface font-extrabold">09:00 AM</span>
            <p class="text-[9px] text-on-surface-variant truncate font-medium">Paracetamol 500mg</p>
          </div>
          <div class="flex items-center text-primary text-[9px] font-bold">
            <span class="material-symbols-outlined text-[11px] mr-0.5">timer</span> 45 ${t('minLeft', lang)} (Tap)
          </div>
        </div>

        <!-- Stat 3: Medical Reports -->
        <div class="rounded-2xl bg-surface-container-lowest p-3 shadow-xs border border-surface-container-high/60 flex flex-col justify-between space-y-2 cursor-pointer hover:border-primary/40 transition-all" onclick="window.navigateTab('reports')">
          <div class="flex items-center justify-between">
            <div class="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span class="material-symbols-outlined text-[18px]">lab_profile</span>
            </div>
            <span class="w-2 h-2 rounded-full bg-primary-container animate-ping"></span>
          </div>
          <div>
            <span class="text-[10px] text-on-surface-variant block font-medium">${t('medicalReports', lang)}</span>
            <span class="text-[16px] text-on-surface font-extrabold">3 ${t('activeReports', lang)}</span>
            <p class="text-[9px] text-primary font-bold truncate">CBC Panel Analyzed</p>
          </div>
          <div class="flex items-center gap-1 text-on-surface-variant text-[9px] font-semibold">
            <span class="material-symbols-outlined text-[11px] text-tertiary">check_circle</span> ${t('aiParsed', lang)}
          </div>
        </div>

        <!-- Stat 4: Caregiver -->
        <div class="rounded-2xl bg-surface-container-lowest p-3 shadow-xs border border-surface-container-high/60 flex flex-col justify-between space-y-2 cursor-pointer hover:border-tertiary/40 transition-all" onclick="window.navigateTab('profile')">
          <div class="flex items-center justify-between">
            <div class="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-tertiary">
              <span class="material-symbols-outlined text-[18px]">supervisor_account</span>
            </div>
            <span class="text-[9px] text-tertiary font-bold flex items-center">
              ${state.caregiver.status}
            </span>
          </div>
          <div>
            <span class="text-[10px] text-on-surface-variant block font-medium">${t('caregiver', lang)}</span>
            <span class="text-[15px] text-on-surface font-extrabold truncate block">${state.caregiver.name}</span>
            <p class="text-[9px] text-on-surface-variant font-medium">${t('notificationsOn', lang)}</p>
          </div>
          <div class="flex items-center text-secondary text-[9px] font-bold">
            <span class="material-symbols-outlined text-[11px] mr-0.5">notifications_active</span> ${t('autoAlertReady', lang)}
          </div>
        </div>
      </section>

      <!-- Routine Tip Contextual Card -->
      <section class="w-full rounded-2xl overflow-hidden shadow-xs bg-surface-container-low flex flex-col border border-surface-container-high/60">
        <div class="relative w-full h-24 bg-cover bg-center" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuCDY2W_0EoZ1Wc83c9BuG5f1FjjyY2GLU_l95j4k9ptbOmojofv14qt9mf91qpZ8S6el4WSA1gYx63gKT2c5T3e-CybD8748x4WUXPKXTtFt2tIxwGO720C1Sc74FDUlVk_xJXH7sDdSCano-FE6nXx7wV00IoFIAGss5Pyu1yMFzTCBnTDU5AakKQ5e2l6QXJS-mFa8qplrSDZAWEnx0mHGDEdz9Xy0qbfslQK6zsMYlbwihvqzDEU')">
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
          <div class="absolute bottom-1.5 left-2.5 flex items-center gap-2">
            <span class="px-2 py-0.2 rounded-full bg-white/90 backdrop-blur-sm text-primary text-[9px] font-extrabold shadow-xs">
              Daily Health Tip
            </span>
          </div>
        </div>
        <div class="p-2.5 bg-surface-container-lowest flex items-center justify-between">
          <div class="min-w-0 pr-2">
            <span class="text-[13px] text-on-surface font-bold block truncate">Hydration &amp; Morning Walk</span>
            <span class="text-[10px] text-on-surface-variant">20 mins walked • ${vitals.waterLiters}L Water Logged</span>
          </div>
          <button 
            class="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary shrink-0 active:scale-90 transition-transform shadow-xs hover:bg-primary-fixed"
            title="Log +250ml Water"
            onclick="window.handleLogWater()"
          >
            <span class="material-symbols-outlined text-[16px]">add</span>
          </button>
        </div>
      </section>

      <!-- Quick Actions Grid -->
      <section class="space-y-1.5">
        <div class="flex items-center justify-between">
          <h2 class="text-[15px] font-bold text-on-surface">${t('quickActions', lang)}</h2>
          <span class="text-[11px] text-primary font-semibold">${t('allTools', lang)}</span>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <!-- Action 1: Medicines -->
          <button 
            class="p-3 rounded-2xl bg-surface-container-lowest shadow-xs border border-surface-container-high/60 flex flex-col items-start text-left space-y-1 active:scale-98 hover:border-primary/40 transition-all" 
            type="button"
            onclick="window.navigateTab('medicines')"
          >
            <div class="w-9 h-9 rounded-xl bg-primary-fixed text-primary flex items-center justify-center shadow-xs">
              <span class="material-symbols-outlined text-[20px]">pill</span>
            </div>
            <div>
              <span class="text-[13px] text-on-surface font-bold block">${t('actionMedicines', lang)}</span>
              <span class="text-[10px] text-on-surface-variant">${t('actionMedicinesSub', lang)}</span>
            </div>
          </button>

          <!-- Action 2: Scan Rx with pulse badge -->
          <button 
            class="p-3 rounded-2xl bg-surface-container-lowest shadow-xs border border-surface-container-high/60 flex flex-col items-start text-left space-y-1 relative overflow-hidden active:scale-98 hover:border-secondary/40 transition-all" 
            type="button"
            onclick="window.openScannerModal()"
          >
            <div class="absolute top-2 right-2 flex items-center gap-0.5 bg-error-container text-on-error-container px-1.5 py-0.2 rounded-full text-[9px] font-extrabold shadow-xs">
              <span class="w-1 h-1 rounded-full bg-error animate-ping"></span> AI
            </div>
            <div class="w-9 h-9 rounded-xl bg-secondary-container text-secondary flex items-center justify-center shadow-xs">
              <span class="material-symbols-outlined text-[20px]">document_scanner</span>
            </div>
            <div>
              <span class="text-[13px] text-on-surface font-bold block">${t('actionScanRx', lang)}</span>
              <span class="text-[10px] text-on-surface-variant">${t('actionScanRxSub', lang)}</span>
            </div>
          </button>

          <!-- Action 3: Health Track -->
          <button 
            class="p-3 rounded-2xl bg-surface-container-lowest shadow-xs border border-surface-container-high/60 flex flex-col items-start text-left space-y-1 active:scale-98 hover:border-tertiary/40 transition-all" 
            type="button"
            onclick="window.navigateTab('health')"
          >
            <div class="w-9 h-9 rounded-xl bg-tertiary-fixed text-tertiary flex items-center justify-center shadow-xs">
              <span class="material-symbols-outlined text-[20px]">favorite</span>
            </div>
            <div>
              <span class="text-[13px] text-on-surface font-bold block">${t('actionHealthTrack', lang)}</span>
              <span class="text-[10px] text-on-surface-variant">${t('actionHealthTrackSub', lang)}</span>
            </div>
          </button>

          <!-- Action 4: Reports -->
          <button 
            class="p-3 rounded-2xl bg-surface-container-lowest shadow-xs border border-surface-container-high/60 flex flex-col items-start text-left space-y-1 active:scale-98 hover:border-primary/40 transition-all" 
            type="button"
            onclick="window.navigateTab('reports')"
          >
            <div class="w-9 h-9 rounded-xl bg-surface-container-high text-primary flex items-center justify-center shadow-xs">
              <span class="material-symbols-outlined text-[20px]">description</span>
            </div>
            <div>
              <span class="text-[13px] text-on-surface font-bold block">${t('actionReports', lang)}</span>
              <span class="text-[10px] text-on-surface-variant">${t('actionReportsSub', lang)}</span>
            </div>
          </button>
        </div>

        <!-- Full-Width Card: Ask MediSathi AI with Voice Waveform -->
        <div class="rounded-2xl bg-gradient-to-r from-primary to-primary-container p-3.5 shadow-md text-on-primary relative overflow-hidden mt-1.5">
          <div class="absolute -right-6 -bottom-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2.5 cursor-pointer" onclick="window.navigateTab('ai')">
              <div class="w-10 h-10 rounded-xl bg-on-primary/15 flex items-center justify-center text-on-primary shadow-inner">
                <span class="material-symbols-outlined text-[22px]">smart_toy</span>
              </div>
              <div>
                <div class="flex items-center gap-1.5">
                  <h3 class="text-[14px] font-bold text-on-primary">${t('askAssistant', lang)}</h3>
                  <span class="px-1.5 py-0.2 rounded-full bg-white/20 text-white text-[9px] font-bold">తెలుగు / EN</span>
                </div>
                <p class="text-[10px] text-on-primary/85 leading-snug">${t('askAssistantSub', lang)}</p>
              </div>
            </div>

            <button 
              aria-label="Start Voice Query" 
              class="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center shadow-md active:scale-90 transition-all shrink-0 hover:bg-slate-100" 
              id="voice-assistant-btn" 
              type="button"
              onclick="window.toggleHomeVoiceWave()"
            >
              <span class="material-symbols-outlined text-[20px]" id="home-mic-icon">mic</span>
            </button>
          </div>

          <!-- Interactive Voice Wave Simulator -->
          <div class="hidden mt-2.5 pt-2 border-t border-white/20 flex flex-col space-y-1.5" id="home-voice-wave-container">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-1">
                <span class="w-1 bg-white rounded-full h-3 wave-bar-1"></span>
                <span class="w-1 bg-white rounded-full h-5 wave-bar-2"></span>
                <span class="w-1 bg-white rounded-full h-2 wave-bar-3"></span>
                <span class="w-1 bg-white rounded-full h-6 wave-bar-4"></span>
                <span class="w-1 bg-white rounded-full h-4 wave-bar-5"></span>
                <span class="w-1 bg-white rounded-full h-3 wave-bar-6"></span>
              </div>
              <span class="text-[10px] text-white/95 font-medium italic animate-pulse">
                ${t('listeningPrompt', lang)}
              </span>
              <button class="text-white text-[10px] font-bold px-2 py-0.5 rounded bg-white/20 hover:bg-white/30" onclick="window.toggleHomeVoiceWave()">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Clinical & Legal Disclaimer Pill -->
      <footer class="p-3 rounded-xl bg-surface-container text-on-surface-variant flex items-start gap-2 border border-surface-container-high/60">
        <span class="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">verified_user</span>
        <p class="text-[10px] leading-relaxed">
          <span class="font-bold text-on-surface">Medical Guidance Notice:</span> ${t('safetyLong', lang)}
        </p>
      </footer>

    </div>
  `;
}
