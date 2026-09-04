import React, { useState, useEffect } from 'react';
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
import {
  testConnection,
  migrateLocalDataToFirestore,
  subscribeToAgents,
  subscribeToLeads,
  subscribeToCalls,
  subscribeToWorkflows,
  subscribeToDocuments,
  subscribeToAppointments,
  addAgent,
  toggleAgentStatus,
  deleteAgent,
  addLead,
  updateLeadStatus,
  deleteLead,
  deleteCall,
  toggleWorkflow,
  addWorkflow,
  updateWorkflow,
  deleteWorkflow,
  addDocument,
  deleteDocument,
  addAppointment,
  updateAppointmentStatus,
  deleteAppointment,
  onAuthChange,
  signOutUser,
} from './services/firebase';
import { User as FirebaseUser } from 'firebase/auth';

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
import { AuthModal } from './components/auth/AuthModal';
import { PhoneCall } from 'lucide-react';

export default function App() {
  // Current active view
  const [currentView, setCurrentView] = useState<AppView>('landing');

  // Firebase Auth state
  const [authUser, setAuthUser] = useState<FirebaseUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Core platform states backed by Firestore (User-isolated)
  const [agents, setAgents] = useState<AIEmployee[]>(initialAIEmployees);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [calls, setCalls] = useState<AICall[]>(initialCalls);
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>(initialWorkflows);
  const [documents, setDocuments] = useState<KnowledgeDocument[]>(initialDocuments);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  // Firestore connectivity indicator
  const [isFirestoreConnected, setIsFirestoreConnected] = useState<boolean>(true);

  // Active call inspector
  const [selectedCall, setSelectedCall] = useState<AICall | null>(null);

  // Voice AI Demo Modals
  const [isVoiceDemoOpen, setIsVoiceDemoOpen] = useState<boolean>(false);
  const [isBanglaVoiceModalOpen, setIsBanglaVoiceModalOpen] = useState<boolean>(false);
  const [testingAgent, setTestingAgent] = useState<AIEmployee>(initialAIEmployees[0]);

  // AI Employee Builder Modal
  const [isBuilderOpen, setIsBuilderOpen] = useState<boolean>(false);

  // Listen to Firebase Authentication changes
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setAuthUser(user);
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Compute profile from auth user
  const currentUser: UserProfile = {
    id: authUser?.uid,
    name: authUser?.displayName || authUser?.email?.split('@')[0] || 'User',
    email: authUser?.email || 'authenticated@pramanikgroup.com',
    role: 'Managing Director & Founder',
    companyName: 'Client Care AI',
    parentOrg: 'Pramanik Group',
    avatar:
      authUser?.photoURL ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  };

  // STEP 3: Setup Firestore live listeners strictly guarded by authentication
  useEffect(() => {
    // If user is not authenticated, DO NOT fetch or subscribe to Firestore data!
    if (!authUser) {
      // Show default mock templates for landing preview
      setAgents(initialAIEmployees);
      setLeads(initialLeads);
      setCalls(initialCalls);
      setWorkflows(initialWorkflows);
      setDocuments(initialDocuments);
      setAppointments(initialAppointments);
      return;
    }

    let isMounted = true;

    const bootstrapAndSubscribe = async () => {
      try {
        const isOk = await testConnection();
        if (isMounted) setIsFirestoreConnected(isOk);

        // Migrate and seed user-isolated default dataset if user has no documents yet
        await migrateLocalDataToFirestore({
          agents: initialAIEmployees,
          leads: initialLeads,
          calls: initialCalls,
          workflows: initialWorkflows,
          documents: initialDocuments,
          appointments: initialAppointments,
        });
      } catch (err) {
        console.warn('Firestore initialization notice:', err);
      }
    };

    bootstrapAndSubscribe();

    // 1. Agents onSnapshot listener (strictly filtered by current userId)
    const unsubAgents = subscribeToAgents((liveAgents) => {
      if (liveAgents) {
        setAgents(liveAgents);
      }
    });

    // 2. Leads onSnapshot listener (strictly filtered by current userId)
    const unsubLeads = subscribeToLeads((liveLeads) => {
      if (liveLeads) {
        setLeads(liveLeads);
      }
    });

    // 3. Calls onSnapshot listener (strictly filtered by current userId)
    const unsubCalls = subscribeToCalls((liveCalls) => {
      if (liveCalls) {
        setCalls(liveCalls);
      }
    });

    // 4. Workflows onSnapshot listener (strictly filtered by current userId)
    const unsubWorkflows = subscribeToWorkflows((liveWorkflows) => {
      if (liveWorkflows) {
        setWorkflows(liveWorkflows);
      }
    });

    // 5. Knowledge Documents onSnapshot listener (strictly filtered by current userId)
    const unsubDocuments = subscribeToDocuments((liveDocuments) => {
      if (liveDocuments) {
        setDocuments(liveDocuments);
      }
    });

    // 6. Appointments onSnapshot listener (strictly filtered by current userId)
    const unsubAppointments = subscribeToAppointments((liveAppointments) => {
      if (liveAppointments) {
        setAppointments(liveAppointments);
      }
    });

    return () => {
      isMounted = false;
      unsubAgents();
      unsubLeads();
      unsubCalls();
      unsubWorkflows();
      unsubDocuments();
      unsubAppointments();
    };
  }, [authUser]);

  // Voice demo handler
  const handleOpenVoiceDemo = (agent?: AIEmployee) => {
    setTestingAgent(agent || agents[0]);
    setIsVoiceDemoOpen(true);
  };

  // Launch platform or open login
  const handleEnterPlatform = () => {
    if (authUser) {
      setCurrentView('dashboard');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await signOutUser();
    } catch (err) {
      console.error('Sign out error:', err);
    }
    setCurrentView('landing');
  };

  // Safe navigation with Auth Guard
  const handleNavigate = (view: AppView) => {
    if (view !== 'landing' && !authUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setCurrentView(view);
  };

  // Agent CRUD
  const handleAgentCreated = async (newAgent: AIEmployee) => {
    if (!authUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setAgents((prev) => [newAgent, ...prev]);
    try {
      await addAgent(newAgent);
    } catch (err) {
      console.error('Failed to create agent in Firestore:', err);
    }
  };

  const handleToggleAgentStatus = async (agentId: string) => {
    if (!authUser) {
      setIsAuthModalOpen(true);
      return;
    }
    const target = agents.find((a) => a.id === agentId);
    if (!target) return;
    const nextStatus = target.status === 'active' ? 'paused' : 'active';
    setAgents((prev) =>
      prev.map((a) => (a.id === agentId ? { ...a, status: nextStatus } : a))
    );
    try {
      await toggleAgentStatus(agentId, target.status);
    } catch (err) {
      console.error('Failed to toggle agent status:', err);
    }
  };

  const handleDeleteAgent = async (agentId: string) => {
    if (!authUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setAgents((prev) => prev.filter((a) => a.id !== agentId));
    try {
      await deleteAgent(agentId);
    } catch (err) {
      console.error('Failed to delete agent:', err);
    }
  };

  // Lead CRUD
  const handleAddLead = async (newLead: Lead) => {
    if (!authUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setLeads((prev) => [newLead, ...prev]);
    try {
      await addLead(newLead);
    } catch (err) {
      console.error('Failed to add lead to Firestore:', err);
    }
  };

  const handleUpdateLeadStatus = async (leadId: string, newStatus: Lead['status']) => {
    if (!authUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );
    try {
      await updateLeadStatus(leadId, newStatus);
    } catch (err) {
      console.error('Failed to update lead status:', err);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!authUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    try {
      await deleteLead(leadId);
    } catch (err) {
      console.error('Failed to delete lead:', err);
    }
  };

  // Calls CRUD
  const handleDeleteCall = async (callId: string) => {
    if (!authUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setCalls((prev) => prev.filter((c) => c.id !== callId));
    try {
      await deleteCall(callId);
    } catch (err) {
      console.error('Failed to delete call:', err);
    }
  };

  // Workflow CRUD
  const handleToggleWorkflow = async (wfId: string) => {
    if (!authUser) {
      setIsAuthModalOpen(true);
      return;
    }
    const target = workflows.find((w) => w.id === wfId);
    if (!target) return;
    const nextActive = !target.active;
    setWorkflows((prev) =>
      prev.map((w) => (w.id === wfId ? { ...w, active: nextActive } : w))
    );
    try {
      await toggleWorkflow(wfId, target.active);
    } catch (err) {
      console.error('Failed to toggle workflow:', err);
    }
  };

  const handleAddWorkflow = async (newWf: AutomationWorkflow) => {
    if (!authUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setWorkflows((prev) => [newWf, ...prev]);
    try {
      await addWorkflow(newWf);
    } catch (err) {
      console.error('Failed to add workflow:', err);
    }
  };

  const handleUpdateWorkflow = async (wfId: string, data: Partial<AutomationWorkflow>) => {
    if (!authUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setWorkflows((prev) =>
      prev.map((w) => (w.id === wfId ? { ...w, ...data } : w))
    );
    try {
      await updateWorkflow(wfId, data);
    } catch (err) {
      console.error('Failed to update workflow:', err);
    }
  };

  const handleDeleteWorkflow = async (wfId: string) => {
    if (!authUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setWorkflows((prev) => prev.filter((w) => w.id !== wfId));
    try {
      await deleteWorkflow(wfId);
    } catch (err) {
      console.error('Failed to delete workflow:', err);
    }
  };

  // Knowledge Document CRUD
  const handleAddDocument = async (newDoc: KnowledgeDocument) => {
    if (!authUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setDocuments((prev) => [newDoc, ...prev]);
    try {
      await addDocument(newDoc);
    } catch (err) {
      console.error('Failed to add document:', err);
    }
  };

  const handleDeleteDocument = async (docId: string) => {
    if (!authUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
    try {
      await deleteDocument(docId);
    } catch (err) {
      console.error('Failed to delete document:', err);
    }
  };

  // Appointment CRUD
  const handleAddAppointment = async (newApt: Appointment) => {
    if (!authUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setAppointments((prev) => [newApt, ...prev]);
    try {
      await addAppointment(newApt);
    } catch (err) {
      console.error('Failed to add appointment:', err);
    }
  };

  const handleUpdateAppointmentStatus = async (aptId: string, status: Appointment['status']) => {
    if (!authUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setAppointments((prev) =>
      prev.map((a) => (a.id === aptId ? { ...a, status } : a))
    );
    try {
      await updateAppointmentStatus(aptId, status);
    } catch (err) {
      console.error('Failed to update appointment status:', err);
    }
  };

  const handleDeleteAppointment = async (aptId: string) => {
    if (!authUser) {
      setIsAuthModalOpen(true);
      return;
    }
    setAppointments((prev) => prev.filter((a) => a.id !== aptId));
    try {
      await deleteAppointment(aptId);
    } catch (err) {
      console.error('Failed to delete appointment:', err);
    }
  };

  // Render view
  if (currentView === 'landing' || (!authUser && !isAuthLoading)) {
    return (
      <>
        <LandingPage
          onGetStarted={handleEnterPlatform}
          onLogin={() => setIsAuthModalOpen(true)}
          onOpenVoiceDemo={() => handleOpenVoiceDemo()}
          onTestAgent={(agent) => handleOpenVoiceDemo(agent)}
        />

        {/* Global Auth Modal */}
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={() => setCurrentView('dashboard')}
        />

        {/* Global Voice Test Modal */}
        <VoiceTestModal
          isOpen={isVoiceDemoOpen}
          onClose={() => setIsVoiceDemoOpen(false)}
          agent={testingAgent}
        />

        {/* Dedicated Live Voice Call Modal */}
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

        {/* Persistent Floating Call Launcher Button */}
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
            <span className="tracking-wide">Live Voice Call</span>
          </button>
        </div>
      </>
    );
  }

  return (
    <AppLayout
      currentView={currentView}
      onNavigate={handleNavigate}
      user={currentUser}
      onOpenBuilder={() => setIsBuilderOpen(true)}
      onOpenVoiceDemo={() => handleOpenVoiceDemo()}
      onSignOut={handleSignOut}
      firestoreLive={isFirestoreConnected}
    >
      {/* View Switcher */}
      {currentView === 'dashboard' && (
        <DashboardHome
          agents={agents}
          leads={leads}
          calls={calls}
          onNavigate={handleNavigate}
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
          onDeleteCall={handleDeleteCall}
        />
      )}

      {currentView === 'crm' && (
        <LeadsPage
          leads={leads}
          onAddLead={handleAddLead}
          onUpdateLeadStatus={handleUpdateLeadStatus}
          onDeleteLead={handleDeleteLead}
          onOpenVoiceDemo={() => handleOpenVoiceDemo()}
        />
      )}

      {currentView === 'automations' && (
        <AutomationsPage
          workflows={workflows}
          onToggleWorkflow={handleToggleWorkflow}
          onAddWorkflow={handleAddWorkflow}
          onUpdateWorkflow={handleUpdateWorkflow}
          onDeleteWorkflow={handleDeleteWorkflow}
          onOpenVoiceDemo={() => handleOpenVoiceDemo()}
        />
      )}

      {currentView === 'knowledge' && (
        <KnowledgePage
          documents={documents}
          onAddDocument={handleAddDocument}
          onDeleteDocument={handleDeleteDocument}
        />
      )}

      {currentView === 'calendar' && (
        <CalendarPage
          appointments={appointments}
          onOpenVoiceDemo={() => handleOpenVoiceDemo()}
          onAddAppointment={handleAddAppointment}
          onUpdateAppointmentStatus={handleUpdateAppointmentStatus}
          onDeleteAppointment={handleDeleteAppointment}
        />
      )}

      {currentView === 'analytics' && <AnalyticsPage />}

      {currentView === 'settings' && <SettingsPage user={currentUser} />}

      {/* Global Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={() => setCurrentView('dashboard')}
      />

      {/* Global Voice Test Modal */}
      <VoiceTestModal
        isOpen={isVoiceDemoOpen}
        onClose={() => setIsVoiceDemoOpen(false)}
        agent={testingAgent}
      />

      {/* Dedicated Live Voice Call Modal */}
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

      {/* Persistent Floating Call Launcher Button */}
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
          <span className="tracking-wide">Live Voice Call</span>
        </button>
      </div>
    </AppLayout>
  );
}
