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
import AddInverterModal, { type InverterFormData } from './AddInverterModal'

const STEPS = [
  { label: 'Facility & Installation Type' },
  { label: 'Add Inverter' },
  { label: 'Add Solar Panels' },
  { label: 'Add Batteries' },
  { label: 'Add Accessories' },
  { label: 'Review & Submit' },
]

interface Inverter extends InverterFormData {
  id: string
  name: string
  integratedBattery: string
  status: string
}

const STATUS_TONES: Record<string, 'success' | 'critical' | 'warning' | 'attention'> = {
  'Functional':        'success',
  'Faulty':            'critical',
  'Under Maintenance': 'warning',
  'Decommissioned':    'attention',
}

const PAGE_SIZE = 10

interface Props {
  onNext: () => void
  onBack: () => void
}

export default function Step2AddInverter({ onNext, onBack }: Props) {
  const [inverters, setInverters] = useState<Inverter[]>([])
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(inverters as unknown as Array<{ id: string } & Record<string, unknown>>)

  const totalPages   = Math.ceil(inverters.length / PAGE_SIZE)
  const paginated    = inverters.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const editingInverter = editingId ? inverters.find(inv => inv.id === editingId) : undefined

  const handleSave = (data: InverterFormData) => {
    if (editingId !== null) {
      setInverters(prev => prev.map(inv =>
        inv.id === editingId
          ? {
              ...inv,
              ...data,
              integratedBattery: data.hasIntegratedBattery ? 'Yes' : 'No',
              status: data.equipmentStatus || inv.status,
            }
          : inv
      ))
    } else {
      const newId = String(Date.now())
      setInverters(prev => [...prev, {
        ...data,
        id:                newId,
        name:              `Inv ${prev.length + 1}`,
        integratedBattery: data.hasIntegratedBattery ? 'Yes' : 'No',
        status:            data.equipmentStatus || 'Functional',
      }])
    }
    setEditingId(null)
  }

  const handleDelete = (id: string) => {
    setInverters(prev => {
      const next = prev.filter(inv => inv.id !== id)
      // Adjust page if current page becomes empty
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
                  {paginated.map((inv, index) => (
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
                        <Badge tone={STATUS_TONES[inv.status] ?? ('info' as const)}>{inv.status}</Badge>
                      </IndexTable.Cell>
                      <IndexTable.Cell>{inv.lastMaintenance || '—'}</IndexTable.Cell>
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
          initialData={editingInverter}
        />
      )}
    </>
  )
}
