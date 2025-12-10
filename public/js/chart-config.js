// Chart.js Configuration & Helper Functions

// Color palettes
const colorPalettes = {
  primary: [
    '#2563eb', '#60a5fa', '#3b82f6', '#1d4ed8', '#93c5fd',
    '#1e40af', '#38bdf8', '#0ea5e9', '#0284c7', '#0369a1'
  ],
  vibrant: [
    '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6',
    '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#6366f1'
  ],
  pastel: [
    '#fca5a5', '#fcd34d', '#86efac', '#93c5fd', '#c4b5fd',
    '#f9a8d4', '#5eead4', '#fdba74', '#67e8f9', '#a5b4fc'
  ],
  gradient: [
    'rgba(37, 99, 235, 0.8)',
    'rgba(16, 185, 129, 0.8)',
    'rgba(245, 158, 11, 0.8)',
    'rgba(239, 68, 68, 0.8)',
    'rgba(139, 92, 246, 0.8)',
    'rgba(236, 72, 153, 0.8)',
    'rgba(20, 184, 166, 0.8)'
  ]
};

// Default chart options
const defaultChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        padding: 15,
        font: {
          size: 12,
          family: "'Segoe UI', sans-serif",
          weight: '600'
        },
        usePointStyle: true,
        pointStyle: 'circle'
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleFont: {
        size: 14,
        weight: 'bold'
      },
      bodyFont: {
        size: 13
      },
      padding: 12,
      cornerRadius: 8,
      displayColors: true
    }
  }
};

// Create Pie Chart
function createPieChart(canvasId, labels, data, title) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  return new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colorPalettes.vibrant,
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverOffset: 10
      }]
    },
    options: {
      ...defaultChartOptions,
      plugins: {
        ...defaultChartOptions.plugins,
        title: {
          display: true,
          text: title,
          font: {
            size: 16,
            weight: 'bold'
          },
          padding: 20
        }
      }
    }
  });
}

// Create Doughnut Chart
function createDoughnutChart(canvasId, labels, data, title) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  return new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colorPalettes.vibrant,
        borderColor: '#ffffff',
        borderWidth: 3,
        hoverOffset: 10
      }]
    },
    options: {
      ...defaultChartOptions,
      cutout: '60%',
      plugins: {
        ...defaultChartOptions.plugins,
        title: {
          display: true,
          text: title,
          font: {
            size: 16,
            weight: 'bold'
          },
          padding: 20
        }
      }
    }
  });
}

// Create Bar Chart
function createBarChart(canvasId, labels, data, title, horizontal = false) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: title,
        data: data,
        backgroundColor: colorPalettes.primary,
        borderColor: colorPalettes.primary,
        borderWidth: 2,
        borderRadius: 8,
        barThickness: horizontal ? 25 : 40
      }]
    },
    options: {
      ...defaultChartOptions,
      indexAxis: horizontal ? 'y' : 'x',
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 11,
              weight: '600'
            }
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            font: {
              size: 11,
              weight: '600'
            }
          }
        }
      },
      plugins: {
        ...defaultChartOptions.plugins,
        title: {
          display: true,
          text: title,
          font: {
            size: 16,
            weight: 'bold'
          },
          padding: 20
        },
        legend: {
          display: false
        }
      }
    }
  });
}

// Create Line Chart
function createLineChart(canvasId, labels, data, title) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: title,
        data: data,
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderColor: '#2563eb',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }]
    },
    options: {
      ...defaultChartOptions,
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: {
              size: 11,
              weight: '600'
            }
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            font: {
              size: 11,
              weight: '600'
            }
          }
        }
      },
      plugins: {
        ...defaultChartOptions.plugins,
        title: {
          display: true,
          text: title,
          font: {
            size: 16,
            weight: 'bold'
          },
          padding: 20
        }
      }
    }
  });
}

// Create Multi-dataset Bar Chart
function createMultiBarChart(canvasId, labels, datasets, title) {
  const ctx = document.getElementById(canvasId);
  if (!ctx) return null;

  const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  
  const formattedDatasets = datasets.map((dataset, index) => ({
    label: dataset.label,
    data: dataset.data,
    backgroundColor: colors[index % colors.length],
    borderColor: colors[index % colors.length],
    borderWidth: 2,
    borderRadius: 6
  }));

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: formattedDatasets
    },
    options: {
      ...defaultChartOptions,
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        }
      },
      plugins: {
        ...defaultChartOptions.plugins,
        title: {
          display: true,
          text: title,
          font: {
            size: 16,
            weight: 'bold'
          },
          padding: 20
        }
      }
    }
  });
}

// Destroy chart if exists
function destroyChart(chart) {
  if (chart) {
    chart.destroy();
  }
}s