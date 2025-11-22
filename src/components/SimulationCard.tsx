// Individual simulation column component

import { useState, useImperativeHandle, forwardRef } from 'react'
import type { SimulationConfig } from '../lib/types'
import SimulationInputs from './SimulationInputs'
import SimulationGraph from './SimulationGraph'
import SimulationResults from './SimulationResults'
import VarianceConfigView from './VarianceConfigView'
import ManualContributionsView from './ManualContributionsView'

type ViewMode = 'main' | 'variance-config' | 'manual-contributions'

export interface SimulationCardRef {
  resetViewMode: () => void
}

interface SimulationCardProps {
  simulation: SimulationConfig
  onUpdate: (updates: Partial<SimulationConfig>) => void
  onDelete: () => void
  onRun: () => void
}

const SimulationCard = forwardRef<SimulationCardRef, SimulationCardProps>(
  ({ simulation, onUpdate, onDelete, onRun }, ref) => {
    const [isEditingName, setIsEditingName] = useState(false)
    const [tempName, setTempName] = useState(simulation.name)
    const [viewMode, setViewMode] = useState<ViewMode>('main')

    // Expose method to reset view mode to parent
    useImperativeHandle(ref, () => ({
      resetViewMode: () => {
        setViewMode('main')
      },
    }))

  const handleNameChange = (newName: string) => {
    setTempName(newName)
  }

  const handleNameBlur = () => {
    setIsEditingName(false)
    if (tempName.trim() && tempName !== simulation.name) {
      onUpdate({ name: tempName.trim() })
    } else {
      setTempName(simulation.name)
    }
  }

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleNameBlur()
    } else if (e.key === 'Escape') {
      setTempName(simulation.name)
      setIsEditingName(false)
    }
  }

  const handleParametersChange = (
    updates: Partial<SimulationConfig['parameters']>
  ) => {
    onUpdate({
      parameters: { ...simulation.parameters, ...updates },
    })
  }

  // Render different views based on viewMode
  if (viewMode === 'variance-config') {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col w-[400px]">
        <VarianceConfigView
          varianceMethod={simulation.parameters.varianceMethod || 'none'}
          parameters={simulation.parameters}
          onChange={handleParametersChange}
          onBack={() => setViewMode('main')}
        />
      </div>
    )
  }

  if (viewMode === 'manual-contributions') {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col w-[400px]">
        <ManualContributionsView
          parameters={simulation.parameters}
          onChange={handleParametersChange}
          onBack={() => setViewMode('main')}
        />
      </div>
    )
  }

  // Main view
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col w-[400px]">
      {/* Header with name and delete button */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200 min-w-0">
        {isEditingName ? (
          <input
            type="text"
            value={tempName}
            onChange={(e) => handleNameChange(e.target.value)}
            onBlur={handleNameBlur}
            onKeyDown={handleNameKeyDown}
            className="flex-1 px-2 py-1 text-lg font-semibold text-gray-800 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-0"
            autoFocus
          />
        ) : (
          <h2
            className="flex-1 text-lg font-semibold text-gray-800 cursor-text hover:text-blue-600 transition-colors truncate min-w-0"
            onClick={() => setIsEditingName(true)}
            title={simulation.name}
          >
            {simulation.name}
          </h2>
        )}
        <button
          onClick={onDelete}
          className="ml-2 p-1 text-gray-400 hover:text-red-600 transition-colors"
          title="Delete simulation"
          aria-label="Delete simulation"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      {/* Simulation Parameters */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-600 mb-3">
          Parameters
        </h3>
        <SimulationInputs
          parameters={simulation.parameters}
          onChange={handleParametersChange}
          onOpenVarianceConfig={() => setViewMode('variance-config')}
          onOpenManualContributions={() => setViewMode('manual-contributions')}
          idPrefix={simulation.id}
        />
      </div>

      {/* Run Simulation Button */}
      <button
        onClick={onRun}
        className="mb-4 w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        Run Simulation
      </button>

      {/* Results Section */}
      {simulation.results && simulation.results.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Results</h3>
          <SimulationGraph
            results={simulation.results}
            initialInvestment={simulation.resultsInitialInvestment}
            monteCarloResults={simulation.monteCarloResults}
          />
          <SimulationResults
            results={simulation.results}
            monteCarloResults={simulation.monteCarloResults}
            parameters={simulation.resultsParameters}
          />
        </div>
      )}
    </div>
  )
  }
)

SimulationCard.displayName = 'SimulationCard'

export default SimulationCard
