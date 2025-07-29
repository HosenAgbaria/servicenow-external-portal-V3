import fetch from 'node-fetch';

console.log('🧪 Testing Reference Fields Fix...\n');

async function testReferenceFields() {
  try {
    // Test 1: Get a specific item with reference fields
    console.log('1️⃣ Testing reference fields for "Retire a Standard Change Template"...');
    
    const itemId = '011f117a9f3002002920bde8132e7020'; // Retire a Standard Change Template
    const itemResponse = await fetch(`http://localhost:3001/api/servicenow/api/sn_sc/servicecatalog/items/${itemId}`);
    
    if (itemResponse.ok) {
      const itemData = await itemResponse.json();
      console.log(`   ✅ Item details retrieved: ${itemData.result.name}`);
      
      if (itemData.result.variables && itemData.result.variables.length > 0) {
        console.log('   📝 Form Fields:');
        itemData.result.variables.forEach((field, index) => {
          console.log(`      ${index + 1}. ${field.label} (${field.friendly_type})`);
          console.log(`         Required: ${field.mandatory}`);
          console.log(`         Reference: ${field.reference || 'N/A'}`);
          
          if (field.reference) {
            console.log(`         🔍 Reference table: ${field.reference}`);
          }
        });
      }
    }
    
    // Test 2: Test reference data for std_change_record_producer
    console.log('\n2️⃣ Testing reference data for std_change_record_producer...');
    
    const refResponse = await fetch('http://localhost:3001/api/servicenow/api/now/table/std_change_record_producer?sysparm_limit=10');
    
    if (refResponse.ok) {
      const refData = await refResponse.json();
      console.log(`   ✅ Found ${refData.result?.length || 0} records`);
      
      if (refData.result && refData.result.length > 0) {
        console.log('   📝 Sample records:');
        refData.result.slice(0, 3).forEach((item, index) => {
          console.log(`      ${index + 1}. ${item.name || item.short_description || item.sys_id}`);
        });
      }
    } else {
      console.log(`   ❌ Failed: ${refResponse.status} ${refResponse.statusText}`);
    }
    
    // Test 3: Test the React app's form endpoint
    console.log('\n3️⃣ Testing React app form endpoint...');
    
    const formResponse = await fetch(`http://localhost:3001/api/servicenow/api/sn_sc/servicecatalog/items/${itemId}`);
    
    if (formResponse.ok) {
      const formData = await formResponse.json();
      console.log(`   ✅ Form data retrieved`);
      
      if (formData.result.variables && formData.result.variables.length > 0) {
        const referenceField = formData.result.variables.find((f) => f.reference);
        if (referenceField) {
          console.log(`   📋 Reference field found: ${referenceField.label}`);
          console.log(`   📋 Reference table: ${referenceField.reference}`);
        }
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testReferenceFields(); 