import fetch from 'node-fetch';

console.log('🔍 Testing Different ServiceNow Endpoints for Catalog Submission...\n');

async function testEndpoints() {
  const itemId = '02676922eb9aaa506f8afa24bad0cdec';
  
  const endpoints = [
    // Standard catalog order endpoint
    `/api/sn_sc/servicecatalog/items/${itemId}/order`,
    
    // Alternative catalog order endpoint
    `/api/sn_sc/servicecatalog/items/${itemId}/order_now`,
    
    // Direct order endpoint
    `/api/sn_sc/order`,
    
    // Request endpoint
    `/api/sn_sc/request`,
    
    // Service catalog request endpoint
    `/api/sn_sc/servicecatalog/request`,
    
    // Direct item order
    `/api/sn_sc/servicecatalog/items/${itemId}`,
  ];
  
  const testData = {
    variables: [
      {
        name: "description",
        value: "test123"
      }
    ]
  };
  
  for (let i = 0; i < endpoints.length; i++) {
    const endpoint = endpoints[i];
    console.log(`${i + 1}️⃣ Testing endpoint: ${endpoint}`);
    
    try {
      const response = await fetch(`http://localhost:3001/api/servicenow${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });
      
      console.log(`   📊 Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ SUCCESS! Response:`, JSON.stringify(data, null, 2));
        console.log(`   🎯 FOUND WORKING ENDPOINT: ${endpoint}`);
        break;
      } else {
        const errorText = await response.text();
        console.log(`   ❌ Error: ${errorText.substring(0, 100)}...`);
      }
    } catch (error) {
      console.log(`   ❌ Network Error: ${error.message}`);
    }
    
    console.log('');
  }
  
  // Test GET requests to see what endpoints exist
  console.log('🔍 Testing GET requests to see available endpoints...\n');
  
  const getEndpoints = [
    `/api/sn_sc/servicecatalog/items/${itemId}`,
    `/api/sn_sc/order`,
    `/api/sn_sc/request`,
    `/api/sn_sc/servicecatalog/request`,
  ];
  
  for (let i = 0; i < getEndpoints.length; i++) {
    const endpoint = getEndpoints[i];
    console.log(`${i + 1}️⃣ GET ${endpoint}`);
    
    try {
      const response = await fetch(`http://localhost:3001/api/servicenow${endpoint}`);
      console.log(`   📊 Status: ${response.status} ${response.statusText}`);
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ Available endpoint: ${endpoint}`);
        console.log(`   📋 Response keys:`, Object.keys(data));
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
    }
    
    console.log('');
  }
}

testEndpoints(); 