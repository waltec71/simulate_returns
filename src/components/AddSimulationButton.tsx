// Button to add new simulations

import { useState } from 'react'
import type { SimulationConfig } from '../lib/types'

interface AddSimulationButtonProps {
  onAddBlank: () => void
  onCopyFrom: (simulation: SimulationConfig) => void
  existingSimulations: SimulationConfig[]
  canAdd: boolean
  maxSimulations: number
}

export default function AddSimulationButton({
  onAddBlank,
  onCopyFrom,
  existingSimulations,
  canAdd,
  maxSimulations,
}: AddSimulationButtonProps) {
  const [showMenu, setShowMenu] = useState(false)

  if (!canAdd) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 text-center">
        <p className="text-sm font-medium text-yellow-800">
          Maximum of {maxSimulations} simulations reached
        </p>
        <p className="text-xs text-yellow-600 mt-1">
          Delete a simulation to add a new one
        </p>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="w-full px-6 py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
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
            d="M12 4v16m8-8H4"
          />
        </svg>
        Add Simulation
      </button>

      {showMenu && (
        <>
          {/* Backdrop to close menu */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />

          {/* Dropdown menu */}
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden">
            <button
              onClick={() => {
                onAddBlank()
                setShowMenu(false)
              }}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span className="font-medium text-gray-700">Create Blank</span>
            </button>

            {existingSimulations.length > 0 && (
              <>
                <div className="border-t border-gray-200" />
                <div className="max-h-48 overflow-y-auto">
                  <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                    Copy From Existing
                  </div>
                  {existingSimulations.map((sim) => (
                    <button
                      key={sim.id}
                      onClick={() => {
                        onCopyFrom(sim)
                        setShowMenu(false)
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors text-sm text-gray-700"
                    >
                      {sim.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
    </div>
  )
}
