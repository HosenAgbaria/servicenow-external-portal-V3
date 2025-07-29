import fetch from 'node-fetch';

console.log('🧪 Testing Incident Creation for System Issues...\n');

async function testIncidentCreation() {
  const itemId = '02676922eb9aaa506f8afa24bad0cdec'; // מאור - המערכת לא נפתחת
  
  try {
    console.log('1️⃣ Testing incident creation for system issue catalog item...');
    
    const requestData = {
      catalogItemId: itemId,
      formData: {
        description: "System is not opening - urgent issue"
      },
      requestNumber: `REQ${Date.now().toString().slice(-6)}`
    };
    
    console.log('📤 Sending request to backend:', JSON.stringify(requestData, null, 2));
    
    const response = await fetch('http://localhost:3001/api/servicenow/create-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });
    
    console.log(`📊 Response Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ SUCCESS! ServiceNow record created:', JSON.stringify(result, null, 2));
      
      if (result.success) {
        console.log('🎯 ServiceNow Record Details:');
        console.log('   📋 sys_id:', result.data.sys_id);
        console.log('   📋 number:', result.data.number);
        console.log('   📋 table:', result.data.table);
        console.log('   📋 record_type:', result.data.record_type);
        console.log('   📋 created_at:', result.data.created_at);
        console.log('   📋 message:', result.message);
        
        if (result.data.table === 'incident') {
          console.log('\n🎉 INCIDENT SUCCESSFULLY CREATED IN SERVICENOW!');
          console.log('📋 You can find this incident in ServiceNow under: Incident → All');
        } else if (result.data.table === 'sc_req_item') {
          console.log('\n📋 REQUEST ITEM CREATED (fallback)');
          console.log('📋 You can find this in ServiceNow under: Service Catalog → Requests');
        }
        
        console.log('\n🔍 Check your ServiceNow instance for the new record!');
      } else {
        console.log('❌ Backend returned error:', result.message);
      }
    } else {
      const errorText = await response.text();
      console.log('❌ Backend error:', errorText);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testIncidentCreation(); 