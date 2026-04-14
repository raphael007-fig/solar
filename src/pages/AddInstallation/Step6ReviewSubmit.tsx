import { useState } from 'react'
import { Button, Text, BlockStack, InlineStack, Checkbox, Divider } from '@shopify/polaris'
import { useNavigate } from 'react-router-dom'
import StepIndicator from '../../components/StepIndicator'
import { type Step1Data } from './Step1FacilityType'
import { type Inverter } from './Step2AddInverter'
import { type SolarPanel } from './Step3AddSolarPanels'
import { type Battery } from './Step4AddBatteries'
import { type Accessory } from './Step5AddAccessories'
import { submitToGoogleSheets } from '../../services/googleSheets'

const STEPS = [
  { label: 'Facility & Installation Type' },
  { label: 'Add Inverter' },
  { label: 'Add Solar Panels' },
  { label: 'Add Batteries' },
  { label: 'Add Accessories' },
  { label: 'Review & Submit' },
]

/* ── Field helpers ───────────────────────────────────── */

function inverterFields(inv: Inverter) {
  return [
    { label: 'System Type',                value: inv.systemType },
    { label: 'Make/Manufacturer',          value: inv.make },
    { label: 'Model',                      value: inv.model },
    { label: 'Serial Number',              value: inv.serialNumber || '—' },
    { label: 'Quantity',                   value: inv.quantity },
    { label: 'Equipment Status',           value: inv.equipmentStatus },
    { label: 'Rated Power (Watts)',        value: inv.ratedPower || '—' },
    { label: 'Voltage (V)',                value: inv.voltage || '—' },
    { label: 'Capacity (kWh)',             value: inv.capacity || '—' },
    { label: 'Integrated Battery',         value: inv.integratedBattery },
    { label: 'Battery Capacity (kWh)',     value: inv.batteryCapacity || '—' },
    { label: 'Warranty Start',             value: inv.warrantyStart || '—' },
    { label: 'Warranty End',               value: inv.warrantyEnd || '—' },
    { label: 'Maintenance Frequency',      value: inv.maintenanceFrequency || '—' },
    { label: 'Last Maintenance',           value: inv.lastMaintenance || '—' },
    { label: 'Installation Date',          value: inv.installationDate || '—' },
    { label: 'Notes',                      value: inv.generalNotes || '—' },
  ]
}

function panelFields(p: SolarPanel) {
  return [
    { label: 'System Type',           value: p.systemType || '—' },
    { label: 'Linked Inverter',       value: p.linkedInverter || '—' },
    { label: 'Make/Manufacturer',     value: p.make },
    { label: 'Model',                 value: p.model || '—' },
    { label: 'Serial Number',         value: p.serialNumber || '—' },
    { label: 'Quantity',              value: p.quantity },
    { label: 'Equipment Status',      value: p.equipmentStatus },
    { label: 'Rated Power (W)',       value: p.ratedPower || '—' },
    { label: 'Warranty Start',        value: p.warrantyStart || '—' },
    { label: 'Warranty End',          value: p.warrantyEnd || '—' },
    { label: 'Maintenance Frequency', value: p.maintenanceFrequency || '—' },
    { label: 'Next Maintenance',      value: p.nextMaintenance || '—' },
    { label: 'Last Maintenance',      value: p.lastMaintenance || '—' },
    { label: 'Installation Date',     value: p.installationDate || '—' },
    { label: 'Notes',                 value: p.generalNotes || '—' },
  ]
}

function batteryFields(b: Battery) {
  return [
    { label: 'System Type',           value: b.systemType || '—' },
    { label: 'Linked Inverter',       value: b.linkedInverter || '—' },
    { label: 'Make/Manufacturer',     value: b.make },
    { label: 'Model',                 value: b.model },
    { label: 'Serial Number',         value: b.serialNumber || '—' },
    { label: 'Quantity',              value: b.quantity },
    { label: 'Equipment Status',      value: b.equipmentStatus },
    { label: 'Battery Type',          value: b.batteryType || '—' },
    { label: 'Capacity (kWh)',        value: b.capacity || '—' },
    { label: 'Voltage (V)',           value: b.voltage || '—' },
    { label: 'Warranty Start',        value: b.warrantyStart || '—' },
    { label: 'Warranty End',          value: b.warrantyEnd || '—' },
    { label: 'Maintenance Frequency', value: b.maintenanceFrequency || '—' },
    { label: 'Last Maintenance',      value: b.lastMaintenance || '—' },
    { label: 'Installation Date',     value: b.installationDate || '—' },
    { label: 'Notes',                 value: b.generalNotes || '—' },
  ]
}

