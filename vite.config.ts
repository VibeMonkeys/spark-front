import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    host: true, // 네트워크 접근 허용
    proxy: {
      // 스프링부트 백엔드 API 프록시 설정
      '^/(auth|missions|levels|notifications|users|stories|rewards|achievements|stats|daily-quests)': {
        target: 'http://localhost:8099',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => `/api/v1${path}`
      }
    }
  },
  // 개발 환경 최적화
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react']
  }
}) 