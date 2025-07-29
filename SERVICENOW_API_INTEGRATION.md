# ServiceNow API Integration Guide

This guide provides comprehensive instructions for integrating the React portal with real ServiceNow APIs.

## Table of Contents

1. [Authentication](#authentication)
2. [API Endpoints](#api-endpoints)
3. [Field Type Mapping](#field-type-mapping)
4. [Implementation Steps](#implementation-steps)
5. [Error Handling](#error-handling)
6. [Security Considerations](#security-considerations)
7. [Testing](#testing)

## Authentication

### Basic Authentication
```typescript
// For development/testing only
const credentials = btoa('username:password');
const headers = {
  'Authorization': `Basic ${credentials}`,
  'Content-Type': 'application/json'
};
```

### OAuth 2.0 (Recommended for Production)
```typescript
// OAuth 2.0 configuration
const oauthConfig = {
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret',
  tokenUrl: 'https://your-instance.service-now.com/oauth_token.do',
  scope: 'read write'
};

// Get access token
async function getAccessToken() {
  const response = await fetch(oauthConfig.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: oauthConfig.clientId,
      client_secret: oauthConfig.clientSecret,
      scope: oauthConfig.scope
    })
  });
  
  const data = await response.json();
  return data.access_token;
}
```

## API Endpoints

### Catalog Items
```typescript
// Get catalog items
GET /api/now/table/sc_cat_item
?sysparm_query=active=true
&sysparm_fields=sys_id,name,short_description,description,category,price,picture,active,order,availability,rating,reviews_count
&sysparm_limit=50

// Get specific catalog item
GET /api/now/table/sc_cat_item/{sys_id}

// Get catalog item variables (form fields)
GET /api/now/table/sc_cat_item_variable
?sysparm_query=cat_item={sys_id}^active=true
&sysparm_fields=name,label,type,mandatory,max_length,reference,choices,default_value,help_text,depends_on,show_when,validation
```

### Service Requests
```typescript
// Get requests
GET /api/now/table/sc_req_item
?sysparm_query=requested_by={user_sys_id}
&sysparm_fields=sys_id,number,short_description,description,category,subcategory,priority,state,assigned_to,requested_by,requested_date,due_date,closed_date
&sysparm_limit=50

// Get specific request
GET /api/now/table/sc_req_item/{sys_id}

// Create request
POST /api/now/table/sc_req_item
{
  "cat_item": "{catalog_item_sys_id}",
  "short_description": "Request description",
  "description": "Detailed description",
  "variables": {
    "field1": "value1",
    "field2": "value2"
  }
}

// Update request
PUT /api/now/table/sc_req_item/{sys_id}
{
  "state": "in_progress",
  "assigned_to": "{user_sys_id}"
}
```

### Knowledge Base
```typescript
// Get knowledge articles
GET /api/now/table/kb_knowledge
?sysparm_query=workflow_state=published
&sysparm_fields=sys_id,number,title,short_description,content,category,subcategory,author,published_date,updated_date,view_count,helpful_count,tags
&sysparm_limit=50

// Get specific article
GET /api/now/table/kb_knowledge/{sys_id}
```

### Reference Data
```typescript
// Get departments
GET /api/now/table/cmn_department
?sysparm_fields=sys_id,name,description

// Get users
GET /api/now/table/sys_user
?sysparm_fields=sys_id,name,email,department

// Get cost centers
GET /api/now/table/cmn_cost_center
?sysparm_fields=sys_id,name,description
```

## Field Type Mapping

### ServiceNow Field Types to React Components

| ServiceNow Type | React Component | Description |
|----------------|----------------|-------------|
| `string` | Input (text) | Text input field |
| `number` | Input (number) | Numeric input field |
| `boolean` | Checkbox | True/false checkbox |
| `choice` | Select | Dropdown selection |
| `reference` | Select | Reference field with dynamic options |
| `glide_date` | Input (date) | Date picker |
| `glide_date_time` | Input (datetime-local) | Date and time picker |
| `email` | Input (email) | Email input with validation |
| `url` | Input (url) | URL input field |
| `textarea` | Textarea | Multi-line text area |
| `file` | FileInput | File upload component |

### Field Conversion Example
```typescript
// ServiceNow field structure
const serviceNowField = {
  name: 'department',
  label: 'Department',
  type: 'reference',
  mandatory: true,
  reference: 'cmn_department',
  help_text: 'Select your department'
};

// Converted to FormField
const formField: FormField = {
  name: 'department',
  label: 'Department',
  type: 'reference',
  required: true,
  helpText: 'Select your department',
  options: [] // Will be populated from reference table
};
```

## Implementation Steps

### 1. Update API Service Configuration
```typescript
// src/services/api.ts
class ServiceNowApiService {
  private baseUrl: string;
  private authToken: string | null = null;

  constructor(instanceUrl: string) {
    this.baseUrl = `${instanceUrl}/api/now`;
  }

  private async getAuthHeaders() {
    if (!this.authToken) {
      this.authToken = await this.getAccessToken();
    }
    
    return {
      'Authorization': `Bearer ${this.authToken}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  async getCatalogItems(params?: any): Promise<ApiResponse<PaginatedResponse<ServiceNowCatalogItem>>> {
    const headers = await this.getAuthHeaders();
    const queryParams = new URLSearchParams();
    
    if (params?.search) {
      queryParams.append('sysparm_query', `nameLIKE${params.search}`);
    }
    
    if (params?.category) {
      queryParams.append('sysparm_query', `category=${params.category}`);
    }
    
    const response = await fetch(`${this.baseUrl}/table/sc_cat_item?${queryParams}`, {
      headers
    });
    
    if (!response.ok) {
      throw new Error(`ServiceNow API error: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      success: true,
      data: {
        data: data.result,
        total: data.result.length,
        page: 1,
        limit: 50,
        hasMore: false
      }
    };
  }
}
```

### 2. Handle Reference Fields
```typescript
async getReferenceOptions(table: string, query?: string): Promise<Array<{value: string, label: string}>> {
  const headers = await this.getAuthHeaders();
  const queryParams = new URLSearchParams();
  
  if (query) {
    queryParams.append('sysparm_query', query);
  }
  
  const response = await fetch(`${this.baseUrl}/table/${table}?${queryParams}`, {
    headers
  });
  
  const data = await response.json();
  return data.result.map((item: any) => ({
    value: item.sys_id,
    label: item.name || item.title || item.number
  }));
}
```

### 3. Update Form Metadata Loading
```typescript
async getFormMetadata(catalogItemId: string): Promise<ApiResponse<FormField[]>> {
  const headers = await this.getAuthHeaders();
  
  // Get catalog item variables
  const variablesResponse = await fetch(
    `${this.baseUrl}/table/sc_cat_item_variable?sysparm_query=cat_item=${catalogItemId}^active=true`,
    { headers }
  );
  
  const variablesData = await variablesResponse.json();
  
  // Convert ServiceNow fields to FormFields
  const formFields = await Promise.all(
    variablesData.result.map(async (field: any) => {
      const formField = this.convertServiceNowField(field);
      
      // Load reference options if needed
      if (field.type === 'reference' && field.reference) {
        formField.options = await this.getReferenceOptions(field.reference);
      }
      
      return formField;
    })
  );
  
  return {
    success: true,
    data: formFields
  };
}
```

## Error Handling

### API Error Handling
```typescript
class ServiceNowApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ServiceNowApiError';
  }
}

async function handleServiceNowResponse(response: Response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    
    throw new ServiceNowApiError(
      errorData.error?.message || `HTTP ${response.status}`,
      response.status,
      errorData.error?.code,
      errorData
    );
  }
  
  return response.json();
}
```

### Retry Logic
```typescript
async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError!;
}
```

## Security Considerations

### 1. Environment Variables
```bash
# .env.local
VITE_SERVICENOW_INSTANCE=https://your-instance.service-now.com
VITE_SERVICENOW_CLIENT_ID=your_client_id
VITE_SERVICENOW_CLIENT_SECRET=your_client_secret
```

### 2. Token Management
```typescript
class TokenManager {
  private static instance: TokenManager;
  private token: string | null = null;
  private expiresAt: number = 0;

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  async getValidToken(): Promise<string> {
    if (this.token && Date.now() < this.expiresAt) {
      return this.token;
    }
    
    await this.refreshToken();
    return this.token!;
  }

  private async refreshToken() {
    // Implement token refresh logic
  }
}
```

### 3. CORS Configuration
Ensure your ServiceNow instance allows requests from your frontend domain:
- Navigate to System Properties > Web Services
- Add your domain to the allowed origins

## Testing

### Mock Service for Development
```typescript
// src/services/mockServiceNowApi.ts
export class MockServiceNowApi {
  // Implement mock responses for development
  async getCatalogItems() {
    return Promise.resolve({
      success: true,
      data: {
        data: mockCatalogItems,
        total: mockCatalogItems.length,
        page: 1,
        limit: 50,
        hasMore: false
      }
    });
  }
}
```

### Integration Tests
```typescript
// tests/api.integration.test.ts
describe('ServiceNow API Integration', () => {
  it('should fetch catalog items', async () => {
    const apiService = new ServiceNowApiService(process.env.SERVICENOW_INSTANCE!);
    const result = await apiService.getCatalogItems();
    
    expect(result.success).toBe(true);
    expect(result.data?.data).toBeDefined();
  });
});
```

## Migration Checklist

- [ ] Set up ServiceNow instance credentials
- [ ] Configure OAuth 2.0 or Basic Authentication
- [ ] Update API service to use real endpoints
- [ ] Implement reference field loading
- [ ] Add error handling and retry logic
- [ ] Set up environment variables
- [ ] Configure CORS settings
- [ ] Test all form field types
- [ ] Implement file upload handling
- [ ] Add loading states and error messages
- [ ] Test with real ServiceNow data
- [ ] Deploy to production environment

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure ServiceNow instance allows your domain
2. **Authentication Failures**: Check credentials and token expiration
3. **Field Mapping Issues**: Verify ServiceNow field types match expected values
4. **Reference Field Loading**: Ensure reference tables are accessible
5. **File Upload Errors**: Check file size limits and allowed types

### Debug Mode
```typescript
const DEBUG_MODE = process.env.NODE_ENV === 'development';

if (DEBUG_MODE) {
  console.log('ServiceNow API Request:', {
    url: endpoint,
    method: 'GET',
    headers: headers
  });
}
```

This guide provides a complete roadmap for integrating your React portal with real ServiceNow APIs. Follow the implementation steps carefully and test thoroughly before deploying to production. 