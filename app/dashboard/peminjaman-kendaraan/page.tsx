'use client'

import { useState, useEffect, useCallback } from 'react'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { Card } from "@/components/ui/card"
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
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

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
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Daftar Peminjaman Kendaraan</h1>
          <div className="flex items-center gap-4">
            <Select
              value={selectedMonth}
              onValueChange={setSelectedMonth}
            >
              <SelectTrigger className="w-[200px]">
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
              className="flex items-center gap-2"
              onClick={generatePDF}
              disabled={peminjaman.length === 0}
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal Mulai</TableHead>
                <TableHead>Tanggal Selesai</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>No. HP</TableHead>
                <TableHead>Jenis Kendaraan</TableHead>
                <TableHead>Supir</TableHead>
                <TableHead>Tujuan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {peminjaman.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{`${format(new Date(item.startDate), 'dd/MM/yyyy')} ${item.startTime}`}</TableCell>
                  <TableCell>{`${format(new Date(item.endDate), 'dd/MM/yyyy')} ${item.endTime}`}</TableCell>
                  <TableCell>{item.nama}</TableCell>
                  <TableCell>{item.handphone || '-'}</TableCell>
                  <TableCell>{item.vehicleType}</TableCell>
                  <TableCell>{item.driver || '-'}</TableCell>
                  <TableCell>{item.purpose}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.status === 'approved' ? 'success' :
                        item.status === 'rejected' ? 'destructive' :
                        item.status === 'in_use' ? 'warning' :
                        item.status === 'completed' ? 'success' :
                        'default'
                      }
                    >
                      {item.status === 'approved' ? 'Disetujui' :
                       item.status === 'rejected' ? 'Ditolak' :
                       item.status === 'in_use' ? 'Digunakan' :
                       item.status === 'completed' ? 'Selesai' :
                       'Menunggu'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600"
                          onClick={() => handleApprove(item.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Setujui
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600"
                          onClick={() => handleReject(item.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Tolak
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </DashboardLayout>
  )
} 