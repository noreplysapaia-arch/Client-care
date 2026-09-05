// Voice Engine and Telephony Audio Service
// Powered by the browser Voice Foundation for speech synthesis, microphone input, and telephony audio

import { voiceFoundation } from './voiceFoundation';

export interface BanglaVoicePersona {
  id: 'sarah' | 'tanvir' | 'nusrat';
  name: string;
  nameBn: string;
  role: string;
  roleBn: string;
  gender: 'female' | 'male';
  avatar: string;
  descBn: string;
  pitch: number;
  rate: number;
}

export const BANGLA_VOICES: BanglaVoicePersona[] = [
  {
    id: 'sarah',
    name: 'Sarah - Client Care Executive',
    nameBn: 'সারাহ',
    role: 'Client Care Executive',
    roleBn: 'ক্লায়েন্ট কেয়ার এক্সিকিউটিভ',
    gender: 'female',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    descBn: 'শুদ্ধ ও স্বাভাবিক বাংলা — Client Care কাস্টমার এক্সিকিউটিভ',
    pitch: 1.0,
    rate: 0.95,
  },
  {
    id: 'nusrat',
    name: 'Nusrat',
    nameBn: 'নুসরাত',
    role: 'AI Sales & E-commerce Executive',
    roleBn: 'AI সেলস ও ই-কমার্স এক্সিকিউটিভ',
    gender: 'female',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    descBn: 'Dynamic & proactive female voice — Sales conversion & discovery',
    pitch: 1.05,
    rate: 1.0,
  },
  {
    id: 'tanvir',
    name: 'Tanvir',
    nameBn: 'তানভীর',
    role: 'AI Enterprise Consultant',
    roleBn: 'AI এন্টারপ্রাইজ কনসালটেন্ট',
    gender: 'male',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    descBn: 'Calm, confident & professional male voice — Meetings & enterprise consultation',
    pitch: 0.9,
    rate: 0.95,
  },
];

class BanglaVoiceService {
  playRingbackTone(durationMs: number = 2000): Promise<void> {
    return voiceFoundation.playRingbackTone(durationMs);
  }

  playConnectedChime(): void {
    voiceFoundation.playConnectedChime();
  }

  playEndCallTone(): void {
    voiceFoundation.playEndCallTone();
  }

  playBanglaSpeech(
    text: string,
    personaId: 'sarah' | 'tanvir' | 'nusrat' = 'sarah',
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (err: unknown) => void
  ): void {
    const persona = BANGLA_VOICES.find((v) => v.id === personaId) || BANGLA_VOICES[0];
    voiceFoundation.speak({
      text,
      lang: 'en-US',
      pitch: persona.pitch,
      rate: persona.rate,
      onStart,
      onEnd,
      onError,
    });
  }

  stopSpeaking(): void {
    voiceFoundation.stopSpeaking();
  }

  getIsSpeaking(): boolean {
    return voiceFoundation.state.isSpeaking;
  }
}

export const banglaVoice = new BanglaVoiceService();

// Intelligent Knowledge Base Responses
export function getBanglaAIResponse(
  userQuery: string,
  userName: string = 'Guest',
  _persona: 'sarah' | 'tanvir' | 'nusrat' = 'sarah'
): string {
  const query = userQuery.toLowerCase().trim();

  if (query.includes('price') || query.includes('cost') || query.includes('package')) {
    return `Our packages are tailored for scaling businesses. You can explore our initial tier for free. For enterprise voice calling and multi-channel automation, our Growth plan starts at $149 per month. What is your estimated monthly call volume?`;
  }

  if (query.includes('facebook') || query.includes('page') || query.includes('order') || query.includes('delivery') || query.includes('cod')) {
    return `Yes ${userName}, our AI integrates directly across your website, phone numbers, and social channels. When customers call or message, it automatically confirms orders, verifies delivery details, and updates your CRM in real time!`;
  }

  if (query.includes('voice') || query.includes('call') || query.includes('natural')) {
    return `Yes! I speak with natural conversational cadence using browser voice foundation. I can answer inquiries, handle objection handling, and qualify leads seamlessly. Feel free to ask me anything about our platform.`;
  }

  if (query.includes('meeting') || query.includes('demo') || query.includes('talk') || query.includes('human') || query.includes('owner') || query.includes('manager')) {
    return `Certainly ${userName}! I would be glad to schedule a free consultation with our senior solutions consultant. Would tomorrow morning at 11:00 AM or afternoon at 3:00 PM work better for you?`;
  }

  if (query.includes('how it works') || query.includes('features') || query.includes('benefit') || query.includes('whatsapp')) {
    return `Client Care AI operates 24/7 to answer inbound calls, trigger instant automated call-backs on missed rings, qualify customer intent, and send instant confirmation summaries via email and messaging.`;
  }

  // Default polite conversational reply
  return `Thank you ${userName}! I understand your inquiry. Our AI workforce is ready to scale your sales, answer inbound calls 24/7, and elevate customer experience. What specific feature or workflow would you like to explore?`;
}
