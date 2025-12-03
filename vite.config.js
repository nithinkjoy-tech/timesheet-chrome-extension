import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path'
import { copyFileSync } from 'fs'

export default defineConfig({
    plugins: [
        svelte(),
        {
            name: 'copy-extension-files',
            closeBundle() {
                const outDir = 'dist/timesheet-chrome-extension'

                // Copy manifest
                copyFileSync('manifest.json', `${outDir}/manifest.json`)

                // Copy extension scripts (as-is, no bundling needed)
                copyFileSync('src/background.js', `${outDir}/background.js`)
                copyFileSync('src/content.js', `${outDir}/content.js`)

                console.log('✓ Extension files copied successfully')
            }
        }
    ],
    build: {
        outDir: 'dist/timesheet-chrome-extension',
        rollupOptions: {
            input: {
                popup: resolve(__dirname, 'index.html')
            }
        }
    }
})
