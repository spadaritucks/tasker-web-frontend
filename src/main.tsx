import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { env } from './env/env.ts';
import dayjs from 'dayjs';

import 'dayjs/locale/pt-br'

dayjs.locale('pt-br')

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <StrictMode>
      <GoogleOAuthProvider clientId={env.VITE_GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </StrictMode>,

  </BrowserRouter>
)
