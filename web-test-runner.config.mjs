import { visualRegressionPlugin } from '@web/test-runner-visual-regression/plugin';
import { esbuildPlugin } from '@web/dev-server-esbuild';

export default {
  plugins: [
    visualRegressionPlugin({
      update: process.argv.includes('--update-visual-baseline'),
    }),
    esbuildPlugin({ ts: true })
  ],
};
