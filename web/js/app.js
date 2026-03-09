// ===== Configuration =====
const APP_CONFIG = {
    useRealTimeData: true,
    refreshInterval: 300000, // 5 minutes
    defaultCity: 'Delhi'
};

// ===== Data Store =====
const appData = {
    currentPage: 'dashboard',
    selectedCity: APP_CONFIG.defaultCity,
    selectedModel: 'sarima',
    forecastHorizon: 6,
    realTimeData: {},
    lastUpdate: null,
    dataSource: 'sample',

    // Sample AQI data for demonstration
    cities: ['Delhi', 'Mumbai', 'Jaipur', 'Guwahati', 'Bangalore'],

    // Sample monthly AQI data
    aqiData: {
        Delhi: [156, 178, 165, 142, 189, 203, 178, 145, 167, 198, 245, 287, 302, 278, 234, 198, 176, 189, 201, 223, 256, 289, 312, 298],
        Mumbai: [89, 95, 102, 87, 76, 82, 78, 69, 73, 88, 96, 104, 98, 89, 85, 79, 82, 90, 97, 105, 112, 119, 108, 102],
        Jaipur: [134, 145, 138, 129, 152, 167, 156, 142, 149, 165, 189, 203, 198, 176, 165, 158, 167, 179, 192, 208, 221, 234, 218, 205],
        Guwahati: [67, 73, 79, 65, 58, 62, 55, 48, 52, 64, 71, 78, 76, 68, 63, 59, 65, 72, 79, 86, 93, 87, 81, 75],
        Bangalore: [78, 84, 91, 76, 69, 73, 67, 61, 65, 77, 85, 92, 89, 81, 76, 72, 78, 86, 93, 99, 106, 112, 105, 98]
    },

    // Forecast data
    forecastData: {
        sarima: {
            actual: [198, 223, 256, 289, 312, 298],
            predicted: [202, 218, 248, 276, 305, 292],
            future: [285, 267, 245, 220, 198, 185]
        },
        lstm: {
            actual: [198, 223, 256, 289, 312, 298],
            predicted: [195, 225, 259, 285, 308, 295],
            future: [288, 270, 248, 225, 203, 188]
        },
        prophet: {
            actual: [198, 223, 256, 289, 312, 298],
            predicted: [200, 221, 252, 281, 310, 296],
            future: [290, 272, 250, 228, 205, 190]
        }
    },

    // Pollutant data
    pollutantData: {
        PM25: 89.4,
        PM10: 156.2,
        NO2: 45.3,
        CO: 1245.6,
        SO2: 18.7,
        O3: 32.1
    },

    // Model performance metrics
    modelMetrics: {
        sarima: { rmse: 25.3, mae: 20.1, mape: 13.5, r2: 0.82 },
        lstm: { rmse: 21.8, mae: 17.6, mape: 11.2, r2: 0.89 },
        prophet: { rmse: 23.5, mae: 18.8, mape: 12.3, r2: 0.86 }
    }
};

// ===== Chart Instances =====
let charts = {
    overview: null,
    trend: null,
    pollutantPie: null,
    monthlyPattern: null,
    forecast: null,
    modelComparison: null
};

// ===== Real-Time Data Functions =====
async function fetchRealTimeData(cityName) {
    if (!APP_CONFIG.useRealTimeData || typeof OpenMeteoAQ === 'undefined') {
        return null;
    }

    try {
        console.log(`Fetching real-time data for ${cityName}...`);
        const data = await OpenMeteoAQ.getCurrentAirQuality(cityName);

        appData.realTimeData[cityName] = data;
        appData.lastUpdate = new Date();
        appData.dataSource = 'openmeteo';

        console.log(`✓ Got real-time data for ${cityName}:`, data);
        return data;
    } catch (error) {
        console.error(`Error fetching real-time data for ${cityName}:`, error);
        return null;
    }
}

