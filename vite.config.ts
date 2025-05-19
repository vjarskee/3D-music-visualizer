import { existsSync } from 'fs'
import { copyFile, mkdir, rm } from 'fs/promises'
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig(({ command }) => ({
  resolve: {
    alias: {
      '@': resolve(process.cwd(), 'src')
    },
    extensions: ['.ts', '.json']
  },

  base: '',
  publicDir: resolve(process.cwd(), 'public'),
  root: resolve(process.cwd(), 'src'),

  build: {
    outDir: resolve(process.cwd(), 'dist'),
    emptyOutDir: false
  },

  plugins: [
    {
      name: 'beforeBuild',
      async buildStart() {
        if (command == 'serve') return

        if (existsSync(resolve(process.cwd(), 'dist'))) await rm(resolve(process.cwd(), 'dist'), { recursive: true })
        await mkdir(resolve(process.cwd(), 'dist'))
      }
    },
    {
      name: 'afterBuild',
      async buildEnd() {
        if (command == 'serve') return

        await mkdir(resolve(process.cwd(), 'dist', 'assets'))

        await copyFile(
          resolve(process.cwd(), 'src', 'assets', 'sky.png'),
          resolve(process.cwd(), 'dist', 'assets', 'sky.png')
        )

        await copyFile(
          resolve(process.cwd(), 'src', 'assets', 'text.obj'),
          resolve(process.cwd(), 'dist', 'assets', 'text.obj')
        )
      }
    }
  ]
}))
