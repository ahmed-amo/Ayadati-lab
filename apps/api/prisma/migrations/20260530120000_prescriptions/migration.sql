-- Prescription module: medicines, prescriptions, prescription_items

CREATE TYPE "PrescriptionStatus" AS ENUM ('DRAFT', 'FINALIZED');
CREATE TYPE "PrescriptionGender" AS ENUM ('MALE', 'FEMALE');

CREATE TABLE "medicines" (
    "id" SERIAL NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dosage_form" TEXT NOT NULL,
    "strength" TEXT NOT NULL,
    "notes" TEXT,
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medicines_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "prescriptions" (
    "id" SERIAL NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "patient_name" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "gender" "PrescriptionGender" NOT NULL,
    "date" DATE NOT NULL,
    "status" "PrescriptionStatus" NOT NULL DEFAULT 'DRAFT',
    "clinic_name_snapshot" TEXT NOT NULL,
    "logo_url" TEXT,
    "signature_url" TEXT,
    "header_theme" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prescriptions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "prescription_items" (
    "id" SERIAL NOT NULL,
    "prescription_id" INTEGER NOT NULL,
    "medicine_id" INTEGER NOT NULL,
    "dosage" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "duration" TEXT NOT NULL,

    CONSTRAINT "prescription_items_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "medicines_tenant_id_idx" ON "medicines"("tenant_id");
CREATE INDEX "medicines_tenant_id_name_idx" ON "medicines"("tenant_id", "name");
CREATE INDEX "prescriptions_tenant_id_idx" ON "prescriptions"("tenant_id");
CREATE INDEX "prescriptions_tenant_id_doctor_id_idx" ON "prescriptions"("tenant_id", "doctor_id");
CREATE INDEX "prescriptions_tenant_id_patient_name_idx" ON "prescriptions"("tenant_id", "patient_name");
CREATE INDEX "prescription_items_prescription_id_idx" ON "prescription_items"("prescription_id");

ALTER TABLE "medicines" ADD CONSTRAINT "medicines_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "prescription_items" ADD CONSTRAINT "prescription_items_prescription_id_fkey" FOREIGN KEY ("prescription_id") REFERENCES "prescriptions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "prescription_items" ADD CONSTRAINT "prescription_items_medicine_id_fkey" FOREIGN KEY ("medicine_id") REFERENCES "medicines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
