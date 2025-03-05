"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes"

export function ThemeProvider({ 
  children, 
  ...props 
}: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)
  
  // Prevenir hidratación incorrecta
  React.useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    // Durante el SSR y antes de la hidratación completa,
    // evitamos renderizar cualquier cosa relacionada con el tema
    return <>{children}</>
  }

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}