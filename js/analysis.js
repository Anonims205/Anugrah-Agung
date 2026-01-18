// Stock Analysis System
class AnalysisManager {
    constructor() {
        this.currentTab = 'abcAnalysis';
        this.analysisData = {
            abc: null,
            turnover: null,
            deadStock: null,
            forecast: null
        };
    }
    
    async loadAnalysisPage() {
        const abcAnalysis = StockFlowData.getABCAnalysis();
        const deadStock = this.getDeadStock();
        
        return `
            <div id="analysisContent">
                <h3 class="mb-4">Analisis Stok</h3>
                
                <ul class="nav nav-tabs" id="analysisTabs">
                    <li class="nav-item">
                        <a class="nav-link active" data-bs-toggle="tab" href="#abcAnalysis">ABC Analysis</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-bs-toggle="tab" href="#turnoverAnalysis">Turnover Analysis</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-bs-toggle="tab" href="#deadStockAnalysis">Dead Stock</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" data-bs-toggle="tab" href="#forecastAnalysis">Demand Forecast</a>
                    </li>
                </ul>
                
                <div class="tab-content mt-4">
                    <!-- ABC Analysis -->
                    <div class="tab-pane fade show active" id="abcAnalysis">
                        ${this.renderABCAnalysis(abcAnalysis)}
                    </div>
                    
                    <!-- Turnover Analysis -->
                    <div class="tab-pane fade" id="turnoverAnalysis">
                        ${this.renderTurnoverAnalysis()}
                    </div>
                    
                    <!-- Dead Stock Analysis -->
                    <div class="tab-pane fade" id="deadStockAnalysis">
                        ${this.renderDeadStockAnalysis(deadStock)}
                    </div>
                    
                    <!-- Forecast Analysis -->
                    <div class="tab-pane fade" id="forecastAnalysis">
                        ${this.renderForecastAnalysis()}
                    </div>
                </div>
            </div>
        `;
    }
    
