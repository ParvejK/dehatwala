# Media & News — database schema + API contract

Spec for the endpoints behind `/media-news` and its sub-pages. Nothing in this
area exists yet: there are no routes in `routes/api.php` and no tables for
publications, articles, videos or photos.

The hero banner stays hard-coded in the frontend. **Everything below it is
dynamic.**

---

# Part 1 — Database schema

Four tables. Laravel migrations, following the existing `services` table style.

## `publications` — the "Featured In" logo strip

```php
Schema::create('publications', function (Blueprint $table) {
    $table->id();
    $table->string('name', 150);                       // "The Economic Times"
    $table->string('logo')->nullable();                // filename only
    $table->string('website_url')->nullable();
    $table->integer('sort_order')->default(0);
    $table->enum('status', ['0', '1'])->default('1');
    $table->softDeletes();
    $table->timestamps();
});
```

## `media_news` — press coverage articles

```php
Schema::create('media_news', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->string('slug')->unique();                  // drives /media-news/news/{slug}
    $table->string('tag', 60);                         // Business | Startup | Impact
    $table->string('source', 150);                     // publication name
    $table->date('published_at');
    $table->string('read_time', 30)->nullable();       // "5 min read"
    $table->string('image');                           // filename only
    $table->string('external_url')->nullable();        // original article
    $table->string('excerpt', 500);
    $table->string('lead', 500);                       // bold opening paragraph
    $table->text('body');                              // one paragraph per line
    $table->string('quote_text', 500)->nullable();
    $table->string('quote_author', 150)->nullable();
    $table->enum('status', ['0', '1'])->default('1');
    $table->softDeletes();
    $table->timestamps();
});
```

## `media_videos` — videos & interviews

```php
Schema::create('media_videos', function (Blueprint $table) {
    $table->id();
    $table->string('title');
    $table->string('subtitle')->nullable();
    $table->string('channel', 150);                    // drives the channel filter
    $table->string('duration', 12)->nullable();        // "04:35"
    $table->string('thumbnail');                       // filename only
    $table->string('video_url');                       // full YouTube URL
    $table->date('published_at');
    $table->enum('status', ['0', '1'])->default('1');
    $table->softDeletes();
    $table->timestamps();
});
```

## `media_photos` — event gallery

```php
Schema::create('media_photos', function (Blueprint $table) {
    $table->id();
    $table->string('image');                           // filename only
    $table->string('alt');                             // accessibility text, required
    $table->string('caption');
    $table->string('location')->nullable();
    $table->date('taken_at');
    $table->integer('sort_order')->default(0);
    $table->enum('status', ['0', '1'])->default('1');
    $table->softDeletes();
    $table->timestamps();
});
```

---

# Part 2 — API endpoints

## Conventions

Follow the existing `FrontController` style so these feel native:

- Base path `/api`, responses are JSON.
- Success: HTTP `200` with `{ "success": true, "<key>": [...] }`.
- Not found: HTTP `404` with `{ "success": false, "message": "..." }`.
- Field names in `snake_case`.
- Dates as `YYYY-MM-DD` (the frontend formats them for display). Use a real
  `date` column, not a string.
- Only rows with `status = '1'` are returned, ordered newest first unless a
  `sort_order` column is specified.
- **Images:** return the bare filename, exactly like `services.service_image`.
  The frontend builds the URL as `${VITE_IMAGE_PATH_URL}/<folder>/<filename>`.
  The folder per endpoint is given below.
  > If you also return an `image_link`, it must point at the same host as
  > `VITE_IMAGE_PATH_URL`. The existing `services.image_link` points at
  > `dehatwala.com` regardless of environment, so the frontend ignores it.

Two naming bugs already in the API that should **not** be repeated here:
`GET /get-city/{id}` returns its array under `cites`, and `POST /search-services`
expects `keyword` while the old frontend sent `kyword`. Please keep these new
keys spelled consistently.

---

## 1. `GET /media/publications`

"Featured In" — the logo strip. Used on `/media-news`.

```json
{
  "success": true,
  "publications": [
    {
      "id": 1,
      "name": "The Economic Times",
      "logo": "1735493498economic-times.png",
      "website_url": "https://economictimes.indiatimes.com/",
      "sort_order": 1
    }
  ]
}
```

| Field | Type | Notes |
| --- | --- | --- |
| `id` | int | |
| `name` | string | Shown as text today; a `logo` image is preferred |
| `logo` | string, nullable | Image folder: `publication` |
| `website_url` | string, nullable | Optional outbound link |
| `sort_order` | int | Ascending; controls strip order |

**Admin needs:** name, logo upload, website URL, sort order, status.

---

