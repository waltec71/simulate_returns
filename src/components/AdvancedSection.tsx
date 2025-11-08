// Collapsible advanced variables section

import { useState } from 'react'

interface AdvancedSectionProps {
  children: React.ReactNode
  defaultExpanded?: boolean
}

export default function AdvancedSection({
  children,
  defaultExpanded = false,
}: AdvancedSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1 -mx-2 -my-1"
        aria-expanded={isExpanded}
        aria-controls="advanced-section-content"
      >
        <span className="text-sm font-medium text-gray-700">
          Advanced
        </span>
        <svg
          className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
            isExpanded ? 'transform rotate-90' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {isExpanded && (
        <div
          id="advanced-section-content"
          className="mt-4 space-y-4"
          role="region"
          aria-labelledby="advanced-section-header"
        >
          {children}
        </div>
      )}
    </div>
  )
}

