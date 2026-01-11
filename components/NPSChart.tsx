'use client';

import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { calculateNPS, defaultNPSParams, NPSParams } from '../utils/npsCalculation';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function NPSChart() {
  const [params, setParams] = useState<NPSParams>(defaultNPSParams);
  const [showControls, setShowControls] = useState(false);

  // Calculate NPS data
  const npsResults = calculateNPS(params);
  
  // Prepare chart data
  const chartLabels = npsResults.map(r => `Year ${r.year}`);
  const chartValues = npsResults.map(r => r.value);
  
  // Create color gradient based on phase
  const backgroundColors = npsResults.map(r => {
    if (r.phase === 'investment') return 'rgba(255, 193, 7, 0.1)'; // Yellow for investment phase
    if (r.phase === 'secondary') return 'rgba(0, 188, 212, 0.1)'; // Cyan for secondary phase
    return 'rgba(102, 126, 234, 0.1)';
  });

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: 'NPS Investment Value (₹)',
        data: chartValues,
        borderColor: 'rgb(102, 126, 234)',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 3,
        pointHoverRadius: 6,
        pointBackgroundColor: npsResults.map(r => 
          r.phase === 'investment' ? 'rgb(255, 193, 7)' : 'rgb(0, 188, 212)'
        ),
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: 'rgb(118, 75, 162)',
        pointHoverBorderColor: '#fff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
            weight: 'bold' as const,
          },
          padding: 20,
        },
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        cornerRadius: 8,
        callbacks: {
          label: function(context: any) {
            const year = context.dataIndex;
            const value = context.parsed.y;
            const phase = npsResults[year].phase;
            return [
              `Value: ₹${value.toLocaleString('en-IN')}`,
              `Phase: ${phase === 'investment' ? 'Active Investment' : 'Reduced Investment'}`
            ];
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 12,
          },
          callback: function(value: any) {
            return '₹' + (value / 100000).toFixed(1) + 'L';
          }
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 10,
          },
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart' as const,
    },
  };

  const handleParamChange = (field: keyof NPSParams, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setParams({
        ...params,
        [field]: numValue
      });
    }
  };

  const resetToDefaults = () => {
    setParams(defaultNPSParams);
  };

  // Calculate some key metrics
  const finalValue = npsResults[npsResults.length - 1].value;
  const totalInvested = (params.paymentTerm * params.npsInvestment) + 
                        ((params.years - params.paymentTerm) * 16000);
  const returns = finalValue - totalInvested;
  const returnsPercentage = ((returns / totalInvested) * 100).toFixed(2);

  return (
    <div className="container">
      <h1>📊 NPS Investment Calculator</h1>
      <p className="subtitle">
        National Pension System growth projection with {(params.annualReturn * 100)}% annual returns
      </p>

      {/* Key Metrics */}
      <div className="metrics">
        <div className="metric-card">
          <div className="metric-label">Total Invested</div>
          <div className="metric-value">₹{totalInvested.toLocaleString('en-IN')}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Final Value</div>
          <div className="metric-value">₹{finalValue.toLocaleString('en-IN')}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Total Returns</div>
          <div className="metric-value success">₹{returns.toLocaleString('en-IN')}</div>
          <div className="metric-sublabel">{returnsPercentage}% gain</div>
        </div>
      </div>

      <div className="chart-container">
        <Line data={data} options={options} />
      </div>

      <div className="controls">
        <button onClick={() => setShowControls(!showControls)}>
          {showControls ? 'Hide' : 'Show'} Parameters
        </button>
        <button onClick={resetToDefaults}>Reset to Defaults</button>
      </div>

      {showControls && (
        <div className="parameters-grid">
          <div className="param-group">
            <label>Annual Investment (₹)</label>
            <input
              type="number"
              value={params.npsInvestment}
              onChange={(e) => handleParamChange('npsInvestment', e.target.value)}
            />
          </div>
          <div className="param-group">
            <label>Payment Term (years)</label>
            <input
              type="number"
              value={params.paymentTerm}
              onChange={(e) => handleParamChange('paymentTerm', e.target.value)}
            />
          </div>
          <div className="param-group">
            <label>Total Years</label>
            <input
              type="number"
              value={params.years}
              onChange={(e) => handleParamChange('years', e.target.value)}
            />
          </div>
          <div className="param-group">
            <label>Annual Return (%)</label>
            <input
              type="number"
              step="0.01"
              value={params.annualReturn * 100}
              onChange={(e) => handleParamChange('annualReturn', (parseFloat(e.target.value) / 100).toString())}
            />
          </div>
          <div className="param-group">
            <label>Payout Start (year index)</label>
            <input
              type="number"
              value={params.payout_start}
              onChange={(e) => handleParamChange('payout_start', e.target.value)}
            />
          </div>
          <div className="param-group">
            <label>Payout End (year index)</label>
            <input
              type="number"
              value={params.payout_end}
              onChange={(e) => handleParamChange('payout_end', e.target.value)}
            />
          </div>
          <div className="param-group">
            <label>Payout Amount (₹)</label>
            <input
              type="number"
              value={params.payoutAmount}
              onChange={(e) => handleParamChange('payoutAmount', e.target.value)}
            />
          </div>
          <div className="param-group">
            <label>Lumpsum (₹)</label>
            <input
              type="number"
              value={params.lumpsum}
              onChange={(e) => handleParamChange('lumpsum', e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="legend-info">
        <div className="legend-item">
          <span className="legend-color investment"></span>
          <span>Years 1-{params.paymentTerm}: ₹{params.npsInvestment.toLocaleString('en-IN')} annual investment</span>
        </div>
        <div className="legend-item">
          <span className="legend-color secondary"></span>
          <span>Years {params.paymentTerm + 1}-{params.years}: ₹16,000 annual investment</span>
        </div>
      </div>
    </div>
  );
}
