import { createRoot } from 'react-dom/client';

import App from './App';
import { ErrorBoundary } from '@/components/error-boundary';

// Self-hosted fonts. Cormorant Garamond at the design system's three
// approved weights (300/400/600), upright + italic; DM Sans variable
// weight+optical-size axis, upright + italic, for all body/UI copy.
import '@fontsource-variable/space-grotesk/wght.css';
import '@fontsource-variable/geist-mono/wght.css';
import '@fontsource-variable/dm-sans/opsz.css';
import '@fontsource-variable/dm-sans/opsz-italic.css';

import './index.css';

createRoot(document.getElementById('root')!, {
  // Keeps caught errors off reportError(), which would raise the dev overlay.
  onCaughtError: (error, errorInfo) => {
    console.error(error, errorInfo.componentStack);
  },
}).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
