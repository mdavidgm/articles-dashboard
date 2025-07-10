import { useEffect } from 'react';
import { useAppStore } from '../../store';
import ArticleCard from '../article-card/ArticleCard';
import type { ArticleCard as ArticleCardProps } from '../../store/types';

import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  List,
  ListItem,
  Divider,
} from '@mui/material';

const ArticlesList = () => {
  const articlesData = useAppStore((state) => state.articlesData);
  const articlesError = useAppStore((state) => state.articlesError);
  const fetchArticles = useAppStore((state) => state.fetchArticles);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const commonMinHeight = '200px';

  if (articlesError) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={commonMinHeight}
        role="alert"
        sx={{ p: 2 }}
      >
        <Alert severity="error">{articlesError}</Alert>
      </Box>
    );
  }

  if (articlesData && articlesData.length > 0) {
    return (
      <Box sx={{ p: 2, minHeight: commonMinHeight, backgroundColor: '#F5F5F5' }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Browse Article
        </Typography>
        <List>
          {articlesData.map((article: ArticleCardProps) => (
            <div key={article.id}>
              <ListItem alignItems="flex-start" sx={{ p: 0, my: 1 }}>
                <ArticleCard {...article} />
              </ListItem>
            </div>
          ))}
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
      <CircularProgress aria-label="Loading articles" />
    </Box>
  );
};

export default ArticlesList;