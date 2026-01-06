import { useState, useEffect, useCallback } from 'react';
import './App.css';
import { getMovies, getAnalytics, getMovieById } from './api/client';
import FiltersBar from './components/FiltersBar';
import KpiCards from './components/KpiCards';
import ChartsSection from './components/ChartsSection';
import OutliersTable from './components/OutliersTable';
import MoviesTable from './components/MoviesTable'; // New
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
} from '@mui/material';

function App() {
  const [filters, setFilters] = useState({
    genre: [],
    certificate: [],
    year: [1920, 2020],
  });
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [allMoviesForSearch, setAllMoviesForSearch] = useState([]);

  // New state variables
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [sort, setSort] = useState('outlier_score_desc');
  const [limit, setLimit] = useState(50);
  const [tab, setTab] = useState('outliers'); // 'outliers' or 'all'

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const analyticsData = await getAnalytics(filters);
      setAnalytics(analyticsData);
    } catch (err) {
      setError('Failed to fetch analytics data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    // Fetch all movies for the search autocomplete
    const fetchAllMovies = async () => {
      try {
        const movies = await getMovies({ limit: 5000 });
        setAllMoviesForSearch(movies.data);
      } catch (err) {
        console.error('Failed to fetch movie list for search:', err);
      }
    };
    fetchAllMovies();
  }, []);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleMovieSelect = async (movieId) => {
    if (!movieId) {
      setSelectedMovie(null);
      return;
    }
    try {
      // Assuming getMovieById exists in the API client
      const movie = await getMovieById(movieId);
      setSelectedMovie(movie);
    } catch (err) {
      setError('Failed to fetch movie details.');
      console.error(err);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
        IMDb Movie Dashboard
      </Typography>

      <FiltersBar
        filters={filters}
        onFilterChange={handleFilterChange}
        allMovies={allMoviesForSearch}
        onMovieSelect={handleMovieSelect}
      />

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

      {analytics && !loading && (
        <>
          <KpiCards kpis={analytics.kpis} />

          {selectedMovie && (
            <Card sx={{ my: 4, p: 2 }}>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  Movie Details: {selectedMovie.Series_Title}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography><strong>Year:</strong> {selectedMovie.Released_Year}</Typography>
                    <Typography><strong>Rating:</strong> {selectedMovie.IMDB_Rating}</Typography>
                    <Typography><strong>Votes:</strong> {selectedMovie.No_of_Votes?.toLocaleString()}</Typography>
                    <Typography><strong>Genre:</strong> {selectedMovie.Genre}</Typography>
                    <Typography><strong>Certificate:</strong> {selectedMovie.Certificate}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography><strong>Runtime:</strong> {selectedMovie.Runtime}</Typography>
                    <Typography><strong>Meta Score:</strong> {selectedMovie.Meta_score}</Typography>
                    <Typography><strong>Director:</strong> {selectedMovie.Director}</Typography>
                    <Typography><strong>Stars:</strong> {selectedMovie.Star1}, {selectedMovie.Star2}, {selectedMovie.Star3}, {selectedMovie.Star4}</Typography>
                    <Typography><strong>Gross:</strong> {selectedMovie.Gross}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                     <Typography><strong>Overview:</strong> {selectedMovie.Overview}</Typography>
                  </Grid>
                </Grid>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => setSelectedMovie(null)}>Clear</Button>
              </CardActions>
            </Card>
          )}

          <ChartsSection
            genresDistribution={analytics.genres_distribution}
            yearlyDistribution={analytics.yearly_distribution}
          />

          <Box sx={{ my: 4 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Button onClick={() => setTab('outliers')} variant={tab === 'outliers' ? 'contained' : 'text'}>
                Outliers
              </Button>
              <Button onClick={() => setTab('all')} variant={tab === 'all' ? 'contained' : 'text'}>
                All Movies (Filtered)
              </Button>
            </Box>

            {tab === 'outliers' ? (
              <OutliersTable
                filters={filters}
                sort={sort}
                onSortChange={setSort}
                limit={limit}
                onLimitChange={setLimit}
                onRowClick={handleMovieSelect}
              />
            ) : (
              <MoviesTable
                filters={filters}
                sort={sort}
                onSortChange={setSort}
                limit={limit}
                onLimitChange={setLimit}
                onRowClick={handleMovieSelect}
              />
            )}
          </Box>
        </>
      )}
    </Container>
  );
}

export default App;
