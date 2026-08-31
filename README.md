# Souad Portfolio — Full-Stack CMS

A full-stack, database-backed portfolio CMS. All content is stored in PostgreSQL (single source of truth) and edited through a secure admin dashboard — no content is hardcoded in the UI.

## Stack

- **Monorepo** — npm workspaces: `client` (React + Vite) and `server` (Express + TypeScript + Prisma)
- **Client:** React 19, Vite 7, Tailwind CSS v4 + daisyUI, framer-motion, @tanstack/react-query, react-router, EmailJS
- **Server:** Express 5, TypeScript, Prisma ORM, PostgreSQL, Zod validation, JWT auth, Helmet + CORS + rate limiting
- **Admin:** `/admin` dashboard (login-protected) with declarative CRUD for every content entity

## Getting Started

```bash
# 1. Install dependencies (workspaces install together)
npm install

# 2. Provision PostgreSQL (create role + database)
sudo -u postgres psql \
  -c "ALTER USER portfolio WITH PASSWORD 'portfolio_dev_password';" \
  -c "CREATE DATABASE portfolio_db OWNER portfolio;"

# 3. Configure environment files
cp server/.env.example server/.env   # edit values
cp client/.env.example client/.env   # edit values

# 4. Create schema + seed content (idempotent)
npm run db:migrate -w server
npm run db:seed -w server

# 5. Run both dev servers
npm run dev
#   → client at http://localhost:5173
#   → server at http://localhost:5000/api
```

Admin login: `admin@portfolio.com` / `admin12345` (configurable via `ADMIN_EMAIL`/`ADMIN_PASSWORD` in `server/.env`).

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Run client + server dev servers (concurrently) |
| `npm run dev -w client` | Client only (Vite) |
| `npm run dev -w server` | Server only (tsx watch) |
| `npm run build -w client` | Client production build |
| `npm run build -w server` | Server TypeScript compile |
| `npm run lint` | Lint both workspaces |
| `npm run typecheck -w server` | Server TS type check |
| `npm run db:migrate -w server` | Run Prisma migration |
| `npm run db:seed -w server` | Seed database |

## Project Structure

```
client/
  src/
    api/            # fetch wrapper + endpoints
    components/
      admin/        # admin layout, CRUD pages, form/table/reusable UI
      public/       # navbar, footer, ui (Icon, Section), section components
    context/        # AuthContext, ThemeContext
    hooks/          # usePortfolio (TanStack Query for all entities)
    Layout/         # router (public + admin routes, lazy-loaded)
    lib/            # queryClient, toast, utils
    Pages/          # Home, NotFound, admin/* (login, dashboard, CRUD pages)
server/
  src/
    config/         # env + prisma client
    controllers/    # crud factory, auth, settings, project, contact, dashboard
    middleware/     # auth (JWT), validate (Zod), error
    routes/         # public API + protected admin API
    schemas/        # Zod schemas
    utils/          # ApiError, async handler
  prisma/
    schema.prisma   # all models (single source of truth)
    seed.ts         # seeds existing portfolio content
```

## API Overview

- `GET /api/*` — public entity endpoints (settings, about, skills, projects, experience, education, services, testimonials, certifications, achievements, nav)
- `POST /api/contact` — public contact form (stored in DB, visible in admin inbox)
- `POST /api/admin/auth/login` — admin login (returns JWT)
- `GET /api/admin/auth/me` — verify token
- `GET|POST|PUT|PATCH|DELETE /api/admin/:entity` — protected CRUD (requires JWT)
- `GET /api/admin/dashboard/stats` — dashboard statistics

## Deployment

- Netlify hosts the client (SPA fallback via `public/_redirects`).
- The server needs a Postgres provider + `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CLIENT_URL`.
- EmailJS keys are client-side env vars (`VITE_EMAILJS_*`) — public by design (browser SDK).