import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface OverviewCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
}

export function OverviewCard({ title, value, icon: Icon, color }: OverviewCardProps) {
  return (
    <Card className="p-6 transition-all hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
          <Icon className={`h-5 w-5 ${color.replace('bg-', 'text-')}`} />
        </div>
      </div>
    </Card>
  );
}

