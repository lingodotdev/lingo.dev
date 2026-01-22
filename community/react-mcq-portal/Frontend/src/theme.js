// src/theme.js
import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // A professional blue
    },
    secondary: {
      main: '#dc004e', // A contrasting pink
    },
    background: {
      default: '#f4f6f8', // A light grey background
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h2: {
      fontSize: '2.5rem',
      fontWeight: 500,
    },
  },
  // You can also customize components globally
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Buttons will use normal case, not UPPERCASE
          borderRadius: '8px',
        },
      },
    },
  },
});

export default theme;