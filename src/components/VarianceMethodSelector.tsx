// Variance simulation method selector

import type { VarianceMethod } from '../lib/types'

interface VarianceMethodSelectorProps {
  value: VarianceMethod
  onChange: (method: VarianceMethod) => void
  onConfigureClick: () => void
  showConfigureButton: boolean
}

export default function VarianceMethodSelector({
  value,
  onChange,
  onConfigureClick,
  showConfigureButton,
}: VarianceMethodSelectorProps) {
    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Variance Simulation Method
        </label>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              id="variance-none"
              type="radio"
              name="varianceMethod"
              value="none"
              checked={value === 'none'}
              onChange={(e) => onChange(e.target.value as VarianceMethod)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label
              htmlFor="variance-none"
              className="ml-2 block text-sm text-gray-700 cursor-pointer"
            >
              None
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="variance-monte-carlo"
              type="radio"
              name="varianceMethod"
              value="monte-carlo"
              checked={value === 'monte-carlo'}
              onChange={(e) => onChange(e.target.value as VarianceMethod)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label
              htmlFor="variance-monte-carlo"
              className="ml-2 block text-sm text-gray-700 cursor-pointer"
            >
              Monte Carlo
            </label>
          </div>
          <div className="flex items-center">
            <input
              id="variance-historical"
              type="radio"
              name="varianceMethod"
              value="historical"
              checked={value === 'historical'}
              onChange={(e) => onChange(e.target.value as VarianceMethod)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label
              htmlFor="variance-historical"
              className="ml-2 block text-sm text-gray-700 cursor-pointer"
            >
              Historical
            </label>
          </div>
        </div>

        {showConfigureButton && value !== 'none' && (
          <button
            onClick={onConfigureClick}
            className="mt-2 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-1"
            aria-label={`Configure ${value} variance method`}
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
            Configure
          </button>
        )}
      </div>
    )
}

