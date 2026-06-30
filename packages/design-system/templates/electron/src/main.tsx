import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@ds/css/variables.css';
import './styles/main.scss';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { initShellTheme } from 'plantasonic-design-system/shell';

initShellTheme('dark');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
