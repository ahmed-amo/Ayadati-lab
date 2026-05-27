'use client';

import { useState } from 'react';
import { Download, Share2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/lib/language-context';

interface TestResult {
  id: string;
  testType: string;
  date: string;
  auditor: string;
  status: 'signed' | 'analyzing' | 'pending';
  parameters: Parameter[];
}

interface Parameter {
  name: string;
  value: string;
  unit: string;
  interpretation: 'normal' | 'low' | 'high';
  reference: string;
}

const MOCK_RESULTS: TestResult[] = [
  {
    id: '1',
    testType: 'Complete Blood Count',
    date: '2024-03-20',
    auditor: 'Dr. Sarah Johnson',
    status: 'signed',
    parameters: [
      { name: 'Hemoglobin', value: '14.5', unit: 'g/dL', interpretation: 'normal', reference: '13.5-17.5' },
      { name: 'White Blood Cells', value: '7.2', unit: 'K/uL', interpretation: 'normal', reference: '4.5-11.0' },
      { name: 'Platelets', value: '250', unit: 'K/uL', interpretation: 'normal', reference: '150-400' },
    ],
  },
  {
    id: '2',
    testType: 'Lipid Profile',
    date: '2024-03-18',
    auditor: 'Dr. Ahmed Hassan',
    status: 'analyzing',
    parameters: [
      { name: 'Total Cholesterol', value: '220', unit: 'mg/dL', interpretation: 'high', reference: '<200' },
      { name: 'LDL Cholesterol', value: '145', unit: 'mg/dL', interpretation: 'high', reference: '<100' },
      { name: 'HDL Cholesterol', value: '35', unit: 'mg/dL', interpretation: 'low', reference: '>40' },
      { name: 'Triglycerides', value: '180', unit: 'mg/dL', interpretation: 'high', reference: '<150' },
    ],
  },
  {
    id: '3',
    testType: 'Thyroid Profile',
    date: '2024-03-15',
    auditor: 'Dr. Fatima Al-Zahra',
    status: 'pending',
    parameters: [
      { name: 'TSH', value: '2.5', unit: 'mIU/L', interpretation: 'normal', reference: '0.4-4.0' },
      { name: 'Free T4', value: '1.2', unit: 'ng/dL', interpretation: 'normal', reference: '0.8-1.8' },
    ],
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'signed':
      return 'bg-teal-100 text-teal-800';
    case 'analyzing':
      return 'bg-amber-100 text-amber-800';
    case 'pending':
      return 'bg-rose-100 text-rose-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getInterpretationColor = (interpretation: string) => {
  switch (interpretation) {
    case 'normal':
      return 'bg-green-100 text-green-800';
    case 'low':
      return 'bg-blue-100 text-blue-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function ResultsPortal() {
  const { t } = useLanguage();
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);

  if (selectedResult) {
    return (
      <div className="space-y-4 md:space-y-6">
        {/* Back Button */}
        <Button
          onClick={() => setSelectedResult(null)}
          variant="ghost"
          className="gap-2 cursor-pointer"
        >
          <ArrowLeft size={18} />
          {t('common.back')}
        </Button>

        {/* Report Header */}
        <Card className="border-border">
          <CardHeader className="pb-3 md:pb-6 border-b border-border">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl md:text-3xl">{selectedResult.testType}</CardTitle>
                <CardDescription className="text-sm md:text-base mt-2">
                  {new Date(selectedResult.date).toLocaleDateString()}
                </CardDescription>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button className="gap-2 cursor-pointer order-2 sm:order-1" variant="outline">
                  <Download size={18} />
                  <span className="hidden sm:inline">{t('results.downloadPDF')}</span>
                  <span className="sm:hidden">PDF</span>
                </Button>
                <Button className="gap-2 cursor-pointer order-1 sm:order-2" variant="outline">
                  <Share2 size={18} />
                  <span className="hidden sm:inline">{t('results.share')}</span>
                  <span className="sm:hidden">Share</span>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Patient & Auditor Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-background rounded-lg">
                <p className="text-xs md:text-sm text-muted-foreground font-medium">Patient Name</p>
                <p className="text-base md:text-lg font-semibold text-foreground mt-1">Alia Hartley</p>
              </div>
              <div className="p-4 bg-background rounded-lg">
                <p className="text-xs md:text-sm text-muted-foreground font-medium">{t('results.auditor')}</p>
                <p className="text-base md:text-lg font-semibold text-foreground mt-1">{selectedResult.auditor}</p>
              </div>
            </div>

            {/* Test Parameters Table */}
            <div>
              <h3 className="text-lg md:text-xl font-semibold text-foreground mb-4">
                {t('results.parameters')}
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-background">
                      <th className="text-left py-3 md:py-4 px-3 md:px-4 font-semibold">Parameter</th>
                      <th className="text-center py-3 md:py-4 px-3 md:px-4 font-semibold">Value</th>
                      <th className="text-center py-3 md:py-4 px-3 md:px-4 font-semibold hidden sm:table-cell">Reference</th>
                      <th className="text-center py-3 md:py-4 px-3 md:px-4 font-semibold">{t('results.interpretation')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedResult.parameters.map((param, idx) => (
                      <tr key={idx} className="border-b border-border hover:bg-background/50">
                        <td className="py-3 md:py-4 px-3 md:px-4 font-medium text-foreground text-xs md:text-sm">
                          {param.name}
                        </td>
                        <td className="py-3 md:py-4 px-3 md:px-4 text-center text-xs md:text-sm">
                          {param.value} {param.unit}
                        </td>
                        <td className="py-3 md:py-4 px-3 md:px-4 text-center text-xs md:text-sm hidden sm:table-cell text-muted-foreground">
                          {param.reference}
                        </td>
                        <td className="py-3 md:py-4 px-3 md:px-4 text-center">
                          <Badge className={`${getInterpretationColor(param.interpretation)} text-xs md:text-sm`}>
                            {t(`results.${param.interpretation}`)}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center justify-between p-4 bg-background rounded-lg">
              <p className="text-sm md:text-base font-medium text-foreground">{t('results.status')}</p>
              <Badge className={`${getStatusColor(selectedResult.status)} text-xs md:text-sm`}>
                {t(`results.${selectedResult.status}`)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{t('results.title')}</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          Access and review all your test results
        </p>
      </div>

      {/* Results List */}
      {MOCK_RESULTS.length === 0 ? (
        <Card className="border-border">
          <CardContent className="pt-12 pb-12 text-center">
            <p className="text-muted-foreground">{t('results.noResults')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {MOCK_RESULTS.map((result) => (
            <Card
              key={result.id}
              className="border-border cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedResult(result)}
            >
              <CardContent className="pt-6 pb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-base md:text-lg font-semibold text-foreground truncate">
                        {result.testType}
                      </h3>
                      <Badge className={`${getStatusColor(result.status)} text-xs whitespace-nowrap`}>
                        {t(`results.${result.status}`)}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs md:text-sm text-muted-foreground">
                        Date: {new Date(result.date).toLocaleDateString()}
                      </p>
                      <p className="text-xs md:text-sm text-muted-foreground">
                        Auditor: {result.auditor}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedResult(result);
                    }}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer whitespace-nowrap text-xs md:text-sm"
                  >
                    {t('results.viewReport')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
