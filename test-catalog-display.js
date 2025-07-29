import fetch from 'node-fetch';

console.log('🧪 Testing Catalog Display...\n');

async function testCatalogDisplay() {
  try {
    // Test the catalog items endpoint that the React app uses
    console.log('1️⃣ Testing catalog items for display...');
    
    const catalogResponse = await fetch('http://localhost:3001/api/servicenow/api/sn_sc/servicecatalog/items?sysparm_limit=10');
    
    if (catalogResponse.ok) {
      const catalogData = await catalogResponse.json();
      console.log(`   ✅ Found ${catalogData.result.length} catalog items`);
      
      console.log('\n2️⃣ Sample catalog items for display:');
      catalogData.result.slice(0, 3).forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.name}`);
        console.log(`      Type: ${item.type}`);
        console.log(`      Category: ${item.category?.title || 'N/A'}`);
        console.log(`      Availability: ${item.availability}`);
        console.log(`      Description: ${item.short_description || 'No description'}`);
        console.log(`      Variables: ${item.variables?.length || 0} form fields`);
        console.log('');
      });
      
      console.log('3️⃣ Testing specific item form fields...');
      if (catalogData.result.length > 0) {
        const firstItem = catalogData.result[0];
        console.log(`   Item: ${firstItem.name}`);
        console.log(`   Form fields: ${firstItem.variables?.length || 0}`);
        
        if (firstItem.variables && firstItem.variables.length > 0) {
          firstItem.variables.forEach((field, index) => {
            console.log(`      ${index + 1}. ${field.label} (${field.friendly_type}) - Required: ${field.mandatory}`);
          });
        }
      }
      
      console.log('\n🎯 Catalog display test completed!');
      console.log('   - The React app should now display these real catalog items');
      console.log('   - Visit http://localhost:5173/catalog to see the updated catalog page');
      
    } else {
      console.log(`   ❌ Catalog items failed: ${catalogResponse.status}`);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testCatalogDisplay(); 