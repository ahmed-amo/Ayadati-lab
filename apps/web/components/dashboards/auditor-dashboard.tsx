'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

interface SignOff {
  id: string;
  testName: string;
  patient: string;
  status: 'pending' | 'signed' | 'rejected';
  submittedAt: string;
  priority: 'high' | 'normal' | 'low';
}

const MOCK_SIGNOFFS: SignOff[] = [
  {
    id: '1',
    testName: 'Blood Type Analysis',
    patient: 'John Doe',
    status: 'pending',
    submittedAt: '2 hours ago',
    priority: 'high',
  },
  {
    id: '2',
    testName: 'Hemoglobin Test',
    patient: 'Jane Smith',
    status: 'pending',
    submittedAt: '30 minutes ago',
    priority: 'normal',
  },
  {
    id: '3',
    testName: 'Glucose Level',
    patient: 'Mike Johnson',
    status: 'signed',
    submittedAt: '1 day ago',
    priority: 'normal',
  },
  {
    id: '4',
    testName: 'Lipid Panel',
    patient: 'Sarah Williams',
    status: 'pending',
    submittedAt: '4 hours ago',
    priority: 'high',
  },
];

export default function AuditorDashboard() {
  const { t } = useLanguage();

  const stats = [
    {
      label: 'Pending Sign-offs',
      value: MOCK_SIGNOFFS.filter(s => s.status === 'pending').length,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Signed Today',
      value: '12',
      icon: CheckCircle2,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'High Priority',
      value: MOCK_SIGNOFFS.filter(s => s.priority === 'high').length,
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      label: 'This Month',
      value: '156',
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
  ];

  const getStatusBadge = (status: SignOff['status']) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-800">Pending</Badge>;
      case 'signed':
        return <Badge className="bg-green-100 text-green-800">Signed</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
    }
  };

  const getPriorityColor = (priority: SignOff['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 font-semibold';
      case 'normal':
        return 'text-gray-600';
      case 'low':
        return 'text-green-600';
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Auditor Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">Review and sign off on lab results</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="border-border">
              <CardContent className="p-3 md:p-6">
                <div className="space-y-2 md:space-y-3">
                  <div className={`${stat.bg} w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center`}>
                    <Icon className={`${stat.color} w-5 h-5 md:w-6 md:h-6`} />
                  </div>
                  <div>
                    <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-xl md:text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pending Sign-offs Table */}
      <Card className="border-border">
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="text-lg md:text-xl">Pending Sign-offs</CardTitle>
          <CardDescription className="text-xs md:text-sm">Results awaiting your review and approval</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-background">
                <TableRow className="border-b border-border hover:bg-transparent">
                  <TableHead className="h-10 md:h-12 text-foreground font-semibold text-xs md:text-sm">Test Name</TableHead>
                  <TableHead className="h-10 md:h-12 text-foreground font-semibold text-xs md:text-sm hidden sm:table-cell">Patient</TableHead>
                  <TableHead className="h-10 md:h-12 text-foreground font-semibold text-xs md:text-sm">Priority</TableHead>
                  <TableHead className="h-10 md:h-12 text-foreground font-semibold text-xs md:text-sm hidden md:table-cell">Submitted</TableHead>
                  <TableHead className="h-10 md:h-12 text-foreground font-semibold text-right text-xs md:text-sm">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_SIGNOFFS.filter(s => s.status === 'pending').map((item) => (
                  <TableRow key={item.id} className="border-b border-border hover:bg-background/50">
                    <TableCell className="py-3 md:py-4 text-xs md:text-sm">
                      <p className="font-medium text-foreground">{item.testName}</p>
                    </TableCell>
                    <TableCell className="py-3 md:py-4 text-xs md:text-sm hidden sm:table-cell text-muted-foreground">
                      {item.patient}
                    </TableCell>
                    <TableCell className="py-3 md:py-4">
                      <span className={`text-xs md:text-sm ${getPriorityColor(item.priority)}`}>
                        {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="py-3 md:py-4 text-xs md:text-sm text-muted-foreground hidden md:table-cell">
                      {item.submittedAt}
                    </TableCell>
                    <TableCell className="py-3 md:py-4 text-right">
                      <Button variant="default" size="sm" className="bg-primary hover:bg-primary/90 cursor-pointer text-xs md:text-sm">
                        Review
                      </Button>
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
