import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  query,
  where,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  Unsubscribe,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  AIEmployee,
  Lead,
  AICall,
  AutomationWorkflow,
  KnowledgeDocument,
  Appointment,
} from '../types';

// Default Firebase credentials for project ai-studio-applet-webapp-8dd94
const defaultFirebaseConfig = {
  apiKey: "AIzaSyAxKfZ59BdZ-2XUEgZwY8CX8Szw3N3kx8Y",
  authDomain: "ai-studio-applet-webapp-8dd94.firebaseapp.com",
  projectId: "ai-studio-applet-webapp-8dd94",
  storageBucket: "ai-studio-applet-webapp-8dd94.firebasestorage.app",
  messagingSenderId: "966174935273",
  appId: "1:966174935273:web:ca6df29fe9c751230ec878",
  firestoreDatabaseId: "ai-studio-clientcare-9d0e27b6-7b21-4282-83c8-37eecfb9fbcb",
};

// Configuration object with environment variable and configuration fallback
const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env || {} : {};
const config = {
  apiKey: firebaseConfig.apiKey || metaEnv.VITE_FIREBASE_API_KEY || defaultFirebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain || metaEnv.VITE_FIREBASE_AUTH_DOMAIN || defaultFirebaseConfig.authDomain,
  projectId: firebaseConfig.projectId || metaEnv.VITE_FIREBASE_PROJECT_ID || defaultFirebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket || metaEnv.VITE_FIREBASE_STORAGE_BUCKET || defaultFirebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId || metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID || defaultFirebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId || metaEnv.VITE_FIREBASE_APP_ID || defaultFirebaseConfig.appId,
  firestoreDatabaseId: firebaseConfig.firestoreDatabaseId || metaEnv.VITE_FIREBASE_FIRESTORE_DATABASE_ID || defaultFirebaseConfig.firestoreDatabaseId,
};

// Initialize Firebase App instance safely
export const app = getApps().length === 0 ? initializeApp(config) : getApp();

// CRITICAL: Initialize Firestore with database ID from configuration
export const db = getFirestore(app, config.firestoreDatabaseId);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Authentication Helpers
export async function signInWithGoogle(): Promise<FirebaseUser> {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, provider);
  return result.user;
}

export async function signInWithEmail(email: string, pass: string): Promise<FirebaseUser> {
  const res = await signInWithEmailAndPassword(auth, email, pass);
  return res.user;
}

export async function signUpWithEmail(email: string, pass: string): Promise<FirebaseUser> {
  const res = await createUserWithEmailAndPassword(auth, email, pass);
  return res.user;
}

export async function signInAsGuest(displayName?: string): Promise<FirebaseUser> {
  const res = await signInAnonymously(auth);
  return res.user;
}

export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

export function onAuthChange(callback: (user: FirebaseUser | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, callback);
}

// Skill-mandated Error Handling Specification
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test utility
export async function testConnection(): Promise<boolean> {
  return true;
}

// Collection Names
export const COLLECTIONS = {
  AGENTS: 'agents',
  LEADS: 'leads',
  CALLS: 'calls',
  WORKFLOWS: 'workflows',
  DOCUMENTS: 'documents',
  APPOINTMENTS: 'appointments',
} as const;

// -------------------------------------------------------------
// 1. AGENTS (AI Employees)
// -------------------------------------------------------------
export function subscribeToAgents(
  onData: (agents: AIEmployee[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const currentUserId = auth.currentUser?.uid;
  if (!currentUserId) {
    onData([]);
    return () => {};
  }

  const q = query(
    collection(db, COLLECTIONS.AGENTS),
    where('userId', '==', currentUserId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items: AIEmployee[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ ...(docSnap.data() as AIEmployee), id: docSnap.id });
      });
      onData(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, COLLECTIONS.AGENTS);
    }
  );
}

export async function getAgents(): Promise<AIEmployee[]> {
  const currentUserId = auth.currentUser?.uid;
  if (!currentUserId) return [];

  const q = query(
    collection(db, COLLECTIONS.AGENTS),
    where('userId', '==', currentUserId)
  );

  try {
    const snap = await getDocs(q);
    const items: AIEmployee[] = [];
    snap.forEach((docSnap) => {
      items.push({ ...(docSnap.data() as AIEmployee), id: docSnap.id });
    });
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, COLLECTIONS.AGENTS);
  }
}

