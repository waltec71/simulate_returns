import { describe, it, expect } from 'vitest'
import {
  calculateCompoundInterest,
  calculateYearlyResults,
} from '../../src/lib/calculations'
import type { SimulationParameters } from '../../src/lib/types'

describe('calculateCompoundInterest', () => {
  it('should calculate compound interest with no contributions', () => {
    const result = calculateCompoundInterest(1000, 5, 10, 0)
    // A = P(1 + r)^t = 1000 * (1.05)^10 ≈ 1628.89
    expect(result).toBeCloseTo(1628.89, 2)
  })

  it('should calculate compound interest with annual contributions', () => {
    const result = calculateCompoundInterest(1000, 5, 10, 100)
    // Principal: 1000 * (1.05)^10 ≈ 1628.89
    // Contributions: 100 * ((1.05)^10 - 1) / 0.05 ≈ 1257.79
    // Total ≈ 2886.68
    expect(result).toBeCloseTo(2886.68, 2)
  })

  it('should handle zero return rate', () => {
    const result = calculateCompoundInterest(1000, 0, 10, 100)
    // Principal: 1000 (no growth)
    // Contributions: 100 * 10 = 1000
    // Total: 2000
    expect(result).toBe(2000)
  })

  it('should handle zero initial investment', () => {
    const result = calculateCompoundInterest(0, 5, 10, 100)
    // Only contributions grow: 100 * ((1.05)^10 - 1) / 0.05 ≈ 1257.79
    expect(result).toBeCloseTo(1257.79, 2)
  })

  it('should handle zero years', () => {
    const result = calculateCompoundInterest(1000, 5, 0, 100)
    // No time for growth, just initial investment
    expect(result).toBe(1000)
  })

  it('should handle negative return rate', () => {
    const result = calculateCompoundInterest(1000, -5, 10, 100)
    // Should still calculate correctly with negative rate
    expect(result).toBeGreaterThan(0)
    expect(result).toBeLessThan(1000 + 100 * 10) // Less than initial + contributions
  })

  it('should handle high return rates', () => {
    const result = calculateCompoundInterest(1000, 20, 5, 0)
    // A = 1000 * (1.20)^5 ≈ 2488.32
    expect(result).toBeCloseTo(2488.32, 2)
  })

  it('should handle large numbers', () => {
    const result = calculateCompoundInterest(1000000, 7, 30, 50000)
    // Should calculate without errors
    expect(result).toBeGreaterThan(1000000)
    expect(Number.isFinite(result)).toBe(true)
  })
})

describe('calculateYearlyResults', () => {
  it('should calculate year-by-year results with constant contribution', () => {
    const parameters: SimulationParameters = {
      initialInvestment: 1000,
      years: 3,
      returnRate: 10,
      additionalContribution: 100,
    }

    const results = calculateYearlyResults(parameters)

    expect(results).toHaveLength(3)
    expect(results[0].year).toBe(1)
    expect(results[1].year).toBe(2)
    expect(results[2].year).toBe(3)

    // Year 1: (1000 * 1.10) + 100 = 1200
    expect(results[0].total).toBeCloseTo(1200, 2)

    // Year 2: (1200 * 1.10) + 100 = 1420
    expect(results[1].total).toBeCloseTo(1420, 2)

    // Year 3: (1420 * 1.10) + 100 = 1662
    expect(results[2].total).toBeCloseTo(1662, 2)
  })

  it('should calculate year-by-year results with manual contributions', () => {
    const parameters: SimulationParameters = {
      initialInvestment: 1000,
      years: 3,
      returnRate: 10,
      additionalContribution: 100,
      manualContributions: [100, 200, 50],
    }

    const results = calculateYearlyResults(parameters)

    expect(results).toHaveLength(3)

    // Year 1: (1000 * 1.10) + 100 = 1200
    expect(results[0].total).toBeCloseTo(1200, 2)

    // Year 2: (1200 * 1.10) + 200 = 1520
    expect(results[1].total).toBeCloseTo(1520, 2)

    // Year 3: (1520 * 1.10) + 50 = 1722
    expect(results[2].total).toBeCloseTo(1722, 2)
  })

  it('should use default contribution when manual contribution is undefined for a year', () => {
    const parameters: SimulationParameters = {
      initialInvestment: 1000,
      years: 3,
      returnRate: 10,
      additionalContribution: 100,
      manualContributions: [100, undefined, 50] as any,
    }

    const results = calculateYearlyResults(parameters)

    // Year 2 should use default contribution (100) since manualContributions[1] is undefined
    // Year 1: (1000 * 1.10) + 100 = 1200
    expect(results[0].total).toBeCloseTo(1200, 2)

    // Year 2: (1200 * 1.10) + 100 = 1420 (uses default)
    expect(results[1].total).toBeCloseTo(1420, 2)

    // Year 3: (1420 * 1.10) + 50 = 1612
    expect(results[2].total).toBeCloseTo(1612, 2)
  })

  it('should handle zero return rate', () => {
    const parameters: SimulationParameters = {
      initialInvestment: 1000,
      years: 3,
      returnRate: 0,
      additionalContribution: 100,
    }

    const results = calculateYearlyResults(parameters)

    expect(results[0].total).toBe(1100) // 1000 + 100
    expect(results[1].total).toBe(1200) // 1100 + 100
    expect(results[2].total).toBe(1300) // 1200 + 100
  })

  it('should handle zero contributions', () => {
    const parameters: SimulationParameters = {
      initialInvestment: 1000,
      years: 3,
      returnRate: 10,
      additionalContribution: 0,
    }

    const results = calculateYearlyResults(parameters)

    expect(results[0].total).toBeCloseTo(1100, 2) // 1000 * 1.10
    expect(results[1].total).toBeCloseTo(1210, 2) // 1100 * 1.10
    expect(results[2].total).toBeCloseTo(1331, 2) // 1210 * 1.10
  })

  it('should handle single year', () => {
    const parameters: SimulationParameters = {
      initialInvestment: 1000,
      years: 1,
      returnRate: 10,
      additionalContribution: 100,
    }

    const results = calculateYearlyResults(parameters)

    expect(results).toHaveLength(1)
    expect(results[0].total).toBeCloseTo(1200, 2)
  })

  it('should handle negative return rate', () => {
    const parameters: SimulationParameters = {
      initialInvestment: 1000,
      years: 2,
      returnRate: -5,
      additionalContribution: 100,
    }

    const results = calculateYearlyResults(parameters)

    // Year 1: (1000 * 0.95) + 100 = 1050
    expect(results[0].total).toBeCloseTo(1050, 2)

    // Year 2: (1050 * 0.95) + 100 = 1097.5
    expect(results[1].total).toBeCloseTo(1097.5, 2)
  })

  it('should handle empty manual contributions array', () => {
    const parameters: SimulationParameters = {
      initialInvestment: 1000,
      years: 2,
      returnRate: 10,
      additionalContribution: 100,
      manualContributions: [],
    }

    const results = calculateYearlyResults(parameters)

    // Should use default contribution for all years
    expect(results[0].total).toBeCloseTo(1200, 2)
    expect(results[1].total).toBeCloseTo(1420, 2)
  })
})

