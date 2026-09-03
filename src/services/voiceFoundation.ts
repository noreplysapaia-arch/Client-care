// Real Browser Voice Foundation
// Provides a unified, production-grade foundation for Web Speech Synthesis,
// Web Speech Recognition, Web Audio API Telephony Tones, and Live Microphone Level Monitoring.

export interface VoiceDiagnostic {
  speechSynthesis: boolean;
  speechRecognition: boolean;
  audioContext: boolean;
  mediaDevices: boolean;
  permissionStatus: 'granted' | 'prompt' | 'denied' | 'unsupported';
  voiceCount: number;
}

export interface SpeakOptions {
  text: string;
  lang?: 'bn' | 'en' | string;
  voiceName?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
  onBoundary?: (charIndex: number, word: string) => void;
}

export interface ListenOptions {
  lang?: 'bn-BD' | 'en-US' | string;
  continuous?: boolean;
  interimResults?: boolean;
  onStart?: () => void;
  onInterim?: (transcript: string) => void;
  onFinal?: (transcript: string) => void;
  onError?: (error: string, code?: string) => void;
  onEnd?: () => void;
}

type StateListener = (state: VoiceFoundationState) => void;

export interface VoiceFoundationState {
  isSpeaking: boolean;
  isListening: boolean;
  isMicMonitoring: boolean;
  micLevel: number; // 0.0 to 1.0
  activeLang: 'bn' | 'en';
  voices: SpeechSynthesisVoice[];
  selectedVoiceName: string | null;
}

class BrowserVoiceFoundation {
  private audioContext: AudioContext | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private recognitionInstance: any = null;
  private micStream: MediaStream | null = null;
  private micAnalyser: AnalyserNode | null = null;
  private micAnimFrame: number | null = null;
  private keepAliveTimer: number | null = null;
  private speakingQueue: string[] = [];
  private onQueueFinished: (() => void) | null = null;
  private currentSpeakOptions: SpeakOptions | null = null;
  private listeners: Set<StateListener> = new Set();

  public state: VoiceFoundationState = {
    isSpeaking: false,
    isListening: false,
    isMicMonitoring: false,
    micLevel: 0,
    activeLang: 'bn',
    voices: [],
    selectedVoiceName: null,
  };

  constructor() {
    this.initVoices();
  }

  // Subscribe to state updates
  public subscribe(listener: StateListener): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emitState(): void {
    this.listeners.forEach((listener) => {
      try {
        listener({ ...this.state });
      } catch (err) {
        console.error('Error in voice foundation listener:', err);
      }
    });
  }

