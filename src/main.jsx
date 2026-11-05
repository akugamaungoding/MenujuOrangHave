import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Global Styles (Tailwind v4, Google fonts, paper texture & animations)
import './styles/index.css';

// Initialize i18n system
import './i18n/index.js';

import App from './App.jsx';

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
