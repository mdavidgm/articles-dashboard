import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import { useState } from 'react';
import type { ArticleCard as ArticleCardProps } from '../../store/types';

import VisibilityIcon from '@mui/icons-material/Visibility';
import ShareIcon from '@mui/icons-material/Share';

const ArticleCard = (props: ArticleCardProps) => {
  const titleId = `article-title-${props.id}`;
  const [expanded, setExpanded] = useState(false);

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };

  const isContentLong = props.content.length > 150;

  const singleLineHeight = '21px';

  return (
    <Card
      component="article"
      aria-labelledby={titleId}
      sx={{
        width: '100%',
        mb: 2,
      }}
    >
      <CardContent>
        <Typography variant="h5" component="h2" id={titleId}>
          {props.title}
        </Typography>

        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          By: {props.author}
        </Typography>

        <Box sx={{ mt: 2 }}>
          <Collapse in={expanded} collapsedSize={singleLineHeight}>
            <Typography variant="body2" paragraph sx={{ mb: 0 }}>
              {props.content}
            </Typography>
          </Collapse>

          {isContentLong && (
            <Button
              size="small"
              onClick={handleToggleExpand}
              sx={{ mt: 1 }}
            >
              {expanded ? 'View Less' : 'View More'}
            </Button>
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <VisibilityIcon fontSize="small" sx={{ color: 'primary.main' }} />
            <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 'normal' }} aria-label={'Views: ' + props.views}>
              {props.views}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <ShareIcon fontSize="small" sx={{ color: 'secondary.main' }} />
            <Typography variant="caption" sx={{ color: 'secondary.main', fontWeight: 'normal' }} aria-label={'Shares: ' + props.shares}>
              {props.shares}
            </Typography>
          </Box>

          <Typography variant="caption" component="time" dateTime={new Date(props.createdAt).toLocaleDateString()} color="text.secondary">
            {new Date(props.createdAt).toLocaleDateString()}
          </Typography>
        </Box>
        {props.summary && (
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
            <Typography variant="h6" component="h3">
              Summary
            </Typography>
            <Typography variant="body2" paragraph>
              {props.summary}
            </Typography>
          </Box>
        )}

      </CardContent>
    </Card>
  );
};

export default ArticleCard;