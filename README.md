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
```text
project4-python/
├── Backend/
│   ├── app/
│   │   ├── main.py          # FastAPI entry point
│   │   ├── analytics.py     # Statistical analysis logic
│   │   ├── data.py          # Data loading & cleaning
│   │   └── routes.py        # API endpoints
│   ├── requirements.txt
│   └── imdb.csv
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── KpiCards.jsx
│   │   │   ├── Charts.jsx
│   │   │   ├── Filters.jsx
│   │   │   └── MovieTable.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```
--- 

## install dependencies
pip install -r requirements.txt


---

## 6. Backend Setup (macOS Focused)

### 1. Create Virtual Environment

```bash
cd Backend
python3 -m venv venv
source venv/bin/activate
```
### 2. start backend server
uvicorn app.main:app --reload --port 8000

---

## 7. Frontend Setup

### 1. Verify Node.js & npm Installation

Before running the frontend, ensure that **Node.js** and **npm** are installed.

```bash
node -v
npm -v
```
### 2. Navigate Frontend directory
cd Frontend

### 3. Install Frontend Dependencies
npm install

### 4. Start frontend development server
npm run dev

### 5. Access the Frontend in the Browser
http://localhost:5173

---


## 8. How Frontend & Backend Communicate
	•	React frontend sends HTTP requests to FastAPI backend
	•	Backend processes data using Pandas
	•	JSON responses returned to frontend
	•	Frontend renders charts and tables dynamically
  
---

## 9. Analysis Techniques Used

### Baseline
	•	Mean, median, min, max
	•	Aggregations by decade
	•	Frequency distributions

### Advanced
	•	Log-scale vote analysis
	•	Quartiles and boxplots
	•	Outlier detection using Z-score
	•	Trend comparison across decades

---

## 10. Error Handling & Debugging (Detailed)

### Common Backend Issues
	•	CSV path errors → fixed using absolute paths
	•	Missing values → handled with Pandas fillna()
	•	Type errors → explicit casting for year and rating

### Common Frontend Issues
	•	Module import errors → fixed by installing missing packages
	•	API CORS issues → handled via FastAPI middleware
	•	Vite build errors → fixed with dependency reinstall

### Debug Strategy
	1.	Check terminal logs
	2.	Validate API responses via browser
	3.	Console log frontend state
	4.	Restart services if needed
---

## 11. Performance & Optimization
	•	Data loaded once and cached in memory
	•	Vectorized Pandas operations
	•	Lightweight API responses
	•	Client-side rendering optimizations
	•	Log-scale plotting for large ranges
---

## 12. Academic Requirement Coverage

### Visualization:
	•	Matplotlib (backend analytics)
	•	Modern web-based visualization using React (+15)

### Dataset:
	•	Messy real-world dataset (+5)
	•	Manual cleaning and explanation (+10)

### Analysis:
	•	Statistical summaries (+baseline)
	•	Quartiles and boxplots (+5)
	•	Outlier detection and reporting (+15)
---
## 13. Resources
	•	IMDb Dataset (Kaggle)
	•	Pandas Documentation
	•	FastAPI Documentation
	•	React + Vite Documentation
	•	Material UI Docs

