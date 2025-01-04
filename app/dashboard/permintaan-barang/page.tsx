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
import { CheckCircle, Download, XCircle } from 'lucide-react'
import { toast } from "sonner"
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

interface ItemRequest {
  id: number
  nama: string
  department: string
  itemType: 'atk' | 'chemical' | 'printer' | 'scanner' | 'computer' | 'laptop'
  description: string
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled'
  tanggal: string
  createdAt: string
  updatedAt: string
}

export default function PermintaanBarangPage() {
  const [requests, setRequests] = useState<ItemRequest[]>([])
  const [selectedMonth, setSelectedMonth] = useState<string>(
    format(new Date(), 'yyyy-MM')
  )

  const fetchRequests = useCallback(async () => {
    try {
      const response = await fetch(`/api/permintaan-barang?month=${selectedMonth}`)
      const data = await response.json()
      setRequests(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }, [selectedMonth])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const handleApprove = async (id: number) => {
    try {
      const response = await fetch(`/api/permintaan-barang/${id}/approve`, { method: 'PUT' })
      if (!response.ok) throw new Error('Failed to approve')
      toast.success('Permintaan berhasil disetujui')
      fetchRequests()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Gagal menyetujui permintaan')
    }
  }

  const handleReject = async (id: number) => {
    try {
      const response = await fetch(`/api/permintaan-barang/${id}/reject`, { method: 'PUT' })
      if (!response.ok) throw new Error('Failed to reject')
      toast.success('Permintaan ditolak')
      fetchRequests()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Gagal menolak permintaan')
    }
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
    
    // Header text
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text('PUSBANGPEG ASN', 35, 18)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('Pusat Pengembangan Kepegawaian ASN', 35, 24)
    
    // Garis pemisah
    doc.setLineWidth(0.3)
    doc.line(14, 30, doc.internal.pageSize.width - 14, 30)
    
    // Judul dan periode
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Daftar Permintaan Barang', 14, 38)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const monthYear = format(new Date(selectedMonth), 'MMMM yyyy', { locale: id })
    doc.text(`Periode: ${monthYear}`, 14, 44)

    // Data tabel
    const tableData = requests.map(item => [
      format(new Date(item.createdAt), 'dd/MM/yy HH:mm'),
      item.nama,
      item.department,
      item.itemType,
      item.description.substring(0, 30),
      item.status === 'fulfilled' ? 'Selesai' :
      item.status === 'approved' ? 'Disetujui' :
      item.status === 'rejected' ? 'Ditolak' :
      'Menunggu'
    ])

    // Generate tabel
    autoTable(doc, {
      head: [['Tanggal', 'Nama', 'Departemen', 'Jenis Barang', 'Deskripsi', 'Status']],
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
        4: { cellWidth: 45 },
        5: { cellWidth: 20 },
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
        
        // Footer
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

    // Simpan PDF
    doc.save(`Permintaan_Barang_${selectedMonth}.pdf`)
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

    // Kembalikan array tanpa reverse (Januari ke Desember)
    return options
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Daftar Permintaan Barang</h1>
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
              disabled={requests.length === 0}
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
                <TableHead>Tanggal</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Departemen</TableHead>
                <TableHead>Jenis Barang</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{format(new Date(item.tanggal), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>{item.nama}</TableCell>
                  <TableCell>{item.department}</TableCell>
                  <TableCell>{item.itemType}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.status === 'fulfilled' ? 'success' :
                        item.status === 'approved' ? 'success' :
                        item.status === 'rejected' ? 'destructive' :
                        'default'
                      }
                    >
                      {item.status === 'fulfilled' ? 'Selesai' :
                       item.status === 'approved' ? 'Disetujui' :
                       item.status === 'rejected' ? 'Ditolak' :
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