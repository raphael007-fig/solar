import { useNavigate } from 'react-router-dom'
import { Button, Text, BlockStack } from '@shopify/polaris'
import AppShell from '../../components/AppShell'

export default function PrototypeA() {
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
          padding: 48,
          width: '100%',
          maxWidth: 480,
          textAlign: 'center',
        }}>
          <BlockStack gap="400" inlineAlign="center">
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: '#dbeafe',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto',
            }}>
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                <circle cx="15" cy="15" r="9" stroke="#3b82f6" strokeWidth="2.5" fill="none"/>
                <circle cx="15" cy="15" r="3.5" fill="#3b82f6" opacity="0.4"/>
                <circle cx="15" cy="15" r="2" fill="#3b82f6"/>
                <path d="M21.5 21.5L29 29" stroke="#b45309" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </div>

            <Text variant="headingLg" as="h1">Prototype A</Text>
            <Text as="p" tone="subdued" variant="bodyMd">
              This prototype is coming soon. Share the Figma designs to get started.
            </Text>

            <Button onClick={() => navigate('/')}>← Back to Select Option</Button>
          </BlockStack>
        </div>
      </div>
    </AppShell>
  )
}
