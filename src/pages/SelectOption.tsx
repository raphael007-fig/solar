import { useNavigate } from 'react-router-dom'
import { Text, InlineStack } from '@shopify/polaris'
import AppShell from '../components/AppShell'

function IconPrototypeA() {
  return (
    <div style={{
      width: 72, height: 72, borderRadius: '50%',
      background: '#dbeafe',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Magnifying glass with eye */}
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="17" cy="17" r="10" stroke="#3b82f6" strokeWidth="2.5" fill="none"/>
        <circle cx="17" cy="17" r="4" fill="#3b82f6" opacity="0.3"/>
        <circle cx="17" cy="17" r="2.5" fill="#3b82f6"/>
        <path d="M24 24L32 32" stroke="#b45309" strokeWidth="3" strokeLinecap="round"/>
        {/* eye highlight */}
        <circle cx="15.5" cy="15.5" r="1" fill="white"/>
      </svg>
    </div>
  )
}

function IconPrototypeB() {
  return (
    <div style={{
      width: 72, height: 72, borderRadius: '50%',
      background: '#dbeafe',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Document with pencil */}
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <rect x="8" y="5" width="18" height="24" rx="2" fill="white" stroke="#93c5fd" strokeWidth="1.5"/>
        <path d="M12 11h10M12 15h8M12 19h6" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round"/>
        {/* pencil */}
        <rect
          x="22" y="18"
          width="5" height="14"
          rx="1"
          transform="rotate(-45 22 18)"
          fill="#f59e0b"
          stroke="#d97706"
          strokeWidth="1"
        />
        <path
          d="M29.5 12.5l2 2"
          stroke="#d97706"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

function ChevronRight() {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: '50%',
      border: '1px solid #e5e7eb',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M4.5 2.5L7.5 6l-3 3.5" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  )
}

interface OptionCardProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
}

function OptionCard({ icon, label, onClick }: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: '40px 32px 28px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 20,
        transition: 'box-shadow 0.15s, border-color 0.15s',
        minWidth: 0,
      }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
        ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#93c5fd'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLButtonElement).style.boxShadow = 'none'
        ;(e.currentTarget as HTMLButtonElement).style.borderColor = '#e5e7eb'
      }}
    >
      {icon}
      <Text variant="headingMd" as="p">{label}</Text>
      <ChevronRight />
    </button>
  )
}

export default function SelectOption() {
  const navigate = useNavigate()

  return (
    <AppShell>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: 'calc(100vh - 120px)',
      }}>
        <div style={{
          background: 'white',
          borderRadius: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 0 0 1px rgba(0,0,0,0.04)',
          padding: '48px 48px 56px',
          width: '100%',
          maxWidth: 700,
        }}>
          {/* Title */}
          <div style={{ marginBottom: 40 }}>
            <InlineStack gap="200" blockAlign="center">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M11 4L6 9l5 5" stroke="#374151" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <Text variant="headingXl" as="h1">Select an Option</Text>
            </InlineStack>
          </div>

          {/* Cards */}
          <div style={{ display: 'flex', gap: 24 }}>
            <OptionCard
              icon={<IconPrototypeA />}
              label="Prototype A"
              onClick={() => navigate('/prototype-a')}
            />
            <OptionCard
              icon={<IconPrototypeB />}
              label="Prototype B"
              onClick={() => navigate('/prototype-b')}
            />
          </div>
        </div>
      </div>
    </AppShell>
  )
}
