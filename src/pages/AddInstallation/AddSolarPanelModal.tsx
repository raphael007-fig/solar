import { useState } from 'react'
import {
  Modal,
  TextField,
  Select,
  Text,
  Button,
  BlockStack,
} from '@shopify/polaris'
import DateField from '../../components/DateField'

export interface SolarPanelFormData {
  systemType: string
  linkedInverter: string
  make: string
  model: string
  serialNumber: string
  quantity: string
  equipmentStatus: string
  ratedPower: string
  warrantyStart: string
  warrantyEnd: string
  maintenanceFrequency: string
  nextMaintenance: string
  lastMaintenance: string
  installationDate: string
  generalNotes: string
}

interface Props {
  onClose: () => void
  onSave: (data: SolarPanelFormData) => void
  initialData?: Partial<SolarPanelFormData>
  systemTypes: string[]
  inverterNames: string[]
}

const EQUIPMENT_STATUS_OPTIONS = [
  { label: 'Select status here', value: '' },
  { label: 'Functional',         value: 'Functional' },
  { label: 'Faulty',             value: 'Faulty' },
  { label: 'Under Maintenance',  value: 'Under Maintenance' },
  { label: 'Decommissioned',     value: 'Decommissioned' },
]

const MAINTENANCE_FREQ_OPTIONS = [
  { label: 'Select maintenance frequency here', value: '' },
  { label: 'Monthly',       value: 'Monthly' },
  { label: 'Quarterly',     value: 'Quarterly' },
  { label: 'Semi-annually', value: 'Semi-annually' },
  { label: 'Annually',      value: 'Annually' },
]

const grid2: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }
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

export default function AddSolarPanelModal({ onClose, onSave, initialData, systemTypes, inverterNames }: Props) {
  const systemTypeOptions = [
    { label: 'Select', value: '' },
    ...systemTypes.map(t => ({ label: t, value: t })),
  ]
  const inverterOptions = [
    { label: 'Select', value: '' },
    ...inverterNames.map(n => ({ label: n, value: n })),
  ]
  const [form, setForm] = useState<SolarPanelFormData>({
    systemType:           initialData?.systemType           ?? '',
    linkedInverter:       initialData?.linkedInverter       ?? '',
    make:                 initialData?.make                 ?? '',
    model:                initialData?.model                ?? '',
    serialNumber:         initialData?.serialNumber         ?? '',
    quantity:             initialData?.quantity             ?? '1',
    equipmentStatus:      initialData?.equipmentStatus      ?? '',
    ratedPower:           initialData?.ratedPower           ?? '',
    warrantyStart:        initialData?.warrantyStart        ?? '',
    warrantyEnd:          initialData?.warrantyEnd          ?? '',
    maintenanceFrequency: initialData?.maintenanceFrequency ?? '',
    nextMaintenance:      initialData?.nextMaintenance      ?? '',
    lastMaintenance:      initialData?.lastMaintenance      ?? '',
    installationDate:     initialData?.installationDate     ?? '',
    generalNotes:         initialData?.generalNotes         ?? '',
  })

  const set = (key: keyof SolarPanelFormData) =>
    (value: string | boolean) => setForm(prev => ({ ...prev, [key]: value }))

  const canSave = Boolean(form.systemType && form.linkedInverter && form.make && form.equipmentStatus && form.ratedPower)

  const handleSave = () => { onSave({ ...form }); onClose() }

  return (
    <Modal
      open
      onClose={onClose}
      title={initialData ? 'Edit Solar Panel' : 'Add Solar Panel'}
      primaryAction={{ content: 'Save', onAction: handleSave, disabled: !canSave }}
      secondaryActions={[{ content: 'Cancel', onAction: onClose }]}
      size="large"
      limitHeight
    >
      {/* ── Selected System Type + Choose Linked Inverter ───── */}
      <Modal.Section>
        <div style={grid2}>
          <Select
            label={req("Selected System Type")}
            options={systemTypeOptions}
            value={form.systemType}
            onChange={set('systemType')}
          />
          <Select
            label={req("Choose Linked Inverter")}
            options={inverterOptions}
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
            <TextField
              label={req("Make/Manufacturer")}
              value={form.make}
              onChange={set('make')}
              placeholder="Enter manufacturer here"
              autoComplete="off"
            />
            <TextField
              label="Model"
              value={form.model}
              onChange={set('model')}
              placeholder="Enter model here"
              autoComplete="off"
            />
            <TextField
              label="Serial Number"
              value={form.serialNumber}
              onChange={set('serialNumber')}
              placeholder="Enter serial number here"
              autoComplete="off"
            />
            <TextField
              label="Quantity"
              type="number"
              value={form.quantity}
              onChange={set('quantity')}
              placeholder="0"
              autoComplete="off"
            />
          </div>
          <div style={grid4}>
            <Select
              label={req("Equipment Status")}
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
            <TextField
              label={req("Rated Power (Watts)")}
              value={form.ratedPower}
              onChange={set('ratedPower')}
              placeholder="e.g 2000W"
              autoComplete="off"
            />
          </div>
        </BlockStack>
      </Modal.Section>

      {/* ── Warranty ─────────────────────────────────────────── */}
      <Modal.Section>
        <BlockStack gap="300">
          <Text variant="headingSm" as="h3">Warranty</Text>
          <div style={grid4}>
            <DateField
              label="Warranty Start Date"
              value={form.warrantyStart}
              onChange={set('warrantyStart')}
            />
            <DateField
              label="Warranty End Date"
              value={form.warrantyEnd}
              onChange={set('warrantyEnd')}
            />
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
              value={form.nextMaintenance}
              onChange={set('nextMaintenance')}
              helpText="This is calculated based on the maintenance frequency"
              disabled
            />
            <DateField
              label="Last Maintenance Date"
              value={form.lastMaintenance}
              onChange={set('lastMaintenance')}
            />
          </div>
        </BlockStack>
      </Modal.Section>

      {/* ── Installation Date + Uploads + Notes ──────────────── */}
      <Modal.Section>
        <BlockStack gap="500">
          <div style={grid4}>
            <DateField
              label="Installation Date"
              value={form.installationDate}
              onChange={set('installationDate')}
            />
          </div>

          <div style={grid3}>
            <BlockStack gap="100">
              <Text as="span" variant="bodyMd">Upload Installation Report</Text>
              <Button icon={UploadIcon}>Add file</Button>
              <Text tone="subdued" as="p" variant="bodySm">
                Upload up to 5 files (PDF or DOC), max 10 MB each.
              </Text>
            </BlockStack>

            <BlockStack gap="100">
              <Text as="span" variant="bodyMd">Upload Photos (Equipment or installation site)</Text>
              <Button icon={UploadIcon}>Add file</Button>
              <Text tone="subdued" as="p" variant="bodySm">
                Upload up to 3 images (JPEG, PNG), max 10 MB each.
              </Text>
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
