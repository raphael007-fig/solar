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
import InverterSelect, { type InverterSelectOption } from '../../components/InverterSelect'
import { type BatteryFormData } from '../AddInstallation/AddBatteryModal'
import { type Battery } from '../AddInstallation/Step4AddBatteries'

const STEPS = [
  { label: 'Facility & Installation Type' },
  { label: 'Add Inverter' },
  { label: 'Add Solar Panels' },
  { label: 'Add Batteries' },
  { label: 'Add Accessories' },
  { label: 'Review & Submit' },
]

const EQUIPMENT_STATUS_OPTIONS = [
  { label: 'Select status here', value: '' },
  { label: 'Functional', value: 'Functional' },
  { label: 'Faulty', value: 'Faulty' },
  { label: 'Under Maintenance', value: 'Under Maintenance' },
  { label: 'Decommissioned', value: 'Decommissioned' },
]

const BATTERY_TYPE_OPTIONS = [
  { label: 'Choose battery here', value: '' },
  { label: 'Lithium-Ion', value: 'Lithium-Ion' },
  { label: 'Lead-Acid', value: 'Lead-Acid' },
  { label: 'AGM', value: 'AGM' },
  { label: 'Gel', value: 'Gel' },
  { label: 'LiFePO4', value: 'LiFePO4' },
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

interface BatteryEntry extends BatteryFormData {
  id: string
  expanded: boolean
}

function emptyEntry(id: string): BatteryEntry {
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
    batteryType: '',
    capacity: '',
    voltage: '',
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
  inverterOptions: InverterSelectOption[]
  initialData?: Battery[]
  onNext: (batteries: Battery[]) => void
  onBack: () => void
  onStepClick?: (step: number) => void
}

function req(label: string) {
  return <>{label} <span style={{ color: '#d72c0d' }}>*</span></>
}

function WarningBanner({ message }: { message: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '12px 16px',
      background: '#FFF4E5',
      border: '1px solid #FFD591',
      borderRadius: 8,
      marginBottom: 4,
    }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
        <path d="M7.12 2.5a1 1 0 011.76 0l5.5 9.5A1 1 0 0113.5 13.5h-11a1 1 0 01-.88-1.5l5.5-9.5z" stroke="#F59E0B" strokeWidth="1.25" strokeLinejoin="round"/>
        <path d="M8 6.5v3" stroke="#F59E0B" strokeWidth="1.25" strokeLinecap="round"/>
        <circle cx="8" cy="11" r="0.75" fill="#F59E0B"/>
      </svg>
      <span style={{ fontSize: 13, color: '#7C4206', lineHeight: '20px' }}>{message}</span>
    </div>
  )
}

function getLockState(entry: BatteryEntry, inverterOptions: InverterSelectOption[]): { locked: boolean; message: string } {
  if (entry.systemType === 'Tied-Grid') {
    return { locked: true, message: "The Grid-Tied System can't support batteries. Please select a different system to activate your batteries." }
  }
  const inv = inverterOptions.find(o => o.value === entry.linkedInverter)
  if (inv?.hasIntegratedBattery) {
    return { locked: true, message: "The Inverter Selected can't support batteries. Please select a different system to activate your batteries." }
  }
  return { locked: false, message: '' }
}

