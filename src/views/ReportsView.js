import { store } from '../state/store.js';
import { t } from '../utils/i18n.js';
import { speech } from '../utils/speech.js';
import { showToast } from '../components/Toast.js';

let activeReportLang = 'en'; // 'en' | 'te' | 'hi' | 'ta'
let isAudioPlaying = false;

export function renderReportsView(state) {
  const lang = state.currentLanguage;
  const currentReportId = state.selectedReportId || 'rep-cbc';
  const currentReport = state.reports.find(r => r.id === currentReportId) || state.reports[0];

  return `
    <div class="flex flex-col w-full px-4 py-3 space-y-3.5 view-enter">
      
      <!-- Top Title & Upload Actions -->
      <div class="flex flex-col space-y-1.5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Diagnostics &amp; Lab Data</p>
            <h1 class="text-[22px] font-extrabold text-on-surface leading-tight">${t('reportsTitle', lang)}</h1>
          </div>
          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-bold shadow-xs border border-primary/20">
            <span class="material-symbols-outlined text-[14px]">verified</span>
            <span>${state.reports.length} Reports</span>
          </span>
        </div>

        <!-- Action Buttons: Upload & Scan Report -->
        <div class="grid grid-cols-2 gap-2 pt-0.5">
          <!-- Hidden real file input for actual device upload -->
          <input type="file" id="report-file-uploader" class="hidden" accept=".pdf,image/*" onchange="window.handleRealReportFile(event)" />
          
          <button 
            class="h-10 rounded-xl bg-primary text-on-primary font-bold text-[12px] flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all hover:bg-primary-container"
            onclick="document.getElementById('report-file-uploader').click()"
          >
            <span class="material-symbols-outlined text-[16px]">cloud_upload</span>
            <span>${t('uploadReport', lang)}</span>
          </button>

          <button 
            class="h-10 rounded-xl bg-secondary-container text-on-secondary-container font-bold text-[12px] flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all hover:bg-secondary-container/80"
            onclick="window.openScannerModal()"
          >
            <span class="material-symbols-outlined text-[16px]">document_scanner</span>
            <span>${t('scanReport', lang)}</span>
          </button>
        </div>
      </div>

      <!-- AI Medical Report Simplifier Section (Stitch Source of Truth) -->
      <section class="rounded-2xl bg-surface-container-low p-3.5 shadow-xs border border-surface-container-high/60 space-y-2.5">
        <div class="flex items-center justify-between">
          <span class="inline-flex items-center gap-1 px-2 py-0.2 rounded-full bg-primary/15 text-primary text-[10px] font-bold">
            <span class="material-symbols-outlined text-[13px]">description</span>
            <span>${currentReport.title}</span>
          </span>
          <span class="text-[10px] text-outline font-medium">${currentReport.date}</span>
        </div>

        <div>
          <h2 class="text-[16px] font-bold text-on-surface">${t('reportAnalysis', lang)}</h2>
          <p class="text-[11px] text-on-surface-variant font-medium">${currentReport.subtitle}</p>
        </div>

        <!-- Realtime Processing Tracker Pipeline -->
        <div class="pt-0.5">
          <div class="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar text-[10px] font-bold">
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed shrink-0 shadow-xs">
              <span class="material-symbols-outlined text-[12px]">check_circle</span>
              <span>${t('readingReport', lang)}</span>
            </span>
            <span class="text-outline-variant shrink-0">→</span>
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed shrink-0 shadow-xs">
              <span class="material-symbols-outlined text-[12px]">check_circle</span>
              <span>${t('extractingParams', lang)}</span>
            </span>
            <span class="text-outline-variant shrink-0">→</span>
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed shrink-0 shadow-xs">
              <span class="material-symbols-outlined text-[12px] animate-spin">sync</span>
              <span>${t('analyzingAI', lang)}</span>
            </span>
          </div>
        </div>
      </section>

      <!-- Key Lab Parameter Bento Card -->
      <section class="bg-surface-container-lowest rounded-2xl p-3.5 shadow-sm space-y-2.5 relative overflow-hidden border border-surface-container-high/60">
        <div class="flex items-start justify-between">
          <div class="space-y-0.5">
            <div class="flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full ${currentReport.rangeStatus === 'normal' ? 'bg-tertiary' : 'bg-error'} animate-pulse"></span>
              <span class="text-[9px] text-on-surface-variant uppercase tracking-wider font-extrabold">${t('primaryBiomarker', lang)}</span>
            </div>
            <h3 class="text-[16px] font-extrabold text-on-surface">${currentReport.biomarker}</h3>
            <p class="text-[10px] text-outline font-medium">${currentReport.description}</p>
          </div>
          <div class="px-2 py-0.5 rounded-xl ${currentReport.rangeStatus === 'normal' ? 'bg-tertiary-container text-on-tertiary' : 'bg-error-container text-on-error-container'} text-[11px] font-bold flex items-center gap-1 shadow-xs">
            <span class="material-symbols-outlined text-[14px]">${currentReport.rangeStatus === 'normal' ? 'check_circle' : 'warning'}</span>
            <span>${currentReport.rangeStatus === 'normal' ? t('withinRange', lang) : t('belowRange', lang)}</span>
          </div>
        </div>

        <!-- Gauge & Numbers -->
        <div class="bg-surface-container rounded-xl p-2.5 flex items-center justify-between gap-2.5 border border-surface-container-high/40">
          <div>
            <div class="text-[10px] text-on-surface-variant font-medium">${t('yourValue', lang)}</div>
            <div class="text-[22px] font-extrabold ${currentReport.rangeStatus === 'normal' ? 'text-tertiary' : 'text-error'} tracking-tight leading-none pt-0.5">
              ${currentReport.value} <span class="text-[11px] text-outline font-bold">${currentReport.unit}</span>
            </div>
          </div>
          <div class="h-8 w-px bg-outline-variant/40"></div>
          <div>
            <div class="text-[10px] text-on-surface-variant font-medium">${t('referenceRange', lang)}</div>
            <div class="text-[15px] font-bold text-on-surface leading-none pt-0.5">
              ${currentReport.referenceRange} <span class="text-[11px] text-outline font-medium">${currentReport.unit}</span>
            </div>
          </div>
        </div>

        <!-- Strict Compliance Visual Bar -->
        <div class="space-y-0.5 pt-0.5">
          <div class="flex justify-between text-[9px] text-outline font-bold">
            <span>Low</span>
            <span>Standard Normal Range</span>
            <span>High</span>
          </div>
          <div class="h-2 w-full bg-surface-container-high rounded-full relative overflow-hidden flex shadow-inner">
            <div class="w-[28%] bg-error-container"></div>
            <div class="w-[44%] bg-tertiary-fixed"></div>
            <div class="w-[28%] bg-error-container"></div>
          </div>
          <div class="relative w-full h-3.5">
            <div class="absolute ${currentReport.rangeStatus === 'below' ? 'left-[20%]' : (currentReport.rangeStatus === 'above' ? 'left-[80%]' : 'left-[50%]')} -top-1 flex flex-col items-center">
              <span class="material-symbols-outlined ${currentReport.rangeStatus === 'normal' ? 'text-tertiary' : 'text-error'} text-[14px] leading-none">arrow_drop_up</span>
              <span class="text-[9px] ${currentReport.rangeStatus === 'normal' ? 'text-tertiary' : 'text-error'} font-extrabold -mt-1">${currentReport.value}</span>
            </div>
          </div>
        </div>

        <!-- Mandatory Strict Phrasing Callout -->
        <div class="p-2 rounded-xl ${currentReport.rangeStatus === 'normal' ? 'bg-tertiary-fixed/30 text-on-tertiary-fixed' : 'bg-error-container/30 text-on-error-container'} text-[10px] font-bold flex items-center gap-1.5 border ${currentReport.rangeStatus === 'normal' ? 'border-tertiary/20' : 'border-error/20'}">
          <span class="material-symbols-outlined text-[14px] shrink-0">${currentReport.rangeStatus === 'normal' ? 'check' : 'info'}</span>
          <span>${currentReport.rangeStatus === 'normal' ? 'Within normal reference range shown in this report.' : t('belowRangeNotice', lang)}</span>
        </div>
      </section>

      <!-- SIMPLE EXPLANATION CARD (సరళమైన వివరణ) -->
      <section class="bg-surface-container-lowest rounded-2xl p-3.5 shadow-sm space-y-2.5 border border-surface-container-high/60">
        <div class="flex items-center justify-between border-b border-surface-container-high/40 pb-1.5">
          <div class="flex items-center gap-1.5">
            <div class="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold">
              <span class="material-symbols-outlined text-[18px]">health_and_safety</span>
            </div>
            <div>
              <h4 class="text-[13px] font-bold text-on-surface leading-tight">${t('simpleExplanation', lang)}</h4>
              <span class="text-[9px] text-secondary font-semibold">${t('simpleExplanationSub', lang)}</span>
            </div>
          </div>

          <!-- Language Selector Pill -->
          <div class="flex items-center bg-surface-container p-0.5 rounded-full shadow-inner">
            <button 
              class="px-2 py-0.2 rounded-full text-[9px] font-bold transition-all ${activeReportLang === 'en' ? 'bg-surface text-primary shadow-xs' : 'text-on-surface-variant'}" 
              onclick="window.setReportLanguage('en')"
            >EN</button>
            <button 
              class="px-2 py-0.2 rounded-full text-[9px] font-bold transition-all ${activeReportLang === 'te' ? 'bg-surface text-primary shadow-xs' : 'text-on-surface-variant'}" 
              onclick="window.setReportLanguage('te')"
            >తెలుగు</button>
            <button 
              class="px-2 py-0.2 rounded-full text-[9px] font-bold transition-all ${activeReportLang === 'hi' ? 'bg-surface text-primary shadow-xs' : 'text-on-surface-variant'}" 
              onclick="window.setReportLanguage('hi')"
            >हिंदी</button>
            <button 
              class="px-2 py-0.2 rounded-full text-[9px] font-bold transition-all ${activeReportLang === 'ta' ? 'bg-surface text-primary shadow-xs' : 'text-on-surface-variant'}" 
              onclick="window.setReportLanguage('ta')"
            >தமிழ்</button>
          </div>
        </div>

        <!-- Doctor-like Insight Text Content -->
        <div class="space-y-1.5 bg-surface-container-low p-3 rounded-xl border border-surface-container-high/40">
          <p class="text-[12px] text-on-surface leading-relaxed font-medium">
            ${activeReportLang === 'te' ? currentReport.explanationTe : 
             (activeReportLang === 'hi' ? currentReport.explanationHi : 
             (activeReportLang === 'ta' ? currentReport.explanationTa : currentReport.explanationEn))}
          </p>

          <p class="text-[11px] text-on-surface-variant leading-relaxed">
            <strong class="text-primary font-bold">Clinical Significance:</strong> Regular tracking of biomarkers helps detect metabolic variations early. Follow the lifestyle recommendations from your primary physician.
          </p>

          <!-- Audio Voice Playback Bar -->
          <div class="pt-1.5 flex items-center justify-between border-t border-surface-container-high/40">
            <button 
              class="flex items-center gap-1.5 px-3 py-1 rounded-full ${isAudioPlaying ? 'bg-tertiary text-white animate-pulse' : 'bg-secondary-container text-on-secondary-container'} text-[11px] font-bold active:scale-95 transition-all shadow-xs"
              onclick="window.toggleReportAudio()"
            >
              <span class="material-symbols-outlined text-[15px]">${isAudioPlaying ? 'pause' : 'volume_up'}</span>
              <span>${isAudioPlaying ? 'Playing Audio...' : t('listenAudio', lang)}</span>
            </button>
            <span class="text-[10px] text-outline font-semibold">0:45 min</span>
          </div>
        </div>

        <!-- Mandatory Safety Highlighting Box -->
        <div class="p-2.5 rounded-xl bg-surface-container-high/80 flex items-start gap-2 border border-primary/20">
          <span class="text-[16px] leading-none shrink-0">⚠️</span>
          <p class="text-[10px] text-on-surface leading-snug">
            <strong class="font-bold">${t('safetyNotice', lang)}</strong> ${t('discussDoctorNote', lang)}
          </p>
        </div>

        <!-- PDF Export Button -->
        <button 
          class="w-full h-11 rounded-xl bg-primary-container text-on-primary-container font-bold text-[12px] flex items-center justify-center gap-1.5 shadow-xs active:scale-98 transition-transform hover:bg-primary-container/90"
          onclick="window.simulatePdfDownload()"
        >
          <span class="material-symbols-outlined text-[16px]">download_for_offline</span>
          <span>${t('downloadPdf', lang)}</span>
        </button>
      </section>

      <!-- Other Recent Reports Library (Clickable to switch view) -->
      <section class="space-y-1.5">
        <h3 class="text-[14px] font-bold text-on-surface">${t('recentReports', lang)}</h3>
        
        ${state.reports.map(rep => {
          const isSelected = rep.id === currentReport.id;
          return `
            <div 
              class="p-2.5 rounded-xl ${isSelected ? 'bg-primary-fixed/30 border-2 border-primary' : 'bg-surface-container-lowest border border-surface-container-high/60'} shadow-xs flex items-center justify-between cursor-pointer hover:border-primary/60 transition-all" 
              onclick="window.switchActiveReport('${rep.id}')"
            >
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                  <span class="material-symbols-outlined text-[16px]">lab_profile</span>
                </div>
                <div>
                  <h4 class="text-[12px] font-bold text-on-surface flex items-center gap-1">
                    <span>${rep.title}</span>
                    ${isSelected ? '<span class="text-[9px] text-primary font-bold">(Viewing)</span>' : ''}
                  </h4>
                  <span class="text-[9px] text-on-surface-variant font-medium">${rep.date} • ${rep.biomarker}: ${rep.value} ${rep.unit}</span>
                </div>
              </div>
              <span class="material-symbols-outlined text-outline text-[16px]">${isSelected ? 'check_circle' : 'chevron_right'}</span>
            </div>
          `;
        }).join('')}
      </section>

    </div>
  `;
}

