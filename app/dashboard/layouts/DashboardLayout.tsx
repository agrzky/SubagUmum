'use client'

import { ReactNode, useState, useEffect } from 'react'
import { Sidebar } from '../Sidebar'
import { Header } from '../Header'
import { Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setSidebarOpen(false)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header dengan Toggle Button */}
      <div className="sticky top-0 z-40 bg-white border-b">
        <div className="flex h-16 items-center gap-4 px-4">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="shrink-0"
            >
              <Menu className="h-6 w-6" />
            </Button>
          )}
          <div className="flex-1">
            <Header />
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar dengan animasi */}
        <div
          className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-200 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            md:relative md:translate-x-0
          `}
        >
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Overlay saat sidebar terbuka di mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <main className="p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

