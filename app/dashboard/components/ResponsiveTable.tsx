export function ResponsiveTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          {children}
        </div>
      </div>
    </div>
  )
} 