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
} from '@shopify/polaris'
import StepIndicator from '../../components/StepIndicator'
import AddBatteryModal, { type BatteryFormData } from './AddBatteryModal'

const STEPS = [
  { label: 'Facility & Installation Type' },
  { label: 'Add Inverter' },
  { label: 'Add Solar Panels' },
  { label: 'Add Batteries' },
  { label: 'Add Accessories' },
  { label: 'Review & Submit' },
]

export interface Battery extends BatteryFormData {
  id: string
  name: string
}

const STATUS_TONES: Record<string, 'success' | 'critical' | 'warning' | 'attention'> = {
  'Functional':        'success',
  'Faulty':            'critical',
  'Under Maintenance': 'warning',
  'Decommissioned':    'attention',
}

const PAGE_SIZE = 10

interface Props {
  systemTypes: string[]
  inverterNames: string[]
  initialData?: Battery[]
  onNext: (batteries: Battery[]) => void
  onBack: () => void
  onStepClick?: (step: number) => void
}

export default function Step4AddBatteries({ systemTypes, inverterNames, initialData, onNext, onBack, onStepClick }: Props) {
  const [batteries, setBatteries]   = useState<Battery[]>(() => initialData ?? [])
  const [showModal, setShowModal]   = useState(false)
  const [editingId, setEditingId]   = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(batteries as unknown as Array<{ id: string } & Record<string, unknown>>)

  const totalPages     = Math.ceil(batteries.length / PAGE_SIZE)
  const paginated      = batteries.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const editingBattery = editingId ? batteries.find(b => b.id === editingId) : undefined

  const handleSave = (data: BatteryFormData) => {
    if (editingId !== null) {
      setBatteries(prev => prev.map(b =>
        b.id === editingId ? { ...b, ...data } : b
      ))
    } else {
      const newId = String(Date.now())
      setBatteries(prev => [...prev, {
        ...data,
        id:   newId,
        name: `Battery ${prev.length + 1}`,
      }])
    }
    setEditingId(null)
  }

  const handleDelete = (id: string) => {
    setBatteries(prev => {
      const next = prev.filter(b => b.id !== id)
      const newTotalPages = Math.ceil(next.length / PAGE_SIZE)
      if (currentPage > newTotalPages && newTotalPages > 0) setCurrentPage(newTotalPages)
      return next
    })
  }

  const handleEdit = (id: string) => {
    setEditingId(id)
    setShowModal(true)
  }

  const headings: [{ title: string }, ...{ title: string }[]] = [
    { title: 'Linked Inverter' },
    { title: 'Make' },
    { title: 'Model' },
    { title: 'Battery Type' },
    { title: 'Capacity (kWh)' },
    { title: 'Quantity' },
    { title: 'Equipment Status' },
    { title: '' },
  ]

  return (
    <>
      <div style={{ background: 'white', borderRadius: 8, overflow: 'visible' }}>
        <StepIndicator steps={STEPS} currentStep={4} completedSteps={[1, 2, 3]} onStepClick={onStepClick} />

        <div style={{ padding: 24 }}>
          <BlockStack gap="400">
            {/* Section header */}
            <InlineStack gap="300" blockAlign="center">
              <Text variant="headingSm" as="h2">Battery</Text>
              <Button
                size="slim"
                onClick={() => { setEditingId(null); setShowModal(true) }}
              >
                Add Battery
              </Button>
            </InlineStack>

            {/* Table */}
            <Card padding="0">
              {batteries.length === 0 ? (
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
                  <Button onClick={() => { setEditingId(null); setShowModal(true) }}>Add Battery</Button>
                </div>
              ) : (
                <IndexTable
                  resourceName={{ singular: 'battery', plural: 'batteries' }}
                  itemCount={batteries.length}
                  selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
                  onSelectionChange={handleSelectionChange}
                  headings={headings}
                >
                  {paginated.map((battery, index) => (
                    <IndexTable.Row
                      id={battery.id}
                      key={battery.id}
                      selected={selectedResources.includes(battery.id)}
                      position={index}
                    >
                      <IndexTable.Cell>
                        <Text as="span" fontWeight="medium">{battery.linkedInverter || '—'}</Text>
                      </IndexTable.Cell>
                      <IndexTable.Cell>{battery.make || '—'}</IndexTable.Cell>
                      <IndexTable.Cell>{battery.model || '—'}</IndexTable.Cell>
                      <IndexTable.Cell>{battery.batteryType || '—'}</IndexTable.Cell>
                      <IndexTable.Cell>{battery.capacity || '—'}</IndexTable.Cell>
                      <IndexTable.Cell>{battery.quantity}</IndexTable.Cell>
                      <IndexTable.Cell>
                        <Badge tone={STATUS_TONES[battery.equipmentStatus] ?? ('info' as const)}>
                          {battery.equipmentStatus || '—'}
                        </Badge>
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        <InlineStack gap="300">
                          <Button variant="plain" onClick={() => handleEdit(battery.id)}>Edit</Button>
                          <Button variant="plain" tone="critical" onClick={() => handleDelete(battery.id)}>Delete</Button>
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
                    hasPrevious={currentPage > 1}
                    hasNext={currentPage < totalPages}
                    onPrevious={() => setCurrentPage(p => p - 1)}
                    onNext={() => setCurrentPage(p => p + 1)}
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
            disabled={batteries.length === 0}
            onClick={() => onNext(batteries)}
          >
            Next
          </Button>
        </div>
      </div>

      {showModal && (
        <AddBatteryModal
          onClose={() => { setShowModal(false); setEditingId(null) }}
          onSave={handleSave}
          initialData={editingBattery}
          systemTypes={systemTypes}
          inverterNames={inverterNames}
        />
      )}
    </>
  )
}
