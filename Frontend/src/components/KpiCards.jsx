import { Grid, Card, CardContent, Typography, Box } from '@mui/material';

const kpiMeta = {
  total_movies: { label: "Total Movies" },
  avg_rating: { label: "Average Rating", format: (val) => val.toFixed(2) },
  total_votes: { label: "Total Votes", format: (val) => val.toLocaleString() },
  total_gross: { label: "Total Gross", format: (val) => `$${(val / 1e9).toFixed(2)}B` },
};

function KpiCards({ kpis }) {
  if (!kpis) return null;

  return (
    <Box sx={{ my: 4 }}>
      <Grid container spacing={4}>
        {Object.entries(kpis).map(([key, value]) => {
          const meta = kpiMeta[key];
          if (!meta) return null;

          return (
            <Grid item xs={12} sm={6} md={3} key={key}>
              <Card
                sx={{
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: (theme) => `0 12px 24px 0 ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)'}`,
                  },
                }}
              >
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    {meta.label}
                  </Typography>
                  <Typography variant="h4" component="div">
                    {meta.format ? meta.format(value) : value.toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default KpiCards;