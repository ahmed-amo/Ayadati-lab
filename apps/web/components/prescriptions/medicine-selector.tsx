'use client';

import { useCallback, useEffect, useState } from 'react';
import { Check, ChevronsUpDown, Pill, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fetchMedicines, type MedicineDto } from '@/lib/api';
import { useTenant } from '@/lib/tenant-context';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface MedicineSelectorProps {
  onSelect: (medicine: MedicineDto) => void;
  excludeIds?: number[];
}

export function MedicineSelector({ onSelect, excludeIds = [] }: MedicineSelectorProps) {
  const { tenantSlug } = useTenant();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [medicines, setMedicines] = useState<MedicineDto[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (q: string) => {
    setLoading(true);
    try {
      const data = await fetchMedicines(tenantSlug, q);
      setMedicines(data.filter((m) => !excludeIds.includes(m.id)));
    } catch {
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  }, [tenantSlug, excludeIds]);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => load(search), 200);
    return () => clearTimeout(timer);
  }, [search, open, load]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between border-dashed"
        >
          <span className="flex items-center gap-2 text-muted-foreground">
            <Plus className="h-4 w-4" />
            Add medicine…
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search medicines…"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            {loading ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Searching…
              </div>
            ) : (
              <>
                <CommandEmpty>No medicines found.</CommandEmpty>
                <CommandGroup>
                  {medicines.map((medicine) => (
                    <CommandItem
                      key={medicine.id}
                      value={String(medicine.id)}
                      onSelect={() => {
                        onSelect(medicine);
                        setOpen(false);
                        setSearch('');
                      }}
                    >
                      <Pill className="mr-2 h-4 w-4 text-brand-teal" />
                      <div className="flex flex-col">
                        <span className="font-medium">{medicine.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {medicine.dosageForm} · {medicine.strength}
                        </span>
                      </div>
                      <Check className={cn('ml-auto h-4 w-4 opacity-0')} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
