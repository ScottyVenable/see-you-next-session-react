import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tritium.seeyounextsession',
  appName: 'See You Next Session',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
