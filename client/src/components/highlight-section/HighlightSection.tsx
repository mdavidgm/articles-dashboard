import { useEffect } from 'react';
import { useAppStore } from '../../store';

import {
  Box,
  CircularProgress,
  Typography,
  List,
  ListItem,
  ListItemText,
  Alert,
} from '@mui/material';

const HighlightSection = () => {
  const highlightsError = useAppStore((state) => state.highlightsError);
  const fetchHighlights = useAppStore((state) => state.fetchHighlights);
  const highlightsData = useAppStore((state) => state.highlightsData);

  useEffect(() => {
    fetchHighlights();
  }, [fetchHighlights]);

  const commonMinHeight = '200px';

  if (highlightsError) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={commonMinHeight}
        role="alert"
        sx={{ p: 2 }}
      >
        <Alert severity="error">{highlightsError}</Alert>
      </Box>
    );
  }

  if (highlightsData) {
    return (
      <Box sx={{ p: 2, minHeight: commonMinHeight }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Highlights Section
        </Typography>
        <List>
          <ListItem disablePadding>
            <ListItemText
              primary={<Typography variant="h6" component="h3">{highlightsData.mostViewed.title}</Typography>}
              secondary={`Author: ${highlightsData.mostViewed.author}`}
            />
          </ListItem>
          <ListItem disablePadding>
            <ListItemText
              primary={<Typography variant="h6" component="h3">{highlightsData.mostShared.title}</Typography>}
              secondary={`Author: ${highlightsData.mostShared.author}`}
            />
          </ListItem>
        </List>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight={commonMinHeight}
      aria-live="polite"
      aria-busy="true"
      sx={{ p: 2 }}
    >
      <CircularProgress aria-label="Loading highlights" />
    </Box>
  );
};

export default HighlightSection;