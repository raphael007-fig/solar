import { useState } from 'react'
import {
  Button,
  Text,
  BlockStack,
  InlineStack,
  Checkbox,
  Divider,
} from '@shopify/polaris'
import StepIndicator from '../../components/StepIndicator'
import { useNavigate } from 'react-router-dom'

const STEPS = [
  { label: 'Facility & Installation Type' },
  { label: 'Add Inverter' },
  { label: 'Add Solar Panels' },
  { label: 'Add Batteries' },
  { label: 'Add Accessories' },
  { label: 'Review & Submit' },
]

/* ── Placeholder review data ──────────────────────────── */

interface EquipmentItem {
  id: string
  name: string
  fields: { label: string; value: string }[]
}

const COMMON_FIELDS = [
  { label: 'Selected System Type', value: 'System Type 1 : Off-Grid' },
  { label: 'Manufacturer/Make',    value: 'LG' },
  { label: 'Model',                value: 'V12SE' },
  { label: 'Serial Number',        value: '—' },
  { label: 'Quantity',             value: '1' },
  { label: 'Equipment Status',     value: 'Active' },
  { label: 'Rated Power (Watts)',  value: '2000' },
  { label: 'Voltage/Capacity',     value: '10' },
  { label: 'Internal Battery Capacity (kWh)', value: '—' },
  { label: 'Rated Power (Watts)',  value: '2000' },
  { label: 'Warranty Start Date',  value: '26 Feb 2025' },
  { label: 'Warranty End Date',    value: '26 Feb 2029' },
  { label: 'Maintenance Frequency', value: 'Monthly' },
  { label: 'Last Maintenance Date', value: '26 Feb 2025' },
  { label: 'Next Maintenance Date', value: '26 Mar 2025' },
  { label: 'Installation Date',    value: '26 Feb 2025' },
  { label: 'Installation Report',  value: 'Grid_23.pdf' },
  { label: 'Installed By',         value: 'Amari Tiko' },
  { label: 'Uploaded Photo',       value: 'Grid_Image2.png' },
  { label: 'Notes',                value: 'Power stabilizer/surge protector installed' },
]

const makeItems = (prefix: string, count: number): EquipmentItem[] =>
  Array.from({ length: count }, (_, i) => ({
    id:     `${prefix}-${i + 1}`,
    name:   `${prefix} ${i + 1}`,
    fields: COMMON_FIELDS,
  }))

const INVERTERS   = makeItems('Inverter', 3)
const PANELS      = makeItems('Solar Panel', 3)
const BATTERIES   = makeItems('Battery', 3)
const ACCESSORIES = makeItems('Accessory', 1)

/* ── Sub-components ──────────────────────────────────── */

function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

interface AccordionItemProps {
  item: EquipmentItem
  expanded: boolean
  onToggle: () => void
}

