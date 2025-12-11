// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { HelmetProvider } from 'react-helmet-async'; // Import ini
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <HelmetProvider> {/* Bungkus App */}
      <App />
    </HelmetProvider>
)