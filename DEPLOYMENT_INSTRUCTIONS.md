# Complete Deployment Guide for ServiceNow External Portal

## Problem
The application currently only works locally because:
1. The backend server runs on `localhost:3001` 
2. Other devices cannot access localhost
3. The frontend is deployed to GitHub Pages but tries to connect to localhost

## Solution
Deploy both frontend and backend to cloud platforms that are accessible from anywhere.

## Step 1: Deploy Backend Server

### Option A: Deploy to Render.com (Recommended - Free)

1. **Create GitHub Repository for Server**
   - Go to https://github.com/new
   - Repository name: `servicenow-external-portal-server`
   - Make it public
   - Don't initialize with README
   - Click "Create repository"

2. **Push Server Code to GitHub**
   ```bash
   cd server-repo
   git remote add origin https://github.com/YOUR_USERNAME/servicenow-external-portal-server.git
   git branch -M main
   git push -u origin main
   ```

3. **Deploy to Render**
   - Go to https://render.com
   - Sign up/Login with GitHub
   - Click "New" → "Web Service"
   - Connect your `servicenow-external-portal-server` repository
   - Settings:
     - **Name**: `servicenow-portal-server`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
   - Add Environment Variables:
     ```
     SERVICENOW_BASE_URL=https://tanivdynamicsltddemo4.service-now.com
     SERVICENOW_USERNAME=ext.portal.v2
     SERVICENOW_PASSWORD=*]<D7sP^KX+zW1Nn.VJ6P,(w=-$5QJ
     FRONTEND_URL=https://HosenAgbaria.github.io
     NODE_ENV=production
     ```
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes)
   - Copy the deployed URL (e.g., `https://servicenow-portal-server.onrender.com`)

### Option B: Deploy to Railway (Alternative)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your server repository
5. Add the same environment variables as above
6. Deploy automatically

### Option C: Deploy to Heroku (Paid)

1. Install Heroku CLI
2. ```bash
   cd server-repo
   heroku login
   heroku create your-app-name
   heroku config:set SERVICENOW_BASE_URL=https://tanivdynamicsltddemo4.service-now.com
   heroku config:set SERVICENOW_USERNAME=ext.portal.v2
   heroku config:set SERVICENOW_PASSWORD="*]<D7sP^KX+zW1Nn.VJ6P,(w=-$5QJ"
   heroku config:set FRONTEND_URL=https://HosenAgbaria.github.io
   heroku config:set NODE_ENV=production
   git push heroku main
   ```

## Step 2: Update Frontend Configuration

1. **Update Environment Variables**
   Create/update `.env` file in the main project:
   ```env
   VITE_API_BASE_URL=https://your-deployed-server-url.onrender.com
   VITE_SERVICENOW_BASE_URL=https://tanivdynamicsltddemo4.service-now.com
   VITE_SERVICENOW_USERNAME=ext.portal.v2
   VITE_SERVICENOW_PASSWORD=*]<D7sP^KX+zW1Nn.VJ6P,(w=-$5QJ
   ```

2. **Update API Service Configuration**
   The `realApiService.ts` should automatically use the `VITE_API_BASE_URL` environment variable.

3. **Commit and Push Changes**
   ```bash
   git add .
   git commit -m "Update API base URL for production deployment"
   git push origin main
   ```

## Step 3: Deploy Frontend (Already Set Up)

The frontend is already configured for GitHub Pages deployment. After pushing the updated configuration:

1. Go to your GitHub repository
2. Check the "Actions" tab to see the deployment progress
3. Once deployed, the app will be available at: `https://HosenAgbaria.github.io/servicenow-external-portal-V3/`

## Step 4: Test the Deployment

1. **Test Backend**
   - Visit: `https://your-server-url.onrender.com/health`
   - Should return: `{"status":"OK","timestamp":"..."}`

2. **Test Frontend**
   - Visit: `https://HosenAgbaria.github.io/servicenow-external-portal-V3/`
   - Try browsing services - should work on any device

## Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Ensure `FRONTEND_URL` in server environment matches exactly: `https://HosenAgbaria.github.io`
   - No trailing slash in FRONTEND_URL

2. **Server Not Starting**
   - Check server logs in Render dashboard
   - Verify all environment variables are set

3. **API Connection Failed**
   - Verify `VITE_API_BASE_URL` points to deployed server
   - Check server is running and accessible

4. **ServiceNow Authentication**
   - Verify ServiceNow credentials in server environment
   - Test server endpoint: `/test-connection`

## Current Status

✅ Backend server code is ready in `server-repo/`
✅ Frontend is configured for GitHub Pages
✅ Git repository is set up
⏳ Need to create server repository on GitHub
⏳ Need to deploy server to cloud platform
⏳ Need to update frontend API URL

## Next Steps

1. Create GitHub repository for server
2. Deploy server to Render.com
3. Update frontend environment variables
4. Test complete deployment

After completing these steps, the application will work on all devices! 🚀