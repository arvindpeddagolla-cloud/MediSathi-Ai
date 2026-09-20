import { store } from '../state/store.js';
import { t } from '../utils/i18n.js';
import { renderTrendChart } from '../utils/charts.js';

let selectedMetric = 'heartRate'; // 'heartRate' | 'weight' | 'adherence'

export function renderHealthTrackView(state) {
  const lang = state.currentLanguage;
  const vitals = state.vitals;
  const currentTrendTab = vitals.selectedTrendTab || '7D';

  return `
    <div class="flex flex-col w-full px-4 py-3 space-y-3.5 view-enter">
      
      <!-- Top Title Banner -->
      <div class="flex flex-col space-y-0.5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Biometrics &amp; Vitals</p>
            <h1 class="text-[22px] font-extrabold text-on-surface leading-tight">${t('healthTrackTitle', lang)}</h1>
          </div>
          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold shadow-xs">
            <span class="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
            <span>Live Sync</span>
          </span>
        </div>
      </div>

      <!-- Health Score Hero Banner (82/100) -->
      <section class="w-full rounded-2xl bg-gradient-to-br from-primary to-primary-container p-3.5 shadow-md text-on-primary relative overflow-hidden">
        <div class="absolute -right-8 -bottom-8 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div class="flex items-center justify-between">
          <div class="space-y-0.5">
            <span class="px-2 py-0.2 rounded-full bg-white/20 text-white text-[9px] font-extrabold uppercase tracking-wider">Overall Condition</span>
            <h2 class="text-[20px] font-extrabold leading-tight">Optimal Condition</h2>
            <p class="text-[11px] text-on-primary/80">All daily health targets are steady</p>
          </div>
          <div class="flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 shrink-0 shadow-inner">
            <span class="text-[24px] font-extrabold leading-none">${vitals.score}</span>
            <span class="text-[9px] text-on-primary/80 font-bold">/ 100</span>
          </div>
        </div>
      </section>

      <!-- Vitals Bento Grid -->
      <section class="grid grid-cols-2 gap-2.5">
        <!-- 1. Heart Rate -->
        <div class="p-3 rounded-2xl bg-surface-container-lowest shadow-xs border border-surface-container-high/60 flex flex-col justify-between space-y-1.5 cursor-pointer hover:border-primary/40 transition-all ${selectedMetric === 'heartRate' ? 'ring-2 ring-primary' : ''}" onclick="window.setMetricFilter('heartRate')">
          <div class="flex items-center justify-between">
            <div class="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">favorite</span>
            </div>
            <span class="text-[9px] font-bold text-tertiary">Steady</span>
          </div>
          <div>
            <span class="text-[10px] text-on-surface-variant block font-medium">${t('heartRate', lang)}</span>
            <div class="flex items-baseline gap-1">
              <span class="text-[20px] font-extrabold text-on-surface leading-tight">${vitals.heartRate}</span>
              <span class="text-[10px] text-on-surface-variant font-bold">BPM</span>
            </div>
          </div>
          <!-- Animated ECG Line -->
          <div class="w-full h-4 overflow-hidden bg-surface-container-low rounded-lg flex items-center px-1">
            <svg class="w-full h-3" viewBox="0 0 100 20">
              <path d="M 0 10 L 25 10 L 30 2 L 35 18 L 40 5 L 45 14 L 50 10 L 100 10" fill="none" stroke="#ba1a1a" stroke-width="2" stroke-linecap="round" class="ecg-line" />
            </svg>
          </div>
        </div>

        <!-- 2. Blood Pressure -->
        <div class="p-3 rounded-2xl bg-surface-container-lowest shadow-xs border border-surface-container-high/60 flex flex-col justify-between space-y-1.5">
          <div class="flex items-center justify-between">
            <div class="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">speed</span>
            </div>
            <span class="px-1.5 py-0.2 rounded bg-tertiary-fixed text-on-tertiary-fixed text-[9px] font-bold">${t('normalRange', lang)}</span>
          </div>
          <div>
            <span class="text-[10px] text-on-surface-variant block font-medium">${t('bloodPressure', lang)}</span>
            <div class="flex items-baseline gap-1">
              <span class="text-[20px] font-extrabold text-on-surface leading-tight">${vitals.bloodPressure}</span>
              <span class="text-[10px] text-on-surface-variant font-bold">mmHg</span>
            </div>
          </div>
          <p class="text-[9px] text-on-surface-variant font-medium truncate">Systolic / Diastolic normal</p>
        </div>

        <!-- 3. Weight -->
        <div class="p-3 rounded-2xl bg-surface-container-lowest shadow-xs border border-surface-container-high/60 flex flex-col justify-between space-y-1.5 cursor-pointer hover:border-secondary/40 transition-all ${selectedMetric === 'weight' ? 'ring-2 ring-secondary' : ''}" onclick="window.setMetricFilter('weight')">
          <div class="flex items-center justify-between">
            <div class="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">scale</span>
            </div>
            <span class="text-[9px] font-bold text-secondary">${t('targetKg', lang)}</span>
          </div>
          <div>
            <span class="text-[10px] text-on-surface-variant block font-medium">${t('weight', lang)}</span>
            <div class="flex items-baseline gap-1">
              <span class="text-[20px] font-extrabold text-on-surface leading-tight">${vitals.weight}</span>
              <span class="text-[10px] text-on-surface-variant font-bold">kg</span>
            </div>
          </div>
          <div class="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
            <div class="bg-secondary h-1.5 rounded-full" style="width: 85%"></div>
          </div>
        </div>

        <!-- 4. Sleep -->
        <div class="p-3 rounded-2xl bg-surface-container-lowest shadow-xs border border-surface-container-high/60 flex flex-col justify-between space-y-1.5">
          <div class="flex items-center justify-between">
            <div class="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">bedtime</span>
            </div>
            <span class="text-[9px] font-bold text-indigo-600">Restful</span>
          </div>
          <div>
            <span class="text-[10px] text-on-surface-variant block font-medium">${t('sleep', lang)}</span>
            <div class="flex items-baseline gap-1">
              <span class="text-[20px] font-extrabold text-on-surface leading-tight">${vitals.sleep}</span>
            </div>
          </div>
          <p class="text-[9px] text-on-surface-variant font-medium truncate">${t('deepSleep', lang)}</p>
        </div>

        <!-- 5. Water Intake -->
        <div class="p-3 rounded-2xl bg-surface-container-lowest shadow-xs border border-surface-container-high/60 flex flex-col justify-between space-y-1.5">
          <div class="flex items-center justify-between">
            <div class="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">water_drop</span>
            </div>
            <button 
              class="px-2 py-0.2 rounded-full bg-cyan-600 text-white text-[9px] font-bold active:scale-90 transition-transform shadow-xs"
              onclick="window.handleLogWater()"
            >
              ${t('logWater', lang)}
            </button>
          </div>
          <div>
            <span class="text-[10px] text-on-surface-variant block font-medium">${t('waterIntake', lang)}</span>
            <div class="flex items-baseline gap-1">
              <span class="text-[20px] font-extrabold text-on-surface leading-tight">${vitals.waterLiters}</span>
              <span class="text-[10px] text-on-surface-variant font-bold">/ 2.5 L</span>
            </div>
          </div>
          <div class="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
            <div class="bg-cyan-600 h-1.5 rounded-full transition-all duration-500" style="width: ${Math.min(100, (vitals.waterLiters / 2.5) * 100)}%"></div>
          </div>
        </div>

        <!-- 6. Medication Adherence -->
        <div class="p-3 rounded-2xl bg-surface-container-lowest shadow-xs border border-surface-container-high/60 flex flex-col justify-between space-y-1.5 cursor-pointer hover:border-tertiary/40 transition-all ${selectedMetric === 'adherence' ? 'ring-2 ring-tertiary' : ''}" onclick="window.setMetricFilter('adherence')">
          <div class="flex items-center justify-between">
            <div class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <span class="material-symbols-outlined text-[18px]">medication</span>
            </div>
            <span class="text-[9px] font-bold text-tertiary">Optimal</span>
          </div>
          <div>
            <span class="text-[10px] text-on-surface-variant block font-medium">${t('adherenceRate', lang)}</span>
            <div class="flex items-baseline gap-1">
              <span class="text-[20px] font-extrabold text-tertiary leading-tight">${vitals.adherencePercent}%</span>
            </div>
          </div>
          <p class="text-[9px] text-on-surface-variant font-medium truncate">4-week compliance</p>
        </div>
      </section>

      <!-- Health Trends Section with Timeframe Filters -->
      <section class="rounded-2xl bg-surface-container-lowest p-3.5 shadow-xs border border-surface-container-high/60 space-y-2.5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-[18px] text-primary">monitoring</span>
            <h2 class="text-[14px] font-bold text-on-surface">${t('trends', lang)}</h2>
          </div>
          
          <!-- Timeframe pills (7D, 30D, 3M) -->
          <div class="flex items-center bg-surface-container p-0.5 rounded-full">
            <button 
              class="px-2 py-0.2 rounded-full text-[10px] font-bold transition-all ${currentTrendTab === '7D' ? 'bg-primary text-white shadow-xs' : 'text-on-surface-variant'}" 
              onclick="window.setTrendTimeframe('7D')"
            >${t('days7', lang)}</button>
            <button 
              class="px-2 py-0.2 rounded-full text-[10px] font-bold transition-all ${currentTrendTab === '30D' ? 'bg-primary text-white shadow-xs' : 'text-on-surface-variant'}" 
              onclick="window.setTrendTimeframe('30D')"
            >${t('days30', lang)}</button>
            <button 
              class="px-2 py-0.2 rounded-full text-[10px] font-bold transition-all ${currentTrendTab === '3M' ? 'bg-primary text-white shadow-xs' : 'text-on-surface-variant'}" 
              onclick="window.setTrendTimeframe('3M')"
            >${t('months3', lang)}</button>
          </div>
        </div>

        <!-- Metric Switcher Pills -->
        <div class="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          <button 
            class="px-2.5 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 ${selectedMetric === 'heartRate' ? 'bg-primary text-white' : 'bg-surface-container text-on-surface-variant'}"
            onclick="window.setMetricFilter('heartRate')"
          >
            <span class="material-symbols-outlined text-[14px]">favorite</span>
            <span>Heart Rate</span>
          </button>
          <button 
            class="px-2.5 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 ${selectedMetric === 'weight' ? 'bg-secondary text-white' : 'bg-surface-container text-on-surface-variant'}"
            onclick="window.setMetricFilter('weight')"
          >
            <span class="material-symbols-outlined text-[14px]">scale</span>
            <span>Weight</span>
          </button>
          <button 
            class="px-2.5 py-1 rounded-full text-[11px] font-bold transition-all flex items-center gap-1 ${selectedMetric === 'adherence' ? 'bg-tertiary text-white' : 'bg-surface-container text-on-surface-variant'}"
            onclick="window.setMetricFilter('adherence')"
          >
            <span class="material-symbols-outlined text-[14px]">medication</span>
            <span>Adherence</span>
          </button>
        </div>

        <!-- Interactive Animated SVG Chart -->
        <div class="pt-0.5">
          ${renderTrendChart(selectedMetric, currentTrendTab, lang)}
        </div>

        <div class="flex items-center justify-between text-[10px] text-on-surface-variant pt-1.5 border-t border-surface-container-high/40">
          <span>Continuous telemetry monitored</span>
          <span class="text-tertiary font-bold flex items-center gap-0.5">
            <span class="material-symbols-outlined text-[13px]">check_circle</span> 100% In Range
          </span>
        </div>
      </section>

      <!-- Clinical Safety Disclaimer -->
      <footer class="p-3 rounded-xl bg-surface-container text-on-surface-variant flex items-start gap-2 border border-surface-container-high/60">
        <span class="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">verified_user</span>
        <p class="text-[10px] leading-relaxed">
          <span class="font-bold text-on-surface">${t('safetyNotice', lang)}</span> Trend analysis is descriptive and not diagnostic. Consult your doctor for treatment decisions.
        </p>
      </footer>

    </div>
  `;
}

window.setMetricFilter = (metric) => {
  selectedMetric = metric;
  store.notify();
};

window.setTrendTimeframe = (tab) => {
  store.setTrendTab(tab);
};
