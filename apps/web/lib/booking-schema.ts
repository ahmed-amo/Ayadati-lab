import { z } from 'zod';

export const guestBookingSchema = z.object({
  fullName: z.string().min(2).max(120),
  phone: z.string().regex(/^0[5-7][0-9]{8}$/, 'Invalid Algerian mobile'),
  email: z.string().email().optional().or(z.literal('')),
  nationalId: z.string().max(20).optional().or(z.literal('')),
  appointmentDate: z.string().min(1),
  preferredTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  testType: z.string().min(1),
  notes: z.string().max(1000).optional().or(z.literal('')),
});

export type GuestBookingFormValues = z.infer<typeof guestBookingSchema>;