async function fetchAllCitiesRealTime() {
    if (!APP_CONFIG.useRealTimeData || typeof OpenMeteoAQ === 'undefined') {
        return;
    }

    try {
        const cities = OpenMeteoAQ.CITIES.slice(0, 5);
        console.log('Fetching real-time data for cities...');

        const data = await OpenMeteoAQ.getMultipleCities(cities);

        data.forEach(cityData => {
            if (cityData.current) {
                appData.realTimeData[cityData.city] = cityData;
            }
        });

        appData.lastUpdate = new Date();
        appData.dataSource = 'openmeteo';

        console.log('✓ All cities data fetched');

        // Update dashboard if active
        if (appData.currentPage === 'dashboard') {
            updateOverviewChartWithRealData();
        }

        // Update analysis if active
        if (appData.currentPage === 'analysis') {
            updatePollutantChartWithRealData();
        }

        showLiveDataIndicator();
    } catch (error) {
        console.error('Error fetching all cities:', error);
    }
}

function showLiveDataIndicator() {
    const heroSection = document.querySelector('.hero-content');
    if (!heroSection || appData.dataSource !== 'openmeteo') return;

    let badge = document.querySelector('.live-data-badge');
    if (!badge) {
        badge = document.createElement('div');
        badge.className = 'live-data-badge';
        badge.style.cssText = `
            display: inline-flex;
            align-items: center;
            gap: 0.75rem;
            margin-top: 1.5rem;
            padding: 0.75rem 1.25rem;
            background: rgba(79, 172, 254, 0.15);
            border: 1px solid rgba(79, 172, 254, 0.4);
            border-radius: 12px;
            font-size: 0.875rem;
            color: #4facfe;
            animation: fadeIn 0.5s ease-in-out;
        `;

        const subtitle = heroSection.querySelector('.hero-subtitle');
        if (subtitle) {
            subtitle.after(badge);
        }
    }

    badge.innerHTML = `
        <span style="display: inline-block; width: 8px; height: 8px; background: #4facfe; border-radius: 50%; animation: pulse 2s infinite;"></span>
        <span style="font-weight: 600;">Live Data from Open-Meteo</span>
        <span style="opacity: 0.7; font-size: 0.75rem;">Updated: ${appData.lastUpdate.toLocaleTimeString()}</span>
    `;
}

function updateOverviewChartWithRealData() {
    const cities = Object.keys(appData.realTimeData);
    if (cities.length === 0 || !charts.overview) return;

    const currentAQI = cities.map(city =>
        appData.realTimeData[city].current ? appData.realTimeData[city].current.aqi : 0
    );

    charts.overview.data.labels = cities;
    charts.overview.data.datasets[0].data = currentAQI;
    charts.overview.data.datasets[0].label = 'Live AQI';

    // Remove average dataset when using live data
    if (charts.overview.data.datasets.length > 1) {
        charts.overview.data.datasets.splice(1, 1);
    }

    charts.overview.update();
}

async function updatePollutantChartWithRealData() {
    const city = appData.selectedCity;

    if (!appData.realTimeData[city]) {
        await fetchRealTimeData(city);
    }

    const cityData = appData.realTimeData[city];
    if (!cityData || !cityData.current || !charts.pollutantPie) return;

    const current = cityData.current;
    const pollutantValues = [
        current.pm25,
        current.pm10,
        current.no2,
        current.co,
        current.so2,
        current.o3
    ];

    charts.pollutantPie.data.datasets[0].data = pollutantValues;
    charts.pollutantPie.options.plugins.title = {
        display: true,
        text: `Live Pollutant Data for ${city}`,
        color: '#4facfe',
        font: { size: 14, weight: 600 }
    };
    charts.pollutantPie.update();

    // Update pollutant data in appData
    appData.pollutantData = {
        PM25: current.pm25,
        PM10: current.pm10,
        NO2: current.no2,
        CO: current.co,
        SO2: current.so2,
        O3: current.o3
    };
}

// ===== Navigation =====
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            navigateToPage(page);
        });
    });
}

