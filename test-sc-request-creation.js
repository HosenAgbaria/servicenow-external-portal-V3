import fetch from 'node-fetch';

async function testScRequestCreation() {
  console.log('🔍 Testing sc_request table creation directly...\n');
  
  // Test 1: Check if sc_request table is accessible
  console.log('1️⃣ Testing sc_request table access...');
  
  try {
    const getResponse = await fetch('http://localhost:3001/api/servicenow/api/now/table/sc_request?sysparm_limit=1');
    console.log(`   GET sc_request: ${getResponse.status} ${getResponse.statusText}`);
    
    if (getResponse.ok) {
      const data = await getResponse.json();
      console.log(`   ✅ sc_request table accessible - ${data.result?.length || 0} records`);
    } else {
      const errorText = await getResponse.text();
      console.log(`   ❌ Error: ${errorText.substring(0, 150)}...`);
    }
  } catch (error) {
    console.log(`   ❌ Network Error: ${error.message}`);
  }
  
  // Test 2: Try to create a sc_request record
  console.log('\n2️⃣ Testing sc_request record creation...');
  
  const requestData = {
    short_description: "Test Request from External Portal",
    description: "This is a test request to verify sc_request creation",
    requested_for: "ext.portal.v2",
    requested_by: "ext.portal.v2",
    category: "General",
    subcategory: "Test",
    impact: "2",
    urgency: "2",
    priority: "3"
  };
  
  console.log('📤 Request data:', JSON.stringify(requestData, null, 2));
  
  try {
    const postResponse = await fetch('http://localhost:3001/api/servicenow/api/now/table/sc_request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    
    console.log(`📊 POST Response Status: ${postResponse.status} ${postResponse.statusText}`);
    
    if (postResponse.ok) {
      const result = await postResponse.json();
      console.log('✅ SUCCESS! sc_request created:', JSON.stringify(result, null, 2));
      console.log(`🎯 sys_id: ${result.result.sys_id}`);
      console.log(`🎯 number: ${result.result.number || 'N/A'}`);
    } else {
      const errorText = await postResponse.text();
      console.log('❌ Error creating sc_request:', errorText);
    }
  } catch (error) {
    console.log(`❌ Network Error: ${error.message}`);
  }
  
  // Test 3: Try with minimal required fields
  console.log('\n3️⃣ Testing sc_request with minimal fields...');
  
  const minimalData = {
    short_description: "Minimal Test Request",
    requested_for: "ext.portal.v2"
  };
  
  console.log('📤 Minimal data:', JSON.stringify(minimalData, null, 2));
  
  try {
    const minimalResponse = await fetch('http://localhost:3001/api/servicenow/api/now/table/sc_request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(minimalData)
    });
    
    console.log(`📊 Minimal POST Response Status: ${minimalResponse.status} ${minimalResponse.statusText}`);
    
    if (minimalResponse.ok) {
      const result = await minimalResponse.json();
      console.log('✅ SUCCESS! Minimal sc_request created:', JSON.stringify(result, null, 2));
    } else {
      const errorText = await minimalResponse.text();
      console.log('❌ Error creating minimal sc_request:', errorText);
    }
  } catch (error) {
    console.log(`❌ Network Error: ${error.message}`);
  }
}

// Run the test
testScRequestCreation().then(() => {
  console.log('\n🏁 Test completed');
}).catch(error => {
  console.error('❌ Test failed:', error);
}); 