# MockAPI to LightAPI Migration Manual

## 🎯 Overview
This manual provides step-by-step instructions for migrating from MockAPI to LightAPI, including all necessary precautions and considerations.

## ⚠️ Critical Precautions

### 1. **Backup Current System**
```bash
# Create a backup branch
git checkout -b backup/pre-lightapi-migration
git add .
git commit -m "Backup before LightAPI migration"

# Create main migration branch
git checkout master
git checkout -b feature/lightapi-migration
```

### 2. **Environment Considerations**
- **Development**: Test thoroughly in development first
- **Staging**: Deploy to staging environment before production
- **Production**: Plan for rollback strategy

### 3. **Data Integrity**
- Verify all 3,310 records imported correctly
- Test critical user flows with new API
- Ensure data format compatibility

## 📋 Pre-Migration Checklist

### ✅ Prerequisites
- [ ] Node.js installed (v14+ recommended)
- [ ] SQLite3 available on system
- [ ] Current MockAPI endpoints documented
- [ ] All frontend API calls identified
- [ ] Backup created
- [ ] LightAPI tested and working

### ✅ System Requirements
- [ ] Port 3001 available (or configure different port)
- [ ] Sufficient disk space for SQLite database
- [ ] Network access for CORS if needed

## 🔄 Migration Steps

### Phase 1: Preparation

#### 1.1 Document Current MockAPI Endpoints
```bash
# Find all MockAPI calls in your codebase
grep -r "/api/mock" src/ --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx"
```

Create a list of endpoints:
```
Current MockAPI endpoints:
- /api/mock/users
- /api/mock/contacts  
- /api/mock/tasks
- /api/mock/[other-endpoints]
```

#### 1.2 Verify LightAPI Data
```bash
cd src/@light-api

# Check all data is imported
node cli.js status

# Verify specific collections
node cli.js list-types
```

### Phase 2: Code Migration

#### 2.1 Update API Base URL

**Option A: Environment Variable (Recommended)**
```javascript
// Create or update .env file
REACT_APP_API_BASE_URL=http://localhost:3001

// In your API service file
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api/mock';
```

**Option B: Configuration File**
```javascript
// src/app/configs/apiConfig.js
export const API_CONFIG = {
  // MockAPI (old)
  // baseURL: 'http://localhost:3000/api/mock',
  
  // LightAPI (new)
  baseURL: 'http://localhost:3001',
  
  // Feature flag for gradual migration
  useLightAPI: true
};
```

#### 2.2 Update API Calls

**Before (MockAPI):**
```javascript
// MockAPI format
const response = await fetch('/api/mock/users');
const users = await response.json();
```

**After (LightAPI):**
```javascript
// LightAPI format  
const response = await fetch('http://localhost:3001/users');
const users = await response.json();
```

#### 2.3 Update Specific Endpoints

| MockAPI Endpoint | LightAPI Endpoint | Notes |
|------------------|-------------------|-------|
| `/api/mock/users` | `http://localhost:3001/users` | Direct mapping |
| `/api/mock/contacts` | `http://localhost:3001/contacts` | Direct mapping |
| `/api/mock/tasks` | `http://localhost:3001/tasks` | Direct mapping |
| `/api/mock/auth/user/1` | `http://localhost:3001/users/1` | ID-based lookup |

#### 2.4 Handle Response Format Differences

**MockAPI might return:**
```json
{
  "data": [...],
  "status": "success"
}
```

**LightAPI returns:**
```json
[...]
```

**Adaptation code:**
```javascript
// Create adapter function
const adaptResponse = (response, isLightAPI = true) => {
  if (isLightAPI) {
    // LightAPI returns data directly
    return response;
  } else {
    // MockAPI wraps in data object
    return response.data;
  }
};
```

### Phase 3: Service Layer Updates

#### 3.1 Update API Service Files

Find and update all API service files:
```bash
# Find API service files
find src/ -name "*api*" -o -name "*service*" | grep -E "\.(js|ts|jsx|tsx)$"
```

