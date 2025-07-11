import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Slide from '@mui/material/Slide';
import Fade from '@mui/material/Fade';
import Collapse from '@mui/material/Collapse';
import { useState } from 'react';
import type { ArticleCard as ArticleCardProps } from '../../store/types';

import VisibilityIcon from '@mui/icons-material/Visibility';
import ShareIcon from '@mui/icons-material/Share';

import { useAppStore } from '../../store';

const ArticleCard = (props: ArticleCardProps) => {
  const titleId = `article-title-${props.id}`;
  const [expanded, setExpanded] = useState(false);

  const handleToggleExpand = () => {
    setExpanded(!expanded);
  };
  const getSummary = useAppStore((state) => state.getSummary);
  
  const handleSummarize = () => {
    getSummary(props.id);
  };

  const isContentLong = props.content.length > 150;
  const singleLineHeight = '21px';

  return (
    <Card
      component="article"
      aria-labelledby={titleId}
      sx={{
        width: '100%',
      }}
    >
      <CardContent
        sx={{
          backgroundImage: `
            linear-gradient(to right, rgba(173, 216, 230, 0.3) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(173, 216, 230, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px',
        }}
      >
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

          <Box 
            sx={{ 
              mt: 1, 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center' 
            }}
          >
            {isContentLong ? (
              <Button
                size="small"
                onClick={handleToggleExpand}
              >
                {expanded ? 'View Less' : 'View More'}
              </Button>
            ) : (
              <div />
            )}

            {!props.summary && (
              <Button
                size="small"
                onClick={handleSummarize}
              >
                Summarize
              </Button>
            )}
          </Box>
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
        <Slide direction="up" in={!!props.summary} mountOnEnter unmountOnExit>
          <Fade in={!!props.summary} timeout={500}>
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
              <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                Summary
              </Typography>
              <Typography variant="body2" paragraph>
              {props.summary?.summary}
              </Typography>
            </Box>
          </Fade>
        </Slide>
      </CardContent>
    </Card>
  );
};

export default ArticleCard;