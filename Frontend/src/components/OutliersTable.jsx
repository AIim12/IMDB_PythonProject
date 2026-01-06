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