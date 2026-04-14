import { useLocation, useNavigate } from 'react-router-dom'
import {
  Badge,
  Button,
  Card,
  Text,
  BlockStack,
  InlineStack,
} from '@shopify/polaris'
import AppShell from '../../components/AppShell'
import type { Step1Data }  from '../AddInstallation/Step1FacilityType'
import type { Inverter }   from '../AddInstallation/Step2AddInverter'
import type { SolarPanel } from '../AddInstallation/Step3AddSolarPanels'
import type { Battery }    from '../AddInstallation/Step4AddBatteries'
import type { Accessory }  from '../AddInstallation/Step5AddAccessories'

/* ── Types ─────────────────────────────────────────────── */

interface InstallationData {
  installationId: string
  step1Data:      Step1Data
  inverters:      Inverter[]
  panels:         SolarPanel[]
  batteries:      Battery[]
  accessories:    Accessory[]
}

type StatusTone = 'success' | 'critical' | 'warning' | 'attention' | 'info'

const STATUS_TONE: Record<string, StatusTone> = {
  'Functional':        'success',
  'Faulty':            'critical',
  'Under Maintenance': 'warning',
  'Decommissioned':    'attention',
}

/* ── Small helpers ──────────────────────────────────────── */

function EquipmentIcon({ type }: { type: string }) {
  const t = type.toLowerCase()
  if (t === 'inverter')
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8.5 2L4 9h4l-1 5 5.5-7H9l.5-5z" stroke="#616161" strokeWidth="1.25"
          strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  if (t === 'battery')
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="5" width="11" height="6" rx="1.5" stroke="#616161" strokeWidth="1.25"/>
        <path d="M13 7.5v1" stroke="#616161" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M5 8h4M7 6.5v3" stroke="#616161" strokeWidth="1.25" strokeLinecap="round"/>
      </svg>
    )
  if (t === 'solar panel')
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="4" width="12" height="8" rx="1" stroke="#616161" strokeWidth="1.25"/>
        <path d="M6 4v8M10 4v8M2 8h12" stroke="#616161" strokeWidth="1" strokeLinecap="round"/>
      </svg>
    )
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="5.5" stroke="#616161" strokeWidth="1.25"/>
      <path d="M8 5.5v3l2 1" stroke="#616161" strokeWidth="1.25" strokeLinecap="round"
        strokeLinejoin="round"/>
    </svg>
  )
}

/* ── Main component ─────────────────────────────────────── */

