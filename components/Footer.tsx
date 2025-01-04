import { Facebook, Twitter, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold mb-4">Pusbangpeg ASN</h3>
            <p className="text-sm text-gray-600">
              Mengembangkan potensi ASN untuk pelayanan publik yang lebih baik.
            </p>
          </div>
          
          <div className="text-center sm:text-left">
            <h4 className="text-md font-semibold mb-4">Kontak</h4>
            <p className="text-sm text-gray-600">Jalan Pandansari no. 32 KM 45 Tol Jagorawi</p>
            <p className="text-sm text-gray-600">Ciawi, Kabupaten Bogor, Jawa Barat, 16720</p>
            <p className="text-sm text-gray-600">Email: pusbang@bkn.go.id</p>
            <p className="text-sm text-gray-600">Telp: (0251) 8246800</p>
          </div>
          <div className="text-center sm:text-left">
            <h4 className="text-md font-semibold mb-4">Ikuti Kami</h4>
            <div className="flex justify-center sm:justify-start space-x-4">
              <a href="#" className="text-gray-600 hover:text-blue-600">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-600 hover:text-blue-600">
                <Instagram size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Pusbangpeg ASN. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

