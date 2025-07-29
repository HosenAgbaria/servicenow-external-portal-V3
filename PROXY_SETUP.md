# ServiceNow Proxy Server Setup

## 🚀 Quick Start

### Option 1: Run Both Servers Together (Recommended)
```bash
npm run dev:full
```
This will start both the React app (port 5173) and the proxy server (port 3001) simultaneously.

### Option 2: Run Servers Separately
```bash
# Terminal 1: Start React app
npm run dev

# Terminal 2: Start proxy server
npm run dev:proxy
```

## 🔧 How It Works

The proxy server (`server.js`) acts as a bridge between your React app and ServiceNow:

1. **CORS Handling**: The proxy server handles CORS issues by forwarding requests from your browser
2. **Authentication**: Automatically adds Basic Auth headers to all ServiceNow API requests
3. **OAuth Support**: Provides a dedicated endpoint for OAuth token requests
4. **Error Handling**: Provides detailed error messages and logging

## 📡 API Endpoints

### Proxy Server (http://localhost:3001)
- `GET /api/health` - Health check
- `POST /api/servicenow/oauth` - OAuth token endpoint
- `GET /api/servicenow/*` - All other ServiceNow API endpoints

### ServiceNow Instance
- Base URL: `https://tanivdynamicsltddemo4.service-now.com`
- Username: `ext.portal`
- Authentication: Basic Auth (automatic) or OAuth

## 🧪 Testing

1. Start the proxy server: `npm run dev:proxy`
2. Start the React app: `npm run dev`
3. Go to `http://localhost:5173`
4. Click the "Test API Connection" button
5. Check the console for detailed results

## 🔍 Troubleshooting

### Common Issues:

1. **Port 3001 already in use**
   ```bash
   # Kill process using port 3001
   netstat -ano | findstr :3001
   taskkill /PID <PID> /F
   ```

2. **Proxy server not starting**
   - Check if Node.js is installed
   - Verify all dependencies are installed: `npm install`

3. **ServiceNow authentication fails**
   - Verify credentials in `server.js`
   - Check if the ServiceNow instance is accessible
   - Ensure the user has API access permissions

4. **CORS errors still appear**
   - Make sure you're using the proxy URLs, not direct ServiceNow URLs
   - Check that the proxy server is running on port 3001

## 🔒 Security Notes

- The proxy server contains hardcoded credentials (for development only)
- For production, use environment variables
- Never expose the proxy server directly to the internet
- Consider using a proper backend service for production

## 📝 Environment Variables

You can override the ServiceNow configuration using environment variables:

```bash
export SERVICENOW_BASE_URL=https://your-instance.service-now.com
export SERVICENOW_USERNAME=your-username
export SERVICENOW_PASSWORD=your-password
export SERVICENOW_CLIENT_ID=your-client-id
export SERVICENOW_CLIENT_SECRET=your-client-secret
```

## 🎯 Next Steps

Once the proxy is working:
1. Analyze the ServiceNow API responses
2. Update field mappings in the React app
3. Implement real form rendering based on actual data
4. Test form submission with real ServiceNow endpoints 