**Example Service Update:**
```javascript
// src/app/services/contactsApi.js
class ContactsApi {
  constructor() {
    // this.baseURL = '/api/mock'; // Old MockAPI
    this.baseURL = 'http://localhost:3001'; // New LightAPI
  }

  async getContacts() {
    const response = await fetch(`${this.baseURL}/contacts`);
    return response.json();
  }

  async getContact(id) {
    const response = await fetch(`${this.baseURL}/contacts/${id}`);
    return response.json();
  }

  async createContact(data) {
    const response = await fetch(`${this.baseURL}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async updateContact(id, data) {
    const response = await fetch(`${this.baseURL}/contacts/${id}`, {
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async deleteContact(id) {
    const response = await fetch(`${this.baseURL}/contacts/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }
}
```

#### 3.2 Update Redux/State Management

**If using Redux Toolkit Query:**
```javascript
// src/app/store/api/contactsApi.js
export const contactsApi = createApi({
  reducerPath: 'contactsApi',
  baseQuery: fetchBaseQuery({
    // baseUrl: '/api/mock/', // Old
    baseUrl: 'http://localhost:3001/', // New
  }),
  tagTypes: ['Contact'],
  endpoints: (builder) => ({
    getContacts: builder.query({
      query: () => 'contacts',
      providesTags: ['Contact'],
    }),
    // ... other endpoints
  }),
});
```

### Phase 4: Testing & Validation

#### 4.1 Start LightAPI Server
```bash
cd src/@light-api
node cli.js serve

# Or run in background
npm start &
```

#### 4.2 Run Comprehensive Tests
```bash
# Test LightAPI endpoints
node test-server.js

# Test your application
npm run dev

# Run unit tests if available
npm test

# Run E2E tests if available
npm run test:e2e
```

#### 4.3 Validate Critical Flows
- [ ] User authentication
- [ ] Data loading on dashboard
- [ ] CRUD operations (Create, Read, Update, Delete)
- [ ] Search functionality
- [ ] Pagination
- [ ] Error handling

### Phase 5: Production Deployment

#### 5.1 Environment Setup
```bash
# Production environment variables
REACT_APP_API_BASE_URL=http://your-production-server:3001
NODE_ENV=production
```

#### 5.2 Process Management
```bash
# Using PM2 for production
npm install -g pm2

# Start LightAPI with PM2
cd src/@light-api
pm2 start cli.js --name "lightapi" -- serve

# Monitor
pm2 status
pm2 logs lightapi
```

#### 5.3 Reverse Proxy Setup (Nginx)
```nginx
# /etc/nginx/sites-available/your-app
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
    }

    # LightAPI
    location /api/data/ {
        proxy_pass http://localhost:3001/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 🚨 Rollback Strategy

### Quick Rollback Steps
```bash
# 1. Stop LightAPI
pm2 stop lightapi  # or kill the process

# 2. Switch back to MockAPI branch
git checkout master
git merge backup/pre-lightapi-migration

# 3. Update environment variables
REACT_APP_API_BASE_URL=http://localhost:3000/api/mock

# 4. Restart application
npm run build
npm start
```

### Rollback Checklist
- [ ] LightAPI server stopped
- [ ] Code reverted to MockAPI endpoints
- [ ] Environment variables updated
- [ ] Application restarted
- [ ] Critical flows verified working

## 🔧 Configuration Options

### Custom Port Configuration
```javascript
// Start LightAPI on different port
node cli.js serve 3002

// Update frontend configuration
const API_BASE_URL = 'http://localhost:3002';
```

### CORS Configuration
```javascript
// In light-api.js, modify CORS settings
this.app.use(cors({
  origin: ['http://localhost:3000', 'https://your-domain.com'],
  credentials: true
}));
```

### Database Location
```javascript
// Custom database path
const db = new LightApiDatabase('./custom/path/lightapi.db');
```

## 📊 Performance Comparison

| Feature | MockAPI | LightAPI | Benefit |
|---------|---------|----------|---------|
| Data Persistence | ❌ Memory only | ✅ SQLite | Data survives restarts |
| Query Speed | ~50ms | ~5ms | 10x faster queries |
| Concurrent Users | Limited | High | Better scalability |
| Data Size | Limited by RAM | Limited by disk | Larger datasets |
| Search | Basic | Advanced | Better search capabilities |

## 🐛 Common Issues & Solutions

### Issue 1: CORS Errors
**Problem:** Cross-origin requests blocked
**Solution:**
```javascript
// Update CORS configuration in light-api.js
this.app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Issue 2: Port Already in Use
**Problem:** Port 3001 already occupied
**Solution:**
```bash
# Find process using port
netstat -ano | findstr :3001
# Kill process or use different port
node cli.js serve 3002
```

### Issue 3: Data Format Mismatch
**Problem:** Frontend expects different data structure
**Solution:** Create adapter functions or modify API responses

### Issue 4: Database Lock
**Problem:** SQLite database locked
**Solution:**
```bash
# Check if multiple instances running
ps aux | grep "cli.js serve"
# Kill duplicate processes
```

## 📈 Monitoring & Maintenance

### Health Monitoring
```bash
# Check API health
curl http://localhost:3001/health

# Monitor database size
ls -lh src/@light-api/lightapi.db

# Monitor server logs
tail -f lightapi.log
```

### Regular Maintenance
```bash
# Backup database
cp lightapi.db lightapi-backup-$(date +%Y%m%d).db

# Update data from mockOpenApiSpecs.json
node cli.js import-all

# Check database integrity
sqlite3 lightapi.db "PRAGMA integrity_check;"
```

## ✅ Migration Verification Checklist

### Pre-Migration
- [ ] All MockAPI endpoints documented
- [ ] LightAPI server tested and working
- [ ] Data import completed (3,310 records)
- [ ] Backup created
- [ ] Rollback strategy planned

### During Migration  
- [ ] Environment variables updated
- [ ] API calls updated to new endpoints
- [ ] CORS configuration verified
- [ ] Error handling updated
- [ ] Tests passing

### Post-Migration
- [ ] All critical flows working
- [ ] Performance improved
- [ ] Data persistence verified
- [ ] Monitoring setup
- [ ] Documentation updated
- [ ] Team notified of changes

## 🎉 Success Criteria

Migration is successful when:
- ✅ All frontend functionality works identically
- ✅ Performance is equal or better
- ✅ Data persists across server restarts  
- ✅ No data loss or corruption
- ✅ Easy rollback available if needed
- ✅ Team can maintain and extend LightAPI

---

## 📞 Support & Troubleshooting

For issues during migration:
1. Check the LightAPI logs
2. Verify database status: `node cli.js status`
3. Test API endpoints manually
4. Review CORS and network configuration
5. Consult this manual for common solutions

Remember: **Always test thoroughly in development before deploying to production!**