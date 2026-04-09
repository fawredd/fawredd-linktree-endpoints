# TASK-AUTH-001: Clerk Authentication Integration

**Status:** DONE
**Owner:** Technical BA / Backend Engineer

## Implementation Details
- Installed `@clerk/nextjs`.
- Configured `middleware.ts` to protect `/dashboard`.
- Added `clerk_id` to `profiles` table.
- Migrated existing data to `clerk_id = 'user_3C8UoStuQKr96G2yOk3zMwMutGq'`.
- Updated `lib/database.ts` to scope queries by `clerk_id`.

## Verification
- [/dashboard](http://localhost:3000/dashboard) redirects to sign-in.
- Home page shows "Go to Dashboard" when signed in.
