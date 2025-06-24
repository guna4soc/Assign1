// TypeScript module augmentation for MUI theme to add custom palette colors
import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    navbar: {
      main: string;
    };
    icon: {
      main: string;
    };
  }
  interface PaletteOptions {
    navbar?: {
      main: string;
    };
    icon?: {
      main: string;
    };
  }
}
