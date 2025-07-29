# GitHub Deployment Guide

## 🚀 Deploy ServiceNow External Portal to GitHub

This guide will help you deploy your ServiceNow External Portal project to GitHub and set up automated deployments.

## 📋 Prerequisites

- Git installed on your system
- GitHub account
- Node.js 18+ installed
- ServiceNow instance access

## 🔧 Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the repository details:
   - **Repository name**: `servicenow-external-portal`
   - **Description**: `ServiceNow External Portal - Modern React TypeScript application for ServiceNow integration`
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

## 🔗 Step 2: Connect Local Repository to GitHub

After creating the repository on GitHub, you'll see a page with setup instructions. Use these commands:

```bash
# Add the GitHub repository as remote origin
git remote add origin https://github.com/YOUR_USERNAME/servicenow-external-portal.git

# Push your code to GitHub
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username.**

## 🌐 Step 3: Set Up GitHub Pages (Optional)

To deploy your frontend to GitHub Pages:

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select "GitHub Actions"
5. Create a new file `.github/workflows/deploy.yml` with the content below

## 📁 Step 4: Create GitHub Actions Workflow

Create the following file structure in your repository:

```
.github/
└── workflows/
    └── deploy.yml
```

### GitHub Actions Workflow (`.github/workflows/deploy.yml`):

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build application
      run: npm run build
      env:
        # Add your environment variables here
        VITE_SERVICENOW_BASE_URL: ${{ secrets.VITE_SERVICENOW_BASE_URL }}
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

## 🔐 Step 5: Configure Secrets

1. Go to your repository on GitHub
2. Click "Settings" → "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Add the following secrets:

### Required Secrets:
- `VITE_SERVICENOW_BASE_URL`: Your ServiceNow instance URL
- `VITE_SERVICENOW_USERNAME`: ServiceNow username (if needed for build)
- `VITE_SERVICENOW_PASSWORD`: ServiceNow password (if needed for build)

**⚠️ Important**: Never commit sensitive credentials to your repository!

## 🐳 Step 6: Docker Deployment (Optional)

For containerized deployment, your project already includes:
- `Dockerfile`
- `docker-compose.yml`
- `.dockerignore`

### Build and run with Docker:
```bash
# Build the Docker image
docker build -t servicenow-portal .

# Run the container
docker run -p 3001:3001 servicenow-portal

# Or use docker-compose
docker-compose up --build
```

## ☁️ Step 7: Cloud Deployment Options

### Heroku Deployment:
1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set environment variables:
   ```bash
   heroku config:set SERVICENOW_BASE_URL=your-instance-url
   heroku config:set SERVICENOW_USERNAME=your-username
   heroku config:set SERVICENOW_PASSWORD=your-password
   ```
5. Deploy: `git push heroku main`

### Vercel Deployment:
1. Install Vercel CLI: `npm i -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel`
4. Set environment variables in Vercel dashboard

### Netlify Deployment:
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

## 🔧 Step 8: Environment Configuration

### For Production Deployment:

1. **Create production environment file** (don't commit this):
```env
# Production .env
REACT_APP_SERVICENOW_BASE_URL=https://your-prod-instance.service-now.com
REACT_APP_SERVICENOW_USERNAME=prod-username
REACT_APP_SERVICENOW_PASSWORD=prod-password
REACT_APP_SERVICENOW_CLIENT_ID=prod-client-id
REACT_APP_SERVICENOW_CLIENT_SECRET=prod-client-secret
NODE_ENV=production
```

2. **Update your deployment platform** with these environment variables

## 📊 Step 9: Monitoring and Analytics

### Add monitoring to your deployment:

1. **GitHub Actions monitoring**: Check the "Actions" tab for build status
2. **Application monitoring**: Consider adding services like:
   - Sentry for error tracking
   - Google Analytics for usage tracking
   - LogRocket for user session recording

## 🔄 Step 10: Continuous Integration/Deployment

Your repository is now set up for:
- ✅ Automatic builds on push to main
- ✅ Automatic deployment to GitHub Pages
- ✅ Environment variable management
- ✅ Docker containerization
- ✅ Multiple cloud platform support

## 🚨 Troubleshooting

### Common Issues:

1. **Build fails**: Check Node.js version compatibility
2. **Environment variables not working**: Verify secret names match exactly
3. **CORS issues**: Configure your ServiceNow instance for your domain
4. **Authentication errors**: Verify ServiceNow credentials

### Debug Commands:
```bash
# Check build locally
npm run build

# Test production build
npm run preview

# Check environment variables
echo $VITE_SERVICENOW_BASE_URL
```

## 📝 Next Steps

1. ✅ Push your code to GitHub
2. ✅ Set up GitHub Actions workflow
3. ✅ Configure environment variables
4. ✅ Test deployment
5. ✅ Set up monitoring
6. ✅ Configure custom domain (optional)

## 🆘 Support

If you encounter issues:
1. Check GitHub Actions logs
2. Verify ServiceNow API connectivity
3. Review environment variable configuration
4. Test locally first

---

**🎉 Congratulations! Your ServiceNow External Portal is now ready for GitHub deployment!**

Remember to:
- Keep your credentials secure
- Monitor your deployments
- Update dependencies regularly
- Test thoroughly before deploying to production