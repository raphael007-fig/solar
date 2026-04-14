import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  IndexTable,
  IndexFilters,
  useSetIndexFiltersMode,
  useIndexResourceState,
  Badge,
  Button,
  Card,
  InlineStack,
  BlockStack,
  Text,
  useBreakpoints,
} from '@shopify/polaris'
import AppShell from '../components/AppShell'
import { type Step1Data } from './AddInstallation/Step1FacilityType'
import { type Inverter } from './AddInstallation/Step2AddInverter'
import { type SolarPanel } from './AddInstallation/Step3AddSolarPanels'
import { type Battery } from './AddInstallation/Step4AddBatteries'
import { type Accessory } from './AddInstallation/Step5AddAccessories'

/* ── Types ─────────────────────────────────────────────── */

type EquipmentStatus = 'Active' | 'Unknown' | 'Decommissioned' | 'Faulty' | 'Under Maintenance'

interface InstallationSummary {
  id: string
  systemType: string
  region: string
  facility: string
  inverters: number
  solarPanels: number
  batteries: number
  accessories: number
}

interface InstallationComponent {
  id: string
  facility: string
  systemType: string
  equipmentType: string
  manufacturer: string
  quantity: number
  status: EquipmentStatus
  lastMaintenance: string
  icon: string
}

interface InstallationData {
  step1Data: Step1Data
  inverters: Inverter[]
  panels: SolarPanel[]
  batteries: Battery[]
  accessories: Accessory[]
  installationId: string
}

/* ── Helpers ────────────────────────────────────────────── */

function mapStatus(s: string): EquipmentStatus {
  if (s === 'Functional') return 'Active'
  if (s === 'Faulty') return 'Faulty'
  if (s === 'Under Maintenance') return 'Under Maintenance'
  if (s === 'Decommissioned') return 'Decommissioned'
  return 'Unknown'
}

function buildSummaryRow(data: InstallationData): InstallationSummary {
  return {
    id: data.installationId,
    systemType: data.step1Data.systemTypes[0] || 'N/A',
    region: 'Kenya',
    facility: data.step1Data.facility || 'N/A',
    inverters: data.inverters.length,
    solarPanels: data.panels.length,
    batteries: data.batteries.length,
    accessories: data.accessories.length,
  }
}

function buildComponentRows(data: InstallationData): InstallationComponent[] {
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  const facility = data.step1Data.facility || 'N/A'
  const systemType = data.step1Data.systemTypes[0] || 'N/A'
  const rows: InstallationComponent[] = []

  data.inverters.forEach((inv, i) => {
    rows.push({
      id: `${data.installationId}-INV-${i + 1}`,
      facility, systemType,
      equipmentType: 'Inverter',
      manufacturer: inv.make || '—',
      quantity: Number(inv.quantity) || 1,
      status: mapStatus(inv.equipmentStatus),
      lastMaintenance: inv.lastMaintenance || today,
      icon: '⚡',
    })
  })

  data.panels.forEach((p, i) => {
    rows.push({
      id: `${data.installationId}-PNL-${i + 1}`,
      facility, systemType,
      equipmentType: 'Solar Panel',
      manufacturer: p.make || '—',
      quantity: Number(p.quantity) || 1,
      status: mapStatus(p.equipmentStatus),
      lastMaintenance: p.lastMaintenance || today,
      icon: '☀️',
    })
  })

  data.batteries.forEach((b, i) => {
    rows.push({
      id: `${data.installationId}-BAT-${i + 1}`,
      facility, systemType,
      equipmentType: 'Battery',
      manufacturer: b.make || '—',
      quantity: Number(b.quantity) || 1,
      status: mapStatus(b.equipmentStatus),
      lastMaintenance: b.lastMaintenance || today,
      icon: '🔋',
    })
  })

  data.accessories.forEach((a, i) => {
    rows.push({
      id: `${data.installationId}-ACC-${i + 1}`,
      facility, systemType,
      equipmentType: 'Accessory',
      manufacturer: a.make || '—',
      quantity: Number(a.quantity) || 1,
      status: mapStatus(a.equipmentStatus),
      lastMaintenance: a.lastMaintenance || today,
      icon: '🔧',
    })
  })

  return rows
}

