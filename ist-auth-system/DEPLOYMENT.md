# Backend Deployment Guide

## Quick Deploy Options

### Option 1: Railway (Recommended)
**Free tier, PostgreSQL included, easiest setup**

1. **Setup:**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   railway init
   railway up
   ```

2. **Add Environment Variables in Railway Dashboard:**
   - `MAIL_USERNAME=your-email@gmail.com`
   - `MAIL_PASSWORD=your-app-password`
   - `LINKEDIN_CLIENT_ID=your-linkedin-client-id`
   - `LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret`
   - `ENCRYPTION_SECRET=generate-32-char-secret`
   - `SPRING_PROFILES_ACTIVE=prod`

3. **Railway auto-provides PostgreSQL** - no manual setup needed

### Option 2: Render
**Free tier with PostgreSQL**

1. **Connect GitHub repo to Render**
2. **Build Command:** `./gradlew build`
3. **Start Command:** `java -jar build/libs/ist-auth-system-0.0.1-SNAPSHOT.jar`
4. **Add same environment variables as Railway**

### Option 3: Heroku
**Free tier ended, but still popular**

1. **Deploy:**
   ```bash
   heroku create your-app-name
   heroku addons:create heroku-postgresql:mini
   git push heroku main
   ```

## Local Testing Before Deploy

1. **Build the application:**
   ```bash
   ./gradlew build
   ```

2. **Test locally:**
   ```bash
   java -jar build/libs/ist-auth-system-0.0.1-SNAPSHOT.jar
   ```

3. **Verify endpoints:**
   - Health: `http://localhost:8080/api/actuator/health`
   - JWKS: `http://localhost:8080/api/.well-known/jwks.json`
   - API Docs: `http://localhost:8080/api/swagger-ui.html`

## Frontend Integration

Once deployed, update your frontend `authService.ts`:

```typescript
// Replace localhost with your deployed URL
private readonly baseURL = 'https://your-app.railway.app/api/auth';
private readonly jwksURL = 'https://your-app.railway.app/api/.well-known/jwks.json';
```

## Environment Variables for Production

**Required:**
- `DATABASE_URL` (auto-provided by Railway/Render)
- `MAIL_USERNAME` & `MAIL_PASSWORD`
- `LINKEDIN_CLIENT_ID` & `LINKEDIN_CLIENT_SECRET`
- `ENCRYPTION_SECRET`

**Optional:**
- `FRONTEND_URL` (your frontend domain)
- `CORS_ALLOWED_ORIGINS` (your frontend domain)

## Quick Start (Railway)

```bash
# 1. Build
./gradlew build

# 2. Deploy
npm install -g @railway/cli
railway login
railway init
railway up

# 3. Add environment variables in Railway dashboard
# 4. Update frontend baseURL to your Railway URL
```

Your backend will be live at: `https://your-app.railway.app/api`