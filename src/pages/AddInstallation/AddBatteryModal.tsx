import { useState } from 'react'
import {
  Modal,
  TextField,
  Select,
  Text,
  Divider,
  Button,
  BlockStack,
} from '@shopify/polaris'
import DateField from '../../components/DateField'
import InverterSelect, { type InverterSelectOption } from '../../components/InverterSelect'

export interface BatteryFormData {
  systemType: string
  linkedInverter: string
  make: string
  model: string
  serialNumber: string
  quantity: string
  equipmentStatus: string
  batteryType: string
  capacity: string
  voltage: string
  warrantyStart: string
  warrantyEnd: string
  maintenanceFrequency: string
  lastMaintenance: string
  installationDate: string
  generalNotes: string
}

interface Props {
  onClose: () => void
  onSave: (data: BatteryFormData) => void
  initialData?: Partial<BatteryFormData>
  systemTypes: string[]
  inverterOptions: InverterSelectOption[]
}

const EQUIPMENT_STATUS_OPTIONS = [
  { label: 'Select status here', value: '' },
  { label: 'Functional',        value: 'Functional' },
  { label: 'Faulty',            value: 'Faulty' },
  { label: 'Under Maintenance', value: 'Under Maintenance' },
  { label: 'Decommissioned',    value: 'Decommissioned' },
]

const BATTERY_TYPE_OPTIONS = [
  { label: 'Choose battery here', value: '' },
  { label: 'Lithium-Ion',  value: 'Lithium-Ion' },
  { label: 'Lead-Acid',    value: 'Lead-Acid' },
  { label: 'AGM',          value: 'AGM' },
  { label: 'Gel',          value: 'Gel' },
]

const MAINTENANCE_FREQ_OPTIONS = [
  { label: 'Select maintenance frequency here', value: '' },
  { label: 'Monthly',       value: 'Monthly' },
  { label: 'Quarterly',     value: 'Quarterly' },
  { label: 'Semi-annually', value: 'Semi-annually' },
  { label: 'Annually',      value: 'Annually' },
]

const grid4: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }
const grid3: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }

function UploadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
      <path d="M7 1v8M4 4l3-3 3 3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 10v2a1 1 0 001 1h8a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
    </svg>
  )
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

