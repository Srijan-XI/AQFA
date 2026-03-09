"""
Air Quality Forecasting API
A simple Flask API to serve AQI data and predictions
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
from pathlib import Path
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for web app to access API

# Configuration
BASE_DIR = Path(__file__).parent.parent
DATASETS_DIR = BASE_DIR / 'datasets'
DATA_FILE = DATASETS_DIR / 'city_day.csv'

# Load data at startup
def load_data():
    """Load and preprocess the AQI dataset"""
    try:
        if not DATA_FILE.exists():
            print(f"Warning: Dataset not found at {DATA_FILE}")
            return None
        
        df = pd.read_csv(DATA_FILE)
        df['Date'] = pd.to_datetime(df['Date'])
        return df
    except Exception as e:
        print(f"Error loading data: {e}")
        return None

# Global data store
data = load_data()

# Helper functions
def get_city_data(city_name, start_date=None, end_date=None):
    """Get AQI data for a specific city"""
    if data is None:
        return None
    
    city_data = data[data['City'] == city_name].copy()
    
    if start_date:
        city_data = city_data[city_data['Date'] >= start_date]
    if end_date:
        city_data = city_data[city_data['Date'] <= end_date]
    
    city_data = city_data.sort_values('Date')
    return city_data

def get_latest_aqi(city_name):
    """Get the latest AQI value for a city"""
    city_data = get_city_data(city_name)
    if city_data is None or len(city_data) == 0:
        return None
    
    latest = city_data.iloc[-1]
    return {
        'city': city_name,
        'date': latest['Date'].strftime('%Y-%m-%d'),
        'aqi': float(latest['AQI']) if pd.notna(latest['AQI']) else None,
        'pm25': float(latest['PM2.5']) if pd.notna(latest['PM2.5']) else None,
        'pm10': float(latest['PM10']) if pd.notna(latest['PM10']) else None,
        'no2': float(latest['NO2']) if pd.notna(latest['NO2']) else None,
        'co': float(latest['CO']) if pd.notna(latest['CO']) else None,
        'so2': float(latest['SO2']) if pd.notna(latest['SO2']) else None,
        'o3': float(latest['O3']) if pd.notna(latest['O3']) else None
    }

def get_monthly_average(city_name):
    """Get monthly average AQI for a city"""
    city_data = get_city_data(city_name)
    if city_data is None or len(city_data) == 0:
        return None
    
    city_data['YearMonth'] = city_data['Date'].dt.to_period('M')
    monthly_avg = city_data.groupby('YearMonth')['AQI'].mean().reset_index()
    
    return {
        'city': city_name,
        'data': [
            {
                'month': str(row['YearMonth']),
                'aqi': float(row['AQI']) if pd.notna(row['AQI']) else None
            }
            for _, row in monthly_avg.iterrows()
        ]
    }

def get_pollutant_stats(city_name):
    """Get pollutant statistics for a city"""
    city_data = get_city_data(city_name)
    if city_data is None or len(city_data) == 0:
        return None
    
    pollutants = ['PM2.5', 'PM10', 'NO2', 'CO', 'SO2', 'O3']
    stats = {}
    
    for pollutant in pollutants:
        if pollutant in city_data.columns:
            stats[pollutant] = {
                'mean': float(city_data[pollutant].mean()) if pd.notna(city_data[pollutant].mean()) else None,
                'max': float(city_data[pollutant].max()) if pd.notna(city_data[pollutant].max()) else None,
                'min': float(city_data[pollutant].min()) if pd.notna(city_data[pollutant].min()) else None,
                'std': float(city_data[pollutant].std()) if pd.notna(city_data[pollutant].std()) else None
            }
    
    return {
        'city': city_name,
        'pollutants': stats
    }

# API Routes

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'message': 'Air Quality API is running',
        'data_loaded': data is not None
    })

@app.route('/api/cities', methods=['GET'])
def get_cities():
    """Get list of available cities"""
    if data is None:
        return jsonify({'error': 'Data not loaded'}), 500
    
    cities = sorted(data['City'].unique().tolist())
    return jsonify({
        'cities': cities,
        'count': len(cities)
    })

@app.route('/api/aqi/<city>', methods=['GET'])
def get_city_aqi(city):
    """Get latest AQI for a specific city"""
    latest = get_latest_aqi(city)
    
    if latest is None:
        return jsonify({'error': f'No data found for city: {city}'}), 404
    
    return jsonify(latest)

@app.route('/api/trend/<city>', methods=['GET'])
def get_city_trend(city):
    """Get monthly AQI trend for a specific city"""
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    city_data = get_city_data(city, start_date, end_date)
    
    if city_data is None or len(city_data) == 0:
        return jsonify({'error': f'No data found for city: {city}'}), 404
    
    trend_data = [
        {
            'date': row['Date'].strftime('%Y-%m-%d'),
            'aqi': float(row['AQI']) if pd.notna(row['AQI']) else None
        }
        for _, row in city_data.iterrows()
    ]
    
    return jsonify({
        'city': city,
        'data': trend_data,
        'count': len(trend_data)
    })

@app.route('/api/monthly/<city>', methods=['GET'])
def get_city_monthly(city):
    """Get monthly average AQI for a specific city"""
    monthly = get_monthly_average(city)
    
    if monthly is None:
        return jsonify({'error': f'No data found for city: {city}'}), 404
    
    return jsonify(monthly)

@app.route('/api/pollutants/<city>', methods=['GET'])
def get_city_pollutants(city):
    """Get pollutant statistics for a specific city"""
    stats = get_pollutant_stats(city)
    
    if stats is None:
        return jsonify({'error': f'No data found for city: {city}'}), 404
    
    return jsonify(stats)

@app.route('/api/forecast/<city>', methods=['GET'])
def get_forecast(city):
    """Get forecast data for a specific city (simulated)"""
    model = request.args.get('model', 'prophet')
    horizon = int(request.args.get('horizon', 6))
    
    # Get historical data
    city_data = get_city_data(city)
    if city_data is None or len(city_data) == 0:
        return jsonify({'error': f'No data found for city: {city}'}), 404
    
    # Get last 6 months of actual data
    recent_data = city_data.tail(6)
    actual = [
        {
            'date': row['Date'].strftime('%Y-%m-%d'),
            'aqi': float(row['AQI']) if pd.notna(row['AQI']) else None
        }
        for _, row in recent_data.iterrows()
    ]
    
    # Simulate forecast (in real implementation, load from saved models)
    last_aqi = actual[-1]['aqi'] if actual[-1]['aqi'] is not None else 150
    
    # Simple simulation with slight decay
    future = []
    current_aqi = last_aqi
    for i in range(horizon):
        # Add some randomness and seasonal pattern
        seasonal_factor = 1 + 0.1 * np.sin(2 * np.pi * i / 12)
        random_factor = 1 + np.random.normal(0, 0.05)
        current_aqi = current_aqi * 0.95 * seasonal_factor * random_factor
        
        future_date = pd.Timestamp(actual[-1]['date']) + pd.DateOffset(months=i+1)
        future.append({
            'date': future_date.strftime('%Y-%m-%d'),
            'aqi': round(float(current_aqi), 2)
        })
    
    return jsonify({
        'city': city,
        'model': model,
        'horizon': horizon,
        'historical': actual,
        'forecast': future
    })

@app.route('/api/stats', methods=['GET'])
def get_overall_stats():
    """Get overall statistics across all cities"""
    if data is None:
        return jsonify({'error': 'Data not loaded'}), 500
    
    stats = {
        'total_records': len(data),
        'cities_count': data['City'].nunique(),
        'date_range': {
            'start': data['Date'].min().strftime('%Y-%m-%d'),
            'end': data['Date'].max().strftime('%Y-%m-%d')
        },
        'average_aqi': float(data['AQI'].mean()) if pd.notna(data['AQI'].mean()) else None,
        'max_aqi': float(data['AQI'].max()) if pd.notna(data['AQI'].max()) else None,
        'min_aqi': float(data['AQI'].min()) if pd.notna(data['AQI'].min()) else None
    }
    
    return jsonify(stats)

@app.route('/api/compare', methods=['GET'])
def compare_cities():
    """Compare AQI across multiple cities"""
    cities = request.args.getlist('cities')
    
    if not cities:
        return jsonify({'error': 'Please provide cities parameter'}), 400
    
    comparison = []
    for city in cities:
        latest = get_latest_aqi(city)
        if latest:
            comparison.append(latest)
    
    return jsonify({
        'cities': comparison,
        'count': len(comparison)
    })

# Error handlers

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

# Main

if __name__ == '__main__':
    print("=" * 60)
    print("Air Quality Forecasting API")
    print("=" * 60)
    
    if data is not None:
        print(f"✓ Data loaded: {len(data)} records")
        print(f"✓ Cities available: {data['City'].nunique()}")
        print(f"✓ Date range: {data['Date'].min()} to {data['Date'].max()}")
    else:
        print("⚠ Warning: No data loaded")
        print(f"  Expected data file at: {DATA_FILE}")
        print("  API will run with limited functionality")
    
    print("\n" + "=" * 60)
    print("API Endpoints:")
    print("=" * 60)
    print("GET /api/health              - Health check")
    print("GET /api/cities              - List all cities")
    print("GET /api/aqi/<city>          - Latest AQI for city")
    print("GET /api/trend/<city>        - AQI trend for city")
    print("GET /api/monthly/<city>      - Monthly average AQI")
    print("GET /api/pollutants/<city>   - Pollutant statistics")
    print("GET /api/forecast/<city>     - Forecast for city")
    print("GET /api/stats               - Overall statistics")
    print("GET /api/compare?cities=...  - Compare cities")
    print("=" * 60)
    print("\nStarting server on http://localhost:5000")
    print("=" * 60 + "\n")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
