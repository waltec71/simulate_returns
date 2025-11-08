// Input validation utilities

export function validatePositiveNumber(value: number): boolean {
  return !isNaN(value) && value >= 0 && isFinite(value)
}

export function validatePositiveInteger(value: number): boolean {
  return validatePositiveNumber(value) && Number.isInteger(value) && value > 0
}

export function validateReturnRate(value: number): boolean {
  return !isNaN(value) && isFinite(value) && value >= -100 && value <= 1000
}

export function validateMonteCarloIterations(value: number): boolean {
  return (
    validatePositiveInteger(value) && value >= 100 && value <= 10000
  )
}

export function validateYears(value: number): boolean {
  return validatePositiveInteger(value) && value >= 1 && value <= 100
}

export function validateInitialInvestment(value: number): boolean {
  return validatePositiveNumber(value) && value <= 1e15 // Reasonable upper limit
}

export function validateContribution(value: number): boolean {
  return validatePositiveNumber(value) && value <= 1e12 // Reasonable upper limit
}

