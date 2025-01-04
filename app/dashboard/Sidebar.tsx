'use client'

import { useState, useEffect } from 'react'
import { BarChart3, FileText, Package, Car, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from 'next/navigation'
import Image from 'next/image'

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return (
    <div className="flex flex-col h-full">
      {/* Header Sidebar */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Image
            src="/assets/logo.png"
            alt="Logo"
            width={32}
            height={32}
            className="w-8 h-8"
          />
          <span className="text-xl font-bold">
            Dashboard
          </span>
        </div>
        {/* Hanya tampilkan tombol close di mobile */}
        {isMobile && onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto">
        <div className="space-y-1 p-2">
          {[
            { icon: BarChart3, label: 'Overview', path: '/dashboard' },
            { icon: FileText, label: 'Laporan', path: '/dashboard/laporan' },
            { icon: Package, label: 'Permintaan Barang', path: '/dashboard/permintaan-barang' },
            { icon: Car, label: 'Peminjaman Kendaraan', path: '/dashboard/peminjaman-kendaraan' },
          ].map(({ icon: Icon, label, path }) => (
            <Button
              key={path}
              variant={pathname === path ? "secondary" : "ghost"}
              className="w-full justify-start px-4 py-2 text-left"
              onClick={() => {
                router.push(path)
                if (isMobile && onClose) onClose()
              }}
            >
              <Icon className={`h-5 w-5 ${pathname === path ? 'text-primary' : ''} mr-2`} />
              <span>{label}</span>
            </Button>
          ))}
        </div>
      </nav>
    </div>
  )
}

