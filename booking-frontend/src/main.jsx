import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#18182c',
            color: '#fff',
            border: '1px solid rgba(212,175,55,0.3)',
            borderRadius: '12px',
            fontFamily: '"DM Sans", sans-serif',
            fontSize: '14px',
          },
          success: {
            iconTheme: { primary: '#D4AF37', secondary: '#07070f' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#07070f' },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