export default function Step4Batteries({ systemTypes, inverterOptions, initialData, onNext, onBack, onStepClick }: Props) {
  const systemTypeOptions = [
    { label: 'Choose', value: '' },
    ...systemTypes.map((t, i) => ({ label: `System Type ${i + 1}: ${t}`, value: t })),
  ]

  const [entries, setEntries] = useState<BatteryEntry[]>(() =>
    initialData && initialData.length > 0
      ? initialData.map(b => ({ ...b, expanded: false }))
      : [emptyEntry(String(Date.now()))]
  )

  const canProceed = entries.length > 0 && entries.every(e => {
    const { locked } = getLockState(e, inverterOptions)
    if (locked) return true
    return e.systemType && (e.systemType === 'Other' || e.linkedInverter) && e.make && e.equipmentStatus
  })

  const filteredInverters = (systemType: string) =>
    systemType ? inverterOptions.filter(o => o.systemType === systemType) : []

  const update = (id: string, key: keyof BatteryFormData, value: string | boolean) => {
    setEntries(prev => prev.map(e => {
      if (e.id !== id) return e
      const updated = { ...e, [key]: value }
      if (key === 'systemType') updated.linkedInverter = ''
      return updated
    }))
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
    const batteries: Battery[] = entries.map((entry, i) => ({
      ...entry,
      name: `Battery ${i + 1}`,
    }))
    onNext(batteries)
  }

  return (
    <div style={{ background: 'white', borderRadius: 8, overflow: 'visible' }}>
      <StepIndicator steps={STEPS} currentStep={4} completedSteps={[1, 2, 3]} onStepClick={onStepClick} />

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
                <Text variant="headingSm" as="span">Battery {idx + 1}</Text>
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
            {entry.expanded && (() => {
              const { locked, message } = getLockState(entry, inverterOptions)
              return (
                <div style={{ padding: '20px', borderTop: '1px solid #e1e3e5' }}>
                  <BlockStack gap="400">
                    {/* System Type + Linked Inverter */}
                    <div style={grid2}>
                      <Select
                        label={req('Selected System Type')}
                        options={systemTypeOptions}
                        value={entry.systemType}
                        onChange={v => update(entry.id, 'systemType', v)}
                      />
                      <InverterSelect
                        label={entry.systemType === 'Other' ? 'Choose Linked Inverter' : req('Choose Linked Inverter')}
                        options={filteredInverters(entry.systemType)}
                        value={entry.linkedInverter}
                        onChange={v => update(entry.id, 'linkedInverter', v)}
                      />
                    </div>

                    {/* Warning banner */}
                    {locked && <WarningBanner message={message} />}

                    {/* Basic Information */}
                    <div style={{ marginTop: 20, opacity: locked ? 0.45 : 1, pointerEvents: locked ? 'none' : 'auto' }}>
                      <div style={{ marginBottom: 12 }}>
                        <Text variant="headingSm" as="h4">Basic Information</Text>
                      </div>
                      <div style={grid4}>
                        <TextField label={req('Make/Manufacturer')}
                          value={entry.make} onChange={v => update(entry.id, 'make', v)}
                          placeholder="Enter manufacturer here" autoComplete="off" disabled={locked} />
                        <TextField label="Model"
                          value={entry.model} onChange={v => update(entry.id, 'model', v)}
                          placeholder="Enter model here" autoComplete="off" disabled={locked} />
                        <TextField label="Serial Number"
                          value={entry.serialNumber} onChange={v => update(entry.id, 'serialNumber', v)}
                          placeholder="Enter serial number here" autoComplete="off" disabled={locked} />
                        <TextField label="Quantity" type="number"
                          value={entry.quantity} onChange={v => update(entry.id, 'quantity', v)}
                          autoComplete="off" disabled={locked} />
                      </div>
                      <div style={{ ...grid4, marginTop: 12 }}>
                        <Select
                          label={req('Equipment Status')}
                          options={EQUIPMENT_STATUS_OPTIONS}
                          value={entry.equipmentStatus}
                          onChange={v => update(entry.id, 'equipmentStatus', v)}
                          disabled={locked}
                        />
                      </div>
                    </div>

                    {/* Specifications */}
                    <div style={{ marginTop: 20, opacity: locked ? 0.45 : 1, pointerEvents: locked ? 'none' : 'auto' }}>
                      <div style={{ marginBottom: 12 }}>
                        <Text variant="headingSm" as="h4">Specifications</Text>
                      </div>
                      <div style={grid3}>
                        <Select
                          label="Type of Battery"
                          options={BATTERY_TYPE_OPTIONS}
                          value={entry.batteryType}
                          onChange={v => update(entry.id, 'batteryType', v)}
                          disabled={locked}
                        />
                        <TextField label="Capacity (kWh)"
                          value={entry.capacity} onChange={v => update(entry.id, 'capacity', v)}
                          placeholder="e.g 200kWh" autoComplete="off" disabled={locked} />
                        <TextField label="Voltage (V)"
                          value={entry.voltage} onChange={v => update(entry.id, 'voltage', v)}
                          placeholder="e.g 2000v" autoComplete="off" disabled={locked} />
                      </div>
                    </div>

                    {/* Warranty */}
                    <div style={{ marginTop: 20, opacity: locked ? 0.45 : 1, pointerEvents: locked ? 'none' : 'auto' }}>
                      <div style={{ marginBottom: 12 }}>
                        <Text variant="headingSm" as="h4">Warranty</Text>
                      </div>
                      <div style={grid4}>
                        <DateField label="Warranty Start Date"
                          value={entry.warrantyStart} onChange={v => update(entry.id, 'warrantyStart', v)} disabled={locked} />
                        <DateField label="Warranty End Date"
                          value={entry.warrantyEnd} onChange={v => update(entry.id, 'warrantyEnd', v)} disabled={locked} />
                      </div>
                    </div>

                    {/* Maintenance */}
                    <div style={{ marginTop: 20, opacity: locked ? 0.45 : 1, pointerEvents: locked ? 'none' : 'auto' }}>
                      <div style={{ marginBottom: 12 }}>
                        <Text variant="headingSm" as="h4">Maintenance</Text>
                      </div>
                      <div style={grid3}>
                        <Select
                          label="Maintenance Frequency"
                          options={MAINTENANCE_FREQ_OPTIONS}
                          value={entry.maintenanceFrequency}
                          onChange={v => update(entry.id, 'maintenanceFrequency', v)}
                          disabled={locked}
                        />
                        <DateField
                          label="Next Maintenance Date"
                          value=""
                          onChange={() => {}}
                          helpText="This is calculated based on the maintenance frequency"
                          disabled
                        />
                        <DateField label="Last Maintenance Date"
                          value={entry.lastMaintenance} onChange={v => update(entry.id, 'lastMaintenance', v)} disabled={locked} />
                      </div>
                    </div>

                    {/* Uploads */}
                    <div style={{ marginTop: 20, opacity: locked ? 0.45 : 1, pointerEvents: locked ? 'none' : 'auto' }}>
                      <div style={grid2}>
                        <BlockStack gap="100">
                          <Text as="span" variant="bodyMd">Upload Installation Report</Text>
                          <Button icon={UploadIcon} disabled={locked}>Add file</Button>
                          <Text tone="subdued" as="p" variant="bodySm">Upload up to 5 files (PDF or DOC), max 10 MB each.</Text>
                        </BlockStack>
                        <BlockStack gap="100">
                          <Text as="span" variant="bodyMd">Upload Photos (Equipment or installation site)</Text>
                          <Button icon={UploadIcon} disabled={locked}>Add file</Button>
                          <Text tone="subdued" as="p" variant="bodySm">Upload up to 3 images (JPEG, PNG), max 10 MB each.</Text>
                        </BlockStack>
                      </div>
                    </div>

                    {/* General Notes */}
                    <div style={{ marginTop: 20, opacity: locked ? 0.45 : 1, pointerEvents: locked ? 'none' : 'auto' }}>
                      <div style={grid3}>
                        <div style={{ gridColumn: 'span 2' }}>
                          <TextField
                            label="General Notes"
                            value={entry.generalNotes}
                            onChange={v => update(entry.id, 'generalNotes', v)}
                            multiline={4}
                            placeholder="Write here"
                            autoComplete="off"
                            disabled={locked}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Installation Date */}
                    <div style={{ marginTop: 20, opacity: locked ? 0.45 : 1, pointerEvents: locked ? 'none' : 'auto' }}>
                      <div style={grid4}>
                        <DateField label="Installation Date"
                          value={entry.installationDate} onChange={v => update(entry.id, 'installationDate', v)} disabled={locked} />
                      </div>
                    </div>
                  </BlockStack>
                </div>
              )
            })()}
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
          + Add Another Battery
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
