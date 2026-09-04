import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { getAIResponse } from './src/server/aiProvider';

// Read Firebase Web API Key for ID token verification
let firebaseApiKey = process.env.VITE_FIREBASE_API_KEY || 'AIzaSyAxKfZ59BdZ-2XUEgZwY8CX8Szw3N3kx8Y';
try {
  const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    const rawConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    if (rawConfig.apiKey) {
      firebaseApiKey = rawConfig.apiKey;
    }
  }
} catch (e) {
  console.warn('Notice: using default Firebase Web API Key for auth verification.');
}

async function verifyFirebaseIdToken(token: string): Promise<{ uid: string; email?: string } | null> {
  try {
    const res = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: token }),
      }
    );

    if (!res.ok) {
      console.error('Firebase token verification failed with status:', res.status);
      return null;
    }

    const data: any = await res.json();
    if (data && data.users && data.users.length > 0) {
      return {
        uid: data.users[0].localId,
        email: data.users[0].email,
      };
    }
    return null;
  } catch (err) {
    console.error('Error verifying Firebase token:', err);
    return null;
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'Client Care AI Provider Backend',
      timestamp: new Date().toISOString(),
    });
  });

  // Authenticated AI Chat Route
  app.post('/api/chat', async (req: Request, res: Response): Promise<void> => {
    try {
      // 1. Verify Authorization Header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({
          error: 'Unauthorized: Missing or invalid Bearer token in Authorization header.',
        });
        return;
      }

      const idToken = authHeader.split('Bearer ')[1]?.trim();
      if (!idToken) {
        res.status(401).json({
          error: 'Unauthorized: Firebase ID token is required.',
        });
        return;
      }

      // 2. Validate Firebase ID Token and extract user UID
      const authUser = await verifyFirebaseIdToken(idToken);
      if (!authUser || !authUser.uid) {
        res.status(401).json({
          error: 'Unauthorized: Invalid or expired Firebase ID token.',
        });
        return;
      }

      // 3. Extract user message
      const userMessage = req.body?.message || req.body?.userMessage;
      if (!userMessage || typeof userMessage !== 'string' || !userMessage.trim()) {
        res.status(400).json({
          error: 'Bad Request: "message" parameter is required and must be non-empty string.',
        });
        return;
      }

      console.log(`[AI Chat] Received query from user UID: ${authUser.uid}`);

      // 4. Generate AI response using aiProvider (Gemini -> OpenRouter fallbacks)
      const aiReply = await getAIResponse(userMessage.trim());

      res.json({
        reply: aiReply,
        uid: authUser.uid,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      console.error('Error handling /api/chat request:', err);
      res.status(500).json({
        error: 'Internal Server Error while generating AI response.',
        details: err?.message || String(err),
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Client Care server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
