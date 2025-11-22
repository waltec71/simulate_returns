// Monte Carlo simulation implementation

import type { SimulationParameters, SimulationResult, MonteCarloResult, YearlyPercentiles } from './types'
import { calculateYearlyResults } from './calculations'
import { NORMALIZATION_DEFAULTS } from './defaults'

/**
 * Generate a random return rate based on normal distribution
 */
function generateRandomReturn(meanReturn: number, standardDeviation: number): number {
  // Box-Muller transform for normal distribution
  const u1 = Math.random()
  const u2 = Math.random()
  const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
  
  // Apply variance and mean
  return meanReturn + z0 * standardDeviation
}

/**
 * Run a single Monte Carlo simulation iteration
 */
function runMonteCarloIteration(
  parameters: SimulationParameters
): SimulationResult[] {
  const returnRate = parameters.returnRate ?? NORMALIZATION_DEFAULTS.returnRate
  const meanReturn = returnRate / 100
  const standardDeviation = Math.max(
    0,
    (parameters.returnVolatility ?? NORMALIZATION_DEFAULTS.returnVolatility) / 100
  )
  const years = parameters.years ?? NORMALIZATION_DEFAULTS.years

  const yearlyReturns: number[] = []
  for (let year = 0; year < years; year++) {
    const simulatedReturn =
      standardDeviation > 0
        ? generateRandomReturn(meanReturn, standardDeviation)
        : meanReturn
    yearlyReturns.push(simulatedReturn)
  }

  return calculateYearlyResults(parameters, yearlyReturns)
}

/**
 * Calculate percentiles from an array of values
 */
function calculatePercentile(values: number[], percentile: number): number {
  const sorted = [...values].sort((a, b) => a - b)
  const index = Math.ceil((percentile / 100) * sorted.length) - 1
  return sorted[Math.max(0, index)]
}

/**
 * Calculate all percentiles (10, 25, 50, 75, 90) for a given year
 */
function calculateYearPercentiles(
  allResults: SimulationResult[][],
  year: number
): { p10: number; p25: number; p50: number; p75: number; p90: number } {
  const yearAmounts = allResults.map((result) => {
    const yearResult = result.find((r) => r.year === year)
    return yearResult ? yearResult.total : 0
  })
  
  return {
    p10: calculatePercentile(yearAmounts, 10),
    p25: calculatePercentile(yearAmounts, 25),
    p50: calculatePercentile(yearAmounts, 50),
    p75: calculatePercentile(yearAmounts, 75),
    p90: calculatePercentile(yearAmounts, 90),
  }
}

/**
 * Run Monte Carlo simulation with specified number of iterations
 * Optionally accepts a progress callback for long-running simulations
 */
export function runMonteCarloSimulation(
  parameters: SimulationParameters,
  iterations: number = NORMALIZATION_DEFAULTS.monteCarloIterations,
  onProgress?: (progress: number) => void
): MonteCarloResult {
  const allResults: SimulationResult[][] = []
  
  // Run all iterations
  for (let i = 0; i < iterations; i++) {
    allResults.push(runMonteCarloIteration(parameters))
    
    // Report progress every 10% or every 100 iterations, whichever is more frequent
    if (onProgress && (i % Math.max(1, Math.floor(iterations / 10)) === 0 || i === iterations - 1)) {
      onProgress((i + 1) / iterations)
    }
  }
  
  // Calculate percentiles for final year
  const years = parameters.years ?? NORMALIZATION_DEFAULTS.years
  const finalYear = years
  const finalAmounts = allResults.map((result) => {
    const finalResult = result.find((r) => r.year === finalYear)
    return finalResult ? finalResult.total : 0
  })
  
  // Calculate percentiles for each year
  const yearlyPercentiles: YearlyPercentiles[] = []
  for (let year = 1; year <= years; year++) {
    const yearPercentiles = calculateYearPercentiles(allResults, year)
    yearlyPercentiles.push({
      year,
      ...yearPercentiles,
    })
  }
  
  return {
    percentiles: {
      p10: calculatePercentile(finalAmounts, 10),
      p25: calculatePercentile(finalAmounts, 25),
      p50: calculatePercentile(finalAmounts, 50),
      p75: calculatePercentile(finalAmounts, 75),
      p90: calculatePercentile(finalAmounts, 90),
    },
    yearlyPercentiles,
    results: allResults,
  }
}

