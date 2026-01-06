I have updated all the files as requested and reverted the backend changes. Here is the full content of the updated files:

`Frontend/src/main.jsx`
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
```

`Frontend/src/App.jsx`
```javascript
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
```

`Frontend/src/api/client.js`
```javascript
const API_BASE_URL = 'http://localhost:8000/api';

const handleApiResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

const buildQueryString = (params) => {
  const query = new URLSearchParams();
  for (const key in params) {
    if (params[key] !== undefined && params[key] !== null) {
      if (Array.isArray(params[key])) {
        params[key].forEach(value => query.append(key, value));
      } else {
        query.set(key, params[key]);
      }
    }
  }
  return query.toString();
};

export const getMovies = async ({ 
  filters = {}, 
  sort = 'outlier_score_desc',
  limit = 50,
  offset = 0,
  outliersOnly = false,
} = {}) => {
  const params = {
    ...filters,
    year_min: filters.year?.[0],
    year_max: filters.year?.[1],
    sort,
    limit,
    outliers_only: outliersOnly,
  };
  delete params.year; // remove the array

  const queryString = buildQueryString(params);
  const response = await fetch(`${API_BASE_URL}/movies?${queryString}`);
  return handleApiResponse(response);
};

export const getMovieById = async (movieId) => {
  if (!movieId) throw new Error('Movie ID is required');
  const response = await fetch(`${API_BASE_URL}/movies/${movieId}`);
  return handleApiResponse(response);
};

export const getAnalytics = async (filters = {}) => {
  const params = {
    ...filters,
    year_min: filters.year?.[0],
    year_max: filters.year?.[1],
  };
  delete params.year;

  const queryString = buildQueryString(params);
  const response = await fetch(`${API_BASE_URL}/analytics?${queryString}`);
  return handleApiResponse(response);
};
```

`Frontend/src/components/FiltersBar.jsx`
```javascript
import { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Slider,
  Typography,
  Button,
  Grid,
  Paper,
  Autocomplete,
  TextField,
} from '@mui/material';

const GENRES = ["Action", "Adventure", "Sci-Fi", "Mystery", "Horror", "Thriller", "Comedy", "Drama", "Fantasy", "Animation", "Family", "Romance", "Crime", "Biography", "History", "War", "Western", "Music", "Sport", "Musical"];
const CERTIFICATES = ["A", "UA", "U", "PG-13", "R", "G"];

