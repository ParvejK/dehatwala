# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Vite dev server on port 7000 (fixed in vite.config.ts)
npm run build      # tsc && vite build — type errors block the build
npm run lint       # eslint . --ext ts,tsx --max-warnings 0 — warnings fail
npm run preview    # serve the production build
```

There is **no test framework** in this project — no test script, no test runner dependency, no test files. Verify changes with `npx tsc --noEmit`, `npm run lint`, and by exercising the page in the running dev server.

Two lint/type rules bite often:
- `noUnusedLocals` / `noUnusedParameters` are on, so a leftover import fails `tsc` (and therefore `build`).
- `--max-warnings 0` means `react-refresh/only-export-components` fails lint. A `.tsx` file that exports components must not also export constants or helpers — put those in a sibling `.ts` module (see `components/booking/steps.ts`, `components/blog/article-model.ts`).

`tsconfig` has `strict: false`, so null-safety is not enforced by the compiler. API fields that are nullable in practice (`rating`, `base_price`, `category`) must be guarded by hand.

## Backend

This is the frontend only. The Laravel API it talks to is a **separate checkout on the same machine at `D:\dehatwala`**, served on `http://127.0.0.1:8000/api`.

When you need to know an endpoint's real contract, read the source rather than guessing or POSTing test data:
- `D:\dehatwala\routes\api.php` — route → controller map
- `D:\dehatwala\app\Http\Controllers\API\FrontController.php` — most public endpoints
- `D:\dehatwala\database\migrations\` — the actual columns

This matters because several forms collect fields the API silently discards (it neither validates nor persists unknown keys). Confirm a column exists before assuming data is saved.

Read-only `GET`s against the running API are a safe way to learn response shapes. Avoid `POST`ing to endpoints that write rows.

## Architecture

**Stack:** Vite + React 18 + TypeScript, react-router-dom v7, TanStack Query, Zustand, Tailwind + daisyUI, axios, Zod, react-hook-form.

**Routing** — `src/router.tsx` is one flat `createBrowserRouter` list; every page is a child of `src/layout.tsx` (SmallHeader / Header / `Outlet` / Footer) with a shared `errorElement`. Adding a page means adding an import and a route object here.

Route ordering matters where a static segment competes with a dynamic one (e.g. `/blog/category/:categorySlug` alongside `/blog/:slug`). React Router ranks static segments higher, but declare the more specific route first for readability.

**Data layer** — strictly two files, and an endpoint needs an entry in both:
- `src/react-query/apis.ts` — every axios call lives here and nowhere else
- `src/react-query/hooks.ts` — the matching `useQuery` wrapper

`src/react-query/constants.ts` re-exports the `VITE_*` env vars. Components import `API_URL` / `VITE_IMAGE_PATH_URL` from there, never `import.meta.env` directly.

`main.tsx` constructs a bare `new QueryClient()` with no global defaults — the `defaultOptions` block shown in `README.md` is not actually applied. Caching is configured per hook (`staleTime: 10 * 1000` or `Infinity`), so set it explicitly on each new hook.

**Types** — `src/types.d.ts` holds nearly all API types in one file. Note it declares `interface Service` twice; TypeScript **merges** them, so the effective `Service` is the union of both blocks. Adding a field to either is enough.

**State** — Zustand stores in `src/store/`, most persisted to `localStorage`. The booking flow spans three routes and relies on this: `day-service-store` owns worker counts and price maths (`totalDayPrice` already includes the tip), `booking-store` owns the schedule/address captured on step 2. Prices are computed in the store, not in components.

**Auth** — `useAuthStore` holds `{ user, token }`. `src/protected-route.tsx` has **inverted** logic despite its name: it redirects when a token *exists*, so it wraps sign-in/sign-up/forgot-password to bounce users who are already logged in. Pages that genuinely require auth (e.g. booking payment) do their own `if (!token) navigate('/sign-in?path=...')` check.

**Images** — API rows store a bare filename; build URLs as `` `${VITE_IMAGE_PATH_URL}/{service|blog|category}/${filename}` ``. Rows also carry an `image_link` absolute URL, but it points at a different host than the configured one, so prefer the constructed path.

**Modals** — `src/components/shared/modals.tsx` wraps a native `<dialog>` and is driven by a ref, not state: hold a `useRef<HTMLDialogElement>` and call `modalRef.current?.showModal()`. `README.md` has the full usage example.

## Styling

Two conventions coexist. Older pages use daisyUI semantic classes (`btn`, `input-bordered`, `text-primary`) against the `myTheme` in `tailwind.config.js`. Newer pages use literal hex values — `#0b3fc4` brand blue, `#0f1e57` heading ink, `#63739a` muted text, `#dce7fb` borders, `#f2f6fe`/`#f8fbff` tinted surfaces — plus the `--home-color-*` CSS variables in `src/index.css`.

**Match whichever convention the file you are editing already uses.** When building a new page, follow the nearest recently-built page rather than reintroducing daisyUI classes.

## Known API quirks

- `GET /get-city/{stateId}` returns its array under **`cites`**, not `cities` (typo is upstream, reflected in the `CitiesResponse` type).
- `POST /get-services` accepts `"all"` on either slug as a wildcard, but answers with `category: null` and `sub_categories: []`. `/services/all` therefore has to supply its own hero copy and use the category list for filter chips — see `ALL_SLUG` in `pages/service-listing-page/index.tsx`.
- `POST /register-otp` returns the OTP in the response body (`FIXED_OTP`, dev only). OTP is verified client-side by comparing strings.
- `blogs.tags` and `services.tags` are stored inconsistently — sometimes a JSON array of `{value}` objects, sometimes a comma-separated string, sometimes null. Parse defensively.

## URL conventions

Service URLs are **singular** in the route table (`/service/detail/:slug`, `/service/instant/:slug`) but the category listing is **plural** (`/services/:category_slug/:sub_category_slug?`). Several header, menu and card components still link to the singular `/service/{categorySlug}` form, which matches no route and lands on the error page. Check the route table before adding a link.
