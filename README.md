# IMDB_PythonProject

# IMDb Analytics Dashboard

## 1. Project Overview

The **IMDb Analytics Dashboard** is a full-stack data analysis and visualization project built using a **Python backend** and a **React.js frontend**.  
It analyzes the IMDb Top 1000 Movies dataset to extract insights about movie ratings, popularity, voting behavior, and statistical outliers.

The project demonstrates:
- Real-world dataset handling
- Data cleaning and preprocessing
- Statistical analysis
- Interactive data visualization
- Full frontend–backend integration

This project is designed to meet **all baseline requirements** and achieve **maximum bonus points** for visualization, dataset complexity, and advanced analysis.

---

## 2. Key Features

- Interactive dashboard with filters (year range, votes, genre)
- Search functionality for specific movies
- Sorting movies by rating, votes, year, and popularity
- KPI summary cards (total movies, average rating, median votes, outliers)
- Multiple visualizations:
  - Rating distribution
  - Average rating by decade
  - Votes vs rating (log scale)
  - Boxplots of ratings by decade
- Outlier detection (high rating, low votes)
- Clean REST API design
- Modern React UI with Material UI

---

## 3. Tech Stack

### Backend
- Python 3
- FastAPI
- Pandas
- NumPy
- Uvicorn

### Frontend
- React.js
- Vite
- Material UI (MUI)
- Recharts / Chart.js

### Dataset
- IMDb Top 1000 Movies & TV Shows (Kaggle)

---

## 4. Dataset Description

Source:
https://www.kaggle.com/datasets/harshitshankhdhar/imdb-dataset-of-top-1000-movies-and-tv-shows

Main Columns Used:
- Series_Title
- Released_Year
- Genre
- IMDB_Rating
- No_of_Votes
- Gross
- Director
- Stars

The dataset required:
- Cleaning missing values
- Type conversion
- Feature engineering (decades, log votes)
- Statistical preprocessing

---

## 5. Project Structure