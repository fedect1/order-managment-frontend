'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function Silo({ fillPercentage = 100, name = "" }) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const safePercentage = Math.max(0, Math.min(100, fillPercentage));
  
  // Altura total del silo (cuerpo cilíndrico)
  const siloHeight = 160;
  const contentHeight = safePercentage * siloHeight / 105;
  
  const calculateColor = () => {
    // Verde -> Naranja -> Rojo
    if (safePercentage >= 60) {
      // Verde (60-100%)
      return "#2ECC71"; // Verde brillante
    } else if (safePercentage >= 30) {
      // Naranja (30-59%)
      return "#F39C12"; // Naranja
    } else {
      // Rojo (0-29%)
      return "#E74C3C"; // Rojo
    }
  };
  
  const fillColor = calculateColor();
  
  // Determinar colores basados en el tema
  const isDarkMode = mounted && (theme === 'dark' || resolvedTheme === 'dark');
  
  const colors = {
    // Colores para modo claro
    light: {
      metalLight: "#cccccc",
      metalDark: "#888888",
      stroke: "#333333",
      topLight: "#aaaaaa",
      topDark: "#777777",
      lines: "#555555",
      outlet: "#555555",
      supports: "#777777",
      text: "#333333"
    },
    // Colores para modo oscuro
    dark: {
      metalLight: "#444444",
      metalDark: "#222222",
      stroke: "#aaaaaa",
      topLight: "#444444",
      topDark: "#333333",
      lines: "#777777",
      outlet: "#333333",
      supports: "#555555",
      text: "#ffffff"
    }
  };
  
  // Usar los colores según el tema actual
  const currentColors = isDarkMode ? colors.dark : colors.light;
  
  // Si no está montado, no renderizar para evitar problemas de hidratación
  if (!mounted) return <div style={{ height: '280px' }} />;
  
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 280">
      <defs>
        <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor: currentColors.metalDark, stopOpacity: 1}} />
          <stop offset="50%" style={{stopColor: currentColors.metalLight, stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: currentColors.metalDark, stopOpacity: 1}} />
        </linearGradient>
        
        <linearGradient id="topGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor: currentColors.topDark, stopOpacity: 1}} />
          <stop offset="50%" style={{stopColor: currentColors.topLight, stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: currentColors.topDark, stopOpacity: 1}} />
        </linearGradient>
      </defs>
      
      {/* Techo del silo (cónico) */}
      <polygon 
        points="60,30 140,30 130,10 70,10" 
        fill="url(#topGradient)" 
        stroke={currentColors.stroke} 
        strokeWidth="2" 
      />
      
      {/* Cuerpo principal del silo (cilíndrico) */}
      <rect 
        x="40" 
        y="30" 
        width="120" 
        height={siloHeight} 
        fill="url(#metalGradient)" 
        stroke={currentColors.stroke} 
        strokeWidth="3" 
        fillOpacity="0.3" 
      />
      
      {/* Líneas horizontales en el cuerpo para dar efecto de silo */}
      <line x1="40" y1="70" x2="160" y2="70" stroke={currentColors.lines} strokeWidth="1" />
      <line x1="40" y1="110" x2="160" y2="110" stroke={currentColors.lines} strokeWidth="1" />
      <line x1="40" y1="150" x2="160" y2="150" stroke={currentColors.lines} strokeWidth="1" />
      
      {/* Base del silo (cónica) */}
      <polygon 
        points="40,190 160,190 140,230 60,230" 
        fill="url(#metalGradient)" 
        stroke={currentColors.stroke} 
        strokeWidth="3" 
        fillOpacity="0.3" 
      />
      
      {/* Salida del silo */}
      <rect 
        x="90" 
        y="230" 
        width="20" 
        height="15" 
        fill={currentColors.outlet} 
        stroke={currentColors.stroke} 
        strokeWidth="2" 
      />
      
      {/* Contenido del silo (nivel de llenado) */}
      <rect 
        x="43" 
        y={188 - contentHeight} 
        width="114" 
        height={contentHeight} 
        fill={fillColor} 
        opacity="0.8" 
      />
      
      {/* Soporte izquierdo */}
      <rect 
        x="50" 
        y="230" 
        width="10" 
        height="35" 
        fill={currentColors.supports} 
        stroke={currentColors.stroke} 
        strokeWidth="2" 
      />
      
      {/* Soporte derecho */}
      <rect 
        x="140" 
        y="230" 
        width="10" 
        height="35" 
        fill={currentColors.supports} 
        stroke={currentColors.stroke} 
        strokeWidth="2" 
      />
      
      {/* Texto con el porcentaje (centrado vertical y horizontalmente) */}
      <text 
        x="100" 
        y="215" 
        fontFamily="Arial" 
        fontSize="18" 
        fontWeight="bold" 
        textAnchor="middle" 
        dominantBaseline="middle"
        fill={currentColors.text}
      >
        {safePercentage}%
      </text>
      
      {/* Nombre del silo */}
      {name && (
        <text 
          x="100" 
          y="25" 
          fontFamily="Arial" 
          fontSize="14" 
          fontWeight="bold" 
          textAnchor="middle" 
          fill={currentColors.text}
        >
          {name}
        </text>
      )}
    </svg>
  );
}

export default Silo;