/* ── Sample data ────────────────────────────────────────── */

const SUMMARY_DATA: InstallationSummary[] = [
  { id: 'DCM-2024-001', systemType: 'Hybrid',    region: 'Coast',       facility: 'Mombasa Hospital',      inverters: 2, solarPanels: 12, batteries: 4, accessories: 3 },
  { id: 'DCM-2024-002', systemType: 'Off-Grid',  region: 'Nairobi',     facility: 'Nairobi West Clinic',   inverters: 1, solarPanels: 8,  batteries: 2, accessories: 1 },
  { id: 'DCM-2024-003', systemType: 'Off-Grid',  region: 'Nyanza',      facility: 'Kisumu Health Centre',  inverters: 1, solarPanels: 10, batteries: 3, accessories: 2 },
  { id: 'DCM-2024-004', systemType: 'Grid Tied', region: 'Rift Valley', facility: 'Nakuru Medical',        inverters: 2, solarPanels: 16, batteries: 0, accessories: 4 },
  { id: 'DCM-2024-005', systemType: 'Off-Grid',  region: 'Rift Valley', facility: 'Eldoret Dispensary',    inverters: 1, solarPanels: 6,  batteries: 2, accessories: 1 },
  { id: 'DCM-2024-006', systemType: 'Off-Grid',  region: 'Coast',       facility: 'Malindi Hospital',      inverters: 1, solarPanels: 8,  batteries: 2, accessories: 0 },
]

const COMPONENT_DATA: InstallationComponent[] = [
  { id: 'DCM-2024-001', facility: 'Mombasa',      systemType: 'Hybrid',    equipmentType: 'Inverter',    manufacturer: 'Vestfrost',         quantity: 3,  status: 'Active',            lastMaintenance: 'Jan 15, 2024', icon: '🔋' },
  { id: 'DCM-2024-002', facility: 'Nairobi West', systemType: 'Off-Grid',  equipmentType: 'Battery',     manufacturer: 'Vestfrost',         quantity: 14, status: 'Unknown',           lastMaintenance: 'Feb 20, 2024', icon: '🪫' },
  { id: 'DCM-2024-003', facility: 'Kisumu',        systemType: 'Off-Grid',  equipmentType: 'Solar Panel', manufacturer: 'B-Medical Systems', quantity: 25, status: 'Decommissioned',    lastMaintenance: 'Mar 10, 2024', icon: '⚡' },
  { id: 'DCM-2024-004', facility: 'Nakuru',        systemType: 'Grid Tied', equipmentType: 'Inverter',    manufacturer: 'Vestfrost',         quantity: 4,  status: 'Faulty',            lastMaintenance: 'Apr 5, 2024',  icon: '🔌' },
  { id: 'DCM-2024-005', facility: 'Eldoret',       systemType: 'Off-Grid',  equipmentType: 'Solar Panel', manufacturer: 'B-Medical Systems', quantity: 15, status: 'Decommissioned',    lastMaintenance: 'May 30, 2024', icon: '❄️' },
  { id: 'DCM-2024-006', facility: 'Malindi',       systemType: 'Off-Grid',  equipmentType: 'Battery',     manufacturer: 'B-Medical Systems', quantity: 9,  status: 'Under Maintenance', lastMaintenance: 'Jun 25, 2024', icon: '💉' },
  { id: 'DCM-2024-007', facility: 'Nairobi West', systemType: 'Off-Grid',  equipmentType: 'Solar Panel', manufacturer: 'Vestfrost',         quantity: 6,  status: 'Under Maintenance', lastMaintenance: 'Jul 15, 2024', icon: '❄️' },
  { id: 'DCM-2024-008', facility: 'Starehe',       systemType: 'Off-Grid',  equipmentType: 'Battery',     manufacturer: 'Vestfrost',         quantity: 32, status: 'Faulty',            lastMaintenance: 'Aug 1, 2024',  icon: '📦' },
  { id: 'DCM-2024-009', facility: 'Malindi',       systemType: 'Off-Grid',  equipmentType: 'Inverter',    manufacturer: 'Vestfrost',         quantity: 12, status: 'Active',            lastMaintenance: 'Sep 10, 2024', icon: '💉' },
  { id: 'DCM-2024-010', facility: 'Malindi',       systemType: 'Off-Grid',  equipmentType: 'Solar Panel', manufacturer: 'B-Medical Systems', quantity: 53, status: 'Unknown',           lastMaintenance: 'Sep 10, 2024', icon: '❄️' },
]

