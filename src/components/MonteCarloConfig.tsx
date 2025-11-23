// Monte Carlo-specific configuration inputs

import type { SimulationParameters } from '../lib/types'
import { NORMALIZATION_DEFAULTS, MONTE_CARLO_DEFAULT_VOLATILITY } from '../lib/defaults'

interface MonteCarloConfigProps {
  parameters: SimulationParameters
  onChange: (updates: Partial<SimulationParameters>) => void
}

export default function MonteCarloConfig({
  parameters,
  onChange,
}: MonteCarloConfigProps) {
  const returnVolatility = parameters.returnVolatility ?? MONTE_CARLO_DEFAULT_VOLATILITY

  const handleVolatilityChange = (value: string) => {
    const numValue = parseFloat(value) || 0
    onChange({ returnVolatility: Math.max(0, numValue) })
  }

  // Helper to select all text when input is focused
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  const baselineReturn = parameters.monteCarloBaselineReturn ?? parameters.returnRate ?? 7

  const handleBaselineReturnChange = (value: string) => {
    const numValue = parseFloat(value) || 0
    onChange({ monteCarloBaselineReturn: numValue })
  }

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="monte-carlo-baseline-return"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Baseline Return (%)
        </label>
        <input
          id="monte-carlo-baseline-return"
          type="number"
          min="-100"
          max="1000"
          step="0.1"
          value={baselineReturn}
          onChange={(e) => handleBaselineReturnChange(e.target.value)}
          onFocus={handleFocus}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Expected average return rate used as the center of the distribution
        </p>
      </div>

      <div>
        <label
          htmlFor="monte-carlo-volatility"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Return Volatility (%)
        </label>
        <input
          id="monte-carlo-volatility"
          type="number"
          min="0"
          step="0.1"
          value={returnVolatility}
          onChange={(e) => handleVolatilityChange(e.target.value)}
          onFocus={handleFocus}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Standard deviation (volatility) of annual returns
        </p>
      </div>

      {/* Legacy iterations input - hidden from user, defaults to 10000 */}
      {/* <div>
        <label
          htmlFor="monte-carlo-iterations"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Iterations
        </label>
        <input
          id="monte-carlo-iterations"
          type="number"
          min="100"
          max="100000"
          step="100"
          value={iterations}
          onChange={(e) => handleIterationsChange(e.target.value)}
          onFocus={handleFocus}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Number of simulation runs (100 - 100,000, default: 10,000)
        </p>
      </div> */}
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-xs text-gray-700 font-medium mb-2">
            How Monte Carlo Simulation Works:
          </p>
          <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
            <li>
              Runs 10,000 iterations with random returns that vary around your baseline return rate
            </li>
            <li>
              Each iteration simulates the full investment period with returns
              that vary around your baseline return rate
            </li>
            <li>
              The volatility parameter represents the standard deviation of annual
              returns - higher volatility means more uncertainty
            </li>
            <li>
              Results show percentile ranges (10th, 25th, 50th, 75th, 90th) -
              the 50th percentile (median) represents the most likely outcome
            </li>
          </ul>
        </div>
    </div>
  )
}