## 2. `GET /media/news`

Press coverage list. Used on `/media-news` (first 3) and `/media-news/news` (all).

```json
{
  "success": true,
  "news": [
    {
      "id": 1,
      "slug": "solving-indias-blue-collar-hiring-challenge",
      "title": "Dehatwala is solving India's blue-collar hiring challenge",
      "tag": "Business",
      "source": "YourStory",
      "published_at": "2025-05-12",
      "read_time": "5 min read",
      "image": "1735493498yourstory-cover.png",
      "external_url": "https://yourstory.com/2025/05/dehatwala",
      "excerpt": "How a verified-worker marketplace is cutting hiring time from days to hours."
    }
  ]
}
```

| Field | Type | Notes |
| --- | --- | --- |
| `id` | int | |
| `slug` | string, **unique** | Drives `/media-news/news/{slug}` |
| `title` | string | |
| `tag` | string | Drives the filter chips — see note below |
| `source` | string | Publication name, e.g. `YourStory` |
| `published_at` | date | `YYYY-MM-DD` |
| `read_time` | string, nullable | e.g. `"5 min read"` |
| `image` | string | Image folder: `media` |
| `external_url` | string, nullable | Original article on the publisher's site |
| `excerpt` | string | 1–2 lines, shown on the list card |

**`tag` note:** the list page builds its filter chips from the distinct `tag`
values it receives. Free-text tags will produce messy chips — please back this
with a small fixed set (e.g. `Business`, `Startup`, `Impact`) or a categories
table, and expose it as a dropdown in the admin rather than a text input.

**Ordering:** newest `published_at` first.

**Pagination:** not needed yet — the list page filters and searches client-side.
If the archive grows past ~50 articles, tell us and we'll switch to
`?page=`/`?per_page=`.

---

## 3. `GET /media/news/{slug}`

Single article. Used on `/media-news/news/{slug}`.

Returns everything from the list item **plus** the body content, and the related
articles shown in the sidebar and the "More Articles You May Like" row.

```json
{
  "success": true,
  "article": {
    "id": 1,
    "slug": "solving-indias-blue-collar-hiring-challenge",
    "title": "Dehatwala is solving India's blue-collar hiring challenge",
    "tag": "Business",
    "source": "YourStory",
    "published_at": "2025-05-12",
    "read_time": "5 min read",
    "image": "1735493498yourstory-cover.png",
    "external_url": "https://yourstory.com/2025/05/dehatwala",
    "excerpt": "How a verified-worker marketplace is cutting hiring time from days to hours.",
    "lead": "India's blue-collar workforce is massive, yet access to skilled and reliable workers remains a challenge.",
    "body": "Dehatwala is building a technology-enabled platform...\r\nWith a mission to make workforce access simpler...",
    "quote_text": "Our goal is to build India's most trusted workforce network.",
    "quote_author": "Team Dehatwala"
  },
  "related": [ /* same shape as a /media/news list item, max 3, excluding this slug */ ]
}
```

| Field | Type | Notes |
| --- | --- | --- |
| `lead` | string | Opening paragraph, rendered in bold |
| `body` | text | **One paragraph per line** — see below |
| `quote_text` | string, nullable | Pull quote; omit both fields for no quote |
| `quote_author` | string, nullable | e.g. `Team Dehatwala` |

**`body` format:** a plain textarea, one paragraph per line, exactly like the
`services.whats_included` / `ideal_for` columns you already ship. If you also
return a pre-split `body_list: string[]` (as those columns do with
`whats_included_list`), the frontend will prefer it — that pattern works well.

Do **not** return HTML for `body`; it is rendered as text paragraphs.

**404** when the slug does not exist or the row is unpublished.

---

## 4. `GET /media/videos`

Used on `/media-news` (first 3) and `/media-news/videos` (all).

```json
{
  "success": true,
  "videos": [
    {
      "id": 1,
      "title": "Dehatwala on News18 Local",
      "subtitle": "Building a Smarter Workforce Network",
      "channel": "News18 Local",
      "duration": "04:35",
      "thumbnail": "1735493498news18-thumb.png",
      "video_url": "https://www.youtube.com/watch?v=XXXXXXXXXXX",
      "published_at": "2025-05-02"
    }
  ]
}
```

| Field | Type | Notes |
| --- | --- | --- |
| `title` | string | |
| `subtitle` | string, nullable | One-line description |
| `channel` | string | Drives the channel filter chips on the videos page |
| `duration` | string, nullable | `mm:ss`, shown as a badge on the thumbnail |
| `thumbnail` | string | Image folder: `media` |
| `video_url` | string | Full YouTube URL; opens in a new tab |
| `published_at` | date | |

