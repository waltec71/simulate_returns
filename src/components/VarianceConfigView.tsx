// Inline variance method configuration view

import { useEffect } from 'react'
import type { SimulationParameters, VarianceMethod } from '../lib/types'
import MonteCarloConfig from './MonteCarloConfig'
import HistoricalConfig from './HistoricalConfig'

interface VarianceConfigViewProps {
  varianceMethod: VarianceMethod
  parameters: SimulationParameters
  onChange: (updates: Partial<SimulationParameters>) => void
  onBack: () => void
}

export default function VarianceConfigView({
  varianceMethod,
  parameters,
  onChange,
  onBack,
}: VarianceConfigViewProps) {
  // If method is 'none', go back to main view
  useEffect(() => {
    if (varianceMethod === 'none') {
      onBack()
    }
  }, [varianceMethod, onBack])

  if (varianceMethod === 'none') {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Header with back button */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200 min-w-0">
        <button
          onClick={onBack}
          className="p-1 text-gray-600 hover:text-gray-900 transition-colors flex-shrink-0"
          aria-label="Back to simulation"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <h2 className="text-lg font-semibold text-gray-800 truncate min-w-0 flex-1">
          {varianceMethod === 'monte-carlo'
            ? 'Monte Carlo Configuration'
            : 'Historical Configuration'}
        </h2>
      </div>

      {/* Configuration content */}
      {varianceMethod === 'monte-carlo' && (
        <MonteCarloConfig parameters={parameters} onChange={onChange} />
      )}
      {varianceMethod === 'historical' && (
        <HistoricalConfig parameters={parameters} onChange={onChange} />
      )}
    </div>
  )
}

