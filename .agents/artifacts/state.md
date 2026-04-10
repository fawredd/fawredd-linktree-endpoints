# Project State: fawredd-linktree-endpoints

**Status:** ACTIVATED
**Phase:** IMPLEMENTATION
**Last Updated:** 2026-04-10

## Tech Stack
- **Framework:** Next.js 15.5.9 (App Router)
- **Language:** TypeScript 5.9.3
- **Database:** PostgreSQL (Neon Serverless)
- **Auth:** Clerk
- **Styling:** Tailwind CSS 4.1.18
- **UI Components:** Radix UI

## Architecture Overview
- **Frontend:** Server Components by default. Dynamic routing for profiles (`/[profileSlug]`) and services (`/[profileSlug]/[slug]`).
- **Backend:** Server Actions for data fetching. SQL-first approach with `neon-serverless`.
- **Database Schema:**
  - `profiles`: Core identity and landing page metadata.
  - `services`: Extended content/links with custom pages.
  - `social_links`: Quick links to social platforms.
  - `profile_managers`: Links multiple users to a single profile via email.

## Active Tasks
- [x] Initial Discovery Phase Checkpoint
- [x] Requirement Doc: Multi-user Profile Management (TASK-AUTH-005)
- [x] Security Review: Multi-user Permissions (TASK-AUTH-006)
- [x] Implement Multi-user Database Schema & Logic (TASK-AUTH-007)
- [x] Implement Multi-user Management UI (TASK-AUTH-008)
- [x] Resolve CI Quality Gate (Lint, Typecheck, Build)

## Current Context
Successfully implemented Multi-user Profile Management. Profiles can now be shared with collaborators via email. Authorization logic has been hardened across all Server Actions to ensure that only the owner can manage collaborators, while both owners and collaborators can manage profile content. Added a "profile_managers" table to handle shared access. The UI now supports adding/removing collaborators from the profile editor and displays a "SHARED" badge in the dashboard for accessible profiles not owned by the user. Build, lint, and typecheck are all passing.
