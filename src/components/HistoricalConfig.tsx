// Historical variance configuration inputs (placeholder)

interface HistoricalConfigProps {
  parameters: any
  onChange: (updates: any) => void
}

export default function HistoricalConfig(_props: HistoricalConfigProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">
        Historical Variance Configuration
      </h3>
      <p className="text-sm text-gray-600">
        Historical variance simulation is not yet implemented. This feature will
        be available in a future update.
      </p>
    </div>
  )
}

