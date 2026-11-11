# PropValue AI — California Housing Price Prediction

An end-to-end Machine Learning project that explores, compares, optimizes and deploys regression models to estimate historical median housing values in California.

**[Live Demo](https://malak-unix.github.io/california-housing-price-prediction/)** | **[GitHub Repository](https://github.com/malak-unix/california-housing-price-prediction)**

> **Demo limitation:** GitHub Pages hosts the React frontend only. The FastAPI backend must be running separately for interactive predictions. The Model Insights section remains accessible online.

## 1. Project Overview

The objective of this project is to develop a complete Machine Learning workflow, from exploratory data analysis to model selection, evaluation and integration into a web application.

Rather than selecting an algorithm in advance, the approach focuses on experimentally comparing multiple candidates under a consistent evaluation protocol.

**Technologies:** Python, Pandas, Scikit-learn, CatBoost, LightGBM, XGBoost, Optuna, FastAPI, React, TypeScript, Tailwind CSS and shadcn/ui.

## 2. Dataset and Exploratory Data Analysis

The project uses the **California Housing dataset**, derived from the 1990 U.S. Census.

It contains 20,640 observations and eight numerical input features:

| Feature | Description |
|---|---|
| MedInc | Median household income |
| HouseAge | Median housing age |
| AveRooms | Average rooms per household |
| AveBedrms | Average bedrooms per household |
| Population | Census block-group population |
| AveOccup | Average household occupancy |
| Latitude | Geographic latitude |
| Longitude | Geographic longitude |

**Target:** `MedHouseVal` — median housing value, expressed in units of $100,000.

The exploratory analysis included inspecting the dataset structure, checking missing values, studying feature distributions and exploring relationships between the predictors and target.

**Important:** The dataset describes historical census areas, not individual properties or current real-estate market prices.

## 3. Experimental Methodology

### Step 1 — Data splitting

The dataset was divided into three independent subsets:

| Subset | Proportion | Observations |
|---|---:|---:|
| Training | 70% | 14,448 |
| Validation | 15% | 3,096 |
| Test | 15% | 3,096 |

The training set was used to fit candidate models. The validation set was used to compare and select models. The test set was reserved for the final evaluation.

### Step 2 — Baseline and model benchmarking

A DummyRegressor established a baseline against which more advanced models could be evaluated.

Five regression algorithms were then compared:

- ExtraTrees
- HistGradientBoosting
- XGBoost
- LightGBM
- CatBoost

The main selection metric was **Mean Absolute Error (MAE)**, because it expresses average prediction error in an interpretable unit.

RMSE and R² were also tracked to provide complementary information.

### Step 3 — Hyperparameter optimization

Four promising candidates were optimized using **Optuna**, with five-fold cross-validation on the training data.

The goal was to improve generalization rather than simply maximize performance on the training set.

Optimized validation results:

| Model | Validation MAE |
|---|---:|
| **CatBoost** | **$28,470.70** |
| LightGBM | $29,292.59 |
| HistGradientBoosting | $29,452.31 |
| XGBoost | $29,631.96 |

ExtraTrees was included in the initial benchmark but not in this Optuna optimization stage.

**CatBoost achieved the lowest validation MAE among the optimized candidates and was selected as the final model.**

### Step 4 — Final training and evaluation

After model selection, the CatBoost pipeline was retrained on the combined training and validation sets (17,544 observations).

The final model was then evaluated on the held-out test set of 3,096 observations.

## 4. Final Results

| Test metric | Result |
|---|---:|
| **MAE** | **$28,644.52** |
| **RMSE** | **$43,615.67** |
| **R²** | **0.8548** |

The results indicate that the model explains approximately 85.48% of the target variance on the test set.

This does not mean that individual predictions have 85.48% confidence or accuracy.

The trained model is saved as a Scikit-learn pipeline containing a median imputer and a CatBoost regressor.

## 5. Web Application

The project includes a responsive frontend developed using React, TypeScript, Tailwind CSS and shadcn/ui.

It contains two main sections:

**Predict**

A form allows users to enter the eight input features and request a prediction from the FastAPI backend.

**Model Insights**

A dashboard presents the selected model, evaluation metrics and comparison of optimized candidates.

The backend exposes two endpoints:

- `POST /predict` — generate a prediction
- `GET /health` — check API health

## 6. Project Structure

```text
├── app/
│   └── main.py
├── data/
│   └── splits/
├── frontend/
│   ├── public/
│   └── src/
├── models/
│   ├── pipeline_immobilier.joblib
│   └── pipeline_metadata.json
├── notebooks/
│   ├── 01_exploration.ipynb
│   ├── 02_modelisation.ipynb
│   ├── 03_optimisation.ipynb
│   └── 04_finalisation.ipynb
├── reports/
├── requirements.txt
└── README.md
```

## 7. Running Locally

### Backend

Use Python 3.13 and run the following commands from the project root:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload
```

The API will be accessible at `http://127.0.0.1:8000`.

Swagger documentation: `http://127.0.0.1:8000/docs`

### Frontend

Open a second terminal:

```powershell
cd frontend
npm install
```

Create `frontend/.env.local` with:

```dotenv
VITE_API_URL=http://127.0.0.1:8000
```

Then launch the application:

```powershell
npm run dev
```

Open `http://localhost:5173`.

## 8. Deployment

The React frontend is deployed using **GitHub Pages** and **GitHub Actions**.

The deployed website provides a public demonstration of the interface and Model Insights section.

Because GitHub Pages does not execute Python applications, interactive predictions require a separately running FastAPI backend.

## 9. Key Takeaways

This project reinforced several important Machine Learning principles:

- Understanding the dataset before selecting algorithms.
- Establishing a baseline before benchmarking complex models.
- Using consistent evaluation metrics across candidates.
- Separating hyperparameter optimization from final testing.
- Selecting models based on validation performance rather than training scores.
- Integrating a trained model into an API and user-facing application.
- Communicating model limitations alongside evaluation results.

The main takeaway is that a reliable ML solution depends not only on the algorithm, but also on the quality of the experimental methodology.

---

**Dataset:** California Housing — Scikit-learn  
**Final model:** CatBoostRegressor  
**Project:** PropValue AI
