/**
 * Open-Meteo Air Quality API Integration
 * Provides real-time and forecast air quality data
 * Documentation: https://open-meteo.com/en/docs/air-quality-api
 */

// ===== Configuration =====
const OPENMETEO_CONFIG = {
    baseUrl: 'https://air-quality.open-meteo.com/v1/air-quality',
    timezone: 'Asia/Kolkata',
    retryAttempts: 3,
    retryDelay: 1000
};

// ===== Indian Cities Coordinates =====
const CITY_COORDINATES = {
    'Delhi': { lat: 28.6139, lon: 77.2090, name: 'Delhi' },
    'Mumbai': { lat: 19.0760, lon: 72.8777, name: 'Mumbai' },
    'Bangalore': { lat: 12.9716, lon: 77.5946, name: 'Bangalore' },
    'Jaipur': { lat: 26.9124, lon: 75.7873, name: 'Jaipur' },
    'Guwahati': { lat: 26.1445, lon: 91.7362, name: 'Guwahati' },
    'Kolkata': { lat: 22.5726, lon: 88.3639, name: 'Kolkata' },
    'Chennai': { lat: 13.0827, lon: 80.2707, name: 'Chennai' },
    'Hyderabad': { lat: 17.3850, lon: 78.4867, name: 'Hyderabad' },
    'Pune': { lat: 18.5204, lon: 73.8567, name: 'Pune' },
    'Ahmedabad': { lat: 23.0225, lon: 72.5714, name: 'Ahmedabad' }
};

// ===== API Parameters =====
const AIR_QUALITY_PARAMS = {
    current: [
        'pm10',
        'pm2_5',
        'carbon_monoxide',
        'nitrogen_dioxide',
        'sulphur_dioxide',
        'ozone',
        'dust',
        'uv_index',
        'european_aqi',
        'us_aqi'
    ],
    hourly: [
        'pm10',
        'pm2_5',
        'carbon_monoxide',
        'nitrogen_dioxide',
        'sulphur_dioxide',
        'ozone',
        'european_aqi',
        'us_aqi'
    ]
};

// ===== Utility Functions =====

/**
 * Calculate AQI from PM2.5 using US EPA standard
 * @param {number} pm25 - PM2.5 concentration (μg/m³)
 * @returns {number} AQI value
 */
function calculateAQI(pm25) {
    // US EPA AQI breakpoints for PM2.5
    const breakpoints = [
        { cLow: 0.0, cHigh: 12.0, iLow: 0, iHigh: 50 },
        { cLow: 12.1, cHigh: 35.4, iLow: 51, iHigh: 100 },
        { cLow: 35.5, cHigh: 55.4, iLow: 101, iHigh: 150 },
        { cLow: 55.5, cHigh: 150.4, iLow: 151, iHigh: 200 },
        { cLow: 150.5, cHigh: 250.4, iLow: 201, iHigh: 300 },
        { cLow: 250.5, cHigh: 350.4, iLow: 301, iHigh: 400 },
        { cLow: 350.5, cHigh: 500.4, iLow: 401, iHigh: 500 }
    ];

    for (let bp of breakpoints) {
        if (pm25 >= bp.cLow && pm25 <= bp.cHigh) {
            const aqi = ((bp.iHigh - bp.iLow) / (bp.cHigh - bp.cLow)) *
                (pm25 - bp.cLow) + bp.iLow;
            return Math.round(aqi);
        }
    }

    return pm25 > 500 ? 500 : 0;
}

/**
 * Get AQI category and color
 * @param {number} aqi - AQI value
 * @returns {object} Category info with color
 */
function getAQICategory(aqi) {
    if (aqi <= 50) return { category: 'Good', color: '#00e400', level: 1 };
    if (aqi <= 100) return { category: 'Moderate', color: '#ffff00', level: 2 };
    if (aqi <= 150) return { category: 'Unhealthy for Sensitive', color: '#ff7e00', level: 3 };
    if (aqi <= 200) return { category: 'Unhealthy', color: '#ff0000', level: 4 };
    if (aqi <= 300) return { category: 'Very Unhealthy', color: '#8f3f97', level: 5 };
    return { category: 'Hazardous', color: '#7e0023', level: 6 };
}

/**
 * Retry fetch with exponential backoff
 */
async function fetchWithRetry(url, attempts = OPENMETEO_CONFIG.retryAttempts) {
    for (let i = 0; i < attempts; i++) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            if (i === attempts - 1) throw error;
            await new Promise(resolve =>
                setTimeout(resolve, OPENMETEO_CONFIG.retryDelay * Math.pow(2, i))
            );
        }
    }
}

