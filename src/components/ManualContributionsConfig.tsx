// Manual per-year contributions configuration popout

import { useState, useEffect } from 'react'
import type { SimulationParameters } from '../lib/types'
import Popout from './Popout'

interface ManualContributionsConfigProps {
  isOpen: boolean
  onClose: () => void
  parameters: SimulationParameters
  onChange: (updates: Partial<SimulationParameters>) => void
  anchorRef: React.RefObject<HTMLElement>
}

export default function ManualContributionsConfig({
  isOpen,
  onClose,
  parameters,
  onChange,
  anchorRef,
}: ManualContributionsConfigProps) {
  const years = parameters.years || 1
  const [contributions, setContributions] = useState<number[]>(() => {
    if (parameters.manualContributions && parameters.manualContributions.length === years) {
      return [...parameters.manualContributions]
    }
    return Array(years).fill(parameters.additionalContribution || 0)
  })

  // Update contributions when years change
  useEffect(() => {
    if (parameters.manualContributions && parameters.manualContributions.length === years) {
      setContributions([...parameters.manualContributions])
    } else {
      const newContributions = Array(years).fill(parameters.additionalContribution || 0)
      setContributions(newContributions)
    }
  }, [years, parameters.additionalContribution, parameters.manualContributions])

  const handleContributionChange = (yearIndex: number, value: string) => {
    const numValue = parseFloat(value) || 0
    const newContributions = [...contributions]
    newContributions[yearIndex] = Math.max(0, numValue)
    setContributions(newContributions)
    onChange({ manualContributions: newContributions })
  }

  const handleBulkSet = () => {
    const value = prompt('Enter contribution amount for all years:')
    if (value !== null) {
      const numValue = parseFloat(value) || 0
      const newContributions = Array(years).fill(Math.max(0, numValue))
      setContributions(newContributions)
      onChange({ manualContributions: newContributions })
    }
  }

  // Helper to select all text when input is focused
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  return (
    <Popout
      isOpen={isOpen}
      onClose={onClose}
      anchorRef={anchorRef}
      position="right"
      className="max-h-[600px] overflow-y-auto"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800">
            Manual Contributions per Year
          </h3>
          <button
            onClick={handleBulkSet}
            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Set All
          </button>
        </div>

        <div className="space-y-2 max-h-[500px] overflow-y-auto">
          {contributions.map((contribution, index) => (
            <div key={index} className="flex items-center gap-2">
              <label className="text-xs text-gray-600 w-16 flex-shrink-0">
                Year {index + 1}:
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={contribution}
                onChange={(e) => handleContributionChange(index, e.target.value)}
                onFocus={handleFocus}
                className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ))}
        </div>
      </div>
    </Popout>
  )
}

