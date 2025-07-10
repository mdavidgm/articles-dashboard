import HighlightSection from '../components/highlight-section/HighlightSection';

import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';

function Dashboard() {
  return (
    <>
      <AppBar position="static" color="primary" sx={{ mb: 4 }}>
        <Toolbar>
          <DashboardIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Articles Dashboard
          </Typography>

          <Typography variant="subtitle1" component="div">
            Your Daily Dose of Insights!
          </Typography>
        </Toolbar>
      </AppBar>

      <HighlightSection />
    </>
  );
}

export default Dashboard;