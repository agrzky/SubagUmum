'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from "framer-motion"
import { Poppins } from 'next/font/google'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Search, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { toast } from 'sonner'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'] })

interface ReportStatus {
  id: number
  created_at: string
  reporter_name: string
  description: string
  location: string
  specific_location: string
  status: 'pending' | 'in_progress' | 'resolved'
  image: string
}

export default function StatusLaporanPage() {
  const router = useRouter()
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState<ReportStatus | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch(`/api/laporan/status?token=${token}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch report status')
      }

      setReport(data)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Token tidak valid atau laporan tidak ditemukan')
      setReport(null)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: string) => {
    return format(new Date(date), "d MMMM yyyy, HH:mm 'WIB'", { locale: id })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
      <div className="container pt-8 px-4">
        <div className="flex items-center mb-8">
          <Image 
            src="/assets/logo.png" 
            alt="Pusbangpeg ASN Logo" 
            width={60} 
            height={60}
            className="mr-4 h-10 w-10 sm:h-12 sm:w-12"
            priority
          />
        </div>
        
        <div className="text-center text-white mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 ${poppins.className}`}>
              Status Laporan
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-blue-100">
              Pantau progres laporan Anda dengan mudah
            </p>
          </motion.div>
        </div>

        <Card className="max-w-md mx-auto backdrop-blur-sm bg-white/90">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="token" className="text-sm font-medium">Kode Token Laporan</Label>
                <Input 
                  id="token" 
                  type="text" 
                  placeholder="Masukkan kode token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                  disabled={loading}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={loading}
              >
                <Search className="mr-2 h-4 w-4" />
                {loading ? 'Mencari...' : 'Cek Status'}
              </Button>
            </form>

            {report && (
              <div className="mt-8 space-y-6">
                <div className="p-4 border rounded-md bg-gray-50">
                  <h2 className="text-lg font-semibold mb-4">Detail Laporan:</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Tanggal Laporan:</p>
                      <p className="font-medium">{formatDate(report.created_at)}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Nama Pelapor:</p>
                      <p className="font-medium">{report.reporter_name}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Lokasi:</p>
                      <p className="font-medium">{report.location}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Lokasi Spesifik:</p>
                      <p className="font-medium">{report.specific_location}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Deskripsi:</p>
                      <p className="font-medium">{report.description}</p>
                    </div>

                    {report.image && (
                      <div>
                        <p className="text-sm text-gray-500 mb-2">Foto:</p>
                        <div className="relative w-full h-48">
                          <Image
                            src={`/uploads/${report.image}`}
                            alt="Foto Kerusakan"
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-sm text-gray-500 mb-2">Status:</p>
                      {report.status === 'pending' && (
                        <div className="flex items-center text-yellow-600 bg-yellow-50 p-2 rounded">
                          <Clock className="mr-2 h-5 w-5" />
                          <span>Menunggu Proses</span>
                        </div>
                      )}
                      {report.status === 'in_progress' && (
                        <div className="flex items-center text-blue-600 bg-blue-50 p-2 rounded">
                          <AlertTriangle className="mr-2 h-5 w-5" />
                          <span>Sedang Diproses</span>
                        </div>
                      )}
                      {report.status === 'resolved' && (
                        <div className="space-y-2">
                          <div className="flex items-center text-green-600 bg-green-50 p-2 rounded">
                            <CheckCircle className="mr-2 h-5 w-5" />
                            <span>Selesai</span>
                          </div>
                          <div className="text-sm text-gray-700 bg-blue-50 p-3 rounded border border-blue-100">
                            <p className="font-medium mb-1">Berikut foto laporan kerusakan yang anda berikan sudah kami perbaiki.</p>
                            <p>Terima kasih atas laporannya. Silahkan hubungi kami kembali jika ada kerusakan lain.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Button 
            variant="outline" 
            className="bg-white hover:bg-gray-100 text-blue-600"
            onClick={() => router.push('/')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </div>
  )
}

