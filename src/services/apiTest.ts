// Simple test to verify ServiceNow API connectivity
export const testServiceNowConnection = async () => {
  try {
    const baseUrl = import.meta.env.VITE_SERVICENOW_BASE_URL || 'https://tanivdynamicsltddemo4.service-now.com';
    const username = import.meta.env.VITE_SERVICENOW_USERNAME || 'ext.portal.v2';
    const password = import.meta.env.VITE_SERVICENOW_PASSWORD || '*]<D7sP^KX+zW1Nn.VJ6P,(w=-$5QJ';
    
    const authHeader = `Basic ${btoa(`${username}:${password}`)}`;
    
    console.log('Testing ServiceNow connection to:', baseUrl);
    
    const response = await fetch(`${baseUrl}/api/now/table/sc_catalog`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ ServiceNow API connection successful');
      console.log('Catalog items found:', data.result?.length || 0);
      return { success: true, data };
    } else {
      console.error('❌ ServiceNow API connection failed:', response.status, response.statusText);
      return { success: false, error: `${response.status} ${response.statusText}` };
    }
  } catch (error) {
    console.error('❌ ServiceNow API connection error:', error);
    return { success: false, error: error.message };
  }
};

// Test function that can be called from browser console
if (typeof window !== 'undefined') {
  (window as any).testServiceNow = testServiceNowConnection;
}