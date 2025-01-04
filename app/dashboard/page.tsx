'use client'

import { useEffect, useState } from 'react'
import { DashboardLayout } from './layouts/DashboardLayout'
import { OverviewCard } from './OverviewCard'
import { FileText, Package, Car } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const [data, setData] = useState({ reports: [], requests: [], rentals: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard', {
          cache: 'no-store',
          next: { revalidate: 0 }
        });
        if (!response.ok) throw new Error('Failed to fetch data');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 bg-white rounded-lg shadow">
              <Skeleton className="h-8 w-32 mb-4" />
              <Skeleton className="h-12 w-20" />
            </div>
          ))}
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <OverviewCard
          title="Total Laporan"
          value={data.reports.length}
          icon={FileText}
          color="bg-blue-500"
        />
        <OverviewCard
          title="Total Permintaan"
          value={data.requests.length}
          icon={Package}
          color="bg-green-500"
        />
        <OverviewCard
          title="Total Peminjaman"
          value={data.rentals.length}
          icon={Car}
          color="bg-yellow-500"
        />
      </div>
    </DashboardLayout>
  );
}

