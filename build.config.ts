import type { BuildConfig } from 'unbuild';

const config: BuildConfig = {
  entries: ['./src/index'],
  declaration: true,
  rollup: {
    emitCJS: true,
  },
};

export default config;
