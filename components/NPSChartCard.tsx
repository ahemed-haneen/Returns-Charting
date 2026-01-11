'use client';

import React, { useState } from 'react';
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
import { calculateNPS, NPSParams } from '../utils/npsCalculation';

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

interface NPSChartCardProps {
  title: string;
  params: NPSParams;
  color: string;
  secondaryColor?: string;
  onParamsChange?: (params: NPSParams) => void;
  editable?: boolean;
}

export default function NPSChartCard({ 
  title, 
  params, 
  color,
  secondaryColor,
  onParamsChange,
  editable = false 
}: NPSChartCardProps) {
  const [showControls, setShowControls] = useState(false);

  // Calculate NPS data
  const npsResults = calculateNPS(params);
  
  // Prepare chart data with actual years starting from 2028 and age starting from 28
  const startYear = 2028;
  const startAge = 28;
  const chartLabels = npsResults.map((r, idx) => {
    const actualYear = startYear + r.year;
    const age = startAge + r.year;
    // Show every 5th year for readability
    if (idx === 0 || idx % 5 === 0 || idx === npsResults.length - 1) {
      return `${age} (${actualYear})`;
    }
    return '';
  });
  const chartValues = npsResults.map(r => r.value);
  
  // Calculate different colors for phase 1 and phase 2
  const phaseColor1 = color; // Active investment phase
  const phaseColor2 = '#FCD34D'; // Yellow for reduced investment phase

  // Calculate lumpsum year if applicable
  const lumpsumYear = params.lumpsum > 0 ? params.lumpsum_year : -1;
  
  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: `${title} Value (₹)`,
        data: chartValues,
        borderColor: color,
        backgroundColor: `${color}20`,
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: npsResults.map((r, idx) => {
          if (idx === lumpsumYear) return '#EC4899'; // Hot pink for lumpsum
          return r.phase === 'investment' ? phaseColor1 : phaseColor2;
        }),
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: '#fff',
        pointStyle: 'circle',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 10,
        titleFont: {
          size: 12,
        },
        bodyFont: {
          size: 11,
        },
        cornerRadius: 6,
        callbacks: {
          label: function(context: any) {
            const year = context.dataIndex;
            const value = context.parsed.y;
            const result = npsResults[year];
            const phase = result.phase;
            
            const labels = [
              `Total Value: ₹${value.toLocaleString('en-IN')}`,
              `---`,
              `Opening: ₹${result.previousValue.toLocaleString('en-IN')}`,
              `Returns: ₹${result.returns.toLocaleString('en-IN')} (${result.returnsRate.toFixed(1)}%)`
            ];
            
            if (result.investment > 0) {
              labels.push(`Investment: ₹${result.investment.toLocaleString('en-IN')}`);
            }
            
            if (result.payout > 0) {
              if (year === lumpsumYear) {
                labels.push(`Payout: ₹${params.payoutAmount.toLocaleString('en-IN')}`);
                labels.push(`🌟 Lumpsum: ₹${params.lumpsum.toLocaleString('en-IN')}`);
              } else {
                labels.push(`Payout: ₹${result.payout.toLocaleString('en-IN')}`);
              }
            }
            
            labels.push(`---`);
            labels.push(`Closing: ₹${value.toLocaleString('en-IN')}`);
            
            return labels;
          },
          title: function(context: any) {
            const year = context[0].dataIndex;
            const actualYear = 2028 + year;
            const age = 28 + year;
            return `Age ${age} (${actualYear})`;
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
            size: 10,
          },
          callback: function(value: any) {
            if (value >= 10000000) {
              return '₹' + (value / 10000000).toFixed(1) + 'Cr';
            } else if (value >= 100000) {
              return '₹' + (value / 100000).toFixed(1) + 'L';
            }
            return '₹' + value.toLocaleString('en-IN');
          }
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 9,
          },
        },
      },
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart' as const,
    },
  };

  const handleParamChange = (field: keyof NPSParams, value: string) => {
    if (!onParamsChange) return;
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      onParamsChange({
        ...params,
        [field]: numValue
      });
    }
  };

  // Calculate key metrics
  const finalValue = npsResults[npsResults.length - 1].value;
  const totalInvested = (params.paymentTerm * (params.totalInvestmentPerYear || params.npsInvestment));
  const returns = finalValue - totalInvested;
  // Annualised (YoY) return rate (CAGR) normalized over the full `years` period
  let annualisedReturn = 0;
  if (totalInvested > 0 && params.years > 0 && finalValue > 0) {
    annualisedReturn = (Math.pow(finalValue / totalInvested, 1 / params.years) - 1) * 100;
  }
  const returnsPercentage = isFinite(annualisedReturn) ? annualisedReturn.toFixed(1) : '0.0';

  // Calculate premium and NPS split
  const premiumPerYear = params.totalInvestmentPerYear ? (params.totalInvestmentPerYear - params.npsInvestment) : 0;
  const hasPayouts = params.payoutAmount > 0 || params.lumpsum > 0;

  return (
    <div className="chart-card" style={{ borderTopColor: color }}>
      <div className="chart-card-header">
        <h3 style={{ color }}>{title}</h3>
        
      </div>

      {/* Compact Metrics */}
      <div className="compact-metrics" style={{ gridTemplateColumns: hasPayouts ? 'repeat(4, 1fr)' : 'repeat(3, 1fr)' }}>
        <div className="compact-metric">
          <span className="compact-label">Invested</span>
          <span className="compact-value">₹{(totalInvested / 100000).toFixed(1)}L</span>
        </div>
        {hasPayouts && (
          <div className="compact-metric">
            <span className="compact-label">Payout</span>
            <span className="compact-value" style={{ color: '#10b981' }}>
              ₹{(params.payoutAmount / 1000).toFixed(0)}K/yr
            </span>
          </div>
        )}
        <div className="compact-metric">
          <span className="compact-label">Final</span>
          <span className="compact-value" style={{ color }}>
            ₹{(finalValue / 10000000).toFixed(2)}Cr
          </span>
        </div>
        <div className="compact-metric">
          <span className="compact-label">Returns</span>
          <span className="compact-value success">{returnsPercentage}%</span>
        </div>
      </div>

      <div className="mini-chart-container">
        <Line data={data} options={options} />
      </div>

      {editable && (
        <>
          <button 
            className="compact-button"
            onClick={() => setShowControls(!showControls)}
          >
            {showControls ? '▲ Hide' : '▼ Edit'} Parameters
          </button>

          {showControls && (
            <div className="compact-parameters">
              <div className="compact-param">
                <label>Investment</label>
                <input
                  type="number"
                  value={params.npsInvestment}
                  onChange={(e) => handleParamChange('npsInvestment', e.target.value)}
                />
              </div>
              <div className="compact-param">
                <label>Term</label>
                <input
                  type="number"
                  value={params.paymentTerm}
                  onChange={(e) => handleParamChange('paymentTerm', e.target.value)}
                />
              </div>
              <div className="compact-param">
                <label>Years</label>
                <input
                  type="number"
                  value={params.years}
                  onChange={(e) => handleParamChange('years', e.target.value)}
                />
              </div>
              <div className="compact-param">
                <label>Return %</label>
                <input
                  type="number"
                  step="0.1"
                  value={params.annualReturn * 100}
                  onChange={(e) => handleParamChange('annualReturn', (parseFloat(e.target.value) / 100).toString())}
                />
              </div>
            </div>
          )}
        </>
      )}

      <div className="chart-footer">
        <div className="phase-info">
          <div className="phase-indicator">
            <span className="phase-dot" style={{ backgroundColor: phaseColor1 }}></span>
            <div className="phase-details">
              <span className="phase-text">{startYear}-{startYear + params.paymentTerm - 1}</span>
              {premiumPerYear > 0 ? (
                <>
                  <span className="phase-amount">ABSLI: ₹{(premiumPerYear / 1000).toFixed(0)}K</span>
                  <span className="phase-amount">NPS: ₹{(params.npsInvestment / 1000).toFixed(0)}K</span>
                  <span className="phase-amount">Payout: ₹{(params.payoutAmount / 1000).toFixed(0)}K</span>
                </>
              ) : (
                <span className="phase-amount">NPS: ₹{(params.npsInvestment / 1000).toFixed(0)}K/yr</span>
              )}
            </div>
          </div>
          {hasPayouts && params.payout_start > 0 && (
            <div className="phase-indicator">
              <span className="phase-dot" style={{ backgroundColor: '#10b981' }}></span>
              <div className="phase-details">
                <span className="phase-text">{startYear + params.payout_start}-{startYear + params.payout_end}</span>
                <span className="phase-amount">Payout: ₹{(params.payoutAmount / 1000).toFixed(0)}K/yr</span>
              </div>
            </div>
          )}
          <div className="phase-indicator">
            <span className="phase-dot" style={{ backgroundColor: phaseColor2 }}></span>
            <div className="phase-details">
              <span className="phase-text">{startYear + params.paymentTerm}-{startYear + params.years - 1}</span>
              <span className="phase-amount">Growth only</span>
            </div>
          </div>
          {params.lumpsum > 0 && (
            <div className="phase-indicator">
              <span className="phase-dot lumpsum-dot" style={{ backgroundColor: '#EC4899' }}></span>
              <div className="phase-details">
                <span className="phase-text">{startYear + lumpsumYear}</span>
                <span className="phase-amount">₹{(params.lumpsum / 100000).toFixed(1)}L Lumpsum</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
