import { ReactNode } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';

// Define a custom theme that matches our application's style
const theme = createTheme({
  palette: {
    primary: {
      main: '#2c6cb0', // --primary-main from colors.css
      light: '#4d8ecb', // --primary-light
      dark: '#1d4c82', // --primary-dark
    },
    secondary: {
      main: '#546e7a', // --secondary-main
      light: '#78909c', // --secondary-light
      dark: '#37474f', // --secondary-dark
    },
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#ffb300', // --accent-amber
    },
    success: {
      main: '#4caf50', // --accent-green
    },
    info: {
      main: '#2196f3', // --accent-blue
    },
    text: {
      primary: '#212121', // --text-primary
      secondary: '#546e7a', // --text-secondary
      disabled: '#9e9e9e', // --text-disabled
    },
    background: {
      default: '#ffffff', // --bg-default
      paper: '#f5f7fa', // --bg-paper
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          padding: '8px 16px',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}

export default ThemeProvider;
