import fetch from 'node-fetch';

async function testWritableTables() {
  console.log('🔍 Testing which ServiceNow tables are writable...\n');
  
  // Test different tables for write access
  const tables = [
    'sc_req_item',
    'sc_request', 
    'incident',
    'task',
    'sc_task',
    'request',
    'sc_incident',
    'kb_knowledge',
    'change_request',
    'problem'
  ];
  
  const testData = {
    short_description: "Test write access",
    description: "Testing if this table allows write operations"
  };
  
  for (const table of tables) {
    console.log(`Testing ${table}...`);
    
    try {
      // First check if table is accessible for reading
      const getResponse = await fetch(`http://localhost:3001/api/servicenow/api/now/table/${table}?sysparm_limit=1`);
      const canRead = getResponse.ok;
      
      // Then test write access
      const postResponse = await fetch(`http://localhost:3001/api/servicenow/api/now/table/${table}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(testData)
      });
      
      const canWrite = postResponse.ok;
      
      if (canRead && canWrite) {
        console.log(`   ✅ ${table}: READ ✓ WRITE ✓`);
      } else if (canRead && !canWrite) {
        console.log(`   ⚠️  ${table}: READ ✓ WRITE ✗`);
      } else if (!canRead && canWrite) {
        console.log(`   ⚠️  ${table}: READ ✗ WRITE ✓`);
      } else {
        console.log(`   ❌ ${table}: READ ✗ WRITE ✗`);
      }
      
      if (canWrite) {
        const result = await postResponse.json();
        console.log(`   🎯 Created record: ${result.result.sys_id}`);
      }
      
    } catch (error) {
      console.log(`   ❌ ${table}: Error - ${error.message}`);
    }
  }
  
  // Test specific table combinations for request structure
  console.log('\n🔍 Testing request structure alternatives...');
  
  // Option 1: Try creating sc_req_item with a parent request field
  console.log('\n1️⃣ Testing sc_req_item with parent request...');
  
  try {
    const reqItemWithParent = {
      short_description: "Test Request Item with Parent",
      description: "Testing if sc_req_item can have a parent request",
      requested_for: "ext.portal.v2",
      quantity: 1
    };
    
    const response = await fetch('http://localhost:3001/api/servicenow/api/now/table/sc_req_item', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(reqItemWithParent)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ sc_req_item created successfully:', result.result);
      console.log(`🎯 This might be the correct approach!`);
    } else {
      const errorText = await response.text();
      console.log('❌ sc_req_item creation failed:', errorText.substring(0, 150));
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
  
  // Option 2: Try creating an incident as a request container
  console.log('\n2️⃣ Testing incident as request container...');
  
  try {
    const incidentData = {
      short_description: "Test Request Container",
      description: "Using incident as a request container",
      caller_id: "ext.portal.v2",
      category: "General",
      impact: "2",
      urgency: "2"
    };
    
    const response = await fetch('http://localhost:3001/api/servicenow/api/now/table/incident', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(incidentData)
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Incident created successfully:', result.result);
      console.log(`🎯 Incident could be used as request container`);
    } else {
      const errorText = await response.text();
      console.log('❌ Incident creation failed:', errorText.substring(0, 150));
    }
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

// Run the test
testWritableTables().then(() => {
  console.log('\n🏁 Test completed');
}).catch(error => {
  console.error('❌ Test failed:', error);
}); 