import fetch from 'node-fetch';

console.log('🔍 Testing ServiceNow Write Access - Finding Real Endpoints...\n');

async function testServiceNowWriteAccess() {
  const itemId = '02676922eb9aaa506f8afa24bad0cdec';
  
  try {
    // Test 1: Get catalog item details
    console.log('1️⃣ Getting catalog item details...');
    const itemResponse = await fetch(`http://localhost:3001/api/servicenow/api/sn_sc/servicecatalog/items/${itemId}`);
    
    if (!itemResponse.ok) {
      console.log(`❌ Failed to get item: ${itemResponse.status}`);
      return;
    }
    
    const itemData = await itemResponse.json();
    console.log(`✅ Item: ${itemData.result.name}`);
    
    // Test 2: Try different ServiceNow tables for creating records
    console.log('\n2️⃣ Testing different ServiceNow tables...');
    
    const tables = [
      'incident',
      'sc_incident',
      'sc_req_item', 
      'sc_request',
      'request',
      'task',
      'change_request',
      'problem',
      'kb_knowledge'
    ];
    
    for (const table of tables) {
      console.log(`\n🔍 Testing ${table} table...`);
      
      try {
        // Test GET access first
        const getResponse = await fetch(`http://localhost:3001/api/servicenow/api/now/table/${table}?sysparm_limit=1`);
        console.log(`   GET ${table}: ${getResponse.status} ${getResponse.statusText}`);
        
        if (getResponse.ok) {
          // Try POST with minimal data
          const postData = {
            short_description: `Test request from external portal - ${new Date().toISOString()}`,
            description: 'Test request created via external portal API'
          };
          
          // Add table-specific required fields
          if (table === 'sc_req_item') {
            postData.cat_item = itemId;
            postData.requested_for = 'ext.portal.v2';
          } else if (table === 'sc_request') {
            postData.requested_for = 'ext.portal.v2';
          } else if (table === 'incident') {
            postData.caller_id = 'ext.portal.v2';
          }
          
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
            console.log(`   ✅ SUCCESS! Created record in ${table}:`, postResult.result);
            console.log(`   🎯 Record sys_id: ${postResult.result.sys_id}`);
            console.log(`   🎯 Record number: ${postResult.result.number || 'N/A'}`);
            return { table, result: postResult.result };
          } else {
            const errorText = await postResponse.text();
            console.log(`   ❌ POST failed: ${errorText.substring(0, 200)}...`);
          }
        }
      } catch (error) {
        console.log(`   ❌ Error testing ${table}: ${error.message}`);
      }
    }
    
    // Test 3: Try ServiceNow REST API endpoints
    console.log('\n3️⃣ Testing ServiceNow REST API endpoints...');
    
    const restEndpoints = [
      '/api/sn_sc/servicecatalog/items',
      '/api/sn_sc/request',
      '/api/sn_sc/order',
      '/api/sn_sc/servicecatalog/request',
      '/api/now/table/sc_req_item',
      '/api/now/table/sc_request'
    ];
    
    for (const endpoint of restEndpoints) {
      console.log(`\n🔍 Testing ${endpoint}...`);
      
      try {
        const response = await fetch(`http://localhost:3001/api/servicenow${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            short_description: `Test request from external portal - ${new Date().toISOString()}`,
            description: 'Test request created via external portal API'
          })
        });
        
        console.log(`   POST ${endpoint}: ${response.status} ${response.statusText}`);
        
        if (response.ok) {
          const result = await response.json();
          console.log(`   ✅ SUCCESS! Created record via ${endpoint}:`, result);
          return { endpoint, result };
        } else {
          const errorText = await response.text();
          console.log(`   ❌ POST failed: ${errorText.substring(0, 200)}...`);
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}`);
      }
    }
    
    console.log('\n❌ No working write endpoints found');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testServiceNowWriteAccess(); 