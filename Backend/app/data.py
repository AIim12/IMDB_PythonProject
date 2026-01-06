import pandas as pd
import numpy as np
import os
from functools import lru_cache

@lru_cache(maxsize=1)
def load_and_clean_data():
    """
    Loads the movie dataset from a CSV file, cleans it, and performs feature engineering.
    The processed DataFrame is cached in memory.
    """
    # Construct the path to the CSV file relative to this script's location
    # The app is run from the 'Backend' directory
    # CSV is in 'data/imdb.csv' at the root
    
    # Path when running from Backend directory: ../data/imdb.csv
    file_path = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'imdb.csv')


    df = pd.read_csv(file_path)

    # 1. Keep original columns and add an id
    df['id'] = df.index.astype(str)
    
    # 2. Clean and validate data
    # Convert 'Released_Year' - errors='coerce' will turn non-numeric values into NaT/NaN
    df['Released_Year'] = pd.to_numeric(df['Released_Year'], errors='coerce')

    # Convert 'IMDB_Rating'
    df['IMDB_Rating'] = pd.to_numeric(df['IMDB_Rating'], errors='coerce')

    # Convert 'No_of_Votes' - remove commas first
    df['No_of_Votes'] = df['No_of_Votes'].astype(str).str.replace(',', '')
    df['No_of_Votes'] = pd.to_numeric(df['No_of_Votes'], errors='coerce')

    # Drop rows where conversion failed
    df.dropna(subset=['Released_Year', 'IMDB_Rating', 'No_of_Votes'], inplace=True)

    # Cast to integer types
    df['Released_Year'] = df['Released_Year'].astype(int)
    df['No_of_Votes'] = df['No_of_Votes'].astype(int)

    # Drop duplicates
    df.drop_duplicates(subset=['Series_Title', 'Released_Year'], inplace=True)

    # 3. Feature Engineering
    df['logVotes'] = np.log10(df['No_of_Votes'] + 1) # Add 1 to avoid log(0)

    # 4. Outlier Detection (on the full, cleaned dataset)
    rating_mean = df['IMDB_Rating'].mean()
    rating_std = df['IMDB_Rating'].std()
    logvotes_mean = df['logVotes'].mean()
    logvotes_std = df['logVotes'].std()
    
    df['rating_z'] = (df['IMDB_Rating'] - rating_mean) / rating_std
    df['logVotes_z'] = (df['logVotes'] - logvotes_mean) / logvotes_std
    
    df['outlier_score'] = df['rating_z'] - df['logVotes_z']
    
    df['outlier_reason'] = np.where(
        df['outlier_score'] >= 2.0, 
        "High rating, low votes", 
        "Normal"
    )

    return df

# Initial call to load and cache the data on startup
get_df = load_and_clean_data