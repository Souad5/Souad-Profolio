# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

The canonical project guide is `AGENTS.md` (commands, architecture, gotchas) — imported below so it stays the single source of truth. This file only adds details not covered there.

@AGENTS.md

## Additional notes

### Commands
- Root shortcuts exist for the DB: `npm run db:migrate`, `npm run db:seed`, `npm run db:studio` (proxy to the server workspace). Server also has `db:deploy` (`prisma migrate deploy`), `db:push`, `db:generate`; `postinstall` runs `prisma generate`.
- `npm run build` (root) builds client then server.
- Verification after changes = `npm run lint` + `npm run typecheck -w server` + `npm run build -w client`. There are no tests.

### Server
- **Entry split**: `server/src/app.ts` builds and exports the Express app (helmet, CORS, rate limiters, `/api` router, `/health`, error handlers). `server/src/server.ts` only calls `app.listen` for local dev/`npm start`. `server/api/index.ts` re-exports the app as a Vercel serverless function (`server/vercel.json` routes everything to it). Add middleware/routes in `app.ts`, never in `server.ts`.
- **Prisma runs with `engineType = "client"` + `@prisma/adapter-pg`** (no Rust query engine binary). `config/prisma.ts` caches the client on `globalThis`. The Vercel build must bundle `node_modules/.prisma/client/query_compiler_bg.wasm` — that's why `api/index.ts` reads it and `vercel.json` lists it in `includeFiles`; don't remove either.
- Routing: `routes/public.ts` holds public GETs, `POST /api/contact`, auth, and the protected `admin` router (all under `requireAuth`). `routes/entities.ts` instantiates `crudController(prisma.<model>, opts)` per entity and exposes `crudRoutes(name, ctrl)`. Controller options include `searchFields`, `defaultOrderBy`, `include`, `requiredFields`, and `preprocess` — use `preprocess` to coerce form values (e.g. string → Int ids, `YYYY-MM-DD` → ISO DateTime) before they hit Prisma.
- Projects, site settings/social links, contact messages, and dashboard stats have bespoke controllers rather than the generic factory.
- Server is ESM TypeScript: relative imports must use the `.js` extension (e.g. `import app from "./app.js"`).
- CORS reflects any origin (`origin: true`) — safe because admin auth is a Bearer JWT, not cookies.

### Client
- `@` alias → `client/src` (see `vite.config.js`). `components/ui/*` are shadcn-style primitives (`components.json`, style `radix-nova`, JS not TSX) plus custom app components; `cn()` lives in `lib/utils.js`.
- Animation uses both framer-motion/`motion` and GSAP (`@gsap/react` `useGSAP`) in public sections.
- `api/client.js` is a fetch wrapper: base `VITE_API_URL` (default `http://localhost:5000/api`), 15 s timeout, in-memory Bearer token set via `setAuthToken` (driven by `context/AuthContext`), throws `ApiError(status, message)`.
- After admin mutations, invalidate the matching TanStack Query keys from `hooks/usePortfolio.js` so the public site reflects changes.

### Deployment
- Client on Netlify (`client/public/_redirects` SPA fallback); server deployable to Vercel from the `server/` directory. Server needs `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CLIENT_URL`.
