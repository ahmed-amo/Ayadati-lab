'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

interface StaffFormProps {
  staffId: string | null;
  onBack: () => void;
}

interface PermissionGroup {
  name: string;
  permissions: { id: string; label: string }[];
}

const getPermissionGroups = (t: (key: string) => string): PermissionGroup[] => [
  {
    name: t('form.labResults'),
    permissions: [
      { id: 'view_results', label: 'View Results' },
      { id: 'create_results', label: 'Create Results' },
      { id: 'edit_results', label: 'Edit Results' },
      { id: 'delete_results', label: 'Delete Results' },
    ],
  },
  {
    name: t('form.appointments'),
    permissions: [
      { id: 'view_appointments', label: 'View Appointments' },
      { id: 'create_appointments', label: 'Create Appointments' },
      { id: 'reschedule_appointments', label: 'Reschedule Appointments' },
      { id: 'cancel_appointments', label: 'Cancel Appointments' },
    ],
  },
  {
    name: t('form.finance'),
    permissions: [
      { id: 'view_invoices', label: 'View Invoices' },
      { id: 'create_invoices', label: 'Create Invoices' },
      { id: 'approve_payments', label: 'Approve Payments' },
      { id: 'view_reports', label: 'View Financial Reports' },
    ],
  },
  {
    name: t('form.complaints'),
    permissions: [
      { id: 'view_complaints', label: 'View Complaints' },
      { id: 'respond_complaints', label: 'Respond to Complaints' },
      { id: 'resolve_complaints', label: 'Resolve Complaints' },
      { id: 'escalate_complaints', label: 'Escalate Complaints' },
    ],
  },
];

const ROLES = ['Admin', 'Auditor', 'Nurse', 'Receptionist', 'Patient'];

export default function StaffForm({ staffId, onBack }: StaffFormProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    fullName: staffId ? 'John Doe' : '',
    email: staffId ? 'john.doe@bravelab.com' : '',
    phone: staffId ? '+1 (555) 123-4567' : '',
    role: staffId ? 'Nurse' : '',
    department: staffId ? 'Laboratory' : '',
    active: staffId ? true : false,
  });

  const [permissions, setPermissions] = useState<Record<string, boolean>>({});

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePermissionChange = (permissionId: string) => {
    setPermissions((prev) => ({
      ...prev,
      [permissionId]: !prev[permissionId],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', { ...formData, permissions });
    onBack();
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-start gap-2 md:gap-4">
        <Button
          onClick={onBack}
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground cursor-pointer mt-1"
        >
          <ArrowLeft size={18} />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {staffId ? t('form.title.edit') : t('form.title.add')}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            {staffId ? 'Update staff information and permissions' : 'Create a new staff account'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Left Column - Basic Info */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Basic Information Card */}
          <Card className="border-border">
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="text-lg md:text-xl">Basic Information</CardTitle>
              <CardDescription className="text-xs md:text-sm">Enter staff member details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-xs md:text-sm font-medium text-foreground">
                      {t('form.fullName')}
                    </Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="John Doe"
                      className="border-input-border"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs md:text-sm font-medium text-foreground">
                      {t('form.email')}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="john@example.com"
                      className="border-input-border text-sm"
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs md:text-sm font-medium text-foreground">
                      {t('form.phone')}
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="border-input-border text-sm"
                    />
                  </div>

                  {/* Department */}
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-xs md:text-sm font-medium text-foreground">
                      {t('form.department')}
                    </Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      placeholder="e.g., Laboratory"
                      className="border-input-border"
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-2 md:space-y-3">
                  <Label className="text-xs md:text-sm font-medium text-foreground">{t('form.role')}</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
                    {ROLES.map((role) => (
                      <label
                        key={role}
                        className={`flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                          formData.role === role
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-border/80'
                        }`}
                      >
                        <input
                          type="radio"
                          name="role"
                          value={role}
                          checked={formData.role === role}
                          onChange={(e) => handleInputChange('role', e.target.value)}
                          className="form-radio text-primary cursor-pointer"
                        />
                        <span className="text-xs md:text-sm font-medium text-foreground">{role}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Active Status */}
                <div className="flex items-center justify-between p-3 md:p-4 bg-background rounded-lg border border-border">
                  <div>
                    <p className="text-sm md:text-base font-medium text-foreground">{t('form.status')}</p>
                    <p className="text-xs md:text-sm text-muted-foreground">
                      {formData.active ? 'Account is active' : 'Account is inactive'}
                    </p>
                  </div>
                  <Switch
                    checked={formData.active}
                    onCheckedChange={(value) => handleInputChange('active', value)}
                    className="cursor-pointer"
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-4 md:pt-6 border-t border-border">
                  <Button onClick={onBack} variant="outline" className="border-border cursor-pointer order-2 sm:order-1">
                    {t('form.cancel')}
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer order-1 sm:order-2">
                    {staffId ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Permissions */}
        <div>
          <Card className="border-border sticky top-20">
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="text-lg md:text-xl">{t('form.permissions')}</CardTitle>
              <CardDescription className="text-xs md:text-sm">Manage module access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 md:space-y-6">
              {getPermissionGroups(t).map((group) => (
                <div key={group.name} className="space-y-2 md:space-y-3">
                  <h4 className="font-semibold text-xs md:text-sm text-foreground">{group.name}</h4>
                  <div className="space-y-1 md:space-y-2">
                    {group.permissions.map((permission) => (
                      <label
                        key={permission.id}
                        className="flex items-center gap-2 cursor-pointer group"
                      >
                        <Checkbox
                          checked={permissions[permission.id] || false}
                          onCheckedChange={() => handlePermissionChange(permission.id)}
                          className="border-input-border cursor-pointer"
                        />
                        <span className="text-xs md:text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                          {permission.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
