'use client'

import { useState, useEffect, useCallback } from 'react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { TableLayout } from '../common/TableLayout'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Download } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface VehicleRental {
  id: number
  nama: string
  handphone?: string
  vehicleType: 'car' | 'motorcycle' | 'pickup' | 'ambulance'
  driver?: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  purpose: string
  status: 'pending' | 'approved' | 'rejected' | 'in_use' | 'completed'
  createdAt: string
  updatedAt: string
}

export default function PeminjamanKendaraanPage() {
  const [peminjaman, setPeminjaman] = useState<VehicleRental[]>([])
  const [selectedMonth, setSelectedMonth] = useState<string>(
    format(new Date(), 'yyyy-MM')
  )

  // Muat data berdasarkan bulan yang dipilih
  const fetchPeminjaman = useCallback(async () => {
    try {
      const response = await fetch(`/api/peminjaman-kendaraan?month=${selectedMonth}`)
      const data = await response.json()
      setPeminjaman(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }, [selectedMonth])

  useEffect(() => {
    fetchPeminjaman()
  }, [fetchPeminjaman])

  const handleApprove = async (id: number) => {
    try {
      await fetch(`/api/peminjaman-kendaraan/${id}/approve`, { method: 'PUT' })
      fetchPeminjaman()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleReject = async (id: number) => {
    try {
      await fetch(`/api/peminjaman-kendaraan/${id}/reject`, { method: 'PUT' })
      fetchPeminjaman()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const getMonthOptions = () => {
    const options = []
    const today = new Date()
    const currentYear = today.getFullYear()
    
    // Generate 12 bulan untuk tahun ini
    for (let month = 0; month < 12; month++) {
      const date = new Date(currentYear, month, 1)
      options.push({
        value: format(date, 'yyyy-MM'),
        label: format(date, 'MMMM yyyy', { locale: id })
      })
    }

    // Urutkan dari yang terbaru (Desember ke Januari)
    return options
  }

  const generatePDF = () => {
    const doc = new jsPDF({
      compress: true,
      unit: 'mm'
    })
    
    // Header
    const logoWidth = 15
    const logoHeight = 15
    doc.addImage('/assets/logo.png', 'PNG', 14, 10, logoWidth, logoHeight, undefined, 'FAST')
    
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('PUSBANGPEG ASN', 35, 18)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('Pusat Pengembangan Kepegawaian ASN', 35, 24)
    
    doc.setLineWidth(0.3)
    doc.line(14, 30, doc.internal.pageSize.width - 14, 30)
    
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Laporan Peminjaman Kendaraan', 14, 38)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const monthYear = format(new Date(selectedMonth), 'MMMM yyyy', { locale: id })
    doc.text(`Periode: ${monthYear}`, 14, 44)

    const tableData = peminjaman.map(item => [
      `${format(new Date(item.startDate), 'dd/MM/yy')} ${item.startTime}`,
      `${format(new Date(item.endDate), 'dd/MM/yy')} ${item.endTime}`,
      item.nama,
      item.handphone || '-',
      item.vehicleType,
      item.driver || '-',
      item.purpose.substring(0, 30),
      item.status === 'approved' ? 'Disetujui' :
      item.status === 'rejected' ? 'Ditolak' :
      item.status === 'in_use' ? 'Digunakan' :
      item.status === 'completed' ? 'Selesai' :
      'Menunggu'
    ])

    autoTable(doc, {
      head: [['Mulai', 'Selesai', 'Nama', 'No. HP', 'Kendaraan', 'Supir', 'Tujuan', 'Status']],
      body: tableData,
      startY: 50,
      styles: {
        fontSize: 7,
        cellPadding: 1,
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 20 },
        2: { cellWidth: 25 },
        3: { cellWidth: 20 },
        4: { cellWidth: 20 },
        5: { cellWidth: 20 },
        6: { cellWidth: 35 },
        7: { cellWidth: 15 },
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
      didDrawPage: function(data) {
        if (data.pageNumber > 1) {
          doc.addImage('/assets/logo.png', 'PNG', 14, 10, 12, 12, undefined, 'FAST')
          doc.setFontSize(10)
          doc.setFont('helvetica', 'bold')
          doc.text('PUSBANGPEG ASN', 30, 16)
          doc.line(14, 22, doc.internal.pageSize.width - 14, 22)
        }
        
        doc.setFontSize(7)
        doc.setFont('helvetica', 'normal')
        doc.text(
          `Dicetak: ${format(new Date(), "dd/MM/yy HH:mm")}`,
          14,
          doc.internal.pageSize.height - 8
        )
        doc.text(
          `Hal. ${data.pageNumber}`,
          doc.internal.pageSize.width - 20,
          doc.internal.pageSize.height - 8
        )
      },
      margin: { top: 30 }
    })

    doc.save(`Peminjaman_Kendaraan_${selectedMonth}.pdf`)
  }

  return (
    <DashboardLayout>
      <TableLayout
        title="Daftar Peminjaman Kendaraan"
        filterSection={
          <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
            <Select
              value={selectedMonth}
              onValueChange={setSelectedMonth}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Pilih Bulan" />
              </SelectTrigger>
              <SelectContent>
                {getMonthOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="w-full md:w-auto flex items-center gap-2"
              onClick={generatePDF}
              disabled={peminjaman.length === 0}
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        }
      >
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Tanggal</TableHead>
                <TableHead className="min-w-[150px]">Nama</TableHead>
                <TableHead className="min-w-[120px]">No. HP</TableHead>
                <TableHead className="min-w-[120px]">Kendaraan</TableHead>
                <TableHead className="min-w-[100px]">Sopir</TableHead>
                <TableHead className="min-w-[200px]">Tujuan</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[150px] text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {peminjaman.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <span className="font-medium whitespace-nowrap">
                        {format(new Date(item.startDate), "dd MMM yyyy", { locale: id })}
                      </span>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {format(new Date(item.startDate), "HH:mm", { locale: id })} - 
                        {format(new Date(item.endDate), "HH:mm", { locale: id })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{item.nama}</TableCell>
                  <TableCell className="whitespace-nowrap">{item.handphone}</TableCell>
                  <TableCell className="capitalize">{item.vehicleType}</TableCell>
                  <TableCell>{item.driver ? 'Ya' : 'Tidak'}</TableCell>
                  <TableCell>
                    <div className="max-w-[300px] truncate" title={item.purpose}>
                      {item.purpose}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.status === 'approved' ? 'success' :
                        item.status === 'rejected' ? 'destructive' :
                        'default'
                      }
                    >
                      {item.status === 'approved' ? 'Disetujui' :
                       item.status === 'rejected' ? 'Ditolak' :
                       'Menunggu'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.status === 'pending' && (
                      <div className="flex flex-col md:flex-row gap-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => handleApprove(item.id)}
                        >
                          <CheckCircle className="h-4 w-4 md:mr-1" />
                          <span className="hidden md:inline">Setujui</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleReject(item.id)}
                        >
                          <XCircle className="h-4 w-4 md:mr-1" />
                          <span className="hidden md:inline">Tolak</span>
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </TableLayout>
    </DashboardLayout>
  )
} 