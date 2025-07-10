import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import type { ArticleCard as ArticleCardProps } from '../../types';

const ArticleCard: React.FC<ArticleCardProps> = ({
  id,
  title,
  author,
  content,
  views,
  shares,
  createdAt,
  summary,
}) => {
  const titleId = `article-title-${id}`;

  return (
    <Card
      component="article"
      aria-labelledby={titleId}
      sx={{ maxWidth: 600, mb: 2 }}
    >
      <CardContent>
        <Typography variant="h5" component="h2" id={titleId}>
          {title}
        </Typography>

        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          By: {author}
        </Typography>

        <Typography variant="body2" paragraph>
          {content}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 2,
            color: 'text.secondary',
          }}
        >
          <Typography variant="caption">Views: {views}</Typography>
          <Typography variant="caption">Shares: {shares}</Typography>
          <Typography variant="caption" component="time" dateTime={createdAt.toISOString()}>
            {createdAt.toLocaleDateString()}
          </Typography>
        </Box>

        {summary && (
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
            <Typography variant="h6" component="h3">
              Summary
            </Typography>
            <Typography variant="body2" paragraph>
              {summary}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default ArticleCard;