// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://paperlanterns.com',
  integrations: [sitemap()],
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
    assets: '_astro',
    // Enable CSS code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Split critical CSS separately
          critical: ['src/layouts/Layout.astro']
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.css')) {
            // Add cache busting for CSS files
            return '_astro/[name].[hash][extname]';
          }
          return '_astro/[name].[hash][extname]';
        }
      }
    }
  },
  vite: {
    build: {
      // Enable CSS code splitting
      cssCodeSplit: true,
      // Optimize chunks
      rollupOptions: {
        output: {
          // Better caching for static assets
          assetFileNames: '_astro/[name].[hash][extname]'
        }
      }
    }
  }
});
