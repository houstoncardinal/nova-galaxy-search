import React, { useEffect, useState } from 'react'

interface ParticleProps {
  delay?: number
  size?: number
  color?: string
  speed?: number
}

const Particle: React.FC<ParticleProps> = ({ 
  delay = 0, 
  size = 2, 
  color = 'primary',
  speed = 15 
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setPosition({
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + 50
    })
  }, [])

  return (
    <div
      className={`fixed pointer-events-none z-0 bg-${color} rounded-full opacity-60`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left: `${position.x}px`,
        top: `${position.y}px`,
        animationDelay: `${delay}s`,
        animationDuration: `${speed}s`,
      }}
    />
  )
}

export const ParticleField: React.FC = () => {
  const particles = Array.from({ length: 30 }, (_, i) => (
    <Particle
      key={i}
      delay={i * 0.5}
      size={Math.random() * 3 + 1}
      speed={Math.random() * 10 + 10}
    />
  ))

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles}
    </div>
  )
}

export const ScanLine: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-10 overflow-hidden">
      <div 
        className="absolute top-0 w-1 h-full bg-gradient-to-b from-transparent via-primary to-transparent opacity-30 animate-scan-line"
        style={{ animationDelay: '2s' }}
      />
    </div>
  )
}

export const HologramEffect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative animate-hologram">
      {children}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-scan-line pointer-events-none" />
    </div>
  )
}