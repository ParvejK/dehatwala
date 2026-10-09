# Image dimensions — Dehatwala

Upload sizes for every image the website renders. Measured from the frontend
code, not estimated.

**Two rules that cause most of the problems we see:**

1. **Match the aspect ratio.** Every image is rendered with `object-cover`,
   which centre-crops anything that does not match. A wide photo in a circular
   slot shows the middle of the photo, not the subject.
2. **Upload at 2× the rendered size.** The "upload" column already accounts for
   this, so retina screens stay sharp.

All files go under `public/storage/<folder>/`. The API returns a **bare
filename**; the frontend builds the URL.

---

## 1. Client Says — customer stories (home page)

| | |
|---|---|
| Field | `clients.client_image` |
| Folder | `client` |
| **Upload** | **400 × 400 px** |
| **Ratio** | **1:1 — square, required** |
| Rendered | 44 × 44 px, circular |
| Format | JPG or WebP |
| Max file size | 150 KB |

Crop to a square with the face centred before uploading.

## 2. Labour Testimonials — "हमारे श्रमिकों का अनुभव"

| | |
|---|---|
| Field | `labour_testimonials.labour_image` |
| Folder | `labour` |
| **Upload** | **400 × 400 px** |
| **Ratio** | **1:1 — square, required** |
| Rendered | 56 × 56 px, circular |
| Format | JPG or WebP |
| Max file size | 150 KB |

## 3. Hero / Slider

The home hero currently uses a **static file** shipped with the frontend
(`public/images/hero-image.png`), not the API. The slider endpoints below exist
but are only rendered on the instant/permanent service pages.

| | Hero (static) | Slider (`get-sliders`) |
|---|---|---|
| Field | — | `sliders.slider_img` |
| Folder | — | `slider` |
| **Upload** | **1400 × 1200 px** | **1600 × 900 px** |
| **Ratio** | ~7:6 (portrait-ish) | 16:9 |
| Rendered | fills a ~640 × 560 panel | full-width banner |
| Format | PNG (has transparency) or JPG | JPG or WebP |
| Max file size | 400 KB | 300 KB |

The hero is corner-clipped on two corners, so **keep the subject centred** —
roughly 10% is cut from the top-left and bottom-right.

Slogan slider (`slogan_with_sliders.slogan_image`, folder `sloganwithslider`)
is rendered as a CSS background: **1600 × 900 px**, 16:9.

## 4. Services

| | Card | Listing / detail banner |
|---|---|---|
| Field | `services.service_image` | same image |
| Folder | `service` | `service` |
| **Upload** | **760 × 420 px** | **1600 × 700 px** |
| **Ratio** | **16:9** | wide banner |
| Rendered | 208 px tall, full card width | full-bleed |
| Format | JPG or WebP | JPG or WebP |
| Max file size | 200 KB | 350 KB |

One image is used in both places. If you can only supply one, use
**1600 × 900 (16:9)** — it downscales cleanly to the card and still fills the
banner.

Also appears as an **80 × 80 thumbnail** on dashboard booking cards, cropped
square from the centre.

## 5. Blog

| | Card / listing | Detail page |
|---|---|---|
| Field | `blogs.blogimg` | same image |
| Folder | `blog` | `blog` |
| **Upload** | **1200 × 750 px** | **1600 × 900 px** |
| **Ratio** | **16:10** | 16:9 |
| Rendered | 16:10 card | full content width, natural height |
| Format | JPG or WebP | JPG or WebP |
| Max file size | 250 KB | 350 KB |

The card is strictly **16:10**. A 16:9 image loses a little top and bottom;
anything squarer loses the sides.

## 6. Categories

| | |
|---|---|
| Field | `categories.cat_img` |
| Folder | `category` |
| **Upload** | **800 × 1000 px** |
| **Ratio** | **4:5 — portrait** |
| Rendered | fills a 400 px tall tile |
| Format | JPG or WebP |
| Max file size | 250 KB |

These tiles are **portrait**, and a dark gradient covers the bottom third for
the label — keep the subject in the **upper two thirds**.

## 7. Customer profile photo

| | |
|---|---|
| Field | `users.profile_img` |
| Folder | `user` |
| **Upload** | **400 × 400 px** |
| **Ratio** | **1:1 — square** |
| Rendered | 80 px (settings), 56 px (sidebar), 48 px (menu), 32 px (header) |
| Format | JPG, PNG or WebP |
| Max file size | **2 MB (enforced by the API)** |

One 400 × 400 asset covers every place it appears.

## 8. SEO / social share image

| | |
|---|---|
| Field | `seo_meta.og_image` and per-record `og_image` |
| Folder | `seo` |
| **Upload** | **1200 × 630 px** |
| **Ratio** | **1.91:1 — required by Facebook, WhatsApp, LinkedIn, X** |
| Rendered | not shown on the site; used in link previews |
| Format | JPG or PNG |
| Max file size | 300 KB (hard limit 5 MB, but previews time out) |

**1200 × 630 is not a suggestion** — it is what the social crawlers expect.
Anything squarer is cropped to a small thumbnail; anything under 200 × 200 is
ignored entirely. Keep text well inside the middle, as some platforms crop the
edges.

---

## Media & News

| Section | Upload | Ratio |
|---|---|---|
| Publication logos | 400 × 200 px | 2:1, transparent PNG |
| News article cover | 1200 × 750 px | 16:10 |
| Video thumbnail | 1280 × 720 px | 16:9 |
| Event photo | 1200 × 800 px | 3:2 |

## Careers

| Section | Upload | Ratio |
|---|---|---|
| Opening cover (optional) | 1200 × 630 px | 1.91:1 |

---

## Quick reference

| Ratio | Used by |
|---|---|
| **1:1** (400 × 400) | client avatars, labour testimonials, profile photos |
| **16:9** (1600 × 900) | services, video thumbnails, sliders |
| **16:10** (1200 × 750) | blog cards, news covers |
| **4:5** (800 × 1000) | category tiles |
| **1.91:1** (1200 × 630) | every social share image |

## Format guidance

- **WebP** wherever possible — roughly 30% smaller than JPG at the same quality.
- **PNG** only when transparency is needed (logos, the hero cut-out).
- Compress before uploading. A 2 MB photo in a 56 px circle costs the visitor
  the full 2 MB.
- **Avoid spaces and brackets in filenames.** Files such as
  `Georgetown Part II - 5_gallery (3).png` work, but only because the frontend
  URL-encodes them. `georgetown-part-2-5.png` is safer.
