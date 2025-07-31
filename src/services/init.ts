// ServiceNow API Initialization
// This file contains the configuration and initialization logic for connecting to real ServiceNow APIs

import type { ServiceNowConfig } from './realApiService';

export const getServiceNowConfig = (): ServiceNowConfig => {
  // Use import.meta.env for Vite instead of process.env
  const config = {
    baseUrl: import.meta.env.VITE_SERVICENOW_BASE_URL,
    username: import.meta.env.VITE_SERVICENOW_USERNAME,
    password: import.meta.env.VITE_SERVICENOW_PASSWORD,
    clientId: import.meta.env.VITE_SERVICENOW_CLIENT_ID,
    clientSecret: import.meta.env.VITE_SERVICENOW_CLIENT_SECRET,
    useOAuth: import.meta.env.VITE_SERVICENOW_USE_OAUTH === 'true',
  };
  
  // Validate that required environment variables are present
  if (!config.baseUrl || !config.username || !config.password) {
    console.warn('Missing required ServiceNow environment variables. Using mock data instead.');
    console.warn('Required variables: VITE_SERVICENOW_BASE_URL, VITE_SERVICENOW_USERNAME, VITE_SERVICENOW_PASSWORD');
    // Return a default config that won't break the app
    return {
      baseUrl: 'https://demo.service-now.com',
      username: 'demo',
      password: 'demo',
      clientId: '',
      clientSecret: '',
      useOAuth: false,
    };
  }
  
  return config;
};

export const serviceNowEndpoints = {
  oauth: '/oauth_token.do',
  catalogItems: '/api/servicenow/api/sn_sc/servicecatalog/items',
    catalogItemDetails: '/api/servicenow/api/sn_sc/servicecatalog/items',
    catalogItemForm: '/api/servicenow/api/sn_sc/servicecatalog/items',
  submitRequest: '/api/servicenow/api/sn_sc/servicecatalog/items',
  knowledgeArticles: '/api/sn_kmdl/knowledge',
  userRequests: '/api/sn_sc/request',
  referenceData: '/api/now/table',
};

export const setupInstructions = `
To connect to real ServiceNow APIs:

1. Create a .env file in your project root with the following variables:
   VITE_SERVICENOW_BASE_URL=https://tanivdynamicsltddemo4.service-now.com
   VITE_SERVICENOW_USERNAME=ext.portal
   VITE_SERVICENOW_PASSWORD=your-password
   VITE_SERVICENOW_CLIENT_ID=1fcct8c927c54abbeb2ba990f6149043
   VITE_SERVICENOW_CLIENT_SECRET=Jfjwy4o$eg
   VITE_SERVICENOW_USE_OAUTH=true

2. Restart the development server after creating the .env file

3. The app will automatically use real ServiceNow APIs when the .env file is present

Note: For production, these environment variables should be set on your hosting platform.
`;