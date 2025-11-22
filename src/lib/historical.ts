// Historical variance simulation implementation

import type {
  SimulationParameters,
  SimulationResult,
  MonteCarloResult,
  YearlyPercentiles,
} from './types'
import {
  getHistoricalData,
  getReturnsForRange,
  getValidStartYears,
} from './historicalData'
import { NORMALIZATION_DEFAULTS } from './defaults'

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
 * Run a single historical simulation iteration using specific historical returns
 */
function runHistoricalIteration(
  parameters: SimulationParameters,
  historicalReturns: number[]
): SimulationResult[] {
  const results: SimulationResult[] = []
  const initialInvestment = parameters.initialInvestment ?? NORMALIZATION_DEFAULTS.initialInvestment
  const years = parameters.years ?? NORMALIZATION_DEFAULTS.years
  const additionalContribution = parameters.additionalContribution ?? NORMALIZATION_DEFAULTS.additionalContribution

  let currentTotal = initialInvestment

  for (let year = 1; year <= years; year++) {
    // Get the historical return for this year (0-indexed)
    const historicalReturn = historicalReturns[year - 1]
    if (historicalReturn === undefined) {
      // If we run out of historical data, use 0% return
      break
    }

    const r = historicalReturn / 100 // Convert percentage to decimal

    // Apply return for the year
    currentTotal = currentTotal * (1 + r)

    // Add contribution for the year
    // Use manual contributions if enabled and available, otherwise use standard contribution
    let contribution = additionalContribution
    if (
      parameters.manualContributionsEnabled &&
      parameters.manualContributions &&
      Array.isArray(parameters.manualContributions)
    ) {
      const manualValue = parameters.manualContributions[year - 1]
      if (manualValue === null) {
        contribution = 0
      } else if (manualValue !== undefined) {
        contribution = manualValue
      }
    }

    currentTotal += contribution

    results.push({
      year,
      total: currentTotal,
    })
  }

  return results
}

/**
 * Run historical simulation for a specific start year
 */
function runHistoricalSimulationForPeriod(
  parameters: SimulationParameters,
  startYear: number
): SimulationResult[] {
  const marketIndex = parameters.historicalMarketIndex
  if (!marketIndex) {
    throw new Error('Market index is required for historical simulation')
  }

  const years = parameters.years ?? NORMALIZATION_DEFAULTS.years
  const endYear = startYear + years - 1

  // Get historical returns for the specified range
  const historicalReturns = getReturnsForRange(marketIndex, startYear, endYear)

  if (historicalReturns.length !== years) {
    // Not enough data for this period
    return []
  }

  return runHistoricalIteration(parameters, historicalReturns)
}

/**
 * Run historical simulation over all possible periods
 */
export function runHistoricalSimulationAllPeriods(
  parameters: SimulationParameters
): MonteCarloResult {
  const marketIndex = parameters.historicalMarketIndex
  if (!marketIndex) {
    throw new Error('Market index is required for historical simulation')
  }

  const years = parameters.years ?? 1
  const data = getHistoricalData(marketIndex)
  if (!data) {
    throw new Error(`No historical data found for market index: ${marketIndex}`)
  }

  // Get all valid start years
  const validStartYears = getValidStartYears(marketIndex, years)

  if (validStartYears.length === 0) {
    // No valid periods, return empty result
    return {
      percentiles: { p10: 0, p25: 0, p50: 0, p75: 0, p90: 0 },
      yearlyPercentiles: [],
      results: [],
    }
  }

  // Run simulation for each valid start year
  const allResults: SimulationResult[][] = []
  for (const startYear of validStartYears) {
    const result = runHistoricalSimulationForPeriod(parameters, startYear)
    if (result.length > 0) {
      allResults.push(result)
    }
  }

  if (allResults.length === 0) {
    return {
      percentiles: { p10: 0, p25: 0, p50: 0, p75: 0, p90: 0 },
      yearlyPercentiles: [],
      results: [],
    }
  }

  // Calculate percentiles for final year
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

/**
 * Run historical simulation for a specific start year
 */
export function runHistoricalSimulation(
  parameters: SimulationParameters
): MonteCarloResult {
  const marketIndex = parameters.historicalMarketIndex
  if (!marketIndex) {
    throw new Error('Market index is required for historical simulation')
  }

  const startYear = parameters.historicalStartYear
  if (!startYear) {
    throw new Error('Start year is required for historical simulation')
  }

  const years = parameters.years ?? NORMALIZATION_DEFAULTS.years
  const endYear = startYear + years - 1

  // Get historical returns for the specified range
  const historicalReturns = getReturnsForRange(marketIndex, startYear, endYear)

  if (historicalReturns.length !== years) {
    // Not enough data, return empty result
    return {
      percentiles: { p10: 0, p25: 0, p50: 0, p75: 0, p90: 0 },
      yearlyPercentiles: [],
      results: [],
    }
  }

  // Run single simulation with these returns
  const result = runHistoricalIteration(parameters, historicalReturns)

  // For single period, all percentiles are the same (the actual result)
  const finalAmount = result.length > 0 ? result[result.length - 1].total : 0

  // Create yearly percentiles (all same value for single period)
  const yearlyPercentiles: YearlyPercentiles[] = result.map((r) => ({
    year: r.year,
    p10: r.total,
    p25: r.total,
    p50: r.total,
    p75: r.total,
    p90: r.total,
  }))

  return {
    percentiles: {
      p10: finalAmount,
      p25: finalAmount,
      p50: finalAmount,
      p75: finalAmount,
      p90: finalAmount,
    },
    yearlyPercentiles,
    results: [result],
  }
}

