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

interface ChartData {
  labels: string[];
  values: number[];
}

export default function LineChart() {
  const [chartData, setChartData] = useState<ChartData>({
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    values: [12, 19, 3, 5, 2, 3],
  });
  
  const [customLabel, setCustomLabel] = useState('');
  const [customValue, setCustomValue] = useState('');

  const data = {
    labels: chartData.labels,
    datasets: [
      {
        label: 'Monthly Returns',
        data: chartData.values,
        borderColor: 'rgb(102, 126, 234)',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: 'rgb(102, 126, 234)',
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
        },
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
    animation: {
      duration: 750,
      easing: 'easeInOutQuart' as const,
    },
  };

  const addRandomData = () => {
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Q1', 'Q2', 'Q3', 'Q4'];
    const randomMonth = months[Math.floor(Math.random() * months.length)];
    const randomValue = Math.floor(Math.random() * 30);

    setChartData({
      labels: [...chartData.labels, randomMonth],
      values: [...chartData.values, randomValue],
    });
  };

  const removeData = () => {
    if (chartData.labels.length > 0) {
      setChartData({
        labels: chartData.labels.slice(0, -1),
        values: chartData.values.slice(0, -1),
      });
    }
  };

  const randomizeData = () => {
    const newValues = chartData.labels.map(() => Math.floor(Math.random() * 30));
    setChartData({
      ...chartData,
      values: newValues,
    });
  };

  const resetData = () => {
    setChartData({
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      values: [12, 19, 3, 5, 2, 3],
    });
  };

  const addCustomData = () => {
    const label = customLabel.trim();
    const value = parseFloat(customValue);

    if (label && !isNaN(value)) {
      setChartData({
        labels: [...chartData.labels, label],
        values: [...chartData.values, value],
      });
      setCustomLabel('');
      setCustomValue('');
    } else {
      alert('Please enter both a valid label and numeric value');
    }
  };

  return (
    <div className="container">
      <h1>📈 Line Graph Visualizer</h1>
      <p className="subtitle">Interactive line chart with real-time data updates</p>

      <div className="chart-container">
        <Line data={data} options={options} />
      </div>

      <div className="controls">
        <button onClick={addRandomData}>Add Data Point</button>
        <button onClick={removeData}>Remove Data Point</button>
        <button onClick={randomizeData}>Randomize Data</button>
        <button onClick={resetData}>Reset</button>
      </div>

      <div className="input-group">
        <label>Add Custom Point:</label>
        <input
          type="text"
          placeholder="Label (e.g., Jan)"
          value={customLabel}
          onChange={(e) => setCustomLabel(e.target.value)}
        />
        <input
          type="number"
          placeholder="Value (e.g., 65)"
          value={customValue}
          onChange={(e) => setCustomValue(e.target.value)}
        />
        <button onClick={addCustomData}>Add</button>
      </div>
    </div>
  );
}
