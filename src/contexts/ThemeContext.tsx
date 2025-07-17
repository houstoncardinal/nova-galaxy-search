import React, { createContext, useContext, useState, useEffect } from 'react'

export type NovaTheme = 'cosmic' | 'matrix' | 'neon' | 'solar'

interface ThemeContextType {
  theme: NovaTheme
  setTheme: (theme: NovaTheme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<NovaTheme>('cosmic')

  useEffect(() => {
    const savedTheme = localStorage.getItem('nova-theme') as NovaTheme
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('nova-theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}