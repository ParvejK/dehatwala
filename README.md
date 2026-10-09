# Dehatwala — frontend

Vite + React 18 + TypeScript storefront for the Dehatwala workforce platform.
The Laravel API it talks to is a separate checkout (see `CLAUDE.md`).

## Commands

```bash
npm run dev        # dev server on port 7000
npm run build      # tsc && vite build — type errors block the build
npm run lint       # eslint . --ext ts,tsx --max-warnings 0 (warnings fail)
npm run preview    # serve the production build
```

There is no test framework in this project. Verify changes with `npx tsc --noEmit`,
`npm run lint`, and by exercising the page in the running dev server.

## Environment

Copy the `VITE_*` variables into `.env`:

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | Laravel API root, e.g. `http://127.0.0.1:8000/api` |
| `VITE_BASE_URL` | Public site URL |
| `VITE_IMAGE_PATH_URL` | Storage root for service/blog/category images |
| `VITE_RAZORPAY_KEY_ID` | Razorpay **publishable** key |

Every `VITE_*` value is inlined into the browser bundle, so never put a secret
(API secret keys, tokens, passwords) behind a `VITE_` prefix.

Read them through `src/react-query/constants.ts` rather than `import.meta.env`.

## Architecture

See `CLAUDE.md` for routing, the data layer, state stores, and the known API
quirks. In short:

- `src/router.tsx` — one flat route list; every page renders inside `src/layout.tsx`.
- `src/react-query/apis.ts` — every axios call; `hooks.ts` — the matching query hooks.
- `src/store/` — Zustand stores, most persisted to `localStorage`.
- `src/types.d.ts` — API response types.

`main.tsx` constructs a bare `new QueryClient()` with no global defaults, so
caching is configured per hook (`staleTime` on each `useQuery`).
