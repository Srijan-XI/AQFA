# Open-Meteo Air Quality API Integration

## 🌍 Overview

The Air Quality Dashboard now includes real-time data integration with **Open-Meteo's Air Quality API**, providing live air quality measurements and forecasts for cities across India.

## ✨ Features

### Real-Time Data
- ✅ **Current AQI** - Live Air Quality Index
- ✅ **PM2.5 & PM10** - Particulate matter concentrations
- ✅ **NO₂, CO, SO₂, O₃** - Gas pollutant levels
- ✅ **European & US AQI** - Multiple AQI standards
- ✅ **UV Index** - Solar radiation levels
- ✅ **Dust levels** - Atmospheric dust concentration

### Forecast Capabilities
- ✅ **Hourly forecasts** up to 5 days
- ✅ **Daily averages** with aggregation
- ✅ **Multiple cities** comparison
- ✅ **Health recommendations** based on AQI

### Smart Features
- ✅ **Automatic retry** with exponential backoff
- ✅ **Error handling** with graceful degradation
- ✅ **Auto-refresh** every 5 minutes
- ✅ **Live data indicators** on dashboard
- ✅ **No API key required** - completely free

## 🚀 Quick Start

### Option 1: View Live Dashboard

Simply open the live demo page:

```bash
cd web
start live.html
```

This will show real-time air quality for 10 Indian cities!

### Option 2: Integrate into Main App

The main dashboard (index.html) already includes the integration. Just open it:

```bash
start index.html
```

Look for the "Live Data from Open-Meteo" badge on the dashboard.

## 📁 Files Created

```
web/
├── openmeteo.js         # Core API integration module
├── app-enhanced.js      # Enhanced app.js with real-time features
├── live.html            # Standalone live dashboard
└── OPENMETEO.md         # This documentation
```

## 📖 API Usage

### Get Current Air Quality

```javascript
// Fetch current AQI for Delhi
const data = await OpenMeteoAQ.getCurrentAirQuality('Delhi');

console.log(data);
// {
//   city: 'Delhi',
//   timestamp: '2025-12-12T00:30',
//   current: {
//     aqi: 156,
//     category: 'Unhealthy for Sensitive',
//     pm25: 89.4,
//     pm10: 156.2,
//     no2: 45.3,
//     ...
//   }
// }
```

### Get 7-Day Forecast

```javascript
// Get daily forecast
const forecast = await OpenMeteoAQ.getDailyAverage('Mumbai', 7);

console.log(forecast);
// {
//   city: 'Mumbai',
//   daily: [
//     { date: '2025-12-12', aqi: 102, pm25: 45.2, ... },
//     { date: '2025-12-13', aqi: 98, pm25: 42.1, ... },
//     ...
//   ]
// }
```

### Compare Multiple Cities

```javascript
// Get data for multiple cities at once
const cities = ['Delhi', 'Mumbai', 'Bangalore'];
const comparison = await OpenMeteoAQ.getMultipleCities(cities);

comparison.forEach(cityData => {
    console.log(`${cityData.city}: AQI ${cityData.current.aqi}`);
});
```

### Get Health Recommendations

```javascript
// Get health advice based on AQI
const recommendations = OpenMeteoAQ.getHealthRecommendations(156);

console.log(recommendations);
// {
//   category: 'Unhealthy for Sensitive',
//   level: 3,
//   general: 'Sensitive groups may experience health effects.',
//   sensitive: 'Reduce prolonged outdoor exertion...',
//   icon: '😐'
// }
```

## 🎯 Available Cities

The integration supports 10 major Indian cities:

1. **Delhi** (28.61°N, 77.21°E)
2. **Mumbai** (19.08°N, 72.88°E)
3. **Bangalore** (12.97°N, 77.59°E)
4. **Jaipur** (26.91°N, 75.79°E)
5. **Guwahati** (26.14°N, 91.74°E)
6. **Kolkata** (22.57°N, 88.36°E)
7. **Chennai** (13.08°N, 80.27°E)
8. **Hyderabad** (17.39°N, 78.49°E)
9. **Pune** (18.52°N, 73.86°E)
10. **Ahmedabad** (23.02°N, 72.57°E)

### Adding More Cities

To add more cities, edit `openmeteo.js`:

