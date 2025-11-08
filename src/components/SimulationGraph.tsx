// Chart component for displaying results

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { SimulationResult, MonteCarloResult } from '../lib/types'
import { formatCurrency } from '../utils/formatters'

// Custom tooltip component for better formatting
interface TooltipProps {
  active?: boolean
  payload?: Array<{
    dataKey: string
    value: number
    payload: {
      year: number
      total?: number
      p10?: number
      p25?: number
      p50?: number
      p75?: number
      p90?: number
    }
    color: string
    name: string
  }>
}

const CustomTooltip = ({ active, payload }: TooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg">
        <p className="text-sm font-semibold text-gray-700 mb-2">
          Year {data.year}
        </p>
        {payload.map((entry, index) => (
          <p
            key={index}
            className="text-sm font-medium"
            style={{ color: entry.color }}
          >
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

interface SimulationGraphProps {
  results: SimulationResult[]
  initialInvestment?: number
  monteCarloResults?: MonteCarloResult
}

export default function SimulationGraph({
  results,
  initialInvestment,
  monteCarloResults,
}: SimulationGraphProps) {
  if (!results || results.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center border border-gray-200 rounded-lg bg-gray-50">
        <p className="text-gray-500">No simulation data to display</p>
      </div>
    )
  }

  // Check if we have Monte Carlo results to display percentile lines
  const hasMonteCarlo = monteCarloResults && monteCarloResults.yearlyPercentiles.length > 0

  // Format data for Recharts, including year 0 if initial investment is provided
  const chartData: Array<{
    year: number
    total?: number
    p10?: number
    p25?: number
    p50?: number
    p75?: number
    p90?: number
  }> = []

  if (initialInvestment !== undefined) {
    const year0Data: typeof chartData[0] = { year: 0 }
    if (hasMonteCarlo) {
      // For Monte Carlo, all percentiles start at initial investment
      year0Data.p10 = Math.round(initialInvestment)
      year0Data.p25 = Math.round(initialInvestment)
      year0Data.p50 = Math.round(initialInvestment)
      year0Data.p75 = Math.round(initialInvestment)
      year0Data.p90 = Math.round(initialInvestment)
    } else {
      year0Data.total = Math.round(initialInvestment)
    }
    chartData.push(year0Data)
  }

  // Add data for each year
  for (let i = 0; i < results.length; i++) {
    const result = results[i]
    const yearData: typeof chartData[0] = { year: result.year }

    if (hasMonteCarlo && monteCarloResults) {
      // Use percentile data from Monte Carlo
      const yearPercentiles = monteCarloResults.yearlyPercentiles.find(
        (yp) => yp.year === result.year
      )
      if (yearPercentiles) {
        yearData.p10 = Math.round(yearPercentiles.p10)
        yearData.p25 = Math.round(yearPercentiles.p25)
        yearData.p50 = Math.round(yearPercentiles.p50)
        yearData.p75 = Math.round(yearPercentiles.p75)
        yearData.p90 = Math.round(yearPercentiles.p90)
      }
    } else {
      // Use standard total
      yearData.total = Math.round(result.total)
    }

    chartData.push(yearData)
  }

  // Color scheme for percentile lines
  const percentileColors = {
    p10: '#ef4444', // red-500
    p25: '#f97316', // orange-500
    p50: '#3b82f6', // blue-500 (median - emphasized)
    p75: '#10b981', // emerald-500
    p90: '#6366f1', // indigo-500
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="year"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => {
              if (value >= 1000000) {
                return `$${(value / 1000000).toFixed(1)}M`
              }
              if (value >= 1000) {
                return `$${(value / 1000).toFixed(0)}K`
              }
              return `$${value}`
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          {hasMonteCarlo ? (
            <>
              <Line
                type="monotone"
                dataKey="p10"
                stroke={percentileColors.p10}
                strokeWidth={1.5}
                dot={false}
                name="10th Percentile"
              />
              <Line
                type="monotone"
                dataKey="p25"
                stroke={percentileColors.p25}
                strokeWidth={1.5}
                dot={false}
                name="25th Percentile"
              />
              <Line
                type="monotone"
                dataKey="p50"
                stroke={percentileColors.p50}
                strokeWidth={2.5}
                dot={false}
                name="50th Percentile (Median)"
              />
              <Line
                type="monotone"
                dataKey="p75"
                stroke={percentileColors.p75}
                strokeWidth={1.5}
                dot={false}
                name="75th Percentile"
              />
              <Line
                type="monotone"
                dataKey="p90"
                stroke={percentileColors.p90}
                strokeWidth={1.5}
                dot={false}
                name="90th Percentile"
              />
              <Legend
                wrapperStyle={{ fontSize: '12px' }}
                iconType="line"
              />
            </>
          ) : (
            <Line
              type="monotone"
              dataKey="total"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
              name="Total"
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

