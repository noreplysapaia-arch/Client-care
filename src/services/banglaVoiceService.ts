// Bangla Voice Engine and Telephony Audio Service
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
    name: 'Sarah',
    nameBn: 'সারা',
    role: 'AI Customer Care Specialist',
    roleBn: 'এআই কাস্টমার কেয়ার স্পেশালিস্ট',
    gender: 'female',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    descBn: 'অমায়িক ও মিষ্টভাষী ফিমেল ভয়েস — কাস্টমার সাপোর্ট ও লিড জেনারেশন',
    pitch: 1.0,
    rate: 0.95,
  },
  {
    id: 'nusrat',
    name: 'Nusrat',
    nameBn: 'নুসরাত',
    role: 'AI Sales & E-commerce Executive',
    roleBn: 'সেলস ও ই-কমার্স স্পেশালিস্ট',
    gender: 'female',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
    descBn: 'চটপটে ও প্রাণবন্ত ভয়েস — ফেসবুক পেজ ও সেলস কনভার্সন',
    pitch: 1.05,
    rate: 1.0,
  },
  {
    id: 'tanvir',
    name: 'Tanvir',
    nameBn: 'তানভীর',
    role: 'AI Enterprise Consultant',
    roleBn: 'এন্টারপ্রাইজ সল্যুশন কনসালটেন্ট',
    gender: 'male',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    descBn: 'শান্ত, আত্মবিশ্বাসী ও প্রফেশনাল মেল ভয়েস — মিটিং ও ক্লায়েন্ট সাপোর্ট',
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
      lang: 'bn',
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

// Intelligent Bengali Business Knowledge Base Responses
export function getBanglaAIResponse(
  userQuery: string,
  userName: string = 'সাজিদ ভাই',
  persona: 'sarah' | 'tanvir' | 'nusrat' = 'sarah'
): string {
  const query = userQuery.toLowerCase().trim();

  if (query.includes('প্যাকেজ') || query.includes('দাম') || query.includes('খরচ') || query.includes('price') || query.includes('cost')) {
    return `আমাদের প্যাকেজগুলো বাংলাদেশের ছোট ও বড় বিজনেসের জন্য খুবই সাশ্রয়ী। একদম শুরুতে আপনি ফ্রি ডেমো টেস্ট করতে পারেন। আর আনলিমিটেড এআই কলিং ও ফেসবুক পেজ অটোমেশনের জন্য গ্রোথ প্যাকেজ শুরু মাত্র ৪৯৯৯ টাকা থেকে। আপনার প্রতি মাসে কতগুলো কলার আসে বলবেন কি?`;
  }

  if (query.includes('ফেসবুক') || query.includes('পেজ') || query.includes('অর্ডার') || query.includes('ক্যাশ অন ডেলিভারি') || query.includes('cod')) {
    return `জি ${userName}, আমাদের এআই সরাসরি আপনার ফেসবুক পেজ, ওয়েবসাইট ও মোবাইল নম্বরে কাজ করে। কাস্টমার কল বা মেসেজ দিলে সাথে সাথে অর্ডার কনফার্ম করে, ঠিকানা ভেরিফাই করে এবং কুরিয়ার সিস্টেমে স্বয়ংক্রিয়ভাবে পাঠিয়ে দেয়!`;
  }

  if (query.includes('বাংলা') || query.includes('বাঙালি') || query.includes('ভয়েস') || query.includes('voice')) {
    return `জি! আমি একদম ন্যাচারাল বাংলাদেশি বাংলায় সাবলীলভাবে কথা বলতে পারি। কাস্টমার বাংলায় প্রশ্ন করলে কোনো রকম জড়তা ছাড়া তৎক্ষণাৎ মিষ্টি কণ্ঠে সঠিক তথ্য দিতে পারি। আপনি যেকোনো প্রশ্ন করে পরখ করে দেখতে পারেন।`;
  }

  if (query.includes('মিটিং') || query.includes('ডেমো') || query.includes('কথা বলতে চাই') || query.includes('মানুষ') || query.includes('owner') || query.includes('manager')) {
    return `অবশ্যই ${userName}! আমি আমাদের সিনিয়র বিজনেস ম্যানেজারের সাথে আপনার একটি ফ্রি কনসালটেশন শিডিউল করে দিতে পারি। আগামীকাল সকাল ১১টা নাকি বিকেল ৪টায় আপনার জন্য সুবিধা হবে?`;
  }

  if (query.includes('কীভাবে কাজ করে') || query.includes('কেমন') || query.includes('কী সুবিধা') || query.includes('হোয়াটসঅ্যাপ')) {
    return `ক্লায়েন্ট কেয়ার এআই আপনার বিজনেসের জন্য ২৪ ঘণ্টা ফোন রিসিভ করে, মিসড কলে অটো ব্যাক-কল দেয়, লিড কোয়ালিফাই করে এবং বিকাশ বা ক্যাশ-অন-ডেলিভারি আপডেট কাস্টমারকে এসএমএস ও হোয়াটসঅ্যাপে পাঠিয়ে দেয়।`;
  }

  // Default polite conversational reply
  return `ধন্যবাদ ${userName}! আপনার প্রশ্নটি বুঝতে পেরেছি। আপনার ব্যবসার সেলস বাড়ানো ও কাস্টমারদের ২৪ ঘণ্টা চমৎকার সার্ভিস দেওয়ার জন্য আমাদের এআই প্রস্তুত। আপনি আর কী তথ্য জানতে চান?`;
}
