import fetch from 'node-fetch';

console.log('🧪 Testing Form Submission for Catalog Item...\n');

async function testFormSubmission() {
  const itemId = '02676922eb9aaa506f8afa24bad0cdec'; // The failing item ID
  
  try {
    // Test 1: Get the catalog item details
    console.log('1️⃣ Getting catalog item details...');
    const itemResponse = await fetch(`http://localhost:3001/api/servicenow/api/sn_sc/servicecatalog/items/${itemId}`);
    
    if (itemResponse.ok) {
      const itemData = await itemResponse.json();
      console.log(`   ✅ Item: ${itemData.result.name}`);
      console.log(`   📋 Variables: ${itemData.result.variables?.length || 0}`);
      
      if (itemData.result.variables && itemData.result.variables.length > 0) {
        console.log('   📝 Form Fields:');
        itemData.result.variables.forEach((field, index) => {
          console.log(`      ${index + 1}. ${field.label} (${field.name}) - ${field.friendly_type}`);
          console.log(`         Required: ${field.mandatory}`);
          console.log(`         Reference: ${field.reference || 'N/A'}`);
        });
      }
    } else {
      console.log(`   ❌ Failed to get item: ${itemResponse.status}`);
      return;
    }
    
    // Test 2: Try to submit a request with minimal data
    console.log('\n2️⃣ Testing form submission...');
    
    const testFormData = {
      variables: [
        {
          name: "תיאור_התקלה", // Hebrew field name from the screenshot
          value: "test123"
        }
      ]
    };
    
    console.log('   📤 Sending data:', JSON.stringify(testFormData, null, 2));
    
    const submitResponse = await fetch(`http://localhost:3001/api/servicenow/api/sn_sc/servicecatalog/items/${itemId}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testFormData)
    });
    
    console.log(`   📊 Response Status: ${submitResponse.status} ${submitResponse.statusText}`);
    
    if (submitResponse.ok) {
      const submitData = await submitResponse.json();
      console.log('   ✅ Success! Response:', JSON.stringify(submitData, null, 2));
    } else {
      const errorText = await submitResponse.text();
      console.log('   ❌ Error Response:', errorText);
      
      // Try to parse as JSON if possible
      try {
        const errorJson = JSON.parse(errorText);
        console.log('   📋 Error Details:', JSON.stringify(errorJson, null, 2));
      } catch (e) {
        console.log('   📋 Raw Error Text:', errorText);
      }
    }
    
    // Test 3: Try alternative endpoint
    console.log('\n3️⃣ Testing alternative endpoint...');
    
    const alternativeResponse = await fetch(`http://localhost:3001/api/servicenow/api/sn_sc/servicecatalog/items/${itemId}/order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        variables: testFormData.variables,
        sysparm_query: `cat_item=${itemId}`
      })
    });
    
    console.log(`   📊 Alternative Response Status: ${alternativeResponse.status} ${alternativeResponse.statusText}`);
    
    if (alternativeResponse.ok) {
      const altData = await alternativeResponse.json();
      console.log('   ✅ Alternative Success! Response:', JSON.stringify(altData, null, 2));
    } else {
      const altErrorText = await alternativeResponse.text();
      console.log('   ❌ Alternative Error:', altErrorText);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testFormSubmission(); 