function AccordionItem({ item, expanded, onToggle }: AccordionItemProps) {
  return (
    <div style={{ borderBottom: '1px solid var(--color-border)' }}>
      {/* Header */}
      <button
        onClick={onToggle}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          width: '100%', padding: '12px 0',
          background: 'none', border: 'none', cursor: 'pointer',
          font: 'var(--font-body-md-semibold)',
          color: 'var(--color-text)',
          textAlign: 'left',
        }}
      >
        {expanded ? <ChevronDown /> : <ChevronRight />}
        {item.name}
      </button>

      {/* Expanded detail grid */}
      {expanded && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px 24px',
          padding: '8px 24px 20px',
        }}>
          {item.fields.map((f, i) => (
            <div key={i}>
              <span style={{ font: 'var(--font-body-sm-medium)', color: 'var(--color-text)' }}>
                {f.label}:{' '}
              </span>
              <span style={{ font: 'var(--font-body-sm)', color: 'var(--color-text)' }}>
                {f.value}
              </span>
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
  onGoHome: () => void
}

function SuccessPage({ onGoHome }: SuccessPageProps) {
  const [detailsOpen, setDetailsOpen] = useState(false)

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--color-bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{
        background: 'white', borderRadius: 12,
        boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.05)',
        padding: 40, width: '100%', maxWidth: 560,
        position: 'relative',
      }}>
        {/* Go to Home Page link */}
        <button
          onClick={onGoHome}
          style={{
            position: 'absolute', top: 24, right: 24,
            background: 'none', border: 'none', cursor: 'pointer',
            font: 'var(--font-body-md)',
            color: 'var(--color-text-emphasis)',
          }}
        >
          Go to Home Page
        </button>

        {/* Icon + Title */}
        <BlockStack gap="400" inlineAlign="center">
          <SuccessIcon />
          <Text variant="headingMd" as="h2" alignment="center">
            Installation Created Successfully
          </Text>

          {/* Info card */}
          <div style={{
            background: '#EFF6FF', border: '1px solid #BFDBFE',
            borderRadius: 8, padding: '16px 20px', width: '100%',
          }}>
            <BlockStack gap="100">
              <InlineStack gap="200" blockAlign="center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="1" width="10" height="13" rx="1.5"
                    stroke="#3b82f6" strokeWidth="1.25" fill="none"/>
                  <path d="M5 5h6M5 8h4" stroke="#3b82f6" strokeWidth="1.25" strokeLinecap="round"/>
                </svg>
                <Text as="span" variant="bodyMd" tone="magic">Facility: Nairobi Hospital</Text>
              </InlineStack>
              <Text as="p" variant="bodyMd" tone="magic">Installation Type: Off-Grid</Text>
              <Text as="p" variant="bodyMd" tone="magic">Date Installed: March 3, 2026</Text>
              <Text as="p" variant="bodyMd" tone="magic">Region: Kenya</Text>
              <Text as="p" variant="bodyMd" tone="magic">Installation ID: INST-12345</Text>
            </BlockStack>
          </div>

          {/* What next */}
          <Text as="p" variant="bodyMd">What would you like to do next?</Text>

          <InlineStack gap="200">
            <Button variant="primary" onClick={onGoHome}>Add Another Equipment</Button>
            <Button onClick={onGoHome}>Link Another Accessory</Button>
            <Button onClick={onGoHome}>View Details</Button>
          </InlineStack>

          {/* View installation details accordion */}
          <div style={{ width: '100%', border: '1px solid var(--color-border)', borderRadius: 8 }}>
            <button
              onClick={() => setDetailsOpen(o => !o)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', padding: '12px 16px',
                background: 'none', border: 'none', cursor: 'pointer',
                font: 'var(--font-body-md)',
              }}
            >
              <Text as="span" variant="bodyMd">View installation details</Text>
              {detailsOpen ? <ChevronDown /> : <ChevronDown />}
            </button>
            {detailsOpen && (
              <div style={{ padding: '0 16px 16px' }}>
                <Text as="p" tone="subdued" variant="bodySm">
                  No additional details to show.
                </Text>
              </div>
            )}
          </div>
        </BlockStack>
      </div>
    </div>
  )
}

/* ── Main component ──────────────────────────────────── */

interface Props {
  onBack: () => void
}

export default function Step6ReviewSubmit({ onBack }: Props) {
  const navigate = useNavigate()
  const [confirmed, setConfirmed] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    new Set(['Inverter-3', 'Solar Panel-3', 'Battery-3'])
  )

  const toggle = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (submitted) {
    return <SuccessPage onGoHome={() => navigate('/')} />
  }

  const sections = [
    { label: 'Inverters',   items: INVERTERS },
    { label: 'Solar Panels', items: PANELS },
    { label: 'Batteries',   items: BATTERIES },
    { label: 'Accessories', items: ACCESSORIES },
  ]

  return (
    <div style={{ background: 'white', borderRadius: 8, overflow: 'visible' }}>
      <StepIndicator steps={STEPS} currentStep={6} completedSteps={[1, 2, 3, 4, 5]} />

      <div style={{ padding: 24 }}>
        <BlockStack gap="500">

          {/* Installation Type summary */}
          <BlockStack gap="100">
            <Text variant="headingSm" as="h3">Installation Type</Text>
            <Text as="p" variant="bodyMd">
              <strong>Location:</strong> Kenya
            </Text>
            <Text as="p" variant="bodyMd">
              <strong>System Type 1:</strong> Off-Grid
            </Text>
          </BlockStack>

          <Divider />

          {/* Equipment accordion sections */}
          {sections.map(section => (
            <BlockStack key={section.label} gap="0">
              {section.items.map(item => (
                <AccordionItem
                  key={item.id}
                  item={item}
                  expanded={expandedIds.has(item.id)}
                  onToggle={() => toggle(item.id)}
                />
              ))}
            </BlockStack>
          ))}

          {/* Confirmation checkbox */}
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
        <Button
          variant="primary"
          disabled={!confirmed}
          onClick={() => setSubmitted(true)}
        >
          Submit
        </Button>
      </div>
    </div>
  )
}
