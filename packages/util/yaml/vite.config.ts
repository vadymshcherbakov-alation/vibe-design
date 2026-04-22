/// <reference types='vitest' />

import {nxCopyAssetsPlugin} from '@nx/vite/plugins/nx-copy-assets.plugin';
import * as path from 'path';
import dts from 'vite-plugin-dts';
import {externalizeDeps} from 'vite-plugin-externalize-deps';
import {defineConfig} from 'vitest/config';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../../node_modules/.vite/libs/util/yaml',
  plugins: [
    nxCopyAssetsPlugin(['*.md']),
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
    emptyOutDir: true,
    reportCompressedSize: true,
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    lib: {
      // Could also be a dictionary or array of multiple entry points.
      entry: 'src/index.ts',
      name: 'yaml',
      fileName: 'index',
      // Change this to the formats you want to support.
      // Don't forget to update your package.json as well.
      formats: ['es'],
    },
  },
  test: {
    setupFiles: ['./setupTests.ts'],
    watch: false,
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      enabled: true,
      reporter: ['lcov'],
      reportsDirectory: '../../../coverage/libs/util/yaml',
      provider: 'v8',
    },
  },
});