export async function addAgent(agent: AIEmployee): Promise<void> {
  const currentUserId = auth.currentUser?.uid;
  if (!currentUserId) {
    throw new Error('Authentication required: user is not signed in.');
  }
  const docId = agent.id || `agent_${Date.now()}`;
  const docRef = doc(db, COLLECTIONS.AGENTS, docId);
  try {
    await setDoc(docRef, { ...agent, id: docId, userId: currentUserId });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTIONS.AGENTS}/${docId}`);
  }
}

export const createAgent = addAgent;

export async function updateAgent(
  agentId: string,
  data: Partial<AIEmployee>
): Promise<void> {
  const docRef = doc(db, COLLECTIONS.AGENTS, agentId);
  try {
    await updateDoc(docRef, data);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTIONS.AGENTS}/${agentId}`);
  }
}

export async function toggleAgentStatus(
  agentId: string,
  currentStatus: AIEmployee['status']
): Promise<void> {
  const newStatus: AIEmployee['status'] =
    currentStatus === 'active' ? 'paused' : 'active';
  await updateAgent(agentId, { status: newStatus });
}

export async function deleteAgent(agentId: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.AGENTS, agentId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTIONS.AGENTS}/${agentId}`);
  }
}

// -------------------------------------------------------------
// 2. LEADS (CRM Pipeline)
// -------------------------------------------------------------
export function subscribeToLeads(
  onData: (leads: Lead[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const currentUserId = auth.currentUser?.uid;
  if (!currentUserId) {
    onData([]);
    return () => {};
  }

  const q = query(
    collection(db, COLLECTIONS.LEADS),
    where('userId', '==', currentUserId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items: Lead[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ ...(docSnap.data() as Lead), id: docSnap.id });
      });
      onData(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, COLLECTIONS.LEADS);
    }
  );
}

export async function getLeads(): Promise<Lead[]> {
  const currentUserId = auth.currentUser?.uid;
  if (!currentUserId) return [];

  const q = query(
    collection(db, COLLECTIONS.LEADS),
    where('userId', '==', currentUserId)
  );

  try {
    const snap = await getDocs(q);
    const items: Lead[] = [];
    snap.forEach((docSnap) => {
      items.push({ ...(docSnap.data() as Lead), id: docSnap.id });
    });
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, COLLECTIONS.LEADS);
  }
}

export async function addLead(lead: Lead): Promise<void> {
  const currentUserId = auth.currentUser?.uid;
  if (!currentUserId) {
    throw new Error('Authentication required: user is not signed in.');
  }
  const docId = lead.id || `ld_${Date.now()}`;
  const docRef = doc(db, COLLECTIONS.LEADS, docId);
  try {
    await setDoc(docRef, { ...lead, id: docId, userId: currentUserId });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTIONS.LEADS}/${docId}`);
  }
}

export async function updateLead(leadId: string, data: Partial<Lead>): Promise<void> {
  const docRef = doc(db, COLLECTIONS.LEADS, leadId);
  try {
    await updateDoc(docRef, data);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTIONS.LEADS}/${leadId}`);
  }
}

export async function updateLeadStatus(
  leadId: string,
  newStatus: Lead['status']
): Promise<void> {
  await updateLead(leadId, { status: newStatus });
}

export async function deleteLead(leadId: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.LEADS, leadId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTIONS.LEADS}/${leadId}`);
  }
}

// -------------------------------------------------------------
// 3. CALLS (AI Telephony & Live Voice Records)
// -------------------------------------------------------------
export function subscribeToCalls(
  onData: (calls: AICall[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const currentUserId = auth.currentUser?.uid;
  if (!currentUserId) {
    onData([]);
    return () => {};
  }

  const q = query(
    collection(db, COLLECTIONS.CALLS),
    where('userId', '==', currentUserId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items: AICall[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ ...(docSnap.data() as AICall), id: docSnap.id });
      });
      // Sort newest calls first
      items.sort((a, b) => b.id.localeCompare(a.id));
      onData(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, COLLECTIONS.CALLS);
    }
  );
}

