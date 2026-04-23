/// <reference types='vitest' />
import * as path from 'path';
import dts from 'vite-plugin-dts';
import {externalizeDeps} from 'vite-plugin-externalize-deps';
import {defineConfig} from 'vitest/config';

// These options were migrated by @nx/vite:convert-to-inferred from the project.json file.
const configValues = {default: {}};

// Determine the correct configValue to use based on the configuration
const nxConfiguration = process.env['NX_TASK_TARGET_CONFIGURATION'] ?? 'default';

const options = {
  ...configValues.default,
  ...(configValues[nxConfiguration as keyof typeof configValues] ?? {}),
};

export default defineConfig({
  root: __dirname,
  test: {
    watch: false,
    setupFiles: ['./setupTests.ts'],
    globals: true,
    environment: 'node',
    isolate: false,
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      enabled: true,
      reportsDirectory: '../../../coverage/libs/util/common',
      provider: 'v8',
      reporter: ['lcov'],
    },
  },
  cacheDir: '../../../node_modules/.vite/util',

  plugins: [
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
      name: 'util',
      fileName: 'index',
      // Change this to the formats you want to support.
      // Don't forget to update your package.json as well.
      formats: ['es'],
    },
  },
});
