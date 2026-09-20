import { store } from '../state/store.js';
import { t } from '../utils/i18n.js';
import { showToast } from '../components/Toast.js';

export function renderProfileView(state) {
  const lang = state.currentLanguage;
  const patient = state.patient;
  const caregiver = state.caregiver;
  const channels = state.channels;

  return `
    <div class="flex flex-col w-full px-4 py-3 space-y-3.5 view-enter">
      
      <!-- Profile Header Card -->
      <div class="rounded-2xl bg-surface-container-lowest p-3.5 shadow-xs border border-surface-container-high/60 flex items-center gap-3">
        <div class="relative shrink-0">
          <img 
            alt="${patient.name}" 
            class="w-14 h-14 rounded-full object-cover ring-3 ring-primary/20 shadow-sm" 
            src="${patient.avatarUrl}"
          />
          <span class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-tertiary border-2 border-white rounded-full"></span>
        </div>

        <div class="flex flex-col min-w-0 flex-1">
          <div class="flex items-center justify-between">
            <h1 class="text-[18px] font-extrabold text-on-surface leading-tight truncate">${patient.name}</h1>
            <span class="px-2 py-0.2 rounded-full bg-primary-fixed text-primary text-[9px] font-bold">Patient</span>
          </div>
          <p class="text-[11px] text-on-surface-variant font-medium">${patient.age} Yrs • ${patient.gender} • Blood Group: <strong class="text-primary">${patient.bloodGroup}</strong></p>
          <span class="text-[10px] text-tertiary font-bold flex items-center gap-1 mt-0.5">
            <span class="material-symbols-outlined text-[12px]">verified</span> Active Health Monitoring
          </span>
        </div>
      </div>

      <!-- Caregiver Support Section (Mandatory Requirement) -->
      <section class="rounded-2xl bg-surface-container-lowest p-3.5 shadow-sm border border-surface-container-high/60 space-y-2.5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-tertiary-fixed text-tertiary flex items-center justify-center font-bold">
              <span class="material-symbols-outlined text-[18px]">supervisor_account</span>
            </div>
            <div>
              <h2 class="text-[14px] font-bold text-on-surface leading-tight">${t('caregiverConnected', lang)}</h2>
              <span class="text-[10px] text-tertiary font-bold">${caregiver.status}</span>
            </div>
          </div>
          
          <!-- Caregiver Permission Toggle -->
          <button 
            class="relative w-11 h-6 ${caregiver.permissionActive ? 'bg-tertiary' : 'bg-outline-variant'} rounded-full p-0.5 transition-colors shrink-0"
            onclick="window.handleToggleCaregiver()"
            title="Toggle Caregiver Alert Permission"
          >
            <div class="w-5 h-5 bg-white rounded-full shadow-sm transform ${caregiver.permissionActive ? 'translate-x-5' : 'translate-x-0'} transition-transform"></div>
          </button>
        </div>

        <div class="p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high/40 space-y-1">
          <div class="flex items-center justify-between text-[12px]">
            <span class="font-bold text-on-surface">${caregiver.name}</span>
            <span class="text-primary font-bold text-[11px]">${caregiver.phone}</span>
          </div>
          <p class="text-[10px] text-on-surface-variant leading-relaxed">
            "${t('caregiverDesc', lang)}"
          </p>
          <div class="pt-0.5 flex items-center gap-1 text-[9px] ${caregiver.permissionActive ? 'text-tertiary font-bold' : 'text-on-surface-variant'}">
            <span class="material-symbols-outlined text-[13px]">${caregiver.permissionActive ? 'check_circle' : 'cancel'}</span>
            <span>${caregiver.permissionActive ? t('permissionOn', lang) : t('permissionOff', lang)}</span>
          </div>
        </div>
      </section>

      <!-- Language Preferences (English, Telugu, Hindi, Tamil) -->
      <section class="rounded-2xl bg-surface-container-lowest p-3.5 shadow-sm border border-surface-container-high/60 space-y-2.5">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-full bg-surface-container-high text-primary flex items-center justify-center">
            <span class="material-symbols-outlined text-[16px]">translate</span>
          </div>
          <h2 class="text-[14px] font-bold text-on-surface">${t('preferredLanguage', lang)}</h2>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <button 
            class="p-2.5 rounded-xl border text-left transition-all flex flex-col ${lang === 'en' ? 'border-primary bg-primary-fixed/20 text-primary font-bold shadow-xs' : 'border-surface-container-high bg-surface-container-low text-on-surface'}"
            onclick="window.setLanguage('en')"
          >
            <span class="text-[13px]">English</span>
            <span class="text-[9px] text-on-surface-variant">Default Interface</span>
          </button>

          <button 
            class="p-2.5 rounded-xl border text-left transition-all flex flex-col ${lang === 'te' ? 'border-primary bg-primary-fixed/20 text-primary font-bold shadow-xs' : 'border-surface-container-high bg-surface-container-low text-on-surface'}"
            onclick="window.setLanguage('te')"
          >
            <span class="text-[13px]">తెలుగు</span>
            <span class="text-[9px] text-on-surface-variant">ప్రాధాన్య స్థానిక భాష</span>
          </button>

          <button 
            class="p-2.5 rounded-xl border text-left transition-all flex flex-col ${lang === 'hi' ? 'border-primary bg-primary-fixed/20 text-primary font-bold shadow-xs' : 'border-surface-container-high bg-surface-container-low text-on-surface'}"
            onclick="window.setLanguage('hi')"
          >
            <span class="text-[13px]">हिंदी</span>
            <span class="text-[9px] text-on-surface-variant">राष्ट्रीय भाषा</span>
          </button>

          <button 
            class="p-2.5 rounded-xl border text-left transition-all flex flex-col ${lang === 'ta' ? 'border-primary bg-primary-fixed/20 text-primary font-bold shadow-xs' : 'border-surface-container-high bg-surface-container-low text-on-surface'}"
            onclick="window.setLanguage('ta')"
          >
            <span class="text-[13px]">தமிழ்</span>
            <span class="text-[9px] text-on-surface-variant">தமிழ் மொழி</span>
          </button>
        </div>
      </section>

      <!-- Medication Reminders & Channels Configuration -->
      <section class="rounded-2xl bg-surface-container-lowest p-3.5 shadow-sm border border-surface-container-high/60 space-y-2.5">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-full bg-surface-container-high text-primary flex items-center justify-center">
            <span class="material-symbols-outlined text-[16px]">tune</span>
          </div>
          <h2 class="text-[14px] font-bold text-on-surface">Reminder Channels</h2>
        </div>

        <div class="space-y-1.5">
          <!-- Push Toggle -->
          <div class="flex items-center justify-between p-2 rounded-xl bg-surface-container-low">
            <span class="text-[12px] font-bold text-on-surface">Push Notification Reminders</span>
            <button 
              class="relative w-10 h-5 ${channels.push ? 'bg-primary' : 'bg-outline-variant'} rounded-full p-0.5 transition-colors shrink-0"
              onclick="window.toggleChannel('push')"
            >
              <div class="w-4 h-4 bg-white rounded-full shadow-xs transform ${channels.push ? 'translate-x-5' : 'translate-x-0'} transition-transform"></div>
            </button>
          </div>

          <!-- SMS Toggle -->
          <div class="flex items-center justify-between p-2 rounded-xl bg-surface-container-low">
            <span class="text-[12px] font-bold text-on-surface">SMS Reminders (+91 ...)</span>
            <button 
              class="relative w-10 h-5 ${channels.sms ? 'bg-primary' : 'bg-outline-variant'} rounded-full p-0.5 transition-colors shrink-0"
              onclick="window.toggleChannel('sms')"
            >
              <div class="w-4 h-4 bg-white rounded-full shadow-xs transform ${channels.sms ? 'translate-x-5' : 'translate-x-0'} transition-transform"></div>
            </button>
          </div>

          <!-- Voice Call Toggle -->
          <div class="flex items-center justify-between p-2 rounded-xl bg-surface-container-low">
            <span class="text-[12px] font-bold text-on-surface">Automated AI Voice Calls</span>
            <button 
              class="relative w-10 h-5 ${channels.voiceCall ? 'bg-primary' : 'bg-outline-variant'} rounded-full p-0.5 transition-colors shrink-0"
              onclick="window.toggleChannel('voiceCall')"
            >
              <div class="w-4 h-4 bg-white rounded-full shadow-xs transform ${channels.voiceCall ? 'translate-x-5' : 'translate-x-0'} transition-transform"></div>
            </button>
          </div>
        </div>
      </section>

      <!-- Privacy & Data Security Card -->
      <section class="rounded-2xl bg-surface-container-lowest p-3.5 shadow-xs border border-surface-container-high/60 space-y-1.5">
        <div class="flex items-center gap-1.5 text-primary font-bold text-[13px]">
          <span class="material-symbols-outlined text-[16px]">lock</span>
          <span>${t('privacySecurity', lang)}</span>
        </div>
        <p class="text-[10px] text-on-surface-variant leading-relaxed font-medium">
          ${t('privacyDesc', lang)}
        </p>
      </section>

      <!-- Clinical Safety Disclaimer Footer -->
      <footer class="p-3 rounded-xl bg-surface-container text-on-surface-variant flex items-start gap-2 border border-surface-container-high/60">
        <span class="material-symbols-outlined text-secondary text-[16px] shrink-0 mt-0.5">verified_user</span>
        <p class="text-[10px] leading-relaxed">
          <span class="font-bold text-on-surface">${t('safetyNotice', lang)}</span> ${t('safetyLong', lang)}
        </p>
      </footer>

    </div>
  `;
}

window.handleToggleCaregiver = () => {
  store.toggleCaregiverPermission();
  const isActive = store.state.caregiver.permissionActive;
  showToast(isActive ? 'Caregiver alerts enabled ✓' : 'Caregiver alerts turned off', isActive ? 'success' : 'info');
};
