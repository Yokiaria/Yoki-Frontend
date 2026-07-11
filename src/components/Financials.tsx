import React, { useState, useEffect, useMemo } from 'react';
import { Transaction } from './types';
import { apiClient } from '../api/apiClient';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

interface FinancialsProps {
  transactions: Transaction[];
  searchQuery?: string;
  onNavigateToTab?: (tab: string) => void;
}

export default function Financials({ transactions, searchQuery, onNavigateToTab }: FinancialsProps) {
  const [dateFilter, setDateFilter] = useState<'harian' | 'mingguan' | 'bulanan'>('mingguan');
  const [exportingType, setExportingType] = useState<string | null>(null);

  const [statsData, setStatsData] = useState({
    total: 0,
    aktif: 0,
    selesai: 0,
    batal: 0,
    revenue: 0
  });

  const [isLoadingStats, setIsLoadingStats] = useState(false);

  useEffect(() => {
    setIsLoadingStats(true);
    apiClient.get<any>(`/bookings/stats?timeframe=${dateFilter}`)
      .then(res => {
        if (res) setStatsData(res);
      })
      .catch(err => console.error("Gagal mengambil statistik keuangan:", err))
      .finally(() => setIsLoadingStats(false));
  }, [dateFilter]);

  // Dynamic values depending on selected Date Filter and API response
  const financialSummary = useMemo(() => {
    const successCount = statsData.total - statsData.batal;
    const successRate = statsData.total > 0
      ? ((successCount / statsData.total) * 100).toFixed(1) + '% tingkat keberhasilan'
      : '0% tingkat keberhasilan';

    let growth = '';
    if (dateFilter === 'harian') growth = '+4.2% vs kemarin';
    else if (dateFilter === 'bulanan') growth = '+18.7% vs bulan lalu';
    else growth = '+12.5% vs minggu lalu';

    return {
      revenue: statsData.revenue,
      growth: growth,
      transactionsCount: statsData.total,
      successRate: successRate
    };
  }, [statsData, dateFilter]);

  // Handle export trigger feedback animation
  const handleExport = async (type: 'Excel' | 'PDF') => {
    setExportingType(type);

    try {
      // Simulate small delay for UI animation if needed
      await new Promise(r => setTimeout(r, 500));

      if (type === 'PDF') {
        const doc = new jsPDF();
        
        // Logo Placeholder
        doc.setFillColor(15, 23, 42); // Deep Navy
        doc.roundedRect(14, 15, 40, 14, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text('GRANDSTARIND', 18, 24);

        // Header Metadata
        doc.setTextColor(50, 50, 50);
        doc.setFontSize(14);
        doc.text('Laporan Keuangan Hotel', 196, 20, { align: 'right' });
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(`Periode: ${dateFilter.toUpperCase()}`, 196, 25, { align: 'right' });
        doc.text(`Dicetak: ${new Date().toLocaleDateString('id-ID')}`, 196, 30, { align: 'right' });

        // Summary Cards
        doc.setDrawColor(220, 220, 220);
        doc.setFillColor(250, 250, 250);
        
        // Card 1
        doc.roundedRect(14, 38, 55, 22, 2, 2, 'FD');
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text('Total Pendapatan', 18, 45);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(`Rp ${financialSummary.revenue.toLocaleString('id-ID')}`, 18, 53);

        // Card 2
        doc.roundedRect(73, 38, 55, 22, 2, 2, 'FD');
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text('Volume Transaksi', 77, 45);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(`${financialSummary.transactionsCount} Transaksi`, 77, 53);

        // Card 3
        doc.roundedRect(132, 38, 55, 22, 2, 2, 'FD');
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        doc.text('Keberhasilan', 136, 45);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(`${financialSummary.successRate.split(' ')[0]}`, 136, 53);

        const tableColumn = ["ID Booking", "Pelanggan", "Tipe Kamar", "Jumlah", "Status"];
        const tableRows: any[] = [];

        filteredTransactions.forEach(t => {
          tableRows.push([
            `#${t.id.slice(0, 8).toUpperCase()}`,
            t.name,
            t.roomType,
            `Rp ${t.amount.toLocaleString('id-ID')}`,
            t.status.toUpperCase()
          ]);
        });

        autoTable(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: 68,
          theme: 'grid',
          styles: { fontSize: 9, cellPadding: 6, font: 'helvetica', lineColor: [226, 232, 240], lineWidth: 0.1 },
          headStyles: { fillColor: '#0f172a', textColor: 255, fontStyle: 'bold', halign: 'center' },
          alternateRowStyles: { fillColor: '#f8fafc' },
          columnStyles: {
            0: { fontStyle: 'bold', textColor: '#475569' },
            3: { halign: 'right', fontStyle: 'bold' },
            4: { halign: 'center' }
          },
          didDrawCell: (data) => {
            if (data.column.index === 4 && data.section === 'body') {
              const text = data.cell.raw as string;
              let bgColor = [241, 245, 249]; // gray
              let textColor = [71, 85, 105];
              
              if (text === 'SELESAI') {
                bgColor = [220, 252, 231]; // green-100
                textColor = [22, 163, 74]; // green-600
              } else if (text === 'PROSES') {
                bgColor = [254, 249, 195]; // yellow-100
                textColor = [202, 138, 4]; // yellow-600
              } else if (text === 'BATAL' || text === 'GAGAL') {
                bgColor = [254, 226, 226]; // red-100
                textColor = [220, 38, 38]; // red-600
              }

              // Draw pill background
              doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
              const rectWidth = 22;
              const rectHeight = 6;
              const rectX = data.cell.x + (data.cell.width - rectWidth) / 2;
              const rectY = data.cell.y + (data.cell.height - rectHeight) / 2;
              
              doc.roundedRect(rectX, rectY, rectWidth, rectHeight, 3, 3, 'F');
              
              // Draw text
              doc.setTextColor(textColor[0], textColor[1], textColor[2]);
              doc.setFontSize(7);
              doc.setFont('helvetica', 'bold');
              doc.text(text, rectX + rectWidth/2, rectY + 4, { align: 'center' });
            }
          }
        });

        doc.save(`Laporan_Keuangan_Grandstarind_${dateFilter.toUpperCase()}.pdf`);
      } else {
        // Excel Export using ExcelJS
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Laporan Keuangan', {
          views: [{ state: 'frozen', ySplit: 7 }]
        });

        // Report Header
        sheet.mergeCells('A1:E1');
        const titleCell = sheet.getCell('A1');
        titleCell.value = 'LAPORAN KEUANGAN GRANDSTARIND';
        titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FF0F172A' } };
        titleCell.alignment = { vertical: 'middle', horizontal: 'center' };

        sheet.mergeCells('A2:E2');
        const subtitleCell = sheet.getCell('A2');
        subtitleCell.value = `Periode: ${dateFilter.toUpperCase()} | Dicetak: ${new Date().toLocaleDateString('id-ID')}`;
        subtitleCell.font = { name: 'Arial', size: 10, italic: true, color: { argb: 'FF475569' } };
        subtitleCell.alignment = { vertical: 'middle', horizontal: 'center' };

        // Summary Cards Section
        sheet.getCell('A4').value = 'Total Pendapatan:';
        sheet.getCell('B4').value = financialSummary.revenue;
        sheet.getCell('B4').numFmt = '"Rp"#,##0';
        sheet.getCell('B4').font = { bold: true };

        sheet.getCell('A5').value = 'Volume Transaksi:';
        sheet.getCell('B5').value = `${financialSummary.transactionsCount} transaksi`;
        sheet.getCell('B5').font = { bold: true };

        sheet.getCell('A6').value = 'Keberhasilan:';
        sheet.getCell('B6').value = financialSummary.successRate.split(' ')[0];
        sheet.getCell('B6').font = { bold: true };

        // Table Headers
        const headerRow = sheet.getRow(7);
        headerRow.values = ['ID Booking', 'Pelanggan', 'Tipe Kamar', 'Jumlah', 'Status'];
        headerRow.font = { name: 'Arial', size: 11, bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
        headerRow.height = 25;
        
        ['A7', 'B7', 'C7', 'D7', 'E7'].forEach(cell => {
          sheet.getCell(cell).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF0F172A' }
          };
        });

        // Add Data Rows
        filteredTransactions.forEach(t => {
          const row = sheet.addRow([
            `#${t.id.slice(0, 8).toUpperCase()}`,
            t.name,
            t.roomType,
            t.amount,
            t.status.toUpperCase()
          ]);
          // Format Amount as Accounting
          row.getCell(4).numFmt = '"Rp"#,##0';
          
          // Status Alignment
          row.getCell(5).alignment = { horizontal: 'center' };
        });

        // Auto-filter
        sheet.autoFilter = 'A7:E7';

        // Auto-fit Columns
        sheet.columns.forEach((col, i) => {
          if (i === 0) col.width = 15;
          else if (i === 1) col.width = 30;
          else if (i === 2) col.width = 25;
          else if (i === 3) col.width = 20;
          else if (i === 4) col.width = 15;
        });

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), `Laporan_Keuangan_Grandstarind_${dateFilter.toUpperCase()}.xlsx`);
      }

      setExportingType(null);
    } catch (error) {
      console.error("Export failed", error);
      setExportingType(null);
      alert(`Gagal mengekspor dokumen ${type}.`);
    }
  };

  // Let's format money in Indonesian Rupiah
  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  // Dynamic values for bar chart heights based on active filter
  const barHeights = useMemo(() => {
    if (dateFilter === 'harian') {
      return [
        { day: '08:00', val: '20M', heightClass: 'h-[20%]' },
        { day: '10:00', val: '45M', heightClass: 'h-[45%]' },
        { day: '12:00', val: '90M', heightClass: 'h-[90%]' },
        { day: '14:00', val: '65M', heightClass: 'h-[65%]' },
        { day: '16:00', val: '30M', heightClass: 'h-[30%]' },
        { day: '18:00', val: '55M', heightClass: 'h-[55%]' },
        { day: '20:00', val: '10M', heightClass: 'h-[10%]' },
      ];
    } else if (dateFilter === 'bulanan') {
      return [
        { day: 'Jan', val: '350M', heightClass: 'h-[35%]' },
        { day: 'Feb', val: '420M', heightClass: 'h-[42%]' },
        { day: 'Mar', val: '580M', heightClass: 'h-[58%]' },
        { day: 'Apr', val: '610M', heightClass: 'h-[61%]' },
        { day: 'Mei', val: '790M', heightClass: 'h-[79%]' },
        { day: 'Jun', val: '950M', heightClass: 'h-[95%]' },
        { day: 'Jul', val: '880M', heightClass: 'h-[88%]' },
      ];
    } else {
      // Mingguan
      return [
        { day: 'Sen', val: '30M', heightClass: 'h-[30%]' },
        { day: 'Sel', val: '45M', heightClass: 'h-[45%]' },
        { day: 'Rab', val: '60M', heightClass: 'h-[60%]' },
        { day: 'Kam', val: '40M', heightClass: 'h-[40%]' },
        { day: 'Jum', val: '80M', heightClass: 'h-[80%]' },
        { day: 'Sab', val: '95M', heightClass: 'h-[95%]', highlight: true },
        { day: 'Min', val: '75M', heightClass: 'h-[75%]' },
      ];
    }
  }, [dateFilter]);

  const filteredTransactions = useMemo(() => {
    let result = transactions;
    if (searchQuery && searchQuery.trim() !== '') {
      result = result.filter(t =>
        t.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.roomType?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [transactions, searchQuery]);

  return (
    <div className="space-y-8 animate-fade-in pb-12 select-none">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="font-display text-3xl font-bold text-primary">Laporan Keuangan</h2>
          <p className="text-body-lg text-on-surface-variant mt-1">
            Ringkasan transaksi pendapatan, performa finansial, dan audit log.
          </p>
        </div>

        {/* Filters and Exports */}
        <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
          {/* Date range selection filter */}
          <div className="glass-panel flex p-1 rounded-xl border border-outline-variant/20 shadow-sm w-full sm:w-auto">
            <button
              onClick={() => setDateFilter('harian')}
              className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold tracking-wider uppercase rounded-lg transition-all cursor-pointer ${dateFilter === 'harian'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-primary hover:bg-white/50'
                }`}
            >
              Harian
            </button>
            <button
              onClick={() => setDateFilter('mingguan')}
              className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold tracking-wider uppercase rounded-lg transition-all cursor-pointer ${dateFilter === 'mingguan'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-primary hover:bg-white/50'
                }`}
            >
              Mingguan
            </button>
            <button
              onClick={() => setDateFilter('bulanan')}
              className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold tracking-wider uppercase rounded-lg transition-all cursor-pointer ${dateFilter === 'bulanan'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-primary hover:bg-white/50'
                }`}
            >
              Bulanan
            </button>
          </div>

          {/* Export triggers */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              onClick={() => handleExport('Excel')}
              className="bg-primary text-white h-11 px-4 rounded-full font-bold text-xs flex items-center gap-2 hover:bg-primary/90 transition-all shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">description</span>
              Excel
            </button>
            <button
              onClick={() => handleExport('PDF')}
              className="bg-primary text-white h-11 px-4 rounded-full font-bold text-xs flex items-center gap-2 hover:bg-primary/90 transition-all shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">picture_as_pdf</span>
              PDF
            </button>
          </div>
        </div>
      </div>

      {/* Export Loader Overlay */}
      {exportingType && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center gap-4 border border-outline-variant/30">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="font-bold text-primary text-sm">Sedang mengekspor sebagai dokumen {exportingType}...</p>
          </div>
        </div>
      )}

      {/* Bento Grid Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Total Revenue Highlight Card */}
        <div className="col-span-1 md:col-span-7 glass-panel rounded-xl p-8 flex flex-col justify-between border border-outline-variant/20 shadow-sm relative overflow-hidden group bg-gradient-to-br from-white to-secondary-container/5 select-none">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-on-surface-variant mb-3">
              <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
              <span className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
                Total Pendapatan ({dateFilter})
              </span>
            </div>
            <div className="font-display text-4xl font-extrabold text-primary transition-all">
              {formatRupiah(financialSummary.revenue)}
            </div>
            <div className="flex items-center gap-1.5 mt-3.5 text-on-tertiary-container bg-[#e2f9ec] inline-flex px-3 py-1.5 rounded-full select-none">
              <span className="material-symbols-outlined text-xs font-bold">trending_up</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">{financialSummary.growth}</span>
            </div>
          </div>

          {/* Sparkline miniature bars */}
          <div className="h-14 mt-8 flex items-end gap-1.5 w-full relative z-10 select-none">
            {[35, 50, 45, 60, 55, 80, 75, 90, 85, 100].map((val, idx) => (
              <div
                key={idx}
                className="w-full bg-primary/15 rounded-t-sm transition-all duration-500 hover:bg-primary/40 cursor-pointer"
                style={{ height: `${val}%` }}
                title={`M${idx + 1}: ${val}%`}
              />
            ))}
          </div>
        </div>

        {/* Transaction Volume Card */}
        <div className="col-span-1 md:col-span-5 glass-panel rounded-xl p-8 flex flex-col justify-center border border-outline-variant/20 shadow-sm relative overflow-hidden bg-white select-none">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-on-surface-variant mb-4">
              <span className="material-symbols-outlined text-xl">receipt_long</span>
              <span className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant">
                Volume Transaksi
              </span>
            </div>
            <div className="font-display text-4xl font-extrabold text-primary leading-tight">
              {financialSummary.transactionsCount.toLocaleString('id-ID')}{' '}
              <span className="text-sm font-normal text-on-surface-variant block mt-1">transaksi sukses diarsip</span>
            </div>
            <p className="text-xs font-bold text-[#00a858] mt-4 flex items-center gap-1 bg-[#e2f9ec] px-3 py-1.5 rounded-full w-fit uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00a858]" />
              {financialSummary.successRate}
            </p>
          </div>
        </div>
      </div>

      {/* Revenue Trend Visualizer Card */}
      <div className="glass-panel rounded-xl p-6 md:p-8 border border-outline-variant/20 shadow-sm bg-white">
        <div className="flex justify-between items-center mb-8">
          <h3 className="font-display text-lg font-bold text-primary">Tren Keuangan Operasional</h3>
          <button className="text-on-surface-variant p-2 hover:bg-surface-container hover:text-primary rounded-full transition-colors cursor-pointer">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>

        {/* Custom CSS Based Bar Chart Grid */}
        <div className="h-64 w-full flex items-end justify-between gap-4 px-2 pb-6 border-b border-outline-variant/30 relative">
          {/* Y Axis Grid lines */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider pb-6 w-12 text-right pr-2 select-none pointer-events-none">
            <span>100M</span>
            <span>75M</span>
            <span>50M</span>
            <span>25M</span>
          </div>

          <div className="w-12 shrink-0 select-none pointer-events-none" />

          {/* Chart Bars */}
          {barHeights.map((bar, idx) => (
            <div key={idx} className="w-full flex-1 flex flex-col items-center group relative cursor-pointer">
              {/* Bar line */}
              <div
                className={`w-1/2 md:w-2/3 rounded-t-md transition-all duration-300 relative ${bar.heightClass} ${bar.highlight
                    ? 'bg-secondary-container hover:bg-secondary-container/90'
                    : 'bg-primary/25 hover:bg-primary'
                  }`}
              >
                {/* Float tag on Hover */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 select-none pointer-events-none">
                  {bar.val}
                </div>
              </div>
              <span className={`text-[11px] font-bold tracking-wider mt-4 ${bar.highlight ? 'text-primary' : 'text-on-surface-variant'}`}>
                {bar.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions List Table */}
      <div className="glass-panel rounded-xl border border-outline-variant/20 shadow-sm overflow-hidden bg-white">
        <div className="p-6 border-b border-outline-variant/20 flex justify-between items-center bg-surface/20">
          <h3 className="font-display text-lg font-bold text-primary">Daftar Transaksi Terakhir</h3>
          <button
            onClick={() => onNavigateToTab && onNavigateToTab('bookings')}
            className="text-xs font-semibold text-primary hover:underline cursor-pointer bg-transparent border-none p-0"
          >
            Lihat Semua
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container/20 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                <th className="p-6">ID Booking</th>
                <th className="p-6">Pelanggan</th>
                <th className="p-6">Tipe Kamar</th>
                <th className="p-6 text-right">Jumlah</th>
                <th className="p-6 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10 text-sm font-medium">
              {filteredTransactions.map((t) => {
                let badge = (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#e2f9ec] text-[#00a858] text-[10px] font-bold uppercase tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00a858]" />
                    Selesai
                  </span>
                );

                if (t.status === 'proses') {
                  badge = (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff4d8] text-secondary text-[10px] font-bold uppercase tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      Proses
                    </span>
                  );
                } else if (t.status === 'gagal') {
                  badge = (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-error text-[10px] font-bold uppercase tracking-wide">
                      <span className="w-1.5 h-1.5 rounded-full bg-error" />
                      Gagal
                    </span>
                  );
                }

                return (
                  <tr key={t.id} className="hover:bg-surface-container/20 transition-colors">
                    <td className="p-6 font-bold text-primary">#{t.id}</td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-surface-container overflow-hidden shrink-0 shadow-inner border border-gray-100 flex items-center justify-center font-bold text-xs text-primary">
                          {t.profileUrl ? (
                            <img alt={t.name} className="w-full h-full object-cover" src={t.profileUrl} />
                          ) : (
                            t.initials || 'US'
                          )}
                        </div>
                        <span className="text-on-surface font-semibold">{t.name}</span>
                      </div>
                    </td>
                    <td className="p-6 text-on-surface-variant font-semibold">{t.roomType}</td>
                    <td className="p-6 font-mono font-bold text-primary text-right">{formatRupiah(t.amount)}</td>
                    <td className="p-6 text-center">{badge}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}



