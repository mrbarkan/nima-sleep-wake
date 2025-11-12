import type { CapacitorConfig } from '@capacitor/core';

const config: CapacitorConfig = {
  appId: 'com.mrbarkan.nima',
  appName: 'nima-sleep-wake',
  webDir: 'dist',
  server: {
    url: 'https://571d87a9-4b3d-4271-a838-d57e4af04a18.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav",
    },
  },
};

export default config;
