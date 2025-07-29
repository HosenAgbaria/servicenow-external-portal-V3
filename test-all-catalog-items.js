import fetch from 'node-fetch';

console.log('🧪 Testing All Active Catalog Items...\n');

async function testAllCatalogItems() {
  try {
    // Test 1: Get all catalog items (no limit)
    console.log('1️⃣ Testing all catalog items (no limit)...');
    
    const allItemsResponse = await fetch('http://localhost:3001/api/servicenow/api/sn_sc/servicecatalog/items?sysparm_limit=100');
    
    if (allItemsResponse.ok) {
      const allItemsData = await allItemsResponse.json();
      console.log(`   ✅ Found ${allItemsData.result.length} total catalog items`);
      
      // Filter active items
      const activeItems = allItemsData.result.filter(item => 
        item.active === true || item.active === 'true' || item.availability === 'on_desktop' || item.availability === 'on_both'
      );
      
      console.log(`   📊 Active items: ${activeItems.length}`);
      
      console.log('\n2️⃣ Active Catalog Items:');
      activeItems.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.name}`);
        console.log(`      Type: ${item.type}`);
        console.log(`      Category: ${item.category?.title || 'N/A'}`);
        console.log(`      Availability: ${item.availability}`);
        console.log(`      Active: ${item.active}`);
        console.log(`      Form Fields: ${item.variables?.length || 0}`);
        console.log('');
      });
      
      // Test 2: Get reference data for a specific item
      if (activeItems.length > 0) {
        console.log('3️⃣ Testing reference data for first item...');
        const firstItem = activeItems[0];
        console.log(`   Item: ${firstItem.name}`);
        
        // Get detailed item info to see form fields
        const itemDetailResponse = await fetch(`http://localhost:3001/api/servicenow/api/sn_sc/servicecatalog/items/${firstItem.sys_id}`);
        
        if (itemDetailResponse.ok) {
          const itemDetail = await itemDetailResponse.json();
          console.log(`   ✅ Item details retrieved`);
          console.log(`   📋 Form fields: ${itemDetail.result.variables?.length || 0}`);
          
          if (itemDetail.result.variables && itemDetail.result.variables.length > 0) {
            console.log('   📝 Form Fields:');
            itemDetail.result.variables.forEach((field, index) => {
              console.log(`      ${index + 1}. ${field.label} (${field.friendly_type})`);
              console.log(`         Required: ${field.mandatory}`);
              console.log(`         Reference: ${field.reference || 'N/A'}`);
              console.log(`         Choices: ${field.choices?.length || 0}`);
              
              // If it's a reference field, try to get the reference data
              if (field.reference) {
                console.log(`         🔍 Reference table: ${field.reference}`);
              }
            });
          }
        }
      }
      
      // Test 3: Test reference data endpoints
      console.log('\n4️⃣ Testing reference data endpoints...');
      
      const referenceTables = ['sys_user', 'cmn_department', 'cmn_location', 'sys_user_group'];
      
      for (const table of referenceTables) {
        try {
          const refResponse = await fetch(`http://localhost:3001/api/servicenow/api/now/table/${table}?sysparm_limit=5`);
          console.log(`   ${table}: ${refResponse.status} ${refResponse.statusText}`);
          
          if (refResponse.ok) {
            const refData = await refResponse.json();
            console.log(`      Found ${refData.result?.length || 0} records`);
          }
        } catch (error) {
          console.log(`   ${table}: Error - ${error.message}`);
        }
      }
      
    } else {
      console.log(`   ❌ Failed to get catalog items: ${allItemsResponse.status}`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAllCatalogItems(); 