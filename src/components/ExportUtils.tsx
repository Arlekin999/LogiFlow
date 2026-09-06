import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export const exportToExcel = (data: any[], filename: string = 'orders.xlsx') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, -workbook, worksheet, 'Orders');
  XLSX.writeFile(workbook, filename);
};

export const exportToPDF = (data: any[], filename: string = 'orders.pdf') => {
  const doc = new jsPDF();
  
  doc.text('LogiFlow - Orders Report', 14, 16);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 24);
  
  const tableData = data.map(order => [
    order.id,
    order.truck,
    order.route,
    order.status,
    order.driver,
    order.eta
  ]);
  
  (doc as any).autoTable({
    head: [['ID', 'Truck', 'Route', 'Status', 'Driver', 'ETA']],
    body: tableData,
    startY: 32
  });
  
  doc.save(filename);
};

export const exportToCSV = (data: any[], filename: string = 'orders.csv') => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
};