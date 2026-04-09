# Requirement Doc — [TASK-DASH-001]: Admin Dashboard Implementation

**Status:** APPROVED
**Author:** technical-ba
**Date:** 2026-04-09

## Business Context
Users need a centralized interface to manage their Linktree "endpoints" (profiles) and the content (services, social links) displayed on them. 

## User Stories
- As an **Owner**, I want to see a list of my profiles so that I can choose which one to edit.
- As an **Owner**, I want to update my profile metadata (name, title, images) so that my landing page looks professional.
- As an **Owner**, I want to add/edit/delete services and social links so that my audience has up-to-date links.

## Acceptance Criteria
- Given a logged-in user, When they navigate to `/dashboard`, Then they should see their primary profile.
- Given the Dashboard UI, When a user clicks "Edit" on a profile, Then a form should appear with existing data populated.
- Given a Service entry, When the user updates the title or URL, Then the changes should reflect immediately on the public profile page.

## Proposed Data Model
No new tables required. Operations will CRUD existing `profiles`, `services`, and `social_links` tables.

## UI Requirements (Aesthetics)
- **Aesthetic:** Modern, premium, using the project's existing color palette (dark mode preferred).
- **Navigation:** Sidebar or top-bar for switching between Profile, Services, and Settings.
- **Feedback:** Use `sonner` for toast notifications on save/error.

## API Contract Reference
New Server Actions will be required:
- `upsertProfile(data: ProfileInput)`
- `upsertService(data: ServiceInput)`
- `deleteService(id: number)`
- `upsertSocialLink(data: SocialLinkInput)`
- `deleteSocialLink(id: number)`

## Open Questions RE-SOLVED
1. Should we support drag-and-drop reordering for services/links in the dashboard? **YES**
2. Do we want a "Preview" mode in the dashboard (side-by-side or mobile mockup)? **NO** (Simplified preview implemented in sidebar).

---

[SECURITY_REVIEW]
Reviewer: security-engineer
Date: 2026-04-09
Status: APPROVED

Findings:
1. [Severity: Low] — CSRF protection. Next.js Server Actions include built-in CSRF protection.
2. [Severity: Low] — Input Sanitization. Ensure HTML content is not accepted unless explicitly required (e.g., custom descriptions).

Notes:
- Dashboard should implement a robust error handling strategy to avoid leaking database schema details in toast notifications.
