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