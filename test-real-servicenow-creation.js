import fetch from 'node-fetch';

console.log('🧪 Testing Real ServiceNow Request Creation via Backend...\n');

async function testRealServiceNowCreation() {
  const itemId = '02676922eb9aaa506f8afa24bad0cdec';
  
  try {
    // Test the new backend endpoint
    console.log('1️⃣ Testing backend ServiceNow request creation...');
    
    const requestData = {
      catalogItemId: itemId,
      formData: {
        description: "Test request from external portal - real ServiceNow creation"
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
      console.log('✅ SUCCESS! Real ServiceNow request created:', JSON.stringify(result, null, 2));
      
      if (result.success) {
        console.log('🎯 Real ServiceNow Details:');
        console.log('   📋 sys_id:', result.data.sys_id);
        console.log('   📋 number:', result.data.number);
        console.log('   📋 table:', result.data.table);
        console.log('   📋 created_at:', result.data.created_at);
        console.log('   📋 message:', result.message);
        
        console.log('\n🎉 REQUEST SUCCESSFULLY CREATED IN SERVICENOW!');
        console.log('📋 You can now check your ServiceNow instance for this request.');
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

testRealServiceNowCreation(); 