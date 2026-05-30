'use client';

import { useCallback, useEffect, useState } from 'react';
import { Plus, Search, Pencil, Trash2, Pill } from 'lucide-react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  createMedicine,
  deleteMedicine,
  fetchMedicines,
  updateMedicine,
  type MedicineDto,
} from '@/lib/api';
import { useTenant } from '@/lib/tenant-context';
import {
  medicineFormSchema,
  type MedicineFormValues,
} from '@/lib/prescription-schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function MedicineManager() {
  const { tenantSlug } = useTenant();
  const [medicines, setMedicines] = useState<MedicineDto[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<MedicineDto | null>(null);

  const form = useForm<MedicineFormValues>({
    resolver: zodResolver(medicineFormSchema),
    defaultValues: { name: '', dosageForm: '', strength: '', notes: '' },
  });

  const load = useCallback(async (q?: string) => {
    setLoading(true);
    try {
      const data = await fetchMedicines(tenantSlug, q);
      setMedicines(data);
    } catch {
      toast.error('Failed to load medicines');
    } finally {
      setLoading(false);
    }
  }, [tenantSlug]);

  useEffect(() => {
    const timer = setTimeout(() => load(search), 250);
    return () => clearTimeout(timer);
  }, [search, load]);

  function openCreate() {
    setEditing(null);
    form.reset({ name: '', dosageForm: '', strength: '', notes: '' });
    setDialogOpen(true);
  }

  function openEdit(medicine: MedicineDto) {
    setEditing(medicine);
    form.reset({
      name: medicine.name,
      dosageForm: medicine.dosageForm,
      strength: medicine.strength,
      notes: medicine.notes ?? '',
    });
    setDialogOpen(true);
  }

  async function onSubmit(values: MedicineFormValues) {
    try {
      if (editing) {
        await updateMedicine(tenantSlug, editing.id, values);
        toast.success('Medicine updated');
      } else {
        await createMedicine(tenantSlug, values);
        toast.success('Medicine added');
      }
      setDialogOpen(false);
      await load(search);
    } catch {
      toast.error('Failed to save medicine');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Delete this medicine?')) return;
    try {
      await deleteMedicine(tenantSlug, id);
      toast.success('Medicine deleted');
      await load(search);
    } catch {
      toast.error('Failed to delete medicine');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-brand-navy">Medicines</h1>
          <p className="text-sm text-muted-foreground">
            Manage the clinic medicine catalog used in prescriptions.
          </p>
        </div>
        <Button onClick={openCreate} className="bg-brand-teal hover:bg-brand-teal/90">
          <Plus className="mr-2 h-4 w-4" />
          Add medicine
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Catalog</CardTitle>
          <CardDescription>
            {medicines.length} medicine{medicines.length !== 1 ? 's' : ''} in database
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, form, or strength…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
          ) : medicines.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-muted-foreground">
              <Pill className="mb-3 h-10 w-10 opacity-40" />
              <p className="text-sm">No medicines found. Add your first entry.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Form</TableHead>
                  <TableHead>Strength</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="w-[100px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {medicines.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">{m.name}</TableCell>
                    <TableCell>{m.dosageForm}</TableCell>
                    <TableCell>{m.strength}</TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">
                      {m.notes ?? '—'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEdit(m)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(m.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit medicine' : 'Add medicine'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Paracetamol" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dosageForm"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dosage form</FormLabel>
                      <FormControl>
                        <Input placeholder="Tablet" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="strength"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Strength</FormLabel>
                      <FormControl>
                        <Input placeholder="500mg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (optional)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Take with food…" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-brand-teal hover:bg-brand-teal/90">
                  {editing ? 'Save changes' : 'Add medicine'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
