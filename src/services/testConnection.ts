// ServiceNow API Connection Test
// This file helps test the connection to your ServiceNow instance

import { getServiceNowConfig } from './init';

export const testServiceNowConnection = async () => {
  const config = getServiceNowConfig();
  
  console.log('🔧 Testing ServiceNow API Connection...');
  console.log('📡 Instance URL:', config.baseUrl);
  console.log('👤 Username:', config.username);
  console.log('🔐 Using OAuth:', config.useOAuth);
  
  try {
    // Test OAuth authentication
    if (config.useOAuth) {
      console.log('🔄 Testing OAuth authentication...');
      
      const oauthResponse = await fetch(`${config.baseUrl}/oauth_token.do`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'password',
          username: config.username,
          password: config.password,
          client_id: config.clientId!,
          client_secret: config.clientSecret!,
        }),
      });

      if (!oauthResponse.ok) {
        throw new Error(`OAuth failed: ${oauthResponse.status} ${oauthResponse.statusText}`);
      }

      const oauthData = await oauthResponse.json();
      console.log('✅ OAuth authentication successful!');
      console.log('🎫 Access token received');
      
      // Test catalog items endpoint
      console.log('📋 Testing catalog items endpoint...');
      
      const catalogResponse = await fetch(`${config.baseUrl}/api/sn_sc/servicecatalog/items?sysparm_limit=5`, {
        headers: {
          'Authorization': `Bearer ${oauthData.access_token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!catalogResponse.ok) {
        throw new Error(`Catalog API failed: ${catalogResponse.status} ${catalogResponse.statusText}`);
      }

      const catalogData = await catalogResponse.json();
      console.log('✅ Catalog items retrieved successfully!');
      console.log('📊 Response structure:', {
        count: catalogData.count,
        limit: catalogData.limit,
        offset: catalogData.offset,
        itemsCount: catalogData.result?.length || 0,
      });
      
      // Show sample item structure
      if (catalogData.result && catalogData.result.length > 0) {
        console.log('📝 Sample catalog item structure:');
        console.log(JSON.stringify(catalogData.result[0], null, 2));
      }
      
      // Test knowledge base endpoint
      console.log('📚 Testing knowledge base endpoint...');
      
      const kbResponse = await fetch(`${config.baseUrl}/api/sn_kmd/knowledge?sysparm_limit=3`, {
        headers: {
          'Authorization': `Bearer ${oauthData.access_token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!kbResponse.ok) {
        console.log('⚠️ Knowledge base endpoint not available or requires different permissions');
      } else {
        const kbData = await kbResponse.json();
        console.log('✅ Knowledge base retrieved successfully!');
        console.log('📊 KB Response structure:', {
          count: kbData.count,
          limit: kbData.limit,
          offset: kbData.offset,
          articlesCount: kbData.result?.length || 0,
        });
      }
      
    } else {
      // Test Basic Auth
      console.log('🔐 Testing Basic authentication...');
      
      const credentials = btoa(`${config.username}:${config.password}`);
      const response = await fetch(`${config.baseUrl}/api/sn_sc/servicecatalog/items?sysparm_limit=5`, {
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Basic authentication successful!');
      console.log('📊 Response structure:', {
        count: data.count,
        limit: data.limit,
        offset: data.offset,
        itemsCount: data.result?.length || 0,
      });
    }
    
    console.log('🎉 ServiceNow API connection test completed successfully!');
    return true;
    
  } catch (error) {
    console.error('❌ ServiceNow API connection test failed:', error);
    console.log('💡 Troubleshooting tips:');
    console.log('   - Check if the ServiceNow instance is accessible');
    console.log('   - Verify username and password');
    console.log('   - Ensure REST API is enabled');
    console.log('   - Check user permissions');
    console.log('   - Verify OAuth configuration (if using OAuth)');
    return false;
  }
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).testServiceNowConnection = testServiceNowConnection;
} 