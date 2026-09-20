import { store } from '../state/store.js';
import { t } from '../utils/i18n.js';
import { speech } from '../utils/speech.js';
import { showToast } from '../components/Toast.js';

let callLanguage = 'te'; // 'te' | 'en' | 'hi' | 'ta'
let isCallActive = true;
let isSpeakerOn = true;
let isMuted = false;

export function renderVoiceCallModal(state) {
  const lang = state.currentLanguage;

  return `
    <div class="absolute inset-0 z-50 flex flex-col bg-slate-950 rounded-[inherit] overflow-hidden select-none view-enter">
      <div class="w-full h-full bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 flex flex-col justify-between p-6 text-white relative">
        
        <!-- Top Call Status & Language Bar -->
        <div class="flex flex-col items-center space-y-2">
          <div class="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 text-secondary-fixed text-[11px] font-bold border border-secondary/30">
            <span class="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span>Automated AI Voice Call</span>
          </div>

          <!-- Language Selector for Call -->
          <div class="flex items-center gap-1 bg-slate-800/60 p-1 rounded-full text-[11px]">
            <button 
              class="px-2.5 py-0.5 rounded-full font-bold transition-all ${callLanguage === 'te' ? 'bg-primary text-white shadow-xs' : 'text-slate-400'}"
              onclick="window.setCallLanguage('te')"
            >తెలుగు</button>
            <button 
              class="px-2.5 py-0.5 rounded-full font-bold transition-all ${callLanguage === 'en' ? 'bg-primary text-white shadow-xs' : 'text-slate-400'}"
              onclick="window.setCallLanguage('en')"
            >English</button>
            <button 
              class="px-2.5 py-0.5 rounded-full font-bold transition-all ${callLanguage === 'hi' ? 'bg-primary text-white shadow-xs' : 'text-slate-400'}"
              onclick="window.setCallLanguage('hi')"
            >हिंदी</button>
            <button 
              class="px-2.5 py-0.5 rounded-full font-bold transition-all ${callLanguage === 'ta' ? 'bg-primary text-white shadow-xs' : 'text-slate-400'}"
              onclick="window.setCallLanguage('ta')"
            >தமிழ்</button>
          </div>
        </div>

        <!-- Center Caller Identity & Pulse Rings -->
        <div class="flex flex-col items-center justify-center space-y-3 my-auto">
          <!-- Pulsing Ring Container -->
          <div class="relative w-28 h-28 flex items-center justify-center">
            <div class="absolute inset-0 rounded-full bg-primary/20 call-pulse-ring"></div>
            <div class="absolute inset-2 rounded-full bg-primary/30 animate-ping"></div>
            
            <div class="relative w-20 h-20 rounded-full bg-white p-2 shadow-2xl flex items-center justify-center z-10 border-2 border-primary">
              <img 
                alt="MediSathi AI Logo" 
                class="w-full h-full object-contain" 
                src="${state.patient.logoUrl}"
              />
            </div>
          </div>

          <div class="text-center space-y-1">
            <h2 class="text-[22px] font-extrabold text-white">MediSathi AI</h2>
            <p class="text-[13px] text-primary-fixed font-bold">Medication Reminder Assistant</p>
            <span class="text-[11px] text-slate-400 font-medium">Paracetamol 500 mg • After food</span>
          </div>

          <!-- Animated Speech Waveform -->
          <div class="w-full max-w-[240px] bg-slate-800/80 rounded-2xl p-3 border border-slate-700/60 flex flex-col items-center space-y-1.5 shadow-inner">
            <div class="flex items-center justify-center gap-1.5 h-7">
              <span class="w-1 bg-secondary rounded-full h-3 wave-bar-1"></span>
              <span class="w-1 bg-secondary rounded-full h-5 wave-bar-2"></span>
              <span class="w-1 bg-secondary rounded-full h-2 wave-bar-3"></span>
              <span class="w-1 bg-secondary rounded-full h-6 wave-bar-4"></span>
              <span class="w-1 bg-secondary rounded-full h-4 wave-bar-5"></span>
              <span class="w-1 bg-secondary rounded-full h-7 wave-bar-6"></span>
              <span class="w-1 bg-secondary rounded-full h-3 wave-bar-2"></span>
              <span class="w-1 bg-secondary rounded-full h-5 wave-bar-4"></span>
            </div>
            <span class="text-[10px] text-slate-300 font-medium text-center italic">
              ${callLanguage === 'te' ? 'వాయిస్ అసిస్టెంట్ మాట్లాడుతోంది...' : (callLanguage === 'hi' ? 'वॉइस असिस्टेंट बोल रहा है...' : (callLanguage === 'ta' ? 'குரல் உதவியாளர் பேசுகிறார்...' : 'Voice Assistant speaking...'))}
            </span>
          </div>
        </div>

        <!-- In-Call Actions (1 - Taken, 2 - Remind Later) -->
        <div class="space-y-3 pt-2">
          <div class="grid grid-cols-2 gap-2">
            <button 
              class="h-11 rounded-xl bg-tertiary text-on-tertiary font-bold text-[12px] flex items-center justify-center gap-1.5 shadow-md active:scale-95 hover:bg-tertiary-container transition-all"
              onclick="window.handleCallConfirmTaken()"
            >
              <span class="material-symbols-outlined text-[16px]">check_circle</span>
              <span>1 - Confirm Taken</span>
            </button>

            <button 
              class="h-11 rounded-xl bg-slate-800 text-slate-200 font-bold text-[12px] flex items-center justify-center gap-1.5 active:scale-95 hover:bg-slate-700 transition-all border border-slate-700"
              onclick="window.handleCallRemindLater()"
            >
              <span class="material-symbols-outlined text-[16px]">schedule</span>
              <span>2 - Remind Later</span>
            </button>
          </div>

          <!-- In-Call Peripheral Controls (Mute, Speaker, Decline) -->
          <div class="flex items-center justify-around pt-2 border-t border-slate-800">
            <button 
              class="w-12 h-12 rounded-full ${isMuted ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-300'} flex items-center justify-center active:scale-90 transition-all"
              onclick="window.toggleCallMute()"
              title="Mute Call"
            >
              <span class="material-symbols-outlined text-[20px]">${isMuted ? 'mic_off' : 'mic'}</span>
            </button>

            <!-- End Call Button -->
            <button 
              class="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg active:scale-90 hover:bg-red-700 transition-all"
              onclick="window.endVoiceCall()"
              title="End Call"
            >
              <span class="material-symbols-outlined text-[26px]">call_end</span>
            </button>

            <button 
              class="w-12 h-12 rounded-full ${isSpeakerOn ? 'bg-secondary text-white' : 'bg-slate-800 text-slate-300'} flex items-center justify-center active:scale-90 transition-all"
              onclick="window.toggleCallSpeaker()"
              title="Speaker"
            >
              <span class="material-symbols-outlined text-[20px]">${isSpeakerOn ? 'volume_up' : 'volume_off'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
}

window.setCallLanguage = (l) => {
  callLanguage = l;
  window.speakCallPrompt();
  store.notify();
};

window.speakCallPrompt = () => {
  const prompts = {
    'te': 'నమస్కారం అరవింద్ గారు. ఇది మెడిసాథి AI నుండి మీ మందుల రిమైండర్. పారాసిటమాల్ 500 ఎంజీ ఆహారం తర్వాత వేసుకోవాలి. వేసుకుంటే 1 నొక్కండి, తర్వాత గుర్తుచేయాలంటే 2 నొక్కండి.',
    'en': 'Hello Arvind. This is your MediSathi AI medication reminder. It is time for Paracetamol 500 mg after food. Press 1 for Taken, or 2 to Remind Later.',
    'hi': 'नमस्ते अरविंद जी। यह मेडिसाथी AI दवा रिमाइंडर है। पैरासिटामोल 500 mg भोजन के बाद लेने का समय हो गया है।',
    'ta': 'வணக்கம் அரவிந்த். இது மெடிசாதி AI மருந்து நினைவூட்டல். பாராசிட்டமால் 500 mg உட்கொள்ளவும்.'
  };

  speech.speak(prompts[callLanguage] || prompts.te, callLanguage);
};

window.handleCallConfirmTaken = () => {
  store.markDoseTaken('med-1');
  speech.playChime('success');
  speech.stop();
  store.closeModal();
  showToast('Voice Call confirmed: Paracetamol 500mg logged as TAKEN ✓', 'success');
};

window.handleCallRemindLater = () => {
  store.snoozeDose('med-1');
  speech.stop();
  store.closeModal();
  showToast('Voice Call confirmation: Dose snoozed 15m ⏰', 'info');
};

window.toggleCallMute = () => {
  isMuted = !isMuted;
  store.notify();
};

window.toggleCallSpeaker = () => {
  isSpeakerOn = !isSpeakerOn;
  store.notify();
};

window.endVoiceCall = () => {
  speech.stop();
  store.closeModal();
  showToast('Voice call ended', 'info');
};
