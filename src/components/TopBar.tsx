import React from 'react'

const LOGO_URL = 'https://www.figma.com/api/mcp/asset/90d07e37-26ff-4963-b0aa-a4b6646b719d'

interface TopBarProps {
  breadcrumbs?: string[]
}

export default function TopBar({ breadcrumbs = ['Home', 'Equipment Management', 'Solar Equipment'] }: TopBarProps) {
  return (
    <header style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      height: 56,
      background: '#ffffff',
      boxShadow: '0 1px 0 rgba(26,26,26,0.07), 0 0 0 1px rgba(0,0,0,0.04)',
      display: 'flex',
      alignItems: 'center',
      zIndex: 200,
    }}>

      {/* Logo — same width as the sidebar (56px) */}
      <div style={{
        width: 56,
        height: 56,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <img
          src={LOGO_URL}
          alt="Nexleaf"
          style={{ width: 28, height: 28 }}
          onError={(e) => {
            const img = e.target as HTMLImageElement
            img.style.display = 'none'
            const next = img.nextElementSibling as HTMLElement | null
            if (next) next.style.display = 'flex'
          }}
        />
        {/* Fallback */}
        <div style={{
          display: 'none',
          width: 28, height: 28,
          borderRadius: '50%',
          background: '#40ba5b',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4 12c0 0 1-5 5-5s4 3 4 3-3-1-5 1l-2 1z" fill="white"/>
          </svg>
        </div>
      </div>

      {/* Breadcrumbs — flush after logo */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        flex: 1,
      }}>
        {breadcrumbs.map((crumb, i) => (
          <React.Fragment key={crumb}>
            <button style={{
              padding: '4px 8px',
              borderRadius: 6,
              font: '450 13px/20px var(--font-family)',
              color: 'var(--color-text)',
              background: i === breadcrumbs.length - 1 ? 'rgba(0,0,0,0.08)' : 'transparent',
              border: 'none',
              cursor: i < breadcrumbs.length - 1 ? 'pointer' : 'default',
              whiteSpace: 'nowrap',
            }}>
              {crumb}
            </button>
            {i < breadcrumbs.length - 1 && (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
                <path d="M6 4l4 4-4 4" stroke="#8a8a8a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </React.Fragment>
        ))}
      </nav>

      {/* Centre — AI Chat Bot — absolutely centred so it's always the true mid-point */}
      <div style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        pointerEvents: 'none',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 12px',
          background: 'white',
          border: '0.66px solid var(--color-border)',
          borderRadius: 8,
          width: 200,
          cursor: 'pointer',
          boxShadow: 'inset 0 -1px 0 rgba(0,0,0,0.07)',
          pointerEvents: 'all',
        }}>
          {/* AI icon — circle with gradient ring */}
          <div style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #40ba5b 0%, #005bd3 100%)',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <div style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #40ba5b 0%, #005bd3 100%)',
              }} />
            </div>
          </div>
          <span style={{ font: '450 13px/20px var(--font-family)', color: 'var(--color-text)', whiteSpace: 'nowrap' }}>
            AI Chat Bot{' '}
            <span style={{ color: '#8a8a8a' }}>(beta)</span>
          </span>
        </div>
      </div>

      {/* Right actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        paddingRight: 16,
        paddingLeft: 8,
        flexShrink: 0,
      }}>
        {/* Globe icon */}
        <button style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 32, height: 32, borderRadius: 8,
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#616161',
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.25"/>
            <ellipse cx="9" cy="9" rx="3.5" ry="7" stroke="currentColor" strokeWidth="1.25"/>
            <line x1="2" y1="9" x2="16" y2="9" stroke="currentColor" strokeWidth="1.25"/>
          </svg>
        </button>

        {/* Kenya dropdown */}
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 10px', borderRadius: 8,
          background: 'var(--color-surface)',
          boxShadow: 'inset 0 -1px 0 #b5b5b5, inset -1px 0 0 #e3e3e3, inset 1px 0 0 #e3e3e3, inset 0 1px 0 #e3e3e3',
          font: '450 13px/20px var(--font-family)',
          color: 'var(--color-text)',
          border: 'none', cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}>
          {/* Kenya flag */}
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <rect width="16" height="12" rx="2" fill="#006600"/>
            <rect y="4" width="16" height="4" fill="#cc0000"/>
            <rect y="4" width="16" height="1" fill="#000"/>
            <rect y="7" width="16" height="1" fill="#000"/>
            <path d="M8 2.5L9.5 6 8 9.5 6.5 6 8 2.5z" fill="white" stroke="white" strokeWidth="0.3"/>
          </svg>
          Kenya
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 4.5l3 3 3-3" stroke="#616161" strokeWidth="1.25" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Grid / apps icon */}
        <button style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 32, height: 32, borderRadius: 8,
          background: 'none', border: 'none', cursor: 'pointer',
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="2.5" y="2.5" width="5.5" height="5.5" rx="1.25" fill="#616161"/>
            <rect x="10" y="2.5" width="5.5" height="5.5" rx="1.25" fill="#616161"/>
            <rect x="2.5" y="10" width="5.5" height="5.5" rx="1.25" fill="#616161"/>
            <rect x="10" y="10" width="5.5" height="5.5" rx="1.25" fill="#616161"/>
          </svg>
        </button>

        {/* Bell icon */}
        <button style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 32, height: 32, borderRadius: 8,
          background: 'none', border: 'none', cursor: 'pointer',
        }}>
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M9 2.5a5 5 0 0 0-5 5c0 2.8-1.2 4.5-1.8 5h13.6c-.6-.5-1.8-2.2-1.8-5a5 5 0 0 0-5-5z" stroke="#616161" strokeWidth="1.25" fill="none"/>
            <path d="M7.5 12.5a1.5 1.5 0 0 0 3 0" stroke="#616161" strokeWidth="1.25" strokeLinecap="round" fill="none"/>
          </svg>
        </button>

        {/* Avatar */}
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: '#c084fc',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white',
          font: '650 12px/1 var(--font-family)',
          overflow: 'hidden',
          cursor: 'pointer',
          flexShrink: 0,
        }}>
          <img
            src="https://www.figma.com/api/mcp/asset/106dab57-9977-4f78-acb7-3a699c6c64c6"
            alt="User"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
          R
        </div>
      </div>
    </header>
  )
}
