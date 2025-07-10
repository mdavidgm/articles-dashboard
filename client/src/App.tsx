import Dashboard from './pages/Dashboard';

function App() {

  /*
    This is the main component of the application.
    It does not contain any state or props either logic.
    So, it does not need to be added to coverage report or tests.
    Anyway, it is tested in e2e tests.
  */
  return (
    <Dashboard />
  )
}

export default App
