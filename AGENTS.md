# AGENTS.md

Full-stack portfolio CMS. Monorepo (npm workspaces): `client` (React 19 + Vite 7, Tailwind v4 + daisyUI, framer-motion, TanStack Query, EmailJS) and `server` (Express + TypeScript + Prisma + PostgreSQL). All content lives in Postgres; edited via the `/admin` dashboard. No hardcoded content in UI components.

## Commands
- `npm run dev` — run client + server dev servers (concurrently)
- `npm run dev -w client` / `npm run dev -w server` — individual dev servers
- `npm run build -w client` — client production build
- `npm run build -w server` — server TS compile (`tsc` → `dist/`)
- `npm run lint` — ESLint for both workspaces (0 errors expected; `any` warnings are intentional in the generic CRUD factory)
- `npm run typecheck -w server` — server TS check (`tsc --noEmit`)
- `npm run db:migrate -w server` and `npm run db:seed -w server` — Prisma migration + seed
- **No test script and no client typecheck.**

## Architecture
- **Router** (`client/src/Layout/Layouts.jsx`): public `/` (App = Navbar + Home + Footer), `/admin/login`, and protected `/admin/*` under `AdminLayout`. **All admin pages are lazy-loaded** for bundle size.
- Public `Home.jsx` composes section components from `client/src/components/public/sections/*` (one per entity). Section visibility is gated by `useSections()` from the DB — don't hardcode which sections show.
- **Scroll nav**: `Navbar.jsx`/`Footer.jsx` use **react-scroll** `Link` with `to={item.target}` targets sourced from DB nav items. The **react-router** `Link` is used only in `Pages/NotFound.jsx`. Do not mix them.
- **Admin**: generic declarative CRUD in `components/admin/CrudPage.jsx` + `FormFields.jsx`; real pages in `Pages/admin/*` configure field schemas. Adding a new entity = new Prisma model + route + CrudPage config (and seed if needed).
- **Data layer**: `client/src/api/endpoints.js` + `client/src/hooks/usePortfolio.js` (one TanStack Query hook per entity). Server CRUD is a factory in `server/src/controllers/crud.ts` over Prisma model delegates (`public.ts` exposes public GET + protected `/api/admin/*`).
- **Content**: no hardcoded portfolio content in the UI — everything (settings, socials, hero, about, skills, projects, experience, education, services, testimonials, certifications, achievements, nav) is in Postgres via `server/prisma/schema.prisma`. Seed: `server/prisma/seed.ts` (idempotent).

## Known gotchas
- Two `Link` components share the default import name: **react-scroll** `Link` (Navbar/Footer) vs **react-router** `Link` (NotFound only). Don't use router `<Link>` for section navigation.
- `client/src/components/ui/Icon.jsx` is a **curated icon registry** (specific react-icons imports). Importing whole `react-icons/fa|si|md` libraries balloons the bundle to ~8 MB — always add icons to the registry, never import the whole library. Unregistered icon names fall back to `FaTag`.
- EmailJS keys (`VITE_EMAILJS_*`) are client-side env vars, public by design (browser SDK). Contact form POSTs to the backend (source of truth) AND best-effort sends via EmailJS. Don't commit new credentials; EmailJS copy in the catch block stays silent.
- Styling: Tailwind v4 `@import "tailwindcss"` + `@plugin "daisyui"` in `client/src/index.css` (no tailwind.config). Custom gradient utilities use v4 `bg-linear-to-r/decreasing` syntax. Brand colors are `@theme`-defined in `index.css` with a `.dark` variant.
- Server: `JWT_SECRET`, `ADMIN_EMAIL`/`ADMIN_PASSWORD`, `CLIENT_URL`, `DATABASE_URL` in `server/.env`. Zod schemas in `server/src/schemas/`. Keep `server/.env.example` in sync.
- Lint: client `react-refresh/only-export-components` and server `no-explicit-any` are intentionally warnings, not errors.
- `public/_redirects` (Netlify SPA fallback) and the Google-site-verification file in `client/public/` — don't delete.