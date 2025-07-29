// ServiceNow API Initialization
// This file contains the configuration and initialization logic for connecting to real ServiceNow APIs

import type { ServiceNowConfig } from './realApiService';

export const getServiceNowConfig = (): ServiceNowConfig => {
  // Use import.meta.env for Vite instead of process.env
  return {
    baseUrl: import.meta.env.VITE_SERVICENOW_BASE_URL || 'https://tanivdynamicsltddemo4.service-now.com',
    username: import.meta.env.VITE_SERVICENOW_USERNAME || 'ext.portal',
    password: import.meta.env.VITE_SERVICENOW_PASSWORD || '5jmAwL*0i1VvBuM(vaAwH_340QiJtA^2hy1=10wKN*ea2Z.-k8;W[(KVU3MdnT.XssrwqDNvJsyZR)jV{$ImX;Y]w(1r',
    clientId: import.meta.env.VITE_SERVICENOW_CLIENT_ID || '1fcct8c927c54abbeb2ba990f6149043',
    clientSecret: import.meta.env.VITE_SERVICENOW_CLIENT_SECRET || 'Jfjwy4o$eg',
    useOAuth: import.meta.env.VITE_SERVICENOW_USE_OAUTH === 'true' || true,
  };
};

export const serviceNowEndpoints = {
  oauth: '/oauth_token.do',
  catalogItems: '/api/sn_sc/servicecatalog/items',
  catalogItemDetails: '/api/sn_sc/servicecatalog/items',
  catalogItemForm: '/api/sn_sc/servicecatalog/items',
  submitRequest: '/api/sn_sc/servicecatalog/items',
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