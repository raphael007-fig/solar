interface SidebarProps {
  active?: 'home' | 'health' | 'inventory' | 'performance' | 'electrification'
}

const icons = {
  home: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 10L10 3l7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 8.5V16a1 1 0 001 1h8a1 1 0 001-1V8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M8 17v-5h4v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  health: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 17s-7-4.5-7-9a4 4 0 017-2.65A4 4 0 0117 8c0 4.5-7 9-7 9z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  inventory: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="3" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="11" y="3" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="3" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      <rect x="11" y="11" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  ),
  performance: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 15l4-5 3 3 4-6 3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  electrification: (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M12 2L6 11h5l-1 7 7-10h-5l1-6z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
}

export default function Sidebar({ active = 'inventory' }: SidebarProps) {
  const navItems = [
    { key: 'home', label: 'Home' },
    { key: 'health', label: 'Health Status' },
    { key: 'inventory', label: 'Inventory' },
    { key: 'performance', label: 'Performance' },
    { key: 'electrification', label: 'Electrification' },
  ] as const

  return (
    <aside style={{
      position: 'fixed',
      top: 56,
      left: 0,
      width: 56,
      bottom: 0,
      background: 'var(--color-bg)',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: 8,
      zIndex: 100,
    }}>
      {navItems.map(({ key, label }) => (
        <div key={key} title={label} style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: 28,
          marginBottom: 8,
          padding: '0 12px',
        }}>
          <button style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 32,
            height: 28,
            borderRadius: 8,
            background: active === key ? 'rgba(0,0,0,0.08)' : 'transparent',
            color: active === key ? 'var(--color-text)' : 'var(--color-text-secondary)',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => { if (active !== key) (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.04)' }}
          onMouseLeave={e => { if (active !== key) (e.currentTarget as HTMLButtonElement).style.background = 'transparent' }}
          >
            {icons[key]}
          </button>
        </div>
      ))}
    </aside>
  )
}
