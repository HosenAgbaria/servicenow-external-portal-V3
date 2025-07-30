# GitHub Secrets Setup Guide

## Required Action: Add GitHub Secret

You need to add one more GitHub secret for the deployment to work with your hosted server.

### Steps:

1. **Go to your GitHub repository**: https://github.com/HosenAgbaria/servicenow-external-portal-V3

2. **Navigate to Settings**:
   - Click on the "Settings" tab in your repository
   - In the left sidebar, click on "Secrets and variables" → "Actions"

3. **Add the API Base URL Secret**:
   - Click "New repository secret"
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://servicenow-external-portal-server.onrender.com`
   - Click "Add secret"

### Verification:

After adding the secret:
1. The GitHub Actions workflow will automatically trigger on your next push
2. Your deployed frontend will now use your hosted server instead of localhost
3. The application should work globally without the "Error Loading Services" issue

### Current Status:

✅ Backend server deployed to: https://servicenow-external-portal-server.onrender.com  
✅ Frontend configuration updated  
✅ Changes pushed to GitHub  
⏳ **Next**: Add the GitHub secret above  
⏳ **Then**: GitHub Pages will redeploy automatically  

### Expected Result:

Once the secret is added and GitHub Actions completes:
- Your application will be accessible globally
- All devices will be able to load services properly
- No more "Error Loading Services" on external devices