const BADGE_TONES: Record<EquipmentStatus, 'success' | 'info' | 'critical' | 'warning' | 'attention'> = {
  'Active':            'success',
  'Unknown':           'info',
  'Decommissioned':    'attention',
  'Faulty':            'critical',
  'Under Maintenance': 'warning',
}

/* ── Equipment type icon ────────────────────────────────── */

function EquipmentIcon({ type }: { type: string }) {
  const t = type.toLowerCase()
  if (t.includes('inverter'))
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8.5 2L4 9h4l-1 5 5.5-7H9l.5-5z" stroke="#616161" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  if (t.includes('battery'))
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="5" width="11" height="6" rx="1.5" stroke="#616161" strokeWidth="1.25"/>
        <path d="M13 7.5v1" stroke="#616161" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M5 8h4" stroke="#616161" strokeWidth="1.25" strokeLinecap="round"/>
        <path d="M7 6.5v3" stroke="#616161" strokeWidth="1.25" strokeLinecap="round"/>
      </svg>
    )
  if (t.includes('solar') || t.includes('panel'))
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="4" width="12" height="8" rx="1" stroke="#616161" strokeWidth="1.25"/>
        <path d="M6 4v8M10 4v8M2 8h12" stroke="#616161" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    )
  // accessories / fallback
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="5.5" stroke="#616161" strokeWidth="1.25"/>
      <path d="M8 5.5v3l2 1" stroke="#616161" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

/* ── Component ──────────────────────────────────────────── */

