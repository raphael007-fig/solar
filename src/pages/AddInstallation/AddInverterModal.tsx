import { useState } from 'react'
import {
  Modal,
  TextField,
  Select,
  Checkbox,
  Text,
  Divider,
  Button,
  InlineStack,
  BlockStack,
} from '@shopify/polaris'
import DateField from '../../components/DateField'

export interface InverterFormData {
  systemType: string
  make: string
  model: string
  serialNumber: string
  quantity: string
  equipmentStatus: string
  ratedPower: string
  voltage: string
  capacity: string
  hasIntegratedBattery: boolean
  batteryCapacity: string
  warrantyStart: string
  warrantyEnd: string
  maintenanceFrequency: string
  lastMaintenance: string
  installationDate: string
  generalNotes: string
}

interface Props {
  onClose: () => void
  onSave: (data: InverterFormData) => void
  initialData?: Partial<InverterFormData>
}

const SYSTEM_TYPE_OPTIONS = [
  { label: 'Choose', value: '' },
  { label: 'Off-Grid',  value: 'Off-Grid' },
  { label: 'Hybrid',    value: 'Hybrid' },
  { label: 'Tied-Grid', value: 'Tied-Grid' },
]

const EQUIPMENT_STATUS_OPTIONS = [
  { label: 'Select status here', value: '' },
  { label: 'Functional',        value: 'Functional' },
  { label: 'Faulty',            value: 'Faulty' },
  { label: 'Under Maintenance', value: 'Under Maintenance' },
  { label: 'Decommissioned',    value: 'Decommissioned' },
]

const MAINTENANCE_FREQ_OPTIONS = [
  { label: 'Choose maintenance frequency here', value: '' },
  { label: 'Monthly',       value: 'Monthly' },
  { label: 'Quarterly',     value: 'Quarterly' },
  { label: 'Semi-annually', value: 'Semi-annually' },
  { label: 'Annually',      value: 'Annually' },
]

// Shared grid styles — keeps every section on the same column rhythm
const grid4: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }
const grid3: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }

export default function AddInverterModal({ onClose, onSave, initialData }: Props) {
  const [form, setForm] = useState<InverterFormData>({
    systemType:           initialData?.systemType           ?? '',
    make:                 initialData?.make                 ?? '',
    model:                initialData?.model                ?? '',
    serialNumber:         initialData?.serialNumber         ?? '',
    quantity:             initialData?.quantity             ?? '1',
    equipmentStatus:      initialData?.equipmentStatus      ?? '',
    ratedPower:           initialData?.ratedPower           ?? '',
    voltage:              initialData?.voltage              ?? '',
    capacity:             initialData?.capacity             ?? '',
    hasIntegratedBattery: initialData?.hasIntegratedBattery ?? false,
    batteryCapacity:      initialData?.batteryCapacity      ?? '',
    warrantyStart:        initialData?.warrantyStart        ?? '',
    warrantyEnd:          initialData?.warrantyEnd          ?? '',
    maintenanceFrequency: initialData?.maintenanceFrequency ?? '',
    lastMaintenance:      initialData?.lastMaintenance      ?? '',
    installationDate:     initialData?.installationDate     ?? '',
    generalNotes:         initialData?.generalNotes         ?? '',
  })

  const set = (key: keyof InverterFormData) =>
    (value: string | boolean) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSave = () => { onSave({ ...form }); onClose() }

  return (
    <Modal
      open
      onClose={onClose}
      title={initialData ? 'Edit Inverter' : 'Add Inverter'}
      primaryAction={{ content: 'Save', onAction: handleSave, variant: 'primary' }}
      secondaryActions={[{ content: 'Cancel', onAction: onClose }]}
      size="large"
      limitHeight
    >
      {/* ── Selected System Type ─────────────────────────────── */}
      <Modal.Section>
        <div style={grid4}>
          <Select
            label="Selected System Type"
            requiredIndicator
            options={SYSTEM_TYPE_OPTIONS}
            value={form.systemType}
            onChange={set('systemType')}
          />
        </div>
      </Modal.Section>

      {/* ── Basic Information ────────────────────────────────── */}
      <Modal.Section>
        <BlockStack gap="300">
          <Text variant="headingSm" as="h3">Basic Information</Text>
          {/* 4-column grid — Equipment Status wraps naturally to col 1 of row 2 */}
          <div style={grid4}>
            <TextField label="Make/Manufacturer" requiredIndicator
              value={form.make} onChange={set('make')}
              placeholder="Enter manufacturer here" autoComplete="off" />
            <TextField label="Model"
              value={form.model} onChange={set('model')}
              placeholder="Enter model here" autoComplete="off" />
            <TextField label="Serial Number"
              value={form.serialNumber} onChange={set('serialNumber')}
              placeholder="Enter serial number here" autoComplete="off" />
            <TextField label="Quantity" type="number"
              value={form.quantity} onChange={set('quantity')} autoComplete="off" />
            {/* Row 2 — aligns under Make/Manufacturer */}
            <Select
              label="Equipment Status"
              requiredIndicator
              options={EQUIPMENT_STATUS_OPTIONS}
              value={form.equipmentStatus}
              onChange={set('equipmentStatus')}
            />
          </div>
        </BlockStack>
      </Modal.Section>

      {/* ── Specifications ───────────────────────────────────── */}
      <Modal.Section>
        <BlockStack gap="300">
          <Text variant="headingSm" as="h3">Specifications</Text>
          {/* 3-column grid — checkbox spans all cols, Battery wraps to col 1 of row 3 */}
          <div style={grid3}>
            <TextField label="Rated Power (Watts)" requiredIndicator
              value={form.ratedPower} onChange={set('ratedPower')}
              placeholder="e.g 2000W" autoComplete="off" />
            <TextField label="Voltage (V)" requiredIndicator
              value={form.voltage} onChange={set('voltage')}
              placeholder="e.g 2000v" autoComplete="off" />
            <TextField label="Capacity (kWh)" requiredIndicator
              value={form.capacity} onChange={set('capacity')}
              placeholder="e.g 200kWh" autoComplete="off" />
            {/* Checkbox spans full width */}
            <div style={{ gridColumn: '1 / -1' }}>
              <Checkbox
                label="Has Integrated Battery?"
                checked={form.hasIntegratedBattery}
                onChange={set('hasIntegratedBattery')}
              />
            </div>
            {/* Internal Battery — aligns under Rated Power */}
            <TextField
              label="Internal Battery Capacity (kWh)"
              value={form.batteryCapacity}
              onChange={set('batteryCapacity')}
              placeholder="e.g 24V, 100Ah"
              disabled={!form.hasIntegratedBattery}
              autoComplete="off"
            />
          </div>
        </BlockStack>
      </Modal.Section>

      {/* ── Warranty ─────────────────────────────────────────── */}
      <Modal.Section>
        <BlockStack gap="300">
          <Text variant="headingSm" as="h3">Warranty</Text>
          {/* 4-col grid — 2 date fields sit in cols 1-2 (same width as system type above) */}
          <div style={grid4}>
            <DateField label="Warranty Start Date"
              value={form.warrantyStart} onChange={set('warrantyStart')} />
            <DateField label="Warranty End Date"
              value={form.warrantyEnd} onChange={set('warrantyEnd')} />
          </div>
        </BlockStack>
      </Modal.Section>

      {/* ── Maintenance ──────────────────────────────────────── */}
      <Modal.Section>
        <BlockStack gap="300">
          <Text variant="headingSm" as="h3">Maintenance</Text>
          {/* 3-col grid — fills full width, same rhythm as Specifications above */}
          <div style={grid3}>
            <Select
              label="Maintenance Frequency"
              options={MAINTENANCE_FREQ_OPTIONS}
              value={form.maintenanceFrequency}
              onChange={set('maintenanceFrequency')}
            />
            <DateField
              label="Next Maintenance Date"
              value=""
              onChange={() => {}}
              helpText="This is calculated based on the maintenance frequency"
              disabled
            />
            <DateField label="Last Maintenance Date"
              value={form.lastMaintenance} onChange={set('lastMaintenance')} />
          </div>
        </BlockStack>
      </Modal.Section>

      <Modal.Section>
        <Divider />
      </Modal.Section>

      {/* ── Installation + Uploads + Notes ───────────────────── */}
      <Modal.Section>
        <BlockStack gap="500">
          {/* Installation Date — 4-col grid, aligns with System Type */}
          <div style={grid4}>
            <DateField label="Installation Date" requiredIndicator
              value={form.installationDate} onChange={set('installationDate')} />
          </div>

          {/* Uploads — 3-col grid, each button fills 1 col */}
          <div style={grid3}>
            <BlockStack gap="100">
              <Text as="span" variant="bodyMd">Upload Installation Report</Text>
              <Button>
                <InlineStack gap="100" blockAlign="center">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1v8M4 4l3-3 3 3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 10v2a1 1 0 001 1h8a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
                  </svg>
                  Add file
                </InlineStack>
              </Button>
              <Text tone="subdued" as="p" variant="bodySm">Upload up to 5 files (PDF or DOC), max 10 MB each.</Text>
            </BlockStack>

            <BlockStack gap="100">
              <Text as="span" variant="bodyMd">Upload Photos (Equipment or installation site)</Text>
              <Button>
                <InlineStack gap="100" blockAlign="center">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M7 1v8M4 4l3-3 3 3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 10v2a1 1 0 001 1h8a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
                  </svg>
                  Add file
                </InlineStack>
              </Button>
              <Text tone="subdued" as="p" variant="bodySm">Upload up to 3 images (JPEG, PNG), max 10 MB each.</Text>
            </BlockStack>
          </div>

          {/* General Notes — spans 2 of 3 columns */}
          <div style={{ ...grid3 }}>
            <div style={{ gridColumn: 'span 2' }}>
              <TextField
                label="General Notes"
                value={form.generalNotes}
                onChange={set('generalNotes')}
                multiline={4}
                placeholder="Write here"
                autoComplete="off"
              />
            </div>
          </div>
        </BlockStack>
      </Modal.Section>
    </Modal>
  )
}
