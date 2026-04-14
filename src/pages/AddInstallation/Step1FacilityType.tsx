import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import {
  Select,
  Button,
  BlockStack,
  InlineStack,
  Text,
} from '@shopify/polaris'
import StepIndicator from '../../components/StepIndicator'

const SYSTEM_TYPES = [
  {
    value: 'Off-Grid',
    description: '100% solar powered. Battery failure = complete power loss.',
    tags: [
      { label: 'Inverter', variant: 'green' },
      { label: 'Panels',   variant: 'green' },
      { label: 'Battery',  variant: 'green' },
    ],
  },
  {
    value: 'Hybrid',
    description: 'Solar with grid backup. Same components as Off-Grid but alerts differ',
    tags: [
      { label: 'Inverter', variant: 'green' },
      { label: 'Panels',   variant: 'green' },
      { label: 'Battery',  variant: 'green' },
    ],
  },
  {
    value: 'Tied-Grid',
    description: 'Connected to grid power. No battery storage used.',
    tags: [
      { label: 'Inverter',   variant: 'green' },
      { label: 'Panels',     variant: 'green' },
      { label: 'No Battery', variant: 'gray' },
    ],
  },
]

const FACILITY_OPTIONS = [
  { label: 'Select', value: '' },
  { label: 'Mombasa Hospital',      value: 'Mombasa Hospital' },
  { label: 'Nairobi West Clinic',   value: 'Nairobi West Clinic' },
  { label: 'Kisumu Health Centre',  value: 'Kisumu Health Centre' },
  { label: 'Nakuru Medical',        value: 'Nakuru Medical' },
  { label: 'Eldoret Dispensary',    value: 'Eldoret Dispensary' },
  { label: 'Malindi Hospital',      value: 'Malindi Hospital' },
]

const STEPS = [
  { label: 'Facility & Installation Type' },
  { label: 'Add Inverter' },
  { label: 'Add Solar Panels' },
  { label: 'Add Batteries' },
  { label: 'Add Accessories' },
  { label: 'Review & Submit' },
]

interface SystemTypeEntry {
  id: number
  value: string
}

interface DropdownRect {
  top: number
  left: number
  width: number
}

export interface Step1Data {
  facility: string
  systemTypes: string[]
}

interface Props {
  initialData?: Step1Data
  onNext: (data: Step1Data) => void
  onBack: () => void
  onStepClick?: (step: number) => void
}

