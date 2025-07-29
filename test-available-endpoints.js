import fetch from 'node-fetch';

async function testAvailableEndpoints() {
  const itemId = '03321da2eb1aaa506f8afa24bad0cdba';
  
  console.log('🔍 Testing available ServiceNow endpoints and tables...\n');
  
  // Test 1: Check what tables are accessible
  console.log('1️⃣ Testing available tables...');
  
  const tables = [
    'sc_req_item',
    'sc_request', 
    'incident',
    'task',
    'request',
    'sc_incident',
    'sc_task',
    'kb_knowledge',
    'sys_user',
    'cmn_location'
  ];
  
  for (const table of tables) {
    try {
      const response = await fetch(`http://localhost:3001/api/servicenow/api/now/table/${table}?sysparm_limit=1`);
      console.log(`   ${table}: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ ${table} accessible - ${data.result?.length || 0} records`);
      }
    } catch (error) {
      console.log(`   ❌ ${table}: Error - ${error.message}`);
    }
  }
  
  // Test 2: Check ServiceNow REST API endpoints
  console.log('\n2️⃣ Testing ServiceNow REST API endpoints...');
  
  const restEndpoints = [
    '/api/sn_sc/servicecatalog/items',
    '/api/sn_sc/request',
    '/api/sn_sc/order_guide',
    '/api/sn_kmd/knowledge',
    '/api/now/table/sc_req_item',
    '/api/now/table/sc_request'
  ];
  
  for (const endpoint of restEndpoints) {
    try {
      const response = await fetch(`http://localhost:3001/api/servicenow${endpoint}?sysparm_limit=1`);
      console.log(`   ${endpoint}: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ ${endpoint} accessible`);
      }
    } catch (error) {
      console.log(`   ❌ ${endpoint}: Error - ${error.message}`);
    }
  }
  
  // Test 3: Test POST operations on available tables
  console.log('\n3️⃣ Testing POST operations on available tables...');
  
  const testData = {
    short_description: "Test request from external portal",
    description: "This is a test request created via API",
    requested_for: "ext.portal.v2"
  };
  
  const writableTables = ['sc_req_item', 'sc_request', 'incident', 'task'];
  
  for (const table of writableTables) {
    try {
      console.log(`   Testing POST to ${table}...`);
      
      const response = await fetch(`http://localhost:3001/api/servicenow/api/now/table/${table}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(testData)
      });
      
      console.log(`   ${table} POST: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ SUCCESS! Created record in ${table}:`, data.result);
        console.log(`   🎯 sys_id: ${data.result.sys_id}`);
        console.log(`   🎯 number: ${data.result.number || 'N/A'}`);
      } else {
        const errorText = await response.text();
        console.log(`   ❌ Error: ${errorText.substring(0, 150)}...`);
      }
    } catch (error) {
      console.log(`   ❌ ${table} POST Error: ${error.message}`);
    }
  }
  
  // Test 4: Test catalog item specific operations
  console.log('\n4️⃣ Testing catalog item specific operations...');
  
  try {
    // Get catalog item details
    const itemResponse = await fetch(`http://localhost:3001/api/servicenow/api/sn_sc/servicecatalog/items/${itemId}`);
    
    if (itemResponse.ok) {
      const itemData = await itemResponse.json();
      console.log(`   ✅ Catalog item accessible: ${itemData.result.name}`);
      console.log(`   📋 Variables: ${itemData.result.variables?.length || 0} fields`);
      
      // Try to create a request item with the catalog item
      const reqItemData = {
        cat_item: itemId,
        short_description: `Request for ${itemData.result.name}`,
        description: "Test request from external portal",
        requested_for: "ext.portal.v2",
        quantity: 1
      };
      
      const reqItemResponse = await fetch('http://localhost:3001/api/servicenow/api/now/table/sc_req_item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(reqItemData)
      });
      
      console.log(`   sc_req_item creation: ${reqItemResponse.status} ${reqItemResponse.statusText}`);
      
      if (reqItemResponse.ok) {
        const reqItemResult = await reqItemResponse.json();
        console.log(`   ✅ SUCCESS! Created sc_req_item:`, reqItemResult.result);
        console.log(`   🎯 This is the correct approach!`);
      } else {
        const errorText = await reqItemResponse.text();
        console.log(`   ❌ sc_req_item Error: ${errorText.substring(0, 150)}...`);
      }
    } else {
      console.log(`   ❌ Catalog item not accessible: ${itemResponse.status}`);
    }
  } catch (error) {
    console.log(`   ❌ Catalog item test error: ${error.message}`);
  }
}

// Run the test
testAvailableEndpoints().then(() => {
  console.log('\n🏁 Endpoint discovery completed');
}).catch(error => {
  console.error('❌ Test failed:', error);
}); 