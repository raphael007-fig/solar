import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

export interface InverterSelectOption {
  value: string   // stored value (inverter name, e.g. "Inv 1")
  make:  string   // e.g. "Huawei"
  model: string   // e.g. "200005XE"
  index: number   // 1-based display number
}

interface Props {
  label:    React.ReactNode
  value:    string
  onChange: (value: string) => void
  options:  InverterSelectOption[]
}

interface Rect { top: number; left: number; width: number }

/* ── Portal dropdown ─────────────────────────────────── */
function Popover({
  rect, options, onSelect, onClose,
}: { rect: Rect; options: InverterSelectOption[]; onSelect: (v: string) => void; onClose: () => void }) {
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('[data-inv-pop]')) onClose()
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [onClose])

  return createPortal(
    <div
      data-inv-pop
      style={{
        position: 'fixed',
        top: rect.top + 4,
        left: rect.left,
        minWidth: Math.max(rect.width, 260),
        zIndex: 99999,
        background: 'white',
        borderRadius: 12,
        padding: 6,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        boxShadow:
          '0 4px 6px -2px rgba(26,26,26,0.2),' +
          'inset 0 1px 0 rgba(204,204,204,0.5),' +
          'inset 0 -1px 0 rgba(0,0,0,0.17),' +
          'inset 1px 0 0 rgba(0,0,0,0.13),' +
          'inset -1px 0 0 rgba(0,0,0,0.13)',
      }}
    >
      {options.length === 0 ? (
        <div style={{ padding: '8px 12px', color: '#9ca3af', fontSize: 13 }}>
          No inverters added yet
        </div>
      ) : options.map(opt => (
        <div
          key={opt.value}
          onMouseDown={() => onSelect(opt.value)}
          style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#f6f6f6')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <span style={{ fontSize: 13, fontWeight: 500, color: '#202223' }}>
            Inverter Type {opt.index}: {opt.make || 'Unknown'}
          </span>
          <span style={{ fontSize: 12, color: '#6d7175' }}>
            Model: {opt.model || '-'}
          </span>
        </div>
      ))}
    </div>,
    document.body,
  )
}

/* ── Main component ──────────────────────────────────── */
export default function InverterSelect({ label, value, onChange, options }: Props) {
  const [open, setOpen] = useState(false)
  const [rect, setRect] = useState<Rect | null>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  const handleOpen = useCallback(() => {
    const el = triggerRef.current
    if (el) {
      const r = el.getBoundingClientRect()
      setRect({ top: r.bottom, left: r.left, width: r.width })
      setOpen(true)
    }
  }, [])

  const selected = options.find(o => o.value === value)
  const displayText = selected
    ? `Inverter Type ${selected.index}: ${selected.make || selected.value}`
    : undefined

  return (
    <div>
      {/* Label — matches Polaris label style */}
      <div style={{ marginBottom: 4, fontSize: 14, fontWeight: 450, color: '#202223', lineHeight: '20px' }}>
        {label}
      </div>

      {/* Trigger */}
      <div
        ref={triggerRef}
        onClick={() => (open ? setOpen(false) : handleOpen())}
        onMouseEnter={e => (e.currentTarget.style.borderColor = '#8a8a8a')}
        onMouseLeave={e => (e.currentTarget.style.borderColor = '#c5c5c5')}
        style={{
          display: 'flex', alignItems: 'center', gap: 4,
          width: '100%', minHeight: 32,
          padding: '5px 12px',
          border: '1px solid #c5c5c5', borderRadius: 8,
          background: '#fdfdfd', cursor: 'pointer',
          userSelect: 'none', boxSizing: 'border-box',
        }}
      >
        <span style={{
          flex: 1, fontSize: 13, lineHeight: '20px',
          color: displayText ? '#202223' : '#9ca3af',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {displayText ?? 'Select'}
        </span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ flexShrink: 0 }}>
          <path d="M2 3.5l3 3 3-3" stroke="#616161" strokeWidth="1.25" strokeLinecap="round"/>
        </svg>
      </div>

      {open && rect && (
        <Popover
          rect={rect}
          options={options}
          onSelect={v => { onChange(v); setOpen(false); setRect(null) }}
          onClose={() => { setOpen(false); setRect(null) }}
        />
      )}
    </div>
  )
}