/* ── Floating System Type popover rendered via portal ─── */
function SystemTypePopover({
  rect,
  onSelect,
  onClose,
}: {
  rect: DropdownRect
  onSelect: (value: string) => void
  onClose: () => void
}) {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('[data-system-popover]')) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  return createPortal(
    <div
      data-system-popover
      style={{
        position: 'fixed',
        top: rect.top + 4,
        left: rect.left,
        width: 440,
        zIndex: 9999,
        background: 'white',
        borderRadius: 12,
        padding: 6,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        boxShadow:
          '0px 4px 6px -2px rgba(26,26,26,0.2),' +
          'inset 0px 1px 0px 0px rgba(204,204,204,0.5),' +
          'inset 0px -1px 0px 0px rgba(0,0,0,0.17),' +
          'inset 1px 0px 0px 0px rgba(0,0,0,0.13),' +
          'inset -1px 0px 0px 0px rgba(0,0,0,0.13)',
      }}
    >
      {SYSTEM_TYPES.map(opt => (
        <div
          key={opt.value}
          onMouseDown={() => onSelect(opt.value)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            padding: 6,
            borderRadius: 8,
            cursor: 'pointer',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#f6f6f6')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <span style={{
            font: '450 13px/20px var(--font-family)',
            color: 'var(--color-text)',
            whiteSpace: 'nowrap',
          }}>
            {opt.value}
          </span>
          <span style={{
            font: '450 11px/16px var(--font-family)',
            color: 'var(--color-text-secondary)',
          }}>
            {opt.description}
          </span>
          <div style={{ display: 'flex', gap: 4, paddingTop: 4 }}>
            {opt.tags.map(tag => (
              <span
                key={tag.label}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  height: 20,
                  padding: '2px 8px',
                  borderRadius: 8,
                  font: '550 12px/16px var(--font-family)',
                  whiteSpace: 'nowrap',
                  background: tag.variant === 'green' ? '#cdfee1' : 'rgba(0,0,0,0.06)',
                  color:      tag.variant === 'green' ? '#0c5132' : '#616161',
                }}
              >
                {tag.label}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>,
    document.body
  )
}

/* ── Main component ───────────────────────────────────── */
export default function Step1FacilityType({ initialData, onNext, onBack, onStepClick }: Props) {
  const [facility, setFacility] = useState(initialData?.facility ?? '')

  const [systemTypes, setSystemTypes] = useState<SystemTypeEntry[]>(() =>
    initialData?.systemTypes && initialData.systemTypes.length > 0
      ? initialData.systemTypes.map((value, i) => ({ id: i + 1, value }))
      : [{ id: 1, value: '' }]
  )
  const [openSystemDropdown, setOpenSystemDropdown] = useState<{ id: number; rect: DropdownRect } | null>(null)
  const systemTriggerRefs = useRef<Map<number, HTMLDivElement>>(new Map())

  const canProceed = facility !== '' && systemTypes.every(st => st.value !== '')

  const openSystemType = useCallback((id: number) => {
    const el = systemTriggerRefs.current.get(id)
    if (el) {
      const r = el.getBoundingClientRect()
      setOpenSystemDropdown({ id, rect: { top: r.bottom, left: r.left, width: r.width } })
    }
  }, [])

  const updateSystemType = (id: number, value: string) => {
    setSystemTypes(prev => prev.map(st => st.id === id ? { ...st, value } : st))
    setOpenSystemDropdown(null)
  }

  const addSystemType = () => {
    setSystemTypes(prev => [...prev, { id: Date.now(), value: '' }])
  }

  const removeSystemType = (id: number) => {
    setSystemTypes(prev => prev.filter(st => st.id !== id))
  }

  const triggerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    width: '100%',
    height: 32,
    padding: '6px 12px',
    border: '1px solid #c5c5c5',
    borderRadius: 8,
    background: '#fdfdfd',
    cursor: 'pointer',
    userSelect: 'none',
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ background: 'white', borderRadius: 8, overflow: 'hidden' }}>
      <StepIndicator steps={STEPS} currentStep={1} completedSteps={[]} onStepClick={onStepClick} />

      <div style={{ padding: 24 }}>
        <BlockStack gap="400">
          {/* Facility */}
          <div style={{ maxWidth: 320 }}>
            <Select
              label={<>Facility <span style={{ color: '#d72c0d' }}>*</span></>}
              options={FACILITY_OPTIONS}
              value={facility}
              onChange={setFacility}
            />
          </div>

          <div style={{ height: 1, background: '#e5e7eb' }} />

          {/* Installation Type */}
          <BlockStack gap="300">
            <Text variant="headingSm" as="h2">Installation Type</Text>

            {systemTypes.map((st, idx) => (
              <BlockStack key={st.id} gap="100">
                <div style={{ maxWidth: 320 }}>
                  <InlineStack align="space-between" blockAlign="center">
                    <Text as="span" variant="bodyMd">
                      System Type {idx + 1} <span style={{ color: '#d72c0d' }}>*</span>
                    </Text>
                    {idx > 0 && (
                      <Button
                        variant="plain"
                        tone="critical"
                        onClick={() => removeSystemType(st.id)}
                      >
                        Remove
                      </Button>
                    )}
                  </InlineStack>
                </div>

                <div style={{ maxWidth: 320 }}>
                  <div
                    ref={el => {
                      if (el) systemTriggerRefs.current.set(st.id, el)
                      else systemTriggerRefs.current.delete(st.id)
                    }}
                    style={triggerStyle}
                    onClick={() => {
                      if (openSystemDropdown?.id === st.id) {
                        setOpenSystemDropdown(null)
                      } else {
                        openSystemType(st.id)
                      }
                    }}
                    onMouseEnter={e => (e.currentTarget.style.borderColor = '#8a8a8a')}
                    onMouseLeave={e => (e.currentTarget.style.borderColor = '#c5c5c5')}
                  >
                    <span style={{
                      flex: 1,
                      font: '450 13px/20px var(--font-family)',
                      color: st.value ? 'var(--color-text)' : 'var(--color-text-disabled)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {st.value || 'Select system type here'}
                    </span>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M2 3.5l3 3 3-3" stroke="#616161" strokeWidth="1.25" strokeLinecap="round"/>
                    </svg>
                  </div>
                </div>

                <Text tone="subdued" as="p" variant="bodyMd">Defines how components can be connected</Text>
              </BlockStack>
            ))}

            {openSystemDropdown && (
              <SystemTypePopover
                rect={openSystemDropdown.rect}
                onSelect={v => updateSystemType(openSystemDropdown.id, v)}
                onClose={() => setOpenSystemDropdown(null)}
              />
            )}

            {systemTypes.length < 3 && (
              <div>
                <Button
                  variant="plain"
                  onClick={addSystemType}
                  icon={
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 2v8M2 6h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  }
                >
                  Add Another Installation Type
                </Button>
              </div>
            )}
          </BlockStack>
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
          disabled={!canProceed}
          onClick={() => onNext({ facility, systemTypes: systemTypes.map(st => st.value) })}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
