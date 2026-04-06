import './ProgressBar.css'

interface ProgressBarProps {
  value: number
  max?: number
  color?: string
  label?: string
  ariaLabel?: string
  showPercent?: boolean
  height?: number
}

export default function ProgressBar({
  value,
  max = 100,
  color = 'var(--accent)',
  label,
  ariaLabel,
  showPercent = false,
  height = 8,
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div className="progress-container">
      {(label || showPercent) && (
        <div className="progress-label">
          {label && <span>{label}</span>}
          {showPercent && <span className="progress-percent">{Math.round(percent)}%</span>}
        </div>
      )}
      <div
        className="progress-track"
        style={{ height }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={ariaLabel ?? label ?? undefined}
      >
        <div className="progress-fill" style={{ width: `${percent}%`, background: color }} />
      </div>
    </div>
  )
}
