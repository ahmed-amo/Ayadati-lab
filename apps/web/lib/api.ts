const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

export interface ApiEnvelope<T> {
  data: T;
  statusCode: number;
}

export interface AuthUser {
  id: number;
  email: string;
  fullName: string;
  role: string;
}

export interface LabServiceDto {
  slug: string;
  nameFr: string;
  nameAr: string;
  nameEn: string;
  description: string | null;
}

export interface GuestBookingResult {
  id: number;
  qrToken: string;
  fullName: string;
  appointmentDate: string;
  preferredTime: string;
  testType: string;
  status: string;
}

export interface GuestBookingRow {
  id: number;
  fullName: string;
  phone: string;
  email: string | null;
  appointmentDate: string;
  preferredTime: string;
  testType: string;
  status: string;
  qrToken: string;
  notes: string | null;
}

export interface DashboardStats {
  bookingsPending: number;
  appointmentsToday: number;
  appointmentsTotal: number;
  patients: number;
}

export interface AppointmentRow {
  id: number;
  appointmentDate: string;
  status: string;
  testType: string;
  isWalkin: boolean;
  qrToken: string;
  guestBooking?: {
    fullName: string;
    phone: string;
    preferredTime: string;
  } | null;
  patient?: {
    phone: string;
    user?: { fullName: string; email: string } | null;
  } | null;
}

export interface CreateGuestBookingPayload {
  fullName: string;
  phone: string;
  email?: string;
  nationalId?: string;
  appointmentDate: string;
  preferredTime: string;
  testType: string;
  notes?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function extractMessage(body: unknown): string {
  if (typeof body === 'object' && body !== null) {
    const msg = (body as { message?: unknown }).message;
    if (typeof msg === 'string') return msg;
    if (Array.isArray(msg)) return msg.join(', ');
  }
  return 'Request failed';
}

async function parseJson<T>(response: Response): Promise<T> {
  const body: unknown = await response.json();
  if (!response.ok) {
    throw new ApiError(extractMessage(body), response.status);
  }
  return body as T;
}

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { cache: 'no-store' });
  const json = await parseJson<ApiEnvelope<T>>(res);
  return json.data;
}

async function apiPost<T>(path: string, payload?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload ? JSON.stringify(payload) : undefined,
  });
  const json = await parseJson<ApiEnvelope<T>>(res);
  return json.data;
}

async function apiPatch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { method: 'PATCH' });
  const json = await parseJson<ApiEnvelope<T>>(res);
  return json.data;
}

export async function fetchLabServices(): Promise<LabServiceDto[]> {
  const res = await fetch(`${API_BASE}/public/lab-services`, {
    next: { revalidate: 300 },
  });
  const json = await parseJson<ApiEnvelope<LabServiceDto[]>>(res);
  return json.data;
}

export async function createGuestBooking(
  payload: CreateGuestBookingPayload,
): Promise<GuestBookingResult> {
  return apiPost<GuestBookingResult>('/public/bookings', payload);
}

export async function apiLogin(
  email: string,
  password: string,
): Promise<AuthUser> {
  return apiPost<AuthUser>('/auth/login', { email, password });
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  return apiGet<DashboardStats>('/staff/stats');
}

export async function fetchGuestBookings(): Promise<GuestBookingRow[]> {
  return apiGet<GuestBookingRow[]>('/staff/bookings');
}

export async function confirmGuestBooking(id: number): Promise<void> {
  await apiPatch(`/staff/bookings/${id}/confirm`);
}

export async function fetchAppointments(): Promise<AppointmentRow[]> {
  return apiGet<AppointmentRow[]>('/staff/appointments');
}
