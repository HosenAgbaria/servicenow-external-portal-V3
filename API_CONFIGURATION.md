# API Configuration Guide

## Environment Variables Setup

Create a `.env` file in your project root with the following variables:

```env
# ServiceNow API Configuration
# Copy this file to .env and fill in your actual ServiceNow credentials

# ServiceNow Instance URL (replace with your actual instance URL)
REACT_APP_SERVICENOW_BASE_URL=https://yourcompany.service-now.com

# Authentication Credentials
REACT_APP_SERVICENOW_USERNAME=your-username
REACT_APP_SERVICENOW_PASSWORD=your-password

# OAuth Configuration (Optional - for production use)
REACT_APP_SERVICENOW_CLIENT_ID=your-client-id
REACT_APP_SERVICENOW_CLIENT_SECRET=your-client-secret
REACT_APP_SERVICENOW_USE_OAUTH=false

# Logging Configuration (Optional)
REACT_APP_ENABLE_LOGGING=true
REACT_APP_LOG_LEVEL=info

# Development Settings
VITE_API_TIMEOUT=30000
VITE_ENABLE_MOCK_FALLBACK=true
```

## Quick Setup Steps

### 1. Create Environment File
```bash
# Copy the example configuration
cp .env.example .env

# Edit the file with your actual ServiceNow credentials
nano .env
```

### 2. Update main.tsx
Uncomment the ServiceNow API initialization in `src/main.tsx`:

```typescript
import { initializeRealServiceNowApi, getServiceNowConfig } from './services/init';

// Initialize real ServiceNow API
const config = getServiceNowConfig();
initializeRealServiceNowApi(config);
```

### 3. Test Connection
Start the development server and check the console for connection status:

```bash
npm run dev
```

## ServiceNow Instance Requirements

### Required Permissions
- REST API access enabled
- Service Catalog access
- Knowledge Base access
- User permissions for API user

### Required Tables
- `sc_cat_item` (Service Catalog Items)
- `kb_knowledge` (Knowledge Base)
- `sc_req_item` (Request Items)
- `sys_user` (Users)
- `cmn_location` (Locations)

### Required Roles
- `service_catalog_admin`
- `knowledge_admin`
- `rest_api_explorer`

## Testing Your Configuration

### 1. Test Authentication
```bash
curl -u "username:password" \
  "https://yourcompany.service-now.com/api/sn_sc/servicecatalog/items"
```

### 2. Test Catalog Items
```bash
curl -u "username:password" \
  "https://yourcompany.service-now.com/api/sn_sc/servicecatalog/items?sysparm_query=active=true"
```

### 3. Test Knowledge Base
```bash
curl -u "username:password" \
  "https://yourcompany.service-now.com/api/sn_kmd/knowledge?sysparm_query=workflow_state=published"
```

## Troubleshooting

### Common Issues

1. **401 Unauthorized**
   - Check username/password
   - Verify user permissions
   - Ensure REST API is enabled

2. **CORS Errors**
   - Configure CORS in ServiceNow
   - Add your domain to allowed origins
   - Use proxy in development

3. **Field Not Found**
   - Check field names in ServiceNow
   - Verify table permissions
   - Use `sysparm_fields` parameter

4. **Query Syntax Errors**
   - Validate ServiceNow query syntax
   - Test queries in ServiceNow UI first
   - Use proper field references

### Debug Mode

Enable debug logging by setting:
```env
REACT_APP_ENABLE_LOGGING=true
REACT_APP_LOG_LEVEL=debug
```

## Security Notes

- Never commit `.env` files to version control
- Use environment variables for all sensitive data
- Rotate credentials regularly
- Use HTTPS in production
- Create dedicated API user with minimal permissions

## Next Steps

1. Configure your ServiceNow instance
2. Set up environment variables
3. Test the connection
4. Customize field mappings if needed
5. Deploy to production

For detailed API documentation, see `SERVICENOW_API_INTEGRATION_GUIDE.md` 