# Production Deployment Guide

## Current Issue: CORS and API Access

### Problem
The ServiceNow External Portal is currently experiencing API connectivity issues when deployed to GitHub Pages. Users see errors like:
- "Failed to load articles"
- "Error Loading Services"
- "Failed to retrieve catalog items: Failed to fetch"

### Root Cause
The issue occurs because:
1. **CORS (Cross-Origin Resource Sharing) restrictions**: ServiceNow APIs don't allow direct browser requests from external domains
2. **GitHub Pages limitations**: Static hosting cannot make server-side API calls
3. **Authentication exposure**: Direct API calls would expose ServiceNow credentials in the browser

### Current Behavior
- ✅ **Works locally**: The `server.js` proxy handles API calls and CORS
- ❌ **Fails on GitHub Pages**: No server-side proxy available
- 🔄 **Fallback active**: App shows demo data when API calls fail

## Solutions for Production

### Option 1: Deploy with Server-Side Proxy (Recommended)

#### Deploy to Heroku/Railway/Vercel
```bash
# The app includes server.js for this purpose
npm run start  # Runs both frontend and backend
```

#### Required Environment Variables
```env
VITE_SERVICENOW_BASE_URL=https://your-instance.service-now.com
VITE_SERVICENOW_USERNAME=your-username
VITE_SERVICENOW_PASSWORD=your-password
VITE_SERVICENOW_CLIENT_ID=your-client-id
VITE_SERVICENOW_CLIENT_SECRET=your-client-secret
```

### Option 2: Configure ServiceNow CORS (If Possible)

1. **ServiceNow Admin Console**:
   - Navigate to System Web Services > REST API
   - Configure CORS settings to allow your domain
   - Add your GitHub Pages URL to allowed origins

2. **Update API calls**:
   - Remove proxy configuration
   - Use direct ServiceNow API endpoints

### Option 3: Use ServiceNow's Built-in Portal

ServiceNow provides native portal capabilities:
- Service Portal
- Employee Center
- Customer Service Management Portal

## Current Demo Mode Features

### What Works in Demo Mode
- ✅ Full UI/UX experience
- ✅ Sample catalog items
- ✅ Mock knowledge articles
- ✅ Form submissions (stored locally)
- ✅ Search and filtering
- ✅ Responsive design
- ✅ Multi-language support

### What Requires Real API
- ❌ Live ServiceNow data
- ❌ Actual ticket creation
- ❌ Real-time status updates
- ❌ ServiceNow user authentication

## Quick Fix for GitHub Pages

### Enable Demo Mode Notification
The app now shows a user-friendly notification when running in demo mode, explaining that sample data is being used.

### For Development Testing
```bash
# Run with proxy server locally
npm run dev        # Frontend only (demo mode)
npm run start      # Full stack with API proxy
```

## Recommended Production Architecture

```
[User Browser] → [Your Server/Proxy] → [ServiceNow API]
                      ↓
                 [Static Assets]
```

### Benefits
- ✅ Secure credential handling
- ✅ CORS compliance
- ✅ Rate limiting control
- ✅ Error handling
- ✅ Caching capabilities

## Next Steps

1. **Immediate**: The demo mode is now active with user notifications
2. **Short-term**: Deploy to a platform that supports server-side code
3. **Long-term**: Consider ServiceNow's native portal solutions

## Files Modified for Demo Mode

- `src/services/api.ts` - Enhanced error handling and fallback logic
- `src/services/realApiService.ts` - Better CORS error detection
- `src/components/DemoModeNotification.tsx` - User notification component
- `src/App.tsx` - Integrated demo mode notification

## Support

For questions about:
- **ServiceNow configuration**: Contact your ServiceNow administrator
- **Deployment options**: Refer to platform-specific documentation
- **Code modifications**: Check the source code comments and documentation