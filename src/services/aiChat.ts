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
  if (!currentUser) {
    throw new Error('Authentication required: Please sign in to interact with the AI Employee.');
  }

  // Obtain fresh Firebase Auth ID token
  const idToken = await currentUser.getIdToken(false);

  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`,
    },
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
