# AYADATI LAB — Multi-tenant SaaS

Platform for **multiple independent medical laboratories**. Each lab is a **tenant** with isolated data, branded public portal, and staff workspace.

**Stack:** NestJS 11 · Next.js 15 · PostgreSQL 16 · Prisma 6

---

## Architecture

| Layer | Multi-tenancy |
|--------|----------------|
| Database | Shared PostgreSQL, `tenant_id` on all tenant-owned rows |
| API | Routes under `/api/v1/t/:tenantSlug/...` + global `/api/v1/tenants` |
| Web | Platform at `/[locale]` · Each lab at `/[locale]/l/[tenantSlug]` |

### Tenant model

- **Slug** — URL identifier (`demo-lab` → `/fr/l/demo-lab`)
- **Plans** — `STARTER` · `PRO` · `ENTERPRISE`
- **Status** — `TRIAL` · `ACTIVE` · `SUSPENDED`
- **Per-tenant limits** — e.g. `dailyBookingLimit` (default 50)

### Roles

| Role | Scope |
|------|--------|
| `SUPER_ADMIN` | Platform (no `tenant_id`) |
| `ADMIN` | Lab owner |
| `RECEPTIONIST` · `NURSE` · `AUDITOR` · `PATIENT` | Within one tenant |

---

## Quick start

### Prerequisites

- Node.js 22+
- PostgreSQL 16 (or `docker compose up -d db`)

### 1. Install

```bash
npm install
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
```

### 2. Database

```bash
docker compose up -d db   # optional
npm run db:push
npm run prisma:seed -w apps/api
```

### 3. Run

```bash
npm run dev
```

| URL | Purpose |
|-----|---------|
| http://localhost:3000/fr | SaaS platform home |
| http://localhost:3000/fr/register | Register a new lab |
| http://localhost:3000/fr/l/demo-lab | Demo lab portal |
| http://localhost:3000/fr/l/demo-lab/booking | Guest booking |
| http://localhost:4000/docs | API Swagger |

**Demo tenant** `demo-lab` — password `ayadati2026` for all seeded staff emails.

---

## API

### Platform (no tenant)

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/tenants/register` | Onboard new laboratory |
| `GET` | `/api/v1/tenants` | List active labs |
| `GET` | `/api/v1/tenants/:slug` | Public lab profile |

### Per-tenant (`:tenantSlug` = e.g. `demo-lab`)

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/t/:tenantSlug/public/lab-services` | Bookable tests |
| `POST` | `/api/v1/t/:tenantSlug/public/bookings` | Guest booking |
| `GET` | `/api/v1/t/:tenantSlug/public/bookings/:qrToken` | Booking lookup |
| `POST` | `/api/v1/t/:tenantSlug/auth/login` | Staff login |
| `GET` | `/api/v1/t/:tenantSlug/staff/stats` | Dashboard stats |

---

## Register a new lab (example)

```bash
curl -X POST http://localhost:4000/api/v1/tenants/register \
  -H "Content-Type: application/json" \
  -d '{
    "labName": "Clinique El Amal",
    "slug": "el-amal",
    "adminEmail": "admin@elamal.dz",
    "adminFullName": "Dr. Ahmed",
    "adminPassword": "SecurePass123"
  }'
```

Portal: `http://localhost:3000/fr/l/el-amal`

---

## i18n

Locales: **fr** · **ar** (RTL) · **en**

---

## License

Proprietary — AYADATI LAB.
