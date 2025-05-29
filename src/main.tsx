import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { LuminaContextProvider } from './Lumina.tsx'
import { LeapClientContextProvider } from './LeapClient.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LeapClientContextProvider>
      <LuminaContextProvider>
        <App />
      </LuminaContextProvider>
    </LeapClientContextProvider>
  </StrictMode>,
)
