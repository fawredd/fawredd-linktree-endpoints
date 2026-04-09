# Requirement Doc: [TASK-DASH-008] Fix Profile Links Sorting (Drag & Drop)

## Status: [APPROVED]
## Assignee: Frontend Engineer

## 1. Overview
The sorting feature for profile links via drag & drop is currently not functional. The UI has a grab handle icon, but the logic to handle the drag events and update the order in the database is missing.

## 2. User Stories
- As an admin user, I want to reorder my links by dragging them so that I can control their priority on my profile page.

## 3. Acceptance Criteria
- [ ] Users can drag and drop links in the `ProfileEditor` to change their order.
- [ ] The updated order should be visually reflected immediately.
- [ ] The new order should be persisted to the database.
- [ ] The sorting should work on both desktop and mobile (touch support).

## 4. Technical Specifications
- Install and use `@dnd-kit/core`, `@dnd-kit/sortable`, and `@dnd-kit/utilities` for drag and drop functionality.
- Update `ProfileEditor` component to wrap the link list with `DndContext` and `SortableContext`.
- Implement `onDragEnd` handler to update the local state and call a Server Action to persist the new order.
- Create a new Server Action `updateLinksOrderAction` (if not exists) or enhance `updateServiceAction` to handle multiple updates.
- The `services` table in the database already has a `sortOrder` column (integer).

## 5. Security Review
- Ensure that the `updateLinksOrderAction` validates that the user owns the profile and the links being reordered.
