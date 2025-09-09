# Claude Code Project Context

## Development Philosophy
This project follows a safe development approach when migrating from static to dynamic content.

## Current Status - MIGRATION COMPLETE ✅
- ✅ **Previously everything was static text** → Now fully dynamic with comprehensive data
- ✅ **Made everything dynamic** → Successfully migrated all frontend connections  
- ✅ **Solved all errors** → Complete backend integration working
- ✅ **Implemented safe development practices** → Production-ready with proper API structure

## Migration Achievement Summary
**BEFORE:** Limited `mockDb.json` with 1 user, minimal data
**AFTER:** Comprehensive database with 3,310+ records across 55 collections

✅ **Frontend Migration:** All API calls updated from `/api/mock/*` to `/api/data/*`
✅ **Authentication:** Full user system with rich profile data
✅ **Data Quality:** Tasks (30), Contacts (80), Projects (4), Dashboard widgets, etc.
✅ **Vercel Ready:** Serverless functions with persistent storage abstraction

## Safe Development Strategy

### Repository & Branch Management
- Use 'develop' branch from master for integration
- Create feature branches for each component migration: `feature/dynamic-[component]`
- Implement GitFlow workflow:
  * master: production-ready code
  * develop: integration branch  
  * feature/*: individual features
  * hotfix/*: emergency fixes

### Rollback Strategy
- Tag stable versions before major changes
- Keep static fallbacks for critical components
- Implement feature flags for gradual rollout
- Database migrations with rollback scripts

### Testing Requirements
- Unit tests for dynamic content components
- Integration tests for API endpoints
- E2E tests for critical user flows
- Performance testing for dynamic vs static comparison

### Migration Approach
**Phase 1:** Non-critical components (FAQ, features)
**Phase 2:** User-facing content (navigation, messages)  
**Phase 3:** Core functionality (products, contacts, tasks)
**Phase 4:** Authentication and admin features

### Error Handling Standards
- Comprehensive error logging
- Fallback to static content on dynamic errors
- Real-time monitoring dashboards
- Automated alerts for critical failures

### Deployment Pipeline
- Staging environment testing required
- Blue-green deployments
- Automated rollback triggers
- Health checks before traffic routing

## Commands
- Build: `npm run build`
- Dev: `npm run dev` (starts Next.js with API routes)
- Dev Backend Only: `npm run dev:backend` (starts Express server)
- Dev Full Stack: `npm run dev:full` (starts both Next.js and Express)
- Initialize Database: `npm run init-db`
- Test: Check README for testing approach

## API Endpoints (Vercel Compatible) - FULLY MIGRATED ✅
### ⚠️ Data Transfer API (Admin Only)
- GET `/api/transfer` - Status and available data counts from mockOpenApiSpecs.json
- POST `/api/transfer/all` - **Transfer ALL data types** (55 collections, 3,310+ records)
- POST `/api/transfer/users` - Process users (1 admin user)
- POST `/api/transfer/products` - Process products (20 ecommerce products)
- POST `/api/transfer/tasks` - Process tasks (30 tasks)
- POST `/api/transfer/contacts` - Process contacts (80 contacts)

### 🚀 Production Data API (Frontend Connected)
- GET `/api/data/users` - **Users with comprehensive data** (MIGRATED ✅)
- GET `/api/data/contacts` - **80 rich contacts** (MIGRATED ✅)
- GET `/api/data/tasks` - **30 full tasks** (MIGRATED ✅)
- GET `/api/data/[type]` - **Any of 55 data types** (MIGRATED ✅)

### 🔐 Authentication API (Updated)
- GET `/api/data/auth/user/[id]` - **Rich user by ID** (MIGRATED ✅)
- GET `/api/data/auth/user-by-email/[email]` - **Rich user by email** (MIGRATED ✅)

### 📊 Database Management API
- GET `/api/database/status` - Database status with all collection counts
- GET `/api/database/users` - Direct database access to users
- GET `/api/database/contacts` - Direct database access to contacts  
- GET `/api/database/tasks` - Direct database access to tasks

### Complete Data Collections Available (55 types):
**Core Data:** users, contacts, tasks, notifications
**Calendar:** calendar_events, calendar_labels  
**Mailbox:** mailbox_mails (100), mailbox_filters, mailbox_labels, mailbox_folders
**Scrumboard:** scrumboard_members (20), scrumboard_lists, scrumboard_cards, scrumboard_boards
**E-commerce:** ecommerce_products (20), ecommerce_orders (20)
**Academy:** academy_courses (18), academy_course_steps, academy_categories
**UI Icons:** ui_material_icons (1,792), ui_heroicons_icons (324), ui_feather_icons (282)
**Profile:** profile_albums, profile_media_items, profile_activities, profile_posts
**Help Center:** help_center_guides (27), help_center_faqs (29), help_center_guide_categories
**Messenger:** messenger_contacts (80), messenger_messages (25), messenger_chat_list
**Files:** file_manager_items (21), notes_notes (15)
**Dashboard:** project_dashboard_widgets, crypto_dashboard_widgets, finance_dashboard_widgets
**Settings:** app_account_settings, app_notification_settings, app_security_settings, app_team_members (7)
**Reference:** countries (235), ai_image_gen_presets (12), ai_image_gen_items (9)

## Success Criteria
- Zero downtime during migration
- Ability to rollback within 5 minutes
- Performance equal to or better than static version
- All errors properly handled with fallbacks