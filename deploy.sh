#!/bin/bash

# ServiceNow External Portal Deployment Script
# This script helps deploy the application in different environments

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  ServiceNow External Portal Deployment${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ and try again."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js $(node -v) is installed"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm and try again."
        exit 1
    fi
    print_success "npm $(npm -v) is installed"
}

# Install dependencies
install_dependencies() {
    print_info "Installing dependencies..."
    npm install
    print_success "Dependencies installed successfully"
}

# Build the application
build_app() {
    print_info "Building the application..."
    npm run build
    print_success "Application built successfully"
}

# Deploy locally
deploy_local() {
    print_info "Starting local production deployment..."
    
    # Check if .env file exists
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating from .env.example..."
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_warning "Please update .env file with your ServiceNow credentials before running the server"
        else
            print_error ".env.example file not found. Please create .env file manually."
        fi
    fi
    
    # Start the server
    print_info "Starting the production server..."
    NODE_ENV=production node server.js
}

# Deploy with Docker
deploy_docker() {
    print_info "Deploying with Docker..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker and try again."
        exit 1
    fi
    
    # Build Docker image
    print_info "Building Docker image..."
    docker build -t servicenow-portal .
    print_success "Docker image built successfully"
    
    # Run Docker container
    print_info "Starting Docker container..."
    docker run -d -p 3001:3001 --name servicenow-portal-container servicenow-portal
    print_success "Docker container started successfully"
    print_info "Application is running at http://localhost:3001"
}

# Deploy with Docker Compose
deploy_docker_compose() {
    print_info "Deploying with Docker Compose..."
    
    # Check if Docker Compose is installed
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose and try again."
        exit 1
    fi
    
    # Check if .env file exists
    if [ ! -f ".env" ]; then
        print_warning ".env file not found. Creating from .env.example..."
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_warning "Please update .env file with your ServiceNow credentials"
        fi
    fi
    
    # Start with Docker Compose
    if command -v docker-compose &> /dev/null; then
        docker-compose up --build -d
    else
        docker compose up --build -d
    fi
    
    print_success "Application deployed with Docker Compose"
    print_info "Application is running at http://localhost:3001"
}

# Clean up
cleanup() {
    print_info "Cleaning up..."
    
    # Remove Docker containers and images
    if command -v docker &> /dev/null; then
        docker stop servicenow-portal-container 2>/dev/null || true
        docker rm servicenow-portal-container 2>/dev/null || true
        
        if command -v docker-compose &> /dev/null; then
            docker-compose down 2>/dev/null || true
        elif docker compose version &> /dev/null; then
            docker compose down 2>/dev/null || true
        fi
    fi
    
    # Remove build artifacts
    rm -rf dist/ node_modules/.cache/
    
    print_success "Cleanup completed"
}

# Show help
show_help() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  local           Deploy locally (default)"
    echo "  docker          Deploy with Docker"
    echo "  compose         Deploy with Docker Compose"
    echo "  cleanup         Clean up containers and build artifacts"
    echo "  help            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0              # Deploy locally"
    echo "  $0 local        # Deploy locally"
    echo "  $0 docker       # Deploy with Docker"
    echo "  $0 compose      # Deploy with Docker Compose"
    echo "  $0 cleanup      # Clean up"
}

# Main script
main() {
    print_header
    
    # Parse command line arguments
    DEPLOY_TYPE=${1:-local}
    
    case $DEPLOY_TYPE in
        "local")
            check_node
            check_npm
            install_dependencies
            build_app
            deploy_local
            ;;
        "docker")
            check_node
            check_npm
            install_dependencies
            deploy_docker
            ;;
        "compose")
            check_node
            check_npm
            install_dependencies
            deploy_docker_compose
            ;;
        "cleanup")
            cleanup
            ;;
        "help")
            show_help
            ;;
        *)
            print_error "Unknown option: $DEPLOY_TYPE"
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@"