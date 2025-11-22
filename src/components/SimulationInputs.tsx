// Input fields for simulation parameters

import type { SimulationParameters, VarianceMethod } from '../lib/types'
import AdvancedSection from './AdvancedSection'
import VarianceMethodSelector from './VarianceMethodSelector'
import { NORMALIZATION_DEFAULTS, MONTE_CARLO_DEFAULT_VOLATILITY } from '../lib/defaults'

interface SimulationInputsProps {
  parameters: SimulationParameters
  onChange: (parameters: Partial<SimulationParameters>) => void
  onOpenVarianceConfig?: () => void
  onOpenVariableContributions?: () => void
  idPrefix?: string
}

export default function SimulationInputs({
  parameters,
  onChange,
  onOpenVarianceConfig,
  onOpenVariableContributions,
  idPrefix,
}: SimulationInputsProps) {
  // Helper to handle number input changes - allows empty strings
  const handleNumberChange = (field: keyof SimulationParameters, value: string) => {
    if (value === '' || value === null || value === undefined) {
      // Store undefined to allow empty field
      onChange({ [field]: undefined as any })
    } else {
      const numValue = parseFloat(value)
      if (!isNaN(numValue)) {
        onChange({ [field]: numValue })
      }
    }
  }

  // Helper to handle integer input changes - allows empty strings
  const handleIntegerChange = (field: keyof SimulationParameters, value: string) => {
    if (value === '' || value === null || value === undefined) {
      // Store undefined to allow empty field
      onChange({ [field]: undefined as any })
    } else {
      const intValue = parseInt(value, 10)
      if (!isNaN(intValue)) {
        onChange({ [field]: intValue })
      }
    }
  }

  // Helper to select all text when input is focused
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select()
  }

  const varianceMethod: VarianceMethod = parameters.varianceMethod ?? NORMALIZATION_DEFAULTS.varianceMethod
  const manualContributionsEnabled = parameters.manualContributionsEnabled || false
  const varianceSelectorName = idPrefix ? `${idPrefix}-varianceMethod` : 'varianceMethod'
  const varianceSelectorIdPrefix = idPrefix ? `${idPrefix}-variance` : 'variance'
  
  // Check if variable contributions are enabled (any of the variable contribution settings are set)
  const variableContributionsEnabled = 
    manualContributionsEnabled ||
    (parameters.contributionIncreaseRate !== undefined && parameters.contributionIncreaseRate !== 0) ||
    (parameters.stopContributingAfterYears !== undefined)

  const handleVarianceMethodChange = (method: VarianceMethod) => {
    if (
      method === 'monte-carlo' &&
      (parameters.returnVolatility === undefined || parameters.returnVolatility === null)
    ) {
      onChange({
        varianceMethod: method,
        returnVolatility: MONTE_CARLO_DEFAULT_VOLATILITY,
      })
    } else {
      onChange({ varianceMethod: method })
    }
  }

  return (
    <div className="space-y-4 relative">
      {/* Basic Variables */}
      <div>
        <label
          htmlFor="initialInvestment"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Initial Investment ($)
        </label>
        <input
          id="initialInvestment"
          type="number"
          min="0"
          step="100"
          value={parameters.initialInvestment !== undefined ? parameters.initialInvestment : ''}
          onChange={(e) => handleNumberChange('initialInvestment', e.target.value)}
          onFocus={handleFocus}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="years"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Time (Years)
        </label>
        <input
          id="years"
          type="number"
          min="1"
          max="100"
          step="1"
          value={parameters.years !== undefined ? parameters.years : ''}
          onChange={(e) => handleIntegerChange('years', e.target.value)}
          onFocus={handleFocus}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="returnRate"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Return (%)
        </label>
        <input
          id="returnRate"
          type="number"
          min="-100"
          max="1000"
          step="0.1"
          value={parameters.returnRate !== undefined ? parameters.returnRate : ''}
          onChange={(e) => handleNumberChange('returnRate', e.target.value)}
          onFocus={handleFocus}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label
          htmlFor="additionalContribution"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Additional Contribution per Year ($)
        </label>
        <input
          id="additionalContribution"
          type="number"
          min="0"
          step="100"
          value={parameters.additionalContribution !== undefined ? parameters.additionalContribution : ''}
          onChange={(e) => handleNumberChange('additionalContribution', e.target.value)}
          onFocus={handleFocus}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={manualContributionsEnabled}
        />
        {manualContributionsEnabled && (
          <p className="mt-1 text-xs text-gray-500">
            Disabled when manual per-year contributions are configured
          </p>
        )}
      </div>

      {/* Advanced Variables Section */}
      <AdvancedSection>
        {/* Variance Simulation Method */}
        <div className="relative">
          <VarianceMethodSelector
            value={varianceMethod}
            onChange={handleVarianceMethodChange}
            onConfigureClick={() => onOpenVarianceConfig?.()}
            showConfigureButton={varianceMethod !== 'none'}
            name={varianceSelectorName}
            idPrefix={varianceSelectorIdPrefix}
          />
        </div>

        {/* Variable Contributions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Variable Contributions
          </label>
          <button
            onClick={() => onOpenVariableContributions?.()}
            className="w-full px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
            aria-label="Configure variable contributions"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            Configure Variable Contributions
          </button>
          {variableContributionsEnabled && (
            <p className="mt-1 text-xs text-gray-500">
              Variable contribution settings are active
            </p>
          )}
        </div>
      </AdvancedSection>
    </div>
  )
}

