import fetch from 'node-fetch';

console.log('🧪 Testing Real ServiceNow Data via Proxy...\n');

async function testRealData() {
  try {
    // Test catalog items
    console.log('1️⃣ Testing catalog items...');
    const catalogResponse = await fetch('http://localhost:3001/api/servicenow/api/sn_sc/servicecatalog/items?sysparm_limit=10');
    
    if (catalogResponse.ok) {
      const catalogData = await catalogResponse.json();
      console.log(`   ✅ Found ${catalogData.result.length} catalog items`);
      
      if (catalogData.result.length > 0) {
        console.log('   📝 Sample catalog items:');
        catalogData.result.slice(0, 3).forEach((item, index) => {
          console.log(`      ${index + 1}. ${item.name} (${item.type})`);
          console.log(`         Category: ${item.category?.title || 'N/A'}`);
          console.log(`         Availability: ${item.availability}`);
        });
      }
    } else {
      console.log(`   ❌ Catalog items failed: ${catalogResponse.status}`);
    }

    // Test knowledge articles
    console.log('\n2️⃣ Testing knowledge articles...');
    const knowledgeResponse = await fetch('http://localhost:3001/api/servicenow/api/sn_kmdl/knowledge?sysparm_limit=5');
    
    if (knowledgeResponse.ok) {
      const knowledgeData = await knowledgeResponse.json();
      console.log(`   ✅ Found ${knowledgeData.result.length} knowledge articles`);
    } else {
      console.log(`   ❌ Knowledge articles failed: ${knowledgeResponse.status}`);
    }

    // Test user requests
    console.log('\n3️⃣ Testing user requests...');
    const requestsResponse = await fetch('http://localhost:3001/api/servicenow/api/sn_sc/request?sysparm_limit=5');
    
    if (requestsResponse.ok) {
      const requestsData = await requestsResponse.json();
      console.log(`   ✅ Found ${requestsData.result.length} user requests`);
    } else {
      console.log(`   ❌ User requests failed: ${requestsResponse.status}`);
    }

    console.log('\n🎯 Real data test completed!');
    console.log('   - The React app should now be using real ServiceNow data');
    console.log('   - Visit http://localhost:5173 to see the updated portal');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testRealData(); 