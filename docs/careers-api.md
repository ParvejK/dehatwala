# Careers — database schema + API contract

Spec for the endpoints behind `/careers` and its sub-pages. Nothing in this area
exists yet: there are no routes in `routes/api.php` and no tables for openings or
applications.

Pages covered:

| Route | What is dynamic |
| --- | --- |
| `/careers` | Why Join cards, Hiring Process steps, careers email |
| `/careers/open-positions` | The list of open roles |
| `/careers/open-positions/{slug}` | Role detail + the application form |
| `/careers/send-profile` | General application form (no specific role) |

The hero banner and the "Looking for work as a skilled worker?" note stay
hard-coded in the frontend.

**Priority:** `career_applications` (part 1.1) is the one that matters most —
the form is already built and live, and currently 404s on submit. The openings
tables can follow.

---

# Part 1 — Database schema

Laravel migrations, following the existing `services` table style.

## 1.1 `career_applications` — form submissions **(build this first)**

Receives both the "Apply for this Position" form and the "Send Your Profile"
form. Already built on the frontend; it posts today and gets a 404.

```php
Schema::create('career_applications', function (Blueprint $table) {
    $table->id();
    $table->string('name', 255);
    $table->string('mobile_number', 15);               // 10 digits, starts 6-9
    $table->string('email', 255);
    $table->unsignedBigInteger('state_id');
    $table->unsignedBigInteger('city_id');
    $table->string('role', 255);                       // role title, or free text
    $table->enum('source', ['open-position', 'send-profile']);
    $table->unsignedBigInteger('opening_id')->nullable(); // FK when source = open-position
    $table->text('message')->nullable();               // max 1000 chars
    $table->string('cv_path');                         // stored file path
    $table->string('cv_original_name')->nullable();
    $table->enum('status', ['new', 'reviewed', 'shortlisted', 'rejected'])->default('new');
    $table->softDeletes();
    $table->timestamps();

    $table->index(['status', 'created_at']);
});
```

## 1.2 `career_openings` — open roles

```php
Schema::create('career_openings', function (Blueprint $table) {
    $table->id();
    $table->string('title');                           // "Operations Executive"
    $table->string('slug')->unique();                  // drives /careers/open-positions/{slug}
    $table->string('department', 120);                 // "Operations"
    $table->string('location', 120);                   // "Gurugram"
    $table->string('type', 60);                        // "Full Time" | "Part Time" | "Contract"
    $table->text('summary');                           // 1-2 lines, shown on the card
    $table->text('responsibilities');                  // one bullet per line
    $table->text('requirements');                      // one bullet per line
    $table->integer('sort_order')->default(0);
    $table->enum('status', ['0', '1'])->default('1');  // '0' = closed / hidden
    $table->softDeletes();
    $table->timestamps();
});
```

> **No `icon` column.** The frontend picks an icon per department. If you want
> icons controlled from the admin, add `icon` as a short string and we will map
> the allowed values — do not store markup or image paths.

## 1.3 `career_benefits` — "Why Join Dehatwala?" cards

```php
Schema::create('career_benefits', function (Blueprint $table) {
    $table->id();
    $table->string('title');                           // "Work on Real Problems"
    $table->text('copy');
    $table->integer('sort_order')->default(0);
    $table->enum('status', ['0', '1'])->default('1');
    $table->softDeletes();
    $table->timestamps();
});
```

## 1.4 `career_process_steps` — "Our Hiring Process"

```php
Schema::create('career_process_steps', function (Blueprint $table) {
    $table->id();
    $table->string('title');                           // "Intro Call"
    $table->text('copy');
    $table->integer('sort_order')->default(0);         // also renders as 01, 02, 03…
    $table->enum('status', ['0', '1'])->default('1');
    $table->softDeletes();
    $table->timestamps();
});
```

---

# Part 2 — API endpoints

## Conventions

Same as the rest of `FrontController`:

- Success: `200` with `{ "success": true, "<key>": ... }`.
- Not found: `404` with `{ "success": false, "message": "..." }`.
- Validation failure: `422` with `{ "success": false, "errors": { "field": ["..."] } }`.
- `snake_case` field names.
- Only `status = '1'` rows returned, ordered by `sort_order` ascending.

---

## 1. `POST /career-application` **(highest priority)**

Content type: **`multipart/form-data`** — there is a file upload.

### Request

| Field | Type | Required | Validation |
| --- | --- | --- | --- |
| `name` | string | yes | min 3, max 255 |
| `mobile_number` | string | yes | exactly 10 digits, first digit 6–9 |
| `email` | string | yes | valid email, max 255 |
| `state_id` | integer | yes | exists in `states` |
| `city_id` | integer | yes | exists in `cities`, must belong to `state_id` |
| `role` | string | yes | min 2, max 255 |
| `source` | string | yes | `open-position` or `send-profile` |
| `message` | string | no | max 1000 |
| `cv` | file | yes | `pdf,doc,docx`, **max 5 MB** |

