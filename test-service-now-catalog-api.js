import fetch from 'node-fetch';

async function testServiceNowCatalogAPI() {
  const itemId = '03321da2eb1aaa506f8afa24bad0cdba';
  
  console.log('🔍 Testing ServiceNow catalog-specific APIs...\n');
  
  // Test 1: Check if we can use the catalog order API
  console.log('1️⃣ Testing catalog order API...');
  
  try {
    // First, get the catalog item to understand its structure
    const itemResponse = await fetch(`http://localhost:3001/api/servicenow/api/sn_sc/servicecatalog/items/${itemId}`);
    
    if (itemResponse.ok) {
      const itemData = await itemResponse.json();
      console.log(`✅ Catalog item accessible: ${itemData.result.name}`);
      console.log(`📋 Variables: ${itemData.result.variables?.length || 0} fields`);
      
      // Try to use the catalog order API
      const orderData = {
        variables: [
          {
            name: "description",
            value: "Test order from external portal"
          }
        ]
      };
      
      console.log('📤 Trying catalog order API...');
      const orderResponse = await fetch(`http://localhost:3001/api/servicenow/api/sn_sc/servicecatalog/items/${itemId}/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(orderData)
      });
      
      console.log(`📊 Order API Response: ${orderResponse.status} ${orderResponse.statusText}`);
      
      if (orderResponse.ok) {
        const orderResult = await orderResponse.json();
        console.log('✅ SUCCESS! Catalog order API worked:', JSON.stringify(orderResult, null, 2));
      } else {
        const errorText = await orderResponse.text();
        console.log('❌ Order API failed:', errorText.substring(0, 200));
      }
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  
  // Test 2: Check if we can use the ServiceNow REST API with different endpoints
  console.log('\n2️⃣ Testing alternative ServiceNow REST endpoints...');
  
  const alternativeEndpoints = [
    '/api/sn_sc/request',
    '/api/sn_sc/order_guide',
    '/api/sn_sc/servicecatalog/request',
    '/api/now/table/sc_req_item',
    '/api/now/table/sc_request'
  ];
  
  for (const endpoint of alternativeEndpoints) {
    try {
      console.log(`   Testing ${endpoint}...`);
      
      const response = await fetch(`http://localhost:3001/api/servicenow${endpoint}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log(`   ${endpoint}: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ ${endpoint} accessible`);
      }
    } catch (error) {
      console.log(`   ❌ ${endpoint}: Error - ${error.message}`);
    }
  }
  
  // Test 3: Try to create a request using the ServiceNow REST API with proper authentication
  console.log('\n3️⃣ Testing ServiceNow REST API with proper data...');
  
  try {
    // Try to create a sc_req_item with the catalog item
    const reqItemData = {
      cat_item: itemId,
      short_description: "Test Request from External Portal",
      description: "This is a test request created via API",
      requested_for: "ext.portal.v2",
      quantity: 1
    };
    
    console.log('📤 Trying to create sc_req_item with catalog item...');
    const reqItemResponse = await fetch('http://localhost:3001/api/servicenow/api/now/table/sc_req_item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(reqItemData)
    });
    
    console.log(`📊 sc_req_item Response: ${reqItemResponse.status} ${reqItemResponse.statusText}`);
    
    if (reqItemResponse.ok) {
      const result = await reqItemResponse.json();
      console.log('✅ SUCCESS! sc_req_item created:', JSON.stringify(result, null, 2));
      console.log(`🎯 This is working! We can create sc_req_item records.`);
    } else {
      const errorText = await reqItemResponse.text();
      console.log('❌ sc_req_item creation failed:', errorText.substring(0, 200));
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  
  // Test 4: Check if we can create a request using a different approach
  console.log('\n4️⃣ Testing alternative request creation approaches...');
  
  // Try creating a request using the ServiceNow REST API with minimal data
  try {
    const minimalData = {
      short_description: "Minimal Test Request",
      requested_for: "ext.portal.v2"
    };
    
    console.log('📤 Trying minimal sc_req_item creation...');
    const minimalResponse = await fetch('http://localhost:3001/api/servicenow/api/now/table/sc_req_item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(minimalData)
    });
    
    console.log(`📊 Minimal Response: ${minimalResponse.status} ${minimalResponse.statusText}`);
    
    if (minimalResponse.ok) {
      const result = await minimalResponse.json();
      console.log('✅ SUCCESS! Minimal sc_req_item created:', JSON.stringify(result, null, 2));
    } else {
      const errorText = await minimalResponse.text();
      console.log('❌ Minimal creation failed:', errorText.substring(0, 200));
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

// Run the test
testServiceNowCatalogAPI().then(() => {
  console.log('\n🏁 Test completed');
}).catch(error => {
  console.error('❌ Test failed:', error);
}); 