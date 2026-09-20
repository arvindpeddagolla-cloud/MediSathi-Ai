import { store } from '../state/store.js';
import { t } from '../utils/i18n.js';
import { speech } from '../utils/speech.js';
import { showToast } from '../components/Toast.js';

let smsReplies = [];

export function renderSMSExperienceModal(state) {
  const lang = state.currentLanguage;

  return `
    <div class="absolute inset-0 z-50 flex flex-col bg-surface rounded-[inherit] overflow-hidden view-enter">
      <div class="w-full h-full bg-surface flex flex-col relative overflow-hidden">
        
        <!-- SMS Top Messenger Header -->
        <div class="h-14 px-4 bg-surface-container flex items-center justify-between border-b border-surface-container-high/60 shrink-0">
          <div class="flex items-center gap-2.5">
            <button 
              class="w-8 h-8 rounded-full flex items-center justify-center text-on-surface hover:bg-surface-container-highest active:scale-95"
              onclick="window.closeActiveModal()"
            >
              <span class="material-symbols-outlined text-[20px]">arrow_back</span>
            </button>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
                M
              </div>
              <div class="flex flex-col">
                <span class="text-[13px] font-bold text-on-surface leading-tight">MediSathi AI</span>
                <span class="text-[10px] text-tertiary font-bold flex items-center gap-0.5">
                  <span class="material-symbols-outlined text-[12px]">verified</span> Verified Healthcare Sender
                </span>
              </div>
            </div>
          </div>
          <button class="text-on-surface-variant hover:text-on-surface" onclick="window.closeActiveModal()">
            <span class="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <!-- Messages Chat Viewport -->
        <div class="p-4 space-y-3 flex-1 overflow-y-auto bg-surface-container-low/40 no-scrollbar">
          
          <!-- Real Twilio SMS Live Trigger Pill -->
          <div class="flex items-center justify-between p-2.5 rounded-xl bg-primary-fixed/30 border border-primary/40 shadow-xs">
            <div class="flex items-center gap-1.5 min-w-0">
              <span class="w-2 h-2 rounded-full bg-primary animate-ping shrink-0"></span>
              <div class="flex flex-col min-w-0">
                <span class="text-[11px] font-bold text-primary truncate">Live Twilio Gateway Active</span>
                <span class="text-[9px] text-on-surface-variant font-medium">To: +91 81068 90663</span>
              </div>
            </div>
            <button 
              class="px-2.5 py-1 rounded-lg bg-primary text-on-primary font-bold text-[10px] shadow-xs active:scale-95 transition-all flex items-center gap-1 shrink-0"
              onclick="window.triggerRealTwilioSms('+918106890663', 'Reminder: It’s time to take your scheduled medicine.\nMedicine: Paracetamol 500 mg\nInstruction: After food\nPlease take it as prescribed by your doctor.')"
            >
              <span class="material-symbols-outlined text-[13px]">send</span>
              <span>Trigger SMS</span>
            </button>
          </div>

          <div class="text-center">
            <span class="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant text-[10px] font-bold">
              Today • 09:00 AM
            </span>
          </div>

          <!-- Incoming MediSathi SMS Bubble -->
          <div class="flex flex-col items-start max-w-[90%]">
            <div class="bg-surface-container-lowest p-3.5 rounded-2xl rounded-tl-xs shadow-sm border border-surface-container-high/60 space-y-2">
              <div class="flex items-center gap-1.5 text-primary font-bold text-[11px]">
                <span class="material-symbols-outlined text-[15px]">pill</span>
                <span>MediSathi AI Reminder</span>
              </div>
              
              <p class="text-[13px] text-on-surface leading-relaxed whitespace-pre-line font-medium"><strong>Reminder:</strong> It’s time to take your scheduled medicine.

<strong>Medicine:</strong> Paracetamol 500 mg
<strong>Instruction:</strong> After food (ఆహారం తర్వాత)
Please take it as prescribed by your doctor.

Reply with:
1 for Taken (వేసుకున్నాను)
2 for Remind Later (తర్వాత గుర్తుచేయి)</p>

              <span class="text-[10px] text-outline block text-right">09:00 AM • Delivered</span>
            </div>
          </div>

          <!-- Interactive User SMS Replies -->
          ${smsReplies.map(reply => `
            <div class="flex flex-col items-end max-w-[85%] self-end ml-auto">
              <div class="bg-primary text-on-primary p-3 rounded-2xl rounded-tr-xs shadow-sm text-[13px] font-medium leading-relaxed">
                ${reply.text}
                <span class="text-[9px] text-white/80 block text-right mt-0.5">${reply.time} • Sent</span>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Quick Reply Action Chips (1 - Taken, 2 - Remind Later) -->
        <div class="p-3 bg-surface border-t border-surface-container-high/60 space-y-2 shrink-0">
          <div class="flex items-center gap-2">
            <button 
              class="flex-1 py-2 px-3 rounded-xl bg-tertiary-container/20 text-tertiary font-bold text-[12px] flex items-center justify-center gap-1.5 active:scale-95 border border-tertiary/30 hover:bg-tertiary-container/30 transition-all"
              onclick="window.sendSmsReply('1 - Taken (వేసుకున్నాను)')"
            >
              <span class="material-symbols-outlined text-[16px]">check_circle</span>
              <span>1 - Taken</span>
            </button>

            <button 
              class="flex-1 py-2 px-3 rounded-xl bg-surface-container text-on-surface font-bold text-[12px] flex items-center justify-center gap-1.5 active:scale-95 border border-outline-variant/30 hover:bg-surface-variant transition-all"
              onclick="window.sendSmsReply('2 - Remind Later (15m)')"
            >
              <span class="material-symbols-outlined text-[16px]">schedule</span>
              <span>2 - Remind Later</span>
            </button>
          </div>

          <div class="flex items-center gap-2">
            <input 
              class="flex-1 bg-surface-container-low border border-surface-container-high rounded-full px-3.5 py-1.5 text-[12px] text-on-surface focus:outline-none placeholder:text-outline font-medium" 
              id="sms-input-field" 
              placeholder="Type 1 or 2..." 
              onkeydown="if (event.key === 'Enter') window.sendCustomSmsReply()"
            />
            <button 
              class="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 active:scale-90"
              onclick="window.sendCustomSmsReply()"
            >
              <span class="material-symbols-outlined text-[16px]">arrow_upward</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  `;
}

window.sendSmsReply = (replyText) => {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  smsReplies.push({ text: replyText, time });
  
  if (replyText.includes('1') || replyText.includes('Taken')) {
    store.markDoseTaken('med-1');
    speech.playChime('success');
    showToast('SMS confirmation received: Paracetamol 500mg logged as TAKEN ✓', 'success');
  } else {
    store.snoozeDose('med-1');
    showToast('SMS confirmation received: Dose snoozed 15m ⏰', 'info');
  }

  store.notify();
};

window.sendCustomSmsReply = () => {
  const input = document.getElementById('sms-input-field');
  if (input && input.value.trim()) {
    window.sendSmsReply(input.value.trim());
    input.value = '';
  }
};
