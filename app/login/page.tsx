'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, EyeIcon, EyeOffIcon } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login gagal');
      }

      // Simpan data user ke localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Pre-fetch dashboard data
      await fetch('/api/dashboard');
      
      toast.success('Login berhasil');
      
      // Gunakan replace dan prefetch
      router.prefetch('/dashboard');
      router.replace('/dashboard');
      
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Email atau password salah');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
      <main className="flex-grow flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          
          <Card className="backdrop-blur-sm bg-white/90 shadow-xl">
            <CardContent className="p-6">
            <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-center mb-4"
                >
                  <Image
                    src="/assets/Logo.png"
                    alt="Logo"
                    width={60}
                    height={60}
                  />
                </motion.div>
                <motion.h1 
                  className="text-3xl font-bold text-gray-800 mb-2"
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  Selamat Datang di Sistem Pengelolaan Subbagian Umum
                </motion.h1>
                <p className="text-gray-600">Masuk ke akun Anda untuk melanjutkan</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Masukkan email Anda"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input 
                      id="password" 
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password Anda"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Masuk"}
                </Button>
              </form>
              <div className="mt-6 text-center">
                <a href="#" className="text-sm text-blue-600 hover:underline">Lupa kata sandi?</a>
              </div>
            </CardContent>
            <Button 
                variant="outline" 
                className="w-full border-2 hover:bg-gray-100 transition-colors"
                onClick={() => router.push('/')}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali
              </Button>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
