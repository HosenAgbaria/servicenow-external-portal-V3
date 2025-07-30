@echo off
echo ========================================
echo ServiceNow External Portal Deployment Setup
echo ========================================
echo.
echo This script will help you deploy the backend server and configure the frontend.
echo.
echo Prerequisites:
echo 1. Git installed
echo 2. GitHub account
echo 3. Account on a hosting platform (Render.com recommended)
echo.
pause

echo.
echo Step 1: Setting up server repository...
echo.
cd server-repo

echo Creating GitHub repository for server...
echo Please follow these steps manually:
echo 1. Go to https://github.com/new
echo 2. Repository name: servicenow-external-portal-server
echo 3. Make it public
echo 4. Don't initialize with README
echo 5. Click "Create repository"
echo.
pause

echo.
echo Step 2: Enter your GitHub username:
set /p GITHUB_USERNAME="GitHub Username: "

echo.
echo Step 3: Pushing server code to GitHub...
git remote add origin https://github.com/%GITHUB_USERNAME%/servicenow-external-portal-server.git
git branch -M main
git push -u origin main

if %errorlevel% neq 0 (
    echo Error: Failed to push to GitHub. Please check your credentials and repository setup.
    pause
    exit /b 1
)

echo.
echo Step 4: Deploy to Render.com...
echo Please follow these steps:
echo 1. Go to https://render.com
echo 2. Sign up/Login with GitHub
echo 3. Click "New" → "Web Service"
echo 4. Connect your servicenow-external-portal-server repository
echo 5. Settings:
echo    - Name: servicenow-portal-server
echo    - Environment: Node
echo    - Build Command: npm install
echo    - Start Command: npm start
echo 6. Add Environment Variables:
echo    SERVICENOW_BASE_URL=https://tanivdynamicsltddemo4.service-now.com
echo    SERVICENOW_USERNAME=ext.portal.v2
echo    SERVICENOW_PASSWORD=*]^<D7sP^^KX+zW1Nn.VJ6P,(w=-$5QJ
echo    FRONTEND_URL=https://%GITHUB_USERNAME%.github.io
echo    NODE_ENV=production
echo 7. Click "Create Web Service"
echo 8. Wait for deployment (5-10 minutes)
echo.
pause

echo.
echo Step 5: Enter your deployed server URL:
set /p SERVER_URL="Deployed Server URL (e.g., https://servicenow-portal-server.onrender.com): "

echo.
echo Step 6: Updating frontend configuration...
cd ..

echo Creating production environment file...
echo # Production Environment Variables > .env.production
echo VITE_API_BASE_URL=%SERVER_URL% >> .env.production
echo VITE_SERVICENOW_BASE_URL=https://tanivdynamicsltddemo4.service-now.com >> .env.production
echo VITE_SERVICENOW_USERNAME=ext.portal.v2 >> .env.production
echo VITE_SERVICENOW_PASSWORD=*]^<D7sP^^KX+zW1Nn.VJ6P,(w=-$5QJ >> .env.production
echo VITE_SERVICENOW_CLIENT_ID=1fcct8c927c54abbeb2ba990f6149043 >> .env.production
echo VITE_SERVICENOW_CLIENT_SECRET=Jfjwy4o$eg >> .env.production

echo.
echo Step 7: Committing and pushing changes...
git add .
git commit -m "Configure production deployment with server URL: %SERVER_URL%"
git push origin main

if %errorlevel% neq 0 (
    echo Error: Failed to push changes. Please check your git configuration.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Deployment Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Go to your GitHub repository settings
echo 2. Add these secrets in Settings → Secrets and variables → Actions:
echo    - VITE_API_BASE_URL: %SERVER_URL%
echo    - VITE_SERVICENOW_BASE_URL: https://tanivdynamicsltddemo4.service-now.com
echo    - VITE_SERVICENOW_USERNAME: ext.portal.v2
echo    - VITE_SERVICENOW_PASSWORD: *]^<D7sP^^KX+zW1Nn.VJ6P,(w=-$5QJ
echo    - VITE_SERVICENOW_CLIENT_ID: 1fcct8c927c54abbeb2ba990f6149043
echo    - VITE_SERVICENOW_CLIENT_SECRET: Jfjwy4o$eg
echo.
echo 3. The GitHub Actions will automatically deploy your frontend
echo 4. Your app will be available at: https://%GITHUB_USERNAME%.github.io/servicenow-external-portal-V3/
echo.
echo Test URLs:
echo - Backend Health: %SERVER_URL%/health
echo - Frontend App: https://%GITHUB_USERNAME%.github.io/servicenow-external-portal-V3/
echo.
pause