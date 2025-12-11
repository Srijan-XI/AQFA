# Web Folder Code Interconnect Map

## 📁 File Structure Overview

```
web/
├── index.html          (Combined Landing + Dashboard) ⭐ MAIN ENTRY POINT
├── learn-more.html     (Information page)
├── live.html           (Live data monitoring)
├── css/
│   ├── styles.css      (Main dashboard styles)
│   └── chart-fixes.css (Chart-specific fixes)
├── js/
│   ├── app.js          (Main dashboard logic)
│   ├── app-enhanced.js (Enhanced features)
│   └── openmeteo.js    (Weather API integration)
├── backend/
│   └── api.py          (Python backend API)
└── docs/
    ├── QUICKSTART.md
    ├── STRUCTURE.md
    ├── IMPLEMENTATION.md
    ├── INTEGRATION_COMPLETE.md
    ├── ORGANIZATION.md
    ├── OPENMETEO.md
    └── CHART_CSS_FIXES.md
```

## 🔗 File Interconnections

### **index.html** (🌟 Primary Entry Point)
**Purpose:** Combined landing page + full dashboard application

**Imports:**
- **CSS:**
  - `css/styles.css` - Main styling for dashboard
  - `css/chart-fixes.css` - Chart styling fixes
  - Google Fonts (Inter)

- **JavaScript:**
  - `https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js` (Chart.js library)
  - `js/openmeteo.js` - Weather API integration
  - `js/app.js` - Main dashboard functionality

**Links To:**
- `learn-more.html` - Learn More button
- `live.html` - Live Data link (footer)
- Internal navigation: `#dashboard`, `#analysis`, `#forecast`, `#models`, `#about`

**Features:**
- Landing section with hero and stats
- Dashboard with 5 pages: Dashboard, Analysis, Forecast, Models, About
- Toggle between landing and dashboard views
- Responsive navigation

---

### **learn-more.html**
**Purpose:** Detailed information about the project

**Imports:**
- Google Fonts (Inter)
- Inline styles (no external CSS)

**Links To:**
- `index.html` - Home/landing page
- `index.html#dashboard` - Launch dashboard
- `https://github.com/Srijan-XI/AQFA` - GitHub repository

**Content:**
- Problem statement
- Features overview
- How it works (5-step process)
- Technology stack
- Benefits for stakeholders

---

### **live.html**
**Purpose:** Real-time air quality monitoring

**Imports:**
- **CSS:**
  - `css/styles.css` - Shared dashboard styles

- **JavaScript:**
  - `js/openmeteo.js` - Live weather/air quality API

**Links To:**
- `index.html` - Back to home
- `https://open-meteo.com` - Data attribution

**Features:**
- Live AQI data fetching
- Real-time updates
- Location-based air quality

---

## 📊 CSS Dependencies

### **styles.css**
**Used By:**
- `index.html` (dashboard section)
- `live.html`

**Provides:**
- Glass-effect styling
- Navigation styles
- Chart container styles
- Hero section styles
- Grid layouts
- Color theme variables
- Responsive breakpoints

### **chart-fixes.css**
**Used By:**
- `index.html` (dashboard section)

**Provides:**
- Chart.js customizations
- Canvas sizing fixes
- Chart responsiveness tweaks

---

## 🎯 JavaScript Dependencies

### **app.js**
**Used By:**
- `index.html` (dashboard)

**Functionality:**
- Chart initialization and rendering
- Page navigation system
- Data visualization logic
- Interactive controls (city selector, time range, models)
- Chart.js configuration

**Depends On:**
- Chart.js library (CDN)
- DOM elements from index.html

### **openmeteo.js**
**Used By:**
- `index.html` (dashboard)
- `live.html`

**Functionality:**
- Open-Meteo API integration
- Real-time air quality data fetching
- Weather data parsing
- API error handling

