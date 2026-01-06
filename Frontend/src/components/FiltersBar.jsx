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