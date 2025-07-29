import fetch from 'node-fetch';

console.log('🔍 Testing Accessible ServiceNow Tables...\n');

async function testAccessibleTables() {
  const tables = [
    'incident',
    'sc_incident', 
    'sc_req_item',
    'sc_request',
    'request',
    'task',
    'sys_user',
    'cmn_location',
    'cmn_department'
  ];
  
  console.log('📋 Testing table access...\n');
  
  for (const table of tables) {
    try {
      console.log(`🔍 Testing ${table}...`);
      
      // Test GET access
      const getResponse = await fetch(`http://localhost:3001/api/servicenow/api/now/table/${table}?sysparm_limit=1`);
      console.log(`   GET ${table}: ${getResponse.status} ${getResponse.statusText}`);
      
      if (getResponse.ok) {
        const data = await getResponse.json();
        console.log(`   ✅ GET accessible - Found ${data.result?.length || 0} records`);
        
        // Test POST access with minimal data
        const postData = {
          short_description: `Test record from external portal - ${new Date().toISOString()}`,
          description: 'Test record created via external portal API'
        };
        
        const postResponse = await fetch(`http://localhost:3001/api/servicenow/api/now/table/${table}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData)
        });
        
        console.log(`   POST ${table}: ${postResponse.status} ${postResponse.statusText}`);
        
        if (postResponse.ok) {
          const postResult = await postResponse.json();
          console.log(`   ✅ POST accessible - Created record: ${postResult.result?.sys_id || 'unknown'}`);
        } else {
          const errorText = await postResponse.text();
          console.log(`   ❌ POST failed: ${errorText.substring(0, 100)}...`);
        }
      } else {
        console.log(`   ❌ GET failed: ${getResponse.status} ${getResponse.statusText}`);
      }
      
      console.log('');
      
    } catch (error) {
      console.log(`   ❌ Error testing ${table}: ${error.message}`);
      console.log('');
    }
  }
  
  // Test specific catalog-related endpoints
  console.log('🔍 Testing catalog-specific endpoints...\n');
  
  const catalogEndpoints = [
    '/api/sn_sc/servicecatalog/items',
    '/api/sn_sc/request',
    '/api/sn_sc/order',
    '/api/sn_sc/servicecatalog/request'
  ];
  
  for (const endpoint of catalogEndpoints) {
    try {
      console.log(`🔍 Testing ${endpoint}...`);
      
      const response = await fetch(`http://localhost:3001/api/servicenow${endpoint}?sysparm_limit=1`);
      console.log(`   ${endpoint}: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ Accessible - Found ${data.result?.length || 0} records`);
      }
      
      console.log('');
      
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      console.log('');
    }
  }
}

testAccessibleTables(); 