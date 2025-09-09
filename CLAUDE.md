# Claude Code Project Context

## Development Philosophy
This project follows a safe development approach when migrating from static to dynamic content.

## Current Challenge
- Previously everything was static text
- Made everything dynamic 
- Now experiencing errors that cannot be solved with current efforts
- Need safe development practices with proper branching strategy

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
- Dev: `npm run dev`
- Test: Check README for testing approach

## Success Criteria
- Zero downtime during migration
- Ability to rollback within 5 minutes
- Performance equal to or better than static version
- All errors properly handled with fallbacks