Suggested Laravel rules:

```php
$request->validate([
    'name'          => 'required|string|min:3|max:255',
    'mobile_number' => 'required|regex:/^[6-9][0-9]{9}$/',
    'email'         => 'required|email|max:255',
    'state_id'      => 'required|integer|exists:states,id',
    'city_id'       => 'required|integer|exists:cities,id',
    'role'          => 'required|string|min:2|max:255',
    'source'        => 'required|in:open-position,send-profile',
    'message'       => 'nullable|string|max:1000',
    'cv'            => 'required|file|mimes:pdf,doc,docx|max:5120',
]);
```

The frontend enforces the same rules client-side, so anything that reaches you
should already be valid — but validate anyway.

### Response

```json
{ "success": true, "message": "Application received. Our team will be in touch." }
```

The `message` is shown to the applicant, so write it for a human.

### CV storage

- Store outside the public web root, or behind an authenticated admin route.
  **CVs contain personal data and must not be publicly guessable URLs.**
- Keep the original filename in `cv_original_name` for the admin download.
- Rename the stored file (timestamp + random), same as the existing image
  uploads.

### Notification

Please email the careers inbox (`dehatwalainfo@gmail.com`) on each submission
with the applicant details and the CV attached, so nothing is missed while the
admin screen is being built.

---

## 2. `GET /career-openings`

Used by `/careers/open-positions`, and by `/careers` to decide whether to show
"View Open Positions" or the "no open positions" state.

```json
{
  "success": true,
  "openings": [
    {
      "id": 1,
      "slug": "operations-executive",
      "title": "Operations Executive",
      "department": "Operations",
      "location": "Gurugram",
      "type": "Full Time",
      "summary": "Own day-to-day service delivery — matching customer requirements with the right workers."
    }
  ]
}
```

**An empty array is a valid, expected response** — the page has a designed
"Currently No Open Positions" state that points people at Send Your Profile.
Return `{"success": true, "openings": []}`, not a 404.

---

## 3. `GET /career-openings/{slug}`

Used by `/careers/open-positions/{slug}`.

```json
{
  "success": true,
  "opening": {
    "id": 1,
    "slug": "operations-executive",
    "title": "Operations Executive",
    "department": "Operations",
    "location": "Gurugram",
    "type": "Full Time",
    "summary": "Own day-to-day service delivery…",
    "responsibilities": "Coordinate worker assignment against incoming requests.\r\nVerify worker documents.\r\nTrack live bookings.",
    "requirements": "0–3 years in operations or field coordination.\r\nComfortable in Hindi and English.\r\nWorking knowledge of Excel."
  }
}
```

`responsibilities` and `requirements` are plain textareas, **one bullet per
line** — exactly like the `services.whats_included` / `ideal_for` columns you
already ship. If you also return pre-split `responsibilities_list: string[]` and
`requirements_list: string[]` (as those columns do with `whats_included_list`),
the frontend will prefer them.

Do **not** return HTML.

**404** when the slug does not exist or `status = '0'`.

---

## 4. `GET /career-content`

The static-ish content blocks on `/careers`. One call, since they render together.

```json
{
  "success": true,
  "benefits": [
    { "id": 1, "title": "Work on Real Problems", "copy": "Help build solutions for real workforce challenges." }
  ],
  "process": [
    { "id": 1, "title": "Apply or Share Profile", "copy": "Pick an open role, or email us your profile." }
  ],
  "careers_email": "dehatwalainfo@gmail.com"
}
```

`process` is returned in `sort_order`; the frontend numbers the steps 01, 02, 03…
from the array position, so **do not** add a number to the title.

`careers_email` drives the "Career Contact" block and the mailto fallback on the
application forms. A single settings row is fine — it does not need its own table.

---

## Summary for the backend team

Routes to add to `routes/api.php`:

```php
Route::post('/career-application',        [CareerController::class, 'apply']);        // priority
Route::get('/career-openings',            [CareerController::class, 'openings']);
Route::get('/career-openings/{slug}',     [CareerController::class, 'openingDetail']);
Route::get('/career-content',             [CareerController::class, 'content']);
```

Four tables: `career_applications`, `career_openings`, `career_benefits`,
`career_process_steps`.

All public; no auth. The admin side needs a list view for
`career_applications` with a CV download, and CRUD for the other three.

---

## Images

The careers pages use **no images from the API** — the hero photo and the worker
banner are static files in `public/images/`. Nothing to size or upload here.