// ===== Main API Functions =====

/**
 * Get current air quality data for a city
 * @param {string} cityName - Name of the city
 * @returns {Promise<object>} Current air quality data
 */
async function getCurrentAirQuality(cityName) {
    const city = CITY_COORDINATES[cityName];
    if (!city) {
        throw new Error(`City ${cityName} not found`);
    }

    const params = new URLSearchParams({
        latitude: city.lat,
        longitude: city.lon,
        current: AIR_QUALITY_PARAMS.current.join(','),
        timezone: OPENMETEO_CONFIG.timezone
    });

    const url = `${OPENMETEO_CONFIG.baseUrl}?${params}`;

    try {
        const data = await fetchWithRetry(url);

        // Calculate AQI from PM2.5
        const pm25 = data.current.pm2_5;
        const calculatedAQI = calculateAQI(pm25);
        const aqiInfo = getAQICategory(calculatedAQI);

        return {
            city: cityName,
            timestamp: data.current.time,
            location: {
                latitude: city.lat,
                longitude: city.lon
            },
            current: {
                aqi: calculatedAQI,
                category: aqiInfo.category,
                color: aqiInfo.color,
                level: aqiInfo.level,
                pm25: data.current.pm2_5,
                pm10: data.current.pm10,
                co: data.current.carbon_monoxide,
                no2: data.current.nitrogen_dioxide,
                so2: data.current.sulphur_dioxide,
                o3: data.current.ozone,
                dust: data.current.dust,
                uvIndex: data.current.uv_index,
                europeanAQI: data.current.european_aqi,
                usAQI: data.current.us_aqi
            },
            units: {
                pm25: 'μg/m³',
                pm10: 'μg/m³',
                co: 'μg/m³',
                no2: 'μg/m³',
                so2: 'μg/m³',
                o3: 'μg/m³',
                dust: 'μg/m³'
            }
        };
    } catch (error) {
        console.error(`Error fetching air quality for ${cityName}:`, error);
        throw error;
    }
}

/**
 * Get hourly air quality forecast for a city
 * @param {string} cityName - Name of the city
 * @param {number} days - Number of days to forecast (max 5)
 * @returns {Promise<object>} Hourly forecast data
 */
async function getHourlyForecast(cityName, days = 3) {
    const city = CITY_COORDINATES[cityName];
    if (!city) {
        throw new Error(`City ${cityName} not found`);
    }

    const params = new URLSearchParams({
        latitude: city.lat,
        longitude: city.lon,
        hourly: AIR_QUALITY_PARAMS.hourly.join(','),
        forecast_days: Math.min(days, 5),
        timezone: OPENMETEO_CONFIG.timezone
    });

    const url = `${OPENMETEO_CONFIG.baseUrl}?${params}`;

    try {
        const data = await fetchWithRetry(url);

        // Process hourly data
        const hourlyData = data.hourly.time.map((time, index) => {
            const pm25 = data.hourly.pm2_5[index];
            const aqi = calculateAQI(pm25);
            const aqiInfo = getAQICategory(aqi);

            return {
                time: time,
                aqi: aqi,
                category: aqiInfo.category,
                pm25: pm25,
                pm10: data.hourly.pm10[index],
                co: data.hourly.carbon_monoxide[index],
                no2: data.hourly.nitrogen_dioxide[index],
                so2: data.hourly.sulphur_dioxide[index],
                o3: data.hourly.ozone[index],
                europeanAQI: data.hourly.european_aqi[index],
                usAQI: data.hourly.us_aqi[index]
            };
        });

        return {
            city: cityName,
            location: {
                latitude: city.lat,
                longitude: city.lon
            },
            forecast: hourlyData
        };
    } catch (error) {
        console.error(`Error fetching forecast for ${cityName}:`, error);
        throw error;
    }
}

/**
 * Get air quality data for multiple cities
 * @param {Array<string>} cities - Array of city names
 * @returns {Promise<Array>} Array of air quality data
 */
async function getMultipleCities(cities) {
    try {
        const promises = cities.map(city => getCurrentAirQuality(city));
        const results = await Promise.allSettled(promises);

        return results.map((result, index) => {
            if (result.status === 'fulfilled') {
                return result.value;
            } else {
                console.error(`Failed to fetch data for ${cities[index]}:`, result.reason);
                return {
                    city: cities[index],
                    error: result.reason.message,
                    current: null
                };
            }
        });
    } catch (error) {
        console.error('Error fetching multiple cities:', error);
        throw error;
    }
}