    renderABCAnalysis(abcAnalysis) {
        const classAProducts = abcAnalysis.products.filter(p => p.abcClass === 'A').slice(0, 10);
        
        return `
            <div class="row">
                <div class="col-md-8">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">Klasifikasi ABC Produk</h5>
                        </div>
                        <div class="card-body">
                            <div class="chart-container">
                                <canvas id="abcChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">Distribusi ABC</h5>
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <div class="d-flex justify-content-between mb-1">
                                    <span>Kelas A (High Value)</span>
                                    <span class="fw-bold">${abcAnalysis.classA.percentage}%</span>
                                </div>
                                <div class="progress" style="height: 20px;">
                                    <div class="progress-bar bg-success" style="width: ${abcAnalysis.classA.percentage}%">
                                        ${abcAnalysis.classA.count} produk
                                    </div>
                                </div>
                                <small class="text-muted">${Math.round((abcAnalysis.classA.value / (abcAnalysis.classA.value + abcAnalysis.classB.value + abcAnalysis.classC.value)) * 100)}% dari total nilai inventaris</small>
                            </div>
                            
                            <div class="mb-3">
                                <div class="d-flex justify-content-between mb-1">
                                    <span>Kelas B (Medium Value)</span>
                                    <span class="fw-bold">${abcAnalysis.classB.percentage}%</span>
                                </div>
                                <div class="progress" style="height: 20px;">
                                    <div class="progress-bar bg-warning" style="width: ${abcAnalysis.classB.percentage}%">
                                        ${abcAnalysis.classB.count} produk
                                    </div>
                                </div>
                                <small class="text-muted">${Math.round((abcAnalysis.classB.value / (abcAnalysis.classA.value + abcAnalysis.classB.value + abcAnalysis.classC.value)) * 100)}% dari total nilai inventaris</small>
                            </div>
                            
                            <div class="mb-3">
                                <div class="d-flex justify-content-between mb-1">
                                    <span>Kelas C (Low Value)</span>
                                    <span class="fw-bold">${abcAnalysis.classC.percentage}%</span>
                                </div>
                                <div class="progress" style="height: 20px;">
                                    <div class="progress-bar bg-secondary" style="width: ${abcAnalysis.classC.percentage}%">
                                        ${abcAnalysis.classC.count} produk
                                    </div>
                                </div>
                                <small class="text-muted">${Math.round((abcAnalysis.classC.value / (abcAnalysis.classA.value + abcAnalysis.classB.value + abcAnalysis.classC.value)) * 100)}% dari total nilai inventaris</small>
                            </div>
                            
                            <div class="alert alert-info mt-3">
                                <small>
                                    <i class="fas fa-info-circle"></i>
                                    <strong>Rekomendasi:</strong> Fokus kontrol ketat pada produk Kelas A, kontrol moderat pada Kelas B, dan kontrol sederhana pada Kelas C.
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="card mt-4">
                <div class="card-header">
                    <h5 class="mb-0">Produk Kelas A (Prioritas Tinggi)</h5>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>Produk</th>
                                    <th>Nilai Inventaris</th>
                                    <th>% Kontribusi</th>
                                    <th>Stok</th>
                                    <th>Min/Max</th>
                                    <th>Status</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${classAProducts.map(product => {
                                    const totalValue = abcAnalysis.classA.value + abcAnalysis.classB.value + abcAnalysis.classC.value;
                                    const contribution = Math.round(((product.stock * product.sellPrice) / totalValue) * 100);
                                    const status = product.stock <= product.minStock * 0.3 ? 'danger' : 
                                                  product.stock <= product.minStock ? 'warning' : 'success';
                                    const statusText = product.stock <= product.minStock * 0.3 ? 'Perlu Reorder' : 
                                                      product.stock <= product.minStock ? 'Monitor' : 'Optimal';
                                    
                                    return `
                                        <tr>
                                            <td>${product.name}</td>
                                            <td>Rp ${stockFlowApp.formatNumber(product.stock * product.sellPrice)}</td>
                                            <td>${contribution}%</td>
                                            <td class="fw-bold text-${status}">${product.stock}</td>
                                            <td>
                                                <small>Min: ${product.minStock}</small><br>
                                                <small>Max: ${product.maxStock}</small>
                                            </td>
                                            <td><span class="badge bg-${status}">${statusText}</span></td>
                                            <td>
                                                <button class="btn btn-sm btn-outline-primary"
                                                        onclick="analysisManager.generateReorderReport(${product.id})">
                                                    <i class="fas fa-file-alt"></i> Laporan
                                                </button>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderTurnoverAnalysis() {
        const categories = ['Elektronik', 'Fashion', 'Kesehatan', 'Makanan', 'ATK'];
        const turnoverData = categories.map(() => (2 + Math.random() * 6).toFixed(1));
        
        return `
            <div class="row">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">Inventory Turnover Ratio</h5>
                        </div>
                        <div class="card-body">
                            <div class="chart-container">
                                <canvas id="turnoverChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">Analisis Per Kategori</h5>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Kategori</th>
                                            <th>Turnover</th>
                                            <th>Trend</th>
                                            <th>Status</th>
                                            <th>Rekomendasi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${categories.map((category, index) => {
                                            const turnover = turnoverData[index];
                                            const trend = (Math.random() > 0.5 ? '+' : '-') + (Math.random() * 0.5).toFixed(1);
                                            const status = turnover >= 6 ? 'success' : 
                                                          turnover >= 4 ? 'warning' : 'danger';
                                            const statusText = turnover >= 6 ? 'Baik' : 
                                                              turnover >= 4 ? 'Cukup' : 'Buruk';
                                            let recommendation = '';
                                            
                                            if (turnover < 3) {
                                                recommendation = 'Kurangi stok, tingkatkan promosi';
                                            } else if (turnover < 5) {
                                                recommendation = 'Optimalkan level stok';
                                            } else {
                                                recommendation = 'Pertahankan performa';
                                            }
                                            
                                            return `
                                                <tr>
                                                    <td>${category}</td>
                                                    <td>${turnover}</td>
                                                    <td><span class="${trend.startsWith('+') ? 'text-success' : 'text-danger'}">
                                                        <i class="fas fa-arrow-${trend.startsWith('+') ? 'up' : 'down'}"></i> ${Math.abs(parseFloat(trend))}
                                                    </span></td>
                                                    <td><span class="badge bg-${status}">${statusText}</span></td>
                                                    <td><small>${recommendation}</small></td>
                                                </tr>
                                            `;
                                        }).join('')}
                                    </tbody>
                                </table>
                            </div>
                            <div class="alert alert-warning mt-3">
                                <small>
                                    <i class="fas fa-exclamation-triangle"></i>
                                    <strong>Interpretasi:</strong> 
                                    <ul class="mb-0 mt-2">
                                        <li>Turnover > 6: Sangat Baik (stok efisien)</li>
                                        <li>Turnover 4-6: Baik (stok optimal)</li>
                                        <li>Turnover 2-4: Cukup (perlu optimasi)</li>
                                        <li>Turnover < 2: Buruk (stok bermasalah)</li>
                                    </ul>
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row mt-4">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">Rekomendasi Improvement</h5>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-4">
                                    <div class="card border-primary">
                                        <div class="card-body">
                                            <h6><i class="fas fa-bullseye text-primary me-2"></i> Target Setting</h6>
                                            <p class="small mb-2">Set target turnover minimum 4.0 untuk semua kategori</p>
                                            <button class="btn btn-sm btn-outline-primary" onclick="analysisManager.setTurnoverTarget()">
                                                Set Target
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="card border-warning">
                                        <div class="card-body">
                                            <h6><i class="fas fa-chart-line text-warning me-2"></i> Analisis Trend</h6>
                                            <p class="small mb-2">Analisis historis 12 bulan untuk identifikasi pola</p>
                                            <button class="btn btn-sm btn-outline-warning" onclick="analysisManager.analyzeTrend()">
                                                Analisis
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4">
                                    <div class="card border-success">
                                        <div class="card-body">
                                            <h6><i class="fas fa-file-export text-success me-2"></i> Laporan Detail</h6>
                                            <p class="small mb-2">Generate laporan turnover per produk dan kategori</p>
                                            <button class="btn btn-sm btn-outline-success" onclick="analysisManager.exportTurnoverReport()">
                                                Export
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderDeadStockAnalysis(deadStock) {
        const totalValue = deadStock.reduce((sum, item) => sum + item.value, 0);
        const inventoryValue = StockFlowData.getInventoryValue();
        const percentage = ((totalValue / inventoryValue) * 100).toFixed(1);
        
        return `
            <div class="row">
                <div class="col-md-8">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">Dead Stock (>90 hari tidak bergerak)</h5>
                            <button class="btn btn-sm btn-danger" onclick="analysisManager.takeActionOnDeadStock()">
                                <i class="fas fa-fire"></i> Tindakan Massal
                            </button>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Produk</th>
                                            <th>Stok</th>
                                            <th>Nilai</th>
                                            <th>Hari Tidak Bergerak</th>
                                            <th>Terakhir Dijual</th>
                                            <th>Usia (hari)</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${deadStock.map(item => {
                                            const daysInactive = Math.floor((new Date() - new Date(item.lastSale)) / (1000 * 60 * 60 * 24));
                                            const age = Math.floor((new Date() - new Date(item.product.lastUpdated)) / (1000 * 60 * 60 * 24));
                                            const severity = daysInactive > 180 ? 'danger' : 
                                                           daysInactive > 120 ? 'warning' : 'info';
                                            
                                            return `
                                                <tr class="table-${severity}">
                                                    <td>${item.product.name}</td>
                                                    <td>${item.product.stock}</td>
                                                    <td>Rp ${stockFlowApp.formatNumber(item.value)}</td>
                                                    <td>
                                                        <span class="badge bg-${severity}">${daysInactive} hari</span>
                                                    </td>
                                                    <td>${item.lastSale ? new Date(item.lastSale).toLocaleDateString('id-ID') : 'Tidak ada'}</td>
                                                    <td>${age}</td>
                                                    <td>
                                                        <div class="btn-group btn-group-sm">
                                                            <button class="btn btn-outline-warning" 
                                                                    onclick="analysisManager.applyDiscount(${item.product.id})">
                                                                <i class="fas fa-tags"></i>
                                                            </button>
                                                            <button class="btn btn-outline-danger"
                                                                    onclick="analysisManager.returnToSupplier(${item.product.id})">
                                                                <i class="fas fa-undo"></i>
                                                            </button>
                                                            <button class="btn btn-outline-info"
                                                                    onclick="analysisManager.createBundle(${item.product.id})">
                                                                <i class="fas fa-gift"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            `;
                                        }).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">Analisis Dead Stock</h5>
                        </div>
                        <div class="card-body">
                            <div class="mb-4">
                                <h6>Total Nilai Dead Stock</h6>
                                <h3 class="text-danger">Rp ${stockFlowApp.formatNumber(totalValue)}</h3>
                                <small class="text-muted">${percentage}% dari total nilai inventaris</small>
                            </div>
                            
                            <div class="mb-4">
                                <h6>Distribusi Usia</h6>
                                <div id="deadStockAgeChart"></div>
                                <ul class="list-unstyled mt-3">
                                    ${this.getAgeDistribution(deadStock).map(dist => `
                                        <li class="mb-2">
                                            <div class="d-flex justify-content-between">
                                                <span>${dist.label}</span>
                                                <span class="fw-bold">${dist.percentage}%</span>
                                            </div>
                                            <div class="progress" style="height: 8px;">
                                                <div class="progress-bar bg-${dist.color}" style="width: ${dist.percentage}%"></div>
                                            </div>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                            
                            <div class="mb-4">
                                <h6>Rekomendasi Tindakan</h6>
                                <div class="list-group list-group-flush">
                                    <div class="list-group-item px-0 py-2">
                                        <i class="fas fa-tags text-warning me-2"></i>
                                        <small>Diskon 20-50% untuk produk >120 hari</small>
                                    </div>
                                    <div class="list-group-item px-0 py-2">
                                        <i class="fas fa-gift text-info me-2"></i>
                                        <small>Bundling dengan produk fast-moving</small>
                                    </div>
                                    <div class="list-group-item px-0 py-2">
                                        <i class="fas fa-undo text-danger me-2"></i>
                                        <small>Retur ke supplier jika memungkinkan</small>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="alert alert-danger">
                                <small>
                                    <i class="fas fa-exclamation-circle"></i>
                                    <strong>Prioritas:</strong> Segera ambil tindakan untuk dead stock >120 hari untuk meminimalkan kerugian.
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderForecastAnalysis() {
        return `
            <div class="row">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <h5 class="mb-0">Demand Forecasting (Exponential Smoothing)</h5>
                            <select class="form-select form-select-sm w-auto" id="forecastPeriod">
                                <option value="6">Berdasarkan 6 bulan terakhir</option>
                                <option value="12" selected>Berdasarkan 12 bulan terakhir</option>
                                <option value="3">Berdasarkan 3 bulan terakhir</option>
                            </select>
                        </div>
                        <div class="card-body">
                            <div class="chart-container">
                                <canvas id="forecastChart"></canvas>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row mt-4">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">Rekomendasi Reorder</h5>
                        </div>
                        <div class="card-body">
                            <div class="table-responsive">
                                <table class="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Produk</th>
                                            <th>Stok Saat Ini</th>
                                            <th>ROP</th>
                                            <th>Forecast 30 hari</th>
                                            <th>Lead Time</th>
                                            <th>Rekomendasi</th>
                                        </tr>
                                    </thead>
                                    <tbody id="reorderRecommendations">
                                        <!-- Will be populated by JavaScript -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">Parameter Forecasting</h5>
                        </div>
                        <div class="card-body">
                            <form id="forecastForm">
                                <div class="mb-3">
                                    <label class="form-label">Metode Forecasting</label>
                                    <select class="form-select" name="method">
                                        <option value="exponential" selected>Exponential Smoothing (α=0.3)</option>
                                        <option value="moving3">Moving Average (3 periode)</option>
                                        <option value="moving5">Moving Average (5 periode)</option>
                                        <option value="regression">Linear Regression</option>
                                    </select>
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label">Tingkat Keyakinan</label>
                                    <select class="form-select" name="confidence">
                                        <option value="95">95% (Tinggi)</option>
                                        <option value="90" selected>90% (Standar)</option>
                                        <option value="80">80% (Rendah)</option>
                                    </select>
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label">Periode Forecasting</label>
                                    <select class="form-select" name="period">
                                        <option value="30">30 hari</option>
                                        <option value="60" selected>60 hari</option>
                                        <option value="90">90 hari</option>
                                    </select>
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label">Pertimbangan Musiman</label>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="seasonalCheck" name="seasonal">
                                        <label class="form-check-label" for="seasonalCheck">
                                            Aktifkan koreksi musiman
                                        </label>
                                    </div>
                                </div>
                                
                                <button type="button" class="btn btn-primary w-100" onclick="analysisManager.calculateForecast()">
                                    <i class="fas fa-calculator"></i> Hitung Ulang Forecast
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="row mt-4">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">Batch Reorder</h5>
                        </div>
                        <div class="card-body">
                            <div class="alert alert-info">
                                <i class="fas fa-info-circle me-2"></i>
                                <strong>Info:</strong> Sistem akan secara otomatis men-generate purchase order untuk produk yang memerlukan reorder.
                            </div>
                            <div class="text-center">
                                <button class="btn btn-success me-2" onclick="analysisManager.generatePurchaseOrders()">
                                    <i class="fas fa-file-pdf"></i> Generate Purchase Orders
                                </button>
                                <button class="btn btn-warning" onclick="analysisManager.sendReorderNotifications()">
                                    <i class="fas fa-bell"></i> Kirim Notifikasi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    init() {
        this.setupTabListeners();
        this.initCharts();
        this.loadReorderRecommendations();
    }
    
    setupTabListeners() {
        // Tab switching
        document.getElementById('analysisTabs')?.addEventListener('shown.bs.tab', (event) => {
            this.currentTab = event.target.getAttribute('href').substring(1);
            
            // Initialize charts for active tab
            switch(this.currentTab) {
                case 'abcAnalysis':
                    if (!stockFlowCharts.charts.abc) {
                        stockFlowCharts.initABCChart();
                    }
                    break;
                case 'turnoverAnalysis':
                    if (!stockFlowCharts.charts.turnover) {
                        stockFlowCharts.initTurnoverChart();
                    }
                    break;
                case 'forecastAnalysis':
                    if (!stockFlowCharts.charts.forecast) {
                        stockFlowCharts.initForecastChart();
                    }
                    break;
            }
        });
    }
    
    initCharts() {
        // Charts are initialized when tabs are shown
    }
    
    getDeadStock() {
        const products = StockFlowData.getProducts();
        const transactions = StockFlowData.transactions;
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        
        return products.map(product => {
            // Find last sale transaction
            const lastSale = transactions
                .filter(t => t.productId === product.id && t.type === 'out')
                .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
            
            return {
                product: product,
                lastSale: lastSale ? lastSale.date : null,
                daysInactive: lastSale ? Math.floor((new Date() - new Date(lastSale.date)) / (1000 * 60 * 60 * 24)) : 999,
                value: product.stock * product.buyPrice
            };
        })
        .filter(item => item.daysInactive > 90)
        .sort((a, b) => b.daysInactive - a.daysInactive);
    }
    
    getAgeDistribution(deadStock) {
        const distribution = [
            { label: '> 180 hari', min: 180, max: Infinity, count: 0, color: 'danger' },
            { label: '120-180 hari', min: 120, max: 180, count: 0, color: 'warning' },
            { label: '90-120 hari', min: 90, max: 120, count: 0, color: 'info' }
        ];
        
        deadStock.forEach(item => {
            const days = item.daysInactive;
            distribution.forEach(dist => {
                if (days >= dist.min && days < dist.max) {
                    dist.count++;
                }
            });
        });
        
        const total = deadStock.length;
        return distribution.map(dist => ({
            ...dist,
            percentage: total > 0 ? Math.round((dist.count / total) * 100) : 0
        }));
    }
    
    loadReorderRecommendations() {
        const recommendations = this.calculateReorderRecommendations();
        const container = document.getElementById('reorderRecommendations');
        
        if (container) {
            container.innerHTML = recommendations.map(rec => `
                <tr>
                    <td>${rec.product.name}</td>
                    <td class="fw-bold ${rec.currentStock <= rec.rop ? 'text-danger' : 'text-warning'}">
                        ${rec.currentStock}
                    </td>
                    <td>${rec.rop}</td>
                    <td>${rec.forecast}</td>
                    <td>${rec.leadTime} hari</td>
                    <td>
                        <span class="badge ${rec.priority === 'high' ? 'bg-danger' : rec.priority === 'medium' ? 'bg-warning' : 'bg-info'}">
                            ${rec.recommendation}
                        </span>
                    </td>
                </tr>
            `).join('');
        }
    }
    
    calculateReorderRecommendations() {
        const products = StockFlowData.getProducts().slice(0, 10); // Take first 10 for demo
        const recommendations = [];
        
        products.forEach(product => {
            // Simple ROP calculation
            const leadTime = 7; // days
            const safetyStock = 10; // units
            const avgDailySales = 5; // units (would be calculated from history in real app)
            
            const rop = (leadTime * avgDailySales) + safetyStock;
            const forecast = Math.round(avgDailySales * 30 * (1 + Math.random() * 0.3)); // 30-day forecast
            
            let recommendation = '';
            let priority = 'low';
            
            if (product.stock <= rop * 0.3) {
                recommendation = `SEGERA ORDER ${rop * 2} unit`;
                priority = 'high';
            } else if (product.stock <= rop) {
                recommendation = `Order ${rop} unit dalam 7 hari`;
                priority = 'medium';
            } else if (product.stock >= product.maxStock * 0.9) {
                recommendation = 'STOP ORDER - Overstock';
                priority = 'low';
            } else {
                recommendation = 'Stok mencukupi';
                priority = 'low';
            }
            
            recommendations.push({
                product: product,
                currentStock: product.stock,
                rop: rop,
                forecast: forecast,
                leadTime: leadTime,
                recommendation: recommendation,
                priority: priority
            });
        });
        
        return recommendations.sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
    }
    
    // Action methods
    generateReorderReport(productId) {
        const product = StockFlowData.getProductById(productId);
        if (!product) return;
        
        const report = `
            LAPORAN REORDER - ${product.name} (${product.sku})
            =============================================
            
            Stok Saat Ini: ${product.stock} unit
            Minimum Stok: ${product.minStock} unit
            Reorder Point: ${Math.round(product.minStock * 1.5)} unit
            Safety Stock: ${Math.round(product.minStock * 0.5)} unit
            
            Rekomendasi: 
            ${product.stock <= product.minStock 
                ? `✓ SEGERA ORDER ${product.minStock * 3 - product.stock} unit`
                : `✓ Order ${product.minStock * 2} unit dalam 14 hari`}
            
            Catatan: Produk termasuk dalam kelas ${product.abcClass}
        `;
        
        const blob = new Blob([report], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reorder_report_${product.sku}_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        stockFlowApp.showAlert(`Laporan reorder untuk ${product.name} berhasil di-generate`, 'success');
    }
    
    setTurnoverTarget() {
        const target = prompt('Masukkan target turnover ratio minimum:', '4.0');
        if (target && !isNaN(parseFloat(target))) {
            localStorage.setItem('turnover_target', target);
            stockFlowApp.showAlert(`Target turnover ratio diset ke ${target}`, 'success');
            
            // Refresh turnover analysis
            if (this.currentTab === 'turnoverAnalysis') {
                stockFlowApp.navigateTo('analysis');
            }
        }
    }
    
    analyzeTrend() {
        stockFlowApp.showAlert('Analisis trend sedang diproses...', 'info');
        setTimeout(() => {
            stockFlowApp.showAlert('Analisis trend selesai. Lihat tab Forecast untuk hasil detail.', 'success');
        }, 2000);
    }
    
    exportTurnoverReport() {
        const report = {
            timestamp: new Date().toISOString(),
            categories: ['Elektronik', 'Fashion', 'Kesehatan', 'Makanan', 'ATK'],
            turnover: [5.8, 4.2, 3.5, 8.2, 2.1],
            recommendations: [
                'Elektronik: Pertahankan performa',
                'Fashion: Optimalkan level stok',
                'Kesehatan: Tingkatkan promosi',
                'Makanan: Pertahankan performa',
                'ATK: Kurangi stok, tingkatkan promosi'
            ]
        };
        
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `turnover_report_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        stockFlowApp.showAlert('Laporan turnover berhasil diekspor', 'success');
    }
    
    applyDiscount(productId) {
        const product = StockFlowData.getProductById(productId);
        if (!product) return;
        
        const discount = prompt(`Masukkan persentase diskon untuk ${product.name} (0-100%):`, '30');
        if (!discount || isNaN(discount) || discount < 0 || discount > 100) return;
        
        const newPrice = product.sellPrice * (1 - discount / 100);
        
        if (confirm(`Set harga jual ${product.name} dari Rp ${product.sellPrice.toLocaleString('id-ID')} menjadi Rp ${newPrice.toLocaleString('id-ID')}?`)) {
            StockFlowData.updateProduct(productId, { 
                sellPrice: newPrice,
                abcClass: 'C' // Demote to Class C after discount
            });
            stockFlowApp.showAlert(`Diskon ${discount}% diterapkan untuk ${product.name}`, 'success');
            
            // Refresh analysis page
            if (stockFlowApp.currentPage === 'analysis') {
                stockFlowApp.navigateTo('analysis');
            }
        }
    }
    
    returnToSupplier(productId) {
        const product = StockFlowData.getProductById(productId);
        if (!product) return;
        
        const quantity = prompt(`Masukkan jumlah ${product.name} yang akan di-retur ke supplier:`, product.stock.toString());
        if (!quantity || isNaN(quantity) || quantity <= 0) return;
        
        if (parseInt(quantity) > product.stock) {
            stockFlowApp.showAlert(`Stok tidak mencukupi! Hanya ${product.stock} unit tersedia`, 'danger');
            return;
        }
        
        if (confirm(`Retur ${quantity} unit ${product.name} ke supplier?`)) {
            const transactionData = {
                type: 'return',
                productId: productId,
                quantity: parseInt(quantity),
                warehouseId: product.warehouseId || 1,
                reference: 'RETURN-' + new Date().getTime(),
                notes: 'Retur dead stock ke supplier',
                userId: 1
            };
            
            StockFlowData.addTransaction(transactionData);
            stockFlowApp.showAlert(`${quantity} unit ${product.name} berhasil di-retur`, 'success');
            
            // Refresh analysis page
            if (stockFlowApp.currentPage === 'analysis') {
                stockFlowApp.navigateTo('analysis');
            }
        }
    }
    
    createBundle(productId) {
        const product = StockFlowData.getProductById(productId);
        if (!product) return;
        
        const fastMovingProducts = StockFlowData.getTopProducts(3).map(p => p.product);
        let bundleOptions = '';
        
        fastMovingProducts.forEach((fmProduct, index) => {
            bundleOptions += `${index + 1}. ${fmProduct.name} (${fmProduct.sku})\n`;
        });
        
        const selection = prompt(`Buat bundling ${product.name} dengan produk fast-moving:\n\n${bundleOptions}\nMasukkan nomor produk (1-3):`, '1');
        if (!selection || isNaN(selection) || selection < 1 || selection > 3) return;
        
        const selectedProduct = fastMovingProducts[parseInt(selection) - 1];
        const bundleName = `Paket ${product.name} + ${selectedProduct.name}`;
        
        stockFlowApp.showAlert(`Bundling ${bundleName} berhasil dibuat!`, 'success');
        
        // In a real app, you would create a bundle product here
    }
    
    takeActionOnDeadStock() {
        const deadStock = this.getDeadStock();
        const criticalDeadStock = deadStock.filter(item => item.daysInactive > 120);
        
        if (criticalDeadStock.length === 0) {
            stockFlowApp.showAlert('Tidak ada dead stock kritis (>120 hari)', 'info');
            return;
        }
        
        if (confirm(`Ambil tindakan massal untuk ${criticalDeadStock.length} dead stock kritis?\n\nAksi: Terapkan diskon 30% otomatis`)) {
            criticalDeadStock.forEach(item => {
                const newPrice = item.product.sellPrice * 0.7;
                StockFlowData.updateProduct(item.product.id, { 
                    sellPrice: newPrice,
                    abcClass: 'C'
                });
            });
            
            stockFlowApp.showAlert(`Diskon 30% diterapkan untuk ${criticalDeadStock.length} produk dead stock`, 'success');
            
            // Refresh analysis page
            if (stockFlowApp.currentPage === 'analysis') {
                stockFlowApp.navigateTo('analysis');
            }
        }
    }
    
    calculateForecast() {
        stockFlowApp.showAlert('Menghitung forecast...', 'info');
        
        setTimeout(() => {
            this.loadReorderRecommendations();
            stockFlowApp.showAlert('Forecast berhasil dihitung ulang', 'success');
        }, 1500);
    }
    
    generatePurchaseOrders() {
        const recommendations = this.calculateReorderRecommendations();
        const urgentOrders = recommendations.filter(r => r.priority === 'high' || r.priority === 'medium');
        
        if (urgentOrders.length === 0) {
            stockFlowApp.showAlert('Tidak ada produk yang memerlukan purchase order saat ini', 'info');
            return;
        }
        
        let poContent = `PURCHASE ORDER - ${new Date().toLocaleDateString('id-ID')}\n`;
        poContent += '===========================================\n\n';
        
        urgentOrders.forEach((order, index) => {
            const qty = order.recommendation.includes('ORDER') ? 
                       parseInt(order.recommendation.match(/\d+/)[0]) : order.rop;
            
            poContent += `${index + 1}. ${order.product.name} (${order.product.sku})\n`;
            poContent += `   Quantity: ${qty} unit\n`;
            poContent += `   Harga: Rp ${order.product.buyPrice.toLocaleString('id-ID')}/unit\n`;
            poContent += `   Total: Rp ${(qty * order.product.buyPrice).toLocaleString('id-ID')}\n`;
            poContent += `   Prioritas: ${order.priority === 'high' ? 'URGENT' : 'MEDIUM'}\n\n`;
        });
        
        const totalValue = urgentOrders.reduce((sum, order) => {
            const qty = order.recommendation.includes('ORDER') ? 
                       parseInt(order.recommendation.match(/\d+/)[0]) : order.rop;
            return sum + (qty * order.product.buyPrice);
        }, 0);
        
        poContent += `TOTAL: Rp ${totalValue.toLocaleString('id-ID')}\n`;
        poContent += `\nGenerated by StockFlow System`;
        
        const blob = new Blob([poContent], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `purchase_order_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        stockFlowApp.showAlert(`${urgentOrders.length} purchase order berhasil di-generate`, 'success');
    }
    
    sendReorderNotifications() {
        const recommendations = this.calculateReorderRecommendations();
        const urgentOrders = recommendations.filter(r => r.priority === 'high');
        
        if (urgentOrders.length === 0) {
            stockFlowApp.showAlert('Tidak ada notifikasi urgent yang perlu dikirim', 'info');
            return;
        }
        
        // Simulate sending notifications
        stockFlowApp.showAlert(`Mengirim ${urgentOrders.length} notifikasi reorder urgent...`, 'info');
        
        setTimeout(() => {
            stockFlowApp.showAlert('Notifikasi berhasil dikirim ke supplier', 'success');
        }, 2000);
    }
}

// Initialize analysis manager
window.analysisManager = new AnalysisManager();
