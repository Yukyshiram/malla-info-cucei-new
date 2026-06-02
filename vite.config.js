import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/leo': {
        target: 'https://leo.sklconnect.com',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, _req, _res) => {
            proxyReq.setHeader('origin', 'https://leo.sklconnect.com');
            proxyReq.setHeader('referer', 'https://leo.sklconnect.com/examples');
            console.log('Proxying request to:', proxyReq.path, 'with headers:', proxyReq.getHeaders());
          });
        }
      }
    }
  }
})