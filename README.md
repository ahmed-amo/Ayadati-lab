# AYADATI LAB 2026

Clinic & medical laboratory management platform for Algeria.

**Brand:** AYADATI LAB  
**Stack:** NestJS 11 · Next.js 15 · PostgreSQL 16 · Prisma 6  
**Payments:** None in this version — patients pay at the laboratory on site.

---

## Repository layout

| Path | Description |
|------|-------------|
| `apps/web` | Next.js showcase site — landing page + **guest booking** (no sign-in) |
| `apps/api` | NestJS REST API — public booking endpoints |
| `../AI_INT` | Archived ML training assets (not used by the app) |

---

## Quick start

### Prerequisites

- Node.js 22+
- PostgreSQL 16

### 1. Install dependencies

```bash
npm install
```

### 2. Configure API

```bash
cp apps/api/.env.example apps/api/.env
# Edit DATABASE_URL, then:
npm run db:push -w apps/api
npm run db:generate -w apps/api
npm run prisma:seed -w apps/api
```

### 3. Configure web

```bash
cp apps/web/.env.example apps/web/.env.local
```

### 4. Run dev servers

```bash
npm run dev
```

- **Showcase site:** http://localhost:3000/fr  
- **Guest booking:** http://localhost:3000/fr/booking  
- **API:** http://localhost:4000/api/v1  
- **Swagger:** http://localhost:4000/docs  

---

## Public API (no auth)

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/v1/public/lab-services` | List bookable tests |
| `POST` | `/api/v1/public/bookings` | Create guest appointment |
| `GET` | `/api/v1/public/bookings/:qrToken` | Lookup by reference |

### Booking body example

```json
{
  "fullName": "Ahmed Benali",
  "phone": "0555123456",
  "appointmentDate": "2026-06-15",
  "preferredTime": "09:30",
  "testType": "cbc"
}
```

---

## i18n

Locales: **fr** (default) · **ar** (RTL) · **en**

Messages: `apps/web/messages/{fr,ar,en}.json`

---

## Roles (dashboard — coming next)

| Role | Capability |
|------|------------|
| admin | Full system |
| auditor | Sign results, reports |
| nurse | CBC entry + blood type |
| receptionist | Bookings, complaints |
| patient | Own portal (authenticated) |

Staff dashboards are not in this showcase release.

---

## Design tokens

Defined in `apps/web/tailwind.config.ts`:

- `brand-blue` `#4F74A3`
- `brand-navy` `#0E2F57`
- `brand-teal` `#6FB7B3`

---

## License

Proprietary — AYADATI LAB.
