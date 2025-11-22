// Core calculation logic for compound interest

import type { SimulationParameters, SimulationResult } from './types'
import { NORMALIZATION_DEFAULTS } from './defaults'

/**
 * Calculate compound interest with annual contributions
 * Formula: A = P(1 + r)^t + C * (((1 + r)^t - 1) / r)
 */
export function calculateCompoundInterest(
  initialInvestment: number,
  returnRate: number,
  years: number,
  annualContribution: number
): number {
  const r = returnRate / 100 // Convert percentage to decimal
  const t = years

  // Principal growth
  const principalGrowth = initialInvestment * Math.pow(1 + r, t)

  // Contribution growth (annuity formula)
  let contributionGrowth = 0
  if (r > 0) {
    contributionGrowth = annualContribution * ((Math.pow(1 + r, t) - 1) / r)
  } else {
    contributionGrowth = annualContribution * t
  }

  return principalGrowth + contributionGrowth
}

/**
 * Calculate year-by-year results for a simulation
 */
export function calculateYearlyResults(
  parameters: SimulationParameters,
  yearlyReturnOverrides?: number[]
): SimulationResult[] {
  const results: SimulationResult[] = []
  const returnRate = parameters.returnRate ?? NORMALIZATION_DEFAULTS.returnRate
  const initialInvestment = parameters.initialInvestment ?? NORMALIZATION_DEFAULTS.initialInvestment
  const years = parameters.years ?? NORMALIZATION_DEFAULTS.years
  const additionalContribution = parameters.additionalContribution ?? NORMALIZATION_DEFAULTS.additionalContribution
  
  const r = returnRate / 100
  let currentTotal = initialInvestment

  for (let year = 1; year <= years; year++) {
    // Apply return for the year (use override if provided)
    const yearReturn = yearlyReturnOverrides?.[year - 1] ?? r
    currentTotal = currentTotal * (1 + yearReturn)

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
 * Calculate total cash contributions over the simulation period (including initial investment)
 */
export function calculateTotalContributions(
  parameters: SimulationParameters
): number {
  const initialInvestment = parameters.initialInvestment ?? NORMALIZATION_DEFAULTS.initialInvestment
  const years = parameters.years ?? NORMALIZATION_DEFAULTS.years
  const additionalContribution = parameters.additionalContribution ?? NORMALIZATION_DEFAULTS.additionalContribution

  let contributionsTotal = 0

  // If manual contributions are enabled and array exists, sum them
  if (
    parameters.manualContributionsEnabled &&
    parameters.manualContributions &&
    Array.isArray(parameters.manualContributions)
  ) {
    // Only count contributions for the specified number of years
    for (let i = 0; i < years; i++) {
      // Use manual contribution if defined, otherwise fall back to default
      const manualValue = parameters.manualContributions[i]
      let yearContribution = additionalContribution

      if (manualValue === null) {
        yearContribution = 0
      } else if (manualValue !== undefined) {
        yearContribution = manualValue
      }

      contributionsTotal += yearContribution || 0
    }
  } else {
    // Otherwise, multiply annual contribution by years
    contributionsTotal = additionalContribution * years
  }

  // Include initial investment in total
  return initialInvestment + contributionsTotal
}

