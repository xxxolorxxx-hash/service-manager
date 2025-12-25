import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Quote, Client } from '@/types';
import { formatDate, formatCurrency } from '@/lib/utils/formatters';

export async function generateQuotePDF(quote: Quote, client: Client, settings?: { companyName: string; companyAddress: string; companyNip?: string; companyPhone?: string; companyEmail?: string; }) {
  const companyName = settings?.companyName || '';
  const companyAddress = settings?.companyAddress || '';
  const companyNip = settings?.companyNip || '';
  const companyPhone = settings?.companyPhone || '';
  const companyEmail = settings?.companyEmail || '';

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;

  doc.setFontSize(20);
  doc.text('KOSZTORYS', pageWidth / 2, 30, { align: 'center' });
  doc.setFontSize(12);
  doc.text(`Nr: ${quote.quoteNumber}`, pageWidth - margin, 50, { align: 'right' });
  doc.text(`Data: ${formatDate(quote.createdAt)}`, pageWidth - margin, 57, { align: 'right' });
  if (quote.validUntil) {
    doc.text(`Waźny do: ${formatDate(quote.validUntil)}`, pageWidth - margin, 64, { align: 'right' });
  }

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Sprzedawca:', margin, 80);
  doc.setFont('helvetica', 'normal');
  doc.text(companyName, margin, 86);
  if (companyAddress) doc.text(companyAddress, margin, 92);
  if (companyNip) doc.text(`NIP: ${companyNip}`, margin, 98);
  if (companyPhone) doc.text(`Tel: ${companyPhone}`, margin, 104);
  if (companyEmail) doc.text(`Email: ${companyEmail}`, margin, 110);

  doc.setFont('helvetica', 'bold');
  doc.text('Nabywca:', margin, 125);
  doc.setFont('helvetica', 'normal');
  doc.text(client.name, margin, 131);
  if (client.company) doc.text(client.company, margin, 137);
  if (client.address) doc.text(client.address, margin, 143);
  if (client.nip) doc.text(`NIP: ${client.nip}`, margin, 149);
  if (client.email) doc.text(`Email: ${client.email}`, margin, 155);
  if (client.phone) doc.text(`Tel: ${client.phone}`, margin, 161);

  autoTable(doc, {
    startY: 175,
    head: [['Lp', 'Nazwa towaru/usługi', 'Ilość', 'Jedn.', 'Cena jedn. (PLN)', 'VAT (%)', 'Wartość (PLN)']],
    body: quote.items.map((item, index) => [
      index + 1,
      item.name + (item.description ? `\n${item.description}` : ''),
      item.quantity.toString(),
      item.unit,
      item.unitPrice.toFixed(2),
      item.vatRate,
      (item.quantity * item.unitPrice).toFixed(2),
    ]),
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 20, halign: 'center' },
      3: { cellWidth: 20, halign: 'center' },
      4: { cellWidth: 30, halign: 'right' },
      5: { cellWidth: 20, halign: 'center' },
      6: { cellWidth: 30, halign: 'right' },
    },
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      halign: 'center',
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
  });

  const finalY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Podsumowanie:', margin, finalY);

  doc.setFont('helvetica', 'normal');
  doc.text(`Wartość netto: ${formatCurrency(quote.subtotal)}`, margin, finalY + 6);
  doc.text(`VAT: ${formatCurrency(quote.vatTotal)}`, margin, finalY + 12);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Wartość brutto: ${formatCurrency(quote.total)}`, margin, finalY + 20);

  if (quote.notes) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Uwagi:', margin, finalY + 35);
    doc.setFont('helvetica', 'normal');
    const splitNotes = doc.splitTextToSize(quote.notes, pageWidth - 2 * margin);
    doc.text(splitNotes, margin, finalY + 41);
  }

  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  const footerText = [
    'Kosztorys wygenerowany przez Manager Usług',
    `Data generowania: ${formatDate(new Date())}`,
  ];
  footerText.forEach((text, index) => {
    doc.text(text, margin, pageHeight - 15 - (index * 5));
  });

  doc.save(`kosztorys-${quote.quoteNumber.replace(new RegExp('/', 'g'), '-')}.pdf`);
}
