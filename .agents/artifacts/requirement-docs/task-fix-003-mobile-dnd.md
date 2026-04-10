# Requirement Doc: [TASK-FIX-003] Fix Mobile Drag & Drop (Regression)

## Status: [APPROVED]
## Assignee: Frontend Engineer

## 1. Overview
The drag and drop functionality for reordering profile links in the dashboard works on desktop but is reported as non-functional on mobile devices. This is a regression from the planned responsive features in TASK-DASH-008.

## 2. User Stories
- As a mobile user, I want to be able to reorder my links using touch drag & drop so that I can manage my profile on the go.

## 3. Acceptance Criteria
- [ ] Users can drag and drop links on touch devices (mobile/tablet).
- [ ] Dragging on mobile should not interfere with normal page scrolling (unless the handle is held).
- [ ] Visual indicators (shadow, opacity) should appear during the drag operation on mobile.
- [ ] The updated order must be persisted to the database via the existing `reorderServicesAction`.

## 4. Technical Specifications
- Update `components/profile-editor.tsx`.
- Configure `PointerSensor` with an `activationConstraint` (e.g., `distance: 8`) to allow for both scrolling and dragging.
- Alternatively, implement `TouchSensor` alongside `PointerSensor` if needed.
- Ensure `attributes` and `listeners` from `useSortable` are properly applied to the drag handle.

## 5. Security Review
- No new API endpoints or data structures are introduced. Existing security measures in `reorderServicesAction` are sufficient.

## 6. Security Approval
[SECURITY_REVIEW]
Status: [APPROVED]
Notes: The proposed changes are limited to frontend sensor configuration for drag and drop. No changes to data handling or authentication are required.

