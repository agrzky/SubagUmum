'use client'

import { useRouter, usePathname } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { BarChart3, FileText, Package, Car, X } from 'lucide-react'
import Image from 'next/image'

interface SidebarProps {
  onClose?: () => void
}

export function Sidebar({ onClose }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()

  const menuItems = [
    { icon: BarChart3, label: 'Overview', href: '/dashboard' },
    { icon: FileText, label: 'Laporan', href: '/dashboard/laporan' },
    { icon: Package, label: 'Permintaan Barang', href: '/dashboard/permintaan-barang' },
    { icon: Car, label: 'Peminjaman Kendaraan', href: '/dashboard/peminjaman-kendaraan' },
  ]

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
          <span className="text-xl font-bold">Dashboard</span>
        </div>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="md:hidden"
          >
            <X className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              onClick={() => {
                router.push(item.href)
                if (onClose) onClose()
              }}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Button>
          ))}
        </div>
      </nav>
    </div>
  )
}

