// Custom hook for simulation state and logic

import { useState, useCallback } from 'react'
import type { SimulationConfig } from '../lib/types'
import { calculateYearlyResults } from '../lib/calculations'
import { runMonteCarloSimulation } from '../lib/monteCarlo'

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
              initialInvestment: 10000,
              years: 30,
              returnRate: 7,
              additionalContribution: 0,
              varianceMethod: 'none',
              monteCarloIterations: 1000,
              manualContributionsEnabled: false,
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
        const normalizedParams = {
          ...parameters,
          initialInvestment: parameters.initialInvestment ?? 0,
          years: parameters.years ?? 1,
          returnRate: parameters.returnRate ?? 0,
          additionalContribution: parameters.additionalContribution ?? 0,
        }

        // Validate inputs
        if (
          normalizedParams.initialInvestment <= 0 ||
          normalizedParams.years <= 0 ||
          normalizedParams.returnRate === undefined
        ) {
          return sim
        }

        // Run basic calculation
        const results = calculateYearlyResults(normalizedParams)

        // Run Monte Carlo if variance is specified
        let monteCarloResults
        if (
          normalizedParams.returnVariance &&
          normalizedParams.returnVariance > 0 &&
          normalizedParams.varianceMethod === 'monte-carlo'
        ) {
          const iterations = normalizedParams.monteCarloIterations || 1000
          monteCarloResults = runMonteCarloSimulation(normalizedParams, iterations)
        }

        // Update parameters with normalized values so user can see defaults that were used
        // Store the initial investment that was used for these results
        return {
          ...sim,
          parameters: normalizedParams,
          results,
          monteCarloResults,
          resultsInitialInvestment: normalizedParams.initialInvestment,
        }
      })
    )
  }, [])

  const runAllSimulations = useCallback(() => {
    setSimulations((prev) =>
      prev.map((sim) => {
        const { parameters } = sim

        // Normalize parameters - fill in defaults for empty fields
        const normalizedParams = {
          ...parameters,
          initialInvestment: parameters.initialInvestment ?? 0,
          years: parameters.years ?? 1,
          returnRate: parameters.returnRate ?? 0,
          additionalContribution: parameters.additionalContribution ?? 0,
        }

        // Validate inputs
        if (
          normalizedParams.initialInvestment <= 0 ||
          normalizedParams.years <= 0 ||
          normalizedParams.returnRate === undefined
        ) {
          return sim
        }

        // Run basic calculation
        const results = calculateYearlyResults(normalizedParams)

        // Run Monte Carlo if variance is specified
        let monteCarloResults
        if (
          normalizedParams.returnVariance &&
          normalizedParams.returnVariance > 0 &&
          normalizedParams.varianceMethod === 'monte-carlo'
        ) {
          const iterations = normalizedParams.monteCarloIterations || 1000
          monteCarloResults = runMonteCarloSimulation(normalizedParams, iterations)
        }

        // Update parameters with normalized values so user can see defaults that were used
        // Store the initial investment that was used for these results
        return {
          ...sim,
          parameters: normalizedParams,
          results,
          monteCarloResults,
          resultsInitialInvestment: normalizedParams.initialInvestment,
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