function navigateToPage(page) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));

    const pageElement = document.getElementById(page);
    const navLink = document.querySelector(`[data-page="${page}"]`);

    if (pageElement) {
        pageElement.classList.add('active');
        appData.currentPage = page;
    }

    if (navLink) {
        navLink.classList.add('active');
    }

    setTimeout(() => {
        initializeChartsForPage(page);

        // Fetch real-time data for analysis page
        if (page === 'analysis' && APP_CONFIG.useRealTimeData) {
            updatePollutantChartWithRealData();
        }
    }, 100);
}

// ===== Chart Initialization =====
function initializeChartsForPage(page) {
    switch (page) {
        case 'dashboard':
            initOverviewChart();
            if (APP_CONFIG.useRealTimeData && Object.keys(appData.realTimeData).length > 0) {
                updateOverviewChartWithRealData();
            }
            break;
        case 'analysis':
            initTrendChart();
            initPollutantPieChart();
            initMonthlyPatternChart();
            break;
        case 'forecast':
            initForecastChart();
            break;
        case 'models':
            initModelComparisonChart();
            break;
    }
}

function initOverviewChart() {
    const ctx = document.getElementById('overviewChart');
    if (!ctx) return;

    if (charts.overview) {
        charts.overview.destroy();
    }

    const labels = ['Delhi', 'Mumbai', 'Jaipur', 'Guwahati', 'Bangalore'];
    const currentAQI = [298, 102, 205, 75, 98];
    const avgAQI = [245, 92, 178, 68, 85];

    charts.overview = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Current AQI',
                data: currentAQI,
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 2,
                borderRadius: 8
            },
            {
                label: 'Average AQI',
                data: avgAQI,
                backgroundColor: 'rgba(240, 147, 251, 0.5)',
                borderColor: 'rgba(240, 147, 251, 1)',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#b8c1ec',
                        font: { size: 12, family: 'Inter' }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 25, 51, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#b8c1ec',
                    borderColor: 'rgba(102, 126, 234, 0.5)',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#8892b6', font: { size: 11 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#8892b6', font: { size: 11 } }
                }
            }
        }
    });
}

function initTrendChart() {
    const ctx = document.getElementById('trendChart');
    if (!ctx) return;

    if (charts.trend) {
        charts.trend.destroy();
    }

    const months = ['Jan 2019', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
        'Jan 2020', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const city = appData.selectedCity;
    const data = appData.aqiData[city] || appData.aqiData.Delhi;

    charts.trend = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: `${city} AQI Trend`,
                data: data,
                borderColor: 'rgba(102, 126, 234, 1)',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#b8c1ec', font: { size: 12, family: 'Inter' } }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 25, 51, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#b8c1ec',
                    borderColor: 'rgba(102, 126, 234, 0.5)',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#8892b6', font: { size: 11 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#8892b6', font: { size: 11 }, maxRotation: 45, minRotation: 45 }
                }
            }
        }
    });
}

function initPollutantPieChart() {
    const ctx = document.getElementById('pollutantPieChart');
    if (!ctx) return;

    if (charts.pollutantPie) {
        charts.pollutantPie.destroy();
    }

    charts.pollutantPie = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['PM2.5', 'PM10', 'NO₂', 'CO', 'SO₂', 'O₃'],
            datasets: [{
                data: [
                    appData.pollutantData.PM25,
                    appData.pollutantData.PM10,
                    appData.pollutantData.NO2,
                    appData.pollutantData.CO,
                    appData.pollutantData.SO2,
                    appData.pollutantData.O3
                ],
                backgroundColor: [
                    'rgba(102, 126, 234, 0.9)',
                    'rgba(240, 147, 251, 0.9)',
                    'rgba(79, 172, 254, 0.9)',
                    'rgba(107, 207, 127, 0.9)',
                    'rgba(255, 215, 61, 0.9)',
                    'rgba(255, 107, 107, 0.9)'
                ],
                borderColor: '#0a0e27',
                borderWidth: 3,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: '#b8c1ec',
                        font: { size: 13, family: 'Inter', weight: 500 },
                        padding: 18,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 25, 51, 0.95)',
                    titleColor: '#ffffff',
                    bodyColor: '#b8c1ec',
                    borderColor: 'rgba(102, 126, 234, 0.6)',
                    borderWidth: 2,
                    padding: 14,
                    cornerRadius: 10,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    callbacks: {
                        label: function (context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            return label + ': ' + value.toFixed(1) + ' μg/m³';
                        },
                        afterLabel: function (context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `(${percentage}% of total)`;
                        }
                    }
                }
            }
        }
    });
}

