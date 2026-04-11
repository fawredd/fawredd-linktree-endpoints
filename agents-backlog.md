# Project Backlog: fawredd-linktree-endpoints

## Priority 1: Authentication & User Scoping
- [x] [TASK-AUTH-001] Design Clerk Integration Strategy (Technical BA) - **DONE**
- [x] [TASK-AUTH-002] Security Review: Clerk & Data Isolation (Security) - **DONE**
- [x] [TASK-AUTH-003] Update Database Schema for User ID (Requirement Doc Only) - **DONE**
- [x] [TASK-AUTH-004] Implement Clerk Middleware & UI - **DONE**

## Priority 2: Admin Dashboard
- [x] [TASK-DASH-001] Design Admin Dashboard Requirements (Technical BA) - **DONE**
- [x] [TASK-DASH-002] Design Dashboard UI Mockups (Frontend) - **DONE**
- [x] [TASK-DASH-003] Implement Manage Profiles CRUD - **DONE**
- [x] [TASK-DASH-004] Implement Manage Services/Links CRUD - **DONE**
- [x] [TASK-DASH-005] Implement Service Content Editing (Description, Images) (Technical BA) - **DONE**
- [x] [TASK-DASH-006] Implement Social Links CRUD (Technical BA) - **DONE**
- [x] [TASK-DASH-007] Responsive Dashboard UI (Mobile First) - **DONE**
- [x] [TASK-DASH-008] Fix Profile Links Sorting (Drag & Drop) - **DONE**
- [x] [TASK-AUTH-005] Design Multi-user Profile Management Requirements (Technical BA) - **DONE**
- [x] [TASK-AUTH-006] Security Review: Multi-user Permissions (Security) - **DONE**
- [x] [TASK-AUTH-007] Implement Multi-user Database Schema & Logic (Backend) - **DONE**
- [x] [TASK-AUTH-008] Implement Multi-user Management UI (Frontend) - **DONE**
- [x] [TASK-DASH-009] Implement Create New Profile Functionality (Backend + Frontend) - **DONE**
- [x] [TASK-DASH-010] Profile Image Upload & Appearance Customization (Vercel Blob) - **DONE**

## Priority 0: Critical Fixes
- [x] [TASK-TRIAGE-001] Triage: CI Failure — Build Check (PM) - **DONE**
- [x] [TASK-FIX-001] Resolve CI Failures (Lint, Typecheck, Build) (Full Stack) - **DONE**
- [x] [TASK-FIX-002] Fix Profile Update Persistence Issue (Backend) - **DONE**
- [x] [TASK-FIX-003] Fix Mobile Drag & Drop (Regression) (Frontend) - **DONE**




## Status Keys
- `DONE`: Completed and QA verified.
- `IN_PROGRESS`: Currently being worked on.
- `TODO`: In queue.
- `BLOCKED`: Waiting for input/clarification.

### CI Triage Details [TASK-TRIAGE-001]
- **Priority:** HIGH
- **Assignee:** Lead PM
- **Description:** 
  - CI Report: [.agents/artifacts/ci-reports/report-20260409.md](file:///c:/vscode/fawredd-linktree-endpoints/.agents/artifacts/ci-reports/report-20260409.md)
  - Failed steps: Lint, Typecheck, Build
  - Summary: Multiple errors in `ProfileEditor.tsx`, `database.ts`, and `dashboard-shell.tsx` (any types, missing "use client", and Clerk prop mismatch).
