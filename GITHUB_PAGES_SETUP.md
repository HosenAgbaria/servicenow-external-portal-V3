# GitHub Pages Setup Guide

## Issue: 404 Error on GitHub Pages

The 404 error indicates that GitHub Pages is not properly enabled for your repository. Follow these steps to fix it:

## Step 1: Re-Enable GitHub Pages (Since it was enabled before)

1. Go to your repository: `https://github.com/HosenAgbaria/servicenow-external-portal-V3`
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Check current **Source** setting:
   - If it shows **GitHub Actions** ✅ - proceed to Step 2
   - If it shows **Deploy from a branch** - change to **GitHub Actions**
   - If it shows **None** - select **GitHub Actions**
5. Save the settings

## Alternative: Check if Pages was disabled

1. In **Settings** > **Pages**
2. If you see "GitHub Pages is currently disabled"
3. Click **Enable GitHub Pages**
4. Select **GitHub Actions** as source

## Step 2: Verify Workflow Permissions

1. In your repository, go to **Settings** > **Actions** > **General**
2. Under **Workflow permissions**, ensure:
   - **Read and write permissions** is selected
   - **Allow GitHub Actions to create and approve pull requests** is checked
3. Save the settings

## Step 3: Manual Workflow Trigger

1. Go to **Actions** tab in your repository
2. Click on **Deploy to GitHub Pages** workflow
3. Click **Run workflow** button
4. Select **main** branch and click **Run workflow**

## Step 4: Check Deployment Status

After enabling GitHub Pages and running the workflow:

1. Go to **Actions** tab to monitor the deployment
2. Wait for the workflow to complete (usually 2-5 minutes)
3. Check **Settings** > **Pages** for the live URL
4. The site should be available at: `https://hosenagbaria.github.io/servicenow-external-portal-V3/`

## Alternative: Manual Pages Configuration

If GitHub Actions option is not available:

1. In **Settings** > **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Select **gh-pages** branch (if available) or **main** branch
4. Select **/ (root)** folder
5. Save

## Troubleshooting

### If GitHub Pages was working before but stopped:

1. **Check Recent Workflow Runs**:
   - Go to **Actions** tab
   - Look for failed "Deploy to GitHub Pages" workflows
   - Click on failed runs to see error details

2. **Check Repository Settings Changes**:
   - Someone might have changed Pages source from "GitHub Actions" to "Deploy from a branch"
   - Repository might have been made private (Pages requires public repo or GitHub Pro)

3. **Force Re-deployment**:
   - Go to **Actions** > **Deploy to GitHub Pages**
   - Click **Run workflow** > **Run workflow** on main branch
   - Wait 3-5 minutes for completion

4. **Check Environment Secrets**:
   - Go to **Settings** > **Secrets and variables** > **Actions**
   - Verify all VITE_SERVICENOW_* secrets are still present

### Common Issues:

- **404 Error**: GitHub Pages not enabled or wrong source selected
- **Blank Page**: Check console for errors, verify base URL in vite.config.ts
- **Build Fails**: Check Actions tab for error logs
- **Assets Not Loading**: Verify the base path matches repository name
- **Workflow Not Running**: Check if Actions are enabled in repository settings

## Current Configuration Status

✅ Repository exists: `servicenow-external-portal-V3`
✅ Workflow file exists: `.github/workflows/deploy.yml`
✅ Base URL configured: `/servicenow-external-portal-V3/`
✅ .nojekyll file present
❌ GitHub Pages not enabled (needs manual setup)

## Next Steps

1. Follow Step 1-3 above to enable GitHub Pages
2. Wait for deployment to complete
3. Test the live URL
4. If issues persist, check the Actions logs for specific errors