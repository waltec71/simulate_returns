// Monte Carlo-specific configuration inputs

import type { SimulationParameters } from '../lib/types'

interface MonteCarloConfigProps {
  parameters: SimulationParameters
  onChange: (updates: Partial<SimulationParameters>) => void
}

export default function MonteCarloConfig({
  parameters,
  onChange,
}: MonteCarloConfigProps) {
  const iterations = parameters.monteCarloIterations ?? 1000
  const returnVolatility = parameters.returnVolatility ?? 15

  const handleIterationsChange = (value: string) => {
    const numValue = parseInt(value, 10) || 1000
    const clampedValue = Math.max(100, Math.min(10000, numValue))
    onChange({ monteCarloIterations: clampedValue })
  }

  const handleVolatilityChange = (value: string) => {
    const numValue = parseFloat(value) || 0
    onChange({ returnVolatility: Math.max(0, numValue) })
  }

  // Helper to select all text when input is focused
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">
        Monte Carlo Configuration
      </h3>

      <div>
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
          max="10000"
          step="100"
          value={iterations}
          onChange={(e) => handleIterationsChange(e.target.value)}
          onFocus={handleFocus}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Number of simulation runs (100 - 10,000, default: 1,000)
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
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-xs text-gray-700 font-medium mb-2">
            How Monte Carlo Simulation Works:
          </p>
          <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
            <li>
              Runs multiple iterations (configurable above) with random return
              variations
            </li>
            <li>
              Each iteration simulates the full investment period with returns
              that vary around your expected return rate
            </li>
            <li>
              The volatility parameter represents the standard deviation of annual
              returns - higher volatility means more uncertainty
            </li>
            <li>
              Results show percentile ranges (10th, 25th, 50th, 75th, 90th) -
              the 50th percentile (median) represents the most likely outcome
            </li>
            <li>
              More iterations provide more accurate results but take longer to
              calculate
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

