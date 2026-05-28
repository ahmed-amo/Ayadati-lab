-- Multi-tenant SaaS migration (fresh DB or reset recommended for existing dev data)

CREATE TYPE "TenantStatus" AS ENUM ('TRIAL', 'ACTIVE', 'SUSPENDED');
CREATE TYPE "TenantPlan" AS ENUM ('STARTER', 'PRO', 'ENTERPRISE');

ALTER TYPE "UserRole" ADD VALUE IF NOT EXISTS 'SUPER_ADMIN';

CREATE TABLE "tenants" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_ar" TEXT,
    "city" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "logo_url" TEXT,
    "status" "TenantStatus" NOT NULL DEFAULT 'TRIAL',
    "plan" "TenantPlan" NOT NULL DEFAULT 'STARTER',
    "daily_booking_limit" INTEGER NOT NULL DEFAULT 50,
    "trial_ends_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "tenants_slug_key" ON "tenants"("slug");

ALTER TABLE "users" ADD COLUMN "tenant_id" TEXT;
ALTER TABLE "users" DROP CONSTRAINT IF EXISTS "users_email_key";
CREATE UNIQUE INDEX "users_tenant_id_email_key" ON "users"("tenant_id", "email");
CREATE INDEX "users_tenant_id_idx" ON "users"("tenant_id");
ALTER TABLE "users" ADD CONSTRAINT "users_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "patients" ADD COLUMN "tenant_id" TEXT;
UPDATE "patients" SET "tenant_id" = (SELECT "id" FROM "tenants" LIMIT 1) WHERE "tenant_id" IS NULL;
ALTER TABLE "patients" ALTER COLUMN "tenant_id" SET NOT NULL;
ALTER TABLE "patients" DROP CONSTRAINT IF EXISTS "patients_national_id_key";
CREATE UNIQUE INDEX "patients_tenant_id_national_id_key" ON "patients"("tenant_id", "national_id");
CREATE INDEX "patients_tenant_id_idx" ON "patients"("tenant_id");
ALTER TABLE "patients" ADD CONSTRAINT "patients_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "appointments" ADD COLUMN "tenant_id" TEXT;
UPDATE "appointments" SET "tenant_id" = (SELECT "id" FROM "tenants" LIMIT 1) WHERE "tenant_id" IS NULL;
ALTER TABLE "appointments" ALTER COLUMN "tenant_id" SET NOT NULL;
CREATE INDEX "appointments_tenant_id_appointment_date_status_idx" ON "appointments"("tenant_id", "appointment_date", "status");
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "guest_bookings" ADD COLUMN "tenant_id" TEXT;
UPDATE "guest_bookings" SET "tenant_id" = (SELECT "id" FROM "tenants" LIMIT 1) WHERE "tenant_id" IS NULL;
ALTER TABLE "guest_bookings" ALTER COLUMN "tenant_id" SET NOT NULL;
CREATE INDEX "guest_bookings_tenant_id_appointment_date_status_idx" ON "guest_bookings"("tenant_id", "appointment_date", "status");
ALTER TABLE "guest_bookings" ADD CONSTRAINT "guest_bookings_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "test_results" ADD COLUMN "tenant_id" TEXT;
UPDATE "test_results" SET "tenant_id" = (SELECT "id" FROM "tenants" LIMIT 1) WHERE "tenant_id" IS NULL;
ALTER TABLE "test_results" ALTER COLUMN "tenant_id" SET NOT NULL;
CREATE INDEX "test_results_tenant_id_idx" ON "test_results"("tenant_id");
ALTER TABLE "test_results" ADD CONSTRAINT "test_results_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "complaints" ADD COLUMN "tenant_id" TEXT;
UPDATE "complaints" SET "tenant_id" = (SELECT "id" FROM "tenants" LIMIT 1) WHERE "tenant_id" IS NULL;
ALTER TABLE "complaints" ALTER COLUMN "tenant_id" SET NOT NULL;
CREATE INDEX "complaints_tenant_id_idx" ON "complaints"("tenant_id");
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "lab_services" ADD COLUMN "tenant_id" TEXT;
UPDATE "lab_services" SET "tenant_id" = (SELECT "id" FROM "tenants" LIMIT 1) WHERE "tenant_id" IS NULL;
ALTER TABLE "lab_services" ALTER COLUMN "tenant_id" SET NOT NULL;
ALTER TABLE "lab_services" DROP CONSTRAINT IF EXISTS "lab_services_slug_key";
CREATE UNIQUE INDEX "lab_services_tenant_id_slug_key" ON "lab_services"("tenant_id", "slug");
CREATE INDEX "lab_services_tenant_id_idx" ON "lab_services"("tenant_id");
ALTER TABLE "lab_services" ADD CONSTRAINT "lab_services_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
