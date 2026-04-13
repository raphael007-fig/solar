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
import AddSolarPanelModal from './AddSolarPanelModal'

const STEPS = [
  { label: 'Facility & Installation Type' },
  { label: 'Add Inverter' },
  { label: 'Add Solar Panels' },
  { label: 'Add Batteries' },
  { label: 'Add Accessories' },
  { label: 'Review & Submit' },
]

interface SolarPanel {
  id: string
  linkedInverter: string
  panelGroup: string
  make: string
  model: string
  integratedBattery: string
  capacity: string
  quantity: string
  status: string
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

export default function Step3AddSolarPanels({ onNext, onBack }: Props) {
  const [panels, setPanels]       = useState<SolarPanel[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(panels)

  const handleSave = (data: Record<string, unknown>) => {
    if (editingId !== null) {
      setPanels(prev => prev.map(p =>
        p.id === editingId
          ? {
              ...p,
              linkedInverter:    String(data.linkedInverter ?? p.linkedInverter),
              panelGroup:        String(data.panelGroup ?? p.panelGroup),
              make:              String(data.make ?? p.make),
              model:             String(data.model ?? p.model),
              integratedBattery: (data.hasIntegratedBattery as boolean) ? 'Yes' : 'No',
              capacity:          String(data.capacity ?? p.capacity),
              quantity:          String(data.quantity ?? p.quantity),
              status:            String(data.equipmentStatus ?? p.status),
            }
          : p
      ))
    } else {
      const newId = String(panels.length + 1)
      setPanels(prev => [...prev, {
        id:                newId,
        linkedInverter:    String(data.linkedInverter ?? '—'),
        panelGroup:        String(data.panelGroup ?? `Group ${newId}`),
        make:              String(data.make ?? 'Unknown'),
        model:             String(data.model ?? 'Unknown'),
        integratedBattery: (data.hasIntegratedBattery as boolean) ? 'Yes' : 'No',
        capacity:          String(data.capacity ?? '—'),
        quantity:          String(data.quantity ?? '1'),
        status:            String(data.equipmentStatus ?? 'Functional'),
      }])
    }
    setEditingId(null)
  }

  const handleDelete = (id: string) => {
    setPanels(prev => prev.filter(p => p.id !== id))
  }

  const handleEdit = (id: string) => {
    setEditingId(id)
    setShowModal(true)
  }

  const headings: { title: string }[] = [
    { title: 'Linked Inverter' },
    { title: 'Panel Group' },
    { title: 'Make' },
    { title: 'Model' },
    { title: 'Integrated Battery' },
    { title: 'Capacity (kW)' },
    { title: 'Quantity' },
    { title: 'Equipment Status' },
    { title: '' },
  ]

  return (
    <>
      <div style={{ background: 'white', borderRadius: 8, overflow: 'visible' }}>
        <StepIndicator steps={STEPS} currentStep={3} completedSteps={[1, 2]} />

        <div style={{ padding: 24 }}>
          <BlockStack gap="400">
            {/* Section header */}
            <InlineStack gap="300" blockAlign="center">
              <Text variant="headingSm" as="h2">Solar Panels</Text>
              <Button
                size="slim"
                onClick={() => { setEditingId(null); setShowModal(true) }}
              >
                Add Solar Panel
              </Button>
            </InlineStack>

            {/* Table */}
            <Card padding="0">
              {panels.length === 0 ? (
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
                  <Button onClick={() => { setEditingId(null); setShowModal(true) }}>Add Solar Panel</Button>
                </div>
              ) : (
                <IndexTable
                  resourceName={{ singular: 'solar panel', plural: 'solar panels' }}
                  itemCount={panels.length}
                  selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
                  onSelectionChange={handleSelectionChange}
                  headings={headings}
                >
                  {panels.map((panel, index) => (
                    <IndexTable.Row
                      id={panel.id}
                      key={panel.id}
                      selected={selectedResources.includes(panel.id)}
                      position={index}
                    >
                      <IndexTable.Cell>
                        <Text as="span" fontWeight="medium">{panel.linkedInverter}</Text>
                      </IndexTable.Cell>
                      <IndexTable.Cell>{panel.panelGroup}</IndexTable.Cell>
                      <IndexTable.Cell>{panel.make}</IndexTable.Cell>
                      <IndexTable.Cell>{panel.model}</IndexTable.Cell>
                      <IndexTable.Cell>{panel.integratedBattery}</IndexTable.Cell>
                      <IndexTable.Cell>{panel.capacity}</IndexTable.Cell>
                      <IndexTable.Cell>{panel.quantity}</IndexTable.Cell>
                      <IndexTable.Cell>
                        <Badge tone={STATUS_TONES[panel.status] ?? 'info'}>{panel.status}</Badge>
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        <InlineStack gap="300">
                          <Button variant="plain" onClick={() => handleEdit(panel.id)}>Edit</Button>
                          <Button variant="plain" tone="critical" onClick={() => handleDelete(panel.id)}>Delete</Button>
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
            disabled={panels.length === 0}
            onClick={onNext}
          >
            Next
          </Button>
        </div>
      </div>

      {showModal && (
        <AddSolarPanelModal
          onClose={() => { setShowModal(false); setEditingId(null) }}
          onSave={handleSave}
        />
      )}
    </>
  )
}
