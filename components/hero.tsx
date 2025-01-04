export default function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
              Sistem Pengelolaan{' '}
              <span className="text-blue-600">Subbagian Umum</span>
            </h1>
            <p className="mx-auto max-w-[750px] text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400">
              Kelola Laporan, Permintaan Barang dan Peminjaman Kendaraan Dengan Lebih Efisien
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

