/**
 * Enhanced App.js with Open-Meteo Integration
 * Combines sample data with real-time Open-Meteo air quality data
 */

// ===== Configuration =====
const APP_CONFIG = {
    useRealTimeData: true,  // Set to true to use Open-Meteo API
    refreshInterval: 300000, // Refresh data every 5 minutes
    defaultCity: 'Delhi'
};

// ===== State Management =====
let appState = {
    currentPage: 'dashboard',
    selectedCity: APP_CONFIG.defaultCity,
    selectedModel: 'sarima',
    forecastHorizon: 6,
    realTimeData: {},
    lastUpdate: null,
    dataSource: 'sample' // 'sample' or 'openmeteo'
};

// ===== Real-Time Data Fetching =====

/**
 * Fetch real-time data from Open-Meteo for a city
 */
async function fetchRealTimeData(cityName) {
    if (!APP_CONFIG.useRealTimeData || typeof OpenMeteoAQ === 'undefined') {
        console.log('Real-time data disabled or OpenMeteo not loaded');
        return null;
    }

    try {
        console.log(`Fetching real-time data for ${cityName}...`);
        const data = await OpenMeteoAQ.getCurrentAirQuality(cityName);

        appState.realTimeData[cityName] = data;
        appState.lastUpdate = new Date();
        appState.dataSource = 'openmeteo';

        console.log(`✓ Got real-time data for ${cityName}:`, data);
        return data;
    } catch (error) {
        console.error(`Error fetching real-time data for ${cityName}:`, error);
        return null;
    }
}

/**
 * Fetch real-time data for all cities
 */
async function fetchAllCitiesRealTime() {
    if (!APP_CONFIG.useRealTimeData || typeof OpenMeteoAQ === 'undefined') {
        return;
    }

    try {
        const cities = OpenMeteoAQ.CITIES;
        console.log('Fetching real-time data for all cities...');

        const data = await OpenMeteoAQ.getMultipleCities(cities);

        data.forEach(cityData => {
            if (cityData.current) {
                appState.realTimeData[cityData.city] = cityData;
            }
        });

        appState.lastUpdate = new Date();
        appState.dataSource = 'openmeteo';

        console.log('✓ All cities data fetched:', data);

        // Update dashboard if we're on it
        if (appState.currentPage === 'dashboard') {
            updateDashboardWithRealTime();
        }
    } catch (error) {
        console.error('Error fetching all cities:', error);
    }
}

/**
 * Get daily forecast for a city
 */
async function fetchDailyForecast(cityName, days = 7) {
    if (!APP_CONFIG.useRealTimeData || typeof OpenMeteoAQ === 'undefined') {
        return null;
    }

    try {
        const data = await OpenMeteoAQ.getDailyAverage(cityName, days);
        console.log(`✓ Got ${days}-day forecast for ${cityName}:`, data);
        return data;
    } catch (error) {
        console.error(`Error fetching forecast for ${cityName}:`, error);
        return null;
    }
}

// ===== Dashboard Updates with Real-Time Data =====

/**
 * Update dashboard with real-time data
 */
function updateDashboardWithRealTime() {
    if (Object.keys(appState.realTimeData).length === 0) {
        return;
    }

    // Update stat cards with real data
    const cities = Object.keys(appState.realTimeData);
    if (cities.length > 0) {
        const avgAQI = cities.reduce((sum, city) => {
            const data = appState.realTimeData[city];
            return sum + (data.current ? data.current.aqi : 0);
        }, 0) / cities.length;

        // Update the AQI overview chart with real data
        if (charts.overview) {
            updateOverviewChartWithRealData();
        }

        // Show data source indicator
        showDataSourceIndicator();
    }
}

/**
 * Show indicator that real-time data is being used
 */
function showDataSourceIndicator() {
    // Add a badge to show data is live
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle && appState.dataSource === 'openmeteo') {
        const badge = document.createElement('div');
        badge.className = 'live-data-badge';
        badge.innerHTML = `
            <span class="pulse-dot"></span>
            <span>Live Data from Open-Meteo</span>
            <span class="update-time">Updated: ${appState.lastUpdate.toLocaleTimeString()}</span>
        `;
        badge.style.cssText = `
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            margin-top: 1rem;
            padding: 0.5rem 1rem;
            background: rgba(79, 172, 254, 0.1);
            border: 1px solid rgba(79, 172, 254, 0.3);
            border-radius: 8px;
            font-size: 0.875rem;
            color: #4facfe;
        `;

        // Remove old badge if exists
        const oldBadge = document.querySelector('.live-data-badge');
        if (oldBadge) oldBadge.remove();

        heroSubtitle.parentElement.insertBefore(badge, heroSubtitle.nextSibling);
    }
}

