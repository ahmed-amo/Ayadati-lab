import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const DEFAULT_PASSWORD = 'ayadati2026';

const services = [
  {
    slug: 'cbc',
    nameFr: 'Numération formule sanguine (NFS)',
    nameAr: 'تحليل الدم الشامل',
    nameEn: 'Complete Blood Count (CBC)',
    description: 'Hémoglobine, globules rouges, plaquettes, leucocytes',
    sortOrder: 1,
  },
  {
    slug: 'bmp',
    nameFr: 'Bilan métabolique de base',
    nameAr: 'التحليل الأيضي الأساسي',
    nameEn: 'Basic Metabolic Panel',
    description: 'Glucose, électrolytes, fonction rénale',
    sortOrder: 2,
  },
  {
    slug: 'hba1c',
    nameFr: 'Hémoglobine glyquée (HbA1c)',
    nameAr: 'الهيموغلوبين السكري',
    nameEn: 'Hemoglobin A1C',
    description: 'Suivi glycémique sur 3 mois',
    sortOrder: 3,
  },
  {
    slug: 'lipid',
    nameFr: 'Bilan lipidique',
    nameAr: 'تحليل الدهون',
    nameEn: 'Lipid Panel',
    description: 'Cholestérol total, HDL, LDL, triglycérides',
    sortOrder: 4,
  },
  {
    slug: 'thyroid',
    nameFr: 'Bilan thyroïdien',
    nameAr: 'تحليل الغدة الدرقية',
    nameEn: 'Thyroid Function Tests',
    description: 'TSH, T3, T4',
    sortOrder: 5,
  },
];

async function main(): Promise<void> {
  for (const service of services) {
    await prisma.labService.upsert({
      where: { slug: service.slug },
      create: service,
      update: service,
    });
  }
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  const users: Array<{
    email: string;
    fullName: string;
    role: UserRole;
  }> = [
    { email: 'admin@ayadatilab.dz', fullName: 'Admin AYADATI', role: UserRole.ADMIN },
    { email: 'auditor@ayadatilab.dz', fullName: 'Auditor AYADATI', role: UserRole.AUDITOR },
    { email: 'nurse@ayadatilab.dz', fullName: 'Nurse AYADATI', role: UserRole.NURSE },
    {
      email: 'receptionist@ayadatilab.dz',
      fullName: 'Receptionist AYADATI',
      role: UserRole.RECEPTIONIST,
    },
    { email: 'patient@ayadatilab.dz', fullName: 'Patient Demo', role: UserRole.PATIENT },
  ];

  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      create: {
        email: u.email,
        fullName: u.fullName,
        role: u.role,
        passwordHash,
      },
      update: { fullName: u.fullName, role: u.role, passwordHash },
    });
  }

  const patientUser = await prisma.user.findUnique({
    where: { email: 'patient@ayadatilab.dz' },
  });
  if (patientUser) {
    await prisma.patient.upsert({
      where: { userId: patientUser.id },
      create: {
        userId: patientUser.id,
        phone: '0555123456',
        nationalId: 'DEMO0001',
      },
      update: { phone: '0555123456' },
    });
  }

  console.log('Seeded lab services + demo users (password: ayadati2026)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