  // Initialize available system & browser voices
  private initVoices(): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      try {
        const available = window.speechSynthesis.getVoices() || [];
        this.state.voices = available;
        if (!this.state.selectedVoiceName && available.length > 0) {
          // Auto-select sensible default
          const defaultVoice =
            available.find((v) => v.lang.startsWith('bn')) ||
            available.find((v) => v.lang === 'en-US' || v.lang.startsWith('en')) ||
            available[0];
          this.state.selectedVoiceName = defaultVoice ? defaultVoice.name : null;
        }
        this.emitState();
      } catch {
        // ignore
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  // Get diagnostic overview
  public async getDiagnostics(): Promise<VoiceDiagnostic> {
    const hasSpeechSynthesis = typeof window !== 'undefined' && 'speechSynthesis' in window;
    const hasSpeechRecognition =
      typeof window !== 'undefined' &&
      (('SpeechRecognition' in window) || ('webkitSpeechRecognition' in window));
    const hasAudioContext =
      typeof window !== 'undefined' &&
      (('AudioContext' in window) || ('webkitAudioContext' in window));
    const hasMediaDevices =
      typeof navigator !== 'undefined' &&
      !!navigator.mediaDevices &&
      !!navigator.mediaDevices.getUserMedia;

    let permissionStatus: 'granted' | 'prompt' | 'denied' | 'unsupported' = 'unsupported';
    if (typeof navigator !== 'undefined' && navigator.permissions && navigator.permissions.query) {
      try {
        const perm = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        permissionStatus = perm.state as 'granted' | 'prompt' | 'denied';
      } catch {
        permissionStatus = hasMediaDevices ? 'prompt' : 'unsupported';
      }
    } else if (hasMediaDevices) {
      permissionStatus = 'prompt';
    }

    const voices = hasSpeechSynthesis ? window.speechSynthesis.getVoices() : [];

    return {
      speechSynthesis: hasSpeechSynthesis,
      speechRecognition: hasSpeechRecognition,
      audioContext: hasAudioContext,
      mediaDevices: hasMediaDevices,
      permissionStatus,
      voiceCount: voices.length,
    };
  }

  // Audio Context lazy initialization
  public getAudioContext(): AudioContext {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  // ==========================================
  // TELEPHONY PROCEDURAL AUDIO (Web Audio API)
  // ==========================================

  // Dialing tone (Standard Telecom Ringback: 400Hz + 450Hz dual-frequency)
  public playRingbackTone(durationMs: number = 2000): Promise<void> {
    return new Promise((resolve) => {
      try {
        const ctx = this.getAudioContext();
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(400, ctx.currentTime);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(450, ctx.currentTime);

        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.08);
        gainNode.gain.setValueAtTime(0.06, ctx.currentTime + 1.2);
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.28);

        gainNode.gain.setValueAtTime(0, ctx.currentTime + 1.5);
        gainNode.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 1.58);
        gainNode.gain.setValueAtTime(0.06, ctx.currentTime + 2.0);
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 2.08);

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc1.start();
        osc2.start();

        setTimeout(() => {
          try {
            osc1.stop();
            osc2.stop();
          } catch {
            // ignore
          }
          resolve();
        }, durationMs);
      } catch {
        setTimeout(resolve, durationMs);
      }
    });
  }

  // Call connected musical chime (C5 -> G5 clean bell ramp)
  public playConnectedChime(): void {
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.16); // G5
      osc.frequency.setValueAtTime(1046.5, ctx.currentTime + 0.22); // C6

      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.38);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.38);
    } catch {
      // ignore
    }
  }

  // Call hang-up tone
  public playEndCallTone(): void {
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(330, ctx.currentTime + 0.14);

      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // ignore
    }
  }

  // Mute / Unmute subtle mechanical click
  public playMuteClick(isMuted: boolean): void {
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isMuted ? 320 : 640, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // ignore
    }
  }

  // ==========================================
  // REAL MICROPHONE LEVEL MONITOR (Web Audio API)
  // ==========================================

  public async startMicMonitoring(
    onData?: (level: number, frequencySpectrum: Uint8Array) => void
  ): Promise<boolean> {
    if (this.state.isMicMonitoring) return true;

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.warn('getUserMedia not supported in this browser.');
        return false;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      this.micStream = stream;
      const ctx = this.getAudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.65;
      source.connect(analyser);
      this.micAnalyser = analyser;

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const checkVolume = () => {
        if (!this.micAnalyser) return;
        this.micAnalyser.getByteFrequencyData(dataArray);

        // Calculate average RMS
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const avg = sum / dataArray.length;
        const normalized = Math.min(1, Math.max(0, avg / 128));

        this.state.micLevel = normalized;
        if (onData) {
          onData(normalized, dataArray);
        }

        this.micAnimFrame = requestAnimationFrame(checkVolume);
      };

      this.state.isMicMonitoring = true;
      this.emitState();
      checkVolume();
      return true;
    } catch (err) {
      console.warn('Could not start microphone monitoring:', err);
      this.state.isMicMonitoring = false;
      this.emitState();
      return false;
    }
  }

  public stopMicMonitoring(): void {
    if (this.micAnimFrame) {
      cancelAnimationFrame(this.micAnimFrame);
      this.micAnimFrame = null;
    }

    if (this.micStream) {
      this.micStream.getTracks().forEach((track) => track.stop());
      this.micStream = null;
    }

    this.micAnalyser = null;
    this.state.isMicMonitoring = false;
    this.state.micLevel = 0;
    this.emitState();
  }

  // ==========================================
  // TEXT-TO-SPEECH SYNTHESIS ENGINE
  // ==========================================

  // Break text into sentences to protect against Chrome's 15-second speech truncation bug
  private chunkText(text: string, maxLen: number = 100): string[] {
    const clean = text.trim();
    if (!clean) return [];

    // Bengali and English sentence delimiters
    const delimiters = /([।?!.\n]+)/g;
    const parts = clean.split(delimiters);
    const chunks: string[] = [];
    let current = '';

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (!part) continue;

      if (current.length + part.length <= maxLen) {
        current += part;
      } else {
        if (current.trim()) {
          chunks.push(current.trim());
        }
        current = part;
      }
    }

    if (current.trim()) {
      chunks.push(current.trim());
    }

    return chunks.length > 0 ? chunks : [clean];
  }

  public speak(options: SpeakOptions): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (options.onEnd) options.onEnd();
      return;
    }

    // Stop existing speech and clear active queue
    this.stopSpeaking();

    const chunks = this.chunkText(options.text);
    if (chunks.length === 0) {
      if (options.onEnd) options.onEnd();
      return;
    }

    this.speakingQueue = [...chunks];
    this.currentSpeakOptions = options;
    this.state.isSpeaking = true;
    this.emitState();

    if (options.onStart) {
      options.onStart();
    }

    this.processNextSpeechChunk();
  }

  private processNextSpeechChunk(): void {
    if (!this.state.isSpeaking || this.speakingQueue.length === 0) {
      this.state.isSpeaking = false;
      this.clearKeepAlive();
      this.emitState();
      if (this.currentSpeakOptions?.onEnd) {
        this.currentSpeakOptions.onEnd();
      }
      return;
    }

    const chunk = this.speakingQueue.shift()!;
    const options = this.currentSpeakOptions || { text: '' };

    try {
      const utterance = new SpeechSynthesisUtterance(chunk);
      this.currentUtterance = utterance;

      // Determine language
      const isBengali = options.lang === 'bn' || options.lang === 'bn-BD' || /[\u0980-\u09FF]/.test(chunk);
      utterance.lang = isBengali ? 'bn-BD' : options.lang || 'en-US';

      // Find appropriate voice
      const voices = window.speechSynthesis.getVoices();
      let matchedVoice: SpeechSynthesisVoice | undefined;

      if (options.voiceName) {
        matchedVoice = voices.find((v) => v.name === options.voiceName);
      }

      if (!matchedVoice) {
        if (isBengali) {
          // Look for Bengali voices
          matchedVoice =
            voices.find((v) => v.lang === 'bn-BD' || v.lang === 'bn_BD') ||
            voices.find((v) => v.lang.startsWith('bn')) ||
            voices.find(
              (v) =>
                v.name.toLowerCase().includes('bangla') ||
                v.name.toLowerCase().includes('bengali')
            );
        } else {
          // Look for English natural or high-quality voices
          matchedVoice =
            voices.find((v) => v.name.includes('Natural') && v.lang.startsWith('en')) ||
            voices.find((v) => v.name.includes('Google') && v.lang.startsWith('en')) ||
            voices.find((v) => v.lang === 'en-US') ||
            voices.find((v) => v.lang.startsWith('en'));
        }
      }

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.rate = options.rate ?? 1.0;
      utterance.pitch = options.pitch ?? 1.0;
      utterance.volume = options.volume ?? 1.0;

      utterance.onend = () => {
        // Natural brief clause pause (130ms)
        setTimeout(() => {
          this.processNextSpeechChunk();
        }, 130);
      };

      utterance.onerror = (e) => {
        console.warn('Speech synthesis chunk error:', e);
        // Continue to next chunk or end
        setTimeout(() => {
          this.processNextSpeechChunk();
        }, 80);
      };

      // Chrome long-utterance keepalive workaround
      this.startKeepAlive();

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Error initiating utterance:', err);
      this.processNextSpeechChunk();
    }
  }

  // Keep-alive timer to prevent Chrome from pausing during speech
  private startKeepAlive(): void {
    this.clearKeepAlive();
    this.keepAliveTimer = window.setInterval(() => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (window.speechSynthesis.speaking) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        } else {
          this.clearKeepAlive();
        }
      }
    }, 10000);
  }

  private clearKeepAlive(): void {
    if (this.keepAliveTimer !== null) {
      clearInterval(this.keepAliveTimer);
      this.keepAliveTimer = null;
    }
  }

  public stopSpeaking(): void {
    this.speakingQueue = [];
    this.state.isSpeaking = false;
    this.clearKeepAlive();

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }

    this.currentUtterance = null;
    this.emitState();
  }

  // ==========================================
  // SPEECH-TO-TEXT RECOGNITION ENGINE
  // ==========================================

  public startListening(options: ListenOptions): boolean {
    if (typeof window === 'undefined') return false;

    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      if (options.onError) {
        options.onError(
          'Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.',
          'unsupported'
        );
      }
      return false;
    }

    // Stop speaking before starting microphone recognition to avoid feedback
    this.stopSpeaking();
    this.stopListening();

    try {
      const recognition = new SpeechRecognitionClass();
      this.recognitionInstance = recognition;

      recognition.continuous = options.continuous ?? false;
      recognition.interimResults = options.interimResults ?? true;
      recognition.lang = options.lang || 'en-US';

      recognition.onstart = () => {
        this.state.isListening = true;
        this.emitState();
        if (options.onStart) options.onStart();
      };

      recognition.onresult = (event: any) => {
        let interimText = '';
        let finalText = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const trans = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalText += trans;
          } else {
            interimText += trans;
          }
        }

        if (interimText && options.onInterim) {
          options.onInterim(interimText);
        }

        if (finalText && options.onFinal) {
          options.onFinal(finalText);
        }
      };

      recognition.onerror = (event: any) => {
        this.state.isListening = false;
        this.emitState();

        const errCode = event.error || 'unknown';
        let humanMsg = 'Speech recognition encountered an issue.';

        if (errCode === 'not-allowed') {
          humanMsg = 'Microphone permission was denied. Please allow microphone access in your browser.';
        } else if (errCode === 'no-speech') {
          humanMsg = 'No speech was detected. Please speak closer to your microphone.';
        } else if (errCode === 'network') {
          humanMsg = 'Network connection issue for speech recognition.';
        }

        if (options.onError) {
          options.onError(humanMsg, errCode);
        }
      };

      recognition.onend = () => {
        this.state.isListening = false;
        this.emitState();
        if (options.onEnd) options.onEnd();
      };

      recognition.start();
      return true;
    } catch (err: any) {
      this.state.isListening = false;
      this.emitState();
      if (options.onError) {
        options.onError(err?.message || 'Failed to start microphone speech recognition.', 'exception');
      }
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognitionInstance) {
      try {
        this.recognitionInstance.stop();
      } catch {
        // ignore
      }
      this.recognitionInstance = null;
    }
    this.state.isListening = false;
    this.emitState();
  }

  // Set active language
  public setLanguage(lang: 'bn' | 'en'): void {
    this.state.activeLang = lang;
    this.emitState();
  }

  // Set selected voice
  public setSelectedVoice(voiceName: string): void {
    this.state.selectedVoiceName = voiceName;
    this.emitState();
  }
}

export const voiceFoundation = new BrowserVoiceFoundation();
