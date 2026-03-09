# Air Quality Forecasting - Web Application

A modern, interactive web dashboard for visualizing and forecasting Air Quality Index (AQI) data using machine learning models.

## 🌟 Features

- **Interactive Dashboard**: Real-time AQI overview across multiple cities
- **Data Analysis**: Explore historical trends and pollutant breakdowns
- **Forecasting**: View predictions from SARIMA, LSTM, and Prophet models
- **Model Comparison**: Compare performance metrics across different models
- **Responsive Design**: Beautiful glassmorphism UI with smooth animations

## 🚀 Quick Start

### Option 1: Static Web App (No Backend Required)

Simply open `index.html` in a modern web browser:

```bash
# Open with default browser (Windows)
start index.html

# Or use a local server (recommended)
python -m http.server 8000
# Then visit: http://localhost:8000
```

### Option 2: With Backend API (For Real Data)

1. **Install Python dependencies**:
```bash
pip install flask flask-cors pandas numpy
```

2. **Start the backend server**:
```bash
python api.py
```

3. **Open the web application**:
```bash
# In a new terminal
python -m http.server 8000
```

4. **Visit**: `http://localhost:8000`

## 📁 File Structure

```
web/
├── index.html          # Main HTML file with all pages
├── styles.css          # Complete design system and styles
├── app.js              # JavaScript application logic and charts
├── api.py              # Python Flask API (optional backend)
├── README.md           # This file
└── json/               # JSON data chunks (gitignored)
```

## 🎨 Design Features

### Color Palette
- **Primary Gradient**: Purple to violet (`#667eea` → `#764ba2`)
- **Accent Colors**: Pink, blue, and green gradients
- **Dark Theme**: Deep navy background with glass effects

### UI Elements
- **Glassmorphism**: Frosted glass effect cards
- **Smooth Animations**: Hover effects and page transitions
- **Interactive Charts**: Chart.js powered visualizations
- **Responsive Layout**: Works on desktop, tablet, and mobile

## 📊 Available Pages

### 1. Dashboard
- Hero section with key statistics
- City-wise AQI overview chart
- Key insights cards
- Quick navigation to other sections

### 2. Analysis
- City selector with dropdown
- AQI trend chart over time
- Pollutant breakdown (pie chart)
- Monthly seasonal patterns (radar chart)
- Statistical summary table

### 3. Forecast
- Model selector (SARIMA/LSTM/Prophet/Ensemble)
- City and forecast horizon selection
- Historical vs predicted comparison
- Future forecast visualization
- Performance metrics (RMSE, MAE, MAPE, R²)

### 4. Models
- Detailed model cards with specifications
- Visual performance comparison
- Technical details for each model
- Recommendation badges

### 5. About
- Project overview
- Problem statement
- Dataset information
- Technology stack
- Key findings
- Use cases

## 🔧 Technology Stack

### Frontend
- **HTML5**: Semantic structure
- **CSS3**: Modern styling with CSS variables
- **JavaScript (ES6+)**: Application logic
- **Chart.js**: Interactive charts
- **Google Fonts**: Inter font family

### Backend (Optional)
- **Python**: Flask framework
- **Pandas**: Data processing
- **NumPy**: Numerical computations
- **Flask-CORS**: Cross-origin support

## 📈 Charts & Visualizations

All charts use Chart.js with custom theming:

1. **Bar Charts**: City comparisons, model metrics
2. **Line Charts**: Time series trends, forecasts
3. **Doughnut Charts**: Pollutant breakdowns
4. **Radar Charts**: Seasonal patterns

Chart configuration includes:
- Dark theme colors
- Smooth animations
- Interactive tooltips
- Gradient fills
- Custom styling

## 🎯 Usage

### Navigating the App
Click on navigation links to switch between pages:
- **Dashboard**: Overview and quick stats
- **Analysis**: Explore historical data
- **Forecast**: View predictions
- **Models**: Compare models
- **About**: Learn more

### Interactive Features
- Select different cities from dropdowns
- Choose forecasting models
- Adjust forecast horizons
- View detailed tooltips on charts
- Hover over cards for animations

## 🌐 Browser Support

Recommended browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Features used:
- CSS Grid & Flexbox
- CSS Variables
- Backdrop Filter (glassmorphism)
- ES6 JavaScript
- Chart.js 4.x

## 🔗 Integration with Main Project

This web app integrates with the main Python project:

1. **Data Source**: Uses CSV data from `../datasets/`
2. **Model Results**: Can load predictions from saved models
3. **API Endpoint**: Optional Flask API serves real-time data
4. **JSON Chunks**: Uses preprocessed JSON from `json/` folder

## 📝 Customization

### Changing Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --accent-purple: #667eea;
    /* ... more variables */
}
```

### Adding New Data
Update `appData` object in `app.js`:
```javascript
const appData = {
    cities: ['Delhi', 'Mumbai', ...],
    aqiData: { ... },
    // ... more data
};
```

### Connecting to Real API
Uncomment API calls in `app.js` and ensure `api.py` is running:
```javascript
fetch('http://localhost:5000/api/aqi/Delhi')
    .then(response => response.json())
    .then(data => updateChart(data));
```

## 🚀 Deployment

### Deploy to GitHub Pages
```bash
# Build static version
# No build step needed - already static!

# Push to gh-pages branch
git subtree push --prefix web origin gh-pages
```

### Deploy to Netlify
1. Drag and drop the `web/` folder to Netlify
2. Or connect to GitHub repository
3. Build settings: None needed (static site)

### Deploy with Backend
Use services like:
- **Heroku**: For Flask backend
- **Vercel**: For serverless functions
- **Railway**: For full-stack deployment

## 🛠️ Development

### Local Development Server
```bash
# Python
python -m http.server 8000

# Node.js (if available)
npx http-server -p 8000

# PHP (if available)
php -S localhost:8000
```

### Making Changes
1. Edit HTML in `index.html`
2. Update styles in `styles.css`
3. Modify logic in `app.js`
4. Refresh browser to see changes

### Adding New Charts
```javascript
function initNewChart() {
    const ctx = document.getElementById('newChart');
    charts.new = new Chart(ctx, {
        type: 'line',
        data: { ... },
        options: { ... }
    });
}
```

## 📊 Data Format

The app expects data in this format:
```json
{
    "city": "Delhi",
    "date": "2020-12-01",
    "aqi": 298,
    "pm25": 156.2,
    "pm10": 234.5,
    "no2": 45.3,
    "co": 1.2,
    "so2": 18.7
}
```

## 🤝 Contributing

To add new features:
1. Create a new page section in HTML
2. Add corresponding navigation link
3. Create chart initialization function
4. Add to page router in `app.js`

## 📄 License

This web application is part of the Air Quality Analysis and Forecasting project.
Open source for educational and research purposes.

## 🙏 Credits

- **Chart.js**: Visualization library
- **Google Fonts**: Inter font family
- **Design Inspiration**: Modern dashboard designs

---

**Built with ❤️ for cleaner air and better public health**
