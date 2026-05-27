import type { LucideIcon } from 'lucide-react';
import {
  CalendarDays,
  ClipboardCheck,
  FlaskConical,
  Home,
  LayoutDashboard,
  ListOrdered,
  MessageSquarePlus,
  TestTube2,
  UserPlus,
  Users,
} from 'lucide-react';

export type AppRole =
  | 'admin'
  | 'auditor'
  | 'nurse'
  | 'receptionist'
  | 'patient';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export function navForRole(locale: string, role: AppRole): NavSection[] {
  const p = `/${locale}`;
  const config: Record<AppRole, NavSection[]> = {
    admin: [
      {
        title: 'Overview',
        items: [
          { label: 'Dashboard', href: `${p}/admin`, icon: LayoutDashboard },
          { label: 'Staff', href: `${p}/admin/staff`, icon: Users },
        ],
      },
    ],
    auditor: [
      {
        title: 'Overview',
        items: [
          { label: 'Dashboard', href: `${p}/auditor`, icon: LayoutDashboard },
          { label: 'Pending results', href: `${p}/auditor/results`, icon: ClipboardCheck },
        ],
      },
    ],
    nurse: [
      {
        title: 'Overview',
        items: [
          { label: 'Dashboard', href: `${p}/nurse`, icon: LayoutDashboard },
          { label: "Today's queue", href: `${p}/nurse/queue`, icon: ListOrdered },
          { label: 'Input results', href: `${p}/nurse/results`, icon: TestTube2 },
        ],
      },
    ],
    receptionist: [
      {
        title: 'Overview',
        items: [
          { label: 'Dashboard', href: `${p}/receptionist`, icon: LayoutDashboard },
          { label: 'Bookings', href: `${p}/receptionist/bookings`, icon: CalendarDays },
          { label: 'Appointments', href: `${p}/receptionist/appointments`, icon: CalendarDays },
        ],
      },
      {
        title: 'Patients',
        items: [
          { label: 'Register', href: `${p}/receptionist/patients/new`, icon: UserPlus },
        ],
      },
    ],
    patient: [
      {
        title: 'My health',
        items: [
          { label: 'Home', href: `${p}/patient`, icon: Home },
          { label: 'My results', href: `${p}/patient/results`, icon: FlaskConical },
          { label: 'Complaints', href: `${p}/patient/complaints`, icon: MessageSquarePlus },
        ],
      },
    ],
  };
  return config[role];
}

export function homeForRole(locale: string, role: AppRole): string {
  const p = `/${locale}`;
  const map: Record<AppRole, string> = {
    admin: `${p}/admin`,
    auditor: `${p}/auditor`,
    nurse: `${p}/nurse`,
    receptionist: `${p}/receptionist`,
    patient: `${p}/patient`,
  };
  return map[role];
}
