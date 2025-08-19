import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 3000,
    open: true,
    host: true, // 네트워크 접근 허용
    // SPA 라우팅을 위한 히스토리 API fallback 설정
    historyApiFallback: true,
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
  },
  // 빌드 최적화 및 에셋 경로 설정
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        // 청크 파일 이름 패턴을 더 안정적으로 설정
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  }
}) 