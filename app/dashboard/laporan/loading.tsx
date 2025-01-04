import { DashboardLayout } from '../layouts/DashboardLayout'
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingLaporan() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-8 w-[200px]" />
        </div>
        <Card>
          <div className="p-4">
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
} 