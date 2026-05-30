'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useReactToPrint } from 'react-to-print';
import {
  Download,
  Eye,
  FileText,
  Save,
  Trash2,
  Upload,
} from 'lucide-react';
import { toast } from 'sonner';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createPrescription,
  downloadPrescriptionPdf,
  fetchPrescription,
  searchPatients,
  updatePrescription,
  uploadPrescriptionLogo,
  uploadPrescriptionSignature,
  type MedicineDto,
  type PatientSuggestion,
} from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { useTenant } from '@/lib/tenant-context';
import { tenantBasePath } from '@/lib/tenant-paths';
import {
  ACCENT_COLORS,
  prescriptionFormSchema,
  type PrescriptionFormValues,
} from '@/lib/prescription-schema';
import { MedicineSelector } from './medicine-selector';
import { PrescriptionPreview } from './prescription-preview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PrescriptionBuilderProps {
  prescriptionId?: number;
}

export function PrescriptionBuilder({ prescriptionId }: PrescriptionBuilderProps) {
  const { tenantSlug, tenant } = useTenant();
  const { user } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const printRef = useRef<HTMLDivElement>(null);
  const [savedId, setSavedId] = useState<number | undefined>(prescriptionId);
  const [patientSuggestions, setPatientSuggestions] = useState<PatientSuggestion[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);

  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionFormSchema),
    defaultValues: {
      patientName: '',
      age: 0,
      gender: 'MALE',
      date: new Date().toISOString().slice(0, 10),
      clinicNameSnapshot: tenant?.name ?? '',
      logoUrl: tenant?.logoUrl ?? undefined,
      signatureUrl: undefined,
      headerTheme: {
        layout: 'classic',
        accentColor: '#1e3a5f',
        showSeparator: true,
      },
      status: 'DRAFT',
      items: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const watchAll = form.watch();

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Prescription-${watchAll.patientName || 'draft'}`,
  });

  const loadPrescription = useCallback(async () => {
    if (!prescriptionId) return;
    try {
      const data = await fetchPrescription(tenantSlug, prescriptionId);
      form.reset({
        patientName: data.patientName,
        age: data.age,
        gender: data.gender,
        date: data.date,
        clinicNameSnapshot: data.clinicNameSnapshot,
        logoUrl: data.logoUrl ?? undefined,
        signatureUrl: data.signatureUrl ?? undefined,
        headerTheme: {
          layout: (data.headerTheme?.layout as 'classic' | 'minimal' | 'bordered') ?? 'classic',
          accentColor: data.headerTheme?.accentColor ?? '#1e3a5f',
          showSeparator: data.headerTheme?.showSeparator ?? true,
        },
        status: data.status,
        items: data.items.map((item) => ({
          medicineId: item.medicine.id,
          medicineName: item.medicine.name,
          dosageForm: item.medicine.dosageForm,
          strength: item.medicine.strength,
          dosage: item.dosage,
          frequency: item.frequency,
          duration: item.duration,
        })),
      });
      setSavedId(data.id);
    } catch {
      toast.error('Failed to load prescription');
    }
  }, [prescriptionId, tenantSlug, form]);

  useEffect(() => {
    loadPrescription();
  }, [loadPrescription]);

  useEffect(() => {
    const name = watchAll.patientName;
    if (name.length < 2) {
      setPatientSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const results = await searchPatients(tenantSlug, name);
        setPatientSuggestions(results);
      } catch {
        setPatientSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [watchAll.patientName, tenantSlug]);

  function handleAddMedicine(medicine: MedicineDto) {
    append({
      medicineId: medicine.id,
      medicineName: medicine.name,
      dosageForm: medicine.dosageForm,
      strength: medicine.strength,
      dosage: '',
      frequency: '2x/day',
      duration: '5 days',
    });
  }

  function applyPatientSuggestion(p: PatientSuggestion) {
    form.setValue('patientName', p.patientName);
    form.setValue('age', p.age);
    form.setValue('gender', p.gender);
    setPatientSuggestions([]);
  }

  async function handleUpload(
    kind: 'logo' | 'signature',
    file: File,
  ) {
    try {
      const url =
        kind === 'logo'
          ? await uploadPrescriptionLogo(tenantSlug, file)
          : await uploadPrescriptionSignature(tenantSlug, file);
      form.setValue(kind === 'logo' ? 'logoUrl' : 'signatureUrl', url);
      toast.success(`${kind === 'logo' ? 'Logo' : 'Signature'} uploaded`);
    } catch {
      toast.error('Upload failed');
    }
  }

  async function save(status: 'DRAFT' | 'FINALIZED') {
    const valid = await form.trigger();
    if (!valid && status === 'FINALIZED') return;

    setSaving(true);
    try {
      const values = form.getValues();
      const payload = {
        patientName: values.patientName,
        age: values.age,
        gender: values.gender,
        date: values.date,
        clinicNameSnapshot: values.clinicNameSnapshot,
        logoUrl: values.logoUrl,
        signatureUrl: values.signatureUrl,
        headerTheme: values.headerTheme,
        status,
        items: values.items.map((item) => ({
          medicineId: item.medicineId,
          dosage: item.dosage,
          frequency: item.frequency,
          duration: item.duration,
        })),
      };

      const result = savedId
        ? await updatePrescription(tenantSlug, savedId, payload)
        : await createPrescription(tenantSlug, payload);

      setSavedId(result.id);
      form.setValue('status', status);
      toast.success(status === 'DRAFT' ? 'Draft saved' : 'Prescription generated');

      if (status === 'FINALIZED' && !prescriptionId) {
        router.push(
          `${tenantBasePath(locale, tenantSlug)}/auditor/prescriptions/${result.id}`,
        );
      }
    } catch {
      toast.error('Failed to save prescription');
    } finally {
      setSaving(false);
    }
  }

  async function handleDownloadPdf() {
    if (!savedId) {
      toast.error('Save the prescription first');
      return;
    }
    try {
      const blob = await downloadPrescriptionPdf(tenantSlug, savedId);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `prescription-${savedId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error('PDF download failed');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-brand-navy">
            {prescriptionId ? 'Edit prescription' : 'New prescription'}
          </h1>
          <p className="text-sm text-muted-foreground">
            Build and print a professional prescription document.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => save('DRAFT')}
            disabled={saving}
          >
            <Save className="mr-2 h-4 w-4" />
            Save draft
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="lg:hidden"
          >
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button
            variant="outline"
            onClick={handlePrint}
            disabled={watchAll.items.length === 0}
          >
            <FileText className="mr-2 h-4 w-4" />
            Print
          </Button>
          {savedId && (
            <Button variant="outline" onClick={handleDownloadPdf}>
              <Download className="mr-2 h-4 w-4" />
              PDF
            </Button>
          )}
          <Button
            className="bg-brand-teal hover:bg-brand-teal/90"
            onClick={() => save('FINALIZED')}
            disabled={saving}
          >
            Generate prescription
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Patient information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Label htmlFor="patientName">Full name</Label>
                <Input
                  id="patientName"
                  {...form.register('patientName')}
                  placeholder="Patient full name"
                  autoComplete="off"
                />
                {patientSuggestions.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full rounded-md border bg-white shadow-lg">
                    {patientSuggestions.map((p) => (
                      <button
                        key={p.patientName}
                        type="button"
                        className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-50"
                        onClick={() => applyPatientSuggestion(p)}
                      >
                        <span>{p.patientName}</span>
                        <span className="text-xs text-muted-foreground">
                          {p.age}y · {p.gender.toLowerCase()}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    {...form.register('age', { valueAsNumber: true })}
                  />
                </div>
                <div>
                  <Label>Gender</Label>
                  <Select
                    value={watchAll.gender}
                    onValueChange={(v) =>
                      form.setValue('gender', v as 'MALE' | 'FEMALE')
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MALE">Male</SelectItem>
                      <SelectItem value="FEMALE">Female</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" type="date" {...form.register('date')} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Header design</CardTitle>
              <CardDescription>Structured layout — logo, name, signature</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="clinicName">Clinic name</Label>
                <Input id="clinicName" {...form.register('clinicNameSnapshot')} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Clinic logo</Label>
                  <label className="mt-1 flex cursor-pointer items-center gap-2 rounded-md border border-dashed p-3 text-sm text-muted-foreground hover:bg-gray-50">
                    <Upload className="h-4 w-4" />
                    Upload logo
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void handleUpload('logo', file);
                      }}
                    />
                  </label>
                </div>
                <div>
                  <Label>Doctor signature</Label>
                  <label className="mt-1 flex cursor-pointer items-center gap-2 rounded-md border border-dashed p-3 text-sm text-muted-foreground hover:bg-gray-50">
                    <Upload className="h-4 w-4" />
                    Upload signature
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) void handleUpload('signature', file);
                      }}
                    />
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Layout style</Label>
                  <Select
                    value={watchAll.headerTheme.layout}
                    onValueChange={(v) =>
                      form.setValue('headerTheme.layout', v as 'classic' | 'minimal' | 'bordered')
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="bordered">Bordered</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Accent color</Label>
                  <Select
                    value={watchAll.headerTheme.accentColor}
                    onValueChange={(v) =>
                      form.setValue('headerTheme.accentColor', v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ACCENT_COLORS.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          <span className="flex items-center gap-2">
                            <span
                              className="inline-block h-3 w-3 rounded-full"
                              style={{ backgroundColor: c.value }}
                            />
                            {c.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="separator">Show header separator</Label>
                <Switch
                  id="separator"
                  checked={watchAll.headerTheme.showSeparator}
                  onCheckedChange={(v) =>
                    form.setValue('headerTheme.showSeparator', v)
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Medicines</CardTitle>
              <CardDescription>
                {fields.length} medicine{fields.length !== 1 ? 's' : ''} added
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <MedicineSelector
                onSelect={handleAddMedicine}
                excludeIds={fields.map((f) => f.medicineId)}
              />

              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-lg border bg-gray-50/50 p-4"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <p className="font-medium">{field.medicineName}</p>
                      <p className="text-xs text-muted-foreground">
                        {field.dosageForm} · {field.strength}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <Label className="text-xs">Dosage instructions</Label>
                      <Input
                        {...form.register(`items.${index}.dosage`)}
                        placeholder="1 tablet after meals"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Frequency</Label>
                      <Input
                        {...form.register(`items.${index}.frequency`)}
                        placeholder="2x/day"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Duration</Label>
                      <Input
                        {...form.register(`items.${index}.duration`)}
                        placeholder="5 days"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className={`space-y-4 ${showPreview ? 'block' : 'hidden lg:block'}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-brand-navy">Live preview</h2>
            {watchAll.status && (
              <Badge variant={watchAll.status === 'DRAFT' ? 'secondary' : 'default'}>
                {watchAll.status}
              </Badge>
            )}
          </div>
          <div className="overflow-hidden rounded-xl border bg-gray-100 p-4 print:border-0 print:bg-white print:p-0">
            <PrescriptionPreview
              ref={printRef}
              data={watchAll}
              doctorName={user?.fullName}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