/**
 * Update overview chart with real-time data
 */
function updateOverviewChartWithRealData() {
    const cities = Object.keys(appState.realTimeData).slice(0, 5);
    const currentAQI = cities.map(city =>
        appState.realTimeData[city].current ? appState.realTimeData[city].current.aqi : 0
    );

    if (charts.overview) {
        charts.overview.data.labels = cities;
        charts.overview.data.datasets[0].data = currentAQI;
        charts.overview.data.datasets[0].label = 'Current AQI (Live)';
        charts.overview.update();
    }
}

// ===== Add Real-Time Controls =====

/**
 * Add control to toggle real-time data
 */
function addRealTimeControls() {
    const controls = document.querySelector('.controls');
    if (!controls) return;

    const toggleControl = document.createElement('div');
    toggleControl.className = 'control-group';
    toggleControl.innerHTML = `
        <label for="realTimeToggle">
            <input type="checkbox" id="realTimeToggle" ${APP_CONFIG.useRealTimeData ? 'checked' : ''}>
            Use Real-Time Data (Open-Meteo)
        </label>
        <button id="refreshData" class="refresh-btn" style="
            padding: 0.5rem 1rem;
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            margin-top: 0.5rem;
        ">
            🔄 Refresh Data
        </button>
    `;

    controls.appendChild(toggleControl);

    // Event listeners
    document.getElementById('realTimeToggle')?.addEventListener('change', (e) => {
        APP_CONFIG.useRealTimeData = e.target.checked;
        if (e.target.checked) {
            fetchAllCitiesRealTime();
        }
    });

    document.getElementById('refreshData')?.addEventListener('click', async () => {
        const btn = document.getElementById('refreshData');
        btn.textContent = '⏳ Loading...';
        btn.disabled = true;

        await fetchAllCitiesRealTime();

        btn.textContent = '✓ Refreshed!';
        setTimeout(() => {
            btn.textContent = '🔄 Refresh Data';
            btn.disabled = false;
        }, 2000);
    });
}

// ===== Enhanced Chart Updates =====

/**
 * Update trend chart with forecast data from Open-Meteo
 */
async function updateTrendChartWithForecast(cityName) {
    const forecastData = await fetchDailyForecast(cityName, 7);

    if (!forecastData || !charts.trend) return;

    const labels = forecastData.daily.map(d => d.date);
    const aqiData = forecastData.daily.map(d => d.aqi);

    charts.trend.data.labels = labels;
    charts.trend.data.datasets[0].data = aqiData;
    charts.trend.data.datasets[0].label = `${cityName} AQI Forecast (Next 7 Days)`;
    charts.trend.update();
}

// ===== Add CSS for live indicator =====
function addLiveIndicatorStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .pulse-dot {
            display: inline-block;
            width: 8px;
            height: 8px;
            background: #4facfe;
            border-radius: 50%;
            animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
            0%, 100% {
                opacity: 1;
                transform: scale(1);
            }
            50% {
                opacity: 0.5;
                transform: scale(1.2);
            }
        }
        
        .update-time {
            font-size: 0.75rem;
            opacity: 0.7;
            margin-left: 0.5rem;
        }
        
        .refresh-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(79, 172, 254, 0.4);
        }
        
        .refresh-btn:active {
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
}

// ===== Initialize on Page Load =====
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Air Quality Dashboard initializing...');

    // Add styles
    addLiveIndicatorStyles();

    // Check if Open-Meteo is available
    if (typeof OpenMeteoAQ !== 'undefined') {
        console.log('✓ Open-Meteo API loaded');
        console.log('Available cities:', OpenMeteoAQ.CITIES);

        // Fetch initial data
        if (APP_CONFIG.useRealTimeData) {
            await fetchAllCitiesRealTime();
        }

        // Setup auto-refresh
        if (APP_CONFIG.refreshInterval > 0) {
            setInterval(() => {
                if (APP_CONFIG.useRealTimeData) {
                    console.log('Auto-refreshing data...');
                    fetchAllCitiesRealTime();
                }
            }, APP_CONFIG.refreshInterval);
        }
    } else {
        console.warn('⚠ Open-Meteo API not loaded, using sample data');
    }

    // Add real-time controls after a short delay
    setTimeout(addRealTimeControls, 1000);

    console.log('✓ Dashboard ready!');
});

// ===== Export Functions =====
window.AppEnhanced = {
    fetchRealTimeData,
    fetchAllCitiesRealTime,
    fetchDailyForecast,
    updateDashboardWithRealTime,
    appState
};
