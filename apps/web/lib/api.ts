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
  return apiGetAuth<DashboardStats>(tenantApiPath(tenantSlug, '/staff/stats'));
}

export async function fetchGuestBookings(
  tenantSlug: string,
): Promise<GuestBookingRow[]> {
  return apiGetAuth<GuestBookingRow[]>(
    tenantApiPath(tenantSlug, '/staff/bookings'),
  );
}

export async function confirmGuestBooking(
  tenantSlug: string,
  id: number,
): Promise<void> {
  await apiPatchAuth(tenantApiPath(tenantSlug, `/staff/bookings/${id}/confirm`));
}

export async function fetchAppointments(
  tenantSlug: string,
): Promise<AppointmentRow[]> {
  return apiGetAuth<AppointmentRow[]>(
    tenantApiPath(tenantSlug, '/staff/appointments'),
  );
}

// ─── Auth helpers ───────────────────────────────────────────────────────────

function getStoredUserId(): number | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem('ayadati_auth');
    if (!raw) return null;
    const user = JSON.parse(raw) as AuthUser;
    return user.id;
  } catch {
    return null;
  }
}

function authHeaders(): HeadersInit {
  const userId = getStoredUserId();
  return userId ? { 'X-User-Id': String(userId) } : {};
}

async function apiGetAuth<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: 'no-store', headers: authHeaders() });
  const json = await parseJson<ApiEnvelope<T>>(res);
  return json.data;
}

async function apiPostAuth<T>(url: string, payload?: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: payload ? JSON.stringify(payload) : undefined,
  });
  const json = await parseJson<ApiEnvelope<T>>(res);
  return json.data;
}

async function apiPatchAuth<T>(url: string, payload?: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: payload ? JSON.stringify(payload) : undefined,
  });
  const json = await parseJson<ApiEnvelope<T>>(res);
  return json.data;
}

async function apiDeleteAuth(url: string): Promise<void> {
  const res = await fetch(url, {
    method: 'DELETE',
    headers: authHeaders(),
  });
  await parseJson<ApiEnvelope<unknown>>(res);
}

async function apiUploadAuth(
  url: string,
  file: File,
): Promise<{ url: string }> {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(url, {
    method: 'POST',
    headers: authHeaders(),
    body: form,
  });
  const json = await parseJson<ApiEnvelope<{ url: string }>>(res);
  return json.data;
}

// ─── Medicines ──────────────────────────────────────────────────────────────

export interface MedicineDto {
  id: number;
  name: string;
  dosageForm: string;
  strength: string;
  notes: string | null;
  createdAt: string;
}

export interface CreateMedicinePayload {
  name: string;
  dosageForm: string;
  strength: string;
  notes?: string;
}

export async function fetchMedicines(
  tenantSlug: string,
  q?: string,
): Promise<MedicineDto[]> {
  const query = q ? `?q=${encodeURIComponent(q)}` : '';
  return apiGetAuth<MedicineDto[]>(
    tenantApiPath(tenantSlug, `/medicines${query}`),
  );
}

export async function createMedicine(
  tenantSlug: string,
  payload: CreateMedicinePayload,
): Promise<MedicineDto> {
  return apiPostAuth<MedicineDto>(
    tenantApiPath(tenantSlug, '/medicines'),
    payload,
  );
}

export async function updateMedicine(
  tenantSlug: string,
  id: number,
  payload: Partial<CreateMedicinePayload & { notes: string | null }>,
): Promise<MedicineDto> {
  return apiPatchAuth<MedicineDto>(
    tenantApiPath(tenantSlug, `/medicines/${id}`),
    payload,
  );
}

export async function deleteMedicine(
  tenantSlug: string,
  id: number,
): Promise<void> {
  await apiDeleteAuth(tenantApiPath(tenantSlug, `/medicines/${id}`));
}

// ─── Prescriptions ──────────────────────────────────────────────────────────

export interface PrescriptionItemDto {
  id?: number;
  dosage: string;
  frequency: string;
  duration: string;
  medicine: {
    id: number;
    name: string;
    dosageForm: string;
    strength: string;
  };
}

