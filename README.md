# Motwane Digital — headless Next.js frontend

Next.js (App Router, TypeScript, Tailwind CSS v4) frontend for **motwanedigital.com**.
All content comes from **WordPress + ACF Pro** through the REST API, fetched with **axios** (`lib/wp.ts`).
No content is stored in this codebase.

## Setup

```bash
npm install
cp .env.example .env.local   # already present on the dev machine
npm run dev                  # http://localhost:3000
```

### Fonts
Gotham is self-hosted. Put the licensed files in `public/fonts/`:
`Gotham-Book.ttf`, `Gotham-Medium.ttf`, `Gotham-Bold.ttf`.

### Environment variables
| Name | Purpose |
| --- | --- |
| `WP_BASE_URL` | WordPress site URL (also used to allow images in `next/image`) |
| `WP_API_URL` | WordPress REST base (`<site>/wp-json`) |
| `NEXT_PUBLIC_SITE_URL` | Public URL of this site |
| `REVALIDATE_SECRET` | Secret for `POST /api/revalidate` |

## How data flows
- `lib/wp.ts` — the only place that talks to WordPress. Functions use `"use cache"` +
  `cacheLife("minutes")` + `cacheTag("wp")`, so pages are static and refresh automatically.
- `POST /api/revalidate` with header `x-revalidate-secret: <REVALIDATE_SECRET>` refreshes all
  WordPress data immediately (optional body `{ "tag": "global-settings" }`).
- `types/wp.ts` — TypeScript shapes of the WordPress responses.
- `lib/navigation.ts` — header/footer menus (kept in code by decision).

## Forms
Every form posts to `app/api/forms/route.ts`, which validates with zod and forwards to
**Contact Form 7** (`/wp-json/contact-form-7/v1/contact-forms/{id}/feedback`).
**CFDB7** stores every entry in wp-admin → *Contact Forms*.
Form IDs are set in WordPress → Pages → *Global Settings* → "Popups & forms" / "Newsletter".
Field names in `lib/forms.ts` must match the CF7 form tags.

| Form | CF7 ID |
| --- | --- |
| Newsletter Subscription | 51 |
| Request Recap | 52 |
| Request Brochure | 53 |
| Get in Touch | 54 |

## WordPress structure
- Page **Global Settings** (`/global-settings`, ID 8) holds site-wide ACF fields:
  logo, contact details, regional offices, social links, newsletter, copyright, popup texts.