window.setReportLanguage = (l) => {
  activeReportLang = l;
  store.notify();
};

window.switchActiveReport = (reportId) => {
  store.selectReport(reportId);
  showToast(`Loaded ${reportId} for AI simplification`, 'info', 1500);
};

window.toggleReportAudio = () => {
  const currentReportId = store.state.selectedReportId || 'rep-cbc';
  const currentReport = store.state.reports.find(r => r.id === currentReportId) || store.state.reports[0];
  
  if (isAudioPlaying) {
    speech.stop();
    isAudioPlaying = false;
    store.notify();
  } else {
    isAudioPlaying = true;
    store.notify();
    const textToSpeak = activeReportLang === 'te' ? currentReport.explanationTe : 
                        (activeReportLang === 'hi' ? currentReport.explanationHi : 
                        (activeReportLang === 'ta' ? currentReport.explanationTa : currentReport.explanationEn));
    
    speech.speak(textToSpeak, activeReportLang, () => {
      isAudioPlaying = false;
      store.notify();
    });
  }
};

window.handleRealReportFile = (event) => {
  const file = event.target.files && event.target.files[0];
  if (file) {
    showToast(`Analyzing uploaded report: ${file.name}...`, 'info');
    
    setTimeout(() => {
      speech.playChime('success');
      showToast(`Report ${file.name} successfully simplified with AI ✓`, 'success');
    }, 1500);
  }
};

window.simulatePdfDownload = () => {
  showToast('Bilingual Lab Summary downloaded as PDF ✓', 'success');
};
