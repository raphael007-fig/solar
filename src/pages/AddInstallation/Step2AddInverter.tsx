import { useState } from 'react'
import {
  IndexTable,
  useIndexResourceState,
  Button,
  Text,
  InlineStack,
  Box,
  Pagination,
  Card,
  BlockStack,
  Badge,
  type BadgeTone,
} from '@shopify/polaris'
import StepIndicator from '../../components/StepIndicator'
import AddInverterModal from './AddInverterModal'

const STEPS = [
  { label: 'Facility & Installation Type' },
  { label: 'Add Inverter' },
  { label: 'Add Solar Panels' },
  { label: 'Add Batteries' },
  { label: 'Add Accessories' },
  { label: 'Review & Submit' },
]

interface Inverter {
  id: string
  name: string
  make: string
  model: string
  integratedBattery: string
  capacity: string
  status: string
  lastMaintenance: string
}

const STATUS_TONES: Record<string, BadgeTone> = {
  'Functional':        'success',
  'Faulty':            'critical',
  'Under Maintenance': 'warning',
  'Decommissioned':    'attention',
}

interface Props {
  onNext: () => void
  onBack: () => void
}

export default function Step2AddInverter({ onNext, onBack }: Props) {
  const [inverters, setInverters]   = useState<Inverter[]>([])
  const [showModal, setShowModal]   = useState(false)
  const [editingId, setEditingId]   = useState<string | null>(null)

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(inverters)

  const handleSave = (data: Record<string, unknown>) => {
    if (editingId !== null) {
      setInverters(prev => prev.map(inv =>
        inv.id === editingId
          ? {
              ...inv,
              make:              String(data.make ?? inv.make),
              model:             String(data.model ?? inv.model),
              integratedBattery: (data.hasIntegratedBattery as boolean) ? 'Yes' : 'No',
              capacity:          String(data.capacity ?? inv.capacity),
              status:            String(data.equipmentStatus ?? inv.status),
            }
          : inv
      ))
    } else {
      const newId = String(inverters.length + 1)
      setInverters(prev => [...prev, {
        id:                newId,
        name:              `Inv ${newId}`,
        make:              String(data.make ?? 'Unknown'),
        model:             String(data.model ?? 'Unknown'),
        integratedBattery: (data.hasIntegratedBattery as boolean) ? 'Yes' : 'No',
        capacity:          String(data.capacity ?? '—'),
        status:            String(data.equipmentStatus ?? 'Functional'),
        lastMaintenance:   String(data.lastMaintenance ?? '—'),
      }])
    }
    setEditingId(null)
  }

  const handleDelete = (id: string) => {
    setInverters(prev => prev.filter(inv => inv.id !== id))
  }

  const handleEdit = (id: string) => {
    setEditingId(id)
    setShowModal(true)
  }

  const headings: { title: string }[] = [
    { title: 'Inverter' },
    { title: 'Make' },
    { title: 'Model' },
    { title: 'Integrated Battery' },
    { title: 'Capacity (kW)' },
    { title: 'Equipment Status' },
    { title: 'Last Maintenance' },
    { title: '' },
  ]

  return (
    <>
      <div style={{ background: 'white', borderRadius: 8, overflow: 'visible' }}>
        <StepIndicator steps={STEPS} currentStep={2} completedSteps={[1]} />

        <div style={{ padding: 24 }}>
          <BlockStack gap="400">
            {/* Section header */}
            <InlineStack gap="300" blockAlign="center">
              <Text variant="headingSm" as="h2">Inverter</Text>
              <Button
                size="slim"
                onClick={() => { setEditingId(null); setShowModal(true) }}
              >
                Add Inverter
              </Button>
            </InlineStack>

            {/* Table */}
            <Card padding="0">
              {inverters.length === 0 ? (
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  justifyContent: 'center', gap: 8, padding: '80px 24px',
                }}>
                  <img
                    src="https://www.figma.com/api/mcp/asset/427e4e54-b1f4-4d4a-8bcc-998701c04564"
                    alt=""
                    style={{ width: 100, height: 100, objectFit: 'contain' }}
                  />
                  <Text as="p" variant="bodyMd" tone="subdued">No data available for your equipments</Text>
                  <Button onClick={() => { setEditingId(null); setShowModal(true) }}>Add Inverter</Button>
                </div>
              ) : (
                <IndexTable
                  resourceName={{ singular: 'inverter', plural: 'inverters' }}
                  itemCount={inverters.length}
                  selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
                  onSelectionChange={handleSelectionChange}
                  headings={headings}
                >
                  {inverters.map((inv, index) => (
                    <IndexTable.Row
                      id={inv.id}
                      key={inv.id}
                      selected={selectedResources.includes(inv.id)}
                      position={index}
                    >
                      <IndexTable.Cell>
                        <Text as="span" fontWeight="medium">{inv.name}</Text>
                      </IndexTable.Cell>
                      <IndexTable.Cell>{inv.make}</IndexTable.Cell>
                      <IndexTable.Cell>{inv.model}</IndexTable.Cell>
                      <IndexTable.Cell>{inv.integratedBattery}</IndexTable.Cell>
                      <IndexTable.Cell>{inv.capacity}</IndexTable.Cell>
                      <IndexTable.Cell>
                        <Badge tone={STATUS_TONES[inv.status] ?? 'info'}>{inv.status}</Badge>
                      </IndexTable.Cell>
                      <IndexTable.Cell>{inv.lastMaintenance}</IndexTable.Cell>
                      <IndexTable.Cell>
                        <InlineStack gap="300">
                          <Button variant="plain" onClick={() => handleEdit(inv.id)}>Edit</Button>
                          <Button variant="plain" tone="critical" onClick={() => handleDelete(inv.id)}>Delete</Button>
                        </InlineStack>
                      </IndexTable.Cell>
                    </IndexTable.Row>
                  ))}
                </IndexTable>
              )}

              {/* Pagination */}
              <Box padding="300" borderBlockStartWidth="025" borderColor="border">
                <InlineStack align="center">
                  <Pagination
                    hasPrevious={false}
                    hasNext={false}
                    onPrevious={() => {}}
                    onNext={() => {}}
                  />
                </InlineStack>
              </Box>
            </Card>
          </BlockStack>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 8,
          padding: '16px 24px',
          borderTop: '1px solid var(--color-border)',
        }}>
          <Button onClick={onBack}>Back</Button>
          <Button
            variant="primary"
            disabled={inverters.length === 0}
            onClick={onNext}
          >
            Next
          </Button>
        </div>
      </div>

      {showModal && (
        <AddInverterModal
          onClose={() => { setShowModal(false); setEditingId(null) }}
          onSave={handleSave}
        />
      )}
    </>
  )
}
