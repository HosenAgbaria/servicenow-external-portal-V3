import fetch from 'node-fetch';

// ServiceNow configuration
const SERVICENOW_CONFIG = {
  baseUrl: 'https://tanivdynamicsltddemo4.service-now.com',
  username: 'ext.portal.v2',
  password: '*]<D7sP^KX+zW1Nn.VJ6P,(w=-$5QJ',
  clientId: '1fcct8c927c54abbeb2ba990f6149043',
  clientSecret: 'Jfjwy4o$eg'
};

console.log('🔧 Testing ServiceNow Credentials...\n');

// Test 1: Basic Auth with simple endpoint
async function testBasicAuth() {
  console.log('1️⃣ Testing Basic Auth...');
  
  try {
    const auth = Buffer.from(`${SERVICENOW_CONFIG.username}:${SERVICENOW_CONFIG.password}`).toString('base64');
    
    const response = await fetch(`${SERVICENOW_CONFIG.baseUrl}/api/now/table/sys_user?sysparm_limit=1`, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ Basic Auth successful!');
      console.log(`   📊 Found ${data.result?.length || 0} users`);
    } else {
      const errorText = await response.text();
      console.log('   ❌ Basic Auth failed');
      console.log(`   📝 Error: ${errorText}`);
    }
  } catch (error) {
    console.log('   ❌ Basic Auth error:', error.message);
  }
  console.log('');
}

// Test 2: OAuth Token Request
async function testOAuth() {
  console.log('2️⃣ Testing OAuth...');
  
  try {
    const response = await fetch(`${SERVICENOW_CONFIG.baseUrl}/oauth_token.do`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'password',
        username: SERVICENOW_CONFIG.username,
        password: SERVICENOW_CONFIG.password,
        client_id: SERVICENOW_CONFIG.clientId,
        client_secret: SERVICENOW_CONFIG.clientSecret,
      }),
    });

    console.log(`   Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('   ✅ OAuth successful!');
      console.log(`   🎫 Token type: ${data.token_type}`);
      console.log(`   ⏰ Expires in: ${data.expires_in} seconds`);
    } else {
      const errorText = await response.text();
      console.log('   ❌ OAuth failed');
      console.log(`   📝 Error: ${errorText}`);
    }
  } catch (error) {
    console.log('   ❌ OAuth error:', error.message);
  }
  console.log('');
}

// Test 3: Test with different username formats
async function testUsernameFormats() {
  console.log('3️⃣ Testing different username formats...');
  
  const usernameFormats = [
    'ext.portal.v2',
    'ext.portal',
    'ext_portal_v2',
    'ext_portal',
    'extportal.v2',
    'extportal',
    'EXT.PORTAL.V2',
    'EXT.PORTAL'
  ];
  
  for (const username of usernameFormats) {
    try {
      const auth = Buffer.from(`${username}:${SERVICENOW_CONFIG.password}`).toString('base64');
      
      const response = await fetch(`${SERVICENOW_CONFIG.baseUrl}/api/now/table/sys_user?sysparm_limit=1`, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log(`   ${username}: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        console.log(`   ✅ Username format "${username}" worked!`);
        break;
      }
    } catch (error) {
      console.log(`   ${username}: Error - ${error.message}`);
    }
  }
  console.log('');
}

// Test 4: Test with different password formats
async function testPasswordFormats() {
  console.log('4️⃣ Testing different password formats...');
  
  const passwordFormats = [
    SERVICENOW_CONFIG.password,
    encodeURIComponent(SERVICENOW_CONFIG.password),
    decodeURIComponent(SERVICENOW_CONFIG.password),
    SERVICENOW_CONFIG.password.replace(/[^a-zA-Z0-9]/g, ''),
    SERVICENOW_CONFIG.password.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
  ];
  
  for (let i = 0; i < passwordFormats.length; i++) {
    const password = passwordFormats[i];
    const label = i === 0 ? 'original' : i === 1 ? 'URL-encoded' : i === 2 ? 'URL-decoded' : i === 3 ? 'alphanumeric-only' : 'alphanumeric-lowercase';
    
    try {
      const auth = Buffer.from(`${SERVICENOW_CONFIG.username}:${password}`).toString('base64');
      
      const response = await fetch(`${SERVICENOW_CONFIG.baseUrl}/api/now/table/sys_user?sysparm_limit=1`, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log(`   ${label}: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        console.log(`   ✅ Password format "${label}" worked!`);
        break;
      }
    } catch (error) {
      console.log(`   ${label}: Error - ${error.message}`);
    }
  }
  console.log('');
}

// Test 5: Test instance accessibility
async function testInstanceAccess() {
  console.log('5️⃣ Testing instance accessibility...');
  
  try {
    const response = await fetch(`${SERVICENOW_CONFIG.baseUrl}/api/now/table/sys_user`, {
      method: 'OPTIONS',
    });

    console.log(`   Status: ${response.status} ${response.statusText}`);
    console.log(`   Headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}`);
    
    if (response.ok) {
      console.log('   ✅ Instance is accessible');
    } else {
      console.log('   ❌ Instance access issues');
    }
  } catch (error) {
    console.log('   ❌ Instance access error:', error.message);
  }
  console.log('');
}

// Test 6: Test with different endpoints
async function testDifferentEndpoints() {
  console.log('6️⃣ Testing different endpoints...');
  
  const endpoints = [
    '/api/now/table/sys_user?sysparm_limit=1',
    '/api/now/table/sys_user',
    '/api/now/table/sys_user?sysparm_query=active=true',
    '/api/now/table/sys_user?sysparm_limit=1&sysparm_fields=sys_id,name',
    '/api/now/table/sys_user?sysparm_limit=1&sysparm_display_value=true'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const auth = Buffer.from(`${SERVICENOW_CONFIG.username}:${SERVICENOW_CONFIG.password}`).toString('base64');
      
      const response = await fetch(`${SERVICENOW_CONFIG.baseUrl}${endpoint}`, {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log(`   ${endpoint}: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        console.log(`   ✅ Endpoint "${endpoint}" worked!`);
        break;
      }
    } catch (error) {
      console.log(`   ${endpoint}: Error - ${error.message}`);
    }
  }
  console.log('');
}

// Run all tests
async function runAllTests() {
  await testInstanceAccess();
  await testBasicAuth();
  await testOAuth();
  await testUsernameFormats();
  await testPasswordFormats();
  await testDifferentEndpoints();
  
  console.log('🎯 Test Summary:');
  console.log('   - If any test works: Use that method in the proxy');
  console.log('   - If all fail: Credentials or permissions need to be updated');
  console.log('   - Check with ServiceNow admin for correct credentials');
}

runAllTests().catch(console.error); 