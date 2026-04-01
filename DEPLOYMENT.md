# LIFE-LINK: Production Deployment Guide

## 🚀 Production Deployment Checklist

### Backend Deployment (Heroku/Railway/Render)

#### 1. Build for Production
```bash
npm run build
```

#### 2. Production Environment Variables
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/life-link?retryWrites=true&w=majority
JWT_SECRET=[GENERATE_STRONG_SECRET_WITH_CRYPTO]
CORS_ORIGIN=https://your-domain.com
SOCKET_IO_CORS_ORIGIN=https://your-domain.com
```

#### 3. Deploy to Heroku
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create life-link-backend

# Add MongoDB Atlas
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=[YOUR_SECRET]

# Deploy
git push heroku main
```

#### 4. Deploy to Railway.app (Alternative)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway init

# Deploy
railway up
```

#### 5. Deploy to Render (Alternative)
- Connect GitHub repo to render.com
- Create new Web Service
- Set build command: `npm install && npm run build`
- Set start command: `npm start`
- Add environment variables in dashboard

---

### Frontend Deployment (Vercel/Netlify)

#### 1. Build for Production
```bash
npm run build
```

#### 2. Production Environment Variables (.env.production)
```env
VITE_API_URL=https://your-backend.com/api
VITE_SOCKET_URL=https://your-backend.com
```

#### 3. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### 4. Deploy to Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

#### 5. Manual S3 + CloudFront Deployment
```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name

# Invalidate CloudFront
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"
```

---

## 🗄️ Database Setup (Production)

### MongoDB Atlas Setup
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create new cluster (M0 Free for testing, M2+ for production)
3. Create user with strong password
4. Add IP whitelist (0.0.0.0/0 for testing, specific IPs for production)
5. Get connection string: `mongodb+srv://user:password@cluster.mongodb.net/life-link`

### Indexes for Performance
```javascript
// Create these indexes in MongoDB Atlas GUI or via:
db.donors.createIndex({ email: 1 })
db.donors.createIndex({ "location.latitude": 1, "location.longitude": 1 })
db.sotialerts.createIndex({ donorId: 1 })
db.sotialerts.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
db.donationrequests.createIndex({ "location.latitude": 1, "location.longitude": 1 })
db.donationrequests.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
```

---

## 🔐 Security Hardening

### Backend Security
```typescript
// Add helmet for HTTP headers
import helmet from 'helmet';
app.use(helmet());

// Add rate limiting
import rateLimit from 'express-rate-limit';
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

// HTTPS redirect
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});
```

### Frontend Security
```typescript
// Add CSP headers
<meta http-equiv="Content-Security-Policy" 
  content="default-src 'self'; script-src 'self' 'unsafe-inline'">

// HTTPS enforcement
if (window.location.protocol !== 'https:' && 
    process.env.NODE_ENV === 'production') {
  window.location.href = 'https:' + window.location.href.substring(5);
}
```

---

## 📊 Monitoring & Logging

### Backend Monitoring
```bash
# Install monitoring tools
npm install winston pm2 express-prometheus-middleware

# Use PM2 for process management
pm2 start dist/server.js --name "life-link-backend"
pm2 startup
pm2 save
```

### Frontend Analytics
```typescript
// Add Google Analytics
import ReactGA from "react-ga4";
ReactGA.initialize("GA_MEASUREMENT_ID");

// Track events
ReactGA.event({
  category: "SOS",
  action: "broadcast",
  label: "emergency_alert"
});
```

---

## 🚨 Incident Response

### Database Backup
```bash
# Automated backup to S3
mongodump --uri="mongodb+srv://user:password@cluster.mongodb.net/life-link" --out=./backup

aws s3 cp backup/ s3://backups-bucket/ --recursive
```

### Health Check Endpoint
```bash
curl https://your-backend.com/api/health
# Response: { "status": "healthy", "timestamp": "...", "environment": "production" }
```

### Performance Monitoring
```bash
# Monitor endpoints
curl -X GET https://your-backend.com/api/health | jq .
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy LIFE-LINK

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: Install & Build Backend
        run: |
          cd backend
          npm install
          npm run build
      
      - name: Deploy to Railway
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: railway up
      
      - name: Build & Deploy Frontend
        run: |
          cd frontend
          npm install
          npm run build
          vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

---

## 📞 Support & Monitoring

### Sentry Integration for Error Tracking
```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://your-sentry-dsn@sentry.io/xxxxx",
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0
});

app.use(Sentry.Handlers.errorHandler());
```

---

## ✅ Pre-Launch Checklist

- [ ] All environment variables set and validated
- [ ] MongoDB Atlas cluster created and secured
- [ ] Backend health check passing
- [ ] Frontend builds without errors
- [ ] CORS configured correctly
- [ ] Socket.io connection verified
- [ ] SSL/HTTPS certificates installed
- [ ] Monitoring and alerting configured
- [ ] Backup procedures tested
- [ ] Security audit completed
- [ ] Load testing performed
- [ ] Documentation updated

---

**LIFE-LINK is now production-ready! 🚀🔴**
