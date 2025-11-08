// Nested popout for variance method configuration

import type { SimulationParameters, VarianceMethod } from '../lib/types'
import Popout from './Popout'
import MonteCarloConfig from './MonteCarloConfig'
import HistoricalConfig from './HistoricalConfig'

interface VarianceConfigPopoutProps {
  isOpen: boolean
  onClose: () => void
  varianceMethod: VarianceMethod
  parameters: SimulationParameters
  onChange: (updates: Partial<SimulationParameters>) => void
  anchorRef: React.RefObject<HTMLElement>
}

export default function VarianceConfigPopout({
  isOpen,
  onClose,
  varianceMethod,
  parameters,
  onChange,
  anchorRef,
}: VarianceConfigPopoutProps) {
  if (varianceMethod === 'none') {
    return null
  }

  return (
    <Popout
      isOpen={isOpen}
      onClose={onClose}
      anchorRef={anchorRef}
      position="right"
    >
      {varianceMethod === 'monte-carlo' && (
        <MonteCarloConfig parameters={parameters} onChange={onChange} />
      )}
      {varianceMethod === 'historical' && (
        <HistoricalConfig parameters={parameters} onChange={onChange} />
      )}
    </Popout>
  )
}

