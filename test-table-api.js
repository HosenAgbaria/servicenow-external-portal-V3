import fetch from 'node-fetch';

console.log('🔍 Testing ServiceNow Table API for Catalog Submission...\n');

async function testTableAPI() {
  const itemId = '02676922eb9aaa506f8afa24bad0cdec';
  
  try {
    // First, get the catalog item details to understand the structure
    console.log('1️⃣ Getting catalog item details...');
    const itemResponse = await fetch(`http://localhost:3001/api/servicenow/api/sn_sc/servicecatalog/items/${itemId}`);
    
    if (!itemResponse.ok) {
      console.log(`❌ Failed to get item: ${itemResponse.status}`);
      return;
    }
    
    const itemData = await itemResponse.json();
    console.log(`✅ Item: ${itemData.result.name}`);
    console.log(`📋 Item sys_id: ${itemData.result.sys_id}`);
    
    // Test 2: Try creating a request using the sc_req_item table
    console.log('\n2️⃣ Testing sc_req_item table creation...');
    
    const requestData = {
      cat_item: itemId,
      short_description: `Request for ${itemData.result.name}`,
      description: "test123",
      requested_for: "ext.portal.v2", // Use the current user
      quantity: 1
    };
    
    console.log('📤 Sending request data:', JSON.stringify(requestData, null, 2));
    
    const reqResponse = await fetch('http://localhost:3001/api/servicenow/api/now/table/sc_req_item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });
    
    console.log(`📊 Response Status: ${reqResponse.status} ${reqResponse.statusText}`);
    
    if (reqResponse.ok) {
      const reqData = await reqResponse.json();
      console.log('✅ SUCCESS! Request created:', JSON.stringify(reqData, null, 2));
    } else {
      const errorText = await reqResponse.text();
      console.log('❌ Error:', errorText);
    }
    
    // Test 3: Try creating a request using the sc_request table
    console.log('\n3️⃣ Testing sc_request table creation...');
    
    const scRequestData = {
      request: {
        requested_for: "ext.portal.v2",
        short_description: `Request for ${itemData.result.name}`,
        description: "test123"
      },
      items: [
        {
          cat_item: itemId,
          short_description: `Request for ${itemData.result.name}`,
          quantity: 1
        }
      ]
    };
    
    console.log('📤 Sending sc_request data:', JSON.stringify(scRequestData, null, 2));
    
    const scReqResponse = await fetch('http://localhost:3001/api/servicenow/api/now/table/sc_request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(scRequestData)
    });
    
    console.log(`📊 sc_request Response Status: ${scReqResponse.status} ${scReqResponse.statusText}`);
    
    if (scReqResponse.ok) {
      const scReqData = await scReqResponse.json();
      console.log('✅ SUCCESS! sc_request created:', JSON.stringify(scReqData, null, 2));
    } else {
      const errorText = await scReqResponse.text();
      console.log('❌ sc_request Error:', errorText);
    }
    
    // Test 4: Check what tables are available
    console.log('\n4️⃣ Testing available tables...');
    
    const tables = ['sc_req_item', 'sc_request', 'request', 'incident'];
    
    for (const table of tables) {
      try {
        const tableResponse = await fetch(`http://localhost:3001/api/servicenow/api/now/table/${table}?sysparm_limit=1`);
        console.log(`   ${table}: ${tableResponse.status} ${tableResponse.statusText}`);
      } catch (error) {
        console.log(`   ${table}: Error - ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testTableAPI(); 