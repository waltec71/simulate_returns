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

  // Variable contributions settings
  const contributionIncreaseRate = parameters.contributionIncreaseRate ?? 0
  const stopContributingAfterYears = parameters.stopContributingAfterYears
  let currentYearContribution = additionalContribution

  for (let year = 1; year <= years; year++) {
    // Apply return for the year (use override if provided)
    const yearReturn = yearlyReturnOverrides?.[year - 1] ?? r
    currentTotal = currentTotal * (1 + yearReturn)

    // Determine contribution for this year
    let contribution = 0
    
    // Check if we should stop contributing after X years
    const shouldContribute = stopContributingAfterYears === undefined || year <= stopContributingAfterYears
    
    if (shouldContribute) {
      // Priority 1: Manual contributions if enabled and available for this year
      if (
        parameters.manualContributionsEnabled &&
        parameters.manualContributions &&
        Array.isArray(parameters.manualContributions) &&
        parameters.manualContributions[year - 1] !== undefined
      ) {
        const manualValue = parameters.manualContributions[year - 1]
        contribution = manualValue === null ? 0 : manualValue
      } else {
        // Priority 2: Use variable contributions with annual increase
        // Year 1: use base contribution
        // Year 2+: apply annual increase rate
        if (year === 1) {
          currentYearContribution = additionalContribution
        } else if (contributionIncreaseRate !== 0) {
          // Apply annual increase: multiply by (1 + increaseRate/100)
          currentYearContribution = currentYearContribution * (1 + contributionIncreaseRate / 100)
        }
        contribution = currentYearContribution
      }
    }
    // If shouldContribute is false, contribution remains 0

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
  const contributionIncreaseRate = parameters.contributionIncreaseRate ?? 0
  const stopContributingAfterYears = parameters.stopContributingAfterYears

  let contributionsTotal = 0
  let currentYearContribution = additionalContribution
  const effectiveYears = stopContributingAfterYears !== undefined 
    ? Math.min(stopContributingAfterYears, years) 
    : years

  // If manual contributions are enabled and array exists, sum them
  if (
    parameters.manualContributionsEnabled &&
    parameters.manualContributions &&
    Array.isArray(parameters.manualContributions)
  ) {
    // Only count contributions for the specified number of years
    for (let i = 0; i < effectiveYears; i++) {
      // Use manual contribution if defined, otherwise fall back to variable contribution
      const manualValue = parameters.manualContributions[i]
      let yearContribution = 0

      if (manualValue !== undefined) {
        if (manualValue === null) {
          yearContribution = 0
        } else {
          yearContribution = manualValue
        }
      } else {
        // Apply variable contribution settings when manual value is not set
        if (i === 0) {
          currentYearContribution = additionalContribution
        } else if (contributionIncreaseRate !== 0) {
          currentYearContribution = currentYearContribution * (1 + contributionIncreaseRate / 100)
        }
        yearContribution = currentYearContribution
      }

      contributionsTotal += yearContribution
    }
  } else {
    // Use variable contribution settings
    for (let i = 0; i < effectiveYears; i++) {
      if (i === 0) {
        currentYearContribution = additionalContribution
      } else if (contributionIncreaseRate !== 0) {
        currentYearContribution = currentYearContribution * (1 + contributionIncreaseRate / 100)
      }
      contributionsTotal += currentYearContribution
    }
  }

  // Include initial investment in total
  return initialInvestment + contributionsTotal
}