function initMonthlyPatternChart() {
    const ctx = document.getElementById('monthlyPatternChart');
    if (!ctx) return;

    if (charts.monthlyPattern) {
        charts.monthlyPattern.destroy();
    }

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const avgAQI = [287, 245, 198, 165, 142, 145, 156, 178, 189, 198, 245, 302];

    charts.monthlyPattern = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: months,
            datasets: [{
                label: 'Average AQI by Month',
                data: avgAQI,
                borderColor: 'rgba(240, 147, 251, 1)',
                backgroundColor: 'rgba(240, 147, 251, 0.2)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(240, 147, 251, 1)',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#b8c1ec', font: { size: 12, family: 'Inter' } }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 25, 51, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#b8c1ec',
                    borderColor: 'rgba(240, 147, 251, 0.5)',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#8892b6', font: { size: 10 }, backdropColor: 'transparent' },
                    pointLabels: { color: '#b8c1ec', font: { size: 11 } }
                }
            }
        }
    });
}

function initForecastChart() {
    const ctx = document.getElementById('forecastChart');
    if (!ctx) return;

    if (charts.forecast) {
        charts.forecast.destroy();
    }

    const model = appData.selectedModel;
    const forecastData = appData.forecastData[model] || appData.forecastData.sarima;

    const historicalMonths = ['Jul 2020', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const futureMonths = ['Jan 2021', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const allMonths = [...historicalMonths, ...futureMonths];

    charts.forecast = new Chart(ctx, {
        type: 'line',
        data: {
            labels: allMonths,
            datasets: [
                {
                    label: 'Actual Historical',
                    data: [...forecastData.actual, null, null, null, null, null, null],
                    borderColor: 'rgba(102, 126, 234, 1)',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    pointRadius: 5,
                    pointBackgroundColor: 'rgba(102, 126, 234, 1)',
                    fill: false
                },
                {
                    label: 'Model Prediction',
                    data: [...forecastData.predicted, null, null, null, null, null, null],
                    borderColor: 'rgba(240, 147, 251, 1)',
                    backgroundColor: 'rgba(240, 147, 251, 0.1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 4,
                    pointBackgroundColor: 'rgba(240, 147, 251, 1)',
                    fill: false
                },
                {
                    label: 'Future Forecast',
                    data: [null, null, null, null, null, forecastData.actual[5], ...forecastData.future],
                    borderColor: 'rgba(79, 172, 254, 1)',
                    backgroundColor: 'rgba(79, 172, 254, 0.1)',
                    borderWidth: 3,
                    borderDash: [10, 5],
                    pointRadius: 5,
                    pointBackgroundColor: 'rgba(79, 172, 254, 1)',
                    fill: true,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: '#b8c1ec', font: { size: 12, family: 'Inter' } }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 25, 51, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#b8c1ec',
                    borderColor: 'rgba(102, 126, 234, 0.5)',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#8892b6', font: { size: 11 } }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#8892b6', font: { size: 11 } }
                }
            }
        }
    });

    updateForecastMetrics(model);
}

function updateForecastMetrics(model) {
    const metrics = appData.modelMetrics[model];
    if (!metrics) return;

    document.getElementById('rmseValue').textContent = metrics.rmse.toFixed(2);
    document.getElementById('maeValue').textContent = metrics.mae.toFixed(2);
    document.getElementById('mapeValue').textContent = metrics.mape.toFixed(1) + '%';
    document.getElementById('r2Value').textContent = metrics.r2.toFixed(2);
}

function initModelComparisonChart() {
    const ctx = document.getElementById('modelComparisonChart');
    if (!ctx) return;

    if (charts.modelComparison) {
        charts.modelComparison.destroy();
    }

    const models = ['SARIMA', 'LSTM', 'Prophet'];
    const rmseData = [25.3, 21.8, 23.5];
    const maeData = [20.1, 17.6, 18.8];
    const mapeData = [13.5, 11.2, 12.3];

    charts.modelComparison = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: models,
            datasets: [
                { label: 'RMSE', data: rmseData, backgroundColor: 'rgba(102, 126, 234, 0.8)', borderColor: 'rgba(102, 126, 234, 1)', borderWidth: 2, borderRadius: 8 },
                { label: 'MAE', data: maeData, backgroundColor: 'rgba(240, 147, 251, 0.8)', borderColor: 'rgba(240, 147, 251, 1)', borderWidth: 2, borderRadius: 8 },
                { label: 'MAPE', data: mapeData, backgroundColor: 'rgba(79, 172, 254, 0.8)', borderColor: 'rgba(79, 172, 254, 1)', borderWidth: 2, borderRadius: 8 }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: '#b8c1ec', font: { size: 12, family: 'Inter' } } },
                tooltip: {
                    backgroundColor: 'rgba(15, 25, 51, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#b8c1ec',
                    borderColor: 'rgba(102, 126, 234, 0.5)',
                    borderWidth: 1,
                    padding: 12,
                    cornerRadius: 8
                }
            },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#8892b6', font: { size: 11 } } },
                x: { grid: { display: false }, ticks: { color: '#8892b6', font: { size: 11 } } }
            }
        }
    });
}

