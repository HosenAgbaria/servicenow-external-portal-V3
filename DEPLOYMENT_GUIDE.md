# Deployment Guide

This guide covers multiple deployment options for the ServiceNow External Portal project.

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Git (for version control)
- Access to ServiceNow instance credentials

## 🏗️ Project Architecture

This project consists of two main components:
1. **Frontend**: React + Vite application (port 5173 in dev)
2. **Backend Proxy**: Express.js server for ServiceNow API integration (port 3001)

## 🚀 Deployment Options

### Option 1: Local Production Build

#### Step 1: Install Dependencies
```bash
npm install
```

#### Step 2: Build the Frontend
```bash
npm run build
```
This creates a `dist/` folder with optimized production files.

#### Step 3: Preview the Build
```bash
npm run preview
```
This serves the production build locally on `http://localhost:4173`

#### Step 4: Start the Proxy Server
In a separate terminal:
```bash
npm run dev:proxy
```
This starts the Express proxy server on `http://localhost:3001`

### Option 2: Static Hosting (Frontend Only)

**Note**: This option requires configuring CORS on your ServiceNow instance or using a different proxy solution.

#### Supported Platforms:
- **Netlify**
- **Vercel** 
- **GitHub Pages**
- **AWS S3 + CloudFront**
- **Azure Static Web Apps**

#### Steps for Netlify/Vercel:

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist/` folder to your chosen platform

3. Configure environment variables for ServiceNow API endpoints

#### Example Netlify Configuration (`netlify.toml`):
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: Full Stack Deployment (Recommended)

#### Platform Options:
- **Heroku**
- **Railway**
- **Render**
- **DigitalOcean App Platform**
- **AWS Elastic Beanstalk**

#### Example: Heroku Deployment

1. Create a `Procfile` in the root directory:
```
web: node server.js
```

2. Update `package.json` scripts:
```json
{
  "scripts": {
    "start": "node server.js",
    "build": "tsc -b && vite build",
    "heroku-postbuild": "npm run build"
  }
}
```

3. Configure server.js to serve static files:
```javascript
// Add this to server.js after middleware setup
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}
```

4. Deploy to Heroku:
```bash
heroku create your-app-name
heroku config:set NODE_ENV=production
git push heroku main
```

### Option 4: Docker Deployment

#### Create `Dockerfile`:
```dockerfile
# Build stage
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY server.js ./
COPY --from=build /app/dist ./dist

EXPOSE 3001
CMD ["node", "server.js"]
```

#### Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

#### Deploy with Docker:
```bash
docker build -t servicenow-portal .
docker run -p 3001:3001 servicenow-portal
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file for sensitive configuration:
```env
# ServiceNow Configuration
SERVICENOW_BASE_URL=https://your-instance.service-now.com
SERVICENOW_USERNAME=your-username
SERVICENOW_PASSWORD=your-password
SERVICENOW_CLIENT_ID=your-client-id
SERVICENOW_CLIENT_SECRET=your-client-secret

# Server Configuration
PORT=3001
NODE_ENV=production
```

### Update server.js for Environment Variables:
```javascript
const SERVICENOW_CONFIG = {
  baseUrl: process.env.SERVICENOW_BASE_URL || 'https://tanivdynamicsltddemo4.service-now.com',
  username: process.env.SERVICENOW_USERNAME || 'ext.portal.v2',
  password: process.env.SERVICENOW_PASSWORD || '*]<D7sP^KX+zW1Nn.VJ6P,(w=-$5QJ',
  clientId: process.env.SERVICENOW_CLIENT_ID || '1fcct8c927c54abbeb2ba990f6149043',
  clientSecret: process.env.SERVICENOW_CLIENT_SECRET || 'Jfjwy4o$eg'
};
```

## 🔒 Security Considerations

1. **Never commit credentials** to version control
2. **Use environment variables** for sensitive data
3. **Enable HTTPS** in production
4. **Configure CORS** properly
5. **Implement rate limiting** on the proxy server
6. **Use secure headers** (helmet.js)

### Security Enhancements for server.js:
```javascript
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);
```

## 📊 Performance Optimization

### Frontend Optimizations:
1. **Code splitting** with React.lazy()
2. **Image optimization** with proper formats
3. **Bundle analysis** with `npm run build -- --analyze`
4. **CDN deployment** for static assets

### Backend Optimizations:
1. **Caching** ServiceNow responses
2. **Connection pooling** for database connections
3. **Compression** middleware
4. **Load balancing** for multiple instances

## 🔍 Monitoring and Logging

### Add Logging to server.js:
```javascript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

## 🚨 Troubleshooting

### Common Issues:

1. **CORS Errors**: Configure CORS properly in server.js
2. **Build Failures**: Check Node.js version compatibility
3. **API Connection Issues**: Verify ServiceNow credentials
4. **Port Conflicts**: Ensure ports 3001 and 5173 are available

### Debug Commands:
```bash
# Check build output
npm run build -- --debug

# Test API connectivity
node test-servicenow-connection.js

# Check server logs
tail -f combined.log
```

## 📝 Deployment Checklist

- [ ] Dependencies installed
- [ ] Environment variables configured
- [ ] ServiceNow credentials verified
- [ ] Frontend builds successfully
- [ ] Proxy server starts without errors
- [ ] API endpoints respond correctly
- [ ] CORS configured properly
- [ ] Security headers implemented
- [ ] HTTPS enabled (production)
- [ ] Monitoring and logging configured
- [ ] Backup and recovery plan in place

## 🆘 Support

For deployment issues:
1. Check the application logs
2. Verify ServiceNow API connectivity
3. Test with a minimal configuration
4. Review security and firewall settings

---

**Note**: Remember to update ServiceNow credentials and API endpoints according to your specific environment before deployment.