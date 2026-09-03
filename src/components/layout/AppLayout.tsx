import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  PhoneCall,
  UserCheck,
  GitBranch,
  Database,
  Calendar,
  BarChart3,
  Settings,
  Plus,
  Search,
  Bell,
  LogOut,
  Sparkles,
  Menu,
  X,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { AppView, UserProfile } from '../../types';
import { Logo } from '../Logo';
import { Button } from '../ui/Button';

interface AppLayoutProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  user: UserProfile;
  onOpenBuilder: () => void;
  onOpenVoiceDemo: () => void;
  onSignOut: () => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentView,
  onNavigate,
  user,
  onOpenBuilder,
  onOpenVoiceDemo,
  onSignOut,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const navItems: { view: AppView; label: string; icon: any; badge?: string }[] = [
    { view: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { view: 'agents', label: 'AI Employees', icon: Users, badge: '6 Active' },
    { view: 'calls', label: 'AI Calls', icon: PhoneCall, badge: 'Live' },
    { view: 'crm', label: 'Leads & CRM', icon: UserCheck },
    { view: 'automations', label: 'Automations', icon: GitBranch },
    { view: 'knowledge', label: 'Knowledge Base', icon: Database },
    { view: 'calendar', label: 'Calendar', icon: Calendar },
    { view: 'analytics', label: 'Analytics', icon: BarChart3 },
    { view: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col md:flex-row overflow-x-hidden">
      {/* DESKTOP LEFT SIDEBAR */}
      <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-[#080B14] border-r border-white/[0.08] flex-shrink-0 h-screen sticky top-0 z-30">
        {/* Top Logo */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <Logo size="sm" clickable onClick={() => onNavigate('landing')} />
          <button
            onClick={() => onNavigate('landing')}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/[0.05] text-[11px] flex items-center gap-1"
            title="View public website"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Action Button */}
        <div className="p-4 border-b border-white/[0.06]">
          <button
            onClick={onOpenBuilder}
            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Create AI Employee</span>
          </button>
        </div>

        {/* Primary Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Platform Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.view;
            return (
              <button
                key={item.view}
                onClick={() => onNavigate(item.view)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                      item.badge === 'Live'
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-white/[0.05] text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile at Bottom */}
        <div className="p-3 border-t border-white/[0.08] bg-[#060810]">
          <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover ring-1 ring-white/20 flex-shrink-0"
              />
              <div className="overflow-hidden text-left">
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.parentOrg}</p>
              </div>
            </div>
            <button
              onClick={onSignOut}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors flex-shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <header className="md:hidden flex items-center justify-between p-4 bg-[#080B14] border-b border-white/[0.08] sticky top-0 z-40">
        <Logo size="sm" clickable onClick={() => onNavigate('landing')} />
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenVoiceDemo}
            className="p-2 rounded-lg bg-blue-500/10 text-blue-400 text-xs"
          >
            <PhoneCall className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[65px] bg-[#07090E]/95 backdrop-blur-xl z-50 p-6 flex flex-col justify-between">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.view}
                  onClick={() => {
                    onNavigate(item.view);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-medium ${
                    currentView === item.view ? 'bg-blue-600/20 text-blue-400' : 'text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="pt-4 border-t border-white/[0.08] space-y-3">
            <Button
              variant="gradient"
              size="md"
              onClick={() => {
                onOpenBuilder();
                setMobileMenuOpen(false);
              }}
              className="w-full"
            >
              Create AI Employee
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                onNavigate('landing');
                setMobileMenuOpen(false);
              }}
              className="w-full"
            >
              Public Landing Page
            </Button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Desktop Top Navigation Bar */}
        <header className="hidden md:flex items-center justify-between h-16 px-6 lg:px-8 border-b border-white/[0.08] bg-[#07090e]/60 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3 w-96">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search leads, calls, knowledge chunks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-10 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenVoiceDemo}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-medium transition-all"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Voice AI Testing Studio</span>
            </button>

            <button
              onClick={() => onNavigate('landing')}
              className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg border border-white/[0.08] hover:border-white/[0.15] transition-all"
            >
              Landing Page
            </button>

            <div className="w-[1px] h-6 bg-white/[0.08]" />

            <div className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.05] cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400" />
            </div>
          </div>
        </header>

        {/* Page View Children */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
          {children}
        </main>
      </div>

      {/* MOBILE BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#080B14] border-t border-white/[0.08] z-40 flex items-center justify-around px-2">
        {[
          { view: 'dashboard' as AppView, label: 'Home', icon: LayoutDashboard },
          { view: 'crm' as AppView, label: 'Leads', icon: UserCheck },
          { view: 'calls' as AppView, label: 'Calls', icon: PhoneCall },
          { view: 'agents' as AppView, label: 'AI Team', icon: Users },
          { view: 'settings' as AppView, label: 'More', icon: Settings },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`flex flex-col items-center justify-center w-14 py-1 text-[10px] font-medium transition-colors ${
                isActive ? 'text-blue-400' : 'text-slate-500'
              }`}
            >
              <Icon className="w-5 h-5 mb-0.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
