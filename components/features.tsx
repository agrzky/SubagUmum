import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Package, Car, Search } from 'lucide-react'
import Link from "next/link"

export default function Features() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/laporan" className="transition-transform hover:-translate-y-1">
            <Card className="h-full bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <FileText className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg sm:text-xl">Laporan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Sistem pelaporan kerusakan sarana dan prasarana di lingkungan Pusbangpeg ASN
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/laporan/status" className="transition-transform hover:-translate-y-1">
            <Card className="h-full bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <Search className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg sm:text-xl">Status Laporan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Pantau status laporan kerusakan yang telah Anda ajukan
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/permintaan-barang" className="transition-transform hover:-translate-y-1">
            <Card className="h-full bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <Package className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg sm:text-xl">Permintaan Barang</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Ajukan permintaan barang dengan mudah dan pantau status permintaan Anda
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/peminjaman-kendaraan" className="transition-transform hover:-translate-y-1">
            <Card className="h-full bg-white/90 backdrop-blur-sm">
              <CardHeader>
                <Car className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle className="text-lg sm:text-xl">Peminjaman Kendaraan</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Kelola peminjaman kendaraan dinas dengan sistem yang terintegrasi
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </section>
  )
}

