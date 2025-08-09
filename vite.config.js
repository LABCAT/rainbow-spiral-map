import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  base: '/rainbow-spiral-map/',
  plugins: [
    viteStaticCopy({
      targets: [
        { src: 'leaflet-hash.js', dest: '.' },
        { src: 'grayglyph.js', dest: '.' },
        { src: 'sketch.js', dest: '.' },
        { src: 'map.js', dest: '.' }
      ]
    })
  ]
})