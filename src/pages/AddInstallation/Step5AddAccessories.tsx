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
import AddAccessoryModal, { type AccessoryFormData } from './AddAccessoryModal'

const STEPS = [
  { label: 'Facility & Installation Type' },
  { label: 'Add Inverter' },
  { label: 'Add Solar Panels' },
  { label: 'Add Batteries' },
  { label: 'Add Accessories' },
  { label: 'Review & Submit' },
]

export interface Accessory extends AccessoryFormData {
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
  onNext: (accessories: Accessory[]) => void
  onBack: () => void
  systemTypes: string[]
  inverterNames: string[]
  onStepClick?: (step: number) => void
}

export default function Step5AddAccessories({ onNext, onBack, systemTypes, inverterNames, onStepClick }: Props) {
  const [accessories, setAccessories] = useState<Accessory[]>([])
  const [showModal, setShowModal]     = useState(false)
  const [editingId, setEditingId]     = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const { selectedResources, allResourcesSelected, handleSelectionChange } =
    useIndexResourceState(accessories as unknown as Array<{ id: string } & Record<string, unknown>>)

  const totalPages      = Math.ceil(accessories.length / PAGE_SIZE)
  const paginated       = accessories.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const editingAccessory = editingId ? accessories.find(a => a.id === editingId) : undefined

  const handleSave = (data: AccessoryFormData) => {
    if (editingId !== null) {
      setAccessories(prev => prev.map(a =>
        a.id === editingId ? { ...a, ...data } : a
      ))
    } else {
      const newId = String(Date.now())
      setAccessories(prev => [...prev, {
        ...data,
        id:   newId,
        name: `Accessory ${prev.length + 1}`,
      }])
    }
    setEditingId(null)
  }

  const handleDelete = (id: string) => {
    setAccessories(prev => {
      const next = prev.filter(a => a.id !== id)
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
    { title: 'Accessory Type' },
    { title: 'Quantity' },
    { title: 'Equipment Status' },
    { title: '' },
  ]

  return (
    <>
      <div style={{ background: 'white', borderRadius: 8, overflow: 'visible' }}>
        <StepIndicator steps={STEPS} currentStep={5} completedSteps={[1, 2, 3, 4]} onStepClick={onStepClick} />

        <div style={{ padding: 24 }}>
          <BlockStack gap="400">
            {/* Section header */}
            <InlineStack gap="300" blockAlign="center">
              <Text variant="headingSm" as="h2">Accessory</Text>
              <Button
                size="slim"
                onClick={() => { setEditingId(null); setShowModal(true) }}
              >
                Add Accessory
              </Button>
            </InlineStack>

            {/* Table */}
            <Card padding="0">
              {accessories.length === 0 ? (
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
                  <Button onClick={() => { setEditingId(null); setShowModal(true) }}>Add Accessory</Button>
                </div>
              ) : (
                <IndexTable
                  resourceName={{ singular: 'accessory', plural: 'accessories' }}
                  itemCount={accessories.length}
                  selectedItemsCount={allResourcesSelected ? 'All' : selectedResources.length}
                  onSelectionChange={handleSelectionChange}
                  headings={headings}
                >
                  {paginated.map((accessory, index) => (
                    <IndexTable.Row
                      id={accessory.id}
                      key={accessory.id}
                      selected={selectedResources.includes(accessory.id)}
                      position={index}
                    >
                      <IndexTable.Cell>
                        <Text as="span" fontWeight="medium">{accessory.linkedInverter || '—'}</Text>
                      </IndexTable.Cell>
                      <IndexTable.Cell>{accessory.make || '—'}</IndexTable.Cell>
                      <IndexTable.Cell>{accessory.model || '—'}</IndexTable.Cell>
                      <IndexTable.Cell>{accessory.accessoryType || '—'}</IndexTable.Cell>
                      <IndexTable.Cell>{accessory.quantity}</IndexTable.Cell>
                      <IndexTable.Cell>
                        <Badge tone={STATUS_TONES[accessory.equipmentStatus] ?? ('info' as const)}>
                          {accessory.equipmentStatus || '—'}
                        </Badge>
                      </IndexTable.Cell>
                      <IndexTable.Cell>
                        <InlineStack gap="300">
                          <Button variant="plain" onClick={() => handleEdit(accessory.id)}>Edit</Button>
                          <Button variant="plain" tone="critical" onClick={() => handleDelete(accessory.id)}>Delete</Button>
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
            disabled={accessories.length === 0}
            onClick={() => onNext(accessories)}
          >
            Next
          </Button>
        </div>
      </div>

      {showModal && (
        <AddAccessoryModal
          onClose={() => { setShowModal(false); setEditingId(null) }}
          onSave={handleSave}
          initialData={editingAccessory}
          systemTypes={systemTypes}
          inverterNames={inverterNames}
        />
      )}
    </>
  )
}
