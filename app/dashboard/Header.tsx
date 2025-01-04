'use client'

import { useRouter } from 'next/navigation'
import { Bell, User, LogOut } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { useEffect, useState } from 'react'

interface HeaderProps {
  children?: React.ReactNode;
}

interface UserData {
  name: string;
  email: string;
  role: string;
}

export function Header({ children }: HeaderProps) {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)

  useEffect(() => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      const user = JSON.parse(userStr)
      setUserData(user)
    }
  }, [])

  const handleLogout = async () => {
    try {
      localStorage.removeItem('user')
      await fetch('/api/auth/logout', {
        method: 'POST'
      });
      toast.success('Berhasil logout')
      router.replace('/login')
    } catch (error) {
      toast.error('Gagal logout')
      console.error('Logout error:', error)
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-white">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          {children}
          <h1 className="text-lg font-semibold sm:text-xl">
            Welcome, {userData?.name || 'User'}
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:block relative">
          </div>
          
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Bell className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {userData?.name || 'User'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {userData?.email || 'user@example.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

