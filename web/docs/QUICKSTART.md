# 🚀 Quick Start Guide - Air Quality Forecasting Web App

## ⚡ Fastest Way to Run

### Method 1: Direct Open (No Setup)
```bash
# Navigate to web folder
cd p:\CODE-XI\UnderGoing\Air_quality_analysis_forecasting\web

# Open in browser (Windows)
start index.html
```

That's it! The app will open in your default browser with sample data.

---

## 🌐 Method 2: Local Server (Recommended)

Better for testing and development:

```bash
# Navigate to web folder
cd p:\CODE-XI\UnderGoing\Air_quality_analysis_forecasting\web

# Start local server
python -m http.server 8000
```

Then open your browser to: **http://localhost:8000**

---

## 🔧 Method 3: With Backend API (Full Features)

Get real data from your CSV files:

### Step 1: Install Dependencies
```bash
pip install flask flask-cors pandas numpy
```

### Step 2: Start API Server
```bash
# Navigate to web folder
cd p:\CODE-XI\UnderGoing\Air_quality_analysis_forecasting\web

# Start the API
python api.py
```

You should see:
```
✓ Data loaded: 29,000+ records
✓ Cities available: 50+
Starting server on http://localhost:5000
```

### Step 3: Start Web Server (New Terminal)
```bash
# In a new terminal/PowerShell
cd p:\CODE-XI\UnderGoing\Air_quality_analysis_forecasting\web

python -m http.server 8000
```

### Step 4: Open Browser
Visit: **http://localhost:8000**

The app will now fetch real data from the API!

---

## 📱 Navigation Guide

### Pages Available:
1. **Dashboard** 🏠 - Overview and key statistics
2. **Analysis** 📊 - Historical data exploration
3. **Forecast** 🔮 - Model predictions
4. **Models** 🧠 - Model comparison
5. **About** ℹ️ - Project information

### How to Use:
- Click navigation links to switch pages
- Use dropdowns to select cities and models
- Hover over charts for detailed tooltips
- Scroll to see all content

---

## 🎨 Features to Try

### Dashboard Page
- View statistics cards with key metrics
- See city comparison bar chart
- Read key insights about air quality patterns

### Analysis Page
- Select different cities from dropdown
- Explore AQI trends over time
- View pollutant breakdown in pie chart
- Check seasonal patterns in radar chart

### Forecast Page
- Switch between SARIMA, LSTM, and Prophet models
- Choose forecast horizon (3, 6, or 12 months)
- See historical vs predicted comparison
- Check model performance metrics

### Models Page
- Compare all three models
- View technical specifications
- See performance bars
- Read recommendations

---

## 🛠️ Troubleshooting

### Issue: Page Not Loading
**Solution**: Make sure you're using a modern browser:
- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

### Issue: Charts Not Showing
**Solution**: Check browser console (F12) for errors. Make sure Chart.js is loading.

### Issue: API Not Working
**Solution**: 
1. Check if API is running: Visit http://localhost:5000/api/health
2. Verify dataset exists: `datasets/city_day.csv`
3. Check CORS is enabled

### Issue: Styles Look Broken
**Solution**: 
1. Clear browser cache (Ctrl + F5)
2. Make sure all files are in the same directory
3. Check CSS file path in index.html

---

## 📂 File Checklist

Make sure these files exist in your `web/` folder:

```
✓ index.html    - Main application
✓ styles.css    - All styles
✓ app.js        - JavaScript logic
✓ api.py        - Backend API (optional)
✓ README.md     - Documentation
```

---

## 🎯 What You Can Do

### Without Backend (Static):
✅ View dashboard with sample data  
✅ Navigate between pages  
✅ See all charts and visualizations  
✅ Interact with controls (selectors work)  
✅ View model comparisons  

### With Backend (Dynamic):
✅ Everything above, plus:  
✅ Load real data from CSV  
✅ Fetch actual city statistics  
✅ Get historical trends  
✅ View pollutant data  
✅ **Note**: Forecasts are simulated (can be integrated with actual model predictions)

---

## 💡 Quick Tips

1. **Best Experience**: Use Chrome or Edge browser
2. **Full Screen**: Press F11 for immersive view
3. **Developer Mode**: Press F12 to see console and network requests
4. **Refresh Data**: Reload page (F5) to reset
5. **Screenshots**: Use browser screenshot tools to capture charts

---

## 🌟 Next Actions

### For Presentation:
1. Open in full screen (F11)
2. Navigate to Dashboard
3. Scroll through key insights
4. Switch to Forecast page
5. Show model comparisons

### For Development:
1. Start with local server
2. Open browser DevTools (F12)
3. Edit files and refresh to see changes
4. Use Console tab for debugging

### For Production:
1. Deploy to GitHub Pages or Netlify
2. Connect to real backend API
3. Integrate actual model predictions
4. Add authentication if needed

---

## 📊 Sample Data Info

The app comes with sample data for demonstration:

- **5 Cities**: Delhi, Mumbai, Jaipur, Guwahati, Bangalore
- **24 Months**: 2019-2020 data
- **3 Models**: SARIMA, LSTM, Prophet
- **6 Pollutants**: PM2.5, PM10, NO2, CO, SO2, O3

To use your real data:
1. Start the API server (`python api.py`)
2. Edit `app.js` to fetch from API instead of using sample data
3. Uncomment API fetch calls in `app.js`

---

## 🎉 You're All Set!

The web app is ready to use. Enjoy exploring air quality data with beautiful visualizations!

### Need Help?
- Check `README.md` for detailed documentation
- See `IMPLEMENTATION.md` for technical details
- Review code comments in files

---

**Built with ❤️ for cleaner air and better public health**

*Last Updated: December 2025*
