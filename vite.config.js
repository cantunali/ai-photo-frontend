import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
//  server: {
//    hmr: {
//      overlay: false
//    }
//  }
// })

  base: './',  // Bu satırı ekleyin
  build: {
    outDir: 'dist'  // Build klasörünün adı
  }
})