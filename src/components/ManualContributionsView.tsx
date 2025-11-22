// Inline manual contributions configuration view

import { useState, useEffect } from 'react'
import type { SimulationParameters } from '../lib/types'
import {
  contributionsMatch,
  normalizeManualContributions,
} from '../lib/manualContributions'

interface ManualContributionsViewProps {
  parameters: SimulationParameters
  onChange: (updates: Partial<SimulationParameters>) => void
  onBack: () => void
}

export default function ManualContributionsView({
  parameters,
  onChange,
  onBack,
}: ManualContributionsViewProps) {
  const years = parameters.years || 1
  const [contributions, setContributions] = useState<(number | null)[]>(() =>
    normalizeManualContributions(parameters, years)
  )

  // Update contributions when the inputs change
  useEffect(() => {
    const normalized = normalizeManualContributions(parameters, years)

    setContributions((current) =>
      contributionsMatch(current, normalized) ? current : normalized
    )

    if (!contributionsMatch(parameters.manualContributions, normalized)) {
      onChange({ manualContributions: normalized })
    }
  }, [
    years,
    parameters.manualContributions,
    parameters.additionalContribution,
    onChange,
  ])

  const handleContributionChange = (yearIndex: number, value: string) => {
    const newContributions = [...contributions]

    if (value === '') {
      newContributions[yearIndex] = null
    } else {
      const numValue = parseFloat(value)
      newContributions[yearIndex] = Number.isNaN(numValue)
        ? null
        : Math.max(0, numValue)
    }

    setContributions(newContributions)
    onChange({ manualContributions: newContributions })
  }

  // Helper to select all text when input is focused
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
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
          Adjust Contributions Per Year
        </h2>
      </div>

      {/* Configuration content */}
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Fine-tune individual contribution amounts for each year. Leave empty to use variable contribution settings.
        </p>

        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {contributions.map((contribution, index) => (
            <div key={index} className="flex items-center gap-2">
              <label className="text-sm text-gray-700 w-20 flex-shrink-0">
                Year {index + 1}:
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={contribution ?? ''}
                onChange={(e) =>
                  handleContributionChange(index, e.target.value)
                }
                onFocus={handleFocus}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

