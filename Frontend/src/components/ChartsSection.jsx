import { Grid, Paper, Typography, Box } from '@mui/material';
import Plot from 'react-plotly.js';
import { useTheme } from '@mui/material/styles';

const chartLayout = (title, theme) => ({
  title,
  paper_bgcolor: 'rgba(0,0,0,0)',
  plot_bgcolor: 'rgba(0,0,0,0)',
  font: {
    color: theme.palette.text.primary,
  },
  xaxis: {
    gridcolor: theme.palette.divider,
  },
  yaxis: {
    gridcolor: theme.palette.divider,
  },
  legend: {
    orientation: 'h',
    y: -0.3,
  }
});

function ChartsSection({ genresDistribution, yearlyDistribution }) {
  const theme = useTheme();
  if (!genresDistribution || !yearlyDistribution) return null;

  const genresData = [{
    x: Object.keys(genresDistribution),
    y: Object.values(genresDistribution),
    type: 'bar',
    marker: {
        color: theme.palette.primary.main
    }
  }];
  
  const yearlyData = [{
    x: Object.keys(yearlyDistribution),
    y: Object.values(yearlyDistribution),
    type: 'scatter',
    mode: 'lines+markers',
     marker: {
        color: theme.palette.secondary.main
    }
  }];

  return (
    <Box sx={{ my: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Plot
              data={genresData}
              layout={chartLayout('Top 15 Genres by Movie Count', theme)}
              useResizeHandler
              style={{ width: '100%', height: '400px' }}
              config={{ responsive: true }}
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Plot
              data={yearlyData}
              layout={chartLayout('Movie Releases per Year', theme)}
              useResizeHandler
              style={{ width: '100%', height: '400px' }}
              config={{ responsive: true }}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ChartsSection;