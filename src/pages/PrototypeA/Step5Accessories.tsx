import { useState } from 'react'
import {
  Button,
  Text,
  TextField,
  Select,
  BlockStack,
} from '@shopify/polaris'
import StepIndicator from '../../components/StepIndicator'
import DateField from '../../components/DateField'
import { type AccessoryFormData } from '../AddInstallation/AddAccessoryModal'
import { type Accessory } from '../AddInstallation/Step5AddAccessories'

const STEPS = [
  { label: 'Facility & Installation Type' },
  { label: 'Add Inverter' },
  { label: 'Add Solar Panels' },
  { label: 'Add Batteries' },
  { label: 'Add Accessories' },
  { label: 'Review & Submit' },
]

const ACCESSORY_TYPE_OPTIONS = [
  { label: 'Choose accessory type here', value: '' },
  { label: 'Controller', value: 'Controller' },
  { label: 'Charge Controller', value: 'Charge Controller' },
  { label: 'Circuit Breaker', value: 'Circuit Breaker' },
  { label: 'Surge Protector', value: 'Surge Protector' },
  { label: 'Monitoring System', value: 'Monitoring System' },
  { label: 'Cable/Wiring', value: 'Cable/Wiring' },
]

const EQUIPMENT_STATUS_OPTIONS = [
  { label: 'Select status here', value: '' },
  { label: 'Functional', value: 'Functional' },
  { label: 'Faulty', value: 'Faulty' },
  { label: 'Under Maintenance', value: 'Under Maintenance' },
  { label: 'Decommissioned', value: 'Decommissioned' },
]

const CONTROLLER_TYPE_OPTIONS = [
  { label: 'Select', value: '' },
  { label: 'PWM', value: 'PWM' },
  { label: 'MPPT', value: 'MPPT' },
  { label: 'On/Off', value: 'On/Off' },
]

const MAINTENANCE_FREQ_OPTIONS = [
  { label: 'Select maintenance frequency here', value: '' },
  { label: 'Monthly', value: 'Monthly' },
  { label: 'Quarterly', value: 'Quarterly' },
  { label: 'Semi-annually', value: 'Semi-annually' },
  { label: 'Annually', value: 'Annually' },
]

const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }
const grid3: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }
const grid4: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }

function ChevronDown() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 6l4 4 4-4" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
}

function ChevronRight() {
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 4l4 4-4 4" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
}

function UploadIcon() {
  return <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden><path d="M7 1v8M4 4l3-3 3 3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/><path d="M2 10v2a1 1 0 001 1h8a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/></svg>
}

interface AccessoryEntry extends AccessoryFormData {
  id: string
  expanded: boolean
}

function emptyEntry(id: string): AccessoryEntry {
  return {
    id,
    expanded: true,
    systemType: '',
    linkedInverter: '',
    make: '',
    model: '',
    serialNumber: '',
    quantity: '1',
    equipmentStatus: '',
    accessoryType: '',
    controllerType: '',
    nextMaintenance: '',
    warrantyStart: '',
    warrantyEnd: '',
    maintenanceFrequency: '',
    lastMaintenance: '',
    installationDate: '',
    generalNotes: '',
  }
}

interface Props {
  systemTypes: string[]
  inverterNames: string[]
  onNext: (accessories: Accessory[]) => void
  onBack: () => void
  onStepClick?: (step: number) => void
}

function req(label: string) {
  return <>{label} <span style={{ color: '#d72c0d' }}>*</span></>
}

