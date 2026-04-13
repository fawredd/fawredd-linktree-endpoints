# Requirement Document: SEO Optimization [APPROVED]

**Task ID:** TASK-SEO-001, TASK-SEO-002
**Title:** Implement SEO Optimization using Next.js Built-in Functionalities
**Role:** Technical BA
**Status:** [APPROVED]

## Overview
The stakeholder requested that all user profiles and links be optimized for Search Engine Optimization (SEO). Currently, profile pages generate a generic title (`${profileSlug} home page`) and lack meta descriptions, Open Graph (OG) tags, canonical URLs, and other necessary meta information to correctly display on social media formats.

We will leverage Next.js native SEO APIs to fix this.

## Requirements

### 1. Dynamic Metadata on Profile Pages (`app/[profileSlug]/page.tsx`)
- Enhance the `generateMetadata` function.
- It must fetch the `profile` from the database.
- Set `title` to the profile's `title` (or a fallback like `${profileSlug} | Fawredd`).
- Set `description` to the profile's `description`.
- Output **Open Graph (OG) tags** (`og:title`, `og:description`, `og:url`, `og:type` set to `"website"`).
- Output **Twitter Card tags** (`twitter:card` set to `"summary_large_image"`, `twitter:title`, `twitter:description`).
- Produce a `canonical` URL link.

### 2. Global Metadata (`app/layout.tsx`)
- Refine global metadata with a proper base template using Next.js `metadataBase` to allow profiles to resolve relative image URLs.
- Update global open graph fallbacks.

### 3. Semantic HTML & Accessibility 
- Ensure that `<h1>` is correctly utilized in `app/[profileSlug]/page.tsx` (already present, but verify accessibility attributes).
- Profile images and icons must have meaningful `alt` text.

### 4. Sitemap and Robots.txt (Optional but Recommended)
- Provide a `robots.txt` file (using `app/robots.ts`) allowing indexing.
- Generate a dynamic `sitemap.ts` to expose all active profiles to search engine crawlers (if public viewing is intended to be indexed without auth). *Note: Since this is user-generated content, an initial basic `robots.ts` and `sitemap.xml` listing the homepage is sufficient until dynamic generation is prioritized.*

## Acceptance Criteria
**Scenario 1: Web Crawlers loading a User Profile**
- Given a user profile exists with `title="My Cool Brand"` and `description="Welcome to my brand links"`
- When a web crawler accesses `/[profileSlug]`
- Then the `<head>` must contain:
  - `<title>My Cool Brand</title>`
  - `<meta name="description" content="Welcome to my brand links" />`
  - `<meta property="og:title" content="My Cool Brand" />`
  - `<meta property="og:description" content="Welcome to my brand links" />`

**Scenario 2: Fallback for empty profiles**
- Given a user profile has no description
- When a web crawler accesses `/[profileSlug]`
- Then the `<meta name="description">` should fallback to a generic message or be omitted gracefully without causing a build or runtime error.

## Notes for Frontend Developer
- Please refer to [Next.js Documentation on Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- Implement this purely using Next.js `generateMetadata` and `Metadata` types. No third-party packages (like `next-seo`) should be necessary.

---

[SECURITY_REVIEW]
Status: [APPROVED]
Reviewer: Security Engineer
Notes: Implementing Metadata generation poses minimal risk. Ensure database fetch queries in `generateMetadata` are protected against SQL injection (already handled by Drizzle ORM parameters). Exposing user profile titles and descriptions to crawlers is the intended behavior of a public Linktree-like endpoint. No sensitive PII should be exposed in metadata tags.
