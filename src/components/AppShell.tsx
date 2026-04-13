import type { ReactNode } from 'react'
import TopBar from './TopBar'
import Sidebar from './Sidebar'

interface AppShellProps {
  children: ReactNode
  breadcrumbs?: string[]
}

export default function AppShell({ children, breadcrumbs }: AppShellProps) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <TopBar breadcrumbs={breadcrumbs} />
      <Sidebar />
      <main style={{
        paddingTop: 56,
        paddingLeft: 56,
        minHeight: '100vh',
      }}>
        <div style={{ padding: '16px 24px' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
