# Repository Guidelines

## Project Structure & Module Organization

This repository is a Vite-powered React and TypeScript frontend. Application code lives in `src/`: route-level views are in `src/pages/`, reusable UI is grouped under `src/components/`, global state stores are in `src/store/`, API and React Query logic is in `src/react-query/`, and validation schemas are in `src/schema/`. Static files served as-is belong in `public/`; imported assets belong in `src/assets/`. Build output is generated in `dist/` and should not be edited manually.

## Build, Test, and Development Commands

- `npm install` installs the locked dependencies from `package-lock.json`.
- `npm run dev` starts the Vite development server with hot reload.
- `npm run build` type-checks with `tsc`, then creates a production build in `dist/`.
- `npm run lint` runs ESLint across all TypeScript and TSX files, failing on warnings.
- `npm run preview` serves the production build locally for final verification.

No automated test command is currently configured. Before submitting changes, run at least `npm run lint` and `npm run build`, then manually exercise affected routes and responsive layouts.

## Coding Style & Naming Conventions

Use TypeScript and functional React components. Prettier enforces semicolons, double quotes, and a 120-character line width; use two-space indentation. Follow existing kebab-case filenames such as `service-detail-page/index.tsx`, PascalCase for component symbols, and `use...` prefixes for hooks. Keep page-specific code near its page and move broadly reusable elements into `src/components/shared/`. Respect the React Hooks, React Refresh, and TanStack Query ESLint rules.

## Testing Guidelines

When introducing tests, colocate them with the unit under test using `*.test.ts` or `*.test.tsx`, and add the chosen runner to `package.json`. Prioritize forms, schemas, store transitions, API error states, and protected-route behavior. Until a framework is adopted, describe manual verification in the pull request.

## Commit & Pull Request Guidelines

Recent history uses short, title-style subjects (for example, `Join Us` and `Latest Changes`). Prefer a more descriptive imperative subject such as `Fix booking form validation`, keeping each commit focused. Pull requests should summarize the change, list verification commands, link relevant issues, and include before/after screenshots for visual work. Call out configuration or API contract changes explicitly.

## Security & Configuration

Environment values use the `VITE_` prefix. Never commit real credentials or payment secrets; browser-exposed Vite variables are public at build time. Keep local values in `.env`, provide sanitized examples when adding variables, and validate external content before rendering it.
