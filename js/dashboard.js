// Dashboard specific functionality
class DashboardManager {
    constructor() {
        this.currentPeriod = '30';
        this.chartData = {
            stockMovement: null,
            turnover: null,
            forecast: null
        };
    }
    
    init() {
        this.setupPeriodSelectors();
        this.updateDashboardMetrics();
        this.setupRealTimeUpdates();
    }
    
    setupPeriodSelectors() {
        // Stock movement period buttons
        document.querySelectorAll('[data-period]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const period = e.target.getAttribute('data-period');
                this.currentPeriod = period;
                this.updateStockMovementChart(parseInt(period));
                
                // Update active button
                document.querySelectorAll('[data-period]').forEach(b => {
                    b.classList.remove('active');
                });
                e.target.classList.add('active');
            });
        });
        
        // Dashboard period select
        const periodSelect = document.getElementById('dashboardPeriod');
        if (periodSelect) {
            periodSelect.addEventListener('change', (e) => {
                this.updateDashboardData(e.target.value);
            });
        }
        
        // Top products period select
        const topProductsPeriod = document.getElementById('topProductsPeriod');
        if (topProductsPeriod) {
            topProductsPeriod.addEventListener('change', (e) => {
                this.updateTopProducts(e.target.value);
            });
        }
    }
    
    updateDashboardMetrics() {
        const metrics = StockFlowData.getDashboardMetrics();
        const stockStatus = StockFlowData.getStockStatus();
        
        // Update metric cards
        this.updateElementText('totalStock', metrics.totalProducts);
        this.updateElementText('inventoryValue', `Rp ${stockFlowApp.formatNumber(metrics.inventoryValue)}`);
        this.updateElementText('turnoverRatio', metrics.turnoverRatio);
        this.updateElementText('deadStock', metrics.deadStock);
        
        // Update stock alerts
        this.updateElementText('criticalStockCount', stockStatus.critical);
        this.updateElementText('lowStockCount', stockStatus.low);
        this.updateElementText('overstockCount', stockStatus.overstock);
        
        // Update notification count
        const totalAlerts = stockStatus.critical + stockStatus.low;
        const notificationCount = document.getElementById('notificationCount');
        if (notificationCount) {
            notificationCount.textContent = totalAlerts;
            notificationCount.style.display = totalAlerts > 0 ? 'inline' : 'none';
        }
    }
    
    updateStockMovementChart(days = 30) {
        if (!stockFlowCharts.charts.stockMovement) {
            stockFlowCharts.initStockMovementChart();
        }
        stockFlowCharts.updateStockMovementChart(days);
    }
    
    updateDashboardData(period) {
        console.log('Updating dashboard for period:', period);
        // This would fetch data based on period in a real app
        this.updateDashboardMetrics();
        
        // Update charts based on period
        let days = 30;
        if (period === 'Hari Ini') days = 1;
        else if (period === 'Bulan Ini') days = 30;
        else if (period === 'Tahun Ini') days = 365;
        
        this.updateStockMovementChart(days);
    }
    
    updateTopProducts(period) {
        const topProducts = StockFlowData.getTopProducts(5);
        const tbody = document.querySelector('#dashboardContent table tbody');
        
        if (tbody) {
            tbody.innerHTML = topProducts.map(product => `
                <tr>
                    <td>${product.product.name}</td>
                    <td><span class="badge bg-light text-dark">${product.product.sku}</span></td>
                    <td>${product.quantity}</td>
                    <td>Rp ${stockFlowApp.formatNumber(product.revenue)}</td>
                    <td><span class="text-success"><i class="fas fa-arrow-up"></i> 15%</span></td>
                </tr>
            `).join('');
        }
    }
    
    setupRealTimeUpdates() {
        // Simulate real-time updates every 30 seconds
        setInterval(() => {
            this.updateDashboardMetrics();
            
            // Only update chart if dashboard is active
            if (stockFlowApp.currentPage === 'dashboard') {
                this.updateStockMovementChart(parseInt(this.currentPeriod));
            }
        }, 30000);
    }
    
    updateElementText(elementId, text) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = text;
        }
    }
    
    exportDashboardData() {
        const data = {
            metrics: StockFlowData.getDashboardMetrics(),
            stockStatus: StockFlowData.getStockStatus(),
            topProducts: StockFlowData.getTopProducts(10),
            recentTransactions: StockFlowData.getRecentTransactions(20)
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dashboard_export_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        stockFlowApp.showAlert('Data dashboard berhasil diekspor', 'success');
    }
    
    refreshDashboard() {
        this.updateDashboardMetrics();
        this.updateStockMovementChart(parseInt(this.currentPeriod));
        stockFlowApp.showAlert('Dashboard diperbarui', 'info');
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboardManager = new DashboardManager();
});
