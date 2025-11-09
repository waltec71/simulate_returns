// TypeScript type definitions for simulation parameters and results

export type VarianceMethod = 'none' | 'monte-carlo' | 'historical'

export interface SimulationParameters {
  initialInvestment?: number
  years?: number
  returnRate?: number // as percentage
  additionalContribution?: number // per year
  returnVolatility?: number // optional volatility (standard deviation) for Monte Carlo
  varianceMethod?: VarianceMethod // variance simulation method
  monteCarloIterations?: number // number of simulation runs (default: 1000, max: 10000)
  manualContributions?: (number | null)[] // per-year contributions (optional)
  manualContributionsEnabled?: boolean // whether manual contributions mode is enabled
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
  resultsInitialInvestment?: number // Initial investment used when generating these results
}