export default function Step5Accessories({ systemTypes, inverterNames, onNext, onBack, onStepClick }: Props) {
  const systemTypeOptions = [
    { label: 'Choose', value: '' },
    ...systemTypes.map(t => ({ label: t, value: t })),
  ]
  const inverterOptions = [
    { label: 'Select', value: '' },
    ...inverterNames.map(n => ({ label: n, value: n })),
  ]
  const [entries, setEntries] = useState<AccessoryEntry[]>([emptyEntry(String(Date.now()))])

  const canProceed = entries.length > 0 && entries.every(e =>
    e.systemType && e.linkedInverter && e.make && e.equipmentStatus && e.accessoryType
  )

  const update = (id: string, key: keyof AccessoryFormData, value: string | boolean) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, [key]: value } : e))
  }

  const toggle = (id: string) => {
    setEntries(prev => prev.map(e => ({ ...e, expanded: e.id === id ? !e.expanded : false })))
  }

  const remove = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  const addAnother = () => {
    setEntries(prev => [
      ...prev.map(e => ({ ...e, expanded: false })),
      emptyEntry(String(Date.now())),
    ])
  }

  const handleNext = () => {
    const accessories: Accessory[] = entries.map((entry, i) => ({
      ...entry,
      name: `Accessory ${i + 1}`,
    }))
    onNext(accessories)
  }

  return (
    <div style={{ background: 'white', borderRadius: 8, overflow: 'visible' }}>
      <StepIndicator steps={STEPS} currentStep={5} completedSteps={[1, 2, 3, 4]} onStepClick={onStepClick} />

      <div style={{ padding: 24 }}>
        {entries.map((entry, idx) => (
          <div
            key={entry.id}
            style={{ border: '1px solid #e1e3e5', borderRadius: 8, marginBottom: 8, overflow: 'hidden' }}
          >
            {/* Accordion Header */}
            <div
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px 20px', cursor: 'pointer',
                background: entry.expanded ? '#fafafa' : 'white',
              }}
              onClick={() => toggle(entry.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {entry.expanded ? <ChevronDown /> : <ChevronRight />}
                <Text variant="headingSm" as="span">Accessory {idx + 1}</Text>
              </div>
              {idx > 0 && (
                <button
                  onClick={e => { e.stopPropagation(); remove(entry.id) }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d82c0d', font: 'inherit', padding: '2px 8px' }}
                >
                  Remove
                </button>
              )}
            </div>

            {/* Accordion Body */}
            {entry.expanded && (
              <div style={{ padding: '20px', borderTop: '1px solid #e1e3e5' }}>
                <BlockStack gap="400">
                  {/* System Type + Linked Inverter + Accessory Type */}
                  <div style={grid3}>
                    <Select
                      label={req('Selected System Type')}
                      options={systemTypeOptions}
                      value={entry.systemType}
                      onChange={v => update(entry.id, 'systemType', v)}
                    />
                    <Select
                      label={req('Choose Linked Inverter')}
                      options={inverterOptions}
                      value={entry.linkedInverter}
                      onChange={v => update(entry.id, 'linkedInverter', v)}
                    />
                    <Select
                      label={req('Choose Accessory Type')}
                      options={ACCESSORY_TYPE_OPTIONS}
                      value={entry.accessoryType}
                      onChange={v => update(entry.id, 'accessoryType', v)}
                    />
                  </div>

                  {/* Basic Information */}
                  <div style={{ marginTop: 20 }}>
                    <div style={{ marginBottom: 12 }}>
                      <Text variant="headingSm" as="h4">Basic Information</Text>
                    </div>
                    <div style={grid4}>
                      <TextField label={req('Make/Manufacturer')}
                        value={entry.make} onChange={v => update(entry.id, 'make', v)}
                        placeholder="Enter manufacturer here" autoComplete="off" />
                      <TextField label="Model"
                        value={entry.model} onChange={v => update(entry.id, 'model', v)}
                        placeholder="Enter model here" autoComplete="off" />
                      <TextField label="Serial Number"
                        value={entry.serialNumber} onChange={v => update(entry.id, 'serialNumber', v)}
                        placeholder="Enter serial number here" autoComplete="off" />
                      <TextField label="Quantity" type="number"
                        value={entry.quantity} onChange={v => update(entry.id, 'quantity', v)}
                        autoComplete="off" />
                    </div>
                    <div style={{ ...grid4, marginTop: 12 }}>
                      <Select
                        label={req('Equipment Status')}
                        options={EQUIPMENT_STATUS_OPTIONS}
                        value={entry.equipmentStatus}
                        onChange={v => update(entry.id, 'equipmentStatus', v)}
                      />
                    </div>
                  </div>

                  {/* Specifications */}
                  <div style={{ marginTop: 20 }}>
                    <div style={{ marginBottom: 12 }}>
                      <Text variant="headingSm" as="h4">Specifications</Text>
                    </div>
                    <div style={{ maxWidth: 240 }}>
                      <Select
                        label="Controller Type"
                        options={CONTROLLER_TYPE_OPTIONS}
                        value={entry.controllerType ?? ''}
                        onChange={v => update(entry.id, 'controllerType', v)}
                      />
                    </div>
                  </div>

                  {/* Warranty */}
                  <div style={{ marginTop: 20 }}>
                    <div style={{ marginBottom: 12 }}>
                      <Text variant="headingSm" as="h4">Warranty</Text>
                    </div>
                    <div style={grid4}>
                      <DateField label="Warranty Start Date"
                        value={entry.warrantyStart} onChange={v => update(entry.id, 'warrantyStart', v)} />
                      <DateField label="Warranty End Date"
                        value={entry.warrantyEnd} onChange={v => update(entry.id, 'warrantyEnd', v)} />
                    </div>
                  </div>

                  {/* Maintenance */}
                  <div style={{ marginTop: 20 }}>
                    <div style={{ marginBottom: 12 }}>
                      <Text variant="headingSm" as="h4">Maintenance</Text>
                    </div>
                    <div style={grid3}>
                      <Select
                        label="Maintenance Frequency"
                        options={MAINTENANCE_FREQ_OPTIONS}
                        value={entry.maintenanceFrequency}
                        onChange={v => update(entry.id, 'maintenanceFrequency', v)}
                      />
                      <DateField
                        label="Next Maintenance Date"
                        value={entry.nextMaintenance ?? ''}
                        onChange={() => {}}
                        helpText="This is calculated based on the maintenance frequency"
                        disabled
                      />
                      <DateField label="Last Maintenance Date"
                        value={entry.lastMaintenance} onChange={v => update(entry.id, 'lastMaintenance', v)} />
                    </div>
                  </div>

                  {/* Uploads */}
                  <div style={{ marginTop: 20 }}>
                    <div style={grid2}>
                      <BlockStack gap="100">
                        <Text as="span" variant="bodyMd">Upload Installation Report</Text>
                        <Button icon={UploadIcon}>Add file</Button>
                        <Text tone="subdued" as="p" variant="bodySm">Upload up to 5 files (PDF or DOC), max 10 MB each.</Text>
                      </BlockStack>
                      <BlockStack gap="100">
                        <Text as="span" variant="bodyMd">Upload Photos (Equipment or installation site)</Text>
                        <Button icon={UploadIcon}>Add file</Button>
                        <Text tone="subdued" as="p" variant="bodySm">Upload up to 3 images (JPEG, PNG), max 10 MB each.</Text>
                      </BlockStack>
                    </div>
                  </div>

                  {/* General Notes */}
                  <div style={{ marginTop: 20 }}>
                    <div style={grid3}>
                      <div style={{ gridColumn: 'span 2' }}>
                        <TextField
                          label="General Notes"
                          value={entry.generalNotes}
                          onChange={v => update(entry.id, 'generalNotes', v)}
                          multiline={4}
                          placeholder="Write here"
                          autoComplete="off"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Installation Date */}
                  <div style={{ marginTop: 20 }}>
                    <div style={grid4}>
                      <DateField label="Installation Date"
                        value={entry.installationDate} onChange={v => update(entry.id, 'installationDate', v)} />
                    </div>
                  </div>
                </BlockStack>
              </div>
            )}
          </div>
        ))}

        {/* Add Another */}
        <button
          onClick={addAnother}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#2563eb', font: 'inherit', padding: '4px 0', marginTop: 16,
          }}
        >
          + Add Another Accessory
        </button>
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        gap: 8, padding: '16px 24px',
        borderTop: '1px solid var(--color-border)',
      }}>
        <Button onClick={onBack}>Back</Button>
        <Button
          variant="primary"
          disabled={!canProceed}
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
