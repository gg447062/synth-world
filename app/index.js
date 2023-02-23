import App from './Components/App';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { SequenceContextProvider } from './sequence-context';

const container = document.getElementById('app');
const root = createRoot(container);

root.render(
  <SequenceContextProvider>
    <App />
  </SequenceContextProvider>
);
