# Air Quality Analysis and Forecasting

> Time-series analysis and forecasting of Air Quality Index (AQI) using SARIMA, LSTM, and Prophet models.

[![Python](https://img.shields.io/badge/Python-3.7+-blue.svg)](https://www.python.org/)
[![Jupyter](https://img.shields.io/badge/Jupyter-Notebook-orange.svg)](https://jupyter.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-orange.svg)](https://www.tensorflow.org/)

## 📋 Overview

This project explores and forecasts urban air quality using daily city-level data from India (2015–2020). The analysis focuses on identifying pollution trends, seasonal patterns, and building predictive models to forecast AQI values 3–6 months in advance.

**Key Features:**
- **Comprehensive EDA**: Multi-city analysis with correlation studies and temporal trends
- **Three Forecasting Models**: SARIMA, LSTM (RNN), and Facebook Prophet
- **Complete Testing Framework**: Model comparison with statistical validation
- **Production-Ready**: Modular code with preprocessing utilities and test suite

## 🎯 Use Case

**Problem**: Air pollution causes 7 million premature deaths globally per year. Indian cities like Delhi frequently experience hazardous AQI levels (>400) during winter months.

**Solution**: Accurate AQI forecasting enables:
- Governments to implement timely pollution control measures
- Citizens to plan outdoor activities safely
- Health systems to prepare for pollution-related emergencies

**Target Users**: Environmental scientists, city planners, government bodies, and the public.

## 📊 Dataset

### Source
- **Kaggle**: [Air Quality Data in India](https://www.kaggle.com/datasets/rohanrao/air-quality-data-in-india) (Recommended)
- **Official**: [Central Pollution Control Board (CPCB)](https://cpcb.nic.in/)

### Structure
- **File**: `datasets/city_day.csv`
- **Time Period**: 2015–2020
- **Key Columns**: `Date`, `City`, `AQI`, `PM2.5`, `PM10`, `NO2`, `CO`, `SO2`
- **Focus Cities**: Delhi, Jaipur, Guwahati

### Preprocessing
- Date parsing and monthly aggregation
- Forward/backward fill for missing AQI values
- MinMaxScaler normalization for LSTM inputs

## 🚀 Quick Start

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd air-quality-analysis-forecasting
```

2. **Create virtual environment** (recommended)
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Download dataset**
   - Get `city_day.csv` from [Kaggle](https://www.kaggle.com/datasets/rohanrao/air-quality-data-in-india)
   - Place it in `datasets/` directory

### Running the Project

Launch Jupyter Notebook:
```bash
jupyter notebook
```

Then explore the notebooks in sequence:

1. **`notebook/air-quality-analysis.ipynb`** — EDA and data exploration
2. **`notebook/sarima-model-AQI-forecasting.ipynb`** — SARIMA modeling
3. **`notebook/rnn-lstm-model-AQI-forecasting.ipynb`** — LSTM forecasting
4. **`notebook/fb-prophet-air-quality-forecasting.ipynb`** — Prophet forecasting
5. **`notebook/test.ipynb`** — Comprehensive model testing and comparison

## 📁 Project Structure

```
air-quality-analysis-forecasting/
│
├── datasets/                      # Data files
│   ├── city_day.csv              # Main dataset (download required)
│   ├── city_hour.csv
│   ├── station_day.csv
│   ├── station_hour.csv
│   └── stations.csv
│
├── notebook/                      # Jupyter notebooks
│   ├── air-quality-analysis.ipynb              # EDA and exploration
│   ├── sarima-model-AQI-forecasting.ipynb      # SARIMA model
│   ├── rnn-lstm-model-AQI-forecasting.ipynb    # LSTM model
│   ├── fb-prophet-air-quality-forecasting.ipynb # Prophet model
│   └── test.ipynb                              # Model testing & comparison
│
├── src/                           # Source code
│   ├── data_preprocessing.py      # Data preprocessing utilities
│   └── csv_to_json_chunks.py      # CSV to JSON chunking utility
│
├── web/                           # Web assets (gitignored)
│   └── json/                      # JSON chunks for web consumption
│       ├── city_hour/             # City hourly data chunks
│       └── station_hour/          # Station hourly data chunks
│
├── tests/                         # Test suite
│   ├── test_data_preprocessing.py
│   └── test-outimg/              # Test output images
│
├── report/                        # Project documentation
│   └── report.md                 # Detailed project report
│
├── requirements.txt               # Python dependencies
├── test_results.csv              # Model comparison results (generated)
├── error_statistics.csv          # Error analysis (generated)
└── README.md                     # This file
```

## 🧪 Models

### 1. SARIMAX (Statistical)
- **Type**: Classical time-series model
- **Configuration**: Order=(0,1,3), Seasonal=(0,1,1,12)
- **Strengths**: Interpretable, explicit seasonality modeling
- **Use Case**: Baseline model for seasonal data

### 2. LSTM (Deep Learning)
- **Type**: Recurrent Neural Network
- **Configuration**: 2×32 LSTM units, 50 epochs, lookback=12 months
- **Strengths**: Captures non-linear dependencies
- **Use Case**: Complex patterns with sufficient data

### 3. Prophet (Additive Model)
- **Type**: Probabilistic forecasting
- **Configuration**: Yearly seasonality, cmdstanpy backend
- **Strengths**: Robust to outliers, fast iteration, uncertainty intervals
- **Use Case**: Production deployment with automated retraining

## 📈 Model Comparison

| Feature | SARIMAX | LSTM | Prophet |
|---------|---------|------|---------|
| **Seasonality** | ✅ Excellent | ✅ Good | ✅ Excellent |
| **Trend Handling** | Linear/Stochastic | Non-linear | Piecewise Linear |
| **Training Speed** | ⚡ Fast | 🐌 Slow | ⚡⚡ Very Fast |
| **Interpretability** | ✅ High | ❌ Low | ✅ High |
| **Robustness** | ⚠️ Low | 🔶 Medium | ✅ High |

*Performance metrics (RMSE, MAE, MAPE) are generated in `test.ipynb` and saved to `test_results.csv`.*

## 🔬 Testing & Validation

The `test.ipynb` notebook provides comprehensive model evaluation:

- **Residual Diagnostics**: ACF, Q-Q plots, Ljung-Box test
- **Error Analysis**: Distribution, bias, variance
- **Statistical Tests**: Shapiro-Wilk normality test
- **Cross-Validation**: Prophet CV with performance metrics
- **Visual Comparison**: Side-by-side predictions, error plots
- **Final Report**: Automated summary with recommendations

Run the test notebook to generate:
- `test_results.csv` — Model performance metrics
- `error_statistics.csv` — Detailed error analysis

## 📊 Key Findings

### Data Insights
- **Seasonality**: Strong winter peaks (Nov–Jan), monsoon dips (Jul–Sep)
- **Trend**: Increasing pollution levels in Delhi from 2015–2020
- **Pollutants**: PM2.5 and PM10 are primary AQI drivers
- **Missing Data**: Handled via forward/backward fill and monthly aggregation

### Model Performance
- **SARIMA**: Best for interpretability and seasonal structure
- **Prophet**: Recommended for production (robustness + uncertainty)
- **LSTM**: Highest potential accuracy with careful tuning
- **Ensemble**: Combination of SARIMA + Prophet recommended for deployment

## 🛠️ Dependencies

Core libraries:
- `pandas` — Data manipulation
- `numpy` — Numerical computing
- `matplotlib`, `seaborn`, `plotly` — Visualization
- `statsmodels` — SARIMA modeling
- `scikit-learn` — Preprocessing & metrics
- `tensorflow` — LSTM neural networks
- `prophet` — Facebook Prophet forecasting
- `notebook`, `ipywidgets` — Jupyter environment

See `requirements.txt` for complete list.

## 📝 Usage Example

```python
import pandas as pd
from src.data_preprocessing import load_and_preprocess

# Load Delhi AQI data
delhi_aqi = load_and_preprocess('datasets/city_day.csv', city='Delhi')

# Train/test split
train = delhi_aqi[:48]  # 48 months
test = delhi_aqi[48:61]  # 13 months

# Fit SARIMA model
from statsmodels.tsa.statespace.sarimax import SARIMAX
model = SARIMAX(train['AQI'], order=(0,1,3), seasonal_order=(0,1,1,12))
results = model.fit()

# Forecast
forecast = results.forecast(steps=len(test))
```

## 📖 Documentation

- **Detailed Report**: See `report/report.md` for comprehensive analysis
- **Notebook Documentation**: Each notebook contains markdown cells with explanations
- **Code Comments**: Source code includes inline documentation

---

## 🔧 Utilities

### CSV to JSON Chunking

For web deployment or data pipeline integration, large CSV files can be split into smaller JSON chunks using the provided utility.

**Script**: `src/csv_to_json_chunks.py`

**Use Case**: Convert massive CSV datasets into manageable JSON files for:
- Loading in web applications (avoid browser memory limits)
- Distributing data across CDN
- Progressive data loading
- API endpoint pagination

**Usage:**

```bash
# Basic usage - split with default settings (50k rows/chunk)
python src/csv_to_json_chunks.py datasets/city_hour.csv

# Custom output directory and chunk size
python src/csv_to_json_chunks.py datasets/city_hour.csv -o web/json/city_hour -r 100000

# With pretty printing (indentation)
python src/csv_to_json_chunks.py datasets/station_hour.csv -o web/json/station_hour -r 100000 --indent 2

# Compressed output
python src/csv_to_json_chunks.py datasets/city_day.csv -o chunks/city_day --compression gz
```

**Available Options:**

| Flag | Description | Default |
|------|-------------|---------|
| `-o`, `--output-dir` | Output directory for JSON chunks | `chunks` |
| `-r`, `--rows-per-chunk` | Number of rows per chunk file | `50000` |
| `--orient` | JSON structure format | `records` |
| `--indent` | Pretty-print indentation (None=compact) | `None` |
| `--compression` | Compress output (`gz`, `bz2`, `zip`, `xz`) | `None` |
| `--ensure-ascii` | Escape non-ASCII characters | `False` |

**Output Format:**

Files are named sequentially: `<basename>.part0.json`, `<basename>.part1.json`, etc.

**Example Output:**
```bash
$ python src/csv_to_json_chunks.py datasets/city_hour.csv -o web/json/city_hour -r 100000
{
  "status": "ok",
  "result": {
    "chunks": 8,
    "rows": 707875,
    "output_dir": "web/json/city_hour",
    "base": "city_hour"
  }
}
```

**Note**: Generated JSON chunks in `web/json/` are gitignored to keep repository size manageable.

---

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Additional forecasting models (XGBoost, N-BEATS)
- Multivariate forecasting (include weather data)
- Real-time data integration
- Web dashboard for visualization
- Model deployment pipeline

## 📄 License

This project is open source and available for educational and research purposes.

## 🙏 Acknowledgments

- Dataset: Kaggle & Central Pollution Control Board (CPCB)
- Libraries: statsmodels, TensorFlow, Facebook Prophet communities
- Inspiration: Environmental data science and public health research

## 📧 Contact

For questions or feedback, please open an issue in the repository.

---

**Built with ❤️ for cleaner air and better public health**
