import { auth } from './firebase';

export interface AIChatResponse {
  reply: string;
  uid?: string;
  timestamp?: string;
}

/**
 * Sends customer message to the backend /api/chat route with the authenticated user's Firebase ID token.
 */
export async function sendAIChatMessage(message: string): Promise<string> {
  const currentUser = auth.currentUser;
  let idToken: string | null = null;
  if (currentUser) {
    try {
      idToken = await currentUser.getIdToken(false);
    } catch (e) {
      console.debug('Could not get fresh token:', e);
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (idToken) {
    headers['Authorization'] = `Bearer ${idToken}`;
  }

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers,
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    let errorMessage = `AI request failed with status ${res.status}`;
    try {
      const errorJson = await res.json();
      if (errorJson.error) {
        errorMessage = errorJson.error;
      }
    } catch {
      // ignore json parse error
    }
    throw new Error(errorMessage);
  }

  const data: AIChatResponse = await res.json();
  return data.reply;
}
