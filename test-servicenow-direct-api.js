import fetch from 'node-fetch';

console.log('🔍 Testing Direct ServiceNow API for Real Request Creation...\n');

async function testDirectServiceNowAPI() {
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
    
    // Test 2: Try creating a request using the sc_req_item table with proper data structure
    console.log('\n2️⃣ Testing sc_req_item creation with proper ServiceNow structure...');
    
    const requestData = {
      cat_item: itemId,
      short_description: `Request for ${itemData.result.name}`,
      description: "Test request from external portal",
      requested_for: "ext.portal.v2",
      quantity: 1,
      variables: JSON.stringify({
        description: "test123"
      })
    };
    
    console.log('📤 Sending request data:', JSON.stringify(requestData, null, 2));
    
    const reqResponse = await fetch('http://localhost:3001/api/servicenow/api/now/table/sc_req_item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestData)
    });
    
    console.log(`📊 Response Status: ${reqResponse.status} ${reqResponse.statusText}`);
    
    if (reqResponse.ok) {
      const reqData = await reqResponse.json();
      console.log('✅ SUCCESS! Request created in ServiceNow:', JSON.stringify(reqData, null, 2));
      console.log(`🎯 Real ServiceNow sys_id: ${reqData.result.sys_id}`);
      console.log(`🎯 Real ServiceNow number: ${reqData.result.number || 'N/A'}`);
      return reqData.result;
    } else {
      const errorText = await reqResponse.text();
      console.log('❌ Error:', errorText);
    }
    
    // Test 3: Try creating an incident as a fallback
    console.log('\n3️⃣ Testing incident creation as fallback...');
    
    const incidentData = {
      short_description: `Catalog Request: ${itemData.result.name}`,
      description: `Catalog Request Details:
      
Request for: ${itemData.result.name}
Category: ${itemData.result.category?.title || 'N/A'}
Form Data: description: test123

Submitted via External Portal.`,
      caller_id: "ext.portal.v2",
      category: itemData.result.category?.title || "General",
      subcategory: itemData.result.subcategory?.title || "",
      impact: "2",
      urgency: "2",
      assignment_group: "",
      cmdb_ci: ""
    };
    
    console.log('📤 Sending incident data:', JSON.stringify(incidentData, null, 2));
    
    const incidentResponse = await fetch('http://localhost:3001/api/servicenow/api/now/table/incident', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(incidentData)
    });
    
    console.log(`📊 Incident Response Status: ${incidentResponse.status} ${incidentResponse.statusText}`);
    
    if (incidentResponse.ok) {
      const incidentData = await incidentResponse.json();
      console.log('✅ SUCCESS! Incident created in ServiceNow:', JSON.stringify(incidentData, null, 2));
      console.log(`🎯 Real ServiceNow sys_id: ${incidentData.result.sys_id}`);
      console.log(`🎯 Real ServiceNow number: ${incidentData.result.number || 'N/A'}`);
      return incidentData.result;
    } else {
      const errorText = await incidentResponse.text();
      console.log('❌ Incident Error:', errorText);
    }
    
    // Test 4: Try using the ServiceNow REST API with different endpoint
    console.log('\n4️⃣ Testing ServiceNow REST API with different endpoint...');
    
    const restData = {
      short_description: `Catalog Request: ${itemData.result.name}`,
      description: "Test request from external portal",
      requested_for: "ext.portal.v2",
      cat_item: itemId
    };
    
    const restResponse = await fetch('http://localhost:3001/api/servicenow/api/sn_sc/request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(restData)
    });
    
    console.log(`📊 REST Response Status: ${restResponse.status} ${restResponse.statusText}`);
    
    if (restResponse.ok) {
      const restResult = await restResponse.json();
      console.log('✅ SUCCESS! Request created via REST API:', JSON.stringify(restResult, null, 2));
      return restResult.result;
    } else {
      const errorText = await restResponse.text();
      console.log('❌ REST Error:', errorText);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testDirectServiceNowAPI(); 