import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { SidebarProvider } from './context/SidebarContext'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './components/common/Toast'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
        <SidebarProvider>
          <App />
        </SidebarProvider>
      </ToastProvider>
    </AuthProvider>
  </StrictMode>,
)
