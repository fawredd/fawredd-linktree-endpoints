# Requirement Doc: [TASK-DASH-007] Responsive Dashboard UI (Mobile First)

## Status: [APPROVED]
## Assignee: Frontend Engineer

## 1. Overview
The current Admin Dashboard has a static layout that does not adapt to different screen sizes. The goal is to implement a responsive, mobile-first design for the dashboard shell and its pages.

## 2. User Stories
- As an admin user, I want to access my dashboard from my phone so that I can manage my links on the go.
- As an admin user, I want the sidebar to be accessible but non-intrusive on small screens.

## 3. Acceptance Criteria
- [ ] The dashboard sidebar should be hidden on mobile screens (sm/md) and accessible via a hamburger menu.
- [ ] On mobile, the hamburger menu should open a sliding drawer (Sheet) containing the navigation links.
- [ ] The main content area should have appropriate padding and margins for mobile devices.
- [ ] The profile grid on the dashboard index page should adapt to screen size (1 column on mobile, 2 on tablet, 3 on desktop).
- [ ] The `ProfileEditor` should stack columns vertically on mobile (Configuration on top, Preview hidden or toggleable).

## 4. Technical Specifications
- Use Tailwind CSS responsive utilities (`sm:`, `md:`, `lg:`, `xl:`).
- Use `lucide-react` icons for the hamburger menu.
- Ensure the `DashboardShell` uses a flexible layout (e.g., `flex-col` on mobile, `flex-row` on desktop).

## 5. Security Review
- No security implications for UI responsiveness.