```javascript
const CITY_COORDINATES = {
    'YourCity': { lat: 12.34, lon: 56.78, name: 'YourCity' },
    // ... existing cities
};
```

## 📊 Data Points

### Current Measurements
| Parameter | Unit | Description |
|-----------|------|-------------|
| `pm2_5` | μg/m³ | Fine particulate matter |
| `pm10` | μg/m³ | Coarse particulate matter |
| `carbon_monoxide` | μg/m³ | CO concentration |
| `nitrogen_dioxide` | μg/m³ | NO₂ concentration |
| `sulphur_dioxide` | μg/m³ | SO₂ concentration |
| `ozone` | μg/m³ | O₃ concentration |
| `dust` | μg/m³ | Atmospheric dust |
| `uv_index` | index | UV radiation level |
| `european_aqi` | index | European AQI standard |
| `us_aqi` | index | US EPA AQI standard |

## 🎨 Integration Examples

### Update Dashboard with Live Data

```javascript
// In your app.js or custom script
async function updateDashboard() {
    try {
        const cities = ['Delhi', 'Mumbai', 'Bangalore'];
        const data = await OpenMeteoAQ.getMultipleCities(cities);
        
        // Update your chart
        chart.data.labels = data.map(d => d.city);
        chart.data.datasets[0].data = data.map(d => d.current.aqi);
        chart.update();
        
        console.log('✓ Dashboard updated with live data');
    } catch (error) {
        console.error('Error updating dashboard:', error);
    }
}

// Update every 5 minutes
setInterval(updateDashboard, 5 * 60 * 1000);
```

### Show Live Data Indicator

```javascript
// Add a "LIVE" badge to your page
function showLiveIndicator(cityData) {
    const badge = document.createElement('div');
    badge.className = 'live-badge';
    badge.innerHTML = `
        <span class="pulse-dot"></span>
        LIVE: ${cityData.city} AQI ${cityData.current.aqi}
        <small>Updated: ${new Date(cityData.timestamp).toLocaleTimeString()}</small>
    `;
    document.body.appendChild(badge);
}
```

### Create AQI Alert System

```javascript
// Alert users when AQI is unhealthy
async function checkAirQualityAlert(cityName) {
    const data = await OpenMeteoAQ.getCurrentAirQuality(cityName);
    const recommendations = OpenMeteoAQ.getHealthRecommendations(data.current.aqi);
    
    if (recommendations.level >= 4) {
        alert(`⚠️ Air Quality Alert for ${cityName}!
        
AQI: ${data.current.aqi} (${recommendations.category})

${recommendations.general}

Recommendation: ${recommendations.sensitive}`);
    }
}
```

## 🔧 Configuration

### Enable/Disable Real-Time Data

In `app-enhanced.js`:

```javascript
const APP_CONFIG = {
    useRealTimeData: true,  // Set to false to use sample data
    refreshInterval: 300000, // 5 minutes in milliseconds
    defaultCity: 'Delhi'
};
```

### Adjust Retry Settings

In `openmeteo.js`:

```javascript
const OPENMETEO_CONFIG = {
    baseUrl: 'https://air-quality.open-meteo.com/v1/air-quality',
    timezone: 'Asia/Kolkata',
    retryAttempts: 3,      // Number of retry attempts
    retryDelay: 1000       // Initial delay in ms
};
```

## 🌐 API Endpoints

### Base URL
```
https://air-quality.open-meteo.com/v1/air-quality
```

### Example Request
```
https://air-quality.open-meteo.com/v1/air-quality
  ?latitude=28.6139
  &longitude=77.2090
  &current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide
  &timezone=Asia/Kolkata
```

### Response Format
```json
{
  "current": {
    "time": "2025-12-12T00:30",
    "pm10": 156.2,
    "pm2_5": 89.4,
    "carbon_monoxide": 1245.6,
    "nitrogen_dioxide": 45.3,
    "us_aqi": 156
  }
}
```

## 💡 Best Practices

### 1. Cache Data
```javascript
let cachedData = {};
let cacheTime = 5 * 60 * 1000; // 5 minutes

async function getCachedData(city) {
    const now = Date.now();
    if (cachedData[city] && (now - cachedData[city].timestamp < cacheTime)) {
        return cachedData[city].data;
    }
    
    const data = await OpenMeteoAQ.getCurrentAirQuality(city);
    cachedData[city] = { data, timestamp: now };
    return data;
}
```

