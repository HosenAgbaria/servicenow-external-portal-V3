# ServiceNow API Integration Guide

This guide explains how to connect the Ministry of Finance Portal to real ServiceNow APIs.

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env` file in your project root:

```env
# ServiceNow Instance Configuration
REACT_APP_SERVICENOW_BASE_URL=https://yourcompany.service-now.com
REACT_APP_SERVICENOW_USERNAME=your-username
REACT_APP_SERVICENOW_PASSWORD=your-password

# OAuth Configuration (Optional)
REACT_APP_SERVICENOW_CLIENT_ID=your-client-id
REACT_APP_SERVICENOW_CLIENT_SECRET=your-client-secret
REACT_APP_SERVICENOW_USE_OAUTH=false

# Logging (Optional)
REACT_APP_ENABLE_LOGGING=true
REACT_APP_LOG_LEVEL=info
```

### 2. Initialize Real API Service

In your `src/main.tsx` or `src/App.tsx`, add:

```typescript
import { initializeRealServiceNowApi, getServiceNowConfig } from './services/init';

// Initialize with real ServiceNow API
const config = getServiceNowConfig();
initializeRealServiceNowApi(config);
```

### 3. Switch to Real API

The application will automatically switch from mock data to real ServiceNow APIs once initialized.

## 🔧 ServiceNow Configuration

### Required ServiceNow Setup

1. **Enable REST API**: Ensure REST API is enabled in your ServiceNow instance
2. **Create API User**: Create a dedicated user for API access
3. **Set Permissions**: Grant appropriate permissions to the API user
4. **Enable CORS**: Configure CORS settings if needed

### Authentication Methods

#### Basic Authentication (Recommended for Development)
```typescript
{
  useOAuth: false,
  username: 'your-username',
  password: 'your-password'
}
```

#### OAuth 2.0 (Recommended for Production)
```typescript
{
  useOAuth: true,
  username: 'your-username',
  password: 'your-password',
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret'
}
```

## 📡 API Endpoints

### Catalog Items

#### Get Catalog Items
```
GET /api/sn_sc/servicecatalog/items
```

**Query Parameters:**
- `sysparm_query`: ServiceNow query string
- `sysparm_limit`: Number of records to return
- `sysparm_offset`: Starting record number
- `sysparm_fields`: Comma-separated list of fields

**Example:**
```
GET /api/sn_sc/servicecatalog/items?sysparm_query=active=true&sysparm_limit=10
```

#### Get Catalog Item Details
```
GET /api/sn_sc/servicecatalog/items/{sys_id}
```

#### Get Catalog Item Form
```
GET /api/sn_sc/servicecatalog/items/{sys_id}/form
```

#### Submit Catalog Request
```
POST /api/sn_sc/servicecatalog/items/{sys_id}/order
```

**Request Body:**
```json
{
  "variables": [
    {
      "name": "field_name",
      "value": "field_value"
    }
  ]
}
```

### Knowledge Base

#### Get Knowledge Articles
```
GET /api/sn_kmd/knowledge
```

**Query Parameters:**
- `sysparm_query`: Search query
- `sysparm_limit`: Number of records
- `sysparm_offset`: Starting record

**Example:**
```
GET /api/sn_kmd/knowledge?sysparm_query=workflow_state=published&sysparm_limit=20
```

#### Get Knowledge Article Details
```
GET /api/sn_kmd/knowledge/{sys_id}
```

### User Requests

#### Get User Requests
```
GET /api/sn_sc/order_guide
```

**Query Parameters:**
- `sysparm_query`: Filter query
- `sysparm_limit`: Number of records
- `sysparm_offset`: Starting record

### Reference Data

#### Get Table Data
```
GET /api/now/table/{table_name}
```

**Common Tables:**
- `sys_user`: Users
- `cmn_location`: Locations
- `cmn_department`: Departments
- `sys_choice`: Choice lists

## 🔄 ServiceNow Query Syntax

### Basic Queries
```
active=true
category=Software
nameLIKEAdobe
```

### Complex Queries
```
active=true^category=Software^nameLIKEAdobe
state=1^ORstate=2
assigned_to=javascript:gs.getUserID()
```

### Field References
```
category=javascript:gs.getProperty('default.category')
requested_for=javascript:gs.getUserID()
```

## 📊 Response Mapping

### Catalog Item Response
```json
{
  "result": [
    {
      "sys_id": "abc123",
      "name": "Software Installation",
      "short_description": "Request software installation",
      "description": "Full description...",
      "category": {
        "value": "software",
        "display_value": "Software"
      },
      "active": true,
      "picture": "https://...",
      "price": 0,
      "order": 1
    }
  ],
  "count": 1,
  "limit": 10,
  "offset": 0
}
```

### Form Fields Response
```json
{
  "result": {
    "fields": [
      {
        "name": "requested_for",
        "label": "Requested For",
        "type": "string",
        "mandatory": true,
        "placeholder": "Enter name",
        "help_text": "Help text here",
        "choices": [
          {
            "value": "user1",
            "label": "John Doe"
          }
        ]
      }
    ],
    "variables": [],
    "meta": {}
  }
}
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Authentication Errors
**Error:** `401 Unauthorized`
**Solution:** 
- Verify username/password
- Check user permissions
- Ensure REST API is enabled

