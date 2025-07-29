import fetch from 'node-fetch';

console.log('🧪 Testing Specific Catalog Item...\n');

async function testSpecificItem() {
  const itemId = 'a267a922eb9aaa506f8afa24bad0cd99';
  
  try {
    console.log(`1️⃣ Testing catalog item: ${itemId}`);
    
    // Test getting the specific item details
    const itemResponse = await fetch(`http://localhost:3001/api/servicenow/api/sn_sc/servicecatalog/items/${itemId}`);
    
    console.log(`   Status: ${itemResponse.status} ${itemResponse.statusText}`);
    
    if (itemResponse.ok) {
      const itemData = await itemResponse.json();
      console.log('   ✅ Item details retrieved successfully!');
      console.log(`   📝 Item: ${itemData.result.name}`);
      console.log(`   📝 Type: ${itemData.result.type}`);
      console.log(`   📝 Category: ${itemData.result.category?.title}`);
      console.log(`   📝 Form Fields: ${itemData.result.variables?.length || 0}`);
      
      if (itemData.result.variables && itemData.result.variables.length > 0) {
        console.log('   📋 Form Fields:');
        itemData.result.variables.forEach((field, index) => {
          console.log(`      ${index + 1}. ${field.label} (${field.friendly_type}) - Required: ${field.mandatory}`);
        });
      }
    } else {
      const errorText = await itemResponse.text();
      console.log(`   ❌ Failed to get item: ${errorText}`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testSpecificItem(); 