---

## 5. `GET /media/photos`

Event gallery. Used on `/media-news` (first 5) and `/media-news/photos` (all,
with a lightbox).

```json
{
  "success": true,
  "photos": [
    {
      "id": 1,
      "image": "1735493498worker-drive.png",
      "alt": "Dehatwala workers at a community event",
      "caption": "Worker registration drive",
      "location": "Labour Chowk, Gurugram",
      "taken_at": "2025-04-05"
    }
  ]
}
```

| Field | Type | Notes |
| --- | --- | --- |
| `image` | string | Image folder: `media` |
| `alt` | string | Accessibility text — required, not optional |
| `caption` | string | Shown under the photo and in the lightbox |
| `location` | string, nullable | |
| `taken_at` | date | |

---

## Image dimensions

Rendered sizes measured at the desktop breakpoint. The page container is
`max-w-7xl` (1280px) with 40px side padding, so the content column is **1200px**
and cards sit in a 3-up grid with 16px gaps.

Every image below is `object-cover` with a **centre** crop, except the photo
lightbox which is `object-contain`.

### `/media-news` — landing page

| Element | Rendered | Ratio |
| --- | --- | --- |
| Featured In logo tile | 221 × 62 | ~3.6 : 1 |
| Latest Media Coverage card | **389 × 176** | ~2.2 : 1 |
| Videos & Interviews card | **389 × 176** | ~2.2 : 1 |
| Latest Event Photos strip | **228 × 128** | 16 : 9 |

### `/media-news/news` — coverage list

| Element | Rendered | Ratio |
| --- | --- | --- |
| Article card | 389 × 176 | ~2.2 : 1 |

### `/media-news/news/{slug}` — article detail

| Element | Rendered | Ratio |
| --- | --- | --- |
| Article hero | **787 × 320** | ~2.5 : 1 |
| Sidebar thumbnail ("Latest Media Coverage") | 80 × 64 | 1.25 : 1 |
| "More Articles You May Like" card | 389 × 144 | ~2.7 : 1 |

The hero is the **largest use of a news image** anywhere on the site — size the
uploads for this, not for the card.

### `/media-news/videos` — video list

| Element | Rendered | Ratio |
| --- | --- | --- |
| Video card thumbnail | 389 × 176 | ~2.2 : 1 |

### `/media-news/photos` — gallery

| Element | Rendered | Ratio |
| --- | --- | --- |
| Gallery tile | 288 × 176 | ~1.6 : 1 |
| Lightbox | up to 72% viewport height, full width | original, uncropped |

### What to upload

| Asset | Upload size | Format |
| --- | --- | --- |
| Publication logo | 400 × 120, transparent, generous padding | SVG or PNG |
| News article image | **1200 × 675** (16:9) | JPG or WebP |
| Video thumbnail | **1280 × 720** (16:9) | JPG or WebP |
| Event photo | **1600px on the long edge**, original aspect | JPG or WebP |

Notes for whoever uploads:

- **Keep the subject centred.** The same news image is cropped to 2.2:1 on the
  card, 2.5:1 on the detail hero, 2.7:1 on the related card and 1.25:1 on the
  sidebar thumbnail. Anything near an edge is lost in at least one of them.
- **Event photos are the exception** — the lightbox shows the whole uncropped
  image at up to 72% of the viewport height, so a small file will look poor
  there even though the grid tile is only 288px wide.
- Video thumbnails can be pulled straight from YouTube, which serves 1280 × 720.

---

## Summary for the backend developer

Five routes to add to `routes/api.php`:

```php
Route::get('/media/publications', [MediaController::class, 'publications']);
Route::get('/media/news',         [MediaController::class, 'news']);
Route::get('/media/news/{slug}',  [MediaController::class, 'newsDetail']);
Route::get('/media/videos',       [MediaController::class, 'videos']);
Route::get('/media/photos',       [MediaController::class, 'photos']);
```

Four tables — `publications`, `media_news`, `media_videos`, `media_photos` —
each with `status`, `deleted_at`, `created_at`, `updated_at` alongside the fields
above, plus a unique index on `media_news.slug`.

All five are public reads; no auth.

---

## Unrelated gaps in the same API

Worth queuing while this is being built:

1. `POST /career-application` does not exist. The careers form
   (`/careers/open-positions/{slug}`) posts `multipart/form-data` with
   `name, mobile_number, email, state_id, city_id, role, source, message, cv`
   and currently 404s, falling back to email.
2. `POST /save-book-service` and `POST /save-pay-after-service` are called by
   the booking payment step but are **not registered** in `routes/api.php` and
   appear nowhere in `app/`. Completing a booking will fail until they exist.
