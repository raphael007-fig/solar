import { useState } from 'react'
import {
  Modal,
  FormLayout,
  TextField,
  Select,
  Checkbox,
  Text,
  BlockStack,
} from '@shopify/polaris'

interface SolarPanelFormData {
  linkedInverter: string
  panelGroup: string
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
  onSave: (data: Partial<SolarPanelFormData>) => void
}

const INVERTER_OPTIONS = [
  { label: 'Choose', value: '' },
  { label: 'Inv 1', value: 'Inv 1' },
  { label: 'Inv 2', value: 'Inv 2' },
  { label: 'Inv 3', value: 'Inv 3' },
]

const EQUIPMENT_STATUS_OPTIONS = [
  { label: 'Select status here', value: '' },
  { label: 'Functional',         value: 'Functional' },
  { label: 'Faulty',             value: 'Faulty' },
  { label: 'Under Maintenance',  value: 'Under Maintenance' },
  { label: 'Decommissioned',     value: 'Decommissioned' },
]

const MAINTENANCE_FREQ_OPTIONS = [
  { label: 'Choose maintenance frequency here', value: '' },
  { label: 'Monthly',       value: 'Monthly' },
  { label: 'Quarterly',     value: 'Quarterly' },
  { label: 'Semi-annually', value: 'Semi-annually' },
  { label: 'Annually',      value: 'Annually' },
]