/**
 * Get daily average air quality
 * @param {string} cityName - Name of the city
 * @param {number} days - Number of days
 * @returns {Promise<Array>} Daily averages
 */
async function getDailyAverage(cityName, days = 7) {
    const hourlyData = await getHourlyForecast(cityName, days);

    // Group by day and calculate averages
    const dailyData = {};

    hourlyData.forecast.forEach(hour => {
        const date = hour.time.split('T')[0];

        if (!dailyData[date]) {
            dailyData[date] = {
                date: date,
                pm25: [],
                pm10: [],
                aqi: [],
                co: [],
                no2: [],
                so2: [],
                o3: []
            };
        }

        dailyData[date].pm25.push(hour.pm25);
        dailyData[date].pm10.push(hour.pm10);
        dailyData[date].aqi.push(hour.aqi);
        dailyData[date].co.push(hour.co);
        dailyData[date].no2.push(hour.no2);
        dailyData[date].so2.push(hour.so2);
        dailyData[date].o3.push(hour.o3);
    });

    // Calculate averages
    const result = Object.keys(dailyData).map(date => {
        const day = dailyData[date];
        const avgAQI = Math.round(day.aqi.reduce((a, b) => a + b, 0) / day.aqi.length);
        const aqiInfo = getAQICategory(avgAQI);

        return {
            date: date,
            aqi: avgAQI,
            category: aqiInfo.category,
            color: aqiInfo.color,
            pm25: Math.round(day.pm25.reduce((a, b) => a + b, 0) / day.pm25.length * 10) / 10,
            pm10: Math.round(day.pm10.reduce((a, b) => a + b, 0) / day.pm10.length * 10) / 10,
            co: Math.round(day.co.reduce((a, b) => a + b, 0) / day.co.length * 10) / 10,
            no2: Math.round(day.no2.reduce((a, b) => a + b, 0) / day.no2.length * 10) / 10,
            so2: Math.round(day.so2.reduce((a, b) => a + b, 0) / day.so2.length * 10) / 10,
            o3: Math.round(day.o3.reduce((a, b) => a + b, 0) / day.o3.length * 10) / 10
        };
    });

    return {
        city: cityName,
        daily: result
    };
}

/**
 * Get health recommendations based on AQI
 * @param {number} aqi - AQI value
 * @returns {object} Health recommendations
 */
function getHealthRecommendations(aqi) {
    const category = getAQICategory(aqi);

    const recommendations = {
        1: {
            general: 'Air quality is satisfactory. Enjoy outdoor activities!',
            sensitive: 'No special precautions needed.',
            icon: '😊'
        },
        2: {
            general: 'Air quality is acceptable. Sensitive groups may experience minor issues.',
            sensitive: 'Consider reducing prolonged outdoor exertion.',
            icon: '🙂'
        },
        3: {
            general: 'Sensitive groups may experience health effects.',
            sensitive: 'Reduce prolonged or heavy outdoor exertion. Watch for symptoms.',
            icon: '😐'
        },
        4: {
            general: 'Everyone may experience health effects.',
            sensitive: 'Avoid prolonged outdoor exertion. Consider wearing masks.',
            icon: '😷'
        },
        5: {
            general: 'Health alert: everyone may experience serious health effects.',
            sensitive: 'Avoid all outdoor physical activities. Stay indoors.',
            icon: '⚠️'
        },
        6: {
            general: 'Health warning: emergency conditions. Everyone is affected.',
            sensitive: 'Remain indoors and keep activity levels low. Use air purifiers.',
            icon: '🚨'
        }
    };

    return {
        category: category.category,
        level: category.level,
        color: category.color,
        ...recommendations[category.level]
    };
}

// ===== Export API =====
const OpenMeteoAQ = {
    // Main functions
    getCurrentAirQuality,
    getHourlyForecast,
    getDailyAverage,
    getMultipleCities,

    // Utilities
    calculateAQI,
    getAQICategory,
    getHealthRecommendations,

    // Constants
    CITIES: Object.keys(CITY_COORDINATES),
    CITY_COORDINATES
};

// Make available globally
if (typeof window !== 'undefined') {
    window.OpenMeteoAQ = OpenMeteoAQ;
}

// Export for Node.js if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OpenMeteoAQ;
}
