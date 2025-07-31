import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './i18n'
import './services/apiTest' // Import API test for debugging
console.log('🚀 Starting React application...');

try {
  console.log('📦 Importing React and ReactDOM...');
  console.log('React version:', React.version);
  
  console.log('🎯 Getting root element...');
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found!');
  }
  console.log('✅ Root element found');
  
  console.log('🏗️ Creating React root...');
  const root = ReactDOM.createRoot(rootElement);
  console.log('✅ React root created');
  
  console.log('🎨 Rendering App component...');
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('✅ App component rendered successfully');
  
  // ServiceNow API Integration - Initialize after React renders
  const initializeServiceNowAPI = async () => {
    try {
      console.log('🔧 Initializing ServiceNow API...');
      const { initializeRealServiceNowApi } = await import('./services/apiService');
      const { getServiceNowConfig } = await import('./services/init');
      
      const config = getServiceNowConfig();
      initializeRealServiceNowApi(config);
      console.log('✅ ServiceNow API initialized successfully');
    } catch (error) {
      console.warn('⚠️ ServiceNow API initialization failed, using mock data:', error);
    }
  };
  
  // Initialize API after React renders
  setTimeout(initializeServiceNowAPI, 1000);
  
} catch (error) {
  console.error('💥 Critical error in main.tsx:', error);
  // Try to show error in DOM
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `<div style="padding: 20px; color: red; font-family: monospace;"><h2>Application Error</h2><p>${error instanceof Error ? error.message : 'Unknown error'}</p><pre>${error instanceof Error ? error.stack : 'No stack trace available'}</pre></div>`;
  }
}
