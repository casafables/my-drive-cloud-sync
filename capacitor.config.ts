
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ragastudios.mypersonaldrive',
  appName: 'My Personal Drive',
  webDir: 'dist',
  server: {
    url: 'https://763ddfe2-66e6-46c3-ba22-293d235075c1.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: null,
      keystoreAlias: null,
      keystorePassword: null,
      keystoreAliasPassword: null,
      signingType: null,
    }
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: "#FFFFFF",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: true,
      androidSpinnerStyle: "large",
      spinnerColor: "#4285f4",
      splashFullScreen: true,
      splashImmersive: true,
    },
  },
};

export default config;
