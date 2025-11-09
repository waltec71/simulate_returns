import type { SimulationParameters } from './types'

export function normalizeManualContributions(
  parameters: SimulationParameters,
  years: number
): (number | null)[] {
  const safeYears = Math.max(0, years)
  const fillValue =
    parameters.additionalContribution !== undefined &&
    parameters.additionalContribution !== null
      ? parameters.additionalContribution
      : 0

  const manual = Array.isArray(parameters.manualContributions)
    ? parameters.manualContributions
    : []

  const normalized = manual.slice(0, safeYears)

  if (normalized.length < safeYears) {
    normalized.push(
      ...Array(safeYears - normalized.length).fill(fillValue)
    )
  }

  return normalized
}

export function contributionsMatch(
  a: (number | null)[] | undefined,
  b: (number | null)[]
): boolean {
  if (!Array.isArray(a)) {
    return b.length === 0
  }
  if (a.length !== b.length) {
    return false
  }
  return a.every((value, index) => value === b[index])
}

export function sanitizeManualContributions(
  parameters: SimulationParameters,
  years: number
): number[] | undefined {
  if (
    !parameters.manualContributionsEnabled ||
    !Array.isArray(parameters.manualContributions)
  ) {
    return undefined
  }

  const normalized = normalizeManualContributions(parameters, years)

  return normalized.map((value) => (value === null || value === undefined ? 0 : value))
}

