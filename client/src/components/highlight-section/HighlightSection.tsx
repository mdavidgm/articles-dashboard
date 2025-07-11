import { useEffect, useRef } from 'react';
import { useAppStore } from '../../store';
import type { ArticleCard } from '../../store/types';

import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Paper,
  Chip,
} from '@mui/material';

import VisibilityIcon from '@mui/icons-material/Visibility';
import ShareIcon from '@mui/icons-material/Share';
import { buildQueryParams } from '../../utils/buildQueryParams';

const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const HighlightSection = () => {
  const highlightsError = useAppStore((state) => state.highlightsError);
  const fetchHighlights = useAppStore((state) => state.fetchHighlights);
  const highlightsData = useAppStore((state) => state.highlightsData);
  const authorFilter = useAppStore((state) => state.authorFilter);

  const initialLoadFromURL = useRef(false);

  useEffect(() => {
    const handleUrlLoadAndPopstate = () => {
      if (window.location.search) {
        initialLoadFromURL.current = true;
        const queryParams = buildQueryParams(window.location.search);
        fetchHighlights(queryParams.author);
      }
    };
    window.addEventListener('popstate', handleUrlLoadAndPopstate);
    handleUrlLoadAndPopstate();

    return () => {
      window.removeEventListener('popstate', handleUrlLoadAndPopstate);
    };
  }, []);


  useEffect(() => {
    if (initialLoadFromURL.current) {
      initialLoadFromURL.current = false;
      return;
    }
      fetchHighlights(authorFilter);
  }, [fetchHighlights, authorFilter]);


  if (highlightsError) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ p: 2 }}
      >
        <Alert severity="error">{highlightsError}</Alert>
      </Box>
    );
  }

  if (highlightsData) {
    const renderCardContent = (article: ArticleCard, type: 'viewed' | 'shared') => {
      const isViewed = type === 'viewed';
      const primaryMetric = isViewed ? article.views : article.shares;
      const secondaryMetric = isViewed ? article.shares : article.views;

      return (
        <Paper
          elevation={3}
          sx={{
            flex: 1,
            flexGrow: 1,
            padding: '20px',
            borderRadius: '10px',
            backgroundColor: '#fefede',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            height: '100%',
          }}
        >
          <Box mb={2}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Chip
                icon={isViewed ? <VisibilityIcon /> : <ShareIcon />}
                label={isViewed ? 'Most Viewed' : 'Most Shared'}
                color={isViewed ? 'primary' : 'secondary'}
                size="small"
              />
              <Box display="flex" alignItems="baseline" gap={1}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    color: isViewed ? 'primary.main' : 'secondary.main',
                  }}
                >
                  {isViewed ? <VisibilityIcon fontSize="small" sx={{ mr: 0.5 }} /> : <ShareIcon fontSize="small" sx={{ mr: 0.5 }} />}
                  {primaryMetric.toLocaleString()}
                </Typography>
                <Typography variant="caption" color="text.disabled" sx={{ display: 'flex', alignItems: 'center' }}>
                  {isViewed ? <ShareIcon fontSize="small" sx={{ mr: 0.5 }} /> : <VisibilityIcon fontSize="small" sx={{ mr: 0.5 }} />}
                  {secondaryMetric.toLocaleString()}
                </Typography>
              </Box>
            </Box>

            <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
              {article.title}
            </Typography>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Typography variant="body2" color="text.secondary">
                By {article.author}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • {formatDate(article.createdAt)}
              </Typography>
            </Box>
          </Box>
        </Paper>
      );
    };

    return (
      <Box
        sx={{
          padding: '5px',
          backgroundColor: '#FFD700',
          boxShadow: '0px 0px 15px 13px rgba(255, 215, 0, 0.4)',
          borderRadius: '15px',
          marginBottom: '10px',
        }}
      >
        <Box
          display="flex"
          flexWrap="wrap"
          gap="5px"
          mt="2px"
          justifyContent="center"
          alignItems="stretch"
        >
          {highlightsData.mostViewed && renderCardContent(highlightsData.mostViewed, 'viewed')}
          {highlightsData.mostShared && renderCardContent(highlightsData.mostShared, 'shared')}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      aria-live="polite"
      aria-busy="true"
      sx={{ p: 2 }}
    >
      <CircularProgress aria-label="Loading highlights" sx={{ color: '#FFD700' }} />
    </Box>
  );
};

export default HighlightSection;