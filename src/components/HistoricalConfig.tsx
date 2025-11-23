// Historical variance configuration inputs

import { useEffect } from 'react'
import type { SimulationParameters } from '../lib/types'
import { historicalData, type MarketIndex, getHistoricalData, getValidStartYears, getAverageYearlyReturn } from '../lib/historicalData'
import { NORMALIZATION_DEFAULTS } from '../lib/defaults'
import { formatPercentage } from '../utils/formatters'

interface HistoricalConfigProps {
  parameters: SimulationParameters
  onChange: (updates: Partial<SimulationParameters>) => void
}

export default function HistoricalConfig({
  parameters,
  onChange,
}: HistoricalConfigProps) {
  const selectedIndex = parameters.historicalMarketIndex || 'sp500'
  const years = parameters.years ?? NORMALIZATION_DEFAULTS.years

  // Set default to sp500 if no index is selected
  useEffect(() => {
    if (!parameters.historicalMarketIndex) {
      onChange({ historicalMarketIndex: 'sp500' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parameters.historicalMarketIndex]) // Only set if not already set

  const handleIndexChange = (value: string) => {
    onChange({ historicalMarketIndex: value as MarketIndex })
  }

  // Get selected index data
  const selectedData = selectedIndex ? getHistoricalData(selectedIndex) : null
  const validStartYears = selectedIndex && years ? getValidStartYears(selectedIndex, years) : []
  const availablePeriods = validStartYears.length

  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="historical-market-index"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Market Index
        </label>
        <select
          id="historical-market-index"
          value={selectedIndex}
          onChange={(e) => handleIndexChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {historicalData.map((data) => (
            <option key={data.index} value={data.index}>
              {data.name}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-gray-500">
          Select a market index to use historical returns
        </p>
      </div>

      {selectedData && (
        <div className="p-3 bg-gray-50 border border-gray-200 rounded-md">
          <div className="space-y-1 text-sm">
            <p className="text-gray-700">
              <span className="font-medium">Available data:</span>{' '}
              {selectedData.startYear} - {selectedData.endYear}
            </p>
            {(() => {
              const avgReturn = selectedIndex ? getAverageYearlyReturn(selectedIndex) : null
              return avgReturn !== null ? (
                <p className="text-gray-700">
                  <span className="font-medium">CAGR (Compound Annual Growth Rate):</span>{' '}
                  {formatPercentage(avgReturn, 2)} (includes dividends, {selectedData.startYear}-{selectedData.endYear})
                </p>
              ) : null
            })()}
            {years > 0 && (
              <p className="text-gray-700">
                <span className="font-medium">Available periods:</span>{' '}
                {availablePeriods > 0 ? (
                  <>
                    {availablePeriods} period{availablePeriods !== 1 ? 's' : ''} available for a{' '}
                    {years}-year simulation
                  </>
                ) : (
                  <span className="text-orange-600">
                    Insufficient data for a {years}-year simulation
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
        <p className="text-xs text-gray-700 font-medium mb-2">
          How Historical Returns Simulation Works:
        </p>
        <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
          <li>
            Uses actual historical annual returns from the selected market index
          </li>
          <li>
            Runs simulations for all available historical periods
          </li>
          <li>
            For example, with 55 years of data and a 30-year simulation, we can
            simulate 25 different 30-year periods
          </li>
          <li>
            Results show percentile ranges (10th, 25th, 50th, 75th, 90th) based
            on all historical periods
          </li>
          <li>
            The 50th percentile (median) represents the typical outcome
          </li>
        </ul>
      </div>
    </div>
  )
}

