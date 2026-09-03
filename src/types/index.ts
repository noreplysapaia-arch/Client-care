export interface AIEmployee {
  id: string;
  name: string;
  role: string;
  avatar: string;
  badgeColor: string;
  status: 'active' | 'paused' | 'training';
  capability: string;
  description: string;
  language: string;
  voice: string;
  personality: string;
  businessGoal: string;
  instructions: string;
  knowledgeSources: string[];
  escalationRule: string;
  callsCount: number;
  successRate: number;
  avgHandlingSec: number;
  phoneExtension?: string;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  aiEmployeeName: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  leadScore: number;
  intent: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  lastContact: string;
  nextAction: string;
  estimatedValue?: string;
}

export interface AICall {
  id: string;
  customerName: string;
  customerPhone: string;
  customerCompany: string;
  aiEmployeeName: string;
  aiEmployeeRole: string;
  duration: string;
  durationSec: number;
  status: 'completed' | 'in-progress' | 'scheduled' | 'missed';
  intent: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  leadScore: number;
  timestamp: string;
  summary: string;
  nextAction: string;
  recordingUrl?: string;
  transcript: {
    speaker: 'ai' | 'customer';
    text: string;
    time: string;
  }[];
}

export interface KnowledgeDoc {
  id: string;
  title: string;
  type: 'pdf' | 'docx' | 'txt' | 'url' | 'faq' | 'manual' | 'file';
  status: 'indexed' | 'processing' | 'failed' | 'synced';
  chunks: number;
  chunksCount?: number;
  size: string;
  updatedAt: string;
  lastUpdated?: string;
  source?: string;
  category?: string;
}

export type KnowledgeDocument = KnowledgeDoc;

export interface WorkflowStep {
  id: string;
  type: 'trigger' | 'condition' | 'action' | 'ai_call' | 'delay';
  label: string;
  description: string;
  branch?: 'yes' | 'no' | 'main';
}

export interface AutomationWorkflow {
  id: string;
  title: string;
  description: string;
  active: boolean;
  trigger: string;
  executionsCount: number;
  successRate: number;
  steps: WorkflowStep[];
}

export interface Appointment {
  id: string;
  title: string;
  customerName: string;
  customerCompany: string;
  customerEmail: string;
  aiEmployeeName: string;
  date: string;
  time: string;
  duration: string;
  status: 'confirmed' | 'pending' | 'completed';
  type: 'ai-booked' | 'human-booked' | 'follow-up';
  meetingLink?: string;
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  organization?: string;
  companyName?: string;
  parentOrg: string;
}

export type AppView =
  | 'landing'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'agents'
  | 'agent-builder'
  | 'voice-test'
  | 'calls'
  | 'crm'
  | 'automations'
  | 'knowledge'
  | 'calendar'
  | 'analytics'
  | 'settings';