export default function AddSolarPanelModal({ onClose, onSave }: Props) {
  const [form, setForm] = useState<SolarPanelFormData>({
    linkedInverter: '', panelGroup: '', make: '', model: '',
    serialNumber: '', quantity: '1', equipmentStatus: '',
    ratedPower: '', voltage: '', capacity: '',
    hasIntegratedBattery: false, batteryCapacity: '',
    warrantyStart: '', warrantyEnd: '',
    maintenanceFrequency: '', lastMaintenance: '',
    installationDate: '', generalNotes: '',
  })

  const set = (key: keyof SolarPanelFormData) =>
    (value: string | boolean) => setForm(prev => ({ ...prev, [key]: value }))

  const handleSave = () => { onSave({ ...form }); onClose() }

  return (
    <Modal
      open
      onClose={onClose}
      title="Add Solar Panel"
      primaryAction={{ content: 'Save', onAction: handleSave, variant: 'primary' }}
      secondaryActions={[{ content: 'Cancel', onAction: onClose }]}
      large
    >
      {/* Linked Inverter */}
      <Modal.Section>
        <div style={{ maxWidth: 320 }}>
          <Select
            label="Linked Inverter"
            requiredIndicator
            options={INVERTER_OPTIONS}
            value={form.linkedInverter}
            onChange={set('linkedInverter')}
          />
        </div>
      </Modal.Section>

      {/* Basic Information */}
      <Modal.Section>
        <BlockStack gap="400">
          <Text variant="headingSm" as="h3">Basic Information</Text>
          <FormLayout>
            <FormLayout.Group>
              <TextField label="Panel Group"
                value={form.panelGroup} onChange={set('panelGroup')}
                placeholder="e.g Group 1" autoComplete="off" />
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
                value={form.quantity} onChange={set('quantity')}
                autoComplete="off" />
            </FormLayout.Group>
            <div style={{ maxWidth: 320 }}>
              <Select
                label="Equipment Status"
                requiredIndicator
                options={EQUIPMENT_STATUS_OPTIONS}
                value={form.equipmentStatus}
                onChange={set('equipmentStatus')}
              />
            </div>
          </FormLayout>
        </BlockStack>
      </Modal.Section>

      {/* Specifications */}
      <Modal.Section>
        <BlockStack gap="400">
          <Text variant="headingSm" as="h3">Specifications</Text>
          <FormLayout>
            <FormLayout.Group>
              <TextField label="Rated Power (Watts)" requiredIndicator
                value={form.ratedPower} onChange={set('ratedPower')}
                placeholder="e.g 400W" autoComplete="off" />
              <TextField label="Voltage (V)" requiredIndicator
                value={form.voltage} onChange={set('voltage')}
                placeholder="e.g 48V" autoComplete="off" />
              <TextField label="Capacity (kWh)" requiredIndicator
                value={form.capacity} onChange={set('capacity')}
                placeholder="e.g 5kWh" autoComplete="off" />
            </FormLayout.Group>
            <Checkbox
              label="Has Integrated Battery?"
              checked={form.hasIntegratedBattery}
              onChange={set('hasIntegratedBattery')}
            />
            <div style={{ maxWidth: 320 }}>
              <TextField
                label="Internal Battery Capacity (kWh)"
                value={form.batteryCapacity}
                onChange={set('batteryCapacity')}
                placeholder="e.g 24V, 100Ah"
                disabled={!form.hasIntegratedBattery}
                autoComplete="off"
              />
            </div>
          </FormLayout>
        </BlockStack>
      </Modal.Section>

      {/* Warranty */}
      <Modal.Section>
        <BlockStack gap="400">
          <Text variant="headingSm" as="h3">Warranty</Text>
          <FormLayout>
            <FormLayout.Group>
              <TextField label="Warranty Start Date" type="date"
                value={form.warrantyStart} onChange={set('warrantyStart')} autoComplete="off" />
              <TextField label="Warranty End Date" type="date"
                value={form.warrantyEnd} onChange={set('warrantyEnd')} autoComplete="off" />
            </FormLayout.Group>
          </FormLayout>
        </BlockStack>
      </Modal.Section>

      {/* Maintenance */}
      <Modal.Section>
        <BlockStack gap="400">
          <Text variant="headingSm" as="h3">Maintenance</Text>
          <FormLayout>
            <FormLayout.Group>
              <Select
                label="Maintenance Frequency"
                options={MAINTENANCE_FREQ_OPTIONS}
                value={form.maintenanceFrequency}
                onChange={set('maintenanceFrequency')}
              />
              <TextField
                label="Next Maintenance Date"
                type="date"
                value=""
                onChange={() => {}}
                helpText="This is calculated based on the maintenance frequency"
                disabled
                autoComplete="off"
              />
              <TextField label="Last Maintenance Date" type="date"
                value={form.lastMaintenance} onChange={set('lastMaintenance')} autoComplete="off" />
            </FormLayout.Group>
          </FormLayout>
        </BlockStack>
      </Modal.Section>

      {/* Installation Date + Uploads + Notes */}
      <Modal.Section>
        <BlockStack gap="500">
          <div style={{ maxWidth: 320 }}>
            <TextField label="Installation Date" requiredIndicator type="date"
              value={form.installationDate} onChange={set('installationDate')} autoComplete="off" />
          </div>

          <BlockStack gap="100">
            <Text as="span" variant="bodyMd">Upload Installation Report</Text>
            <button
              type="button"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', border: '1px solid #e3e3e3', borderRadius: 8,
                background: 'white', cursor: 'pointer', font: 'inherit',
                boxShadow: 'inset 0 -1px 0 #b5b5b5',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v8M4 4l3-3 3 3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 10v2a1 1 0 001 1h8a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
              </svg>
              Add file
            </button>
            <Text tone="subdued" as="p" variant="bodySm">Upload up to 5 files (PDF or DOC), max 10 MB each.</Text>
          </BlockStack>

          <BlockStack gap="100">
            <Text as="span" variant="bodyMd">Upload Photos (Equipment or installation site)</Text>
            <button
              type="button"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 12px', border: '1px solid #e3e3e3', borderRadius: 8,
                background: 'white', cursor: 'pointer', font: 'inherit',
                boxShadow: 'inset 0 -1px 0 #b5b5b5',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1v8M4 4l3-3 3 3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 10v2a1 1 0 001 1h8a1 1 0 001-1v-2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round"/>
              </svg>
              Add file
            </button>
            <Text tone="subdued" as="p" variant="bodySm">Upload up to 3 images (JPEG, PNG), max 10 MB each.</Text>
          </BlockStack>

          <div style={{ maxWidth: 529 }}>
            <TextField
              label="General Notes"
              value={form.generalNotes}
              onChange={set('generalNotes')}
              multiline={4}
              placeholder="Write here"
              autoComplete="off"
            />
          </div>
        </BlockStack>
      </Modal.Section>
    </Modal>
  )
}
