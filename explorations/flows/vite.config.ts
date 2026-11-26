import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

// Flow explorations (email login, OTP sign-in, shopping journey) built from the
// design system in ../../src. Not part of Storybook.
//   Dev:   npm run explorations          → http://localhost:5174
//   Build: npm run build-explorations    → storybook-static/explorations/ (deployed with Storybook)
const here = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: here,
  base: './',
  plugins: [react()],
  resolve: { alias: { '@ds': path.resolve(here, '../../src') } },
  server: { port: 5174 },
  build: { outDir: path.resolve(here, '../../storybook-static/explorations'), emptyOutDir: true },
});
