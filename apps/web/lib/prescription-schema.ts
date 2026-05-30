import { z } from 'zod';

export const medicineFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  dosageForm: z.string().min(1, 'Dosage form is required').max(100),
  strength: z.string().min(1, 'Strength is required').max(100),
  notes: z.string().max(500).optional(),
});

export type MedicineFormValues = z.infer<typeof medicineFormSchema>;

export const prescriptionItemSchema = z.object({
  medicineId: z.number(),
  medicineName: z.string(),
  dosageForm: z.string(),
  strength: z.string(),
  dosage: z.string().min(1, 'Dosage instructions required').max(500),
  frequency: z.string().min(1, 'Frequency required').max(100),
  duration: z.string().min(1, 'Duration required').max(100),
});

export const headerThemeSchema = z.object({
  layout: z.enum(['classic', 'minimal', 'bordered']).default('classic'),
  accentColor: z.string().default('#1e3a5f'),
  showSeparator: z.boolean().default(true),
});

export const prescriptionFormSchema = z.object({
  patientName: z.string().min(1, 'Patient name is required').max(200),
  age: z.coerce.number().min(0).max(150),
  gender: z.enum(['MALE', 'FEMALE']),
  date: z.string().min(1),
  clinicNameSnapshot: z.string().min(1).max(200),
  logoUrl: z.string().optional(),
  signatureUrl: z.string().optional(),
  headerTheme: headerThemeSchema,
  status: z.enum(['DRAFT', 'FINALIZED']).default('DRAFT'),
  items: z.array(prescriptionItemSchema).min(1, 'Add at least one medicine'),
});

export type PrescriptionFormValues = z.infer<typeof prescriptionFormSchema>;
export type PrescriptionItemFormValues = z.infer<typeof prescriptionItemSchema>;
export type HeaderThemeValues = z.infer<typeof headerThemeSchema>;

export const ACCENT_COLORS = [
  { label: 'Navy', value: '#1e3a5f' },
  { label: 'Teal', value: '#0d9488' },
  { label: 'Blue', value: '#2563eb' },
  { label: 'Slate', value: '#475569' },
] as const;
