# 🔧 Troubleshooting Guide - "Failed to Retrieve" Error

## Current Issue
Your deployed application at https://hosenagbaria.github.io/servicenow-external-portal-V3/ is still showing category sys_ids instead of display names and giving "Failed to retrieve" errors on other devices.

## Root Cause
The GitHub secret `VITE_API_BASE_URL` has not been added yet, so your deployed frontend is still trying to connect to `localhost:3001` instead of your deployed server.

## ✅ Solution Steps

### Step 1: Add GitHub Secret (CRITICAL)
1. **Go to your repository**: https://github.com/HosenAgbaria/servicenow-external-portal-V3
2. **Click "Settings"** (top menu of your repository)
3. **In left sidebar**: Click "Secrets and variables" → "Actions"
4. **Click "New repository secret"**
5. **Name**: `VITE_API_BASE_URL`
6. **Value**: `https://servicenow-external-portal-server.onrender.com`
7. **Click "Add secret"**

### Step 2: Trigger Deployment
After adding the secret, you need to trigger a new deployment:

**Option A: Push a small change**
```bash
git commit --allow-empty -m "Trigger deployment with server URL"
git push origin main
```

**Option B: Go to Actions tab**
1. Go to https://github.com/HosenAgbaria/servicenow-external-portal-V3/actions
2. Click "Deploy to GitHub Pages" workflow
3. Click "Run workflow" → "Run workflow"

### Step 3: Verify Deployment
1. **Wait 2-3 minutes** for GitHub Actions to complete
2. **Check Actions tab**: https://github.com/HosenAgbaria/servicenow-external-portal-V3/actions
3. **Verify the deployment shows green checkmark**
4. **Test your site**: https://hosenagbaria.github.io/servicenow-external-portal-V3/

## 🔍 How to Verify It's Working

### Before Fix (Current State):
- Categories show as: `d73ec16eebd6aa506f8afa24bad0cd75`
- "Failed to retrieve" errors on other devices
- Console errors about localhost:3001

### After Fix (Expected State):
- Categories show as: `סנכרון דואל של האוצר לסלולר התקנה`
- No "Failed to retrieve" errors
- Application works on all devices globally

## 🚨 Common Issues

### Issue 1: Secret Not Added
**Symptoms**: Still seeing sys_ids, localhost errors
**Solution**: Double-check you added the secret correctly

### Issue 2: Deployment Not Triggered
**Symptoms**: Secret added but no change
**Solution**: Manually trigger deployment (see Step 2)

### Issue 3: Wrong Secret Value
**Symptoms**: Different errors, server not found
**Solution**: Verify secret value is exactly: `https://servicenow-external-portal-server.onrender.com`

### Issue 4: Server Down
**Symptoms**: Categories work but no data loads
**Solution**: Check if your Render server is still running

## 📋 Verification Checklist

- [ ] GitHub secret `VITE_API_BASE_URL` added
- [ ] Secret value is `https://servicenow-external-portal-server.onrender.com`
- [ ] New deployment triggered
- [ ] GitHub Actions shows green checkmark
- [ ] Categories show display names (not sys_ids)
- [ ] Application works on other devices
- [ ] No console errors about localhost

## 🆘 If Still Not Working

1. **Check GitHub Actions logs**:
   - Go to Actions tab
   - Click on latest deployment
   - Check for any error messages

2. **Verify server is running**:
   - Visit: https://servicenow-external-portal-server.onrender.com/api/categories
   - Should show JSON data, not error

3. **Check browser console**:
   - Open developer tools (F12)
   - Look for any error messages
   - Verify API calls go to your server, not localhost

## 📞 Quick Test Commands

To test your server directly:
```bash
curl https://servicenow-external-portal-server.onrender.com/api/categories
```

Should return JSON with category data.

---

**Remember**: The key issue is that GitHub secret. Once that's added and deployment is triggered, everything should work globally! 🚀