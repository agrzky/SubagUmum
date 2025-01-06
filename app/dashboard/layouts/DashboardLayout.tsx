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
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-64 md:flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-x-auto bg-gray-50">
          <div className="container mx-auto p-2 md:p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

