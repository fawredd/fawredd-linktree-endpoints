# Requirement Doc — [TASK-FIX-002]: Fix Profile Update Persistence Issue

**Status:** APPROVED
**Author:** technical-ba
**Date:** 2026-04-10

## Business Context
Currently, when a user attempts to update their profile settings in the dashboard, the UI displays a "profile updated successfully" toast, but the changes are not persisted to the database. This creates a deceptive user experience and prevents users from managing their personal profile information.

## User Stories
- As an authenticated user, I want my profile changes to be saved correctly in the database when I click "Save Changes," so that my public profile reflects my current information.
- As a developer, I want to ensure that the database update logic is safe and correct, so that I can rely on the system state.

## Acceptance Criteria
- Given an authenticated user on the profile editor page, When they modify their display name, title, or description and click "Save Changes", Then the database is updated with the new values.
- Given a failed database update (e.g., database error), When the user clicks "Save Changes", Then the UI displays an error toast "Failed to update profile".
- Given a successful update, When the user refreshes the page, Then the updated values are correctly loaded from the database.
- The update logic must use secure parameterized queries and avoid `sql.unsafe` with string interpolation/concatenation.

## Data Model
The `profiles` table:
| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| id | integer | NO | Primary Key |
| name | varchar | NO | |
| title | varchar | YES | |
| description | text | YES | |
| slug | varchar | NO | Unique |
| clerk_id | varchar | NO | User isolation |

## API Contract Reference
Managed via Server Actions in `actions/dashboardActions.ts`.
Function: `editProfileAction(id: number, data: any)`
Persistence Layer: `lib/database.ts` -> `updateProfile(id, data, clerkId)`

## Open Questions
- None.
