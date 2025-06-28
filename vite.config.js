import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- Keep this import

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- Keep the plugin here
  ],
  // This section ensures your development server is stable
  server: {
    port: 5174, // This locks the server to port 5174
    strictPort: true, // This will cause Vite to fail if the port is already in use
  },
})
