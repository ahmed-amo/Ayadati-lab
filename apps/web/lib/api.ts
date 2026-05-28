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
  tenantId: string;
  tenantSlug: string;
  tenantName: string;
}

export interface TenantPublicProfile {
  slug: string;
  name: string;
  nameAr: string | null;
  city: string | null;
  phone: string | null;
  logoUrl: string | null;
  plan: string;
  status: string;
}

export interface TenantListItem {
  slug: string;
  name: string;
  nameAr: string | null;
  city: string | null;
  plan: string;
  status: string;
}

export interface RegisterTenantPayload {
  labName: string;
  slug: string;
  adminEmail: string;
  adminFullName: string;
  adminPassword: string;
  city?: string;
  phone?: string;
}

export interface RegisterTenantResult {
  tenant: TenantPublicProfile;
  admin: { email: string; fullName: string; role: string };
  portalUrl: string;
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
  tenantSlug?: string;
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

function tenantApiPath(tenantSlug: string, path: string): string {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE}/t/${tenantSlug}${normalized}`;
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

async function apiGet<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: 'no-store' });
  const json = await parseJson<ApiEnvelope<T>>(res);
  return json.data;
}

async function apiPost<T>(url: string, payload?: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: payload ? JSON.stringify(payload) : undefined,
  });
  const json = await parseJson<ApiEnvelope<T>>(res);
  return json.data;
}

async function apiPatch<T>(url: string): Promise<T> {
  const res = await fetch(url, { method: 'PATCH' });
  const json = await parseJson<ApiEnvelope<T>>(res);
  return json.data;
}

export async function fetchTenants(): Promise<TenantListItem[]> {
  return apiGet<TenantListItem[]>(`${API_BASE}/tenants`);
}

export async function fetchTenantProfile(
  slug: string,
): Promise<TenantPublicProfile> {
  return apiGet<TenantPublicProfile>(`${API_BASE}/tenants/${slug}`);
}

export async function registerTenant(
  payload: RegisterTenantPayload,
): Promise<RegisterTenantResult> {
  return apiPost<RegisterTenantResult>(`${API_BASE}/tenants/register`, payload);
}

export async function fetchLabServices(
  tenantSlug: string,
): Promise<LabServiceDto[]> {
  const res = await fetch(
    tenantApiPath(tenantSlug, '/public/lab-services'),
    { next: { revalidate: 300 } },
  );
  const json = await parseJson<ApiEnvelope<LabServiceDto[]>>(res);
  return json.data;
}

export async function createGuestBooking(
  tenantSlug: string,
  payload: CreateGuestBookingPayload,
): Promise<GuestBookingResult> {
  return apiPost<GuestBookingResult>(
    tenantApiPath(tenantSlug, '/public/bookings'),
    payload,
  );
}

export async function apiLogin(
  tenantSlug: string,
  email: string,
  password: string,
): Promise<AuthUser> {
  return apiPost<AuthUser>(tenantApiPath(tenantSlug, '/auth/login'), {
    email,
    password,
  });
}

export async function fetchDashboardStats(
  tenantSlug: string,
): Promise<DashboardStats> {
  return apiGet<DashboardStats>(tenantApiPath(tenantSlug, '/staff/stats'));
}

export async function fetchGuestBookings(
  tenantSlug: string,
): Promise<GuestBookingRow[]> {
  return apiGet<GuestBookingRow[]>(
    tenantApiPath(tenantSlug, '/staff/bookings'),
  );
}

export async function confirmGuestBooking(
  tenantSlug: string,
  id: number,
): Promise<void> {
  await apiPatch(tenantApiPath(tenantSlug, `/staff/bookings/${id}/confirm`));
}

export async function fetchAppointments(
  tenantSlug: string,
): Promise<AppointmentRow[]> {
  return apiGet<AppointmentRow[]>(
    tenantApiPath(tenantSlug, '/staff/appointments'),
  );
}
