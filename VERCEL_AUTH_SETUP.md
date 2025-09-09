# Vercel Authentication Setup Guide

## Issue: Login works locally but fails in production

### Root Cause:
1. Environment variables are set for localhost
2. Missing Vercel KV for session storage  
3. Incorrect AUTH_URL configuration

### Solution Steps:

## 1. Set up Vercel KV Database
```bash
# In your Vercel dashboard:
1. Go to Storage tab
2. Create new KV Database
3. Copy the environment variables provided
```

## 2. Update Vercel Environment Variables
Go to your Vercel project → Settings → Environment Variables and add:

```bash
# Production URLs (replace with your actual domain)
NEXT_PUBLIC_BASE_URL=https://your-vercel-app.vercel.app
AUTH_URL=https://your-vercel-app.vercel.app

# Authentication Secret
AUTH_SECRET=s55T4WnE0XHfkljb+Hqvib2M4QR4uETFP/R9vv0QwMo

# Vercel KV (automatically provided when you create KV database)
AUTH_KV_REST_API_URL=your-kv-rest-api-url
AUTH_KV_REST_API_TOKEN=your-kv-rest-api-token

# Data Provider
NEXT_PUBLIC_DATA_PROVIDER=mock
```

## 3. Alternative: Use Database Adapter Instead of KV

If you prefer not to use Vercel KV, modify your auth configuration:

```typescript
// In src/@auth/authJs.ts
const storage = createStorage({
	driver: process.env.VERCEL
		? memoryDriver() // Fallback to memory for now
		: memoryDriver()
});
```

## 4. Test Credentials
The current setup uses hardcoded credentials:
- Email: `admin@fusetheme.com`
- Password: any non-empty string

## 5. Deploy and Test
```bash
# Redeploy after setting environment variables
vercel --prod
```

## Quick Fix Commands:
```bash
# Set environment variables via Vercel CLI
vercel env add AUTH_URL
vercel env add NEXT_PUBLIC_BASE_URL
vercel env add AUTH_SECRET

# Redeploy
vercel --prod
```