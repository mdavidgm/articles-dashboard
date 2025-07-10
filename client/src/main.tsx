import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

/*
  * Entry point is not required to be covered in the  coverage report
  * It renders the main App component into the root element of the HTML.
  * and it tested in e2e tests.
*/
import CssBaseline from '@mui/material/CssBaseline';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CssBaseline />
    <App />
  </StrictMode>,
);