import { federation } from '@module-federation/vite';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tsconfigPaths(),
    federation({
      name: 'sagun-mouldify', //replace it with your app name
      filename: 'remoteEntry.js',
      exposes: {
        './routesConfig': './src/routes/routesConfig.tsx', //expose the route to integrate with the platform app
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
        'react-router-dom': { singleton: true },
      },
      shareStrategy: 'loaded-first',
    }),
  ],
  build: {
    target: 'esnext',
    outDir: './dist',
  },
  // Define your port for local development and make sure the backend allows this port and it is not used by other apps
  server: {
    port: 9000,
    strictPort: true,
  },
  preview: {
    port: 9000,
  },
});
