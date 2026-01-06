import pandas as pd
import numpy as np
from typing import Optional, List

def filter_df(
    df: pd.DataFrame,
    year_min: Optional[int] = None,
    year_max: Optional[int] = None,
    genre: Optional[List[str]] = None,
    certificate: Optional[List[str]] = None,
    outliers_only: bool = False,
):
    """Applies filters to the movie DataFrame."""
    
    filtered = df.copy()

    if year_min is not None:
        filtered = filtered[filtered['Released_Year'] >= year_min]
    
    if year_max is not None:
        filtered = filtered[filtered['Released_Year'] <= year_max]

    if genre:
        filtered = filtered[filtered['Genre'].apply(lambda movie_genres: any(g in movie_genres for g in genre))]
        
    if certificate:
        filtered = filtered[filtered['Certificate'].isin(certificate)]

    if outliers_only:
        # Assuming outlier score is calculated and available in the dataframe
        # A simple outlier definition might be movies with very high votes but low rating, or vice versa
        # This logic should be defined based on how 'outlier_score' is created in 'data.py'
        # For now, we assume a column 'outlier_reason' exists.
        if 'outlier_reason' in filtered.columns:
            filtered = filtered[filtered['outlier_reason'] != 'Normal']
        else: # Fallback if column not present
            filtered = pd.DataFrame(columns=df.columns)


    return filtered

def get_kpis(df: pd.DataFrame):
    """Computes summary statistics (KPIs) for the given DataFrame."""
    if df.empty:
        return {
            "total_movies": 0,
            "avg_rating": 0.0,
            "total_votes": 0,
            "total_gross": 0,
        }
    
    # Calculate total gross, handling both numeric and string formats
    gross_sum = 0
    if 'Gross' in df.columns:
        gross_sum = int(df['Gross'].sum())
    
    return {
        "total_movies": int(len(df)),
        "avg_rating": float(round(df['IMDB_Rating'].mean(), 2)),
        "total_votes": int(df['No_of_Votes'].sum()),
        "total_gross": gross_sum,
    }

def get_chart_data(df: pd.DataFrame):
    """Computes data for all charts."""
    if df.empty:
        return {
            "genres_distribution": {},
            "yearly_distribution": {},
        }

    # Genre Distribution
    genres_dist = df['Genre'].str.split(', ').explode().value_counts().nlargest(15)

    # Yearly Distribution
    yearly_dist = df['Released_Year'].value_counts().sort_index()

    return {
        "genres_distribution": {str(k): int(v) for k, v in genres_dist.items()},
        "yearly_distribution": {str(k): int(v) for k, v in yearly_dist.items()},
    }

def get_movies_list(df: pd.DataFrame, sort: str, limit: int):
    """Sorts and formats the movie list."""
    
    sort_map = {
        "outlier_score_desc": ("outlier_score", False),
        "votes_desc": ("No_of_Votes", False),
        "rating_desc": ("IMDB_Rating", False),
        "year_desc": ("Released_Year", False),
        "title_asc": ("Series_Title", True),
    }

    sort_by, ascending = sort_map.get(sort, ("outlier_score", False)) 
    
    # Ensure the sort column exists
    if sort_by not in df.columns:
        # Fallback to default if a column is missing (e.g. outlier_score)
        sort_by, ascending = "No_of_Votes", False

    sorted_df = df.sort_values(by=sort_by, ascending=ascending).head(limit)

    # Convert to dict records and handle potential NaN values gracefully
    records = []
    for _, row in sorted_df.iterrows():
        record = row.to_dict()
        for key, value in record.items():
            if pd.isna(value):
                record[key] = None # Replace NaN with None for JSON compatibility
        records.append(record)
    
    return {"data": records}
