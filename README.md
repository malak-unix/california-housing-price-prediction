# PropValue AI — California Housing Prediction

PropValue AI is a responsive React interface for the project’s trained CatBoost regression pipeline. It sends the eight California Housing dataset features to FastAPI, displays only genuine returned predictions, presents verified evaluation metrics, and provides interactive geographic context.

## Scientific scope

The model uses the California Housing dataset derived from the 1990 U.S. Census. Each row represents a census block group and the target is that area’s median housing value. A result is therefore **not** a present-day appraisal, listing estimate, confidence guarantee, or predicted sale price for an individual property.

Verified project artifacts:

- Final held-out test metrics: `reports/evaluation_finale_test.csv`
- Optimized validation comparison: `reports/comparaison_modeles_optimises.csv`
- Model metadata and feature order: `models/pipeline_metadata.json`
- Trained pipeline: `models/pipeline_immobilier.joblib`

## Local setup

### Backend

From the repository root, use the project virtual environment so the serialized model loads with its matching CatBoost and scikit-learn versions:

```powershell
.\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

If the virtual environment has not been prepared yet:

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

FastAPI exposes:

- `POST http://localhost:8000/predict`
- `GET http://localhost:8000/health`
- Swagger UI: `http://localhost:8000/docs`

### Frontend

In a second terminal:

```powershell
Set-Location frontend
npm install
Copy-Item .env.example .env.local
npm run dev
```

Vite serves the site at `http://localhost:5173` by default.

## Environment variables

`frontend/.env.example` documents both runtime settings:

```dotenv
VITE_API_URL=http://localhost:8000
VITE_MAP_STYLE_URL=https://tiles.openfreemap.org/styles/dark
```

- `VITE_API_URL` points the browser to FastAPI.
- `VITE_MAP_STYLE_URL` may replace the default OpenFreeMap style with another MapLibre-compatible style document.

The backend CORS configuration permits the local Vite origins `http://localhost:5173` and `http://127.0.0.1:5173`.

## Map service

The interactive map uses [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) with the public [OpenFreeMap](https://openfreemap.org/) dark style. OpenFreeMap requires no API key or registration; its style provides the required OpenStreetMap/OpenMapTiles attribution in MapLibre. Map rendering requires internet access unless the style and tiles are self-hosted.

The marker represents an approximate historical census-area coordinate. Clicking the map or dragging the marker updates `Latitude` and `Longitude`; it does not verify a street address or individual property.

## Hero photograph and license

The local asset `frontend/public/images/modern-villa-hero.jpg` is derived from:

- **“Exterior of a Modern Villa”** by **Gustavo Galeano Maz**, via [Pexels](https://www.pexels.com/photo/exterior-of-a-modern-villa-13752348/)
- Source dimensions: 6720 × 4480; locally downloaded at 2400 × 1600
- License: [Pexels License](https://www.pexels.com/license/)

Pexels permits free website use and modification, and attribution is not required. Credit is nevertheless included in the interface and here. The photograph is presented as California-style architectural imagery; its source does not establish that the building is located in California.

## Production build

```powershell
Set-Location frontend
npm run build
```

The output is written to `frontend/dist/`. The prediction and health interfaces still require the FastAPI service at runtime, and the default map requires the external OpenFreeMap tile service.
