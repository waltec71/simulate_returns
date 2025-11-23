// Inline variable contributions configuration view

import type { SimulationParameters } from '../lib/types'
import VariableContributionsConfig from './VariableContributionsConfig'

interface VariableContributionsViewProps {
  parameters: SimulationParameters
  onChange: (updates: Partial<SimulationParameters>) => void
  onBack: () => void
}

export default function VariableContributionsView({
  parameters,
  onChange,
  onBack,
}: VariableContributionsViewProps) {
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
          Variable Contributions
        </h2>
      </div>

      {/* Configuration content */}
      <VariableContributionsConfig
        parameters={parameters}
        onChange={onChange}
      />
    </div>
  )
}

