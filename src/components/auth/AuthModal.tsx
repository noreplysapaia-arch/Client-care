import React, { useState } from 'react';
import { X, Lock, Mail, ShieldCheck, Sparkles, User, ArrowRight, CheckCircle2 } from 'lucide-react';
import { signInWithGoogle, signInWithEmail, signUpWithEmail, signInAsGuest } from '../../services/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [mode, setMode] = useState<'signin' | 'signup' | 'demo'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setError(err?.message || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide email and password.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (mode === 'signup') {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Email auth error:', err);
      setError(err?.message || 'Authentication failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoUser = async (userChoice: 'A' | 'B') => {
    setLoading(true);
    setError(null);
    try {
      const demoEmail = userChoice === 'A' ? 'usera.clientcare@demo.io' : 'userb.clientcare@demo.io';
      const demoPass = 'Pramanik@2026!';
      try {
        await signInWithEmail(demoEmail, demoPass);
      } catch (signInErr: any) {
        // If user doesn't exist, create it
        if (signInErr?.code === 'auth/user-not-found' || signInErr?.code === 'auth/invalid-credential') {
          try {
            await signUpWithEmail(demoEmail, demoPass);
          } catch (signUpErr: any) {
            // Fallback to guest if signup disabled
            await signInAsGuest(`Demo User ${userChoice}`);
          }
        } else {
          await signInAsGuest(`Demo User ${userChoice}`);
        }
      }
      onClose();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Demo switch error:', err);
      try {
        await signInAsGuest(`Demo User ${userChoice}`);
        onClose();
        if (onSuccess) onSuccess();
      } catch (finalErr: any) {
        setError(finalErr?.message || 'Quick login failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#0A0D18] border border-white/10 rounded-2xl shadow-2xl p-6 overflow-hidden text-slate-100">
        {/* Glow Header Effect */}
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-cyan-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400 mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            {mode === 'signup' ? 'Create Your Account' : 'Sign in to Client Care'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise multi-user data isolation powered by Pramanik Group
          </p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        {/* Google Primary Sign-In */}
        <button
          type="button"
          disabled={loading}
          onClick={handleGoogleSignIn}
          className="w-full py-2.5 px-4 rounded-xl bg-white text-slate-900 font-semibold text-xs flex items-center justify-center gap-3 hover:bg-slate-100 active:scale-[0.99] transition-all shadow-lg shadow-white/5 cursor-pointer disabled:opacity-50"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.31 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="relative my-4 flex items-center justify-center">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-[#0A0D18] px-3 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            Or Use Account
          </span>
          <div className="border-t border-white/10 w-full" />
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-3 py-2 pl-9 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 pl-9 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
          >
            <span>{mode === 'signup' ? 'Create Account' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
          >
            {mode === 'signin'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>

        {/* Quick Multi-User Test Switcher */}
        <div className="mt-5 pt-4 border-t border-white/10 bg-white/[0.02] -mx-6 -mb-6 p-4 rounded-b-2xl">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-amber-400 mb-2">
            <Sparkles className="w-3 h-3" />
            <span>Multi-User Isolation Quick Testing:</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickDemoUser('A')}
              className="px-2.5 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 text-blue-300 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all"
            >
              <User className="w-3 h-3" />
              <span>Login as User A</span>
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => handleQuickDemoUser('B')}
              className="px-2.5 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 text-purple-300 text-[11px] font-medium flex items-center justify-center gap-1.5 transition-all"
            >
              <User className="w-3 h-3" />
              <span>Login as User B</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 text-center">
            Sign in as User A or B to test that Firestore data is completely isolated.
          </p>
        </div>
      </div>
    </div>
  );
};
