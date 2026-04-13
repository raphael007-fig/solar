interface Step {
  label: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number // 1-based
  completedSteps?: number[] // 1-based
}

export default function StepIndicator({ steps, currentStep, completedSteps = [] }: StepIndicatorProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: 0,
      padding: '16px 24px',
      background: 'white',
      borderRadius: '16px 16px 0 0',
      position: 'relative',
    }}>
      {steps.map((step, i) => {
        const num = i + 1
        const isActive = num === currentStep
        const isCompleted = completedSteps.includes(num)
        const isLast = i === steps.length - 1

        return (
          <div key={step.label} style={{
            display: 'flex',
            flex: '1 0 0',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            padding: 8,
            position: 'relative',
          }}>
            {/* Connecting line (after each step except last) */}
            {!isLast && (
              <div style={{
                position: 'absolute',
                top: 27,
                left: 'calc(50% + 18px)',
                right: 'calc(-50% + 18px)',
                height: 1,
                background: isCompleted ? 'var(--color-btn-primary)' : '#ccc',
                zIndex: 0,
              }}/>
            )}

            {/* Circle */}
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: `1px solid ${isActive ? 'var(--color-btn-primary)' : isCompleted ? 'var(--color-btn-primary)' : '#ccc'}`,
              background: isCompleted ? 'var(--color-btn-primary)' : 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 1,
              flexShrink: 0,
            }}>
              {isCompleted ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l4 4 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <span style={{
                  font: '650 13px/20px var(--font-family)',
                  color: isActive ? 'var(--color-btn-primary)' : '#616161',
                }}>
                  {num}
                </span>
              )}
            </div>

            {/* Label */}
            <span style={{
              font: '650 13px/20px var(--font-family)',
              color: 'var(--color-text-secondary)',
              textAlign: 'center',
              minWidth: '100%',
              width: 'min-content',
            }}>
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