**External Dependency:**
- Open-Meteo API (https://open-meteo.com)

### **app-enhanced.js**
**Status:** Not currently linked in any HTML file
**Purpose:** Additional enhanced features (optional)

---

## 🔄 Navigation Flow

```
┌─────────────────────────────────────────────────────┐
│                  index.html                          │
│  ┌──────────────┐        ┌────────────────────┐    │
│  │   Landing    │  →     │     Dashboard      │    │
│  │   Section    │  Click │   (Multi-page)     │    │
│  │              │  Launch│                    │    │
│  └──────────────┘  Button└────────────────────┘    │
│         ↓                         ↓                  │
│    Learn More              5 Internal Pages         │
│         ↓                    - Dashboard            │
│  learn-more.html             - Analysis             │
│         ↓                    - Forecast             │
│    Back to Home              - Models               │
│         ↓                    - About                │
│    index.html                                        │
└─────────────────────────────────────────────────────┘

                    ↓ (Footer link)

              ┌──────────────┐
              │  live.html   │
              │ Live Monitoring
              └──────────────┘
```

## 🌐 External Dependencies

### CDN Resources:
1. **Chart.js** (v4.4.0)
   - URL: `https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js`
   - Used by: `index.html`
   - Purpose: Data visualization

2. **Google Fonts - Inter**
   - URL: `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap`
   - Used by: All HTML files
   - Purpose: Typography

### API Services:
1. **Open-Meteo API**
   - Endpoint: Via `openmeteo.js`
   - Used by: `index.html`, `live.html`
   - Purpose: Real-time air quality and weather data

## 🎨 Styling Architecture

### Color Scheme:
- **Primary Gradient:** `#667eea` → `#764ba2` (Purple gradient)
- **Glass Effect:** `rgba(255, 255, 255, 0.1)` with `backdrop-filter: blur(10px)`
- **Text:** White on gradient background
- **Accents:** Various opacity levels for hierarchy

### Responsive Design:
- **Breakpoint:** 768px (mobile)
- **Grid Systems:**
  - Feature grids: `auto-fit, minmax(250px, 1fr)`
  - Tech stack: `auto-fit, minmax(150px, 1fr)`
  - Model cards: `auto-fit, minmax(300px, 1fr)`

## 🔧 Backend Integration

### **api.py**
**Purpose:** Python Flask/FastAPI backend (not directly linked in HTML)

**Potential Use Cases:**
- Historical data queries
- Model training/retraining
- Advanced forecasting
- Data export/import
- User preferences storage

**Current Status:** Standalone backend service

## 📝 Documentation Files

All located in `docs/` folder:

1. **QUICKSTART.md** - Getting started guide
2. **STRUCTURE.md** - Project structure details
3. **IMPLEMENTATION.md** - Implementation notes
4. **INTEGRATION_COMPLETE.md** - Integration documentation
5. **ORGANIZATION.md** - Organization guidelines
6. **OPENMETEO.md** - Open-Meteo API documentation
7. **CHART_CSS_FIXES.md** - Chart styling fixes

## 🎯 Key Interaction Points

### Landing → Dashboard Transition:
```javascript
// In index.html
function showDashboard() {
    document.getElementById('landingPage').classList.add('hidden');
    document.getElementById('dashboardWrapper').classList.add('active');
}

function showLanding() {
    document.getElementById('landingPage').classList.remove('hidden');
    document.getElementById('dashboardWrapper').classList.remove('active');
}
```

### Page Navigation (Dashboard):
```javascript
// In app.js (likely)
// Handles #dashboard, #analysis, #forecast, #models, #about
// Updates active nav links
// Shows/hides corresponding page sections
```

## 🔐 Data Flow

```
User Input (City/Time Selection)
        ↓
   app.js (Event Handler)
        ↓
   Generate Chart Config
        ↓
   Chart.js Rendering
        ↓
   Display on Canvas

---OR---

User Visits live.html
        ↓
   openmeteo.js Init
        ↓
   Fetch from Open-Meteo API
        ↓
   Parse & Display Data
        ↓
   Update UI
```

## 📌 Important Notes

1. **Merged Structure:** `index.html` now combines what was previously `index.html` (landing) and `home.html` (dashboard)
2. **No home.html:** All references updated to use `index.html` and `index.html#dashboard`
3. **Hash Navigation:** Dashboard uses hash-based routing for internal pages
4. **Responsive:** All pages are mobile-responsive with 768px breakpoint
5. **Progressive Enhancement:** Works without JavaScript for basic content

## 🚀 Getting Started

1. **Start Here:** Open `index.html` in browser
2. **Explore:** Click "Launch Dashboard" to access full features
3. **Learn:** Visit `learn-more.html` for detailed information
4. **Monitor:** Check `live.html` for real-time data

---

**Last Updated:** December 2025
**Version:** 2.0 (Merged Landing + Dashboard)
