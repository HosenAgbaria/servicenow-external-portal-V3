const https = require('https');
const http = require('http');

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

async function debugCatalogItem() {
  try {
    console.log('🔍 Fetching catalog item data...');
    const data = await makeRequest('http://localhost:3001/api/servicenow/api/sn_sc/servicecatalog/items/093219a2eb1aaa506f8afa24bad0cdcc');
    
    console.log('📋 Catalog Item Name:', data.result.name);
    console.log('📋 Variables Count:', data.result.variables?.length || 0);
    
    if (data.result.variables && data.result.variables.length > 0) {
      console.log('\n📝 Form Variables:');
      data.result.variables.forEach((variable, index) => {
        console.log(`${index + 1}. ${variable.name}`);
        console.log(`   Label: ${variable.label || 'N/A'}`);
        console.log(`   Type: ${variable.type || variable.friendly_type || 'N/A'}`);
        console.log(`   Mandatory: ${variable.mandatory || false}`);
        console.log(`   Required: ${variable.required || false}`);
        console.log(`   Default Value: ${variable.default_value || 'N/A'}`);
        console.log('');
      });
    } else {
      console.log('❌ No variables found for this catalog item');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugCatalogItem();