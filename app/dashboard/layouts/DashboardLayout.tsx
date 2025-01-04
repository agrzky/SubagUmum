'use client'

import { ReactNode, useState, useEffect } from 'react'
import { Sidebar } from '../Sidebar';
import { Header } from '../Header';
import { Menu } from 'lucide-react';
import { Button } from "@/components/ui/button"

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false)
      }
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar untuk Desktop */}
        <div className="hidden lg:block w-64 fixed inset-y-0">
          <Sidebar />
        </div>

        {/* Sidebar Mobile */}
        {isMobile && (
          <div
            className={`fixed inset-0 z-50 transition-opacity duration-300 ${
              sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Overlay */}
            <div 
              className="absolute inset-0 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />
            {/* Sidebar Content */}
            <div
              className={`absolute left-0 top-0 bottom-0 w-64 bg-white transform transition-transform duration-300 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <Sidebar onClose={() => setSidebarOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          <Header>
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-6 w-6" />
              </Button>
            )}
          </Header>
          
          <main className="p-4 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

