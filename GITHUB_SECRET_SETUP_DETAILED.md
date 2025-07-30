# GitHub Secret Setup - Detailed Guide

## Current Issue
Your application is still showing "Failed to retrieve" errors and displaying `sys_ids` instead of category names because the `VITE_API_BASE_URL` GitHub secret is missing or incorrectly configured.

## Step-by-Step Solution

### 1. Add the GitHub Secret

1. **Go to your GitHub repository**: https://github.com/hosenagbaria/servicenow-external-portal-V3

2. **Navigate to Settings**:
   - Click on the "Settings" tab in your repository
   - Scroll down to "Security" section in the left sidebar
   - Click on "Secrets and variables"
   - Click on "Actions"

3. **Add the Secret**:
   - Click "New repository secret"
   - **Name**: `VITE_API_BASE_URL`
   - **Secret**: `https://servicenow-external-portal-server.onrender.com`
   - Click "Add secret"

### 2. Verify the Secret is Added

After adding the secret, you should see it listed in your repository secrets with the name `VITE_API_BASE_URL`.

### 3. Trigger a New Deployment

Since you've already pushed changes to the `main` branch, GitHub Actions should automatically trigger a new deployment. However, if it doesn't:

**Option A: Make a small commit**
```bash
git commit --allow-empty -m "Trigger deployment with GitHub secret"
git push origin main
```

**Option B: Manually trigger the workflow**
1. Go to the "Actions" tab in your GitHub repository
2. Find the "Deploy to GitHub Pages" workflow
3. Click "Run workflow" if the option is available

### 4. Monitor the Deployment

1. **Check GitHub Actions**:
   - Go to the "Actions" tab in your repository
   - Look for the latest workflow run
   - Make sure it completes successfully
   - The build step should now use the `VITE_API_BASE_URL` secret

2. **Verify the Fix**:
   - Wait for the deployment to complete (usually 2-5 minutes)
   - Visit your deployed site: https://hosenagbaria.github.io/servicenow-external-portal-V3/
   - The categories should now show proper names instead of `sys_ids`
   - The "Failed to retrieve" errors should be resolved

### 5. Expected Results

After the deployment completes with the correct secret:
- ✅ Categories will display proper names (e.g., "Hardware", "Software") instead of sys_ids
- ✅ No more "Failed to retrieve" errors
- ✅ Application will work on all devices and networks
- ✅ Backend API calls will go to your deployed server instead of localhost

## Troubleshooting

### If the deployment fails:
1. Check the GitHub Actions logs for errors
2. Ensure the secret name is exactly: `VITE_API_BASE_URL`
3. Ensure the secret value is exactly: `https://servicenow-external-portal-server.onrender.com`

### If categories still show sys_ids:
1. Clear your browser cache
2. Try opening the site in an incognito/private window
3. Check that the deployment actually completed successfully

### If you still see "Failed to retrieve":
1. Verify your server is running: https://servicenow-external-portal-server.onrender.com/api/categories
2. Check that the GitHub secret was added correctly
3. Ensure a new deployment ran after adding the secret

## Current Status

- ✅ Server is deployed and working: https://servicenow-external-portal-server.onrender.com
- ✅ Frontend code is updated with production config
- ✅ GitHub Actions workflow is configured
- ❌ **MISSING**: `VITE_API_BASE_URL` GitHub secret
- ❌ **NEEDED**: New deployment with the secret

**Next Step**: Add the GitHub secret as described above, then wait for the automatic deployment to complete.