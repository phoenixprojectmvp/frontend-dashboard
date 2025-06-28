import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'; // 1. ייבוא ה-Provider שלנו

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider> {/* 2. עטיפת האפליקציה */}
      <App />
    </AuthProvider>
  </React.StrictMode>,
)