// ===== Event Listeners =====
function setupEventListeners() {
    const citySelect = document.getElementById('citySelect');
    if (citySelect) {
        citySelect.addEventListener('change', async (e) => {
            appData.selectedCity = e.target.value;
            initTrendChart();
            if (APP_CONFIG.useRealTimeData) {
                await updatePollutantChartWithRealData();
            }
        });
    }

    const modelSelect = document.getElementById('modelSelect');
    if (modelSelect) {
        modelSelect.addEventListener('change', (e) => {
            appData.selectedModel = e.target.value;
            initForecastChart();
        });
    }

    const forecastCity = document.getElementById('forecastCity');
    if (forecastCity) {
        forecastCity.addEventListener('change', (e) => {
            appData.selectedCity = e.target.value;
            initForecastChart();
        });
    }

    const forecastHorizon = document.getElementById('forecastHorizon');
    if (forecastHorizon) {
        forecastHorizon.addEventListener('change', (e) => {
            appData.forecastHorizon = parseInt(e.target.value);
            initForecastChart();
        });
    }
}

// ===== Add Styles =====
function addLiveIndicatorStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0%, 100% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.5; transform: scale(1.2); }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
}

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Air Quality Dashboard initializing...');

    addLiveIndicatorStyles();
    setupNavigation();
    setupEventListeners();
    initOverviewChart();

    // Check if Open-Meteo is available
    if (typeof OpenMeteoAQ !== 'undefined') {
        console.log('✓ Open-Meteo API available');

        if (APP_CONFIG.useRealTimeData) {
            await fetchAllCitiesRealTime();

            // Auto-refresh
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

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    console.log('✓ Dashboard ready!');
});

// ===== Utility Functions =====
function getAQICategory(aqi) {
    if (aqi <= 50) return { category: 'Good', color: '#6bcf7f' };
    if (aqi <= 100) return { category: 'Satisfactory', color: '#4facfe' };
    if (aqi <= 200) return { category: 'Moderate', color: '#ffd93d' };
    if (aqi <= 300) return { category: 'Poor', color: '#fa709a' };
    if (aqi <= 400) return { category: 'Very Poor', color: '#ff6b6b' };
    return { category: 'Severe', color: '#9b51e0' };
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Export for global access
window.navigateToPage = navigateToPage;
window.fetchAllCitiesRealTime = fetchAllCitiesRealTime;
