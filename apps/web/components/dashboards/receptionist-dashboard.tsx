'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, Users, Phone } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { useState } from 'react';

interface Appointment {
  id: string;
  patientName: string;
  time: string;
  type: string;
  status: 'confirmed' | 'pending' | 'completed';
  phone: string;
}

const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    patientName: 'John Doe',
    time: '09:00 AM',
    type: 'Lab Test',
    status: 'confirmed',
    phone: '+1 (555) 123-4567',
  },
  {
    id: '2',
    patientName: 'Jane Smith',
    time: '10:30 AM',
    type: 'Consultation',
    status: 'confirmed',
    phone: '+1 (555) 234-5678',
  },
  {
    id: '3',
    patientName: 'Mike Johnson',
    time: '02:00 PM',
    type: 'Follow-up',
    status: 'pending',
    phone: '+1 (555) 345-6789',
  },
  {
    id: '4',
    patientName: 'Sarah Williams',
    time: '03:30 PM',
    type: 'Lab Test',
    status: 'confirmed',
    phone: '+1 (555) 456-7890',
  },
];

const CLINIC_STATS = [
  {
    label: 'Today\'s Appointments',
    value: '8',
    icon: CalendarDays,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    label: 'Checked In',
    value: '5',
    icon: Clock,
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    label: 'Pending',
    value: '3',
    icon: Users,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
  {
    label: 'Calls Today',
    value: '12',
    icon: Phone,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
];

export default function ReceptionistDashboard() {
  const { t } = useLanguage();
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  const getStatusColor = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
    }
  };

  const daysInMonth = new Date(new Date().getFullYear(), selectedMonth + 1, 0).getDate();
  const firstDay = new Date(new Date().getFullYear(), selectedMonth, 1).getDay();
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Receptionist Dashboard</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">Manage appointments and patient check-ins</p>
      </div>

      {/* Clinic Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {CLINIC_STATS.map((stat, idx) => {
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Today's Appointments */}
        <div className="lg:col-span-2">
          <Card className="border-border">
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="text-lg md:text-xl">Today's Appointments</CardTitle>
              <CardDescription className="text-xs md:text-sm">Schedule and patient status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 md:space-y-3">
                {appointments.map((appt) => (
                  <div key={appt.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 md:p-4 border border-border rounded-lg hover:bg-background/50 transition-colors">
                    <div className="flex-1 w-full">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-semibold text-foreground text-sm md:text-base">{appt.time}</p>
                        <Badge className={getStatusColor(appt.status)} variant="secondary">
                          {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                        </Badge>
                      </div>
                      <p className="font-medium text-foreground text-sm">{appt.patientName}</p>
                      <p className="text-xs md:text-sm text-muted-foreground">{appt.type}</p>
                      <p className="text-xs text-muted-foreground mt-1">{appt.phone}</p>
                    </div>
                    <Button variant="outline" size="sm" className="cursor-pointer w-full sm:w-auto">
                      Call
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mini Calendar */}
        <Card className="border-border">
          <CardHeader className="pb-3 md:pb-6">
            <CardTitle className="text-lg md:text-xl">Calendar</CardTitle>
            <CardDescription className="text-xs md:text-sm">This month's overview</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <button className="cursor-pointer text-sm font-medium" onClick={() => setSelectedMonth(prev => prev === 0 ? 11 : prev - 1)}>
                  ←
                </button>
                <p className="font-semibold text-sm">
                  {new Date(new Date().getFullYear(), selectedMonth).toLocaleDateString('en-US', { month: 'long' })}
                </p>
                <button className="cursor-pointer text-sm font-medium" onClick={() => setSelectedMonth(prev => prev === 11 ? 0 : prev + 1)}>
                  →
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <div key={day} className="font-semibold text-muted-foreground p-1">
                    {day}
                  </div>
                ))}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className="p-1"></div>
                ))}
                {calendarDays.map((day) => (
                  <div
                    key={day}
                    className={`p-2 rounded cursor-pointer text-xs font-medium transition-colors ${
                      day === new Date().getDate()
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-background/80'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-border">
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="text-lg md:text-xl">Quick Actions</CardTitle>
          <CardDescription className="text-xs md:text-sm">Common receptionist tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            <Button variant="outline" className="cursor-pointer text-xs md:text-sm h-9 md:h-10">
              New Appointment
            </Button>
            <Button variant="outline" className="cursor-pointer text-xs md:text-sm h-9 md:h-10">
              Check-in Patient
            </Button>
            <Button variant="outline" className="cursor-pointer text-xs md:text-sm h-9 md:h-10">
              Call Reminder
            </Button>
            <Button variant="outline" className="cursor-pointer text-xs md:text-sm h-9 md:h-10">
              Reschedule
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
