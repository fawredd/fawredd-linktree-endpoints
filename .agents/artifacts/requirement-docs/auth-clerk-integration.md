# Requirement Doc — [TASK-AUTH-001]: Clerk Authentication Integration

**Status:** APPROVED
**Author:** technical-ba
**Date:** 2026-04-09

## Business Context
The application currently lacks authentication. Any data is publicly accessible and there is no "owner" relationship. Integrating Clerk will allow users to sign up, log in, and eventually manage their own Linktree profiles.

## User Stories
- As a **New User**, I want to sign up using email or social providers so that I can create my own Linktree profile.
- As a **Returning User**, I want to log in securely so that I can access my dashboard.
- As an **Owner**, I want my profile content to be protected from unauthorized edits.

## Acceptance Criteria
- Given a user is not logged in, When they try to access `/admin`, Then they should be redirected to the Clerk login page.
- Given a logged-in user, When they visit the app, Then their session should be active and accessible via Clerk hooks.
- Given the `profiles` table, When a new profile is created, Then it must be associated with the Clerk `user_id`.

## Proposed Data Model Changes (Schema Update)
*Note: Pending approval to modify database structure.*

| Table | Field | Type | Nullable | Notes |
|-------|-------|------|----------|-------|
| profiles | user_id | TEXT | No | Clerk's unique user identifier |

## Technical Implementation Plan
1. **Middleware:** Implement `clerkMiddleware` to protect `/dashboard` and `/api` (if any).
2. **User Creation:** Use Clerk Webhooks or sync on first login to ensure a record exists in the DB if needed.
3. **Data Scoping:** All database queries for the dashboard must include `WHERE user_id = ${clerkId}`.

## API Contract Reference
None yet (Next.js Server Actions used). 

## Open Questions RE-SOLVED
1. Should one user be allowed multiple profiles (slugs) or just one? **YES**
2. Do we need to migrate existing "unowned" profiles to a system user? **YES** (Migrated to `DEFAULT_ID`)

---

[SECURITY_REVIEW]
Reviewer: security-engineer
Date: 2026-04-09
Status: APPROVED_WITH_NOTES

Findings:
1. [Severity: Medium] — Data Isolation (IDOR). The current schema does not have user ownership.
   Recommendation: The proposed `user_id` column is mandatory. All repository functions must be updated to accept `userId` and include it in WHERE clauses.
2. [Severity: Low] — Clerk Webhooks. If used for sync, sign certificates must be verified using Svix.

Notes:
- Clerk Middleware should be configured to protect all routes under `/admin` and `/api/admin`.
