import type { Config } from 'tailwindcss';
import baseConfig from '@chaufher/ui/tailwind.config';

const config: Config = {
  presets: [baseConfig],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/**/*.{js,ts,jsx,tsx}',
  ],
};

export default config;
