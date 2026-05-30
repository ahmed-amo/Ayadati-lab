import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import type { PrescriptionDetailDto } from './prescriptions.service';

@Injectable()
export class PrescriptionPdfService {
  async generate(prescription: PrescriptionDetailDto): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const theme = prescription.headerTheme ?? {};
      const accent = (theme as { accentColor?: string }).accentColor ?? '#1e3a5f';
      const layout = (theme as { layout?: string }).layout ?? 'classic';

      doc.fillColor(accent).fontSize(22).text(prescription.clinicNameSnapshot, {
        align: 'center',
      });
      doc.moveDown(0.5);

      if (layout === 'bordered') {
        doc
          .strokeColor(accent)
          .lineWidth(1)
          .rect(50, 50, doc.page.width - 100, 80)
          .stroke();
      }

      if ((theme as { showSeparator?: boolean }).showSeparator !== false) {
        doc
          .strokeColor(accent)
          .lineWidth(0.5)
          .moveTo(50, doc.y + 10)
          .lineTo(doc.page.width - 50, doc.y + 10)
          .stroke();
        doc.moveDown(1);
      }

      doc.fillColor('#333').fontSize(12);
      doc.text(`Patient: ${prescription.patientName}`);
      doc.text(
        `Age: ${prescription.age}  |  Gender: ${prescription.gender}  |  Date: ${prescription.date}`,
      );
      doc.moveDown(1);

      doc.fillColor(accent).fontSize(14).text('Prescription', { underline: true });
      doc.moveDown(0.5);
      doc.fillColor('#333').fontSize(11);

      prescription.items.forEach((item, index) => {
        doc
          .font('Helvetica-Bold')
          .text(
            `${index + 1}. ${item.medicine.name} (${item.medicine.dosageForm} ${item.medicine.strength})`,
          );
        doc
          .font('Helvetica')
          .text(`   Dosage: ${item.dosage}`)
          .text(`   Frequency: ${item.frequency}`)
          .text(`   Duration: ${item.duration}`);
        doc.moveDown(0.5);
      });

      doc.moveDown(2);
      doc.text(`Prescribed by: ${prescription.doctor.fullName}`, { align: 'right' });

      doc.end();
    });
  }
}
