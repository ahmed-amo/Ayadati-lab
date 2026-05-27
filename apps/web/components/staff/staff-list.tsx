'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MoreVertical, Plus, Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/lib/language-context';

interface StaffListProps {
  onEdit: (staffId: string) => void;
  onAdd: () => void;
}

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Auditor' | 'Nurse' | 'Receptionist' | 'Patient';
  status: boolean;
  lastLogin: string;
}

// Mock data
const MOCK_STAFF: StaffMember[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@bravelab.com',
    role: 'Admin',
    status: true,
    lastLogin: '2 hours ago',
  },
  {
    id: '2',
    name: 'James Wilson',
    email: 'james.wilson@bravelab.com',
    role: 'Auditor',
    status: true,
    lastLogin: '30 minutes ago',
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily.davis@bravelab.com',
    role: 'Nurse',
    status: false,
    lastLogin: '1 day ago',
  },
  {
    id: '4',
    name: 'Michael Brown',
    email: 'michael.brown@bravelab.com',
    role: 'Receptionist',
    status: true,
    lastLogin: '10 minutes ago',
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@bravelab.com',
    role: 'Patient',
    status: true,
    lastLogin: '5 hours ago',
  },
];

const roleColors: Record<string, string> = {
  Admin: 'bg-role-admin text-white',
  Auditor: 'bg-role-auditor text-white',
  Nurse: 'bg-role-nurse text-white',
  Receptionist: 'bg-role-receptionist text-white',
  Patient: 'bg-role-patient text-white',
};

export default function StaffList({ onEdit, onAdd }: StaffListProps) {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'role' | 'lastLogin'>('name');
  const [staff, setStaff] = useState<StaffMember[]>(MOCK_STAFF);

  const filteredAndSortedStaff = useMemo(() => {
    let filtered = staff.filter(
      (member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'role') return a.role.localeCompare(b.role);
      return 0;
    });

    return filtered;
  }, [staff, searchTerm, sortBy]);

  const toggleStatus = (id: string) => {
    setStaff(
      staff.map((member) => (member.id === id ? { ...member, status: !member.status } : member))
    );
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t('staff.list')}</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage and organize your healthcare team</p>
        </div>
        <Button onClick={onAdd} className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 cursor-pointer w-full sm:w-auto">
          <Plus size={18} />
          <span className="hidden sm:inline">{t('staff.addStaff')}</span>
          <span className="sm:hidden">Add</span>
        </Button>
      </div>

      {/* Search & Filter Card */}
      <Card className="border-border">
        <CardContent className="pt-4 md:pt-6">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder={t('staff.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 text-sm sm:text-base"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
            >
              <option value="name">{t('staff.sort')} Name</option>
              <option value="role">{t('staff.sort')} Role</option>
              <option value="lastLogin">{t('staff.sort')} Last Login</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Staff Table */}
      <Card className="border-border">
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="text-lg md:text-xl">Team Members ({filteredAndSortedStaff.length})</CardTitle>
          <CardDescription className="text-xs md:text-sm">View and manage staff members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border overflow-x-auto">
            <Table>
              <TableHeader className="bg-background">
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className="h-10 md:h-12 text-foreground font-semibold text-xs md:text-sm">{t('staff.name')}</TableHead>
                  <TableHead className="h-10 md:h-12 text-foreground font-semibold text-xs md:text-sm hidden sm:table-cell">{t('staff.role')}</TableHead>
                  <TableHead className="h-10 md:h-12 text-foreground font-semibold text-xs md:text-sm">{t('staff.status')}</TableHead>
                  <TableHead className="h-10 md:h-12 text-foreground font-semibold text-xs md:text-sm hidden md:table-cell">{t('staff.lastLogin')}</TableHead>
                  <TableHead className="h-10 md:h-12 text-foreground font-semibold text-right text-xs md:text-sm">{t('staff.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedStaff.map((member) => (
                  <TableRow key={member.id} className="border-b border-border hover:bg-background/50">
                    <TableCell className="py-3 md:py-4 text-xs md:text-sm">
                      <div>
                        <p className="font-medium text-foreground text-xs md:text-sm">{member.name}</p>
                        <p className="text-xs md:text-sm text-muted-foreground">{member.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-xs md:text-sm">
                      <Badge
                        className={`${roleColors[member.role]} rounded-full px-2 md:px-3 py-1 text-xs`}
                        variant="secondary"
                      >
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs md:text-sm">
                      <div className="flex items-center gap-1 md:gap-2">
                        <Switch
                          checked={member.status}
                          onCheckedChange={() => toggleStatus(member.id)}
                          className="cursor-pointer"
                        />
                        <span className={`text-xs md:text-sm hidden sm:inline ${member.status ? 'text-green-600' : 'text-muted-foreground'}`}>
                          {member.status ? t('staff.active') : t('staff.inactive')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs md:text-sm text-muted-foreground hidden md:table-cell">{member.lastLogin}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="p-0 cursor-pointer">
                            <MoreVertical size={14} className="md:w-4 md:h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="cursor-pointer">
                          <DropdownMenuItem onClick={() => onEdit(member.id)} className="cursor-pointer text-xs md:text-sm">
                            {t('staff.edit')}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive cursor-pointer text-xs md:text-sm">
                            {t('staff.delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
