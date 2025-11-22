// Results display (percentiles, final amount)

import type { SimulationResult, MonteCarloResult, SimulationParameters } from '../lib/types'
import { formatCurrency } from '../utils/formatters'
import { calculateTotalContributions } from '../lib/calculations'

interface SimulationResultsProps {
  results: SimulationResult[]
  monteCarloResults?: MonteCarloResult
  parameters?: SimulationParameters
}

export default function SimulationResults({
  results,
  monteCarloResults,
  parameters,
}: SimulationResultsProps) {
  if (!results || results.length === 0) {
    return null
  }

  const finalResult = results[results.length - 1]
  const finalAmount = finalResult ? finalResult.total : 0
  const hasMonteCarlo = monteCarloResults && monteCarloResults.percentiles
  // Use parameters from the simulation run, not current parameters
  // This ensures contributions don't update until simulation is run
  const totalContributions = parameters
    ? calculateTotalContributions(parameters)
    : 0

  if (hasMonteCarlo) {
    const { percentiles } = monteCarloResults
    return (
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Final Amount (Percentiles)
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-2 bg-white rounded border border-gray-200">
            <span className="text-sm font-medium text-gray-700">10th Percentile</span>
            <span className="text-lg font-semibold text-red-600">
              {formatCurrency(percentiles.p10)}
            </span>
          </div>
          <div className="flex justify-between items-center p-2 bg-white rounded border border-gray-200">
            <span className="text-sm font-medium text-gray-700">25th Percentile</span>
            <span className="text-lg font-semibold text-orange-600">
              {formatCurrency(percentiles.p25)}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-blue-100 rounded border-2 border-blue-400">
            <span className="text-base font-semibold text-gray-900">
              50th Percentile (Median)
            </span>
            <span className="text-xl font-bold text-blue-700">
              {formatCurrency(percentiles.p50)}
            </span>
          </div>
          <div className="flex justify-between items-center p-2 bg-white rounded border border-gray-200">
            <span className="text-sm font-medium text-gray-700">75th Percentile</span>
            <span className="text-lg font-semibold text-emerald-600">
              {formatCurrency(percentiles.p75)}
            </span>
          </div>
          <div className="flex justify-between items-center p-2 bg-white rounded border border-gray-200">
            <span className="text-sm font-medium text-gray-700">90th Percentile</span>
            <span className="text-lg font-semibold text-indigo-600">
              {formatCurrency(percentiles.p90)}
            </span>
          </div>
        </div>
        {results.length > 0 && (
          <p className="text-sm text-gray-600 mt-3 text-center">
            After {results.length} {results.length === 1 ? 'year' : 'years'}
          </p>
        )}
        {totalContributions > 0 && (
          <div className="mt-4 pt-4 border-t border-blue-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Total Cash Contributions
              </span>
              <span className="text-lg font-semibold text-gray-800">
                {formatCurrency(totalContributions)}
              </span>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Standard results display (no variance)
  return (
    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Final Amount
      </h3>
      <p className="text-3xl font-bold text-blue-600">
        {formatCurrency(finalAmount)}
      </p>
      {results.length > 0 && (
        <p className="text-sm text-gray-600 mt-2">
          After {results.length} {results.length === 1 ? 'year' : 'years'}
        </p>
      )}
      {totalContributions > 0 && (
        <div className="mt-4 pt-4 border-t border-blue-200">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">
              Total Cash Contributions
            </span>
            <span className="text-lg font-semibold text-gray-800">
              {formatCurrency(totalContributions)}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

