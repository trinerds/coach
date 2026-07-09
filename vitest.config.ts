import { defineVitestConfig } from '@nuxt/test-utils/config'
import path from 'path'
import { fileURLToPath } from 'url'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

export default defineVitestConfig({
  plugins: [
    {
      name: 'coach-wattz:mock-pg-for-tests',
      enforce: 'pre',
      resolveId(source) {
        if (source === 'pg') {
          return path.resolve(rootDir, 'tests/unit/mocks/pg.ts')
        }
      }
    }
  ],
  resolve: {
    alias: {
      '#auth': path.resolve(rootDir, './tests/unit/mocks/auth.ts'),
      pg: path.resolve(rootDir, './tests/unit/mocks/pg.ts')
    }
  },
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: [path.resolve(rootDir, './tests/unit/setup.ts')],
    coverage: {
      provider: 'v8',
      include: ['server/**', 'app/**'],
      reporter: ['text', 'json', 'html']
    }
  }
})
