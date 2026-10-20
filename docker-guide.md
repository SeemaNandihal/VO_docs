# Running VachanOnline v2 with Docker

This document covers containerizing the frontend, environment variable setup, running it in dev and production modes, and how to get Docker installed if you don't have it yet.

---

## 1. Overview — Dockerizing the application

The frontend is containerized using a **single multi-stage Dockerfile** with separate build targets for development and production, so both modes can be built and run consistently on any machine (a developer's laptop or a production server) without needing Node, pnpm, or any project dependencies installed on the host directly — only Docker itself.

**Why multi-stage:** Next.js needs a full toolchain (TypeScript, Tailwind's compiler, ESLint, etc.) to *build* the app, but almost none of that to *run* it in production. Building in one stage and copying only the compiled output into a clean final stage keeps the production image small and avoids shipping unnecessary build tools. The dev target reuses the same dependency-install stage, so there's no duplicated install logic between dev and prod.

```
docker/
├── Dockerfile          # multi-stage build — shared deps, dev target, prod build/runner targets
├── docker-compose.yml  # both dev and prod services, selected via Compose profiles
└── .env                # NEXT_PUBLIC_* build-time values (not committed)
```

The Dockerfile has these stages:

1. **`base`** — pins Node and pnpm versions, shared by everything below
2. **`deps`** — installs dependencies via pnpm, using the lockfile (shared by both dev and prod)
3. **`dev`** — copies source code, runs the Next.js dev server directly (used only for local dev-mode containers)
4. **`builder`** — copies source code, injects build-time environment variables, runs `pnpm build` (production only)
5. **`runner`** — copies only the compiled `.next/standalone` output, `.next/static`, and `public/` into a minimal final image; runs as a non-root user (production only)

`docker-compose.yml` defines two services — `frontend` (production, builds the `runner` target) and `frontend-dev` (development, builds the `dev` target) — each gated behind a Compose **profile**, so nothing runs unless you explicitly choose which mode you want.


---

## 2. Node version compatibility

The image pins **Node 22 (Alpine)** as the base:

```dockerfile
FROM node:22-alpine AS base
```

This matches the Node version the project is developed against, and Alpine keeps the image small. If the project's required Node version ever changes, update this single line — it controls the version for every stage of the build, both dev and prod.

**Package manager version is also pinned**, to avoid a mismatch between the pnpm version used locally (which generated the lockfile) and whatever Corepack might otherwise resolve inside the container:

```dockerfile
RUN corepack enable && corepack prepare pnpm@10.17.0 --activate
```

If the project's pnpm version changes (check with `pnpm --version` locally), update this line to match — otherwise you may see lockfile-mismatch errors during `pnpm install --frozen-lockfile`.

---

## 3. Environment variables — where they need to exist

Before building or running anything, make sure the required environment files are in place. Docker involves two separate places environment variables get read from, and both need to be correct or the app will silently misbehave (blank Firebase config, failed API calls, etc.) rather than throw a clear error.

```
project-root/
├── .env.local              # required — server-side + local dev values
└── docker/
    ├── docker-compose.yml
    ├── Dockerfile
    └── .env                 # required — NEXT_PUBLIC_* build-time values only
```

### `docker/.env` — build-time values

Read by **Docker Compose itself**, before any container starts, to fill in `${VAR}` placeholders in `docker-compose.yml`'s `build.args` (used by the production `frontend` service only — the dev service doesn't need build-time args since it runs the dev server directly against live source). These values get permanently inlined into the compiled JavaScript bundle during `pnpm build` — this is required because Next.js's `NEXT_PUBLIC_*` variables are baked in at build time, not read at runtime.

Must contain every `NEXT_PUBLIC_*` variable referenced in `docker-compose.yml`'s `args:` block — currently:

```env
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_HELP_URL_DESKTOP=
NEXT_PUBLIC_HELP_URL_MOBILE=
NEXT_PUBLIC_DOWNLOAD_URL=
NEXT_PUBLIC_FEEDBACK_URL=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
```

This file must be named exactly `.env` and sit directly alongside `docker-compose.yml` — Compose auto-discovers it by that exact name and location;

**If this file is missing or incomplete**, `docker compose build` will still succeed, but print warnings like:
```
WARN[0000] The "NEXT_PUBLIC_FIREBASE_API_KEY" variable is not set. Defaulting to a blank string.
```
and the resulting app will have broken/blank values baked into the bundle — Firebase won't initialize correctly, help links will be empty, etc. Always check the build output for these warnings before assuming a successful build actually produced a correct image.

### `.env.local` (project root) — runtime values

Read by **the running container** at startup (via `env_file` in `docker-compose.yml`, for both the dev and prod services), and separately by `pnpm dev` for local development outside Docker. This is where server-only secrets belong — `API_KEY`, `API_BASE_URL`, `M2M_CLIENT_SECRET`, `VIMEO_CLIENT_SECRET`, etc. — values your API routes read via `process.env` at request time, never sent to the browser.

This file must exist at the **project root**, not inside `docker/` — `docker-compose.yml`'s `env_file` entry points up to it (`../.env.local`).

**If this file is missing**, `docker compose up` will fail immediately with an explicit error (`env file ... not found`), rather than silently proceeding — so this particular mistake is easy to catch.

### Quick check before building

```bash
ls docker/.env .env.local
```

Both should exist. If either is missing, make sure to get those `.env.example` values before running any `docker compose` command.

---

## 4. Running in dev mode vs. production mode

Both modes are defined in the **same** `docker/Dockerfile` and `docker/docker-compose.yml`, using Compose **profiles** to select which one runs. Nothing runs unless you specify a profile — running plain `docker compose up` with no profile does nothing, by design, so dev and prod can never be started by accident.

### `docker/Dockerfile` (single file, both targets)

```dockerfile
FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10.17.0 --activate

# ---- Dependencies (shared by dev and prod) ----
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ---- Dev target ----
FROM base AS dev
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["pnpm", "dev"]

# ---- Build (production) ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* values are inlined into the client bundle at build time,
# so they must be passed as build args.
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_HELP_URL_DESKTOP
ARG NEXT_PUBLIC_HELP_URL_MOBILE
ARG NEXT_PUBLIC_DOWNLOAD_URL
ARG NEXT_PUBLIC_FEEDBACK_URL
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_DATABASE_URL

ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_HELP_URL_DESKTOP=$NEXT_PUBLIC_HELP_URL_DESKTOP
ENV NEXT_PUBLIC_HELP_URL_MOBILE=$NEXT_PUBLIC_HELP_URL_MOBILE
ENV NEXT_PUBLIC_DOWNLOAD_URL=$NEXT_PUBLIC_DOWNLOAD_URL
ENV NEXT_PUBLIC_FEEDBACK_URL=$NEXT_PUBLIC_FEEDBACK_URL
ENV NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY
ENV NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=$NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ENV NEXT_PUBLIC_FIREBASE_PROJECT_ID=$NEXT_PUBLIC_FIREBASE_PROJECT_ID
ENV NEXT_PUBLIC_FIREBASE_DATABASE_URL=$NEXT_PUBLIC_FIREBASE_DATABASE_URL

RUN pnpm build

# ---- Runtime (production) ----
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
```

### `docker/docker-compose.yml` (single file, both services)

```yaml
services:
  frontend:
    profiles: ["prod"]
    build:
      context: ..
      dockerfile: docker/Dockerfile
      target: runner
      args:
        NEXT_PUBLIC_SITE_URL: ${NEXT_PUBLIC_SITE_URL}
        NEXT_PUBLIC_HELP_URL_DESKTOP: ${NEXT_PUBLIC_HELP_URL_DESKTOP}
        NEXT_PUBLIC_HELP_URL_MOBILE: ${NEXT_PUBLIC_HELP_URL_MOBILE}
        NEXT_PUBLIC_DOWNLOAD_URL: ${NEXT_PUBLIC_DOWNLOAD_URL}
        NEXT_PUBLIC_FEEDBACK_URL: ${NEXT_PUBLIC_FEEDBACK_URL}
        NEXT_PUBLIC_FIREBASE_API_KEY: ${NEXT_PUBLIC_FIREBASE_API_KEY}
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: ${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${NEXT_PUBLIC_FIREBASE_PROJECT_ID}
        NEXT_PUBLIC_FIREBASE_DATABASE_URL: ${NEXT_PUBLIC_FIREBASE_DATABASE_URL}
    image: vachanonline-frontend:latest
    container_name: vachanonline-frontend
    ports:
      - "3000:3000"
    env_file:
      - ../.env.local
    restart: unless-stopped

  frontend-dev:
    profiles: ["dev"]
    build:
      context: ..
      dockerfile: docker/Dockerfile
      target: dev
    image: vachanonline-frontend:dev
    container_name: vachanonline-frontend-dev
    ports:
      - "3000:3000"
    volumes:
      - ..:/app
      - /app/node_modules
      - /app/.next
    env_file:
      - ../.env.local
    command: pnpm dev
```

`target: runner` and `target: dev` tell Compose which stage of the *same* Dockerfile to build for each service — that's what avoids needing two separate Dockerfiles.

### Running dev mode (hot reload, local iteration)

Dev mode runs the actual Next.js dev server inside the container, with your local source code bind-mounted in — so file edits on the host are reflected immediately, same as running `pnpm dev` directly.

```bash
cd docker
docker compose --profile dev up
```

Open `http://localhost:3000` — edits to files under the project root are picked up with hot reload, same as running locally without Docker.

**Stop it:**
```bash
docker compose --profile dev down
```

### Running production mode

Production uses the `builder` → `runner` targets, producing an optimized, minimal image with the compiled app — no dev server, no source maps, no dev dependencies.

```bash
cd docker
docker compose --profile prod build
docker compose --profile prod up -d
```

Check it's running:

```bash
docker compose ps
docker compose logs -f frontend
```

Then visit `http://localhost:3000` (or wherever it's mapped/proxied in a real deployment).

**Stop it:**
```bash
docker compose --profile prod down
```

---

## 5. Installing Docker

If Docker isn't installed yet, follow the official installation guide for your OS:

- **All platforms (official):** https://docs.docker.com/get-started/get-docker/
- **Windows:** https://docs.docker.com/desktop/setup/install/windows-install/ (Docker Desktop, includes Docker Compose)
- **macOS:** https://docs.docker.com/desktop/setup/install/mac-install/ (Docker Desktop, includes Docker Compose)
- **Linux (Ubuntu):** https://docs.docker.com/engine/install/ubuntu/ (Docker Engine + Compose plugin — Docker Desktop is optional on Linux)

**After installing, verify it's working:**

```bash
docker --version
docker compose version
```

Both commands should print version numbers without error. If `docker compose` (no hyphen) isn't recognized, you may have an older standalone `docker-compose` — the modern Compose V2 plugin syntax (`docker compose`, used throughout this document) is what current Docker Desktop and Docker Engine installs ship with by default.

**Linux users:** after installing Docker Engine, you may need to add your user to the `docker` group to run commands without `sudo`:

```bash
sudo usermod -aG docker $USER
```

Then either **log out and log back in**, or run the following in your current terminal to pick up the new group membership immediately without a full logout:
 
```bash
newgrp docker
```
 
**Verify it worked** — this should run without a permission error and without needing `sudo`:
 
```bash
docker ps
```
 
Once that succeeds, proceed to [Section 3](#3-environment-variables--where-they-need-to-exist) to confirm your env files are in place, then [Section 4](#4-running-in-dev-mode-vs-production-mode) to build and run the app.