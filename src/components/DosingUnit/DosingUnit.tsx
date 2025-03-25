
export function DosingUnit ()  {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 250">
      {/* Definimos colores y estilos */}
      <defs>
        <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" style={{stopColor: "#888888", stopOpacity: 1}} />
          <stop offset="50%" style={{stopColor: "#cccccc", stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: "#888888", stopOpacity: 1}} />
        </linearGradient>
      </defs>
      
      {/* Rectángulo superior (cuerpo principal del dosificador) */}
      <rect x="50" y="30" width="100" height="120" fill="url(#metalGradient)" stroke="#333333" strokeWidth="3" />
      
      {/* Trapecio inferior (salida del dosificador) - ajustado para evitar superposición */}
      <polygon points="53,150 147,150 125,200 75,200" fill="url(#metalGradient)" stroke="#333333" strokeWidth="3" />
      
      {/* Abertura rectangular con bordes redondeados en el cuerpo */}
      <rect x="85" y="60" width="30" height="70" fill="white" stroke="#333333" strokeWidth="1" rx="10" ry="10" />
      
      {/* Etiqueta B2 */}
      <text x="100" y="185" fontFamily="Arial" fontSize="20" fontWeight="bold" textAnchor="middle" fill="#641E16">B2</text>
    </svg>
  );
};
