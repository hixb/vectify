import { render } from 'preact'

import AirpodsFullBattery from './icons/AirpodsFullBattery'
import './style.css'

export function App() {
  return (
    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
      <AirpodsFullBattery />
      <AirpodsFullBattery size={48} />
      <AirpodsFullBattery size={48} color="red" />
      <AirpodsFullBattery strokeWidth={4} color="green" />
    </div>
  )
}

render(<App />, document.getElementById('app'))
