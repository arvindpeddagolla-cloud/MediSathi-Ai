import { store } from '../state/store.js';
import { t } from '../utils/i18n.js';
import { speech } from '../utils/speech.js';

let isListening = false;
let isAiTyping = false;

export function renderAIAssistantView(state) {
  const lang = state.currentLanguage;
  const messages = state.aiChat;

  return `
    <div class="flex flex-col w-full px-4 py-3 space-y-3.5 view-enter">
      
      <!-- Top Title & Header -->
      <div class="flex flex-col space-y-0.5">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold">Multimodal Clinical AI</p>
            <h1 class="text-[22px] font-extrabold text-on-surface leading-tight">${t('askAboutReport', lang)}</h1>
          </div>
          <span class="px-2 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container text-[10px] font-bold flex items-center gap-1 shadow-xs">
            <span class="w-1.5 h-1.5 rounded-full bg-tertiary-fixed-dim animate-ping"></span>
            <span>${t('online', lang)}</span>
          </span>
        </div>
        <p class="text-[11px] text-on-surface-variant font-medium">${t('instantClarification', lang)}</p>
      </div>

      <!-- Suggested Interactive Prompt Chips -->
      <div class="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar -mx-4 px-4">
        <button 
          class="px-2.5 py-1 rounded-full bg-surface-container-lowest text-primary text-[11px] font-bold shadow-xs whitespace-nowrap active:scale-95 border border-surface-container-high hover:border-primary transition-all flex items-center gap-1 shrink-0"
          onclick="window.sendSuggestedPrompt('What does this test mean?')"
        >
          <span class="material-symbols-outlined text-[14px]">help_outline</span>
          <span>${t('suggestedQ1', lang)}</span>
        </button>

        <button 
          class="px-2.5 py-1 rounded-full bg-surface-container-lowest text-primary text-[11px] font-bold shadow-xs whitespace-nowrap active:scale-95 border border-surface-container-high hover:border-primary transition-all flex items-center gap-1 shrink-0"
          onclick="window.sendSuggestedPrompt('Which values are outside reference range?')"
        >
          <span class="material-symbols-outlined text-[14px]">rule</span>
          <span>${t('suggestedQ2', lang)}</span>
        </button>

        <button 
          class="px-2.5 py-1 rounded-full bg-surface-container-lowest text-secondary text-[11px] font-bold shadow-xs whitespace-nowrap active:scale-95 border border-surface-container-high hover:border-secondary transition-all flex items-center gap-1 shrink-0"
          onclick="window.sendSuggestedPrompt('Explain this report in Telugu (తెలుగులో వివరించండి)')"
        >
          <span class="material-symbols-outlined text-[14px]">translate</span>
          <span>${t('suggestedQ3', lang)}</span>
        </button>
      </div>

      <!-- Simulated AI Conversational Stream -->
      <div class="space-y-2.5 min-h-[260px]" id="chat-messages-container">
        ${messages.map(msg => {
          if (msg.sender === 'user') {
            return `
              <div class="flex justify-end">
                <div class="bg-primary text-on-primary rounded-2xl rounded-tr-xs p-2.5 shadow-xs max-w-[85%] text-[12px] font-medium leading-relaxed">
                  ${msg.textEn}
                  <span class="text-[9px] text-white/70 block text-right mt-0.5">${msg.timestamp}</span>
                </div>
              </div>
            `;
          } else {
            return `
              <div class="flex items-start gap-2">
                <img 
                  class="w-8 h-8 rounded-full shrink-0 shadow-xs mt-0.5 border border-primary/30" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBRJMbKtmFiniHSplHQV5r8eVYgHnEwRIkqIQ7jZZLo6jON4vj2Rx-Bl5GeAAD2sEwrrV2azgfmqsX7QzRDnUOyAqnAxElB7j667mhzwiPesHj_eNoSisbzxrQ_zNY_DrRcEv26hm-Eiy1MLZiF3LavXXmGfFncZv4DlzHwqEJVdQiWFPjqyMWRN7DaG4Qv6g4I7gHtJWjnzPdxrQDvkmXSSdPRKRcL2lLEMiZkx3hSU-nkhkZeGIMl" 
                  alt="MediSathi Clinical Sathi"
                />
                
                <div class="bg-surface-container-lowest rounded-2xl rounded-tl-xs p-3 shadow-xs border border-surface-container-high/60 space-y-2 max-w-[88%]">
                  <div class="flex items-center justify-between gap-2 border-b border-surface-container-high/40 pb-1">
                    <span class="text-[11px] font-bold text-primary flex items-center gap-1">
                      <span class="material-symbols-outlined text-[15px]">smart_toy</span>
                      <span>MediSathi Sathi</span>
                    </span>
                    
                    <!-- Live audio wave simulation -->
                    <div class="flex items-center gap-0.5 h-3 cursor-pointer" onclick="window.speakAiMessage('${encodeURIComponent(msg.textTe || msg.textEn)}')">
                      <span class="w-1 bg-secondary rounded-full h-2 animate-bounce"></span>
                      <span class="w-1 bg-secondary rounded-full h-3 animate-bounce" style="animation-delay: 0.15s"></span>
                      <span class="w-1 bg-secondary rounded-full h-1.5 animate-bounce" style="animation-delay: 0.3s"></span>
                      <span class="material-symbols-outlined text-[13px] text-secondary ml-1">volume_up</span>
                    </div>
                  </div>

                  <!-- Bilingual AI Response Content -->
                  <div class="space-y-1.5">
                    <div class="p-2 rounded-xl bg-surface-container text-on-surface space-y-0.5 text-[11px] border border-surface-container-high/40">
                      <span class="text-[9px] font-extrabold text-secondary tracking-wider block">తెలుగు వివరణ</span>
                      <p class="leading-relaxed font-medium">
                        ${msg.textTe || 'ఈ రిపోర్ట్‌లో చూపించిన విలువ సాధారణ పరిమితి కంటే తక్కువగా ఉంది. మీ వైద్య నిపుణుడితో ఈ ఫలితాన్ని చర్చించండి.'}
                      </p>
                    </div>

                    <p class="text-[11px] text-on-surface leading-relaxed">
                      "${msg.textEn}"
                    </p>
                  </div>

                  <!-- Adherence Citation & Safety Footer -->
                  <div class="flex items-center justify-between pt-1 text-[9px] text-outline font-semibold border-t border-surface-container-high/40">
                    <span class="flex items-center gap-1 text-tertiary">
                      <span class="material-symbols-outlined text-[13px]">check_circle</span>
                      <span>${t('verifiedICMR', lang)}</span>
                    </span>
                  </div>
                </div>
              </div>
            `;
          }
        }).join('')}

        <!-- Real-time Typing / Feedback State -->
        ${isAiTyping ? `
          <div class="flex items-center gap-2 px-3 text-outline text-[11px] font-semibold animate-pulse" id="ai-typing-indicator">
            <span class="material-symbols-outlined text-[15px] animate-spin">autorenew</span>
            <span>${t('typingResponse', lang)}</span>
          </div>
        ` : ''}
      </div>

      <!-- Bottom Interactive Input Dock -->
      <div class="bg-surface-container-lowest rounded-2xl p-1.5 shadow-md border border-surface-container-high/80 flex items-center gap-1.5">
        <button 
          aria-label="Speak your question" 
          class="w-9 h-9 rounded-full ${isListening ? 'bg-error text-white animate-pulse' : 'bg-secondary-container text-on-secondary-container'} flex items-center justify-center shrink-0 active:scale-95 transition-all shadow-xs" 
          type="button"
          onclick="window.toggleSpeechMic()"
        >
          <span class="material-symbols-outlined text-[18px]">${isListening ? 'mic_off' : 'mic'}</span>
        </button>

        <input 
          class="flex-1 bg-transparent border-0 focus:outline-none text-[12px] text-on-surface placeholder:text-outline px-1 min-w-0 font-medium" 
          id="chat-user-input" 
          placeholder="${isListening ? 'Listening to voice query...' : t('askPlaceholder', lang)}" 
          type="text"
          onkeydown="window.handleChatKeyDown(event)"
        />

        <button 
          aria-label="Send Query" 
          class="w-9 h-9 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 active:scale-95 transition-all shadow-xs hover:bg-primary-container"
          type="button"
          onclick="window.sendChatMessage()"
        >
          <span class="material-symbols-outlined text-[16px]">send</span>
        </button>
      </div>

      <!-- Clinical Safety Disclaimer Footer -->
      <footer class="p-2.5 rounded-xl bg-surface-container text-on-surface-variant flex items-start gap-1.5 border border-surface-container-high/60">
        <span class="material-symbols-outlined text-secondary text-[15px] shrink-0 mt-0.5">verified_user</span>
        <p class="text-[9px] leading-relaxed">
          <strong class="font-bold text-on-surface">${t('safetyNotice', lang)}</strong> MediSathi AI translates terminology. It does not provide medical diagnosis or alter treatments.
        </p>
      </footer>

    </div>
  `;
}

