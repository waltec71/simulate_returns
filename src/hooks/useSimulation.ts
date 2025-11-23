// Custom hook for simulation state and logic

import { useState, useCallback } from 'react'
import type { SimulationConfig } from '../lib/types'
import { calculateYearlyResults } from '../lib/calculations'
import { runMonteCarloSimulation } from '../lib/monteCarlo'
import { sanitizeManualContributions } from '../lib/manualContributions'
import {
  NEW_SIMULATION_DEFAULTS,
  NORMALIZATION_DEFAULTS,
  MONTE_CARLO_DEFAULT_VOLATILITY,
} from '../lib/defaults'

export function useSimulation() {
  const [simulations, setSimulations] = useState<SimulationConfig[]>([])

  const addSimulation = useCallback((copyFrom?: SimulationConfig) => {
    setSimulations((prev) => {
      const newSimulation: SimulationConfig = copyFrom
        ? {
            ...copyFrom,
            id: crypto.randomUUID(),
            name: `${copyFrom.name} (Copy)`,
            results: undefined,
            monteCarloResults: undefined,
            // Deep copy parameters to ensure all advanced variables are included
            parameters: {
              ...copyFrom.parameters,
              // Deep copy manualContributions array if it exists
              manualContributions: copyFrom.parameters.manualContributions
                ? [...copyFrom.parameters.manualContributions]
                : undefined,
            },
          }
        : {
            id: crypto.randomUUID(),
            name: `Simulation ${prev.length + 1}`,
            parameters: {
              initialInvestment: NEW_SIMULATION_DEFAULTS.initialInvestment,
              years: NEW_SIMULATION_DEFAULTS.years,
              returnRate: NEW_SIMULATION_DEFAULTS.returnRate,
              additionalContribution: NEW_SIMULATION_DEFAULTS.additionalContribution,
              varianceMethod: NEW_SIMULATION_DEFAULTS.varianceMethod,
              monteCarloIterations: NEW_SIMULATION_DEFAULTS.monteCarloIterations,
              manualContributionsEnabled: NEW_SIMULATION_DEFAULTS.manualContributionsEnabled,
              variableContributionsEnabled: NEW_SIMULATION_DEFAULTS.variableContributionsEnabled,
            },
          }
      return [...prev, newSimulation]
    })
    // Return a placeholder ID - the actual ID will be generated in the state update
    return crypto.randomUUID()
  }, [])

  const updateSimulation = useCallback(
    (id: string, updates: Partial<SimulationConfig>) => {
      setSimulations((prev) =>
        prev.map((sim) => (sim.id === id ? { ...sim, ...updates } : sim))
      )
    },
    []
  )

  const deleteSimulation = useCallback((id: string) => {
    setSimulations((prev) => prev.filter((sim) => sim.id !== id))
  }, [])

  const runSimulation = useCallback((id: string) => {
    setSimulations((prev) =>
      prev.map((sim) => {
        if (sim.id !== id) return sim

        const { parameters } = sim

        // Normalize parameters - fill in defaults for empty fields
        const varianceMethod = parameters.varianceMethod || 'none'
        const normalizedParams = {
          ...parameters,
          initialInvestment: parameters.initialInvestment ?? 0,
          years: parameters.years ?? 1,
          returnRate: parameters.returnRate ?? 0,
          additionalContribution: parameters.additionalContribution ?? 0,
          varianceMethod,
          returnVolatility:
            parameters.returnVolatility ??
            (varianceMethod === 'monte-carlo' ? 15 : 0),
        }

        const sanitizedManualContributions = sanitizeManualContributions(
          normalizedParams,
          normalizedParams.years ?? 1
        )
        if (sanitizedManualContributions) {
          normalizedParams.manualContributions = sanitizedManualContributions
        }

        // Validate inputs
        if (
          normalizedParams.initialInvestment < 0 ||
          normalizedParams.years <= 0 ||
          normalizedParams.returnRate === undefined
        ) {
          return sim
        }

        // Run basic calculation
        const results = calculateYearlyResults(normalizedParams)

        // Run Monte Carlo if volatility is specified
        let monteCarloResults
        if (
          normalizedParams.returnVolatility &&
          normalizedParams.returnVolatility > 0 &&
          normalizedParams.varianceMethod === 'monte-carlo'
        ) {
          const iterations = normalizedParams.monteCarloIterations || 10000
          monteCarloResults = runMonteCarloSimulation(normalizedParams, iterations)
        }

        // Update parameters with normalized values so user can see defaults that were used
        // Store the full parameters that were used for these results
        return {
          ...sim,
          parameters: normalizedParams,
          results,
          monteCarloResults,
          resultsInitialInvestment: normalizedParams.initialInvestment, // Keep for backwards compatibility
          resultsParameters: { ...normalizedParams }, // Store full parameters used for this simulation
        }
      })
    )
  }, [])

  const runAllSimulations = useCallback(() => {
    setSimulations((prev) =>
      prev.map((sim) => {
        const { parameters } = sim

        // Normalize parameters - fill in defaults for empty fields
        const varianceMethod = parameters.varianceMethod ?? NORMALIZATION_DEFAULTS.varianceMethod
        const normalizedParams = {
          ...parameters,
          initialInvestment: parameters.initialInvestment ?? NORMALIZATION_DEFAULTS.initialInvestment,
          years: parameters.years ?? NORMALIZATION_DEFAULTS.years,
          returnRate: parameters.returnRate ?? NORMALIZATION_DEFAULTS.returnRate,
          additionalContribution: parameters.additionalContribution ?? NORMALIZATION_DEFAULTS.additionalContribution,
          varianceMethod,
          returnVolatility:
            parameters.returnVolatility ??
            (varianceMethod === 'monte-carlo' ? MONTE_CARLO_DEFAULT_VOLATILITY : NORMALIZATION_DEFAULTS.returnVolatility),
          monteCarloIterations: parameters.monteCarloIterations ?? NORMALIZATION_DEFAULTS.monteCarloIterations,
          manualContributionsEnabled: parameters.manualContributionsEnabled ?? NORMALIZATION_DEFAULTS.manualContributionsEnabled,
          variableContributionsEnabled: parameters.variableContributionsEnabled ?? NORMALIZATION_DEFAULTS.variableContributionsEnabled,
        }

        const sanitizedManualContributions = sanitizeManualContributions(
          normalizedParams,
          normalizedParams.years
        )
        if (sanitizedManualContributions) {
          normalizedParams.manualContributions = sanitizedManualContributions
        }

        // Validate inputs
        if (
          normalizedParams.initialInvestment < 0 ||
          normalizedParams.years <= 0 ||
          normalizedParams.returnRate === undefined
        ) {
          return sim
        }

        // Run basic calculation
        const results = calculateYearlyResults(normalizedParams)

        // Run Monte Carlo if volatility is specified
        let monteCarloResults
        if (
          normalizedParams.returnVolatility &&
          normalizedParams.returnVolatility > 0 &&
          normalizedParams.varianceMethod === 'monte-carlo'
        ) {
          monteCarloResults = runMonteCarloSimulation(normalizedParams, normalizedParams.monteCarloIterations)
        }

        // Update parameters with normalized values so user can see defaults that were used
        // Store the full parameters that were used for these results
        return {
          ...sim,
          parameters: normalizedParams,
          results,
          monteCarloResults,
          resultsInitialInvestment: normalizedParams.initialInvestment, // Keep for backwards compatibility
          resultsParameters: { ...normalizedParams }, // Store full parameters used for this simulation
        }
      })
    )
  }, [])

  return {
    simulations,
    addSimulation,
    updateSimulation,
    deleteSimulation,
    runSimulation,
    runAllSimulations,
  }
}

