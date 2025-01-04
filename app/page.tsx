import Navbar from '@/components/navbar'
import Hero from '@/components/hero'
import Features from '@/components/features'
import Background3D from '@/components/Background3D'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Background3D />
      <Navbar />
      <Hero />
      <Features />
      <Footer />
    </>
  )
}