export async function getCalls(): Promise<AICall[]> {
  const currentUserId = auth.currentUser?.uid;
  if (!currentUserId) return [];

  const q = query(
    collection(db, COLLECTIONS.CALLS),
    where('userId', '==', currentUserId)
  );

  try {
    const snap = await getDocs(q);
    const items: AICall[] = [];
    snap.forEach((docSnap) => {
      items.push({ ...(docSnap.data() as AICall), id: docSnap.id });
    });
    items.sort((a, b) => b.id.localeCompare(a.id));
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, COLLECTIONS.CALLS);
  }
}

export async function addCall(call: AICall): Promise<void> {
  const currentUserId = auth.currentUser?.uid;
  if (!currentUserId) {
    console.warn('Call record not saved to Firestore: Caller is not authenticated.');
    return;
  }
  const docId = call.id || `call_${Date.now()}`;
  const docRef = doc(db, COLLECTIONS.CALLS, docId);
  try {
    await setDoc(docRef, { ...call, id: docId, userId: currentUserId });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTIONS.CALLS}/${docId}`);
  }
}

export async function deleteCall(callId: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.CALLS, callId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTIONS.CALLS}/${callId}`);
  }
}

// -------------------------------------------------------------
// 4. WORKFLOWS (Autopilots & Visual Flows)
// -------------------------------------------------------------
export function subscribeToWorkflows(
  onData: (workflows: AutomationWorkflow[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const currentUserId = auth.currentUser?.uid;
  if (!currentUserId) {
    onData([]);
    return () => {};
  }

  const q = query(
    collection(db, COLLECTIONS.WORKFLOWS),
    where('userId', '==', currentUserId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items: AutomationWorkflow[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ ...(docSnap.data() as AutomationWorkflow), id: docSnap.id });
      });
      onData(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, COLLECTIONS.WORKFLOWS);
    }
  );
}

export async function getWorkflows(): Promise<AutomationWorkflow[]> {
  const currentUserId = auth.currentUser?.uid;
  if (!currentUserId) return [];

  const q = query(
    collection(db, COLLECTIONS.WORKFLOWS),
    where('userId', '==', currentUserId)
  );

  try {
    const snap = await getDocs(q);
    const items: AutomationWorkflow[] = [];
    snap.forEach((docSnap) => {
      items.push({ ...(docSnap.data() as AutomationWorkflow), id: docSnap.id });
    });
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, COLLECTIONS.WORKFLOWS);
  }
}

export async function addWorkflow(workflow: AutomationWorkflow): Promise<void> {
  const currentUserId = auth.currentUser?.uid;
  if (!currentUserId) {
    throw new Error('Authentication required: user is not signed in.');
  }
  const docId = workflow.id || `wf_${Date.now()}`;
  const docRef = doc(db, COLLECTIONS.WORKFLOWS, docId);
  try {
    await setDoc(docRef, { ...workflow, id: docId, userId: currentUserId });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTIONS.WORKFLOWS}/${docId}`);
  }
}

export async function toggleWorkflow(
  workflowId: string,
  currentActive: boolean
): Promise<void> {
  const docRef = doc(db, COLLECTIONS.WORKFLOWS, workflowId);
  try {
    await updateDoc(docRef, { active: !currentActive });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTIONS.WORKFLOWS}/${workflowId}`);
  }
}

export async function updateWorkflow(
  workflowId: string,
  data: Partial<AutomationWorkflow>
): Promise<void> {
  const docRef = doc(db, COLLECTIONS.WORKFLOWS, workflowId);
  try {
    await updateDoc(docRef, data);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTIONS.WORKFLOWS}/${workflowId}`);
  }
}

export async function deleteWorkflow(workflowId: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.WORKFLOWS, workflowId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTIONS.WORKFLOWS}/${workflowId}`);
  }
}

// -------------------------------------------------------------
// 5. DOCUMENTS (Knowledge Base Vector Docs)
// -------------------------------------------------------------
export function subscribeToDocuments(
  onData: (documents: KnowledgeDocument[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const currentUserId = auth.currentUser?.uid;
  if (!currentUserId) {
    onData([]);
    return () => {};
  }

  const q = query(
    collection(db, COLLECTIONS.DOCUMENTS),
    where('userId', '==', currentUserId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items: KnowledgeDocument[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ ...(docSnap.data() as KnowledgeDocument), id: docSnap.id });
      });
      onData(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, COLLECTIONS.DOCUMENTS);
    }
  );
}