export default function AddBatteryModal({ onClose, onSave, initialData, systemTypes, inverterOptions }: Props) {
  const systemTypeOptions = [
    { label: 'Select', value: '' },
    ...systemTypes.map((t, i) => ({ label: `System Type ${i + 1}: ${t}`, value: t })),
  ]
  const [form, setForm] = useState<BatteryFormData>({
    systemType:           initialData?.systemType           ?? '',
    linkedInverter:       initialData?.linkedInverter       ?? '',
    make:                 initialData?.make                 ?? '',
    model:                initialData?.model                ?? '',
    serialNumber:         initialData?.serialNumber         ?? '',
    quantity:             initialData?.quantity             ?? '1',
    equipmentStatus:      initialData?.equipmentStatus      ?? '',
    batteryType:          initialData?.batteryType          ?? '',
    capacity:             initialData?.capacity             ?? '',
    voltage:              initialData?.voltage              ?? '',
    warrantyStart:        initialData?.warrantyStart        ?? '',
    warrantyEnd:          initialData?.warrantyEnd          ?? '',
    maintenanceFrequency: initialData?.maintenanceFrequency ?? '',
    lastMaintenance:      initialData?.lastMaintenance      ?? '',
    installationDate:     initialData?.installationDate     ?? '',
    generalNotes:         initialData?.generalNotes         ?? '',
  })

  const set = (key: keyof BatteryFormData) =>
    (value: string | boolean) => setForm(prev => ({ ...prev, [key]: value }))

  const setSystemType = (v: string) =>
    setForm(prev => ({ ...prev, systemType: v, linkedInverter: '' }))

  const filteredInverters = form.systemType
    ? inverterOptions.filter(o => o.systemType === form.systemType)
    : []

  const lockMessage = (() => {
    if (form.systemType === 'Tied-Grid')
      return "The Grid-Tied System can't support batteries. Please select a different system to activate your batteries."
    const inv = inverterOptions.find(o => o.value === form.linkedInverter)
    if (inv?.hasIntegratedBattery)
      return "The Inverter Selected can't support batteries. Please select a different system to activate your batteries."
    return ''
  })()
  const isLocked = lockMessage !== ''

  const canSave = isLocked || Boolean(form.systemType && (form.systemType === 'Other' || form.linkedInverter) && form.make && form.equipmentStatus)

  const handleSave = () => {
    if (isLocked) { onClose(); return }
    onSave({ ...form }); onClose()
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={initialData ? 'Edit Battery' : 'Add Battery'}
      primaryAction={{ content: 'Save', onAction: handleSave, disabled: !canSave }}
      secondaryActions={[{ content: 'Cancel', onAction: onClose }]}
      size="large"
      limitHeight
    >
      {/* ── Selected System Type + Choose Linked Inverter ────── */}
      <Modal.Section>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={grid4}>
            <Select
              label={req("Selected System Type")}
              options={systemTypeOptions}
              value={form.systemType}
              onChange={setSystemType}
            />
            <InverterSelect
              label={form.systemType === 'Other' ? 'Choose Linked Inverter' : req('Choose Linked Inverter')}
              options={filteredInverters}
              value={form.linkedInverter}
              onChange={set('linkedInverter')}
            />
          </div>
          {isLocked && <WarningBanner message={lockMessage} />}
        </div>
      </Modal.Section>

      {/* ── Basic Information ────────────────────────────────── */}
      <Modal.Section>
        <div style={{ opacity: isLocked ? 0.45 : 1, pointerEvents: isLocked ? 'none' : 'auto' }}>
          <BlockStack gap="300">
            <Text variant="headingSm" as="h3">Basic Information</Text>
            <div style={grid4}>
              <TextField label={req("Make/Manufacturer")}
                value={form.make} onChange={set('make')}
                placeholder="Enter manufacturer here" autoComplete="off" disabled={isLocked} />
              <TextField label="Model"
                value={form.model} onChange={set('model')}
                placeholder="Enter model here" autoComplete="off" disabled={isLocked} />
              <TextField label="Serial Number"
                value={form.serialNumber} onChange={set('serialNumber')}
                placeholder="Enter serial number here" autoComplete="off" disabled={isLocked} />
              <TextField label="Quantity" type="number"
                value={form.quantity} onChange={set('quantity')} autoComplete="off" disabled={isLocked} />
              <Select
                label={req("Equipment Status")}
                options={EQUIPMENT_STATUS_OPTIONS}
                value={form.equipmentStatus}
                onChange={set('equipmentStatus')}
                disabled={isLocked}
              />
            </div>
          </BlockStack>
        </div>
      </Modal.Section>

      {/* ── Specifications ───────────────────────────────────── */}
      <Modal.Section>
        <div style={{ opacity: isLocked ? 0.45 : 1, pointerEvents: isLocked ? 'none' : 'auto' }}>
          <BlockStack gap="300">
            <Text variant="headingSm" as="h3">Specifications</Text>
            <div style={grid3}>
              <Select
                label="Type of Battery"
                options={BATTERY_TYPE_OPTIONS}
                value={form.batteryType}
                onChange={set('batteryType')}
                disabled={isLocked}
              />
              <TextField label="Capacity (kWh)"
                value={form.capacity} onChange={set('capacity')}
                placeholder="e.g 200kWh" autoComplete="off" disabled={isLocked} />
              <TextField label="Voltage (V)"
                value={form.voltage} onChange={set('voltage')}
                placeholder="e.g 2000v" autoComplete="off" disabled={isLocked} />
            </div>
          </BlockStack>
        </div>
      </Modal.Section>

      {/* ── Warranty ─────────────────────────────────────────── */}
      <Modal.Section>
        <div style={{ opacity: isLocked ? 0.45 : 1, pointerEvents: isLocked ? 'none' : 'auto' }}>
          <BlockStack gap="300">
            <Text variant="headingSm" as="h3">Warranty</Text>
            <div style={grid4}>
              <DateField label="Warranty Start Date"
                value={form.warrantyStart} onChange={set('warrantyStart')} disabled={isLocked} />
              <DateField label="Warranty End Date"
                value={form.warrantyEnd} onChange={set('warrantyEnd')} disabled={isLocked} />
            </div>
          </BlockStack>
        </div>
      </Modal.Section>

      {/* ── Maintenance ──────────────────────────────────────── */}
      <Modal.Section>
        <div style={{ opacity: isLocked ? 0.45 : 1, pointerEvents: isLocked ? 'none' : 'auto' }}>
          <BlockStack gap="300">
            <Text variant="headingSm" as="h3">Maintenance</Text>
            <div style={grid3}>
              <Select
                label="Maintenance Frequency"
                options={MAINTENANCE_FREQ_OPTIONS}
                value={form.maintenanceFrequency}
                onChange={set('maintenanceFrequency')}
                disabled={isLocked}
              />
              <DateField
                label="Next Maintenance Date"
                value=""
                onChange={() => {}}
                helpText="This is calculated based on the maintenance frequency"
                disabled
              />
              <DateField label="Last Maintenance Date"
                value={form.lastMaintenance} onChange={set('lastMaintenance')} disabled={isLocked} />
            </div>
          </BlockStack>
        </div>
      </Modal.Section>

      <Modal.Section>
        <Divider />
      </Modal.Section>

      {/* ── Installation + Uploads + Notes ───────────────────── */}
      <Modal.Section>
        <div style={{ opacity: isLocked ? 0.45 : 1, pointerEvents: isLocked ? 'none' : 'auto' }}>
          <BlockStack gap="500">
            <div style={grid4}>
              <DateField label="Installation Date"
                value={form.installationDate} onChange={set('installationDate')} disabled={isLocked} />
            </div>

            <div style={grid3}>
              <BlockStack gap="100">
                <Text as="span" variant="bodyMd">Upload Installation Report</Text>
                <Button icon={UploadIcon} disabled={isLocked}>Add file</Button>
                <Text tone="subdued" as="p" variant="bodySm">Upload up to 5 files (PDF or DOC), max 10 MB each.</Text>
              </BlockStack>

              <BlockStack gap="100">
                <Text as="span" variant="bodyMd">Upload Photos (Equipment or installation site)</Text>
                <Button icon={UploadIcon} disabled={isLocked}>Add file</Button>
                <Text tone="subdued" as="p" variant="bodySm">Upload up to 3 images (JPEG, PNG), max 10 MB each.</Text>
              </BlockStack>
            </div>

            <div style={grid3}>
              <div style={{ gridColumn: 'span 2' }}>
                <TextField
                  label="General Notes"
                  value={form.generalNotes}
                  onChange={set('generalNotes')}
                  multiline={4}
                  placeholder="Write here"
                  autoComplete="off"
                  disabled={isLocked}
                />
              </div>
            </div>
          </BlockStack>
        </div>
      </Modal.Section>
    </Modal>
  )
}
