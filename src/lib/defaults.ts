// Default values for simulation parameters
// This is the single source of truth for all default values in the application

/**
 * Default values used when creating a new simulation
 */
export const NEW_SIMULATION_DEFAULTS = {
  initialInvestment: 10000,
  years: 30,
  returnRate: 7,
  additionalContribution: 0,
  varianceMethod: 'none' as const,
  monteCarloIterations: 10000,
  manualContributionsEnabled: false,
  variableContributionsEnabled: false,
} as const

/**
 * Default values used when normalizing parameters (filling in missing values during calculations)
 * These are used when a field is undefined/empty
 */
export const NORMALIZATION_DEFAULTS = {
  initialInvestment: 0,
  years: 1,
  returnRate: 0,
  additionalContribution: 0,
  varianceMethod: 'none' as const,
  returnVolatility: 0, // Default is 0, but will be set to 15 if varianceMethod is 'monte-carlo'
  monteCarloIterations: 10000,
  manualContributionsEnabled: false,
  variableContributionsEnabled: false,
} as const

/**
 * Default volatility for Monte Carlo when variance method is 'monte-carlo'
 */
export const MONTE_CARLO_DEFAULT_VOLATILITY = 15

/**
 * Get a default value for a new simulation
 */
export function getNewSimulationDefault<K extends keyof typeof NEW_SIMULATION_DEFAULTS>(
  key: K
): typeof NEW_SIMULATION_DEFAULTS[K] {
  return NEW_SIMULATION_DEFAULTS[key]
}

/**
 * Get a normalization default value (used when field is missing during calculation)
 */
export function getNormalizationDefault<K extends keyof typeof NORMALIZATION_DEFAULTS>(
  key: K
): typeof NORMALIZATION_DEFAULTS[K] {
  return NORMALIZATION_DEFAULTS[key]
}

