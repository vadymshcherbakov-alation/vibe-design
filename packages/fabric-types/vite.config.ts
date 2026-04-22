import react from '@vitejs/plugin-react-swc';
import * as path from 'node:path';
import dts from 'vite-plugin-dts';
import {externalizeDeps} from 'vite-plugin-externalize-deps';
import svgr from 'vite-plugin-svgr';
import {defineConfig} from 'vitest/config';

// These options were migrated by @nx/vite:convert-to-inferred from the project.json file.
const configValues = {default: {}, classic: {}};

// Determine the correct configValue to use based on the configuration
const nxConfiguration = process.env['NX_TASK_TARGET_CONFIGURATION'] ?? 'default';

const options = {
  ...configValues.default,
  ...(configValues[nxConfiguration as keyof typeof configValues] ?? {}),
};

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/fabric-types',

  plugins: [
    react(),
    svgr(),
    dts({
      entryRoot: 'src',
      pathsToAliases: false,
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
    }),
    externalizeDeps({useFile: path.join(__dirname, 'package.json')}),
  ],
  // Configuration for building your library.
  // See: https://vitejs.dev/guide/build.html#library-mode
  build: {
    outDir: './dist',
    reportCompressedSize: true,
    sourcemap: true,
    commonjsOptions: {transformMixedEsModules: true},
    lib: {
      // Could also be a dictionary or array of multiple entry points.
      entry: 'src/index.ts',
      name: 'fabric-types',
      fileName: 'index',
      // Change this to the formats you want to support.
      // Don't forgot to update your package.json as well.
      formats: ['es'],
    },
  },
});