export interface PrescriptionDetailDto {
  id: number;
  patientName: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  date: string;
  status: 'DRAFT' | 'FINALIZED';
  clinicNameSnapshot: string;
  logoUrl: string | null;
  signatureUrl: string | null;
  headerTheme: {
    layout?: string;
    accentColor?: string;
    showSeparator?: boolean;
  } | null;
  createdAt: string;
  updatedAt: string;
  doctor: { id: number; fullName: string };
  items: PrescriptionItemDto[];
}

export interface PrescriptionListItem {
  id: number;
  patientName: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  date: string;
  status: 'DRAFT' | 'FINALIZED';
  itemCount: number;
  createdAt: string;
}

export interface PatientSuggestion {
  patientName: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  lastDate: string;
}

export interface CreatePrescriptionPayload {
  patientName: string;
  age: number;
  gender: 'MALE' | 'FEMALE';
  date: string;
  clinicNameSnapshot: string;
  logoUrl?: string;
  signatureUrl?: string;
  headerTheme?: {
    layout?: string;
    accentColor?: string;
    showSeparator?: boolean;
  };
  status?: 'DRAFT' | 'FINALIZED';
  items: Array<{
    medicineId: number;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
}

export async function fetchPrescriptions(
  tenantSlug: string,
): Promise<PrescriptionListItem[]> {
  return apiGetAuth<PrescriptionListItem[]>(
    tenantApiPath(tenantSlug, '/prescriptions'),
  );
}

export async function fetchPrescription(
  tenantSlug: string,
  id: number,
): Promise<PrescriptionDetailDto> {
  return apiGetAuth<PrescriptionDetailDto>(
    tenantApiPath(tenantSlug, `/prescriptions/${id}`),
  );
}

export async function createPrescription(
  tenantSlug: string,
  payload: CreatePrescriptionPayload,
): Promise<PrescriptionDetailDto> {
  return apiPostAuth<PrescriptionDetailDto>(
    tenantApiPath(tenantSlug, '/prescriptions'),
    payload,
  );
}

export async function updatePrescription(
  tenantSlug: string,
  id: number,
  payload: Partial<CreatePrescriptionPayload>,
): Promise<PrescriptionDetailDto> {
  return apiPatchAuth<PrescriptionDetailDto>(
    tenantApiPath(tenantSlug, `/prescriptions/${id}`),
    payload,
  );
}

export async function duplicatePrescription(
  tenantSlug: string,
  id: number,
): Promise<PrescriptionDetailDto> {
  return apiPostAuth<PrescriptionDetailDto>(
    tenantApiPath(tenantSlug, `/prescriptions/${id}/duplicate`),
  );
}

export async function searchPatients(
  tenantSlug: string,
  q?: string,
): Promise<PatientSuggestion[]> {
  const query = q ? `?q=${encodeURIComponent(q)}` : '';
  return apiGetAuth<PatientSuggestion[]>(
    tenantApiPath(tenantSlug, `/prescriptions/patients/search${query}`),
  );
}

export function prescriptionPdfUrl(tenantSlug: string, id: number): string {
  return tenantApiPath(tenantSlug, `/prescriptions/${id}/pdf`);
}

export async function downloadPrescriptionPdf(
  tenantSlug: string,
  id: number,
): Promise<Blob> {
  const res = await fetch(prescriptionPdfUrl(tenantSlug, id), {
    headers: authHeaders(),
  });
  if (!res.ok) {
    throw new ApiError('Failed to download PDF', res.status);
  }
  return res.blob();
}

export async function uploadPrescriptionLogo(
  tenantSlug: string,
  file: File,
): Promise<string> {
  const result = await apiUploadAuth(
    tenantApiPath(tenantSlug, '/uploads/logo'),
    file,
  );
  return result.url;
}

export async function uploadPrescriptionSignature(
  tenantSlug: string,
  file: File,
): Promise<string> {
  const result = await apiUploadAuth(
    tenantApiPath(tenantSlug, '/uploads/signature'),
    file,
  );
  return result.url;
}

export function resolveUploadUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const base = API_BASE.replace(/\/api\/v1$/, '');
  return `${base}${path}`;
}
