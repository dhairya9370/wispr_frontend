import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import "./index.css";
import { SocketProvider } from './SocketProvider.jsx';
import SnackbarProvider from './SnackbarProvider.jsx';
import { ThemeProviderCustom } from "./ThemeContext.jsx";
// import { ThemeProvider } from '@mui/material/styles';
// import theme from './theme';

createRoot(document.getElementById('root')).render(
  // <ThemeProvider theme={theme}>
  <ThemeProviderCustom>
    <SnackbarProvider>
      <App />
    </SnackbarProvider>
  </ThemeProviderCustom>
  // </ThemeProvider>
)
