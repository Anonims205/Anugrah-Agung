// Di dalam class StockFlowApp, tambahkan method load untuk setiap halaman:

async loadProducts() {
    const productsHTML = await window.productsManager?.loadProductsPage() || 'Loading...';
    return productsHTML;
}

async loadInventory() {
    const inventoryHTML = await window.inventoryManager?.loadInventoryPage() || 'Loading...';
    return inventoryHTML;
}

async loadAnalysis() {
    const analysisHTML = await window.analysisManager?.loadAnalysisPage() || 'Loading...';
    return analysisHTML;
}

async loadTransactions() {
    const transactionsHTML = await window.transactionsManager?.loadTransactionsPage() || 'Loading...';
    return transactionsHTML;
}

async loadReports() {
    return `
        <div id="reportsContent">
            <h3 class="mb-4">Laporan</h3>
            <div class="row">
                <div class="col-md-12">
                    <div class="card">
                        <div class="card-header">
                            <h5 class="mb-0">Generator Laporan</h5>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-4 mb-3">
                                    <div class="card border-primary h-100">
                                        <div class="card-body text-center">
                                            <i class="fas fa-boxes fa-3x text-primary mb-3"></i>
                                            <h5>Laporan Stok</h5>
                                            <p class="text-muted">Laporan kondisi stok saat ini</p>
                                            <button class="btn btn-primary w-100" onclick="generateStockReport()">
                                                Generate
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <div class="card border-success h-100">
                                        <div class="card-body text-center">
                                            <i class="fas fa-chart-line fa-3x text-success mb-3"></i>
                                            <h5>Laporan Analisis</h5>
                                            <p class="text-muted">Analisis ABC, turnover, dead stock</p>
                                            <button class="btn btn-success w-100" onclick="generateAnalysisReport()">
                                                Generate
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-4 mb-3">
                                    <div class="card border-warning h-100">
                                        <div class="card-body text-center">
                                            <i class="fas fa-file-invoice-dollar fa-3x text-warning mb-3"></i>
                                            <h5>Laporan Transaksi</h5>
                                            <p class="text-muted">Ringkasan transaksi periode tertentu</p>
                                            <button class="btn btn-warning w-100" onclick="generateTransactionReport()">
                                                Generate
                                            </button>
                                        </div>
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

async loadSettings() {
    return `
        <div id="settingsContent">
            <h3 class="mb-4">Pengaturan Sistem</h3>
            <div class="row">
                <div class="col-md-6">
                    <div class="card mb-4">
                        <div class="card-header">
                            <h5 class="mb-0">Pengaturan Stok</h5>
                        </div>
                        <div class="card-body">
                            <form id="stockSettings">
                                <div class="mb-3">
                                    <label class="form-label">Notifikasi Stok Kritis (%)</label>
                                    <input type="range" class="form-range" min="10" max="50" value="30" id="criticalStockThreshold">
                                    <div class="d-flex justify-content-between">
                                        <small>10%</small>
                                        <small id="thresholdValue">30%</small>
                                        <small>50%</small>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Safety Stock Multiplier</label>
                                    <input type="number" class="form-control" value="1.5" min="1" max="3" step="0.1">
                                    <small class="text-muted">Multiplier untuk perhitungan safety stock</small>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Auto-reorder</label>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" id="autoReorder">
                                        <label class="form-check-label" for="autoReorder">
                                            Aktifkan auto-reorder saat stok mencapai minimum
                                        </label>
                                    </div>
                                </div>
                                <button type="button" class="btn btn-primary">Simpan Pengaturan</button>
                            </form>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card mb-4">
                        <div class="card-header">
                            <h5 class="mb-0">Sistem & Backup</h5>
                        </div>
                        <div class="card-body">
                            <div class="mb-3">
                                <button class="btn btn-outline-primary w-100 mb-2" onclick="backupData()">
                                    <i class="fas fa-download"></i> Backup Data
                                </button>
                                <button class="btn btn-outline-warning w-100 mb-2" onclick="restoreData()">
                                    <i class="fas fa-upload"></i> Restore Data
                                </button>
                                <button class="btn btn-outline-danger w-100" onclick="resetData()">
                                    <i class="fas fa-trash"></i> Reset Data ke Default
                                </button>
                            </div>
                            <div class="alert alert-info">
                                <small>
                                    <i class="fas fa-info-circle"></i>
                                    <strong>Info:</strong> Backup data secara reguler untuk mencegah kehilangan data.
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Tambahkan juga function untuk init page:
initPage(page) {
    switch(page) {
        case 'dashboard':
            if (window.dashboardManager) {
                window.dashboardManager.init();
            }
            break;
        case 'products':
            if (window.productsManager) {
                window.productsManager.init();
            }
            break;
        case 'inventory':
            if (window.inventoryManager) {
                window.inventoryManager.init();
            }
            break;
        case 'analysis':
            if (window.analysisManager) {
                window.analysisManager.init();
            }
            break;
        case 'transactions':
            if (window.transactionsManager) {
                window.transactionsManager.init();
            }
            break;
    }
}
