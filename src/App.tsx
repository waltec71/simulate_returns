import { useEffect, useRef } from 'react'
import { useSimulation } from './hooks/useSimulation'
import SimulationCard, { type SimulationCardRef } from './components/SimulationCard'
import AddSimulationButton from './components/AddSimulationButton'

const MAX_SIMULATIONS = 10

function App() {
  const {
    simulations,
    addSimulation,
    updateSimulation,
    deleteSimulation,
    runSimulation,
    runAllSimulations,
  } = useSimulation()
  const hasInitialized = useRef(false)
  const simulationCardRefs = useRef<Map<string, SimulationCardRef>>(new Map())

  // Initialize with one simulation if none exist
  useEffect(() => {
    if (!hasInitialized.current && simulations.length === 0) {
      hasInitialized.current = true
      addSimulation()
    }
  }, [simulations.length, addSimulation])

  const handleAddBlank = () => {
    if (simulations.length < MAX_SIMULATIONS) {
      addSimulation()
    }
  }

  const handleCopyFrom = (simulation: typeof simulations[0]) => {
    if (simulations.length < MAX_SIMULATIONS) {
      addSimulation(simulation)
    }
  }

  const canAddSimulation = simulations.length < MAX_SIMULATIONS

  const handleRunAllSimulations = () => {
    // Close all configuration menus before running simulations
    simulationCardRefs.current.forEach((ref) => {
      ref.resetViewMode()
    })
    // Run all simulations
    runAllSimulations()
  }

  const setCardRef = (id: string, ref: SimulationCardRef | null) => {
    if (ref) {
      simulationCardRefs.current.set(id, ref)
    } else {
      simulationCardRefs.current.delete(id)
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Return Simulator
          </h1>
          <p className="text-gray-600 mb-4">
            Investment portfolio return simulation tool
          </p>

          {/* Run All Simulations Button */}
          {simulations.length > 0 && (
            <button
              onClick={handleRunAllSimulations}
              className="mb-4 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              Run All Simulations
            </button>
          )}
        </div>

        {/* Simulations Grid */}
        <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-4 md:overflow-x-visible">
          {/* Simulation Cards */}
          {simulations.map((simulation) => (
            <div key={simulation.id} className="flex-shrink-0">
              <SimulationCard
                ref={(ref) => setCardRef(simulation.id, ref)}
                simulation={simulation}
                onUpdate={(updates) => updateSimulation(simulation.id, updates)}
                onDelete={() => deleteSimulation(simulation.id)}
                onRun={() => runSimulation(simulation.id)}
              />
            </div>
          ))}

          {/* Add Simulation Button */}
          {canAddSimulation && (
            <div className="flex-shrink-0">
              <AddSimulationButton
                onAddBlank={handleAddBlank}
                onCopyFrom={handleCopyFrom}
                existingSimulations={simulations}
                canAdd={canAddSimulation}
                maxSimulations={MAX_SIMULATIONS}
              />
            </div>
          )}
        </div>

        {/* Max Simulations Message */}
        {!canAddSimulation && simulations.length > 0 && (
          <div className="mt-6 flex justify-center">
            <AddSimulationButton
              onAddBlank={handleAddBlank}
              onCopyFrom={handleCopyFrom}
              existingSimulations={simulations}
              canAdd={canAddSimulation}
              maxSimulations={MAX_SIMULATIONS}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
