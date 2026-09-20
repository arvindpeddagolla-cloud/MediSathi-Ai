// Web Speech API and Web Audio Sound Effects for MediSathi AI

class SpeechService {
  constructor() {
    this.synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
    this.isSpeaking = false;
    this.audioContext = null;
    this.onStateChange = null;
  }

  initAudio() {
    if (!this.audioContext && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioContext = new AudioContext();
      }
    }
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  // Play synthetic medical chimes (gentle harmonic bell tones)
  playChime(type = 'reminder') {
    try {
      this.initAudio();
      if (!this.audioContext) return;

      const now = this.audioContext.currentTime;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      if (type === 'reminder') {
        // Soft double chime (F5 -> A5)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(698.46, now); // F5
        osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.15); // A5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (type === 'success') {
        // Uplifting major third (C5 -> E5 -> G5)
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.setValueAtTime(659.25, now + 0.1);
        osc.frequency.setValueAtTime(783.99, now + 0.2);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
        osc.start(now);
        osc.stop(now + 0.7);
      } else if (type === 'ringtone') {
        // Gentle telephone pulse
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch (e) {
      console.warn("Audio synthesis note:", e);
    }
  }

  speak(text, lang = 'en', onEndCallback = null) {
    if (!this.synth) {
      if (onEndCallback) onEndCallback();
      return;
    }

    this.stop();
    this.initAudio();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Select best voice matching language
    const langMap = {
      'en': 'en-IN',
      'te': 'te-IN',
      'hi': 'hi-IN',
      'ta': 'ta-IN'
    };

    utterance.lang = langMap[lang] || 'en-IN';
    utterance.rate = 0.92; // slightly slower for clinical clarity & elderly accessibility
    utterance.pitch = 1.05; // warm, comforting pitch

    const voices = this.synth.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(lang) || v.lang.includes(langMap[lang]));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    this.isSpeaking = true;
    if (this.onStateChange) this.onStateChange(true);

    utterance.onend = () => {
      this.isSpeaking = false;
      if (this.onStateChange) this.onStateChange(false);
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      if (this.onStateChange) this.onStateChange(false);
      if (onEndCallback) onEndCallback();
    };

    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
      if (this.onStateChange) this.onStateChange(false);
    }
  }
}

export const speech = new SpeechService();
