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

export interface AccessoryFormData {
  systemType: string
  linkedInverter: string
  make: string
  model: string
  serialNumber: string
  quantity: string
  equipmentStatus: string
  accessoryType: string
  warrantyStart: string
  warrantyEnd: string
  maintenanceFrequency: string
  controllerType?: string
  nextMaintenance?: string
  lastMaintenance: string
  installationDate: string
  generalNotes: string
}

interface Props {
  onClose: () => void
  onSave: (data: AccessoryFormData) => void
  initialData?: Partial<AccessoryFormData>
}

const SYSTEM_TYPE_OPTIONS = [
  { label: 'Select', value: '' },
  { label: 'Off-Grid',  value: 'Off-Grid' },
  { label: 'Hybrid',    value: 'Hybrid' },
  { label: 'Tied-Grid', value: 'Tied-Grid' },
]

const INVERTER_OPTIONS = [
  { label: 'Select', value: '' },
  { label: 'Inv 1', value: 'Inv 1' },
  { label: 'Inv 2', value: 'Inv 2' },
  { label: 'Inv 3', value: 'Inv 3' },
]

const EQUIPMENT_STATUS_OPTIONS = [
  { label: 'Select status here', value: '' },
  { label: 'Functional',        value: 'Functional' },
  { label: 'Faulty',            value: 'Faulty' },
  { label: 'Under Maintenance', value: 'Under Maintenance' },
  { label: 'Decommissioned',    value: 'Decommissioned' },
]

const ACCESSORY_TYPE_OPTIONS = [
  { label: 'Choose accessory type here', value: '' },
  { label: 'Controller',        value: 'Controller' },
  { label: 'Charge Controller', value: 'Charge Controller' },
  { label: 'Circuit Breaker',   value: 'Circuit Breaker' },
  { label: 'Surge Protector',   value: 'Surge Protector' },
  { label: 'Monitoring System', value: 'Monitoring System' },
  { label: 'Cable / Wiring',    value: 'Cable / Wiring' },
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

export default function AddAccessoryModal({ onClose, onSave, initialData }: Props) {
  const [form, setForm] = useState<AccessoryFormData>({
    systemType:           initialData?.systemType           ?? '',
    linkedInverter:       initialData?.linkedInverter       ?? '',
    make:                 initialData?.make                 ?? '',
    model:                initialData?.model                ?? '',
    serialNumber:         initialData?.serialNumber         ?? '',
    quantity:             initialData?.quantity             ?? '1',
    equipmentStatus:      initialData?.equipmentStatus      ?? '',
    accessoryType:        initialData?.accessoryType        ?? '',
    warrantyStart:        initialData?.warrantyStart        ?? '',
    warrantyEnd:          initialData?.warrantyEnd          ?? '',
    maintenanceFrequency: initialData?.maintenanceFrequency ?? '',
    lastMaintenance:      initialData?.lastMaintenance      ?? '',
    installationDate:     initialData?.installationDate     ?? '',
    generalNotes:         initialData?.generalNotes         ?? '',
  })

  const set = (key: keyof AccessoryFormData) =>
    (value: string | boolean) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSave = () => { onSave({ ...form }); onClose() }

  return (
    <Modal
      open
      onClose={onClose}
      title={initialData ? 'Edit Accessory' : 'Add Accessory'}
      primaryAction={{ content: 'Save', onAction: handleSave }}
      secondaryActions={[{ content: 'Cancel', onAction: onClose }]}
      size="large"
      limitHeight
    >
      {/* ── Selected System Type + Choose Linked Inverter ────── */}
      <Modal.Section>
        <div style={grid4}>
          <Select
            label="Selected System Type"
            requiredIndicator
            options={SYSTEM_TYPE_OPTIONS}
            value={form.systemType}
            onChange={set('systemType')}
          />
          <Select
            label="Choose Linked Inverter"
            requiredIndicator
            options={INVERTER_OPTIONS}
            value={form.linkedInverter}
            onChange={set('linkedInverter')}
          />
        </div>
      </Modal.Section>

      {/* ── Basic Information ────────────────────────────────── */}
      <Modal.Section>
        <BlockStack gap="300">
          <Text variant="headingSm" as="h3">Basic Information</Text>
          <div style={grid4}>
            <TextField label="Make/Manufacturer" requiredIndicator
              value={form.make} onChange={set('make')}
              placeholder="Enter manufacturer here" autoComplete="off" />
            <TextField label="Model" requiredIndicator
              value={form.model} onChange={set('model')}
              placeholder="Enter model here" autoComplete="off" />
            <TextField label="Serial Number"
              value={form.serialNumber} onChange={set('serialNumber')}
              placeholder="Enter serial number here" autoComplete="off" />
            <TextField label="Quantity" type="number"
              value={form.quantity} onChange={set('quantity')} autoComplete="off" />
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
          <div style={grid4}>
            <Select
              label="Accessory Type"
              requiredIndicator
              options={ACCESSORY_TYPE_OPTIONS}
              value={form.accessoryType}
              onChange={set('accessoryType')}
            />
          </div>
        </BlockStack>
      </Modal.Section>

      {/* ── Warranty ─────────────────────────────────────────── */}
      <Modal.Section>
        <BlockStack gap="300">
          <Text variant="headingSm" as="h3">Warranty</Text>
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
          <div style={grid4}>
            <DateField label="Installation Date" requiredIndicator
              value={form.installationDate} onChange={set('installationDate')} />
          </div>

          <div style={grid3}>
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

          <div style={grid3}>
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
