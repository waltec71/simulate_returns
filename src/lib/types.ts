// TypeScript type definitions for simulation parameters and results

import type { MarketIndex } from './historicalData'
export type VarianceMethod = 'none' | 'monte-carlo' | 'historical'

export interface SimulationParameters {
  initialInvestment?: number
  years?: number
  returnRate?: number // as percentage
  additionalContribution?: number // per year
  returnVolatility?: number // optional volatility (standard deviation) for Monte Carlo
  varianceMethod?: VarianceMethod // variance simulation method
  monteCarloIterations?: number // number of simulation runs (default: 1000, max: 10000) - legacy, defaults to 10000
  monteCarloBaselineReturn?: number // baseline return rate (%) for Monte Carlo simulations (used instead of returnRate)
  manualContributions?: (number | null)[] // per-year contributions (optional)
  manualContributionsEnabled?: boolean // whether manual contributions mode is enabled
  variableContributionsEnabled?: boolean // whether variable contributions feature is enabled
  contributionIncreaseRate?: number // annual percentage increase rate for contributions (e.g., 3% = 3.0)
  stopContributingAfterYears?: number // number of years to contribute, undefined = contribute for full period
  historicalMarketIndex?: MarketIndex // identifier for historical data source
  historicalStartYear?: number // optional start year for historical simulations
}

export interface SimulationResult {
  year: number
  total: number
}

export interface YearlyPercentiles {
  year: number
  p10: number
  p25: number
  p50: number
  p75: number
  p90: number
}

export interface MonteCarloResult {
  percentiles: {
    p10: number
    p25: number
    p50: number
    p75: number
    p90: number
  }
  yearlyPercentiles: YearlyPercentiles[] // Percentiles calculated for each year
  results: SimulationResult[][]
}

export interface SimulationConfig {
  id: string
  name: string
  parameters: SimulationParameters
  results?: SimulationResult[]
  monteCarloResults?: MonteCarloResult
  resultsInitialInvestment?: number // Initial investment used when generating these results (deprecated, use resultsParameters)
  resultsParameters?: SimulationParameters // Full parameters used when generating these results
}

