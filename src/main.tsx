import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Intercept benign third-party LiveKit / ElevenLabs WebRTC WebSocket disconnect errors
// so they are logged as warnings and seamlessly handled by the Smart Voice fallback
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  const message = typeof args[0] === 'string' ? args[0] : '';
  if (
    message.includes('error reading from signal stream') ||
    message.includes('ElevenLabs session error') ||
    (args[1] && typeof args[1] === 'string' && args[1].includes('signal stream'))
  ) {
    console.warn('[Voice Engine WebRTC Info]:', ...args);
    return;
  }
  originalConsoleError.apply(console, args);
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
