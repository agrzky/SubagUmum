'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Menu, X } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-gray-100/70 backdrop-blur-md supports-[backdrop-filter]:bg-gray-100/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <Image 
            src="/assets/logo.png" 
            alt="Pusbangpeg ASN Logo" 
            width={60} 
            height={60}
            className="mr-4 h-10 w-10 sm:h-12 sm:w-12"
            priority
          />
          <span className="text-xl font-bold">Pusbangpeg ASN</span>
        </Link>
        
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        <div className={`absolute top-16 left-0 right-0 bg-gray-100 border-b md:static md:border-none md:bg-transparent ${isOpen ? 'block' : 'hidden'} md:block`}>
          <div className="flex flex-col space-y-4 p-4 md:flex-row md:items-center md:space-x-6 md:space-y-0 md:p-0">
            <Link 
              href="/"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Beranda
            </Link>
            <div className="md:hidden">
              {/* Mobile dropdown */}
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary w-full justify-between py-2"
              >
                <span>Laporan</span>
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              {isDropdownOpen && (
                <div className="pl-4 space-y-2">
                  <Link 
                    href="/laporan"
                    className="block text-sm font-medium text-muted-foreground transition-colors hover:text-primary py-2"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Buat Laporan
                  </Link>
                  <Link 
                    href="/laporan/status"
                    className="block text-sm font-medium text-muted-foreground transition-colors hover:text-primary py-2"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Status Laporan
                  </Link>
                </div>
              )}
            </div>

            {/* Desktop dropdown */}
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                  <span>Laporan</span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link 
                      href="/laporan"
                      className="w-full text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                      Buat Laporan
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link 
                      href="/laporan/status"
                      className="w-full text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                    >
                      Status Laporan
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <Link 
              href="/permintaan-barang"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Permintaan Barang
            </Link>
            <Link 
              href="/peminjaman-kendaraan"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              onClick={() => setIsOpen(false)}
            >
              Peminjaman Kendaraan
            </Link>
            <Link 
              href="/login"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
