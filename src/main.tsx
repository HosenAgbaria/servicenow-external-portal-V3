import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('🚀 Starting React application...');

// ServiceNow API Integration - Initialize after app loads
const initializeServiceNowAPI = async () => {
  try {
    const { initializeRealServiceNowApi } = await import('./services/apiService');
    const { getServiceNowConfig } = await import('./services/init');
    
    const config = getServiceNowConfig();
    initializeRealServiceNowApi(config);
    console.log('✅ ServiceNow API initialized successfully');
  } catch (error) {
    console.warn('⚠️ ServiceNow API initialization failed, using mock data:', error);
  }
};

// Initialize API after app loads
setTimeout(initializeServiceNowAPI, 100);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
