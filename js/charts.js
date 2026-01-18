// Chart management
class StockFlowCharts {
    constructor() {
        this.charts = {};
    }
    
    initCharts() {
        this.initStockMovementChart();
        this.initABCChart();
        this.initTurnoverChart();
        this.initForecastChart();
    }
    
    initStockMovementChart() {
        const ctx = document.getElementById('stockMovementChart');
        if (!ctx) return;
        
        // Generate sample data for the last 30 days
        const labels = [];
        const inData = [];
        const outData = [];
        
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            labels.push(date.getDate().toString().padStart(2, '0'));
            
            // Generate random but realistic data
            inData.push(Math.floor(Math.random() * 100) + 50);
            outData.push(Math.floor(Math.random() * 80) + 30);
        }
        
        this.charts.stockMovement = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Stok Masuk',
                        data: inData,
                        borderColor: '#27ae60',
                        backgroundColor: 'rgba(39, 174, 96, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'Stok Keluar',
                        data: outData,
                        borderColor: '#e74c3c',
                        backgroundColor: 'rgba(231, 76, 60, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Jumlah Unit'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Tanggal'
                        }
                    }
                }
            }
        });
    }
    
    updateStockMovementChart(days = 30) {
        if (!this.charts.stockMovement) return;
        
        const labels = [];
        const inData = [];
        const outData = [];
        
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            
            if (days === 30) {
                labels.push(date.getDate().toString().padStart(2, '0'));
            } else if (days === 90) {
                // Show week numbers for 90 days
                if (i % 7 === 0) {
                    const weekNum = Math.floor((days - i) / 7) + 1;
                    labels.push(`Minggu ${weekNum}`);
                } else {
                    labels.push('');
                }
            } else {
                // Show month names for 1 year
                if (date.getDate() === 1) {
                    labels.push(date.toLocaleDateString('id-ID', { month: 'short' }));
                } else {
                    labels.push('');
                }
            }
            
            // Generate different data patterns based on period
            let baseIn, baseOut;
            if (days === 30) {
                baseIn = Math.floor(Math.random() * 100) + 50;
                baseOut = Math.floor(Math.random() * 80) + 30;
            } else if (days === 90) {
                baseIn = Math.floor(Math.random() * 120) + 40;
                baseOut = Math.floor(Math.random() * 100) + 20;
            } else {
                baseIn = Math.floor(Math.random() * 150) + 30;
                baseOut = Math.floor(Math.random() * 120) + 20;
            }
            
            // Add some trend
            const trend = Math.sin(i / 10) * 20;
            inData.push(Math.max(10, baseIn + trend));
            outData.push(Math.max(10, baseOut + trend));
        }
        
        this.charts.stockMovement.data.labels = labels;
        this.charts.stockMovement.data.datasets[0].data = inData;
        this.charts.stockMovement.data.datasets[1].data = outData;
        this.charts.stockMovement.update();
    }
    
    initABCChart() {
        const ctx = document.getElementById('abcChart');
        if (!ctx) return;
        
        const abcAnalysis = StockFlowData.getABCAnalysis();
        
        this.charts.abc = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Kelas A', 'Kelas B', 'Kelas C'],
                datasets: [
                    {
                        label: 'Jumlah Produk',
                        data: [
                            abcAnalysis.classA.count,
                            abcAnalysis.classB.count,
                            abcAnalysis.classC.count
                        ],
                        backgroundColor: [
                            '#27ae60',
                            '#f39c12',
                            '#95a5a6'
                        ],
                        borderWidth: 1
                    },
                    {
                        label: '% Nilai Inventaris',
                        data: [
                            Math.round((abcAnalysis.classA.value / (abcAnalysis.classA.value + abcAnalysis.classB.value + abcAnalysis.classC.value)) * 100),
                            Math.round((abcAnalysis.classB.value / (abcAnalysis.classA.value + abcAnalysis.classB.value + abcAnalysis.classC.value)) * 100),
                            Math.round((abcAnalysis.classC.value / (abcAnalysis.classA.value + abcAnalysis.classB.value + abcAnalysis.classC.value)) * 100)
                        ],
                        type: 'line',
                        borderColor: '#2c3e50',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        tension: 0.4,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Jumlah Produk'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        min: 0,
                        max: 100,
                        title: {
                            display: true,
                            text: '% Nilai Inventaris'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    }
    
    initTurnoverChart() {
        const ctx = document.getElementById('turnoverChart');
        if (!ctx) return;
        
        // Generate sample monthly data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const turnoverData = months.map(() => 3.5 + Math.random() * 1.5);
        
        this.charts.turnover = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Turnover Ratio',
                        data: turnoverData,
                        borderColor: '#3498db',
                        backgroundColor: 'rgba(52, 152, 219, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    annotation: {
                        annotations: {
                            line1: {
                                type: 'line',
                                yMin: 4,
                                yMax: 4,
                                borderColor: '#e74c3c',
                                borderWidth: 1,
                                borderDash: [5, 5],
                                label: {
                                    content: 'Target: 4.0',
                                    enabled: true,
                                    position: 'end'
                                }
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 3,
                        title: {
                            display: true,
                            text: 'Turnover Ratio'
                        }
                    }
                }
            }
        });
    }
    
    initForecastChart() {
        const ctx = document.getElementById('forecastChart');
        if (!ctx) return;
        
        // Generate historical data + forecast
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des', 'Jan (F)'];
        const historical = [];
        const forecast = [];
        
        for (let i = 0; i < 12; i++) {
            historical.push(200 + Math.random() * 100);
            forecast.push(null);
        }
        
        // Add forecast for next month
        const lastValue = historical[historical.length - 1];
        forecast.push(lastValue);
        forecast.push(lastValue * 1.1); // 10% growth forecast
        
        this.charts.forecast = new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Aktual',
                        data: historical,
                        borderColor: '#3498db',
                        backgroundColor: 'transparent',
                        borderWidth: 3,
                        tension: 0.4
                    },
                    {
                        label: 'Forecast',
                        data: forecast,
                        borderColor: '#e74c3c',
                        backgroundColor: 'transparent',
                        borderWidth: 3,
                        borderDash: [5, 5],
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Unit Terjual'
                        }
                    }
                }
            }
        });
    }
    
    // Update all charts when window resizes
    handleResize() {
        Object.values(this.charts).forEach(chart => {
            if (chart) chart.resize();
        });
    }
}

// Initialize charts
const stockFlowCharts = new StockFlowCharts();

// Make available globally
window.stockFlowCharts = stockFlowCharts;