export default function PrototypeBDashboard() {
  const navigate = useNavigate()
  const location = useLocation()
  const state    = location.state as { installationData?: InstallationData; returnPath?: string } | null
  const data     = state?.installationData
  const returnPath = state?.returnPath ?? '/prototype-b'

  /* If someone lands here without data (e.g. direct URL), send them back */
  if (!data) {
    return (
      <AppShell>
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', gap: 16, minHeight: '60vh',
        }}>
          <Text as="p" tone="subdued" variant="bodyMd">No installation data found.</Text>
          <Button onClick={() => navigate(returnPath)}>Go back to wizard</Button>
        </div>
      </AppShell>
    )
  }

  const { installationId, step1Data, inverters, panels, batteries, accessories } = data
  const dateInstalled = new Date().toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })

  /* Flatten all equipment into one list for the table */
  type Row = {
    id:            string
    equipmentType: string
    linkedInverter:string
    make:          string
    model:         string
    quantity:      string
    status:        string
    installDate:   string
  }

  const allRows: Row[] = [
    ...inverters.map((e, i): Row => ({
      id:             `${installationId}-INV-${i + 1}`,
      equipmentType:  'Inverter',
      linkedInverter: '—',
      make:           e.make,
      model:          e.model,
      quantity:       e.quantity,
      status:         e.equipmentStatus,
      installDate:    e.installationDate || dateInstalled,
    })),
    ...panels.map((e, i): Row => ({
      id:             `${installationId}-PNL-${i + 1}`,
      equipmentType:  'Solar Panel',
      linkedInverter: e.linkedInverter || '—',
      make:           e.make,
      model:          e.model,
      quantity:       e.quantity,
      status:         e.equipmentStatus,
      installDate:    e.installationDate || dateInstalled,
    })),
    ...batteries.map((e, i): Row => ({
      id:             `${installationId}-BAT-${i + 1}`,
      equipmentType:  'Battery',
      linkedInverter: e.linkedInverter || '—',
      make:           e.make,
      model:          e.model,
      quantity:       e.quantity,
      status:         e.equipmentStatus,
      installDate:    e.installationDate || dateInstalled,
    })),
    ...accessories.map((e, i): Row => ({
      id:             `${installationId}-ACC-${i + 1}`,
      equipmentType:  'Accessory',
      linkedInverter: e.linkedInverter || '—',
      make:           e.make,
      model:          e.model,
      quantity:       e.quantity,
      status:         e.equipmentStatus,
      installDate:    e.installationDate || dateInstalled,
    })),
  ]

  /* Stat cards */
  const stats = [
    { label: 'Total Equipment',  value: allRows.length,         badge: `${installationId}`, tone: 'attention' as const },
    { label: 'Inverters',        value: inverters.length,       badge: `${inverters.length} added`,   tone: 'success' as const },
    { label: 'Solar Panels',     value: panels.length,          badge: `${panels.length} added`,      tone: 'success' as const },
    { label: 'Batteries',        value: batteries.length,       badge: `${batteries.length} added`,   tone: 'info' as const },
  ]

  return (
    <AppShell>
      {/* Header */}
      <InlineStack align="space-between" blockAlign="center" wrap={false}>
        <InlineStack gap="300" blockAlign="center">
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 0, display: 'flex', alignItems: 'center',
              color: '#616161',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8l4 4" stroke="#616161" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <Text as="h1" variant="headingLg" fontWeight="semibold">
            Installation Dashboard
          </Text>
        </InlineStack>
        <Button variant="primary" onClick={() => navigate(returnPath)}>
          Add Another Installation
        </Button>
      </InlineStack>

      {/* Installation summary banner */}
      <div style={{
        marginTop: 16,
        background: '#EFF6FF', border: '1px solid #BFDBFE',
        borderRadius: 10, padding: '14px 20px',
      }}>
        <InlineStack gap="600" wrap={false}>
          <div>
            <Text as="span" variant="bodySm" tone="subdued">Facility</Text>
            <Text as="p" variant="bodyMd" fontWeight="semibold">{step1Data.facility || '—'}</Text>
          </div>
          <div>
            <Text as="span" variant="bodySm" tone="subdued">System Type</Text>
            <Text as="p" variant="bodyMd" fontWeight="semibold">{step1Data.systemTypes.join(', ') || '—'}</Text>
          </div>
          <div>
            <Text as="span" variant="bodySm" tone="subdued">Installation ID</Text>
            <Text as="p" variant="bodyMd" fontWeight="semibold">{installationId}</Text>
          </div>
          <div>
            <Text as="span" variant="bodySm" tone="subdued">Date Installed</Text>
            <Text as="p" variant="bodyMd" fontWeight="semibold">{dateInstalled}</Text>
          </div>
          <div>
            <Text as="span" variant="bodySm" tone="subdued">Region</Text>
            <Text as="p" variant="bodyMd" fontWeight="semibold">Kenya</Text>
          </div>
        </InlineStack>
      </div>

      {/* Stat cards */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 16, marginTop: 16, marginBottom: 16,
      }}>
        {stats.map(stat => (
          <Card key={stat.label}>
            <BlockStack gap="200">
              <InlineStack align="space-between" blockAlign="center">
                <Text tone="subdued" as="span" variant="bodySm">{stat.label}</Text>
              </InlineStack>
              <Text variant="heading2xl" as="p">{stat.value}</Text>
              <div style={{ display: 'inline-flex' }}>
                <Badge tone={stat.tone}>{stat.badge}</Badge>
              </div>
            </BlockStack>
          </Card>
        ))}
      </div>

      {/* Equipment table */}
      <Card padding="0">
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #e1e3e5' }}>
          <Text variant="headingSm" as="h2">Equipment Added</Text>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e1e3e5' }}>
                {['', 'Equipment ID', 'Type', 'Linked Inverter', 'Make', 'Model',
                  'Qty', 'Status', 'Install Date'].map(h => (
                  <th key={h} style={{
                    padding: '10px 16px', textAlign: 'left',
                    fontWeight: 600, color: '#6d7175', fontSize: 12,
                    whiteSpace: 'nowrap',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allRows.map((row, i) => (
                <tr
                  key={row.id}
                  style={{
                    borderBottom: i < allRows.length - 1 ? '1px solid #f1f1f1' : 'none',
                    background: 'white',
                  }}
                >
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: 6,
                      background: '#f1f1f1', border: '1px solid #e3e3e3',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <EquipmentIcon type={row.equipmentType} />
                    </div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <Text as="span" variant="bodyMd" fontWeight="semibold">{row.id}</Text>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#374151' }}>{row.equipmentType}</td>
                  <td style={{ padding: '12px 16px', color: '#374151' }}>{row.linkedInverter}</td>
                  <td style={{ padding: '12px 16px', color: '#374151' }}>{row.make || '—'}</td>
                  <td style={{ padding: '12px 16px', color: '#374151' }}>{row.model || '—'}</td>
                  <td style={{ padding: '12px 16px', color: '#374151' }}>{row.quantity}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <Badge tone={STATUS_TONE[row.status] ?? 'info'}>{row.status || '—'}</Badge>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#374151', whiteSpace: 'nowrap' }}>
                    {row.installDate}
                  </td>
                </tr>
              ))}

              {allRows.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ padding: '60px 24px', textAlign: 'center', color: '#9ca3af' }}>
                    No equipment data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </AppShell>
  )
}
