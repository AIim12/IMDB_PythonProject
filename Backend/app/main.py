from fastapi import FastAPI, Query, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List
from enum import Enum
import pandas as pd
import numpy as np

from .data import get_df
from .analytics import (
    filter_df,
    get_kpis,
    get_chart_data,
    get_movies_list,
)

app = FastAPI(
    title="IMDb Analytics Backend",
    description="A FastAPI backend to serve analytics on a cleaned IMDb dataset.",
    version="1.0.0",
)

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

movie_df = get_df()

# --- Shared Dependencies ---

class SortOptions(str, Enum):
    outlier_score_desc = "outlier_score_desc"
    votes_desc = "votes_desc"
    rating_desc = "rating_desc"
    year_desc = "year_desc"
    title_asc = "title_asc"

async def get_filter_params(
    year_min: Optional[int] = Query(None, description="Minimum release year"),
    year_max: Optional[int] = Query(None, description="Maximum release year"),
    genre: Optional[List[str]] = Query(None, description="List of genres to include"),
    certificate: Optional[List[str]] = Query(None, description="List of certificates to include"),
    outliers_only: bool = Query(False, description="Set to true to only include outliers"),
):
    return {
        "year_min": year_min,
        "year_max": year_max,
        "genre": genre,
        "certificate": certificate,
        "outliers_only": outliers_only,
    }

# --- API Endpoints ---

@app.get("/api/analytics")
async def get_analytics_endpoint(filters: dict = Depends(get_filter_params)):
    """
    Returns KPIs and chart data for movies matching the filter criteria.
    """
    filtered_data = filter_df(movie_df, **filters)
    kpis = get_kpis(filtered_data)
    charts = get_chart_data(filtered_data)
    
    return {
        "kpis": kpis,
        **charts,
    }

@app.get("/api/movies")
async def get_movies_endpoint(
    filters: dict = Depends(get_filter_params),
    limit: int = Query(50, le=5000),
    sort: SortOptions = Query(SortOptions.outlier_score_desc),
):
    """
    Returns a list of movies matching the filter criteria, with sorting and pagination.
    """
    filtered_data = filter_df(movie_df, **filters)
    return get_movies_list(filtered_data, sort=sort.value, limit=limit)

@app.get("/api/movies/{movie_id}")
async def get_movie_by_id_endpoint(movie_id: str):
    """
    Returns a single movie by its ID.
    """
    movie_id_col = 'id' # Assuming the DataFrame index is the ID.
    if movie_id_col not in movie_df.columns and movie_df.index.name != movie_id_col:
         # if id is the index, we need to reset it
         df_for_lookup = movie_df.reset_index()
    else:
         df_for_lookup = movie_df

    result_df = df_for_lookup[df_for_lookup[movie_id_col] == movie_id]
    
    if result_df.empty:
        raise HTTPException(status_code=404, detail="Movie not found")
        
    # Convert to dict, handling numpy types
    movie = result_df.iloc[0].to_dict()
    for k, v in movie.items():
        if pd.isna(v):
            movie[k] = None
        elif isinstance(v, (np.integer, np.int64)):
            movie[k] = int(v)
        elif isinstance(v, (np.floating, np.float64)):
            movie[k] = float(v)

    return movie