window.sendSuggestedPrompt = (promptText) => {
  const input = document.getElementById('chat-user-input');
  if (input) input.value = promptText;
  window.sendChatMessage();
};

window.sendChatMessage = () => {
  const input = document.getElementById('chat-user-input');
  if (!input || !input.value.trim()) return;

  const query = input.value.trim();
  input.value = '';

  store.addAIChat(query, true);

  // Trigger simulated AI thinking
  isAiTyping = true;
  store.notify();

  setTimeout(() => {
    isAiTyping = false;
    let aiResponseEn = "Based on your CBC report, your Hemoglobin is 11.2 g/dL (Below normal reference range of 12.0 - 16.0 g/dL). All other parameters including Platelets (240,000) and White Blood Cells are within normal range. Please consult your physician for dietary advice or iron supplements.";
    let aiResponseTe = "మీ CBC రిపోర్ట్ ప్రకారం, హీమోగ్లోబిన్ 11.2 g/dL గా ఉంది (సాధారణ పరిమితి 12.0 - 16.0 కంటే తక్కువ). ప్లేట్‌లెట్స్ (2.4 లక్షలు) మరియు తెల్ల రక్తకణాలు సాధారణ పరిమితిలోనే ఉన్నాయి. డాక్టర్‌తో చర్చించి తగిన ఆహారం తీసుకోండి.";

    if (query.toLowerCase().includes('telugu') || query.includes('తెలుగు')) {
      aiResponseEn = "Your report shows mild Hemoglobin reduction (11.2 g/dL). Discuss with your healthcare provider.";
      aiResponseTe = "మీ రక్త పరీక్షలో హీమోగ్లోబిన్ కాస్త తక్కువగా ఉంది (11.2 g/dL). దీని వలన కొద్దిగా అలసట అనిపించవచ్చు. డాక్టర్ గారిని సంప్రదించి ఐరన్ పుష్కలంగా ఉండే ఆహారం (పాలకూర, ఖర్జూరం, దానిమ్మ) తీసుకోవడం మంచిది.";
    }

    store.addAIChat({
      sender: 'ai',
      textEn: aiResponseEn,
      textTe: aiResponseTe,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    
    // Auto scroll chat
    setTimeout(() => {
      const container = document.getElementById('chat-messages-container');
      if (container) container.scrollTop = container.scrollHeight;
    }, 100);
  }, 1200);
};

window.handleChatKeyDown = (e) => {
  if (e.key === 'Enter') {
    window.sendChatMessage();
  }
};

window.toggleSpeechMic = () => {
  isListening = !isListening;
  store.notify();
  if (isListening) {
    speech.playChime('reminder');
    setTimeout(() => {
      const input = document.getElementById('chat-user-input');
      if (input) {
        input.value = "మందు ఎప్పుడు వేసుకోవాలి? (When should I take my medicine?)";
      }
      isListening = false;
      store.notify();
    }, 2000);
  }
};

window.speakAiMessage = (encodedText) => {
  const text = decodeURIComponent(encodedText);
  speech.speak(text, 'te');
};
