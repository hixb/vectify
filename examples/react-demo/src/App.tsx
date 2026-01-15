import type { ReactNode } from 'react'
import { useRef } from 'react'
import { AirpodsFullBattery, Anonymous } from './icons'
import './App.css'

export default function App(): ReactNode {
  const iconRef = useRef<SVGSVGElement>(null)

  return (
    <div>
      {/* Test forwardRef */}
      <AirpodsFullBattery
        ref={iconRef}
        size={32}
        color="red"
        className="my-icon"
        title="Airpods Full Battery"
        aria-label="Airpods Full Battery"
      />

      {/* Test className merging */}
      <AirpodsFullBattery className="custom-class" />

      {/* Testing accessibility */}
      <AirpodsFullBattery title="Search" />
      <AirpodsFullBattery aria-label="Close" />
      <AirpodsFullBattery aria-hidden={true} />

      {/* Test forwardRef */}
      <Anonymous
        ref={iconRef}
        size={32}
        color="red"
        className="my-icon"
        title="Airpods Full Battery"
        aria-label="Airpods Full Battery"
      />

      {/* Test className merging */}
      <Anonymous className="custom-class" />

      {/* Testing accessibility */}
      <Anonymous title="Search" />
      <Anonymous aria-label="Close" />
      <Anonymous aria-hidden={true} />
    </div>
  )
}
