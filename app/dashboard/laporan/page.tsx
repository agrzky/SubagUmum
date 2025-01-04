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
} from "../../../components/ui/table"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { Clock, CheckCircleIcon, Download } from 'lucide-react'
import { toast } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import Image from 'next/image'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select"
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

interface Laporan {
  id: number
  report_date: string
  reporter_name: string
  description: string
  location: string
  specific_location: string
  status: 'pending' | 'in_progress' | 'resolved'
  image: string
  token: string
  createdAt: string
  updatedAt: string
}

export default function LaporanPage() {
  const [laporan, setLaporan] = useState<Laporan[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMonth, setSelectedMonth] = useState<string>(
    format(new Date(), 'yyyy-MM')
  )

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

    // Kembalikan array tanpa reverse (Januari ke Desember)
    return options
  }

  const fetchLaporan = useCallback(async () => {
    try {
      const response = await fetch(`/api/laporan?month=${selectedMonth}`)
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setLaporan(data)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Gagal memuat data laporan')
    } finally {
      setLoading(false)
    }
  }, [selectedMonth])

  useEffect(() => {
    fetchLaporan()
  }, [selectedMonth, fetchLaporan])

  const handleInProgress = async (id: number) => {
    try {
      const response = await fetch(`/api/laporan/${id}/progress`, { method: 'PUT' })
      if (!response.ok) throw new Error('Failed to update status')
      toast.success('Status berhasil diubah ke Diproses')
      fetchLaporan()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Gagal mengubah status')
    }
  }

  const handleComplete = async (id: number) => {
    try {
      const response = await fetch(`/api/laporan/${id}/complete`, { method: 'PUT' })
      if (!response.ok) throw new Error('Failed to complete')
      toast.success('Laporan telah diselesaikan')
      fetchLaporan()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Gagal menyelesaikan laporan')
    }
  }

  const formatDate = (date: string) => {
    return format(new Date(date), "dd MMMM yyyy", { locale: id })
  }

  const formatDateTime = (date: string) => {
    return format(new Date(date), "dd MMMM yyyy • HH:mm 'WIB'", { locale: id })
  }

  const generatePDF = () => {
    // Buat PDF dengan kompresi
    const doc = new jsPDF({
      compress: true,
      unit: 'mm'
    })
    
    // Tambahkan logo dengan ukuran yang lebih kecil
    const logoWidth = 15
    const logoHeight = 15
    doc.addImage('/assets/logo.png', 'PNG', 14, 10, logoWidth, logoHeight, undefined, 'FAST')
    
    // Kurangi ukuran font
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('PUSBANGPEG ASN', 35, 18)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('Pusat Pengembangan Kepegawaian ASN', 35, 24)
    
    // Garis pemisah lebih tipis
    doc.setLineWidth(0.3)
    doc.line(14, 30, doc.internal.pageSize.width - 14, 30)
    
    // Judul dan periode dengan font lebih kecil
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Laporan Kerusakan', 14, 38)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const monthYear = format(new Date(selectedMonth), 'MMMM yyyy', { locale: id })
    doc.text(`Periode: ${monthYear}`, 14, 44)

    // Optimasi data tabel
    const tableData = laporan.map(item => [
      formatDateTime(item.createdAt),
      item.reporter_name,
      item.token,
      item.location,
      item.specific_location,
      item.description.substring(0, 30),
      item.status === 'resolved' ? 'Selesai' :
      item.status === 'in_progress' ? 'Diproses' :
      'Menunggu'
    ])

    // Generate tabel dengan pengaturan yang dioptimalkan
    autoTable(doc, {
      head: [['Tanggal', 'Pelapor', 'Token', 'Lokasi', 'Lok. Spesifik', 'Deskripsi', 'Status']],
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
        1: { cellWidth: 25 },
        2: { cellWidth: 25 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
        5: { cellWidth: 35 },
        6: { cellWidth: 15 },
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
      didDrawPage: function(data) {
        if (data.pageNumber > 1) {
          // Header yang lebih ringkas untuk halaman berikutnya
          doc.addImage('/assets/logo.png', 'PNG', 14, 10, 12, 12, undefined, 'FAST')
          doc.setFontSize(10)
          doc.setFont('helvetica', 'bold')
          doc.text('PUSBANGPEG ASN', 30, 16)
          doc.line(14, 22, doc.internal.pageSize.width - 14, 22)
        }
        
        // Footer yang lebih ringkas
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
      margin: { top: 30 },
    })

    // Simpan PDF dengan kompresi
    doc.save(`Laporan_${selectedMonth}.pdf`)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-8 w-[200px]" />
          </div>
          <Card>
            <div className="p-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <h1 className="text-xl md:text-2xl font-bold">Daftar Laporan</h1>
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
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
              className="flex items-center justify-center gap-2 w-full md:w-auto"
              onClick={generatePDF}
              disabled={laporan.length === 0}
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden">
          {laporan.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              Tidak ada laporan
            </div>
          ) : (
            <div className="w-full overflow-x-auto min-w-full">
              <div className="min-w-[800px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] px-2 py-3">Tanggal</TableHead>
                      <TableHead className="w-[150px] px-2 py-3">Nama Pelapor</TableHead>
                      <TableHead className="w-[100px] px-2 py-3">Token</TableHead>
                      <TableHead className="w-[150px] px-2 py-3">Lokasi</TableHead>
                      <TableHead className="w-[150px] px-2 py-3">Lokasi Spesifik</TableHead>
                      <TableHead className="px-2 py-3">Deskripsi</TableHead>
                      <TableHead className="w-[100px] px-2 py-3">Gambar</TableHead>
                      <TableHead className="w-[100px] px-2 py-3">Status</TableHead>
                      <TableHead className="w-[100px] px-2 py-3">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {laporan.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {formatDate(item.createdAt)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {format(new Date(item.createdAt), "HH:mm 'WIB'")}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{item.reporter_name}</TableCell>
                        <TableCell>
                          <div className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                            {item.token}
                          </div>
                        </TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>{item.specific_location}</TableCell>
                        <TableCell className="max-w-xs truncate">{item.description}</TableCell>
                        <TableCell>
                          {item.image && (
                            <div className="relative w-20 h-20">
                              <Image
                                src={`/uploads/${item.image}`}
                                alt="Foto Kerusakan"
                                fill
                                className="object-cover rounded-md cursor-pointer hover:opacity-75"
                                onClick={() => window.open(`/uploads/${item.image}`, '_blank')}
                              />
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              item.status === 'resolved' ? 'success' :
                              item.status === 'in_progress' ? 'warning' :
                              'default'
                            }
                          >
                            {item.status === 'resolved' ? 'Selesai' :
                             item.status === 'in_progress' ? 'Diproses' :
                             'Menunggu'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {(item.status === 'pending' || item.status === 'in_progress') && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                                onClick={() => handleInProgress(item.id)}
                              >
                                <Clock className="h-4 w-4 mr-1" />
                                Proses
                              </Button>
                            )}
                            {(item.status === 'pending' || item.status === 'in_progress') && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() => handleComplete(item.id)}
                              >
                                <CheckCircleIcon className="h-4 w-4 mr-1" />
                                Selesai
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
} 