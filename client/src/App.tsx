import Dashboard from './pages/Dashboard';
import { Container } from '@mui/material';

function App() {

  /* cite_start:
    This is the main component of the application.
    It does not contain any state or props either logic.
    So, it does not need to be added to coverage report or tests.
    Anyway, it is tested in e2e tests.
  */
  return (
    <Container
      maxWidth="lg"
      disableGutters
    >
      <Dashboard />
    </Container>
  );
}

export default App;