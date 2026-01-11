# NPS Dashboard - Multi-Chart Comparison

## Overview
A Next.js dashboard for comparing multiple NPS (National Pension System) investment scenarios side-by-side.

## Features

### 📊 Multi-Chart Dashboard
- Display up to 5 different NPS investment scenarios simultaneously
- Responsive grid layout that adapts to screen size
- Add/remove charts dynamically
- Each chart is color-coded for easy identification

### 💰 Pre-configured Scenarios
1. **NPS 40K** - ₹40,000 annual investment (from nps40.py)
2. **NPS 100K** - ₹1,00,000 annual investment (from nps100.py)
3. **Custom Plans** - 3 additional customizable scenarios

### 📈 Chart Features
- **Compact Metrics**: Quick view of Total Invested, Final Value, and Returns %
- **Interactive Graphs**: Hover to see year-by-year details
- **Phase Indicators**: Visual distinction between active and reduced investment phases
- **Smart Labels**: Auto-formatting for Lakhs (L) and Crores (Cr)

### ⚙️ Customization
- Edit parameters for custom plans:
  - Annual investment amount
  - Payment term duration
  - Total investment years
  - Annual return percentage
- Real-time chart updates

## Investment Phases

### Active Investment Phase (Years 1-12)
- Full annual investment amount (₹40K, ₹100K, etc.)
- Represented by solid colored points

### Reduced Investment Phase (Years 13-42)
- Fixed ₹16,000 annual investment
- Represented by semi-transparent points

## Calculations
- **10% annual returns** (default)
- Compounds yearly
- Total investment = (payment_term × annual_investment) + (remaining_years × 16000)
- Returns % = (Final Value - Total Invested) / Total Invested × 100

## Components

### NPSDashboard.tsx
Main container component that manages multiple chart configurations

### NPSChartCard.tsx
Individual chart card with metrics, visualization, and optional parameter controls

### npsCalculation.ts
TypeScript implementation of Python NPS calculation logic

## Usage

```bash
npm run dev
```

Navigate to http://localhost:3000

- Click "+ Add Chart" to display more scenarios (up to 5)
- Click "− Remove Chart" to hide scenarios
- Click "▼ Edit Parameters" on custom plans to adjust values
- Hover over chart points to see detailed information

## Grid Layouts
- **1 chart**: Single centered column
- **2 charts**: 2 columns
- **3 charts**: 3 columns
- **4 charts**: 2×2 grid
- **5 charts**: 3 columns (2 on bottom row)

Responsive breakpoints:
- < 768px: Single column
- < 1200px: Maximum 2 columns
- ≥ 1200px: Full grid layout