function accessoryFields(a: Accessory) {
  return [
    { label: 'System Type',           value: a.systemType || '—' },
    { label: 'Linked Inverter',       value: a.linkedInverter || '—' },
    { label: 'Make/Manufacturer',     value: a.make },
    { label: 'Model',                 value: a.model },
    { label: 'Serial Number',         value: a.serialNumber || '—' },
    { label: 'Quantity',              value: a.quantity },
    { label: 'Equipment Status',      value: a.equipmentStatus },
    { label: 'Accessory Type',        value: a.accessoryType || '—' },
    { label: 'Warranty Start',        value: a.warrantyStart || '—' },
    { label: 'Warranty End',          value: a.warrantyEnd || '—' },
    { label: 'Maintenance Frequency', value: a.maintenanceFrequency || '—' },
    { label: 'Last Maintenance',      value: a.lastMaintenance || '—' },
    { label: 'Installation Date',     value: a.installationDate || '—' },
    { label: 'Notes',                 value: a.generalNotes || '—' },
  ]
}

/* ── Accordion item ──────────────────────────────────── */

function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

interface Field { label: string; value: string }

interface AccordionItemProps {
  name: string
  fields: Field[]
  expanded: boolean
  onToggle: () => void
}

function AccordionItem({ name, fields, expanded, onToggle }: AccordionItemProps) {
  return (
    <div style={{ borderBottom: '1px solid var(--color-border-subdued, #e1e3e5)' }}>
      <button
        onClick={onToggle}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          width: '100%', padding: '12px 16px',
          background: expanded ? '#fafafa' : 'none',
          border: 'none', cursor: 'pointer',
          font: 'var(--font-body-md-semibold)',
          color: 'var(--color-text)', textAlign: 'left',
        }}
      >
        {expanded ? <ChevronDown /> : <ChevronRight />}
        {name}
      </button>

      {expanded && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px 24px', padding: '12px 24px 20px',
          background: '#fafafa',
        }}>
          {fields.map((f, i) => (
            <div key={i}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#6d7175', marginBottom: 2 }}>
                {f.label}
              </div>
              <div style={{ fontSize: 13, color: '#202223' }}>
                {f.value || '—'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── Success screen ──────────────────────────────────── */

function SuccessIcon() {
  return (
    <div style={{
      width: 100, height: 100, borderRadius: '50%',
      background: '#e8f4fd',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
        <rect x="10" y="6" width="28" height="36" rx="3" stroke="#8bb8d4" strokeWidth="2" fill="white"/>
        <circle cx="40" cy="40" r="12" fill="#40ba5b"/>
        <path d="M34 40l4 4 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 16h16M16 22h12M16 28h8" stroke="#8bb8d4" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </div>
  )
}

interface SuccessPageProps {
  facility: string
  systemType: string
  installationId: string
  onGoHome: () => void
  onViewDashboard: () => void
}

function SuccessPage({ facility, systemType, installationId, onGoHome, onViewDashboard }: SuccessPageProps) {
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        background: 'white', borderRadius: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.05)',
        padding: 40, width: '100%', maxWidth: 560,
        position: 'relative',
      }}>
        <button
          onClick={onGoHome}
          style={{
            position: 'absolute', top: 24, right: 24,
            background: 'none', border: 'none', cursor: 'pointer',
            font: 'var(--font-body-md)', color: 'var(--color-text-emphasis)',
          }}
        >
          Go to Home Page
        </button>

        <BlockStack gap="400" inlineAlign="center">
          <SuccessIcon />

          <Text variant="headingMd" as="h2" alignment="center">
            Installation Created Successfully
          </Text>

          <div style={{
            background: '#EFF6FF', border: '1px solid #BFDBFE',
            borderRadius: 8, padding: '16px 20px', width: '100%',
          }}>
            <BlockStack gap="100">
              <InlineStack gap="200" blockAlign="center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="1" width="10" height="13" rx="1.5" stroke="#3b82f6" strokeWidth="1.25" fill="none"/>
                  <path d="M5 5h6M5 8h4" stroke="#3b82f6" strokeWidth="1.25" strokeLinecap="round"/>
                </svg>
                <Text as="span" variant="bodyMd" tone="magic">Facility: {facility || 'N/A'}</Text>
              </InlineStack>
              <Text as="p" variant="bodyMd" tone="magic">Installation Type: {systemType || 'N/A'}</Text>
              <Text as="p" variant="bodyMd" tone="magic">Date Installed: {today}</Text>
              <Text as="p" variant="bodyMd" tone="magic">Region: Kenya</Text>
              <Text as="p" variant="bodyMd" tone="magic">Installation ID: {installationId}</Text>
            </BlockStack>
          </div>

          <Text as="p" variant="bodyMd">What would you like to do next?</Text>

          <InlineStack gap="200">
            <Button variant="primary" onClick={onGoHome}>Add Another Equipment</Button>
            <Button onClick={onViewDashboard}>View Dashboard</Button>
            <Button onClick={onViewDashboard}>View Details</Button>
          </InlineStack>
        </BlockStack>
      </div>
    </div>
  )
}

/* ── Main component ──────────────────────────────────── */

interface Props {
  step1Data: Step1Data
  inverters: Inverter[]
  panels: SolarPanel[]
  batteries: Battery[]
  accessories: Accessory[]
  onBack: () => void
  dashboardPath?: string
}

export default function Step6ReviewSubmit({ step1Data, inverters, panels, batteries, accessories, onBack, dashboardPath }: Props) {
  const navigate = useNavigate()
  const [confirmed, setConfirmed]   = useState(false)
  const [submitted, setSubmitted]   = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [installationId] = useState(() => `INST-${String(Date.now()).slice(-5)}`)

  const toggle = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      await submitToGoogleSheets({
        installationId,
        step1Data,
        inverters,
        panels,
        batteries,
        accessories,
      })
    } catch (err) {
      console.error('Google Sheets submission error:', err)
      // Still mark as submitted so the user sees the success screen
    } finally {
      setSubmitting(false)
      setSubmitted(true)
    }
  }

  const dashboardState = {
    installationData: { installationId, step1Data, inverters, panels, batteries, accessories },
  }

  if (submitted) {
    return (
      <SuccessPage
        facility={step1Data.facility}
        systemType={step1Data.systemTypes.join(', ')}
        installationId={installationId}
        onGoHome={() => navigate('/')}
        onViewDashboard={() => navigate(dashboardPath ?? '/prototype-b/dashboard', { state: dashboardState })}
      />
    )
  }

  const sections = [
    {
      label: 'Inverters',
      items: inverters.map((inv, i) => ({
        id: `inv-${inv.id}`,
        name: `Inverter ${i + 1}`,
        fields: inverterFields(inv),
      })),
    },
    {
      label: 'Solar Panels',
      items: panels.map((p, i) => ({
        id: `panel-${p.id}`,
        name: `Solar Panel ${i + 1}`,
        fields: panelFields(p),
      })),
    },
    {
      label: 'Batteries',
      items: batteries.map((b, i) => ({
        id: `battery-${b.id}`,
        name: `Battery ${i + 1}`,
        fields: batteryFields(b),
      })),
    },
    {
      label: 'Accessories',
      items: accessories.map((a, i) => ({
        id: `accessory-${a.id}`,
        name: `Accessory ${i + 1}`,
        fields: accessoryFields(a),
      })),
    },
  ].filter(s => s.items.length > 0)

  return (
    <div style={{ background: 'white', borderRadius: 8, overflow: 'visible' }}>
      <StepIndicator steps={STEPS} currentStep={6} completedSteps={[1, 2, 3, 4, 5]} />

      <div style={{ padding: 24 }}>
        <BlockStack gap="500">
          {/* Installation Type summary */}
          <BlockStack gap="200">
            <Text variant="headingSm" as="h3">Installation Type</Text>
            <div style={{
              border: '1px solid var(--color-border)',
              borderRadius: 8,
              padding: '14px 20px',
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px 24px',
            }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#6d7175', marginBottom: 2 }}>Facility</div>
                <div style={{ fontSize: 13, color: '#202223' }}>{step1Data.facility || '—'}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#6d7175', marginBottom: 2 }}>System Type(s)</div>
                <div style={{ fontSize: 13, color: '#202223' }}>{step1Data.systemTypes.join(', ') || '—'}</div>
              </div>
            </div>
          </BlockStack>

          <Divider />

          {/* Equipment sections */}
          {sections.length === 0 ? (
            <Text as="p" tone="subdued" variant="bodyMd">No equipment added.</Text>
          ) : (
            sections.map(section => (
              <BlockStack key={section.label} gap="100">
                {/* Section heading */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '6px 0',
                }}>
                  <Text variant="headingSm" as="h4">{section.label}</Text>
                  <Text as="span" variant="bodySm" tone="subdued">
                    {section.items.length} {section.items.length === 1 ? 'item' : 'items'}
                  </Text>
                </div>

                {/* Accordion rows */}
                <div style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 8, overflow: 'hidden',
                }}>
                  {section.items.map(item => (
                    <AccordionItem
                      key={item.id}
                      name={item.name}
                      fields={item.fields}
                      expanded={expandedIds.has(item.id)}
                      onToggle={() => toggle(item.id)}
                    />
                  ))}
                </div>
              </BlockStack>
            ))
          )}

          {/* Confirmation */}
          <Checkbox
            label="I confirm all the information provided is accurate and up to date and I want to assign this training to the users."
            checked={confirmed}
            onChange={setConfirmed}
          />
        </BlockStack>
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
        gap: 8, padding: '16px 24px',
        borderTop: '1px solid var(--color-border)',
      }}>
        <Button onClick={onBack}>Back</Button>
        <Button variant="primary" disabled={!confirmed || submitting} loading={submitting} onClick={handleSubmit}>
          {submitting ? 'Submitting…' : 'Submit'}
        </Button>
      </div>
    </div>
  )
}