#### 2. CORS Errors
**Error:** `CORS policy blocked`
**Solution:**
- Configure CORS in ServiceNow
- Add your domain to allowed origins
- Use proxy in development

#### 3. Field Mapping Issues
**Error:** `Field not found`
**Solution:**
- Check field names in ServiceNow
- Verify table permissions
- Use `sysparm_fields` to specify fields

#### 4. Query Syntax Errors
**Error:** `Invalid query`
**Solution:**
- Validate ServiceNow query syntax
- Test queries in ServiceNow UI first
- Use proper field references

### Debug Mode

Enable debug logging:

```typescript
// In your .env file
REACT_APP_ENABLE_LOGGING=true
REACT_APP_LOG_LEVEL=debug
```

### Testing Endpoints

Test your ServiceNow endpoints using curl:

```bash
# Test authentication
curl -u "username:password" \
  "https://yourcompany.service-now.com/api/sn_sc/servicecatalog/items"

# Test with query
curl -u "username:password" \
  "https://yourcompany.service-now.com/api/sn_sc/servicecatalog/items?sysparm_query=active=true"
```

## 🔒 Security Best Practices

### 1. Environment Variables
- Never commit credentials to version control
- Use environment variables for all sensitive data
- Rotate credentials regularly

### 2. API User Permissions
- Create dedicated API user with minimal permissions
- Use role-based access control
- Monitor API usage

### 3. HTTPS Only
- Always use HTTPS in production
- Validate SSL certificates
- Use secure connection strings

### 4. Error Handling
- Don't expose sensitive information in error messages
- Log errors securely
- Implement proper error responses

## 📋 Checklist for Go-Live

- [ ] ServiceNow instance configured
- [ ] API user created with proper permissions
- [ ] REST API enabled
- [ ] CORS configured (if needed)
- [ ] Environment variables set
- [ ] Authentication tested
- [ ] All endpoints tested
- [ ] Error handling implemented
- [ ] Logging configured
- [ ] Security review completed
- [ ] Performance testing done
- [ ] Backup/fallback plan ready

## 🆘 Support

If you encounter issues:

1. Check the browser console for errors
2. Verify ServiceNow configuration
3. Test endpoints directly
4. Review ServiceNow logs
5. Contact your ServiceNow administrator

## 📚 Additional Resources

- [ServiceNow REST API Documentation](https://docs.servicenow.com/)
- [ServiceNow Query Syntax](https://docs.servicenow.com/bundle/rome-platform-user-interface/page/use/common-ui-elements/reference/r_OpAvailableFiltersQueries.html)
- [ServiceNow REST API Explorer](https://docs.servicenow.com/bundle/rome-api-reference/page/integrate/inbound-rest/concept/c_RESTAPI.html) 