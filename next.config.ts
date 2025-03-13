/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Optimizaciones para entorno Docker
  webpack: (config, { isServer, dev }) => {
    // Optimizaciones solo para desarrollo
    if (dev) {
      // Reducir la cantidad de información en los logs
      config.infrastructureLogging = {
        level: 'error',
      };
      
      // Optimizar para Fast Refresh en Docker
      config.watchOptions = {
        poll: 1000, // Comprobar cambios cada segundo
        aggregateTimeout: 300, // Esperar 300ms después del último cambio
        ignored: ['**/node_modules', '**/.git', '**/.next'],
      };
    }
    
    return config;
  },
  // Soportar rutas con parentesis como (routes)
  experimental: {
    appDir: true,
  },
  // Configurar el output para que sea más eficiente en Docker
  output: 'standalone',
  poweredByHeader: false,
};

module.exports = nextConfig;