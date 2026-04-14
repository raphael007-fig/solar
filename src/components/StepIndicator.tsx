import { useState } from 'react'

interface Step {
  label: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number   // 1-based
  completedSteps?: number[]  // 1-based
  onStepClick?: (step: number) => void
}

export default function StepIndicator({
  steps,
  currentStep,
  completedSteps = [],
  onStepClick,
}: StepIndicatorProps) {
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)

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
        const isActive    = num === currentStep
        const isCompleted = completedSteps.includes(num)
        const isLast      = i === steps.length - 1
        const isHovered   = hoveredStep === num
        const isClickable = isCompleted && !!onStepClick

        return (
          <div
            key={step.label}
            style={{
              display: 'flex',
              flex: '1 0 0',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
              padding: 8,
              position: 'relative',
              cursor: isClickable ? 'pointer' : 'default',
            }}
            onClick={() => isClickable && onStepClick(num)}
            onMouseEnter={() => isClickable && setHoveredStep(num)}
            onMouseLeave={() => setHoveredStep(null)}
          >
            {/* Connecting line */}
            {!isLast && (
              <div style={{
                position: 'absolute',
                top: 27,
                left: 'calc(50% + 18px)',
                right: 'calc(-50% + 18px)',
                height: 1,
                background: isCompleted ? '#3b5fe2' : '#ccc',
                zIndex: 0,
              }}/>
            )}

            {/* Circle */}
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: `2px solid ${isActive ? '#3b5fe2' : isCompleted ? '#3b5fe2' : '#ccc'}`,
              background: isCompleted
                ? (isHovered ? '#2d4fcf' : '#3b5fe2')
                : 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 1,
              flexShrink: 0,
              transition: 'background 0.15s, border-color 0.15s',
              boxShadow: isHovered && isCompleted ? '0 0 0 3px rgba(59,95,226,0.2)' : 'none',
            }}>
              {isCompleted ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8l4 4 6-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <span style={{
                  font: '650 13px/20px var(--font-family)',
                  color: isActive ? '#3b5fe2' : '#616161',
                }}>
                  {num}
                </span>
              )}
            </div>

            {/* Label */}
            <span style={{
              font: isActive || isCompleted
                ? '650 13px/20px var(--font-family)'
                : '450 13px/20px var(--font-family)',
              color: isActive
                ? '#3b5fe2'
                : isCompleted
                  ? '#374151'
                  : '#9ca3af',
              textAlign: 'center',
              minWidth: '100%',
              width: 'min-content',
              transition: 'color 0.15s',
            }}>
              {step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