function FiltersBar({ filters, onFilterChange, allMovies, onMovieSelect }) {
  const [internalFilters, setInternalFilters] = useState(filters);

  useEffect(() => {
    setInternalFilters(filters);
  }, [filters]);

  const handleMultiSelectChange = (event) => {
    const { name, value } = event.target;
    setInternalFilters((prev) => ({
      ...prev,
      [name]: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleSliderChange = (event, newValue) => {
    setInternalFilters((prev) => ({ ...prev, year: newValue }));
  };

  const handleApplyFilters = () => {
    onFilterChange(internalFilters);
  };
  
  const handleMovieSearchChange = (event, newValue) => {
    if (newValue) {
      onMovieSelect(newValue.id);
    } else {
      onMovieSelect(null);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
      <Grid container spacing={3} alignItems="center">
        {/* Filter controls */}
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Genre</InputLabel>
            <Select
              multiple
              name="genre"
              value={internalFilters.genre}
              onChange={handleMultiSelectChange}
              input={<OutlinedInput label="Genre" />}
              renderValue={(selected) => selected.join(', ')}
            >
              {GENRES.map((genre) => (
                <MenuItem key={genre} value={genre}>
                  <Checkbox checked={internalFilters.genre.indexOf(genre) > -1} />
                  <ListItemText primary={genre} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Certificate</InputLabel>
            <Select
              multiple
              name="certificate"
              value={internalFilters.certificate}
              onChange={handleMultiSelectChange}
              input={<OutlinedInput label="Certificate" />}
              renderValue={(selected) => selected.join(', ')}
            >
              {CERTIFICATES.map((cert) => (
                <MenuItem key={cert} value={cert}>
                  <Checkbox checked={internalFilters.certificate.indexOf(cert) > -1} />
                  <ListItemText primary={cert} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
           <Typography gutterBottom>
            Year: {internalFilters.year[0]} - {internalFilters.year[1]}
          </Typography>
          <Slider
            value={internalFilters.year}
            onChange={handleSliderChange}
            valueLabelDisplay="auto"
            min={1920}
            max={2022}
            name="year"
          />
        </Grid>
        <Grid item xs={12} md={3} container justifyContent="flex-end">
          <Button variant="contained" onClick={handleApplyFilters}>Apply Filters</Button>
        </Grid>

        {/* Search */}
        <Grid item xs={12}>
          <Autocomplete
            options={allMovies}
            getOptionLabel={(option) => option.Series_Title || ''}
            onChange={handleMovieSearchChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search for a movie by title..."
                variant="outlined"
              />
            )}
            sx={{ mt: 2 }}
          />
        </Grid>
      </Grid>
    </Paper>
  );
}

export default FiltersBar;
```

`Frontend/src/components/KpiCards.jsx`
```javascript
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
```

`Frontend/src/components/ChartsSection.jsx`
```javascript
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
```

`Frontend/src/components/OutliersTable.jsx`
```javascript
import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
} from '@mui/material';
import { getMovies } from '../api/client';
import { downloadCsv } from '../utils/csv';

const SORT_OPTIONS = {
  outlier_score_desc: 'Outlier Score (desc)',
  votes_desc: 'Votes (desc)',
  rating_desc: 'Rating (desc)',
  year_desc: 'Year (desc)',
  title_asc: 'Title (A→Z)',
};

function OutliersTable({ filters, sort, onSortChange, limit, onLimitChange, onRowClick }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getMovies({
        filters,
        sort,
        limit,
        outliersOnly: true,
      });
      setData(result.data);
    } catch (err) {
      setError('Failed to fetch outliers. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, sort, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDownload = () => {
    const csvData = data.map(row => ({
      Title: row.Series_Title,
      Year: row.Released_Year,
      Rating: row.IMDB_Rating,
      Votes: row.No_of_Votes,
      Genre: row.Genre,
      Director: row.Director,
      OutlierScore: row.outlier_score,
      OutlierReason: row.outlier_reason,
    }));
    downloadCsv(csvData, 'outliers.csv');
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" component="h3" gutterBottom>
        Outliers
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sort}
              label="Sort by"
              onChange={(e) => onSortChange(e.target.value)}
            >
              {Object.entries(SORT_OPTIONS).map(([value, label]) => (
                <MenuItem key={value} value={value}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Limit</InputLabel>
            <Select
              value={limit}
              label="Limit"
              onChange={(e) => onLimitChange(e.target.value)}
            >
              {[50, 100, 200, 500].map(val => (
                <MenuItem key={val} value={val}>{val}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} container justifyContent="flex-end">
            <Button variant="outlined" onClick={handleDownload} disabled={loading || data.length === 0}>
                Download Outliers CSV
            </Button>
        </Grid>
      </Grid>

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      
      {!loading && !error && (
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell align="right">Year</TableCell>
                <TableCell align="right">Rating</TableCell>
                <TableCell align="right">Votes</TableCell>
                <TableCell>Genre</TableCell>
                <TableCell>Director</TableCell>
                <TableCell align="right">Outlier Score</TableCell>
                <TableCell>Outlier Reason</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  onClick={() => onRowClick(row.id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell component="th" scope="row">{row.Series_Title}</TableCell>
                  <TableCell align="right">{row.Released_Year}</TableCell>
                  <TableCell align="right">{row.IMDB_Rating}</TableCell>
                  <TableCell align="right">{row.No_of_Votes?.toLocaleString()}</TableCell>
                  <TableCell>{row.Genre}</TableCell>
                  <TableCell>{row.Director}</TableCell>
                  <TableCell align="right">{row.outlier_score?.toFixed(2)}</TableCell>
                  <TableCell>{row.outlier_reason}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}

export default OutliersTable;
```

`Frontend/src/components/MoviesTable.jsx`
```javascript
import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
} from '@mui/material';
import { getMovies } from '../api/client';
import { downloadCsv } from '../utils/csv';

const SORT_OPTIONS = {
  outlier_score_desc: 'Outlier Score (desc)',
  votes_desc: 'Votes (desc)',
  rating_desc: 'Rating (desc)',
  year_desc: 'Year (desc)',
  title_asc: 'Title (A→Z)',
};

function MoviesTable({ filters, sort, onSortChange, limit, onLimitChange, onRowClick }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getMovies({
        filters,
        sort,
        limit,
        outliersOnly: false,
      });
      setData(result.data);
    } catch (err) {
      setError('Failed to fetch movies. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, sort, limit]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDownload = () => {
    const csvData = data.map(row => ({
      Title: row.Series_Title,
      Year: row.Released_Year,
      Rating: row.IMDB_Rating,
      Votes: row.No_of_Votes,
      Genre: row.Genre,
      Director: row.Director,
      OutlierScore: row.outlier_score,
    }));
    downloadCsv(csvData, 'filtered_movies.csv');
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" component="h3" gutterBottom>
        All Movies (Filtered)
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sort}
              label="Sort by"
              onChange={(e) => onSortChange(e.target.value)}
            >
              {Object.entries(SORT_OPTIONS).map(([value, label]) => (
                <MenuItem key={value} value={value}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Limit</InputLabel>
            <Select
              value={limit}
              label="Limit"
              onChange={(e) => onLimitChange(e.target.value)}
            >
              {[50, 100, 200, 500].map(val => (
                <MenuItem key={val} value={val}>{val}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4} container justifyContent="flex-end">
          <Button variant="outlined" onClick={handleDownload} disabled={loading || data.length === 0}>
            Download Filtered Movies CSV
          </Button>
        </Grid>
      </Grid>
      
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      
      {!loading && !error && (
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell align="right">Year</TableCell>
                <TableCell align="right">Rating</TableCell>
                <TableCell align="right">Votes</TableCell>
                <TableCell>Genre</TableCell>
                <TableCell>Director</TableCell>
                <TableCell align="right">Outlier Score</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow
                  key={row.id}
                  hover
                  onClick={() => onRowClick(row.id)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell component="th" scope="row">{row.Series_Title}</TableCell>
                  <TableCell align="right">{row.Released_Year}</TableCell>
                  <TableCell align="right">{row.IMDB_Rating}</TableCell>
                  <TableCell align="right">{row.No_of_Votes?.toLocaleString()}</TableCell>
                  <TableCell>{row.Genre}</TableCell>
                  <TableCell>{row.Director}</TableCell>
                  <TableCell align="right">{row.outlier_score?.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
}

export default MoviesTable;
```

`Frontend/src/utils/csv.js`
```javascript
// Simple CSV file downloader
export const downloadCsv = (data, filename = 'data.csv') => {
  if (!data || data.length === 0) {
    console.warn('No data to download.');
    return;
  }

  const headers = Object.keys(data[0]);
  
  const escapeCsvCell = (cell) => {
    if (cell === null || cell === undefined) {
      return '';
    }
    const str = String(cell);
    // If the cell contains a comma, double quote, or newline, wrap it in double quotes
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      // Escape existing double quotes by doubling them
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => escapeCsvCell(row[header])).join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the object URL
  URL.revokeObjectURL(url);
};
```

I have also created the theme file:

`Frontend/src/theme.js`
```javascript
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: 'rgba(18, 18, 18, 0.8)',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
        },
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: 'xl',
      },
    },
  },
});

export default theme;
```