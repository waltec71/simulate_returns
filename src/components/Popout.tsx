// Reusable popout component wrapper

import { useEffect, useRef, useState } from 'react'

interface PopoutProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  anchorRef?: React.RefObject<HTMLElement>
  position?: 'left' | 'right' | 'top' | 'bottom'
  className?: string
}

export default function Popout({
  isOpen,
  onClose,
  children,
  anchorRef,
  position = 'right',
  className = '',
}: PopoutProps) {
  const popoutRef = useRef<HTMLDivElement>(null)
  const [popoutStyle, setPopoutStyle] = useState<React.CSSProperties>({})

  // Calculate position based on anchor element
  useEffect(() => {
    if (!isOpen || !anchorRef?.current) return

    const updatePosition = () => {
      if (!popoutRef.current || !anchorRef?.current) return

      const anchorRect = anchorRef.current.getBoundingClientRect()
      const popoutRect = popoutRef.current.getBoundingClientRect()
      const scrollY = window.scrollY
      const scrollX = window.scrollX

      let top = 0
      let left = 0

      switch (position) {
        case 'right':
          top = anchorRect.top + scrollY
          left = anchorRect.right + scrollX + 8
          break
        case 'left':
          top = anchorRect.top + scrollY
          left = anchorRect.left + scrollX - popoutRect.width - 8
          break
        case 'bottom':
          top = anchorRect.bottom + scrollY + 8
          left = anchorRect.left + scrollX
          break
        case 'top':
          top = anchorRect.top + scrollY - popoutRect.height - 8
          left = anchorRect.left + scrollX
          break
      }

      // Ensure popout stays within viewport
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      if (left + popoutRect.width > viewportWidth + scrollX) {
        left = viewportWidth + scrollX - popoutRect.width - 8
      }
      if (left < scrollX) {
        left = scrollX + 8
      }
      if (top + popoutRect.height > viewportHeight + scrollY) {
        top = viewportHeight + scrollY - popoutRect.height - 8
      }
      if (top < scrollY) {
        top = scrollY + 8
      }

      setPopoutStyle({ top: `${top}px`, left: `${left}px` })
    }

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      updatePosition()
      // Also update on resize/scroll
      window.addEventListener('resize', updatePosition)
      window.addEventListener('scroll', updatePosition, true)
    })

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isOpen, anchorRef, position])

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoutRef.current &&
        !popoutRef.current.contains(event.target as Node) &&
        anchorRef?.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    // Close on escape key
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    // Small delay to avoid immediate close on open
    const timeout = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }, 10)

    return () => {
      clearTimeout(timeout)
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose, anchorRef])

  if (!isOpen) return null

  return (
    <div
      ref={popoutRef}
      className={`fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-[280px] max-w-[400px] ${className}`}
      style={popoutStyle}
      role="dialog"
      aria-modal="true"
    >
      {children}
    </div>
  )
}

