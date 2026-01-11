// Initial data for the line graph
let chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
        label: 'Monthly Returns',
        data: [12, 19, 3, 5, 2, 3],
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
        pointHoverBorderColor: '#fff'
    }]
};

// Chart configuration
const config = {
    type: 'line',
    data: chartData,
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    font: {
                        size: 14,
                        weight: 'bold'
                    },
                    padding: 20
                }
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                padding: 12,
                titleFont: {
                    size: 14
                },
                bodyFont: {
                    size: 13
                },
                cornerRadius: 8
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                    font: {
                        size: 12
                    }
                }
            },
            x: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                    font: {
                        size: 12
                    }
                }
            }
        },
        animation: {
            duration: 750,
            easing: 'easeInOutQuart'
        }
    }
};

// Initialize the chart
const ctx = document.getElementById('lineChart').getContext('2d');
const lineChart = new Chart(ctx, config);

// Function to add random data point
function addRandomData() {
    const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Q1', 'Q2', 'Q3', 'Q4'];
    const randomMonth = months[Math.floor(Math.random() * months.length)];
    const randomValue = Math.floor(Math.random() * 30);
    
    chartData.labels.push(randomMonth);
    chartData.datasets[0].data.push(randomValue);
    
    lineChart.update();
}

// Function to remove the last data point
function removeData() {
    if (chartData.labels.length > 0) {
        chartData.labels.pop();
        chartData.datasets[0].data.pop();
        lineChart.update();
    }
}

// Function to randomize all data
function randomizeData() {
    chartData.datasets[0].data = chartData.labels.map(() => 
        Math.floor(Math.random() * 30)
    );
    lineChart.update();
}

// Function to reset to initial data
function resetData() {
    chartData.labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    chartData.datasets[0].data = [12, 19, 3, 5, 2, 3];
    lineChart.update();
}

// Function to add custom data point
function addCustomData() {
    const labelInput = document.getElementById('labelInput');
    const valueInput = document.getElementById('valueInput');
    
    const label = labelInput.value.trim();
    const value = parseFloat(valueInput.value);
    
    if (label && !isNaN(value)) {
        chartData.labels.push(label);
        chartData.datasets[0].data.push(value);
        lineChart.update();
        
        // Clear inputs
        labelInput.value = '';
        valueInput.value = '';
    } else {
        alert('Please enter both a valid label and numeric value');
    }
}
