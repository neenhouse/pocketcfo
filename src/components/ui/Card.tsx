import { type ReactNode } from 'react'
import './Card.css'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  glow?: boolean
}

export default function Card({ children, className = '', hover = false, glow = false }: CardProps) {
  return (
    <div className={`card ${hover ? 'card-hover' : ''} ${glow ? 'card-glow' : ''} ${className}`}>
      {children}
    </div>
  )
}
