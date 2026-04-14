import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Text, BlockStack } from '@shopify/polaris'
import AppShell from '../../components/AppShell'
import Step1FacilityType, { type Step1Data } from '../AddInstallation/Step1FacilityType'
import Step2Inverters from './Step2Inverters'
import Step3SolarPanels from './Step3SolarPanels'
import Step4Batteries from './Step4Batteries'
import Step5Accessories from './Step5Accessories'
import Step6ReviewSubmit from '../AddInstallation/Step6ReviewSubmit'
import { type Inverter } from '../AddInstallation/Step2AddInverter'
import { type SolarPanel } from '../AddInstallation/Step3AddSolarPanels'
import { type Battery } from '../AddInstallation/Step4AddBatteries'
import { type Accessory } from '../AddInstallation/Step5AddAccessories'

export default function PrototypeAWizard() {
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [step1Data, setStep1Data] = useState<Step1Data>({ facility: '', systemTypes: [] })
  const [inverters, setInverters] = useState<Inverter[]>([])
  const [panels, setPanels] = useState<SolarPanel[]>([])
  const [batteries, setBatteries] = useState<Battery[]>([])
  const [accessories, setAccessories] = useState<Accessory[]>([])

  return (
    <AppShell>
      {/* Page header */}
      <div style={{ marginBottom: 24 }}>
        <BlockStack gap="100">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={() => navigate('/')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: 0, display: 'flex', alignItems: 'center',
                color: '#374151', font: 'inherit',
              }}
            >
              ←
            </button>
            <Text as="h1" variant="headingLg" fontWeight="semibold">Add Solar Equipment</Text>
          </div>
          <Text as="p" tone="subdued" variant="bodyMd">
            Enter equipment details to register and track solar performance on the Nexleaf platform.
          </Text>
        </BlockStack>
      </div>

      {/* Step rendering */}
      {step === 1 && (
        <Step1FacilityType
          onNext={data => { setStep1Data(data); setStep(2) }}
          onBack={() => navigate('/')}
        />
      )}

      {step === 2 && (
        <Step2Inverters
          onNext={data => { setInverters(data); setStep(3) }}
          onBack={() => setStep(1)}
        />
      )}

      {step === 3 && (
        <Step3SolarPanels
          onNext={data => { setPanels(data); setStep(4) }}
          onBack={() => setStep(2)}
        />
      )}

      {step === 4 && (
        <Step4Batteries
          onNext={data => { setBatteries(data); setStep(5) }}
          onBack={() => setStep(3)}
        />
      )}

      {step === 5 && (
        <Step5Accessories
          onNext={data => { setAccessories(data); setStep(6) }}
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
          dashboardPath="/prototype-a/dashboard"
        />
      )}
    </AppShell>
  )
}
