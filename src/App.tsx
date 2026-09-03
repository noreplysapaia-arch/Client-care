import React, { useState } from 'react';
import {
  AppView,
  AIEmployee,
  Lead,
  AICall,
  AutomationWorkflow,
  KnowledgeDocument,
  Appointment,
  UserProfile,
} from './types';
import {
  initialAIEmployees,
  initialLeads,
  initialCalls,
  initialWorkflows,
  initialDocuments,
  initialAppointments,
} from './data/mockData';

// Landing Page
import { LandingPage } from './components/landing/LandingPage';

// Layout & Dashboard
import { AppLayout } from './components/layout/AppLayout';
import { DashboardHome } from './components/dashboard/DashboardHome';
import { AIEmployeesPage } from './components/agents/AIEmployeesPage';
import { AICallsPage } from './components/calls/AICallsPage';
import { LeadsPage } from './components/crm/LeadsPage';
import { AutomationsPage } from './components/automations/AutomationsPage';
import { KnowledgePage } from './components/knowledge/KnowledgePage';
import { CalendarPage } from './components/calendar/CalendarPage';
import { AnalyticsPage } from './components/analytics/AnalyticsPage';
import { SettingsPage } from './components/settings/SettingsPage';

// Modals
import { VoiceTestModal } from './components/voice/VoiceTestModal';
import { AgentBuilderModal } from './components/agents/AgentBuilderModal';
import { BanglaVoiceCallModal } from './components/voice/BanglaVoiceCallModal';
import { PhoneCall } from 'lucide-react';

