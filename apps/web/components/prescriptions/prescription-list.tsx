'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { Copy, FilePlus, FileText } from 'lucide-react';
import { toast } from 'sonner';
import {
  duplicatePrescription,
  fetchPrescriptions,
  type PrescriptionListItem,
} from '@/lib/api';
import { useTenant } from '@/lib/tenant-context';
import { tenantBasePath } from '@/lib/tenant-paths';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function PrescriptionList() {
  const { tenantSlug } = useTenant();
  const locale = useLocale();
  const base = tenantBasePath(locale, tenantSlug);
  const [prescriptions, setPrescriptions] = useState<PrescriptionListItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchPrescriptions(tenantSlug);
      setPrescriptions(data);
    } catch {
      toast.error('Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  }, [tenantSlug]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDuplicate(id: number) {
    try {
      const copy = await duplicatePrescription(tenantSlug, id);
      toast.success('Prescription duplicated as draft');
      window.location.href = `${base}/auditor/prescriptions/${copy.id}`;
    } catch {
      toast.error('Failed to duplicate');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-brand-navy">Prescriptions</h1>
          <p className="text-sm text-muted-foreground">
            Create, manage, and reuse patient prescriptions.
          </p>
        </div>
        <Button asChild className="bg-brand-teal hover:bg-brand-teal/90">
          <Link href={`${base}/auditor/prescriptions/new`}>
            <FilePlus className="mr-2 h-4 w-4" />
            New prescription
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent prescriptions</CardTitle>
          <CardDescription>
            Drafts and finalized prescriptions for your clinic
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
          ) : prescriptions.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-muted-foreground">
              <FileText className="mb-3 h-10 w-10 opacity-40" />
              <p className="text-sm">No prescriptions yet.</p>
              <Button asChild variant="link" className="mt-2">
                <Link href={`${base}/auditor/prescriptions/new`}>
                  Create your first prescription
                </Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Medicines</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[140px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescriptions.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{p.patientName}</p>
                        <p className="text-xs text-muted-foreground">
                          {p.age}y · {p.gender.toLowerCase()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{p.date}</TableCell>
                    <TableCell>{p.itemCount}</TableCell>
                    <TableCell>
                      <Badge variant={p.status === 'DRAFT' ? 'secondary' : 'default'}>
                        {p.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`${base}/auditor/prescriptions/${p.id}`}>
                            Open
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Duplicate as draft"
                          onClick={() => handleDuplicate(p.id)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
