import { createTheme } from '@mui/material/styles';
import { green, blue } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: green[600],
    },
    secondary: {
      main: blue[500],
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h3: {
      fontWeight: 700,
      color: '#ffffff',
      textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          transition: '0.3s',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
          },
        },
      },
    },
  },
});

export default theme;