export default function App() {
  // Current active view
  const [currentView, setCurrentView] = useState<AppView>('landing');

  // Core platform states
  const [agents, setAgents] = useState<AIEmployee[]>(initialAIEmployees);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [calls, setCalls] = useState<AICall[]>(initialCalls);
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>(initialWorkflows);
  const [documents, setDocuments] = useState<KnowledgeDocument[]>(initialDocuments);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  // Active call inspector
  const [selectedCall, setSelectedCall] = useState<AICall | null>(null);

  // Voice AI Demo Modals
  const [isVoiceDemoOpen, setIsVoiceDemoOpen] = useState<boolean>(false);
  const [isBanglaVoiceModalOpen, setIsBanglaVoiceModalOpen] = useState<boolean>(false);
  const [testingAgent, setTestingAgent] = useState<AIEmployee>(initialAIEmployees[0]);

  // AI Employee Builder Modal
  const [isBuilderOpen, setIsBuilderOpen] = useState<boolean>(false);

  // Authenticated user profile
  const [currentUser] = useState<UserProfile>({
    name: 'Sajid Pramanik',
    email: 'sajid@pramanikgroup.com',
    role: 'Managing Director & Founder',
    companyName: 'Client Care AI',
    parentOrg: 'Pramanik Group',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  });

  // Handlers
  const handleOpenVoiceDemo = (agent?: AIEmployee) => {
    setTestingAgent(agent || agents[0]);
    setIsVoiceDemoOpen(true);
  };

  const handleAgentCreated = (newAgent: AIEmployee) => {
    setAgents((prev) => [newAgent, ...prev]);
  };

  const handleToggleAgentStatus = (agentId: string) => {
    setAgents((prev) =>
      prev.map((a) =>
        a.id === agentId
          ? { ...a, status: a.status === 'active' ? 'paused' : 'active' }
          : a
      )
    );
  };

  const handleDeleteAgent = (agentId: string) => {
    setAgents((prev) => prev.filter((a) => a.id !== agentId));
  };

  const handleAddLead = (newLead: Lead) => {
    setLeads((prev) => [newLead, ...prev]);
  };

  const handleToggleWorkflow = (wfId: string) => {
    setWorkflows((prev) =>
      prev.map((w) => (w.id === wfId ? { ...w, active: !w.active } : w))
    );
  };

  const handleAddDocument = (newDoc: KnowledgeDocument) => {
    setDocuments((prev) => [newDoc, ...prev]);
  };

  // Render view
  if (currentView === 'landing') {
    return (
      <>
        <LandingPage
          onGetStarted={() => setCurrentView('dashboard')}
          onLogin={() => setCurrentView('dashboard')}
          onOpenVoiceDemo={() => handleOpenVoiceDemo()}
          onTestAgent={(agent) => handleOpenVoiceDemo(agent)}
        />

        {/* Global Voice Test Modal */}
        <VoiceTestModal
          isOpen={isVoiceDemoOpen}
          onClose={() => setIsVoiceDemoOpen(false)}
          agent={testingAgent}
        />

        {/* Dedicated Bangla AI Live Call Modal */}
        <BanglaVoiceCallModal
          isOpen={isBanglaVoiceModalOpen}
          onClose={() => setIsBanglaVoiceModalOpen(false)}
        />

        {/* AI Employee Builder Modal */}
        <AgentBuilderModal
          isOpen={isBuilderOpen}
          onClose={() => setIsBuilderOpen(false)}
          onCreated={handleAgentCreated}
          onTestAgent={(agent) => handleOpenVoiceDemo(agent)}
        />

        {/* Persistent Floating Bangla Call Launcher Button */}
        <div className="fixed bottom-5 right-5 z-40">
          <button
            onClick={() => setIsBanglaVoiceModalOpen(true)}
            className="group relative flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-[0_10px_35px_-5px_rgba(37,99,235,0.6)] border border-cyan-400/30 active:scale-95 transition-all cursor-pointer"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <PhoneCall className="w-4 h-4 text-emerald-300 group-hover:rotate-12 transition-transform" />
            <span className="tracking-wide">🇧🇩 বাংলা ভয়েস কল</span>
          </button>
        </div>
      </>
    );
  }

  return (
    <AppLayout
      currentView={currentView}
      onNavigate={(view) => setCurrentView(view)}
      user={currentUser}
      onOpenBuilder={() => setIsBuilderOpen(true)}
      onOpenVoiceDemo={() => handleOpenVoiceDemo()}
      onSignOut={() => setCurrentView('landing')}
    >
      {/* View Switcher */}
      {currentView === 'dashboard' && (
        <DashboardHome
          agents={agents}
          leads={leads}
          calls={calls}
          onNavigate={(view) => setCurrentView(view)}
          onOpenVoiceDemo={() => handleOpenVoiceDemo()}
          onSelectCall={(call) => {
            setSelectedCall(call);
            setCurrentView('calls');
          }}
          onTestAgent={(agent) => handleOpenVoiceDemo(agent)}
        />
      )}

      {currentView === 'agents' && (
        <AIEmployeesPage
          agents={agents}
          onOpenBuilder={() => setIsBuilderOpen(true)}
          onTestAgent={(agent) => handleOpenVoiceDemo(agent)}
          onToggleStatus={handleToggleAgentStatus}
          onDeleteAgent={handleDeleteAgent}
        />
      )}

      {currentView === 'agent-builder' && (
        <AIEmployeesPage
          agents={agents}
          onOpenBuilder={() => setIsBuilderOpen(true)}
          onTestAgent={(agent) => handleOpenVoiceDemo(agent)}
          onToggleStatus={handleToggleAgentStatus}
          onDeleteAgent={handleDeleteAgent}
        />
      )}

      {currentView === 'calls' && (
        <AICallsPage
          calls={calls}
          selectedCall={selectedCall}
          onSelectCall={setSelectedCall}
          onOpenVoiceDemo={() => handleOpenVoiceDemo()}
        />
      )}

      {currentView === 'crm' && (
        <LeadsPage
          leads={leads}
          onAddLead={handleAddLead}
          onOpenVoiceDemo={() => handleOpenVoiceDemo()}
        />
      )}

      {currentView === 'automations' && (
        <AutomationsPage
          workflows={workflows}
          onToggleWorkflow={handleToggleWorkflow}
          onOpenVoiceDemo={() => handleOpenVoiceDemo()}
        />
      )}

      {currentView === 'knowledge' && (
        <KnowledgePage
          documents={documents}
          onAddDocument={handleAddDocument}
        />
      )}

      {currentView === 'calendar' && (
        <CalendarPage
          appointments={appointments}
          onOpenVoiceDemo={() => handleOpenVoiceDemo()}
        />
      )}

      {currentView === 'analytics' && <AnalyticsPage />}

      {currentView === 'settings' && <SettingsPage user={currentUser} />}

      {/* Global Voice Test Modal */}
      <VoiceTestModal
        isOpen={isVoiceDemoOpen}
        onClose={() => setIsVoiceDemoOpen(false)}
        agent={testingAgent}
      />

      {/* Dedicated Bangla AI Live Call Modal */}
      <BanglaVoiceCallModal
        isOpen={isBanglaVoiceModalOpen}
        onClose={() => setIsBanglaVoiceModalOpen(false)}
      />

      {/* AI Employee Builder Modal */}
      <AgentBuilderModal
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        onCreated={handleAgentCreated}
        onTestAgent={(agent) => handleOpenVoiceDemo(agent)}
      />

      {/* Persistent Floating Bangla Call Launcher Button */}
      <div className="fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setIsBanglaVoiceModalOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-[0_10px_35px_-5px_rgba(37,99,235,0.6)] border border-cyan-400/30 active:scale-95 transition-all cursor-pointer"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <PhoneCall className="w-4 h-4 text-emerald-300 group-hover:rotate-12 transition-transform" />
          <span className="tracking-wide">🇧🇩 বাংলা ভয়েস কল</span>
        </button>
      </div>
    </AppLayout>
  );
}
