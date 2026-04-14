import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../../components/AppShell'
import Step1FacilityType, { type Step1Data } from './Step1FacilityType'
import Step2AddInverter, { type Inverter } from './Step2AddInverter'
import Step3AddSolarPanels, { type SolarPanel } from './Step3AddSolarPanels'
import Step4AddBatteries, { type Battery } from './Step4AddBatteries'
import Step5AddAccessories, { type Accessory } from './Step5AddAccessories'
import Step6ReviewSubmit from './Step6ReviewSubmit'

export default function AddInstallation() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  const [step1Data, setStep1Data] = useState<Step1Data>({ facility: '', systemTypes: [] })
  const [inverters, setInverters] = useState<Inverter[]>([])
  const [panels, setPanels] = useState<SolarPanel[]>([])
  const [batteries, setBatteries] = useState<Battery[]>([])
  const [accessories, setAccessories] = useState<Accessory[]>([])

  return (
    <AppShell breadcrumbs={['Home', 'Equipment Management', 'Solar Equipment']}>
      {/* Page header */}
      <div style={{ marginBottom: 16 }}>
        <button
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'none', border: 'none', cursor: 'pointer',
            font: 'var(--font-heading-md)',
            color: 'var(--color-text)',
            marginBottom: 4,
            padding: 0,
          }}
          onClick={() => navigate('/')}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Add Solar Equipment
        </button>
        <p style={{ font: 'var(--font-body-md)', color: 'var(--color-text-secondary)', marginLeft: 20 }}>
          Enter equipment details to register and track solar performance on the Nexleaf platform.
        </p>
      </div>

      {step === 1 && (
        <Step1FacilityType
          onNext={(data) => { setStep1Data(data); setStep(2) }}
          onBack={() => navigate('/')}
        />
      )}
      {step === 2 && (
        <Step2AddInverter
          onNext={(data) => { setInverters(data); setStep(3) }}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <Step3AddSolarPanels
          onNext={(data) => { setPanels(data); setStep(4) }}
          onBack={() => setStep(2)}
        />
      )}
      {step === 4 && (
        <Step4AddBatteries
          onNext={(data) => { setBatteries(data); setStep(5) }}
          onBack={() => setStep(3)}
        />
      )}
      {step === 5 && (
        <Step5AddAccessories
          onNext={(data) => { setAccessories(data); setStep(6) }}
          onBack={() => setStep(4)}
        />
      )}
      {step === 6 && (
        <Step6ReviewSubmit
          step1Data={step1Data}
          inverters={inverters}
          panels={panels}
          batteries={batteries}
          accessories={accessories}
          onBack={() => setStep(5)}
        />
      )}
    </AppShell>
  )
}
