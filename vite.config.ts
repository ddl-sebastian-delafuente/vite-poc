import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

console.log('seba');

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/ui",
  define: {
    process: {
      env: {}
    },
    global: {
      NODE_ENV: "development"
    }
  },
  resolve: {
    alias: {
      "@domino/ui": path.resolve(__dirname, "/src/ui")
    }
  }
})
