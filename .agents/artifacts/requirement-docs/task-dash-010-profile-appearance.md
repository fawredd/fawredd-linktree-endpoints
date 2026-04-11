# Requirement Doc — TASK-DASH-010: Profile Image Upload & Appearance Customization

**Status:** APPROVED
**Author:** technical-ba
**Date:** 2026-04-10

---

## Business Context

Currently when a user creates a new profile, they cannot:
- Upload a profile avatar image or a profile hero (banner) image.
- Select a background color for their profile page.
- Select a border color for profile link cards.
- Select a font color for profile text.

These customization features are critical for differentiation and brand identity on a Linktree-style platform. Images must be optimized for web performance using WebP conversion via Vercel Blob storage.

---

## User Stories

- **US-01:** As a profile owner, I want to upload a profile avatar image so that visitors recognize me visually.
- **US-02:** As a profile owner, I want to upload a hero banner image so that my profile page has a branded header.
- **US-03:** As a profile owner, I want to pick a background color for my profile page so that it reflects my brand.
- **US-04:** As a profile owner, I want to pick a border color for my link cards so that my profile has a cohesive style.
- **US-05:** As a profile owner, I want to pick a font color for my profile text so that it is readable and on-brand.
- **US-06:** As a visitor, I want to see the profile's custom colors and images applied on the public profile page.

---

## Acceptance Criteria

- **AC-01:** Given the profile editor is open, when the user clicks "Upload Profile Image", then a file picker opens accepting images only (jpg, png, gif, webp), the image is converted to WebP and uploaded via Vercel Blob, and `profile_image_url` is saved in the database.
- **AC-02:** Given the profile editor is open, when the user clicks "Upload Hero Image", then a file picker opens accepting images only, the image is converted to WebP and uploaded via Vercel Blob, and `hero_image_url` is saved.
- **AC-03:** Given the profile editor is open, when the user interacts with the Background Color picker, the selected hex color is saved to `background_color` in the database.
- **AC-04:** Given the profile editor is open, when the user interacts with the Border Color picker, the selected hex color is saved to `border_color` in the database.
- **AC-05:** Given the profile editor is open, when the user interacts with the Font Color picker, the selected hex color is saved to `font_color` in the database.
- **AC-06:** Given a profile page is viewed publicly, when colors are set, the background, borders, and font colors are applied via inline CSS variables or direct styles.
- **AC-07:** Given a profile page is viewed publicly, when a profile image is set, it is displayed in the avatar section; when the hero image is set, it is displayed as the banner.
- **AC-08:** The dashboard live preview panel reflects all color and image changes in real time.
- **AC-09:** Image upload shows a loading spinner during upload. On success, a toast message is shown.
- **AC-10:** If file upload fails, an error toast is shown and no partial data is saved.

---

## Data Model

### Database Migration: `006_add_appearance_to_profiles.sql`

| Field | Type | Nullable | Default | Notes |
|-------|------|----------|---------|-------|
| `background_color` | VARCHAR(7) | YES | NULL | Hex color e.g. `#1a1a2e` |
| `border_color` | VARCHAR(7) | YES | NULL | Hex color e.g. `#6366f1` |
| `font_color` | VARCHAR(7) | YES | NULL | Hex color e.g. `#ffffff` |

> `profile_image_url` and `hero_image_url` already exist in the schema.

### Updated `Profile` TypeScript Interface

Add fields to `lib/database.ts`:
```ts
background_color: string | null
border_color: string | null
font_color: string | null
```

---

## Image Upload Architecture

- **Storage:** Vercel Blob (`@vercel/blob`)
- **Conversion:** Browser-side WebP conversion using `canvas.toBlob({ type: 'image/webp', quality: 0.85 })` before upload
- **API Route:** `POST /api/upload-image` — receives a FormData with the image file and returns the Blob URL
- **Auth:** Route is protected by Clerk `auth()` server-side check
- **File size limit:** 5MB per image (validated client-side and server-side)
- **Accepted MIME types:** `image/jpeg`, `image/png`, `image/gif`, `image/webp`

---

## API Contract Reference

See: `.agents/artifacts/api-docs/profile-appearance-api.yaml`

---

## Open Questions

- **Resolved:** Image storage = Vercel Blob. WebP conversion = client-side canvas API.
- **Resolved:** Color UX = native `<input type="color">` with hex value display.
- **Pending env var:** `BLOB_READ_WRITE_TOKEN` must be added to `.env` by the stakeholder before the upload functionality works in development/production.

---

## Dependencies / Notes

- `@vercel/blob` must be installed: `pnpm add @vercel/blob`
- `BLOB_READ_WRITE_TOKEN` env var required (Vercel Blob dashboard)
- `next.config.ts` must whitelist `*.public.blob.vercel.storage` in `images.remotePatterns`
- Color pickers default to sensible values (`#0f172a` for background, `#6366f1` for borders, `#ffffff` for font) when no value stored
