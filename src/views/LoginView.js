import { store } from '../state/store.js';
import { t } from '../utils/i18n.js';
import { speech } from '../utils/speech.js';
import { showToast } from '../components/Toast.js';

export function renderLoginView(state) {
  const lang = state.currentLanguage;
  const patient = state.patient;

  return `
    <div class="flex flex-col w-full min-h-full px-4 py-5 justify-between view-enter select-none bg-gradient-to-b from-surface via-surface-container-lowest to-surface">
      
      <!-- Top Language Switcher Bar -->
      <div class="w-full flex items-center justify-between pb-2 border-b border-surface-container-high/60">
        <div class="flex items-center gap-1.5 text-[11px] font-bold text-on-surface-variant">
          <span class="material-symbols-outlined text-[16px] text-primary">translate</span>
          <span>${t('selectLanguage', lang)}</span>
        </div>
        
        <div class="flex items-center gap-1">
          <button 
            type="button"
            onclick="window.setLanguage('en')" 
            class="px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${lang === 'en' ? 'bg-primary text-white shadow-xs scale-105 ring-1 ring-primary-fixed' : 'bg-surface-container text-on-surface hover:bg-surface-container-high'}"
          >
            English
          </button>
          <button 
            type="button"
            onclick="window.setLanguage('te')" 
            class="px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${lang === 'te' ? 'bg-primary text-white shadow-xs scale-105 ring-1 ring-primary-fixed' : 'bg-surface-container text-on-surface hover:bg-surface-container-high'}"
          >
            తెలుగు
          </button>
          <button 
            type="button"
            onclick="window.setLanguage('hi')" 
            class="px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${lang === 'hi' ? 'bg-primary text-white shadow-xs scale-105 ring-1 ring-primary-fixed' : 'bg-surface-container text-on-surface hover:bg-surface-container-high'}"
          >
            हिंदी
          </button>
          <button 
            type="button"
            onclick="window.setLanguage('ta')" 
            class="px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${lang === 'ta' ? 'bg-primary text-white shadow-xs scale-105 ring-1 ring-primary-fixed' : 'bg-surface-container text-on-surface hover:bg-surface-container-high'}"
          >
            தமிழ்
          </button>
        </div>
      </div>

      <!-- App Logo & Branding Centerpiece -->
      <div class="flex flex-col items-center text-center my-auto py-2 space-y-2">
        
        <!-- Animated Brand Logo Container -->
        <div class="relative flex items-center justify-center">
          <div class="w-20 h-20 rounded-3xl bg-white p-1.5 shadow-xl flex items-center justify-center border-2 border-primary/30 ring-4 ring-primary/10">
            <img 
              alt="MediSathi AI Logo" 
              class="w-full h-full object-contain rounded-2xl" 
              src="${patient.logoUrl || 'https://lh3.googleusercontent.com/aida/AEtjO1WZ4Ek0_hdwqIenDjDxDc_rVRVBPUeP6sToNgBd51-s8TWjczcTl_Z18Np1bRXWEpISsaeugiV2uOeziuxD-NxJFqmKnAXIkX6AOV2nez8HyAbGWEFVF77SqU21FCzzLqSqb7vOW6Qnqq1aR3hz9duW_YP7cEDGG4cMhuGxQV0YAepd11ScbGbsIkorC7jqivy83ABGdepp7ok1jDS4qgiQUwVJaPMRi9TO8YOYj3rvQEH9qyikwVgWTA'}"
            />
          </div>
          <span class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[11px] font-bold shadow-md ring-2 ring-surface">
            ✓
          </span>
        </div>

        <div>
          <h1 class="text-[24px] font-extrabold text-on-surface tracking-tight flex items-center justify-center gap-1.5 leading-tight">
            <span>${t('appName', lang)}</span>
          </h1>
          <p class="text-[12px] font-semibold text-primary mt-0.5">
            ${t('tagline', lang)}
          </p>
        </div>

        <div class="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-secondary-container/60 text-secondary text-[11px] font-bold border border-secondary/20">
          <span class="material-symbols-outlined text-[14px]">verified_user</span>
          <span>${t('safetyNotice', lang)}</span>
        </div>
      </div>

      <!-- Login Form Card -->
      <div class="w-full bg-surface-container-lowest p-4 rounded-3xl border border-surface-container-high/70 shadow-lg space-y-3">
        
        <div class="flex items-center justify-between border-b border-surface-container-high/50 pb-2">
          <div class="flex items-center gap-2">
            <span class="material-symbols-outlined text-[18px] text-primary">account_circle</span>
            <span class="text-[13px] font-bold text-on-surface">${t('loginTitle', lang)}</span>
          </div>
          <span class="text-[10px] text-primary font-bold px-2 py-0.5 rounded-full bg-primary/10">Patient Portal</span>
        </div>

        <form id="login-form" onsubmit="event.preventDefault(); window.handleLoginSubmit();" class="space-y-3">
          
          <!-- 1. Full Name Field -->
          <div class="space-y-1">
            <label class="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider block" for="login-name">
              ${t('fullName', lang)}
            </label>
            <div class="flex items-center gap-2 p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high focus-within:border-primary transition-all">
              <span class="material-symbols-outlined text-[18px] text-primary">person</span>
              <input 
                id="login-name" 
                type="text"
                required
                class="flex-1 bg-transparent text-[13px] font-bold text-on-surface focus:outline-none placeholder:text-outline" 
                placeholder="e.g. Arvind" 
                value="${patient.name || 'Arvind'}"
              />
            </div>
          </div>

          <!-- 2. Contact Mobile Number Field -->
          <div class="space-y-1">
            <div class="flex items-center justify-between">
              <label class="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider block" for="login-phone">
                ${t('contactNumber', lang)}
              </label>
              <span class="text-[9px] text-tertiary font-bold flex items-center gap-0.5">
                <span class="material-symbols-outlined text-[11px]">sms</span> Twilio SMS
              </span>
            </div>
            <div class="flex items-center gap-2 p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high focus-within:border-primary transition-all">
              <span class="material-symbols-outlined text-[18px] text-tertiary">phone_android</span>
              <input 
                id="login-phone" 
                type="tel"
                required
                class="flex-1 bg-transparent text-[13px] font-bold text-on-surface focus:outline-none placeholder:text-outline" 
                placeholder="e.g. +91 81068 90663" 
                value="${patient.phone || '+91 81068 90663'}"
              />
            </div>
            <span class="text-[9px] text-on-surface-variant block font-medium">
              ${t('phoneSmsNotice', lang)}
            </span>
          </div>

          <!-- 3. Email Address Field -->
          <div class="space-y-1">
            <label class="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider block" for="login-email">
              ${t('emailAddress', lang)}
            </label>
            <div class="flex items-center gap-2 p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high focus-within:border-primary transition-all">
              <span class="material-symbols-outlined text-[18px] text-secondary">mail</span>
              <input 
                id="login-email" 
                type="email"
                required
                class="flex-1 bg-transparent text-[13px] font-bold text-on-surface focus:outline-none placeholder:text-outline" 
                placeholder="e.g. arvind@medisathi.ai" 
                value="${patient.email || 'arvind@medisathi.ai'}"
              />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="pt-2 space-y-2">
            <!-- Submit Login Button -->
            <button 
              type="submit" 
              class="w-full h-12 rounded-2xl bg-primary text-on-primary font-extrabold text-[14px] flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all hover:bg-primary-container cursor-pointer"
            >
              <span>${t('signInBtn', lang)}</span>
              <span class="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>

            <!-- Instant Demo Fill & Login -->
            <button 
              type="button" 
              class="w-full py-2.5 rounded-xl bg-secondary-container text-on-secondary-container font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-xs active:scale-95 transition-all hover:bg-secondary-container/80 border border-secondary/30 cursor-pointer"
              onclick="window.handleQuickDemoLogin()"
            >
              <span class="material-symbols-outlined text-[16px]">bolt</span>
              <span>${t('demoLoginBtn', lang)}</span>
            </button>
          </div>

        </form>

      </div>

      <!-- Feature Badges Footer -->
      <div class="grid grid-cols-3 gap-2 pt-3 text-center">
        <div class="p-2 rounded-xl bg-surface-container-low border border-surface-container-high/40">
          <span class="material-symbols-outlined text-[18px] text-primary mb-0.5">alarm_on</span>
          <span class="text-[9px] font-bold text-on-surface block">Smart SMS</span>
        </div>
        <div class="p-2 rounded-xl bg-surface-container-low border border-surface-container-high/40">
          <span class="material-symbols-outlined text-[18px] text-secondary mb-0.5">document_scanner</span>
          <span class="text-[9px] font-bold text-on-surface block">AI Scan Rx</span>
        </div>
        <div class="p-2 rounded-xl bg-surface-container-low border border-surface-container-high/40">
          <span class="material-symbols-outlined text-[18px] text-tertiary mb-0.5">record_voice_over</span>
          <span class="text-[9px] font-bold text-on-surface block">Telugu Voice</span>
        </div>
      </div>

    </div>
  `;
}
