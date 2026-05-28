import { PrismaClient, TenantPlan, TenantStatus, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { DEFAULT_LAB_SERVICES } from '../src/modules/tenants/default-lab-services';

const prisma = new PrismaClient();
const DEFAULT_PASSWORD = 'ayadati2026';
const DEMO_SLUG = 'demo-lab';

async function seedTenant(
  slug: string,
  name: string,
  users: Array<{ email: string; fullName: string; role: UserRole }>,
): Promise<void> {
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 14);

  const tenant = await prisma.tenant.upsert({
    where: { slug },
    create: {
      slug,
      name,
      status: TenantStatus.ACTIVE,
      plan: TenantPlan.PRO,
      trialEndsAt,
    },
    update: { name, status: TenantStatus.ACTIVE },
  });

  for (const service of DEFAULT_LAB_SERVICES) {
    await prisma.labService.upsert({
      where: { tenantId_slug: { tenantId: tenant.id, slug: service.slug } },
      create: { tenantId: tenant.id, ...service },
      update: service,
    });
  }

  for (const u of users) {
    await prisma.user.upsert({
      where: { tenantId_email: { tenantId: tenant.id, email: u.email } },
      create: {
        tenantId: tenant.id,
        email: u.email,
        fullName: u.fullName,
        role: u.role,
        passwordHash,
      },
      update: { fullName: u.fullName, role: u.role, passwordHash },
    });
  }

  const patientEmail =
    slug === DEMO_SLUG ? 'patient@ayadatilab.dz' : `patient@${slug.replace(/-/g, '')}.dz`;
  const patientUser = await prisma.user.findUnique({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: patientEmail,
      },
    },
  });

  if (patientUser) {
    await prisma.patient.upsert({
      where: { userId: patientUser.id },
      create: {
        tenantId: tenant.id,
        userId: patientUser.id,
        phone: '0555123456',
        nationalId: 'DEMO0001',
      },
      update: { phone: '0555123456' },
    });
  }
}

async function main(): Promise<void> {
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  await prisma.user.upsert({
    where: { tenantId_email: { tenantId: null, email: 'super@ayadati.dz' } },
    create: {
      tenantId: null,
      email: 'super@ayadati.dz',
      fullName: 'Platform Super Admin',
      role: UserRole.SUPER_ADMIN,
      passwordHash,
    },
    update: { fullName: 'Platform Super Admin', role: UserRole.SUPER_ADMIN, passwordHash },
  });

  await seedTenant(DEMO_SLUG, 'AYADATI LAB Demo', [
    { email: 'admin@ayadatilab.dz', fullName: 'Admin AYADATI', role: UserRole.ADMIN },
    { email: 'auditor@ayadatilab.dz', fullName: 'Auditor AYADATI', role: UserRole.AUDITOR },
    { email: 'nurse@ayadatilab.dz', fullName: 'Nurse AYADATI', role: UserRole.NURSE },
    {
      email: 'receptionist@ayadatilab.dz',
      fullName: 'Receptionist AYADATI',
      role: UserRole.RECEPTIONIST,
    },
    { email: 'patient@ayadatilab.dz', fullName: 'Patient Demo', role: UserRole.PATIENT },
  ]);

  console.log(`Seeded platform super admin + tenant "${DEMO_SLUG}" (password: ${DEFAULT_PASSWORD})`);
  console.log(`Portal: /fr/l/${DEMO_SLUG}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
