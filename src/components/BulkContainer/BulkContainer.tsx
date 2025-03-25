'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

// Definir tipos para los colores
type ColorOption = 'blue' | 'green' | 'gray' | 'yellow' | 'red';

type ColorSet = {
  light: string;
  dark: string;
  veryDark: string;
};

type ColorMap = {
  [key in ColorOption]: ColorSet;
};

export function BulkContainer({ 
  fillPercentage = 100, 
  name = "",
  color = "blue" as ColorOption
}) {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Evitar problemas de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const safePercentage = Math.max(0, Math.min(100, fillPercentage));
  
  // Altura total del contenedor
  const containerHeight = 200;

  
  // Determinar colores basados en el nivel de llenado
  const calculateFillColor = () => {
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
  
  // Determinar colores basados en el tema y el color proporcionado
  const isDarkMode = mounted && (theme === 'dark' || resolvedTheme === 'dark');
  
  // Mapa de colores base
  const colorMap: ColorMap = {
    blue: {
      light: "#4682B4", // Azul acero
      dark: "#1E5184",  // Azul oscuro
      veryDark: "#0A2F5C" // Azul muy oscuro
    },
    green: {
      light: "#4CAF50", // Verde
      dark: "#2E7D32",  // Verde oscuro
      veryDark: "#1B5E20" // Verde muy oscuro
    },
    gray: {
      light: "#A0A0A0", // Gris
      dark: "#707070",  // Gris oscuro
      veryDark: "#505050" // Gris muy oscuro
    },
    yellow: {
      light: "#FFC107", // Amarillo
      dark: "#FFA000",  // Ámbar
      veryDark: "#FF8F00" // Ámbar oscuro
    },
    red: {
      light: "#F44336", // Rojo
      dark: "#D32F2F",  // Rojo oscuro
      veryDark: "#B71C1C" // Rojo muy oscuro
    }
  };
  
  // Verificar que el color proporcionado es válido
  const validColor = (Object.keys(colorMap) as ColorOption[]).includes(color as ColorOption) 
    ? color as ColorOption 
    : 'blue';
  
  // Usar el color validado
  const selectedColor = colorMap[validColor];
  
  // Ajustar colores para modo oscuro
  const containerColor = {
    main: isDarkMode ? selectedColor.dark : selectedColor.light,
    shadow: isDarkMode ? selectedColor.veryDark : selectedColor.dark,
    highlight: isDarkMode ? selectedColor.light : "#FFFFFF",
    text: isDarkMode ? "#FFFFFF" : "#333333",
    logo: isDarkMode ? "#FFFFFF" : "#E0F0FF",
    base: isDarkMode ? "#333333" : "#555555",
    window: isDarkMode ? "#333333" : "#FFFFFF",
    windowBorder: isDarkMode ? "#555555" : "#333333"
  };
  
  // Calcular la posición Y para la parte visible del contenido en la ventana
  const windowHeight = 130;
  const windowY = 80;
  const windowContentHeight = (safePercentage * windowHeight) / 100;
  const windowContentY = windowY + windowHeight - windowContentHeight;
  
  // Si no está montado, no renderizar para evitar problemas de hidratación
  if (!mounted) return <div style={{ height: '280px' }} />;
  
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300">
      {/* Cuerpo principal del contenedor */}
      <rect 
        x="50" 
        y="40" 
        width="200" 
        height={containerHeight} 
        fill={containerColor.main} 
        stroke="#333333" 
        strokeWidth="2" 
        rx="10" 
        ry="10"
      />
      
      {/* Borde superior reforzado */}
      <rect 
        x="45" 
        y="35" 
        width="210" 
        height="15" 
        fill={containerColor.main} 
        stroke="#333333" 
        strokeWidth="2" 
        rx="5" 
        ry="5"
      />
      
      {/* Sombras laterales para dar profundidad */}
      <rect 
        x="60" 
        y="55" 
        width="20" 
        height={containerHeight - 20} 
        fill={containerColor.shadow}
        rx="2"
        ry="2"
      />
      <rect 
        x="100" 
        y="55" 
        width="20" 
        height={containerHeight - 20} 
        fill={containerColor.shadow}
        rx="2"
        ry="2"
      />
      <rect 
        x="140" 
        y="55" 
        width="20" 
        height={containerHeight - 20} 
        fill={containerColor.shadow}
        rx="2"
        ry="2"
      />
      <rect 
        x="180" 
        y="55" 
        width="20" 
        height={containerHeight - 20} 
        fill={containerColor.shadow}
        rx="2"
        ry="2"
      />
      <rect 
        x="220" 
        y="55" 
        width="20" 
        height={containerHeight - 20} 
        fill={containerColor.shadow}
        rx="2"
        ry="2"
      />
      
      {/* Base del contenedor con palet */}
      <rect 
        x="65" 
        y="240" 
        width="170" 
        height="20" 
        fill={containerColor.base} 
        strokeWidth="1"
      />
      
      {/* Aberturas para montacargas */}
      <rect 
        x="75" 
        y="245" 
        width="40" 
        height="15" 
        fill="#222222"
      />
      <rect 
        x="185" 
        y="245" 
        width="40" 
        height="15" 
        fill="#222222"
      />
      
      {/* Ventana para ver el nivel - fondo vacío */}
      <rect 
        x="125" 
        y={windowY} 
        width="50" 
        height={windowHeight} 
        fill={containerColor.window} 
        stroke={containerColor.windowBorder} 
        strokeWidth="1" 
        rx="8" 
        ry="8"
      />
      
      {/* Contenido visible en la ventana */}
      <rect 
        x="125" 
        y={windowContentY} 
        width="50" 
        height={windowContentHeight} 
        fill={calculateFillColor()} 
        rx="8" 
        ry="8"
      />
      
      {/* Bordes de la ventana (encima del contenido) */}
      <rect 
        x="125" 
        y={windowY} 
        width="50" 
        height={windowHeight} 
        fill="none" 
        stroke={containerColor.windowBorder} 
        strokeWidth="1" 
        rx="8" 
        ry="8"
      />
      
      {/* Porcentaje de llenado */}
      <rect 
        x="125" 
        y="215" 
        width="50" 
        height="22" 
        fill="#FFFFFF" 
        rx="5" 
        ry="5"
      />
      <text 
        x="150" 
        y="230" 
        fontFamily="Arial" 
        fontSize="20" 
        fontWeight="bold" 
        textAnchor="middle" 
        dominantBaseline="middle"
        fill="#333333"
      >
        {safePercentage}%
      </text>
      
      {/* Nombre del contenedor */}
      {name && (
        <text 
          x="150" 
          y="25" 
          fontFamily="Arial" 
          fontSize="22" 
          fontWeight="bold" 
          textAnchor="middle" 
          fill={containerColor.text}
        >
          {name}
        </text>
      )}
    </svg>
  );
}

export default BulkContainer;