export default function SolarEquipmentsList() {
  const navigate     = useNavigate()
  const location     = useLocation()
  const { smDown }   = useBreakpoints()
  const { mode, setMode } = useSetIndexFiltersMode()

  const [activeTab, setActiveTab]   = useState(0)
  const [queryValue, setQueryValue] = useState('')
  const [addedSummary, setAddedSummary]     = useState<InstallationSummary[]>([])
  const [addedComponents, setAddedComponents] = useState<InstallationComponent[]>([])

  // When navigating back from the wizard, prepend the real installation data
  useEffect(() => {
    const state = location.state as { installationAdded?: boolean; installationData?: InstallationData } | null
    if (state?.installationAdded && state.installationData) {
      setAddedSummary([buildSummaryRow(state.installationData)])
      setAddedComponents(buildComponentRows(state.installationData))
    }
  }, [location.state])

  const allSummary    = [...addedSummary, ...SUMMARY_DATA]
  const allComponents = [...addedComponents, ...COMPONENT_DATA]

  /* ── Filtered data ──────────────────────────────────── */

  const summaryData: InstallationSummary[] = allSummary.filter(d =>
    !queryValue ||
    Object.values(d).some(v => String(v).toLowerCase().includes(queryValue.toLowerCase()))
  )

  const componentData: InstallationComponent[] = allComponents.filter(d =>
    !queryValue ||
    Object.values(d).some(v => String(v).toLowerCase().includes(queryValue.toLowerCase()))
  )

  /* ── Resource selection ─────────────────────────────── */

  const {
    selectedResources: summarySelected,
    allResourcesSelected: summaryAllSelected,
    handleSelectionChange: summarySelectionChange,
  } = useIndexResourceState(summaryData as unknown as Array<{ id: string } & Record<string, unknown>>)

  const {
    selectedResources: componentSelected,
    allResourcesSelected: componentAllSelected,
    handleSelectionChange: componentSelectionChange,
  } = useIndexResourceState(componentData as unknown as Array<{ id: string } & Record<string, unknown>>)

  /* ── Tabs ───────────────────────────────────────────── */

  const tabs = [
    { id: 'summary-0',   content: 'Summary',        onAction: () => {}, isLocked: true, actions: [] },
    { id: 'component-1', content: 'Component View', onAction: () => {}, isLocked: true, actions: [] },
  ]

  /* ── Stats ──────────────────────────────────────────── */

  const isEmpty = allSummary.length === 0

  const stats = [
    { label: 'Total Installations', value: allSummary.length,                                                badge: isEmpty ? '0 High Priority'   : '4 High Priority',   tone: 'attention' as const },
    { label: 'Off-Grid',            value: allSummary.filter(d => d.systemType === 'Off-Grid').length,       badge: isEmpty ? '+0 from last week' : '+2 from last week', tone: 'success' as const },
    { label: 'Hybrid',              value: allSummary.filter(d => d.systemType === 'Hybrid').length,         badge: isEmpty ? '0 from last week'  : '0 from last week',  tone: 'info' as const },
    { label: 'Grid-Tied',           value: allSummary.filter(d => d.systemType === 'Grid Tied').length,      badge: isEmpty ? '+0 from last week' : '+2 from last week', tone: 'success' as const },
  ]

  /* ── Bulk actions ───────────────────────────────────── */

  const promotedBulkActions = [
    { content: 'Decommission Equipment', onAction: () => {} },
    { content: 'Delete Equipment',       onAction: () => {} },
  ]

  /* ── Empty state ────────────────────────────────────── */

  const emptyStateMarkup = (
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
      <Button onClick={() => navigate('/add-installation')}>Add Installation</Button>
    </div>
  )

  /* ── Row markup ─────────────────────────────────────── */

  const summaryRowMarkup = summaryData.map((row, index) => (
    <IndexTable.Row
      id={row.id}
      key={row.id}
      selected={summarySelected.includes(row.id)}
      position={index}
    >
      <IndexTable.Cell>
        <Text as="span" variant="bodyMd" fontWeight="semibold">{row.id}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>{row.systemType}</IndexTable.Cell>
      <IndexTable.Cell>{row.region}</IndexTable.Cell>
      <IndexTable.Cell>{row.facility}</IndexTable.Cell>
      <IndexTable.Cell>{row.inverters}</IndexTable.Cell>
      <IndexTable.Cell>{row.solarPanels}</IndexTable.Cell>
      <IndexTable.Cell>{row.batteries}</IndexTable.Cell>
      <IndexTable.Cell>{row.accessories}</IndexTable.Cell>
      <IndexTable.Cell>
        <Button variant="plain">View</Button>
      </IndexTable.Cell>
    </IndexTable.Row>
  ))

  const componentRowMarkup = componentData.map((row, index) => (
    <IndexTable.Row
      id={row.id}
      key={row.id}
      selected={componentSelected.includes(row.id)}
      position={index}
    >
      <IndexTable.Cell>
        <div style={{
          width: 32, height: 32, borderRadius: 6,
          background: '#f1f1f1',
          border: '1px solid #e3e3e3',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <EquipmentIcon type={row.equipmentType} />
        </div>
      </IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" variant="bodyMd" fontWeight="semibold">{row.id}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>{row.facility}</IndexTable.Cell>
      <IndexTable.Cell>{row.systemType}</IndexTable.Cell>
      <IndexTable.Cell>{row.equipmentType}</IndexTable.Cell>
      <IndexTable.Cell>
        <Text as="span" fontWeight="medium">{row.manufacturer}</Text>
      </IndexTable.Cell>
      <IndexTable.Cell>{row.quantity}</IndexTable.Cell>
      <IndexTable.Cell>
        <Badge tone={BADGE_TONES[row.status]}>{row.status}</Badge>
      </IndexTable.Cell>
      <IndexTable.Cell>{row.lastMaintenance}</IndexTable.Cell>
      <IndexTable.Cell>
        <Button variant="plain">View</Button>
      </IndexTable.Cell>
    </IndexTable.Row>
  ))

  /* ── Render ─────────────────────────────────────────── */

  return (
    <AppShell>
      {/* Page header */}
      <InlineStack align="space-between" blockAlign="center" wrap={false}>
        <InlineStack gap="100" blockAlign="center">
          <Text as="h1" variant="headingLg" fontWeight="semibold">Solar Equipments</Text>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 6l4 4 4-4" stroke="#616161" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </InlineStack>
        <InlineStack gap="200">
          {!isEmpty && (
            <>
              <Button>View Equipment Plot</Button>
              <Button>Delete Equipment</Button>
              <Button>Decommission Equipment</Button>
            </>
          )}
          <Button variant="primary" size="large" onClick={() => navigate('/add-installation')}>
            Add Installation
          </Button>
        </InlineStack>
      </InlineStack>

      {/* Stat cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16,
        marginTop: 16,
        marginBottom: 16,
      }}>
        {stats.map(stat => (
          <Card key={stat.label}>
            <BlockStack gap="200">
              <InlineStack align="space-between" blockAlign="center">
                <Text tone="subdued" as="span">{stat.label}</Text>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6" stroke="#9ca3af" strokeWidth="1.25"/>
                  <path d="M8 7v4M8 5.5v.5" stroke="#9ca3af" strokeWidth="1.25" strokeLinecap="round"/>
                </svg>
              </InlineStack>
              <Text variant="heading2xl" as="p">{stat.value}</Text>
              <div style={{ display: 'inline-flex' }}>
                <Badge tone={stat.tone}>{stat.badge}</Badge>
              </div>
            </BlockStack>
          </Card>
        ))}
      </div>

      {/* Table card */}
      <Card padding="0">
        <IndexFilters
          queryValue={queryValue}
          queryPlaceholder="Search installations"
          onQueryChange={setQueryValue}
          onQueryClear={() => setQueryValue('')}
          tabs={tabs}
          selected={activeTab}
          onSelect={setActiveTab}
          filters={[]}
          appliedFilters={[]}
          onClearAll={() => setQueryValue('')}
          mode={mode}
          setMode={setMode}
          hideFilters
        />

        {/* Summary tab */}
        {activeTab === 0 && (
          <IndexTable
            condensed={smDown}
            resourceName={{ singular: 'installation', plural: 'installations' }}
            itemCount={summaryData.length}
            selectedItemsCount={summaryAllSelected ? 'All' : summarySelected.length}
            onSelectionChange={summarySelectionChange}
            promotedBulkActions={promotedBulkActions}
            emptyState={emptyStateMarkup}
            pagination={{ hasPrevious: false, hasNext: false, onPrevious: () => {}, onNext: () => {} }}
            headings={[
              { title: 'Installation ID' },
              { title: 'System Type' },
              { title: 'Region' },
              { title: 'Facility' },
              { title: 'Inverter' },
              { title: 'Solar Panels' },
              { title: 'Battery' },
              { title: 'Accessories' },
              { title: '' },
            ]}
          >
            {summaryRowMarkup}
          </IndexTable>
        )}

        {/* Component View tab */}
        {activeTab === 1 && (
          <IndexTable
            condensed={smDown}
            resourceName={{ singular: 'component', plural: 'components' }}
            itemCount={componentData.length}
            selectedItemsCount={componentAllSelected ? 'All' : componentSelected.length}
            onSelectionChange={componentSelectionChange}
            promotedBulkActions={promotedBulkActions}
            emptyState={emptyStateMarkup}
            pagination={{ hasPrevious: false, hasNext: false, onPrevious: () => {}, onNext: () => {} }}
            headings={[
              { title: '' },
              { title: 'Installation ID' },
              { title: 'Facility' },
              { title: 'System Type' },
              { title: 'Equipment Type' },
              { title: 'Manufacturer' },
              { title: 'Quantity' },
              { title: 'Equipment Status' },
              { title: 'Last Maintenance' },
              { title: '' },
            ]}
          >
            {componentRowMarkup}
          </IndexTable>
        )}
      </Card>
    </AppShell>
  )
}
