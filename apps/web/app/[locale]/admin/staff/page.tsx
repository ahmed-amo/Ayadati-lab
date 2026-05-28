'use client';

import StaffList from '@/components/staff/staff-list';

export default function AdminStaffPage() {
  return (
    <StaffList
      onAdd={() => {
        // TODO: wire to real add-staff flow
      }}
      onEdit={() => {
        // TODO: wire to real edit-staff flow
      }}
    />
  );
}
