import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register service worker for complete offline capability (PWA)
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('App update available');
  },
  onOfflineReady() {
    console.log('Question Bank is ready to work offline');
  },
});

createRoot(document.getElementById('root')!).render(<App />);

