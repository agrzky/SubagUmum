'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Package, Printer, ScanIcon as Scanner, Monitor, Laptop, Pencil } from 'lucide-react'
import { motion } from "framer-motion"
import { Poppins } from 'next/font/google'
import { toast } from 'sonner'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '600', '700'] })

export default function PermintaanBarangPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [nama, setNama] = useState('')
  const [department, setDepartment] = useState('')
  const [tanggal, setTanggal] = useState('')
  const [itemType, setItemType] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async () => {
    // Validasi form
    if (!nama || !department || !tanggal || !itemType || !description) {
      toast.error("Mohon lengkapi semua field", {
        description: "Semua field harus diisi",
      })
      return
    }

    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/create-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nama,
          department,
          tanggal,
          itemType,
          description,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit request')
      }

      toast.success("Permintaan Berhasil Dikirim!", {
        description: "Terima kasih telah mengajukan permintaan barang.",
        duration: 5000,
        action: {
          label: "Tutup",
          onClick: () => console.log("Toast closed"),
        },
      })

      // Reset form
      setNama('')
      setDepartment('')
      setTanggal('')
      setItemType('')
      setDescription('')
      
      window.scrollTo({ top: 0, behavior: 'smooth' })

    } catch (error: unknown) {
      toast.error("Gagal Mengirim Permintaan", {
        description: error instanceof Error ? error.message : 'Terjadi kesalahan',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
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
                  Sistem Permintaan Barang<br className="hidden sm:inline" />Pusbangpeg ASN
                </motion.h1>
                <motion.p 
                  className="text-base sm:text-lg md:text-xl text-blue-100"
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                >
                  Ajukan permintaan barang dengan mudah dan efisien
                </motion.p>
              </motion.div>
            </div>

            <div className="flex justify-center gap-4 sm:gap-8 md:gap-16 mb-8">
              {[
                { Icon: Package, label: 'ATK' },
                { Icon: Printer, label: 'Printer' },
                { Icon: Monitor, label: 'Komputer' },
                { Icon: Laptop, label: 'Laptop' }
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
                Formulir Permintaan Barang
              </motion.h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nama" className="text-sm font-medium">Nama</Label>
                  <Input 
                    id="nama" 
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Masukkan nama"
                    className="border-gray-300 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subbidang" className="text-sm font-medium">Subbidang / Pokja</Label>
                  <Input 
                    id="subbidang" 
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Masukkan subbidang"
                    className="border-gray-300 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tanggal" className="text-sm font-medium">Tanggal</Label>
                  <Input 
                    id="tanggal" 
                    type="date"
                    value={tanggal}
                    onChange={(e) => setTanggal(e.target.value)}
                    className="border-gray-300 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jenis" className="text-sm font-medium">Jenis Permintaan</Label>
                  <Select value={itemType} onValueChange={setItemType}>
                    <SelectTrigger className="border-gray-300 focus:border-blue-500 transition-colors">
                      <SelectValue placeholder="Pilih jenis permintaan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="atk">
                        <div className="flex items-center gap-2">
                          <Pencil className="h-4 w-4" />
                          <span>ATK</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="chemical">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4" />
                          <span>Chemical</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="printer">
                        <div className="flex items-center gap-2">
                          <Printer className="h-4 w-4" />
                          <span>Printer</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="scanner">
                        <div className="flex items-center gap-2">
                          <Scanner className="h-4 w-4" />
                          <span>Scanner</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="komputer">
                        <div className="flex items-center gap-2">
                          <Monitor className="h-4 w-4" />
                          <span>Komputer</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="laptop">
                        <div className="flex items-center gap-2">
                          <Laptop className="h-4 w-4" />
                          <span>Laptop</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 mt-4 sm:mt-6 col-span-full">
                  <Label htmlFor="keterangan" className="text-sm font-medium">Keterangan</Label>
                  <Textarea 
                    id="keterangan" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Masukkan detail permintaan"
                    className="min-h-[100px] border-gray-300 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-6 col-span-full">
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
                    {isSubmitting ? "Mengirim..." : "Ajukan Permintaan"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

