'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Upload, Building2, Building, GraduationCap, Home, Hotel, Dumbbell, Utensils, ChurchIcon as Mosque, Video, Music, Library, Baby } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from "framer-motion"
import { Poppins } from 'next/font/google'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'] })

export default function LaporanPage() {
  const router = useRouter()
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [token, setToken] = useState('0000')
  const [nama, setNama] = useState('')
  const [status, setStatus] = useState('pegawai')
  const [tanggal, setTanggal] = useState('')
  const [lokasi, setLokasi] = useState('')
  const [lokasiSpesifik, setLokasiSpesifik] = useState('')
  const [keterangan, setKeterangan] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Fetch token when component mounts
    const fetchToken = async () => {
      try {
        const response = await fetch('/api/get-last-token');
        const data = await response.json();
        if (response.ok) {
          setToken(data.token);
        }
      } catch (error) {
        console.error('Failed to fetch token:', error);
      }
    };

    fetchToken();
  }, []);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (files: FileList) => {
    const selectedFile = files[0]
    if (selectedFile.type.startsWith('image/')) {
      if (selectedFile.size <= 5 * 1024 * 1024) {
        setFile(selectedFile)
        toast.success("File Diterima", {
          description: `File ${selectedFile.name} berhasil diunggah.`,
        })
      } else {
        toast.error("Ukuran File Terlalu Besar", {
          description: "Maksimum ukuran file adalah 5MB.",
        })
      }
    } else {
      toast.error("Jenis File Tidak Didukung", {
        description: "Hanya file gambar yang diizinkan.",
      })
    }
  }

  const onButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async () => {
    // Validasi form
    if (!nama || !tanggal || !lokasi) {
      toast.error("Mohon lengkapi semua field yang wajib diisi", {
        description: "Nama, tanggal, dan lokasi harus diisi",
      })
      return
    }

    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('token', token)
    formData.append('nama', nama)
    formData.append('status', status)
    formData.append('tanggal', tanggal)
    formData.append('lokasi', lokasi)
    formData.append('lokasiSpesifik', lokasiSpesifik)
    formData.append('keterangan', keterangan)
    
    if (file) {
      formData.append('file', file)
    }

    try {
      const response = await fetch('/api/create-report', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit report')
      }

      // Fetch token baru setelah laporan berhasil dibuat
      const tokenResponse = await fetch('/api/get-last-token')
      const tokenData = await tokenResponse.json()
      if (tokenResponse.ok) {
        setToken(tokenData.token)
      }

      toast.success("Laporan Berhasil Dikirim!", {
        description: "Terima kasih telah mengirimkan laporan, harap ingat kode token Anda untuk melihat status laporan Anda.",
        duration: 10000,
        action: {
          label: "Tutup",
          onClick: () => console.log("Toast closed"),
        },
      })

      // Reset form
      setNama('')
      setStatus('pegawai')
      setTanggal('')
      setLokasi('')
      setLokasiSpesifik('')
      setKeterangan('')
      setFile(null)
      
      window.scrollTo({ top: 0, behavior: 'smooth' })

    } catch (error: unknown) {
      toast.error("Gagal Mengirim Laporan", {
        description: error instanceof Error ? error.message : 'Terjadi kesalahan',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 pb-20">
        <div className="container pt-6 px-4">
          <div className="flex items-center mb-8 sm:mb-12">
            <Image 
              src="/assets/logo.png" 
              alt="Pusbangpeg ASN Logo" 
              width={60} 
              height={60}
              className="mr-4 h-10 w-10 sm:h-12 sm:w-12"
              priority
            />
          </div>
          <div className="text-center text-white mb-8 sm:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1 
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6"
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                Sistem Pelaporan Kerusakan Sarpras<br className="hidden sm:inline" />Pusbangpeg ASN
              </motion.h1>
              <motion.p 
                className="text-base sm:text-lg md:text-xl text-blue-100"
                whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              >
                Laporkan dengan cepat dan mudah untuk perbaikan yang lebih efisien
              </motion.p>
            </motion.div>
          </div>

          <div className="flex justify-center gap-4 sm:gap-8 md:gap-16 mb-8">
            {[
              { Icon: Building2, label: 'Gedung' },
              { Icon: GraduationCap, label: 'Kelas' },
              { Icon: Home, label: 'Asrama' },
              { Icon: Utensils, label: 'Kantin' }
            ].map(({ Icon, label }, index) => (
              <motion.div
                key={label}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 * (index + 1) }}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-white group relative"
              >
                <Icon className="w-full h-full transition-transform duration-300 group-hover:scale-110" />
                <span className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 0L60 22C120 44 240 89 360 111C480 133 600 133 720 122C840 111 960 89 1080 78C1200 67 1320 67 1380 67H1440V200H1380C1320 200 1200 200 1080 200C960 200 840 200 720 200C600 200 480 200 360 200C240 200 120 200 60 200H0V0Z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Form Section */}
      <div className="container px-4 -mt-10 pb-20">
        <Card className="max-w-3xl mx-auto backdrop-blur-sm bg-white/90">
          <CardContent className="p-4 sm:p-6 md:p-8">
            <motion.h2 
              className={`text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent ${poppins.className}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Formulir Laporan Kerusakan
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label htmlFor="nama" className="text-sm font-medium">Nama Pelapor</Label>
                <Input 
                  id="nama" 
                  placeholder="Masukkan nama lengkap"
                  className="border-gray-300 focus:border-blue-500 transition-colors"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="token" className="text-sm font-medium">Kode Token</Label>
                <Input 
                  id="token" 
                  value={token}
                  readOnly
                  className="border-gray-300 bg-gray-100 focus:border-blue-500 transition-colors"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Status</Label>
                <RadioGroup defaultValue="pegawai" className="flex gap-4" value={status} onValueChange={setStatus}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pegawai" id="pegawai" />
                    <Label htmlFor="pegawai">Pegawai</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="peserta" id="peserta" />
                    <Label htmlFor="peserta">Peserta</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tanggal" className="text-sm font-medium">Tanggal Laporan</Label>
                <Input 
                  id="tanggal" 
                  type="date"
                  className="border-gray-300 focus:border-blue-500 transition-colors"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lokasi" className="text-sm font-medium">Lokasi</Label>
                <Select value={lokasi} onValueChange={setLokasi}>
                  <SelectTrigger className="border-gray-300 focus:border-blue-500 transition-colors">
                    <SelectValue placeholder="Pilih Lokasi" />
                  </SelectTrigger>
                  <SelectContent>
                    <ScrollArea className="h-[200px]">
                      <SelectItem value="gedung-kantor">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <span>Gedung Kantor</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="gedung-aula">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          <span>Gedung Aula</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="ruangan-kelas">
                        <div className="flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          <span>Ruangan Kelas</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="asrama">
                        <div className="flex items-center gap-2">
                          <Home className="h-4 w-4" />
                          <span>Asrama</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="guesthouse">
                        <div className="flex items-center gap-2">
                          <Hotel className="h-4 w-4" />
                          <span>GuestHouse</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="gym">
                        <div className="flex items-center gap-2">
                          <Dumbbell className="h-4 w-4" />
                          <span>Ruangan Gym</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="tempat-makan">
                        <div className="flex items-center gap-2">
                          <Utensils className="h-4 w-4" />
                          <span>Tempat Makan</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="masjid">
                        <div className="flex items-center gap-2">
                          <Mosque className="h-4 w-4" />
                          <span>Masjid</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="studio">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4" />
                          <span>Ruangan Studio</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="musik">
                        <div className="flex items-center gap-2">
                          <Music className="h-4 w-4" />
                          <span>Ruangan Musik</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="perpustakaan">
                        <div className="flex items-center gap-2">
                          <Library className="h-4 w-4" />
                          <span>Ruangan Perpustakaan</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="laktasi">
                        <div className="flex items-center gap-2">
                          <Baby className="h-4 w-4" />
                          <span>Ruangan Laktasi</span>
                        </div>
                      </SelectItem>
                    </ScrollArea>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2 mt-4 sm:mt-6">
              <Label htmlFor="lokasi-spesifik" className="text-sm font-medium">Lokasi Spesifik</Label>
              <Input 
                id="lokasi-spesifik" 
                placeholder="Contoh: Lantai 2, Ruang 201"
                className="border-gray-300 focus:border-blue-500 transition-colors"
                value={lokasiSpesifik}
                onChange={(e) => setLokasiSpesifik(e.target.value)}
              />
            </div>

            <div className="space-y-2 mt-4 sm:mt-6">
              <Label className="text-sm font-medium">Upload File atau Foto</Label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                  ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={onButtonClick}
              >
                <Upload className="mx-auto h-12 w-12 text-blue-500" />
                <p className="mt-2 font-medium">
                  {file ? `File: ${file.name}` : "Klik untuk upload atau drag and drop"}
                </p>
                <p className="text-sm text-gray-500">PNG, JPG atau GIF (MAX. 5MB)</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>
              <p className="text-sm text-yellow-600 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-yellow-400" />
                Hanya file gambar yang diizinkan
              </p>
            </div>

            <div className="space-y-2 mt-4 sm:mt-6">
              <Label htmlFor="keterangan" className="text-sm font-medium">Keterangan</Label>
              <Textarea 
                id="keterangan" 
                placeholder="Deskripsikan laporan Anda di sini"
                className="min-h-[100px] border-gray-300 focus:border-blue-500 transition-colors"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button 
                variant="outline" 
                className="w-full border-2 hover:bg-gray-100 transition-colors"
                onClick={() => router.push('/')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Button>
              <Button 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-colors"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Mengirim..." : "Submit Laporan"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

