import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { BanglaLiveCallWidget } from './BanglaLiveCallWidget';

interface BanglaVoiceCallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BanglaVoiceCallModal: React.FC<BanglaVoiceCallModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-md">
        {/* Close Button Top-Right */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 sm:-right-4 p-2 rounded-full bg-white/[0.1] hover:bg-white/[0.2] text-slate-300 hover:text-white transition-colors border border-white/[0.1] z-50"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Live Call Widget */}
        <BanglaLiveCallWidget onCallEnded={onClose} />
      </div>
    </div>
  );
};
