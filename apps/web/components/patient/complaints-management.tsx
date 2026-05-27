'use client';

import { useState } from 'react';
import { Plus, ArrowLeft, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/lib/language-context';

interface Complaint {
  id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  status: 'open' | 'resolved';
  submittedAt: string;
  assignedTo: string;
  message: string;
  notes: string[];
}

const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: '1',
    ticketNumber: 'TKT-2024-001',
    subject: 'Test Results Delay',
    category: 'General',
    status: 'open',
    submittedAt: '2024-03-20',
    assignedTo: 'Dr. Sarah Johnson',
    message: 'I submitted my blood test on March 18 and was told results would be ready in 24 hours. It has been 3 days and I still do not have my results.',
    notes: ['Acknowledged by Dr. Sarah Johnson', 'Lab is processing the test'],
  },
  {
    id: '2',
    ticketNumber: 'TKT-2024-002',
    subject: 'Billing Issue',
    category: 'Finance',
    status: 'resolved',
    submittedAt: '2024-03-15',
    assignedTo: 'Ahmed Hassan',
    message: 'I was charged twice for my last consultation. Please investigate and refund.',
    notes: ['Issue confirmed', 'Refund processed successfully'],
  },
];

export default function ComplaintsManagement() {
  const { t } = useLanguage();
  const [view, setView] = useState<'list' | 'form' | 'detail'>('list');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [formData, setFormData] = useState({
    subject: '',
    category: 'General',
    message: '',
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [successTicket, setSuccessTicket] = useState('');

  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    const ticketNumber = `TKT-${new Date().getFullYear()}-${Math.floor(Math.random() * 999).toString().padStart(3, '0')}`;
    setSuccessTicket(ticketNumber);
    setShowSuccess(true);
    setTimeout(() => {
      setView('list');
      setFormData({ subject: '', category: 'General', message: '' });
      setShowSuccess(false);
    }, 3000);
  };

  if (view === 'detail' && selectedComplaint) {
    return (
      <div className="space-y-4 md:space-y-6">
        <Button
          onClick={() => {
            setView('list');
            setSelectedComplaint(null);
          }}
          variant="ghost"
          className="gap-2 cursor-pointer"
        >
          <ArrowLeft size={18} />
          {t('common.back')}
        </Button>

        <Card className="border-border">
          <CardHeader className="pb-3 md:pb-6 border-b border-border">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl md:text-3xl">{selectedComplaint.subject}</CardTitle>
                <p className="text-xs md:text-sm text-muted-foreground mt-2">
                  {selectedComplaint.ticketNumber}
                </p>
              </div>
              <Badge className={`${
                selectedComplaint.status === 'resolved'
                  ? 'bg-teal-100 text-teal-800'
                  : 'bg-rose-100 text-rose-800'
              } text-xs md:text-sm`}>
                {t(`complaints.${selectedComplaint.status}`)}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-background rounded-lg">
                <p className="text-xs md:text-sm text-muted-foreground font-medium mb-1">Category</p>
                <p className="text-sm md:text-base font-semibold text-foreground">
                  {selectedComplaint.category}
                </p>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <p className="text-xs md:text-sm text-muted-foreground font-medium mb-1">
                  {t('complaints.assignedTo')}
                </p>
                <p className="text-sm md:text-base font-semibold text-foreground">
                  {selectedComplaint.assignedTo}
                </p>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <p className="text-xs md:text-sm text-muted-foreground font-medium mb-1">
                  {t('complaints.submittedAt')}
                </p>
                <p className="text-sm md:text-base font-semibold text-foreground">
                  {new Date(selectedComplaint.submittedAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Message */}
            <div className="p-4 bg-background rounded-lg">
              <p className="text-xs md:text-sm text-muted-foreground font-medium mb-2">
                {t('complaints.message')}
              </p>
              <p className="text-sm md:text-base text-foreground">{selectedComplaint.message}</p>
            </div>

            {/* Timeline */}
            <div>
              <h4 className="text-base md:text-lg font-semibold text-foreground mb-4">
                {t('complaints.timeline')}
              </h4>
              <div className="space-y-3">
                {selectedComplaint.notes.map((note, idx) => (
                  <div key={idx} className="flex gap-3 pb-3 border-b border-border last:border-b-0">
                    <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary" />
                    <div>
                      <p className="text-sm md:text-base text-foreground">{note}</p>
                      <p className="text-xs text-muted-foreground mt-1">Just now</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Dropdown */}
            {selectedComplaint.status === 'open' && (
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer gap-2">
                <MessageSquare size={18} />
                Add Resolution Note
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (view === 'form') {
    return (
      <div className="space-y-4 md:space-y-6">
        <Button
          onClick={() => setView('list')}
          variant="ghost"
          className="gap-2 cursor-pointer"
        >
          <ArrowLeft size={18} />
          {t('common.back')}
        </Button>

        {showSuccess ? (
          <Card className="border-border bg-teal-50 border-teal-200">
            <CardContent className="pt-12 pb-12 text-center space-y-4">
              <div className="text-4xl">✓</div>
              <div>
                <p className="text-lg md:text-xl font-semibold text-foreground">
                  {t('complaints.successMessage')}
                </p>
                <p className="text-sm md:text-base text-muted-foreground mt-2">
                  {t('complaints.ticketNumber')}: {successTicket}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border">
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="text-2xl md:text-3xl">
                {t('complaints.newComplaint')}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmitComplaint} className="space-y-4 md:space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm md:text-base font-medium">
                    {t('complaints.subject')} *
                  </Label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Enter complaint subject"
                    required
                    className="text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm md:text-base font-medium">
                    {t('complaints.category')}
                  </Label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                  >
                    <option>General</option>
                    <option>Quality</option>
                    <option>Finance</option>
                    <option>Service</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm md:text-base font-medium">
                    {t('complaints.message')} *
                  </Label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your complaint in detail"
                    required
                    rows={5}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-2 md:gap-3 pt-4 border-t border-border">
                  <Button
                    onClick={() => setView('list')}
                    variant="outline"
                    className="border-border cursor-pointer order-2 sm:order-1"
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer order-1 sm:order-2"
                  >
                    {t('complaints.submit')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {t('complaints.myComplaints')}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Track and manage your complaints
          </p>
        </div>
        <Button
          onClick={() => setView('form')}
          className="gap-2 cursor-pointer w-full sm:w-auto"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">{t('complaints.newComplaint')}</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>

      {/* Complaints List */}
      {MOCK_COMPLAINTS.length === 0 ? (
        <Card className="border-border">
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-muted-foreground">No complaints yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {MOCK_COMPLAINTS.map((complaint) => (
            <Card
              key={complaint.id}
              className="border-border cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => {
                setSelectedComplaint(complaint);
                setView('detail');
              }}
            >
              <CardContent className="pt-6 pb-6">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base md:text-lg font-semibold text-foreground truncate">
                          {complaint.subject}
                        </h3>
                        <Badge className={`${
                          complaint.status === 'resolved'
                            ? 'bg-teal-100 text-teal-800'
                            : 'bg-rose-100 text-rose-800'
                        } text-xs whitespace-nowrap`}>
                          {t(`complaints.${complaint.status}`)}
                        </Badge>
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        {complaint.ticketNumber} • {new Date(complaint.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                    {complaint.message}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
