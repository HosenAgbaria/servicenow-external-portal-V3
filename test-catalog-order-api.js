import fetch from 'node-fetch';

async function testCatalogOrderAPI() {
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
    
    // Test 2: Try the catalog order API
    console.log('\n2️⃣ Testing ServiceNow catalog order API...');
    
    // Prepare form data (simulate what the user would submit)
    const formData = {
      description: "Test request from external portal",
      priority: "3",
      requested_for: "ext.portal.v2"
    };
    
    // Convert to ServiceNow variables format
    const variables = Object.entries(formData).map(([name, value]) => ({
      name: name,
      value: value
    }));

    const orderData = {
      variables: variables
    };
    
    console.log('📤 Order data:', JSON.stringify(orderData, null, 2));
    
    const orderResponse = await fetch(`http://localhost:3001/api/servicenow/api/sn_sc/servicecatalog/items/${itemId}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(orderData)
    });
    
    console.log(`📊 Response Status: ${orderResponse.status} ${orderResponse.statusText}`);
    
    if (orderResponse.ok) {
      const orderResult = await orderResponse.json();
      console.log('✅ SUCCESS! Request created via catalog order API:', JSON.stringify(orderResult, null, 2));
      console.log(`🎯 Real ServiceNow sys_id: ${orderResult.result.sys_id}`);
      console.log(`🎯 Real ServiceNow number: ${orderResult.result.number || 'N/A'}`);
      console.log(`🎯 Request table: ${orderResult.result.table || 'N/A'}`);
      return orderResult.result;
    } else {
      const errorText = await orderResponse.text();
      console.log('❌ Catalog order API Error:', errorText);
    }
    
    // Test 3: Try alternative order endpoints if the first one fails
    console.log('\n3️⃣ Testing alternative order endpoints...');
    
    const alternativeEndpoints = [
      `/api/sn_sc/servicecatalog/items/${itemId}/order_now`,
      `/api/sn_sc/order`,
      `/api/sn_sc/servicecatalog/request`
    ];
    
    for (let i = 0; i < alternativeEndpoints.length; i++) {
      const endpoint = alternativeEndpoints[i];
      console.log(`   Testing: ${endpoint}`);
      
      try {
        const altResponse = await fetch(`http://localhost:3001/api/servicenow${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(orderData)
        });
        
        console.log(`   Status: ${altResponse.status} ${altResponse.statusText}`);
        
        if (altResponse.ok) {
          const altResult = await altResponse.json();
          console.log(`   ✅ SUCCESS! Alternative endpoint worked:`, JSON.stringify(altResult, null, 2));
          console.log(`   🎯 FOUND WORKING ENDPOINT: ${endpoint}`);
          return altResult.result;
        } else {
          const errorText = await altResponse.text();
          console.log(`   ❌ Error: ${errorText.substring(0, 100)}...`);
        }
      } catch (error) {
        console.log(`   ❌ Network Error: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testCatalogOrderAPI().then(() => {
  console.log('\n🏁 Test completed');
}).catch(error => {
  console.error('❌ Test failed:', error);
}); 