export async function getDocuments(): Promise<KnowledgeDocument[]> {
  const currentUserId = auth.currentUser?.uid;
  if (!currentUserId) return [];

  const q = query(
    collection(db, COLLECTIONS.DOCUMENTS),
    where('userId', '==', currentUserId)
  );

  try {
    const snap = await getDocs(q);
    const items: KnowledgeDocument[] = [];
    snap.forEach((docSnap) => {
      items.push({ ...(docSnap.data() as KnowledgeDocument), id: docSnap.id });
    });
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, COLLECTIONS.DOCUMENTS);
  }
}

export async function addDocument(docData: KnowledgeDocument): Promise<void> {
  const currentUserId = auth.currentUser?.uid;
  if (!currentUserId) {
    throw new Error('Authentication required: user is not signed in.');
  }
  const docId = docData.id || `doc_${Date.now()}`;
  const docRef = doc(db, COLLECTIONS.DOCUMENTS, docId);
  try {
    await setDoc(docRef, { ...docData, id: docId, userId: currentUserId });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTIONS.DOCUMENTS}/${docId}`);
  }
}

export async function updateDocument(
  docId: string,
  data: Partial<KnowledgeDocument>
): Promise<void> {
  const docRef = doc(db, COLLECTIONS.DOCUMENTS, docId);
  try {
    await updateDoc(docRef, data);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTIONS.DOCUMENTS}/${docId}`);
  }
}

export async function deleteDocument(docId: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.DOCUMENTS, docId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTIONS.DOCUMENTS}/${docId}`);
  }
}

// -------------------------------------------------------------
// 6. APPOINTMENTS (Booked Meetings)
// -------------------------------------------------------------
export function subscribeToAppointments(
  onData: (appointments: Appointment[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  const currentUserId = auth.currentUser?.uid;
  if (!currentUserId) {
    onData([]);
    return () => {};
  }

  const q = query(
    collection(db, COLLECTIONS.APPOINTMENTS),
    where('userId', '==', currentUserId)
  );

  return onSnapshot(
    q,
    (snapshot) => {
      const items: Appointment[] = [];
      snapshot.forEach((docSnap) => {
        items.push({ ...(docSnap.data() as Appointment), id: docSnap.id });
      });
      onData(items);
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, COLLECTIONS.APPOINTMENTS);
    }
  );
}

export async function getAppointments(): Promise<Appointment[]> {
  const currentUserId = auth.currentUser?.uid;
  if (!currentUserId) return [];

  const q = query(
    collection(db, COLLECTIONS.APPOINTMENTS),
    where('userId', '==', currentUserId)
  );

  try {
    const snap = await getDocs(q);
    const items: Appointment[] = [];
    snap.forEach((docSnap) => {
      items.push({ ...(docSnap.data() as Appointment), id: docSnap.id });
    });
    return items;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, COLLECTIONS.APPOINTMENTS);
  }
}

export async function addAppointment(appointment: Appointment): Promise<void> {
  const currentUserId = auth.currentUser?.uid;
  if (!currentUserId) {
    throw new Error('Authentication required: user is not signed in.');
  }
  const docId = appointment.id || `apt_${Date.now()}`;
  const docRef = doc(db, COLLECTIONS.APPOINTMENTS, docId);
  try {
    await setDoc(docRef, { ...appointment, id: docId, userId: currentUserId });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTIONS.APPOINTMENTS}/${docId}`);
  }
}

export async function updateAppointmentStatus(
  appointmentId: string,
  newStatus: Appointment['status']
): Promise<void> {
  const docRef = doc(db, COLLECTIONS.APPOINTMENTS, appointmentId);
  try {
    await updateDoc(docRef, { status: newStatus });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTIONS.APPOINTMENTS}/${appointmentId}`);
  }
}

export async function deleteAppointment(appointmentId: string): Promise<void> {
  const docRef = doc(db, COLLECTIONS.APPOINTMENTS, appointmentId);
  try {
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${COLLECTIONS.APPOINTMENTS}/${appointmentId}`);
  }
}

