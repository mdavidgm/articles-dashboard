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
} from '@mui/material';

const ArticlesList = () => {
  const articlesData = useAppStore((state) => state.articlesData);
  const articlesError = useAppStore((state) => state.articlesError);
  const articlesIsLoading = useAppStore((state) => state.articlesIsLoading);

  const commonMinHeight = '200px';

  if (articlesIsLoading) {
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
        <Typography variant="h6" sx={{ mt: 2 }}>Loading articles...</Typography>
      </Box>
    );
  }

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
      justifyContent="center"
      alignItems="center"
      minHeight={commonMinHeight}
      sx={{ p: 2 }}
    >
      <Typography variant="body1" color="text.secondary">
        No articles available.
      </Typography>
    </Box>
  );
};

export default ArticlesList;