'use client';

import React, { useState } from 'react';
import NPSChartCard from './NPSChartCard';
import { NPSParams } from '../utils/npsCalculation';

// Predefined NPS configurations based on the Python scripts
const npsConfigurations: Array<{
  title: string;
  params: NPSParams;
  color: string;
  secondaryColor: string;
  editable: boolean;
}> = [
  {
    title: 'NPS 60K',
    params: {
      paymentTerm: 12,
      payout_end: 0,
      payout_start: 0,
      payoutAmount: 0,
      lumpsum: 0,
      lumpsum_year: 0,
      years: 42,
      npsInvestment: 60000,
      annualReturn: 0.10
    },
    color: '#667eea',
    secondaryColor: '#FCD34D',
    editable: false
  },
  {
    title: 'NPS 100K',
    params: {
      paymentTerm: 12,
      payout_end: 0,
      payout_start: 0,
      payoutAmount: 0,
      lumpsum: 0,
      lumpsum_year: 0,
      npsInvestment: 100000,
      years: 42,
      annualReturn: 0.10
    },
    color: '#10b981',
    secondaryColor: '#FCD34D',
    editable: false
  },
  {
    title: 'ABSLI 60 + NPS 40',
    params: {
      paymentTerm: 12,
      payout_start: 1,
      payout_end: 37,
      payoutAmount: 21210,
      lumpsum_year: 37,
      lumpsum: 792000,
      npsInvestment: 40000,
      totalInvestmentPerYear: 100000,
      years: 37,
      annualReturn: 0.10,
      // (No hardcoded per-year payouts here)
    },
    color: '#ef4444',
    secondaryColor: '#FCD34D',
    editable: false
  },
  {
    title: 'ABSLI 100',
    params: {
      paymentTerm: 12,
      payout_start: 14,
      payout_end: 25,
      payoutAmount: 130338,
      lumpsum: 1440000,
      lumpsum_year: 39,
      npsInvestment: 0,
      totalInvestmentPerYear: 100000,
      years: 42,
      annualReturn: 0.10
    },
    color: '#8b5cf6',
    secondaryColor: '#FCD34D',
    editable: false
  },
  {
    title: 'UPLI + NPS',
    params: {
      paymentTerm: 10,
      payout_start: 11,
      payout_end: 24,
      payoutAmount: 210854,
      lumpsum: 3153682,
      lumpsum_year: 26,
      npsInvestment: 0,
      totalInvestmentPerYear: 100000,
      years: 42,
      annualReturn: 0.10,
      // Hardcoded per-year payouts for UPLI (1-based year numbers)
      perYearPayouts: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 204752,
        12: 210854,
        13: 216659,
        14: 222353,
        15: 227526,
        16: 232792,
        17: 238149,
        18: 243585,
        19: 249085,
        20: 254625,
        21: 260199,
        22: 265912,
        23: 271769,
        24: 277772,
        25: 283926,
        26: 290234
      }
    },
    color: '#fb923c',
    secondaryColor: '#FCD34D',
    editable: true
  }
];

export default function NPSDashboard() {
  const [configs, setConfigs] = useState(npsConfigurations);
  const activeCharts = configs.length; // Always show all charts

  const handleParamsChange = (index: number, newParams: NPSParams) => {
    const newConfigs = [...configs];
    newConfigs[index].params = newParams;
    setConfigs(newConfigs);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-content">
          <h1>📊 NPS Investment Dashboard</h1>
          <p className="dashboard-subtitle">
            Compare multiple National Pension System investment scenarios
          </p>
        </div>
      </div>

      <div className={`charts-grid grid-${activeCharts}`}>
        {configs.map((config, index) => (
          <NPSChartCard
            key={index}
            title={config.title}
            params={config.params}
            color={config.color}
            secondaryColor={config.secondaryColor}
            editable={config.editable}
            onParamsChange={(newParams) => handleParamsChange(index, newParams)}
          />
        ))}
      </div>

      <div className="dashboard-footer">
        <div className="footer-note">
          <strong>Note:</strong> Calculations assume {configs[0].params.annualReturn * 100}% annual returns. 
          Investment continues for {configs[0].params.paymentTerm} years, then grows with compound interest.
        </div>
      </div>
    </div>
  );
}
