import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    environment: 'jsdom',
    clearMocks: true,
    setupFiles: './tests/setup.js',
  },
})
