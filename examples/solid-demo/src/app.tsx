import { AirpodsFullBattery } from '~/icons'
import './app.css'

export default function App() {
  return (
    <div style={{ 'display': 'flex', 'align-items': 'center', 'justify-content': 'center', 'height': '100vh' }}>
      {/* Test className merging */}
      <AirpodsFullBattery className="custom-class" />

      {/* Testing accessibility */}
      <AirpodsFullBattery title="Search" />
      <AirpodsFullBattery aria-label="Close" />
      <AirpodsFullBattery aria-hidden={true} />
    </div>
  )
}
