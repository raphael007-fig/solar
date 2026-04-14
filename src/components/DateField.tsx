import { TextField } from '@shopify/polaris'

const CalendarIcon = () => (
  <svg
    width="16" height="16" viewBox="0 0 16 16" fill="none"
    aria-hidden
    style={{ display: 'block', color: '#616161' }}
  >
    <rect x="1.75" y="3.75" width="12.5" height="10.5" rx="1.5"
      stroke="currentColor" strokeWidth="1.25" />
    <path d="M5 1.5v2.5M11 1.5v2.5"
      stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    <path d="M1.75 7h12.5" stroke="currentColor" strokeWidth="1.25" />
  </svg>
)

interface Props {
  label: string
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  helpText?: string
}

export default function DateField({
  label,
  value,
  onChange,
  disabled,
  helpText,
}: Props) {
  return (
    <TextField
      label={label}
      type="date"
      value={value}
      onChange={onChange}
      disabled={disabled}
      helpText={helpText}
      autoComplete="off"
      prefix={<CalendarIcon />}
    />
  )
}
