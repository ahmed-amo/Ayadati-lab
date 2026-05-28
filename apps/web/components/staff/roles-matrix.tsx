'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

interface RolePermission {
  role: string;
  permissions: Record<string, boolean>;
}

const PERMISSION_LIST = [
  'View Results',
  'Create Results',
  'Edit Results',
  'Delete Results',
  'View Appointments',
  'Create Appointments',
  'Reschedule Appointments',
  'Cancel Appointments',
  'View Invoices',
  'Create Invoices',
  'Approve Payments',
  'View Financial Reports',
  'View Complaints',
  'Respond to Complaints',
  'Resolve Complaints',
  'Escalate Complaints',
];

const INITIAL_ROLES: RolePermission[] = [
  {
    role: 'Admin',
    permissions: Object.fromEntries(PERMISSION_LIST.map((p) => [p, true])),
  },
  {
    role: 'Auditor',
    permissions: {
      'View Results': true,
      'Create Results': false,
      'Edit Results': false,
      'Delete Results': false,
      'View Appointments': true,
      'Create Appointments': false,
      'Reschedule Appointments': false,
      'Cancel Appointments': false,
      'View Invoices': true,
      'Create Invoices': false,
      'Approve Payments': false,
      'View Financial Reports': true,
      'View Complaints': true,
      'Respond to Complaints': false,
      'Resolve Complaints': false,
      'Escalate Complaints': false,
    },
  },
  {
    role: 'Nurse',
    permissions: {
      'View Results': true,
      'Create Results': true,
      'Edit Results': true,
      'Delete Results': false,
      'View Appointments': true,
      'Create Appointments': true,
      'Reschedule Appointments': true,
      'Cancel Appointments': false,
      'View Invoices': false,
      'Create Invoices': false,
      'Approve Payments': false,
      'View Financial Reports': false,
      'View Complaints': true,
      'Respond to Complaints': true,
      'Resolve Complaints': false,
      'Escalate Complaints': true,
    },
  },
  {
    role: 'Receptionist',
    permissions: {
      'View Results': false,
      'Create Results': false,
      'Edit Results': false,
      'Delete Results': false,
      'View Appointments': true,
      'Create Appointments': true,
      'Reschedule Appointments': true,
      'Cancel Appointments': true,
      'View Invoices': true,
      'Create Invoices': true,
      'Approve Payments': false,
      'View Financial Reports': false,
      'View Complaints': true,
      'Respond to Complaints': true,
      'Resolve Complaints': false,
      'Escalate Complaints': false,
    },
  },
];

const roleColors: Record<string, string> = {
  Admin: 'bg-role-admin text-white',
  Auditor: 'bg-role-auditor text-white',
  Nurse: 'bg-role-nurse text-white',
  Receptionist: 'bg-role-receptionist text-white',
};

export default function RolesMatrix() {
  const { t } = useLanguage();
  const [roles, setRoles] = useState<RolePermission[]>(INITIAL_ROLES);

  const handlePermissionChange = (roleIndex: number, permission: string, value: boolean) => {
    // Admin role is always read-only
    if (roles[roleIndex].role === 'Admin') return;

    const updatedRoles = [...roles];
    updatedRoles[roleIndex].permissions[permission] = value;
    setRoles(updatedRoles);
  };

  const getPermissionCount = (permissions: Record<string, boolean>) => {
    return Object.values(permissions).filter(Boolean).length;
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('roles.title')}</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">Configure granular access control for each role</p>
      </div>

      {/* Read-only Notice */}
      <div className="flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-primary/10 border border-primary/30 rounded-lg">
        <AlertCircle className="text-primary mt-0.5 flex-shrink-0" size={18} />
        <div>
          <p className="font-medium text-sm md:text-base text-foreground">Admin role is read-only</p>
          <p className="text-xs md:text-sm text-muted-foreground">
            Only Admin users can view this matrix. Other roles can only be modified by administrators.
          </p>
        </div>
      </div>

      {/* Role Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        {roles.map((role) => (
          <Card key={role.role} className="border-border">
            <CardContent className="pt-3 md:pt-6">
              <div className="space-y-2 md:space-y-3">
                <Badge className={`${roleColors[role.role]} rounded-full w-fit text-xs md:text-sm`}>{role.role}</Badge>
                <div>
                  <p className="text-xl md:text-2xl font-bold text-foreground">
                    {getPermissionCount(role.permissions)}
                  </p>
                  <p className="text-xs md:text-xs text-muted-foreground">{t('roles.permissionCount')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Permissions Matrix */}
      <Card className="border-border">
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="text-lg md:text-xl">{t('roles.matrix')}</CardTitle>
          <CardDescription className="text-xs md:text-sm">{t('roles.readOnly')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 md:py-4 px-2 md:px-4 font-semibold text-foreground min-w-40 md:w-48 text-xs md:text-sm">Permission</th>
                  {roles.map((role) => (
                    <th key={role.role} className="text-center py-3 md:py-4 px-2 md:px-4 font-semibold text-foreground min-w-24 md:min-w-32">
                      <Badge className={`${roleColors[role.role]} rounded-full justify-center w-full text-xs md:text-sm`}>
                        {role.role}
                      </Badge>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERMISSION_LIST.map((permission, index) => (
                  <tr
                    key={permission}
                    className={`border-b border-border hover:bg-background/50 transition-colors ${
                      index % 2 === 0 ? 'bg-background/30' : ''
                    }`}
                  >
                    <td className="py-3 md:py-4 px-2 md:px-4 text-xs md:text-sm font-medium text-foreground sticky left-0 bg-inherit">
                      {permission}
                    </td>
                    {roles.map((role) => (
                      <td key={`${role.role}-${permission}`} className="text-center py-3 md:py-4 px-2 md:px-4">
                        {role.role === 'Admin' ? (
                          <div className="flex justify-center">
                            <Checkbox checked={true} disabled className="cursor-not-allowed" />
                          </div>
                        ) : (
                          <Checkbox
                            checked={role.permissions[permission] || false}
                            onCheckedChange={(checked: boolean | 'indeterminate') =>
                              handlePermissionChange(roles.indexOf(role), permission, checked === true)
                            }
                            className="cursor-pointer"
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="border-border bg-background/50">
        <CardContent className="pt-4 md:pt-6">
          <div className="space-y-2 md:space-y-3">
            <p className="text-xs md:text-sm font-medium text-foreground">Legend:</p>
            <div className="grid grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
              <div className="flex items-center gap-2">
                <Checkbox checked={true} disabled />
                <span className="text-muted-foreground">Allowed</span>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox checked={false} disabled />
                <span className="text-muted-foreground">Denied</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
