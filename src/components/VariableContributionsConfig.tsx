// Variable contributions configuration inputs

import type { SimulationParameters } from '../lib/types'
import { NORMALIZATION_DEFAULTS } from '../lib/defaults'

interface VariableContributionsConfigProps {
  parameters: SimulationParameters
  onChange: (updates: Partial<SimulationParameters>) => void
}

export default function VariableContributionsConfig({
  parameters,
  onChange,
}: VariableContributionsConfigProps) {
  const years = parameters.years ?? NORMALIZATION_DEFAULTS.years
  const contributionIncreaseRate = parameters.contributionIncreaseRate ?? 0
  const stopContributingAfterYears = parameters.stopContributingAfterYears

  const handleIncreaseRateChange = (value: string) => {
    const numValue = parseFloat(value) || 0
    // Clamp between -50% and 100%
    const clampedValue = Math.max(-50, Math.min(100, numValue))
    onChange({ contributionIncreaseRate: clampedValue })
  }

  const handleStopAfterYearsChange = (value: string) => {
    if (value === '' || value === null || value === undefined) {
      onChange({ stopContributingAfterYears: undefined })
    } else {
      const numValue = parseInt(value, 10)
      if (!isNaN(numValue)) {
        // Clamp between 1 and total years
        const clampedValue = Math.max(1, Math.min(years, numValue))
        onChange({ stopContributingAfterYears: clampedValue })
      }
    }
  }

  // Helper to select all text when input is focused
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  const handleStartingContributionChange = (value: string) => {
    const numValue = value === '' ? undefined : parseFloat(value)
    onChange({ additionalContribution: numValue !== undefined && !isNaN(numValue) ? Math.max(0, numValue) : undefined })
  }

  return (
    <div className="space-y-4">
      {/* Starting Contribution */}
      <div>
        <label
          htmlFor="starting-contribution"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Starting Contribution ($)
        </label>
        <input
          id="starting-contribution"
          type="number"
          min="0"
          step="100"
          value={parameters.additionalContribution !== undefined ? parameters.additionalContribution : ''}
          onChange={(e) => handleStartingContributionChange(e.target.value)}
          onFocus={handleFocus}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Base contribution amount used for variable contributions
        </p>
      </div>

      {/* % Increase per Year */}
      <div>
        <label
          htmlFor="contribution-increase-rate"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          % Increase per Year
        </label>
        <input
          id="contribution-increase-rate"
          type="number"
          min="-50"
          max="100"
          step="0.1"
          value={contributionIncreaseRate}
          onChange={(e) => handleIncreaseRateChange(e.target.value)}
          onFocus={handleFocus}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Annual percentage increase rate for contributions
          <br />
          {contributionIncreaseRate > 0 && (
            <span className="text-green-600">
              Contributions will increase by {contributionIncreaseRate.toFixed(1)}% each year
            </span>
          )}
          {contributionIncreaseRate < 0 && (
            <span className="text-orange-600">
              Contributions will decrease by {Math.abs(contributionIncreaseRate).toFixed(1)}% each year
            </span>
          )}
          {contributionIncreaseRate === 0 && (
            <span>No annual increase/decrease</span>
          )}
        </p>
      </div>

      {/* Stop Contributing After X Years */}
      <div>
        <label
          htmlFor="stop-contributing-after-years"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Stop Contributing After (Years)
        </label>
        <input
          id="stop-contributing-after-years"
          type="number"
          min="1"
          max={years}
          step="1"
          value={stopContributingAfterYears ?? ''}
          onChange={(e) => handleStopAfterYearsChange(e.target.value)}
          onFocus={handleFocus}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Number of years to make contributions (leave empty to contribute for the full {years}-year period)
          {stopContributingAfterYears !== undefined && stopContributingAfterYears < years && (
            <span className="block text-blue-600 mt-1">
              Contributions will stop after year {stopContributingAfterYears}
            </span>
          )}
        </p>
      </div>

    </div>
  )
}

