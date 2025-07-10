import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import type { ArticleCard as ArticleCardProps } from '../../types';

const ArticleCard = (props: ArticleCardProps) => {
  const titleId = `article-title-${props.id}`;

  return (
    <Card
      component="article"
      aria-labelledby={titleId}
      sx={{ maxWidth: 600, mb: 2 }}
    >
      <CardContent>
        <Typography variant="h5" component="h2" id={titleId}>
          {props.title}
        </Typography>

        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          By: {props.author}
        </Typography>

        <Typography variant="body2" paragraph>
          {props.content}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 2,
            color: 'text.secondary',
          }}
        >
          <Typography variant="caption">Views: {props.views}</Typography>
          <Typography variant="caption">Shares: {props.shares}</Typography>
          <Typography variant="caption" component="time" dateTime={new Date(props.createdAt).toLocaleDateString()}>
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