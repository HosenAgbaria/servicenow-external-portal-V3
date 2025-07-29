import fetch from 'node-fetch';

async function testProperRequestStructureV2() {
  const itemId = '03321da2eb1aaa506f8afa24bad0cdba'; // The catalog item from the user's example
  
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
    console.log(`📋 Category: ${itemData.result.category || 'N/A'}`);
    console.log(`📋 Variables: ${itemData.result.variables?.length || 0} fields`);
    
    // Test 2: Test the new request creation endpoint
    console.log('\n2️⃣ Testing new request structure creation...');
    
    // Prepare form data (simulate what the user would submit)
    const formData = {
      description: "Test request from external portal",
      priority: "3",
      requested_for: "ext.portal.v2"
    };
    
    const requestData = {
      catalogItemId: itemId,
      formData: formData,
      requestNumber: `REQ${Date.now().toString().slice(-6)}`
    };
    
    console.log('📤 Request data:', JSON.stringify(requestData, null, 2));
    
    const createResponse = await fetch('http://localhost:3001/api/servicenow/create-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    
    console.log(`📊 Response Status: ${createResponse.status} ${createResponse.statusText}`);
    
    if (createResponse.ok) {
      const createResult = await createResponse.json();
      console.log('✅ SUCCESS! Request created:', JSON.stringify(createResult, null, 2));
      
      if (createResult.success) {
        console.log(`🎯 Real ServiceNow sys_id: ${createResult.data.sys_id}`);
        console.log(`🎯 Real ServiceNow number: ${createResult.data.number || 'N/A'}`);
        console.log(`🎯 Request table: ${createResult.data.table || 'N/A'}`);
        console.log(`🎯 Record type: ${createResult.data.record_type || 'N/A'}`);
        
        // Check if we have the proper structure
        if (createResult.data.table === 'sc_request' && createResult.data.req_item) {
          console.log('🎉 PERFECT! Proper request structure created:');
          console.log(`   📋 Main Request (sc_request):`);
          console.log(`      - sys_id: ${createResult.data.sys_id}`);
          console.log(`      - number: ${createResult.data.number}`);
          console.log(`      - short_description: ${createResult.data.short_description}`);
          console.log(`   📋 Request Item (sc_req_item):`);
          console.log(`      - sys_id: ${createResult.data.req_item.sys_id}`);
          console.log(`      - number: ${createResult.data.req_item.number}`);
          console.log(`      - linked to request: ${createResult.data.req_item.request}`);
          console.log(`      - catalog item: ${createResult.data.req_item.cat_item}`);
          
          if (createResult.data.record_type === 'request_with_items') {
            console.log('✅ This is a REAL ServiceNow request structure!');
          } else if (createResult.data.record_type === 'simulated_request_with_items') {
            console.log('✅ This is a SIMULATED request structure (ServiceNow API restricted)');
          }
        } else if (createResult.data.table === 'sc_req_item') {
          console.log('⚠️  WARNING: Only sc_req_item created, not the full structure!');
        } else {
          console.log(`📋 Created ${createResult.data.table} record`);
        }
        
        console.log('🎉 Request structure creation is working correctly!');
      } else {
        console.log('❌ Request creation failed:', createResult.message);
      }
    } else {
      const errorText = await createResponse.text();
      console.log('❌ Request creation error:', errorText);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testProperRequestStructureV2().then(() => {
  console.log('\n🏁 Test completed');
}).catch(error => {
  console.error('❌ Test failed:', error);
}); 