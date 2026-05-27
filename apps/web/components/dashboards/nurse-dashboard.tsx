'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckCircle2, Clock, Users, Plus } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { useState } from 'react';

interface QueueItem {
  id: string;
  patientName: string;
  testType: string;
  status: 'waiting' | 'in-progress' | 'completed';
  priority: 'high' | 'normal' | 'low';
  checkInTime: string;
}

const MOCK_QUEUE: QueueItem[] = [
  {
    id: '1',
    patientName: 'John Doe',
    testType: 'Blood Test',
    status: 'in-progress',
    priority: 'high',
    checkInTime: '10:30 AM',
  },
  {
    id: '2',
    patientName: 'Jane Smith',
    testType: 'Glucose Test',
    status: 'waiting',
    priority: 'normal',
    checkInTime: '10:45 AM',
  },
  {
    id: '3',
    patientName: 'Mike Johnson',
    testType: 'Urinalysis',
    status: 'waiting',
    priority: 'low',
    checkInTime: '11:00 AM',
  },
  {
    id: '4',
    patientName: 'Sarah Williams',
    testType: 'Blood Type',
    status: 'completed',
    priority: 'normal',
    checkInTime: '09:15 AM',
  },
];

export default function NurseDashboard() {
  const { t } = useLanguage();
  const [queue, setQueue] = useState<QueueItem[]>(MOCK_QUEUE);
  const [formData, setFormData] = useState({
    patientName: '',
    testType: 'blood-test',
    notes: '',
  });

  const stats = [
    {
      label: 'In Queue',
      value: queue.filter(q => q.status === 'waiting' || q.status === 'in-progress').length,
      icon: Clock,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: 'Completed Today',
      value: queue.filter(q => q.status === 'completed').length,
      icon: CheckCircle2,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      label: 'Total Patients',
      value: queue.length,
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  const getStatusColor = (status: QueueItem['status']) => {
    switch (status) {
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
    }
  };

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.patientName) {
      const newQueueItem: QueueItem = {
        id: Math.random().toString(),
        patientName: formData.patientName,
        testType: formData.testType,
        status: 'waiting',
        priority: 'normal',
        checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setQueue([...queue, newQueueItem]);
      setFormData({ patientName: '', testType: 'blood-test', notes: '' });
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Nurse Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">Manage patient queue and lab tests</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
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

      {/* Quick Add Patient */}
      <Card className="border-border">
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="text-lg md:text-xl">Quick Add Patient</CardTitle>
          <CardDescription className="text-xs md:text-sm">Add new patient to today's queue</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddPatient} className="space-y-3 md:space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div className="space-y-2">
                <Label className="text-xs md:text-sm">Patient Name</Label>
                <Input
                  placeholder="Enter patient name"
                  value={formData.patientName}
                  onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                  className="text-sm cursor-pointer"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs md:text-sm">Test Type</Label>
                <Select value={formData.testType} onValueChange={(value) => setFormData({ ...formData, testType: value })}>
                  <SelectTrigger className="text-sm cursor-pointer">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="cursor-pointer">
                    <SelectItem value="blood-test" className="cursor-pointer">Blood Test</SelectItem>
                    <SelectItem value="glucose" className="cursor-pointer">Glucose Test</SelectItem>
                    <SelectItem value="urinalysis" className="cursor-pointer">Urinalysis</SelectItem>
                    <SelectItem value="blood-type" className="cursor-pointer">Blood Type</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 cursor-pointer gap-2">
              <Plus size={18} />
              Add to Queue
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Today's Queue */}
      <Card className="border-border">
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="text-lg md:text-xl">Today's Queue</CardTitle>
          <CardDescription className="text-xs md:text-sm">Patient testing schedule and results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 md:space-y-3">
            {queue.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 md:p-4 border border-border rounded-lg hover:bg-background/50 cursor-pointer">
                <div className="flex-1 w-full">
                  <p className="font-medium text-foreground text-sm md:text-base">{item.patientName}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">{item.testType}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.checkInTime}</p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Badge className={getStatusColor(item.status)} variant="secondary">
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
