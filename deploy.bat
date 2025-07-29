@echo off
setlocal enabledelayedexpansion

REM ServiceNow External Portal Deployment Script for Windows
REM This script helps deploy the application in different environments

echo ========================================
echo   ServiceNow External Portal Deployment
echo ========================================
echo.

REM Parse command line arguments
set DEPLOY_TYPE=%1
if "%DEPLOY_TYPE%"=="" set DEPLOY_TYPE=local

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ and try again.
    exit /b 1
)
echo [SUCCESS] Node.js is installed

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm is not installed. Please install npm and try again.
    exit /b 1
)
echo [SUCCESS] npm is installed

REM Handle different deployment types
if "%DEPLOY_TYPE%"=="local" goto deploy_local
if "%DEPLOY_TYPE%"=="docker" goto deploy_docker
if "%DEPLOY_TYPE%"=="compose" goto deploy_docker_compose
if "%DEPLOY_TYPE%"=="cleanup" goto cleanup
if "%DEPLOY_TYPE%"=="help" goto show_help

echo [ERROR] Unknown option: %DEPLOY_TYPE%
goto show_help

:deploy_local
echo [INFO] Starting local production deployment...
echo.

REM Install dependencies
echo [INFO] Installing dependencies...
npm install
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    exit /b 1
)
echo [SUCCESS] Dependencies installed successfully
echo.

REM Build the application
echo [INFO] Building the application...
npm run build
if errorlevel 1 (
    echo [ERROR] Failed to build the application
    exit /b 1
)
echo [SUCCESS] Application built successfully
echo.

REM Check if .env file exists
if not exist ".env" (
    echo [WARNING] .env file not found.
    if exist ".env.example" (
        echo [INFO] Creating .env from .env.example...
        copy ".env.example" ".env"
        echo [WARNING] Please update .env file with your ServiceNow credentials before running the server
        echo.
    ) else (
        echo [ERROR] .env.example file not found. Please create .env file manually.
        exit /b 1
    )
)

REM Start the server
echo [INFO] Starting the production server...
echo [INFO] Application will be available at http://localhost:3001
echo [INFO] Press Ctrl+C to stop the server
echo.
npm run start:windows
goto end

:deploy_docker
echo [INFO] Deploying with Docker...
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed. Please install Docker and try again.
    exit /b 1
)
echo [SUCCESS] Docker is installed

REM Install dependencies (needed for build context)
echo [INFO] Installing dependencies...
npm install
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    exit /b 1
)

REM Build Docker image
echo [INFO] Building Docker image...
docker build -t servicenow-portal .
if errorlevel 1 (
    echo [ERROR] Failed to build Docker image
    exit /b 1
)
echo [SUCCESS] Docker image built successfully
echo.

REM Stop and remove existing container if it exists
docker stop servicenow-portal-container >nul 2>&1
docker rm servicenow-portal-container >nul 2>&1

REM Run Docker container
echo [INFO] Starting Docker container...
docker run -d -p 3001:3001 --name servicenow-portal-container servicenow-portal
if errorlevel 1 (
    echo [ERROR] Failed to start Docker container
    exit /b 1
)
echo [SUCCESS] Docker container started successfully
echo [INFO] Application is running at http://localhost:3001
goto end

:deploy_docker_compose
echo [INFO] Deploying with Docker Compose...
echo.

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if errorlevel 1 (
    docker compose version >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] Docker Compose is not installed. Please install Docker Compose and try again.
        exit /b 1
    )
    set COMPOSE_CMD=docker compose
) else (
    set COMPOSE_CMD=docker-compose
)
echo [SUCCESS] Docker Compose is installed

REM Install dependencies (needed for build context)
echo [INFO] Installing dependencies...
npm install
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    exit /b 1
)

REM Check if .env file exists
if not exist ".env" (
    echo [WARNING] .env file not found.
    if exist ".env.example" (
        echo [INFO] Creating .env from .env.example...
        copy ".env.example" ".env"
        echo [WARNING] Please update .env file with your ServiceNow credentials
        echo.
    )
)

REM Start with Docker Compose
echo [INFO] Starting services with Docker Compose...
%COMPOSE_CMD% up --build -d
if errorlevel 1 (
    echo [ERROR] Failed to start services with Docker Compose
    exit /b 1
)
echo [SUCCESS] Application deployed with Docker Compose
echo [INFO] Application is running at http://localhost:3001
goto end

:cleanup
echo [INFO] Cleaning up...
echo.

REM Stop and remove Docker containers
docker stop servicenow-portal-container >nul 2>&1
docker rm servicenow-portal-container >nul 2>&1

REM Stop Docker Compose services
docker-compose down >nul 2>&1
docker compose down >nul 2>&1

REM Remove build artifacts
if exist "dist" rmdir /s /q "dist"
if exist "node_modules\.cache" rmdir /s /q "node_modules\.cache"

echo [SUCCESS] Cleanup completed
goto end

:show_help
echo Usage: %0 [OPTION]
echo.
echo Options:
echo   local           Deploy locally (default)
echo   docker          Deploy with Docker
echo   compose         Deploy with Docker Compose
echo   cleanup         Clean up containers and build artifacts
echo   help            Show this help message
echo.
echo Examples:
echo   %0              # Deploy locally
echo   %0 local        # Deploy locally
echo   %0 docker       # Deploy with Docker
echo   %0 compose      # Deploy with Docker Compose
echo   %0 cleanup      # Clean up
goto end

:end
echo.
echo Deployment script completed.
pause