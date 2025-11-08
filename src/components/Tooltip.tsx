// Reusable tooltip component

import { useState } from 'react'

interface TooltipProps {
  content: string
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export default function Tooltip({
  content,
  children,
  position = 'top',
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false)

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        className="cursor-help"
        tabIndex={0}
        role="button"
        aria-label={content}
      >
        {children}
      </div>
      {isVisible && (
        <div
          className={`absolute z-50 ${positionClasses[position]} px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-normal max-w-xs pointer-events-none`}
          role="tooltip"
        >
          {content}
          {/* Arrow */}
          <div
            className={`absolute ${
              position === 'top'
                ? 'top-full left-1/2 -translate-x-1/2 -mt-1'
                : position === 'bottom'
                ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1'
                : position === 'left'
                ? 'left-full top-1/2 -translate-y-1/2 -ml-1'
                : 'right-full top-1/2 -translate-y-1/2 -mr-1'
            }`}
          >
            <div
              className={`w-0 h-0 ${
                position === 'top'
                  ? 'border-t-gray-900 border-t-4 border-x-transparent border-x-4'
                  : position === 'bottom'
                  ? 'border-b-gray-900 border-b-4 border-x-transparent border-x-4'
                  : position === 'left'
                  ? 'border-l-gray-900 border-l-4 border-y-transparent border-y-4'
                  : 'border-r-gray-900 border-r-4 border-y-transparent border-y-4'
              }`}
            />
          </div>
        </div>
      )}
    </div>
  )
}

