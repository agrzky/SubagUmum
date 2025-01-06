import { ResponsiveTable } from '../components/ResponsiveTable'

export function TableLayout({ 
  title, 
  children,
  filterSection,
}: { 
  title: string
  children: React.ReactNode
  filterSection?: React.ReactNode
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {filterSection}
      </div>
      <ResponsiveTable>
        {children}
      </ResponsiveTable>
    </div>
  )
} 