### 2. Handle Errors Gracefully
```javascript
async function safeGetAirQuality(city) {
    try {
        return await OpenMeteoAQ.getCurrentAirQuality(city);
    } catch (error) {
        console.error(`Failed to get data for ${city}:`, error);
        // Fallback to cached or sample data
        return getSampleData(city);
    }
}
```

### 3. Show Loading States
```javascript
async function loadWithSpinner(cityName) {
    const spinner = document.getElementById('spinner');
    spinner.style.display = 'block';
    
    try {
        const data = await OpenMeteoAQ.getCurrentAirQuality(cityName);
        updateUI(data);
    } finally {
        spinner.style.display = 'none';
    }
}
```

## 🐛 Troubleshooting

### Issue: "City not found"
**Solution**: Check if the city is in `CITY_COORDINATES` object in `openmeteo.js`

### Issue: CORS errors
**Solution**: The Open-Meteo API supports CORS. Make sure you're loading the page via HTTP (not file://)

```bash
# Use a local server
python -m http.server 8000
```

### Issue: Data not updating
**Solution**: Check browser console for errors and verify internet connection

```javascript
// Test API manually
OpenMeteoAQ.getCurrentAirQuality('Delhi')
    .then(data => console.log('✓ API working:', data))
    .catch(err => console.error('✗ API error:', err));
```

### Issue: High latency
**Solution**: Implement caching to reduce API calls

```javascript
// Cache results for 5 minutes
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000;
```

## 📈 Performance Tips

1. **Batch Requests**: Use `getMultipleCities()` instead of multiple individual calls
2. **Cache Results**: Store results for 5-10 minutes
3. **Lazy Loading**: Only fetch data when needed
4. **Debounce Updates**: Limit refresh rate to prevent API spam

## 🔐 Security & Privacy

- ✅ **No API Key Required** - No authentication needed
- ✅ **No Personal Data** - Only geographic coordinates used
- ✅ **HTTPS Only** - All requests use secure HTTPS
- ✅ **Open Source** - Fully transparent code
- ✅ **No Tracking** - No cookies or tracking

## 📚 Additional Resources

- **Open-Meteo Docs**: https://open-meteo.com/en/docs/air-quality-api
- **CAMS Data Source**: https://atmosphere.copernicus.eu/
- **EPA AQI Guide**: https://www.airnow.gov/aqi/aqi-basics/
- **WHO Air Quality**: https://www.who.int/health-topics/air-pollution

## 🆘 Support

For issues or questions:

1. Check browser console for errors
2. Verify internet connection
3. Test API directly: https://air-quality.open-meteo.com/v1/air-quality?latitude=28.6139&longitude=77.2090&current=pm2_5
4. Review this documentation

## 🎉 Examples in Action

### Simple Dashboard Widget

```html
<div id="aqi-widget"></div>

<script src="openmeteo.js"></script>
<script>
async function updateWidget() {
    const data = await OpenMeteoAQ.getCurrentAirQuality('Delhi');
    const widget = document.getElementById('aqi-widget');
    
    widget.innerHTML = `
        <h3>Delhi Air Quality</h3>
        <div class="aqi" style="color: ${data.current.color}">
            ${data.current.aqi}
        </div>
        <p>${data.current.category}</p>
    `;
}

updateWidget();
setInterval(updateWidget, 5 * 60 * 1000);
</script>
```

### Comparison Table

```javascript
async function createComparisonTable(cities) {
    const data = await OpenMeteoAQ.getMultipleCities(cities);
    
    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>City</th>
                <th>AQI</th>
                <th>PM2.5</th>
                <th>Category</th>
            </tr>
        </thead>
        <tbody>
            ${data.map(city => `
                <tr>
                    <td>${city.city}</td>
                    <td>${city.current.aqi}</td>
                    <td>${city.current.pm25}</td>
                    <td>${city.current.category}</td>
                </tr>
            `).join('')}
        </tbody>
    `;
    
    return table;
}
```

---

**Powered by Open-Meteo** 🌍  
**Free, open-source air quality data for everyone**

Last Updated: December 2025