// -------------------------------------------------------------
// SEEDING & MIGRATION HELPER: Populates initial sample data isolated per user
// -------------------------------------------------------------
export async function migrateLocalDataToFirestore(seeds: {
  agents: AIEmployee[];
  leads: Lead[];
  calls: AICall[];
  workflows: AutomationWorkflow[];
  documents: KnowledgeDocument[];
  appointments: Appointment[];
}): Promise<void> {
  const currentUserId = auth.currentUser?.uid;
  if (!currentUserId) {
    console.warn('Cannot migrate data: No authenticated user.');
    return;
  }

  try {
    const userPrefix = currentUserId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8);

    // 1. Check agents for this user
    const agentsQ = query(
      collection(db, COLLECTIONS.AGENTS),
      where('userId', '==', currentUserId)
    );
    const agentsSnap = await getDocs(agentsQ);
    if (agentsSnap.empty) {
      console.log(`Seeding initial agents for user ${currentUserId}...`);
      for (const a of seeds.agents) {
        const docId = `agent_${userPrefix}_${a.id}`;
        await setDoc(doc(db, COLLECTIONS.AGENTS, docId), {
          ...a,
          id: docId,
          userId: currentUserId,
        });
      }
    }

    // 2. Check leads for this user
    const leadsQ = query(
      collection(db, COLLECTIONS.LEADS),
      where('userId', '==', currentUserId)
    );
    const leadsSnap = await getDocs(leadsQ);
    if (leadsSnap.empty) {
      console.log(`Seeding initial leads for user ${currentUserId}...`);
      for (const l of seeds.leads) {
        const docId = `ld_${userPrefix}_${l.id}`;
        await setDoc(doc(db, COLLECTIONS.LEADS, docId), {
          ...l,
          id: docId,
          userId: currentUserId,
        });
      }
    }

    // 3. Check calls for this user
    const callsQ = query(
      collection(db, COLLECTIONS.CALLS),
      where('userId', '==', currentUserId)
    );
    const callsSnap = await getDocs(callsQ);
    if (callsSnap.empty) {
      console.log(`Seeding initial calls for user ${currentUserId}...`);
      for (const c of seeds.calls) {
        const docId = `call_${userPrefix}_${c.id}`;
        await setDoc(doc(db, COLLECTIONS.CALLS, docId), {
          ...c,
          id: docId,
          userId: currentUserId,
        });
      }
    }

    // 4. Check workflows for this user
    const workflowsQ = query(
      collection(db, COLLECTIONS.WORKFLOWS),
      where('userId', '==', currentUserId)
    );
    const workflowsSnap = await getDocs(workflowsQ);
    if (workflowsSnap.empty) {
      console.log(`Seeding initial workflows for user ${currentUserId}...`);
      for (const w of seeds.workflows) {
        const docId = `wf_${userPrefix}_${w.id}`;
        await setDoc(doc(db, COLLECTIONS.WORKFLOWS, docId), {
          ...w,
          id: docId,
          userId: currentUserId,
        });
      }
    }

    // 5. Check documents for this user
    const docsQ = query(
      collection(db, COLLECTIONS.DOCUMENTS),
      where('userId', '==', currentUserId)
    );
    const docsSnap = await getDocs(docsQ);
    if (docsSnap.empty) {
      console.log(`Seeding initial documents for user ${currentUserId}...`);
      for (const d of seeds.documents) {
        const docId = `doc_${userPrefix}_${d.id}`;
        await setDoc(doc(db, COLLECTIONS.DOCUMENTS, docId), {
          ...d,
          id: docId,
          userId: currentUserId,
        });
      }
    }

    // 6. Check appointments for this user
    const aptQ = query(
      collection(db, COLLECTIONS.APPOINTMENTS),
      where('userId', '==', currentUserId)
    );
    const aptSnap = await getDocs(aptQ);
    if (aptSnap.empty) {
      console.log(`Seeding initial appointments for user ${currentUserId}...`);
      for (const apt of seeds.appointments) {
        const docId = `apt_${userPrefix}_${apt.id}`;
        await setDoc(doc(db, COLLECTIONS.APPOINTMENTS, docId), {
          ...apt,
          id: docId,
          userId: currentUserId,
        });
      }
    }
  } catch (error) {
    console.warn('Initial data migration notice:', error);
  }
}

export const seedInitialDataIfEmpty = migrateLocalDataToFirestore;
