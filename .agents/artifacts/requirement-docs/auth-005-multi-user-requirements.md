# Requirement Doc — [TASK-AUTH-005]: Multi-user Profile Management

**Status:** APPROVED
**Author:** technical-ba
**Date:** 2026-04-10

## Business Context
Currently, only the creator of a Linktree profile (the owner) can manage its content, social links, and services. Business requirements have evolved to allow multiple users to manage a single profile. A profile owner should be able to grant management access to other users by providing their email address.

## User Stories
- As a profile owner, I want to add a collaborator's email to my profile, so they can help manage its content.
- As a collaborator, I want to see shared profiles in my dashboard, so I can manage them alongside my own.
- As a profile owner, I want to remove a collaborator's access, so they can no longer manage my profile.

## Acceptance Criteria
- Given I am the profile owner, When I navigate to the profile settings, Then I should see an option to "Manage Collaborators".
- Given I am the profile owner, When I enter a valid email address and click "Add", Then that email should be stored as an authorized manager for the profile.
- Given I am a collaborator (logged in with an email that was added to a profile), When I view my dashboard, Then that profile should appear in my list.
- Given I am a collaborator, When I attempt to edit a shared profile, Then the system should allow me to perform CRUD operations on services and social links.
- Given I am a collaborator, When I attempt to add another collaborator to a shared profile, Then the system should DENY access (only the owner can manage collaborators).

## Data Model
### Table: `profile_managers`
| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| id | SERIAL | No | Primary Key |
| profile_id | INTEGER | No | Foreign Key to `profiles.id` |
| email | TEXT | No | Email of the authorized manager |
| created_at | TIMESTAMP | No | Default: now() |

### Table: `profiles` (Existing)
| Field | Type | Nullable | Notes |
|-------|------|----------|-------|
| clerk_id | TEXT | No | Original owner (Super admin of the profile) |

## API Contract Reference
- [collaborators-api.yaml](file:///.agents/artifacts/api-docs/collaborators-api.yaml)

## Open Questions
1. Should collaborators be able to delete the entire profile? (Assumed NO, only owner should delete profile).
2. Should we limit the number of collaborators? (Assumed NO for now).
3. Should we validate if the email exists in Clerk before adding? (Assumed NO, we just store the email and verify upon login).

---

## SECURITY_REVIEW — [APPROVED]
**Priority:** High
**Reviewer:** security-engineer

### Observations
1. **Permission Escalation:** Ensure that `profile_managers` cannot add other managers. The system must strictly distinguish between the "Owner" (defined by `profiles.clerk_id`) and "Collaborators" (defined in `profile_managers`).
2. **Identity Verification:** Access control should be based on the primary email address verified by Clerk.
3. **Audit Trail:** (Optional but recommended) Log who made which changes.

### Mitigation Strategy
- Implement a helper function `isAuthorizedManager(profileId, userId, userEmail)` that checks both the owner and the collaborator table.
- Use this helper in all Server Actions.
- Explicitly check for "Owner" status before allowing any modification to the collaborators list.

### Approval Status
**STATUS: APPROVED**
