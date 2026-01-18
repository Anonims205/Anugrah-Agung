// Main application controller - Versi Lengkap
class StockFlowApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.isSidebarCollapsed = false;
        this.charts = {};
        this.filteredProducts = [];
        this.filteredTransactions = [];
        
        this.init();
    }
    
    init() {
        // Load data
        StockFlowData.loadFromLocalStorage();
        
        // Load UI components
        this.loadSidebar();
        this.loadNavbar();
        this.loadModals();
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Show dashboard by default
        this.navigateTo('dashboard');
        
        // Hide loading spinner
        document.getElementById('loadingSpinner').style.display = 'none';
    }
    
    loadSidebar() {
        const sidebarHTML = `
            <div class="sidebar" id="sidebar">
                <div class="text-center mb-4">
                    <h4 class="mb-1" id="logoText">StockFlow</h4>
                    <small class="text-light">Analisis Stok Barang</small>
                </div>
                
                <ul class="nav flex-column">
                    <li class="nav-item">
                        <a class="nav-link active" href="#" data-page="dashboard">
                            <i class="fas fa-tachometer-alt"></i>
                            <span>Dashboard</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" data-page="products">
                            <i class="fas fa-boxes"></i>
                            <span>Manajemen Produk</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" data-page="inventory">
                            <i class="fas fa-warehouse"></i>
                            <span>Stok Real-time</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" data-page="analysis">
                            <i class="fas fa-chart-line"></i>
                            <span>Analisis Stok</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" data-page="transactions">
                            <i class="fas fa-exchange-alt"></i>
                            <span>Transaksi</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" data-page="reports">
                            <i class="fas fa-file-alt"></i>
                            <span>Laporan</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="#" data-page="settings">
                            <i class="fas fa-cog"></i>
                            <span>Pengaturan</span>
                        </a>
                    </li>
                    <li class="nav-item mt-4">
                        <hr class="bg-light">
                        <a class="nav-link" href="#" id="logoutBtn">
                            <i class="fas fa-sign-out-alt"></i>
                            <span>Keluar</span>
                        </a>
                    </li>
                </ul>
            </div>
        `;
        
        document.getElementById('sidebar-container').innerHTML = sidebarHTML;
    }
    
    loadNavbar() {
        const navbarHTML = `
            <nav class="navbar navbar-light bg-white shadow-sm">
                <div class="container-fluid">
                    <div class="d-flex align-items-center">
                        <button class="btn btn-outline-secondary me-3" id="sidebarToggle">
                            <i class="fas fa-times"></i>
                        </button>
                        <div class="search-box">
                            <div class="input-group">
                                <span class="input-group-text bg-light border-0">
                                    <i class="fas fa-search text-muted"></i>
                                </span>
                                <input type="text" class="form-control border-0 bg-light" 
                                       id="globalSearch" placeholder="Cari produk, kategori, SKU...">
                            </div>
                        </div>
                    </div>
                    
                    <div class="d-flex align-items-center">
                        <div class="dropdown me-3">
                            <a href="#" class="d-flex align-items-center text-decoration-none dropdown-toggle" 
                               id="notifDropdown" data-bs-toggle="dropdown">
                                <i class="fas fa-bell text-muted fs-5"></i>
                                <span class="badge bg-danger rounded-pill" id="notificationCount">0</span>
                            </a>
                            <div class="dropdown-menu dropdown-menu-end" aria-labelledby="notifDropdown">
                                <h6 class="dropdown-header">Notifikasi</h6>
                                <div id="notificationList"></div>
                                <hr class="dropdown-divider">
                                <a class="dropdown-item text-center" href="#" id="clearNotifications">Tandai Semua Telah Dibaca</a>
                            </div>
                        </div>
                        
                        <div class="dropdown">
                            <a href="#" class="d-flex align-items-center text-decoration-none dropdown-toggle" 
                               id="userDropdown" data-bs-toggle="dropdown">
                                <div class="rounded-circle bg-primary d-flex align-items-center justify-content-center" 
                                     style="width: 40px; height: 40px;">
                                    <span class="text-white fw-bold">AD</span>
                                </div>
                                <div class="ms-2 d-none d-md-block">
                                    <div class="fw-bold">Admin Gudang</div>
                                    <small class="text-muted">Manager</small>
                                </div>
                            </a>
                            <div class="dropdown-menu dropdown-menu-end">
                                <a class="dropdown-item" href="#">
                                    <i class="fas fa-user me-2"></i> Profil
                                </a>
                                <a class="dropdown-item" href="#">
                                    <i class="fas fa-cog me-2"></i> Pengaturan Akun
                                </a>
                                <hr class="dropdown-divider">
                                <a class="dropdown-item" href="#" id="userLogout">
                                    <i class="fas fa-sign-out-alt me-2"></i> Keluar
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        `;
        
        document.getElementById('navbar-container').innerHTML = navbarHTML;
        this.updateNotifications();
    }
    
    loadModals() {
        const modalsHTML = `
            <!-- Add Product Modal -->
            <div class="modal fade" id="addProductModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Tambah Produk Baru</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="addProductForm">
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Nama Produk *</label>
                                        <input type="text" class="form-control" name="name" required>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">SKU *</label>
                                        <input type="text" class="form-control" name="sku" required>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Kategori *</label>
                                        <select class="form-select" name="category" required>
                                            <option value="">Pilih Kategori</option>
                                            <option value="Elektronik > Gadget">Elektronik > Gadget</option>
                                            <option value="Elektronik > Komputer">Elektronik > Komputer</option>
                                            <option value="Fashion > Pria > Atasan">Fashion > Pria > Atasan</option>
                                            <option value="Fashion > Pria > Sepatu">Fashion > Pria > Sepatu</option>
                                            <option value="Kesehatan > Suplemen">Kesehatan > Suplemen</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Supplier</label>
                                        <select class="form-select" name="supplierId">
                                            <option value="">Pilih Supplier</option>
                                            ${StockFlowData.suppliers.map(s => 
                                                `<option value="${s.id}">${s.name}</option>`
                                            ).join('')}
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Harga Beli *</label>
                                        <div class="input-group">
                                            <span class="input-group-text">Rp</span>
                                            <input type="number" class="form-control" name="buyPrice" required min="0">
                                        </div>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Harga Jual *</label>
                                        <div class="input-group">
                                            <span class="input-group-text">Rp</span>
                                            <input type="number" class="form-control" name="sellPrice" required min="0">
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-4 mb-3">
                                        <label class="form-label">Stok Awal</label>
                                        <input type="number" class="form-control" name="stock" value="0" min="0">
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label class="form-label">Stok Minimum</label>
                                        <input type="number" class="form-control" name="minStock" value="10" min="0">
                                    </div>
                                    <div class="col-md-4 mb-3">
                                        <label class="form-label">Stok Maksimum</label>
                                        <input type="number" class="form-control" name="maxStock" value="100" min="0">
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Lokasi</label>
                                        <select class="form-select" name="warehouseId">
                                            <option value="">Pilih Lokasi</option>
                                            ${StockFlowData.warehouses.map(w => 
                                                `<option value="${w.id}">${w.name}</option>`
                                            ).join('')}
                                        </select>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Unit</label>
                                        <select class="form-select" name="unit">
                                            <option value="Pcs">Pcs</option>
                                            <option value="Box">Box</option>
                                            <option value="Kg">Kg</option>
                                            <option value="Liter">Liter</option>
                                            <option value="Meter">Meter</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label">Deskripsi</label>
                                    <textarea class="form-control" name="description" rows="3"></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                            <button type="button" class="btn btn-primary" id="saveProductBtn">Simpan Produk</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Add Transaction Modal -->
            <div class="modal fade" id="addTransactionModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Transaksi Stok Baru</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="addTransactionForm">
                                <div class="mb-3">
                                    <label class="form-label">Jenis Transaksi *</label>
                                    <select class="form-select" name="type" required>
                                        <option value="">Pilih Jenis</option>
                                        <option value="in">Stok Masuk (Pembelian)</option>
                                        <option value="out">Stok Keluar (Penjualan)</option>
                                        <option value="adjust">Adjustment</option>
                                        <option value="return">Retur</option>
                                    </select>
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label">Produk *</label>
                                    <select class="form-select" name="productId" required>
                                        <option value="">Pilih Produk</option>
                                        ${StockFlowData.products.map(p => 
                                            `<option value="${p.id}">${p.name} (${p.sku}) - Stok: ${p.stock}</option>`
                                        ).join('')}
                                    </select>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Quantity *</label>
                                        <input type="number" class="form-control" name="quantity" required min="1">
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Lokasi *</label>
                                        <select class="form-select" name="warehouseId" required>
                                            <option value="">Pilih Lokasi</option>
                                            ${StockFlowData.warehouses.map(w => 
                                                `<option value="${w.id}">${w.name}</option>`
                                            ).join('')}
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label">Referensi (No. PO/Invoice)</label>
                                    <input type="text" class="form-control" name="reference">
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label">Keterangan</label>
                                    <textarea class="form-control" name="notes" rows="2"></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                            <button type="button" class="btn btn-primary" id="saveTransactionBtn">Simpan Transaksi</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Edit Product Modal -->
            <div class="modal fade" id="editProductModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Edit Produk</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="editProductForm">
                                <input type="hidden" name="id">
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Nama Produk *</label>
                                        <input type="text" class="form-control" name="name" required>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">SKU *</label>
                                        <input type="text" class="form-control" name="sku" required>
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Stok Saat Ini</label>
                                        <input type="number" class="form-control" name="stock" readonly>
                                    </div>
                                    <div class="col-md-3 mb-3">
                                        <label class="form-label">Stok Minimum</label>
                                        <input type="number" class="form-control" name="minStock" min="0">
                                    </div>
                                    <div class="col-md-3 mb-3">
                                        <label class="form-label">Stok Maksimum</label>
                                        <input type="number" class="form-control" name="maxStock" min="0">
                                    </div>
                                </div>
                                
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Harga Beli *</label>
                                        <div class="input-group">
                                            <span class="input-group-text">Rp</span>
                                            <input type="number" class="form-control" name="buyPrice" required min="0">
                                        </div>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label class="form-label">Harga Jual *</label>
                                        <div class="input-group">
                                            <span class="input-group-text">Rp</span>
                                            <input type="number" class="form-control" name="sellPrice" required min="0">
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label">Deskripsi</label>
                                    <textarea class="form-control" name="description" rows="3"></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                            <button type="button" class="btn btn-primary" id="updateProductBtn">Update Produk</button>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Product Details Modal -->
            <div class="modal fade" id="productDetailsModal" tabindex="-1">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Detail Produk</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body" id="productDetailsContent">
                            Loading...
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Export Modal -->
            <div class="modal fade" id="exportModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Export Data</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="exportForm">
                                <div class="mb-3">
                                    <label class="form-label">Format Export</label>
                                    <select class="form-select" id="exportFormat">
                                        <option value="csv">CSV</option>
                                        <option value="excel">Excel</option>
                                        <option value="pdf">PDF</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Data Range</label>
                                    <select class="form-select" id="exportRange">
                                        <option value="all">Semua Data</option>
                                        <option value="filtered">Data yang Difilter</option>
                                        <option value="selected">Data Terpilih</option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Kolom</label>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="sku" checked>
                                        <label class="form-check-label">SKU</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="name" checked>
                                        <label class="form-check-label">Nama Produk</label>
                                    </div>
                                    <div class="form-check">
                                        <input class="form-check-input" type="checkbox" value="stock" checked>
                                        <label class="form-check-label">Stok</label>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Batal</button>
                            <button type="button" class="btn btn-primary" onclick="stockFlowApp.performExport()">Export</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('modals-container').innerHTML = modalsHTML;
    }
    
    initEventListeners() {
        // Sidebar toggle
        document.getElementById('sidebarToggle')?.addEventListener('click', () => this.toggleSidebar());
        
        // Navigation
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-page]');
            if (link) {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.navigateTo(page);
            }
        });
        
        // Global search
        document.getElementById('globalSearch')?.addEventListener('input', (e) => {
            this.handleGlobalSearch(e.target.value);
        });
        
        // Logout buttons
        document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });
        
        document.getElementById('userLogout')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });
        
        // Clear notifications
        document.getElementById('clearNotifications')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.clearNotifications();
        });
        
        // Product form
        document.getElementById('saveProductBtn')?.addEventListener('click', () => this.saveProduct());
        document.getElementById('updateProductBtn')?.addEventListener('click', () => this.updateProduct());
        
        // Transaction form
        document.getElementById('saveTransactionBtn')?.addEventListener('click', () => this.saveTransaction());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
        
        // Form submissions
        document.getElementById('addProductForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProduct();
        });
        
        document.getElementById('addTransactionForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTransaction();
        });
    }
    
    async loadPage(page) {
        const pageContent = document.getElementById('pageContent');
        pageContent.innerHTML = '<div class="loading-spinner"><div class="spinner-border text-primary"></div><p class="mt-2">Memuat...</p></div>';
        
        try {
            let html = '';
            
            switch(page) {
                case 'dashboard':
                    html = await this.loadDashboard();
                    break;
                case 'products':
                    html = await this.loadProducts();
                    break;
                case 'inventory':
                    html = await this.loadInventory();
                    break;
                case 'analysis':
                    html = await this.loadAnalysis();
                    break;
                case 'transactions':
                    html = await this.loadTransactions();
                    break;
                case 'reports':
                    html = await this.loadReports();
                    break;
                case 'settings':
                    html = await this.loadSettings();
                    break;
                default:
                    html = await this.loadDashboard();
            }
            
            pageContent.innerHTML = html;
            
            // Initialize page-specific functionality
            this.initPage(page);
            
        } catch (error) {
            console.error('Error loading page:', error);
            pageContent.innerHTML = `
                <div class="alert alert-danger">
                    <h5>Error Memuat Halaman</h5>
                    <p>${error.message}</p>
                    <button class="btn btn-primary mt-2" onclick="stockFlowApp.navigateTo('dashboard')">
                        Kembali ke Dashboard
                    </button>
                </div>
            `;
        }
    }
    
    // ==================== DASHBOARD ====================
    async loadDashboard() {
        const metrics = StockFlowData.getDashboardMetrics();
        const stockStatus = StockFlowData.getStockStatus();
        const recentTransactions = StockFlowData.getRecentTransactions(5);
        const topProducts = StockFlowData.getTopProducts(5);
        
        return `
            <div id="dashboardContent">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h3 class="mb-0">Dashboard</h3>
                    <div>
                        <select class="form-select form-select-sm w-auto d-inline-block" id="dashboardPeriod">
                            <option>Hari Ini</option>
                            <option selected>7 Hari Terakhir</option>
                            <option>Bulan Ini</option>
                            <option>Tahun Ini</option>
                        </select>
                    </div>
                </div>
                
                <!-- Metrics Cards -->
                <div class="row">
                    <div class="col-xl-3 col-md-6">
                        <div class="metric-card primary">
                            <div class="value" id="totalStock">${metrics.totalProducts}</div>
                            <div class="label">Total Produk</div>
                            <div class="mt-2">
                                <small><i class="fas fa-arrow-up"></i> 5.2% dari bulan lalu</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-md-6">
                        <div class="metric-card success">
                            <div class="value">Rp ${this.formatNumber(metrics.inventoryValue)}</div>
                            <div class="label">Nilai Inventaris</div>
                            <div class="mt-2">
                                <small><i class="fas fa-arrow-up"></i> 12.3% dari bulan lalu</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-md-6">
                        <div class="metric-card warning">
                            <div class="value">${metrics.turnoverRatio}</div>
                            <div class="label">Turnover Ratio</div>
                            <div class="mt-2">
                                <small><i class="fas fa-arrow-down"></i> 0.3 dari bulan lalu</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-md-6">
                        <div class="metric-card danger">
                            <div class="value">${metrics.deadStock}</div>
                            <div class="label">Dead Stock</div>
                            <div class="mt-2">
                                <small><i class="fas fa-exclamation-triangle"></i> Perlu perhatian</small>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Charts and Tables -->
                <div class="row">
                    <!-- Stock Movement Chart -->
                    <div class="col-xl-8">
                        <div class="card">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <h5 class="mb-0">Pergerakan Stok 30 Hari</h5>
                                <div>
                                    <button class="btn btn-sm btn-outline-secondary active" data-period="30">30 Hari</button>
                                    <button class="btn btn-sm btn-outline-secondary" data-period="90">90 Hari</button>
                                    <button class="btn btn-sm btn-outline-secondary" data-period="365">1 Tahun</button>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="chart-container">
                                    <canvas id="stockMovementChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Stock Alerts -->
                    <div class="col-xl-4">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0">Peringatan Stok</h5>
                            </div>
                            <div class="card-body p-0">
                                <div class="list-group list-group-flush">
                                    <div class="list-group-item list-group-item-action">
                                        <div class="d-flex w-100 justify-content-between">
                                            <h6 class="mb-1 text-danger">Stok Kritis</h6>
                                            <span class="badge bg-danger">${stockStatus.critical}</span>
                                        </div>
                                        <p class="mb-1 small">Produk dengan stok di bawah minimum</p>
                                        <button class="btn btn-sm btn-outline-danger mt-2" onclick="stockFlowApp.navigateTo('products')">Lihat Produk</button>
                                    </div>
                                    <div class="list-group-item list-group-item-action">
                                        <div class="d-flex w-100 justify-content-between">
                                            <h6 class="mb-1 text-warning">Hampir Habis</h6>
                                            <span class="badge bg-warning">${stockStatus.low}</span>
                                        </div>
                                        <p class="mb-1 small">Mendekati batas minimum</p>
                                        <button class="btn btn-sm btn-outline-warning mt-2" onclick="stockFlowApp.navigateTo('products')">Lihat Produk</button>
                                    </div>
                                    <div class="list-group-item list-group-item-action">
                                        <div class="d-flex w-100 justify-content-between">
                                            <h6 class="mb-1 text-info">Overstock</h6>
                                            <span class="badge bg-info">${stockStatus.overstock}</span>
                                        </div>
                                        <p class="mb-1 small">Melebihi batas maksimum</p>
                                        <button class="btn btn-sm btn-outline-info mt-2" onclick="stockFlowApp.navigateTo('products')">Lihat Produk</button>
                                    </div>
                                    <div class="list-group-item list-group-item-action">
                                        <div class="d-flex w-100 justify-content-between">
                                            <h6 class="mb-1">Expiry Dekat</h6>
                                            <span class="badge bg-secondary">5</span>
                                        </div>
                                        <p class="mb-1 small">Mendekati tanggal kadaluarsa</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Top Products and Recent Activity -->
                <div class="row mt-4">
                    <!-- Top Products -->
                    <div class="col-xl-6">
                        <div class="card">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <h5 class="mb-0">5 Produk Terlaris</h5>
                                <select class="form-select form-select-sm w-auto" id="topProductsPeriod">
                                    <option>Bulan Ini</option>
                                    <option>3 Bulan Terakhir</option>
                                    <option>Tahun Ini</option>
                                </select>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Produk</th>
                                                <th>SKU</th>
                                                <th>Terjual</th>
                                                <th>Nilai</th>
                                                <th>Trend</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${topProducts.map(product => `
                                                <tr>
                                                    <td>${product.product.name}</td>
                                                    <td><span class="badge bg-light text-dark">${product.product.sku}</span></td>
                                                    <td>${product.quantity}</td>
                                                    <td>Rp ${this.formatNumber(product.revenue)}</td>
                                                    <td><span class="text-success"><i class="fas fa-arrow-up"></i> 15%</span></td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Recent Activity -->
                    <div class="col-xl-6">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0">Aktivitas Terkini</h5>
                            </div>
                            <div class="card-body" style="max-height: 350px; overflow-y: auto;">
                                <div class="timeline">
                                    ${recentTransactions.map(transaction => {
                                        const product = StockFlowData.getProductById(transaction.productId);
                                        const warehouse = StockFlowData.warehouses.find(w => w.id == transaction.warehouseId);
                                        const typeLabels = {
                                            'in': { label: 'Stok Masuk', class: 'success', icon: 'arrow-down' },
                                            'out': { label: 'Penjualan', class: 'danger', icon: 'arrow-up' },
                                            'adjust': { label: 'Adjustment', class: 'warning', icon: 'exchange-alt' },
                                            'return': { label: 'Retur', class: 'info', icon: 'undo' }
                                        };
                                        const type = typeLabels[transaction.type];
                                        
                                        return `
                                            <div class="d-flex mb-3">
                                                <div class="flex-shrink-0">
                                                    <span class="status-indicator status-${transaction.type}"></span>
                                                </div>
                                                <div class="flex-grow-1 ms-3">
                                                    <h6 class="mb-0">${type.label}</h6>
                                                    <p class="mb-1 small">${product?.name || 'Produk'} (${transaction.quantity} unit) ${warehouse ? `di ${warehouse.name}` : ''}</p>
                                                    <small class="text-muted">${this.formatTimeAgo(transaction.date)} • ${transaction.reference || 'Tanpa referensi'}</small>
                                                </div>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // ==================== PRODUCTS ====================
    async loadProducts() {
        const products = StockFlowData.getProducts();
        const categories = StockFlowData.categories;
        
        return `
            <div id="productsContent">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h3 class="mb-0">Manajemen Produk</h3>
                    <div>
                        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addProductModal">
                            <i class="fas fa-plus"></i> Tambah Produk
                        </button>
                        <button class="btn btn-outline-secondary ms-2" onclick="stockFlowApp.exportToExcel()">
                            <i class="fas fa-upload"></i> Export Excel
                        </button>
                    </div>
                </div>
                
                <!-- Filters -->
                <div class="card mb-4">
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-3">
                                <label class="form-label">Kategori</label>
                                <select class="form-select" id="filterCategory">
                                    <option value="">Semua Kategori</option>
                                    ${categories.map(cat => 
                                        `<option value="${cat.name}">${cat.name}</option>`
                                    ).join('')}
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Status Stok</label>
                                <select class="form-select" id="filterStatus">
                                    <option value="">Semua Status</option>
                                    <option value="critical">Stok Kritis</option>
                                    <option value="low">Stok Rendah</option>
                                    <option value="normal">Stok Normal</option>
                                    <option value="overstock">Overstock</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Klasifikasi ABC</label>
                                <select class="form-select" id="filterABC">
                                    <option value="">Semua Klasifikasi</option>
                                    <option value="A">Kelas A</option>
                                    <option value="B">Kelas B</option>
                                    <option value="C">Kelas C</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Supplier</label>
                                <select class="form-select" id="filterSupplier">
                                    <option value="">Semua Supplier</option>
                                    ${StockFlowData.suppliers.map(s => 
                                        `<option value="${s.id}">${s.name}</option>`
                                    ).join('')}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Products Table -->
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">Daftar Produk (${products.length} items)</h5>
                        <div class="d-flex align-items-center">
                            <div class="input-group input-group-sm me-2" style="width: 200px;">
                                <input type="text" class="form-control" id="productSearch" placeholder="Cari produk...">
                                <button class="btn btn-outline-secondary" type="button" onclick="stockFlowApp.searchProducts()">
                                    <i class="fas fa-search"></i>
                                </button>
                            </div>
                            <button class="btn btn-sm btn-outline-secondary" onclick="stockFlowApp.navigateTo('products')">
                                <i class="fas fa-sync-alt"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover mb-0" id="productsTable">
                                <thead>
                                    <tr>
                                        <th width="50">
                                            <input type="checkbox" class="form-check-input" id="selectAll">
                                        </th>
                                        <th>Produk</th>
                                        <th>SKU</th>
                                        <th>Kategori</th>
                                        <th>Stok</th>
                                        <th>Min/Max</th>
                                        <th>Harga Beli</th>
                                        <th>Harga Jual</th>
                                        <th>ABC</th>
                                        <th>Status</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody id="productsTableBody">
                                    ${products.map(product => this.renderProductRow(product)).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="card-footer d-flex justify-content-between align-items-center">
                        <div class="text-muted" id="productsCount">
                            Menampilkan ${products.length} dari ${products.length} produk
                        </div>
                        <div class="btn-group">
                            <button class="btn btn-sm btn-outline-danger" onclick="stockFlowApp.deleteSelectedProducts()">
                                <i class="fas fa-trash"></i> Hapus Terpilih
                            </button>
                            <button class="btn btn-sm btn-outline-warning" onclick="stockFlowApp.adjustStockBatch()">
                                <i class="fas fa-exchange-alt"></i> Adjust Stock
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderProductRow(product) {
        let statusClass = '';
        let statusText = 'Normal';
        let statusColor = 'success';
        
        if (product.stock <= product.minStock * 0.3) {
            statusClass = 'critical-stock';
            statusText = 'Kritis';
            statusColor = 'danger';
        } else if (product.stock <= product.minStock) {
            statusClass = 'low-stock';
            statusText = 'Hampir Habis';
            statusColor = 'warning';
        } else if (product.stock >= product.maxStock * 0.9) {
            statusClass = 'overstock';
            statusText = 'Overstock';
            statusColor = 'info';
        }
        
        let abcBadgeClass = 'badge-abc-' + product.abcClass.toLowerCase();
        let abcBadgeColor = product.abcClass === 'A' ? 'success' : 
                          product.abcClass === 'B' ? 'warning' : 'secondary';
        
        return `
            <tr class="${statusClass}" data-product-id="${product.id}">
                <td>
                    <input type="checkbox" class="form-check-input product-checkbox" value="${product.id}">
                </td>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="product-img me-2">
                            <i class="fas fa-box"></i>
                        </div>
                        <div>
                            <div class="fw-bold">${product.name}</div>
                            <small class="text-muted">${product.description || 'Tanpa deskripsi'}</small>
                        </div>
                    </div>
                </td>
                <td><span class="badge bg-light text-dark">${product.sku}</span></td>
                <td>${product.category}</td>
                <td>
                    <div class="fw-bold ${statusColor === 'danger' ? 'text-danger' : statusColor === 'warning' ? 'text-warning' : ''}">
                        ${product.stock}
                    </div>
                    <small>${StockFlowData.warehouses.find(w => w.id == product.warehouseId)?.name || '-'}</small>
                </td>
                <td>
                    <small>Min: ${product.minStock}</small><br>
                    <small>Max: ${product.maxStock}</small>
                </td>
                <td>Rp ${product.buyPrice.toLocaleString('id-ID')}</td>
                <td>Rp ${product.sellPrice.toLocaleString('id-ID')}</td>
                <td><span class="badge ${abcBadgeClass}">${product.abcClass}</span></td>
                <td><span class="badge bg-${statusColor}">${statusText}</span></td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="stockFlowApp.editProduct(${product.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-outline-info" onclick="stockFlowApp.showProductAnalysis(${product.id})">
                            <i class="fas fa-chart-line"></i>
                        </button>
                        <button class="btn btn-outline-success" onclick="stockFlowApp.quickTransaction(${product.id}, 'in')">
                            <i class="fas fa-arrow-down"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="stockFlowApp.quickTransaction(${product.id}, 'out')">
                            <i class="fas fa-arrow-up"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }
    
    // ==================== INVENTORY ====================
    async loadInventory() {
        const products = StockFlowData.getProducts();
        const warehouses = StockFlowData.warehouses;
        
        // Group products by warehouse
        const warehouseGroups = {};
        warehouses.forEach(warehouse => {
            warehouseGroups[warehouse.id] = {
                warehouse: warehouse,
                products: products.filter(p => p.warehouseId === warehouse.id),
                totalValue: 0,
                totalStock: 0
            };
            
            warehouseGroups[warehouse.id].products.forEach(p => {
                warehouseGroups[warehouse.id].totalValue += p.stock * p.buyPrice;
                warehouseGroups[warehouse.id].totalStock += p.stock;
            });
        });
        
        // Products without warehouse
        const noWarehouseProducts = products.filter(p => !p.warehouseId);
        
        return `
            <div id="inventoryContent">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h3 class="mb-0">Stok Real-time</h3>
                    <div>
                        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addTransactionModal">
                            <i class="fas fa-exchange-alt"></i> Transaksi Baru
                        </button>
                        <button class="btn btn-outline-secondary ms-2" onclick="stockFlowApp.printInventoryReport()">
                            <i class="fas fa-print"></i> Print
                        </button>
                    </div>
                </div>
                
                <!-- Inventory Summary -->
                <div class="row mb-4">
                    <div class="col-md-3">
                        <div class="card border-primary">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 class="text-muted">Total Stok</h6>
                                        <h3 class="mb-0">${products.reduce((sum, p) => sum + p.stock, 0)}</h3>
                                    </div>
                                    <div class="text-primary">
                                        <i class="fas fa-boxes fa-2x"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card border-success">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 class="text-muted">Total Nilai</h6>
                                        <h3 class="mb-0">Rp ${this.formatNumber(products.reduce((sum, p) => sum + (p.stock * p.buyPrice), 0))}</h3>
                                    </div>
                                    <div class="text-success">
                                        <i class="fas fa-dollar-sign fa-2x"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card border-warning">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 class="text-muted">Average Turnover</h6>
                                        <h3 class="mb-0">${StockFlowData.getDashboardMetrics().turnoverRatio}</h3>
                                    </div>
                                    <div class="text-warning">
                                        <i class="fas fa-sync-alt fa-2x"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card border-info">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h6 class="text-muted">Utilization</h6>
                                        <h3 class="mb-0">${Math.round((products.reduce((sum, p) => sum + p.stock, 0) / 
                                            (warehouses.reduce((sum, w) => sum + w.capacity, 0)) * 100))}%</h3>
                                    </div>
                                    <div class="text-info">
                                        <i class="fas fa-chart-pie fa-2x"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Warehouse Sections -->
                ${Object.values(warehouseGroups).map(group => `
                    <div class="card mb-4">
                        <div class="card-header d-flex justify-content-between align-items-center">
                            <div>
                                <h5 class="mb-0">${group.warehouse.name}</h5>
                                <small class="text-muted">${group.warehouse.location} • Kapasitas: ${group.warehouse.capacity}</small>
                            </div>
                            <div>
                                <span class="badge bg-primary">Stok: ${group.totalStock}</span>
                                <span class="badge bg-success ms-2">Nilai: Rp ${this.formatNumber(group.totalValue)}</span>
                                <span class="badge bg-info ms-2">${group.products.length} Produk</span>
                            </div>
                        </div>
                        <div class="card-body">
                            ${group.products.length > 0 ? `
                                <div class="table-responsive">
                                    <table class="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Produk</th>
                                                <th>SKU</th>
                                                <th>Stok</th>
                                                <th>Status</th>
                                                <th>Nilai</th>
                                                <th>Terakhir Update</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${group.products.slice(0, 5).map(product => {
                                                let statusColor = 'success';
                                                if (product.stock <= product.minStock * 0.3) statusColor = 'danger';
                                                else if (product.stock <= product.minStock) statusColor = 'warning';
                                                else if (product.stock >= product.maxStock * 0.9) statusColor = 'info';
                                                
                                                return `
                                                    <tr>
                                                        <td>
                                                            <div class="fw-bold">${product.name}</div>
                                                            <small class="text-muted">${product.category}</small>
                                                        </td>
                                                        <td><span class="badge bg-light text-dark">${product.sku}</span></td>
                                                        <td>
                                                            <div class="d-flex align-items-center">
                                                                <div class="progress flex-grow-1 me-2" style="height: 8px;">
                                                                    <div class="progress-bar bg-${statusColor}" style="width: ${(product.stock / product.maxStock) * 100}%"></div>
                                                                </div>
                                                                <span>${product.stock}</span>
                                                            </div>
                                                        </td>
                                                        <td><span class="badge bg-${statusColor}">${this.getStockStatusLabel(product)}</span></td>
                                                        <td>Rp ${this.formatNumber(product.stock * product.buyPrice)}</td>
                                                        <td>${product.lastUpdated ? this.formatTimeAgo(product.lastUpdated) : '-'}</td>
                                                    </tr>
                                                `;
                                            }).join('')}
                                        </tbody>
                                    </table>
                                </div>
                                ${group.products.length > 5 ? `
                                    <div class="text-center mt-2">
                                        <button class="btn btn-sm btn-outline-primary" onclick="stockFlowApp.showAllProductsInWarehouse(${group.warehouse.id})">
                                            Lihat ${group.products.length - 5} produk lainnya
                                        </button>
                                    </div>
                                ` : ''}
                            ` : `
                                <div class="text-center py-4">
                                    <i class="fas fa-warehouse fa-3x text-muted mb-3"></i>
                                    <p class="text-muted">Tidak ada produk di gudang ini</p>
                                    <button class="btn btn-sm btn-primary" onclick="stockFlowApp.navigateTo('products')">
                                        Tambah Produk
                                    </button>
                                </div>
                            `}
                        </div>
                    </div>
                `).join('')}
                
                <!-- Products without warehouse -->
                ${noWarehouseProducts.length > 0 ? `
                    <div class="card border-warning">
                        <div class="card-header bg-warning text-white">
                            <h5 class="mb-0">Produk Tanpa Lokasi</h5>
                        </div>
                        <div class="card-body">
                            <div class="alert alert-warning">
                                <i class="fas fa-exclamation-triangle"></i>
                                ${noWarehouseProducts.length} produk belum memiliki lokasi gudang
                            </div>
                            <div class="table-responsive">
                                <table class="table table-sm">
                                    <thead>
                                        <tr>
                                            <th>Produk</th>
                                            <th>SKU</th>
                                            <th>Stok</th>
                                            <th>Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${noWarehouseProducts.map(product => `
                                            <tr>
                                                <td>${product.name}</td>
                                                <td><span class="badge bg-light text-dark">${product.sku}</span></td>
                                                <td>${product.stock}</td>
                                                <td>
                                                    <button class="btn btn-sm btn-outline-primary" onclick="stockFlowApp.assignWarehouse(${product.id})">
                                                        <i class="fas fa-map-marker-alt"></i> Assign
                                                    </button>
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    // ==================== ANALYSIS ====================
    async loadAnalysis() {
        const abcAnalysis = StockFlowData.getABCAnalysis();
        const turnoverAnalysis = StockFlowData.getTurnoverAnalysis();
        const deadStock = StockFlowData.getDeadStock();
        
        return `
            <div id="analysisContent">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h3 class="mb-0">Analisis Stok</h3>
                    <div>
                        <button class="btn btn-primary" onclick="stockFlowApp.runABCClassification()">
                            <i class="fas fa-calculator"></i> Analisis ABC
                        </button>
                        <button class="btn btn-outline-secondary ms-2" onclick="stockFlowApp.exportAnalysis()">
                            <i class="fas fa-download"></i> Export Analisis
                        </button>
                    </div>
                </div>
                
                <!-- ABC Analysis -->
                <div class="row mb-4">
                    <div class="col-md-8">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0">Analisis ABC</h5>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-md-4">
                                        <div class="text-center">
                                            <div class="display-4 text-success">${abcAnalysis.A.count}</div>
                                            <h6>Kelas A</h6>
                                            <p class="text-muted small">${abcAnalysis.A.percentage}% Nilai</p>
                                            <div class="progress" style="height: 10px;">
                                                <div class="progress-bar bg-success" style="width: ${abcAnalysis.A.percentage}%"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="text-center">
                                            <div class="display-4 text-warning">${abcAnalysis.B.count}</div>
                                            <h6>Kelas B</h6>
                                            <p class="text-muted small">${abcAnalysis.B.percentage}% Nilai</p>
                                            <div class="progress" style="height: 10px;">
                                                <div class="progress-bar bg-warning" style="width: ${abcAnalysis.B.percentage}%"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-4">
                                        <div class="text-center">
                                            <div class="display-4 text-secondary">${abcAnalysis.C.count}</div>
                                            <h6>Kelas C</h6>
                                            <p class="text-muted small">${abcAnalysis.C.percentage}% Nilai</p>
                                            <div class="progress" style="height: 10px;">
                                                <div class="progress-bar bg-secondary" style="width: ${abcAnalysis.C.percentage}%"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="mt-4">
                                    <canvas id="abcChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0">Rekomendasi</h5>
                            </div>
                            <div class="card-body">
                                <div class="mb-3">
                                    <h6><span class="badge bg-success">Kelas A</span></h6>
                                    <p class="small">Prioritas tinggi, monitor ketat, safety stock tinggi</p>
                                </div>
                                <div class="mb-3">
                                    <h6><span class="badge bg-warning">Kelas B</span></h6>
                                    <p class="small">Prioritas sedang, review periodik, safety stock sedang</p>
                                </div>
                                <div class="mb-3">
                                    <h6><span class="badge bg-secondary">Kelas C</span></h6>
                                    <p class="small">Prioritas rendah, reorder sederhana, safety stock rendah</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Turnover Analysis -->
                <div class="row mb-4">
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0">Turnover Ratio</h5>
                            </div>
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <div>
                                        <h3 class="mb-0">${turnoverAnalysis.averageTurnover.toFixed(2)}</h3>
                                        <small class="text-muted">Rata-rata Turnover</small>
                                    </div>
                                    <div>
                                        <span class="badge ${turnoverAnalysis.averageTurnover > 6 ? 'bg-success' : 'bg-warning'}">
                                            ${turnoverAnalysis.averageTurnover > 6 ? 'Baik' : 'Perlu Perhatian'}
                                        </span>
                                    </div>
                                </div>
                                <canvas id="turnoverChart"></canvas>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0">Dead Stock Analysis</h5>
                            </div>
                            <div class="card-body">
                                <div class="alert alert-danger">
                                    <i class="fas fa-exclamation-triangle"></i>
                                    <strong>${deadStock.length} Dead Stock Items</strong>
                                    <p class="mb-0 small">Total nilai: Rp ${this.formatNumber(deadStock.reduce((sum, p) => sum + (p.stock * p.buyPrice), 0))}</p>
                                </div>
                                <div class="table-responsive" style="max-height: 300px;">
                                    <table class="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Produk</th>
                                                <th>Stok</th>
                                                <th>Nilai</th>
                                                <th>Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${deadStock.slice(0, 5).map(product => `
                                                <tr>
                                                    <td>
                                                        <div class="fw-bold">${product.name}</div>
                                                        <small class="text-muted">${product.sku}</small>
                                                    </td>
                                                    <td>${product.stock}</td>
                                                    <td>Rp ${this.formatNumber(product.stock * product.buyPrice)}</td>
                                                    <td>
                                                        <button class="btn btn-sm btn-outline-danger" onclick="stockFlowApp.disposeDeadStock(${product.id})">
                                                            <i class="fas fa-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                                ${deadStock.length > 5 ? `
                                    <div class="text-center mt-2">
                                        <button class="btn btn-sm btn-outline-danger" onclick="stockFlowApp.showAllDeadStock()">
                                            Lihat ${deadStock.length - 5} lainnya
                                        </button>
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Stock Movement Analysis -->
                <div class="card">
                    <div class="card-header">
                        <h5 class="mb-0">Analisis Pergerakan Stok</h5>
                    </div>
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-6">
                                <h6>Top 5 Fast Moving</h6>
                                <div class="list-group">
                                    ${StockFlowData.getTopProducts(5).map(product => `
                                        <div class="list-group-item">
                                            <div class="d-flex justify-content-between">
                                                <div>
                                                    <strong>${product.product.name}</strong>
                                                    <br>
                                                    <small>${product.product.sku}</small>
                                                </div>
                                                <div class="text-end">
                                                    <span class="badge bg-success">${product.quantity} terjual</span>
                                                    <br>
                                                    <small>Rp ${this.formatNumber(product.revenue)}</small>
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            <div class="col-md-6">
                                <h6>Top 5 Slow Moving</h6>
                                <div class="list-group">
                                    ${StockFlowData.getProducts().slice().sort((a, b) => {
                                        const aTransactions = StockFlowData.getProductTransactions(a.id).filter(t => t.type === 'out').length;
                                        const bTransactions = StockFlowData.getProductTransactions(b.id).filter(t => t.type === 'out').length;
                                        return aTransactions - bTransactions;
                                    }).slice(0, 5).map(product => {
                                        const outTransactions = StockFlowData.getProductTransactions(product.id).filter(t => t.type === 'out');
                                        const totalSold = outTransactions.reduce((sum, t) => sum + t.quantity, 0);
                                        
                                        return `
                                            <div class="list-group-item">
                                                <div class="d-flex justify-content-between">
                                                    <div>
                                                        <strong>${product.name}</strong>
                                                        <br>
                                                        <small>${product.sku}</small>
                                                    </div>
                                                    <div class="text-end">
                                                        <span class="badge bg-warning">${totalSold} terjual</span>
                                                        <br>
                                                        <small>${product.stock} in stock</small>
                                                    </div>
                                                </div>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // ==================== TRANSACTIONS ====================
    async loadTransactions() {
        const transactions = StockFlowData.getTransactions();
        
        return `
            <div id="transactionsContent">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h3 class="mb-0">Transaksi Stok</h3>
                    <div>
                        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addTransactionModal">
                            <i class="fas fa-plus"></i> Transaksi Baru
                        </button>
                        <button class="btn btn-outline-secondary ms-2" onclick="stockFlowApp.exportTransactions()">
                            <i class="fas fa-download"></i> Export
                        </button>
                    </div>
                </div>
                
                <!-- Transaction Filters -->
                <div class="card mb-4">
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-3">
                                <label class="form-label">Jenis Transaksi</label>
                                <select class="form-select" id="filterTransactionType">
                                    <option value="">Semua Jenis</option>
                                    <option value="in">Stok Masuk</option>
                                    <option value="out">Stok Keluar</option>
                                    <option value="adjust">Adjustment</option>
                                    <option value="return">Retur</option>
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Tanggal Dari</label>
                                <input type="date" class="form-control" id="filterDateFrom">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Tanggal Sampai</label>
                                <input type="date" class="form-control" id="filterDateTo">
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">Gudang</label>
                                <select class="form-select" id="filterTransactionWarehouse">
                                    <option value="">Semua Gudang</option>
                                    ${StockFlowData.warehouses.map(w => 
                                        `<option value="${w.id}">${w.name}</option>`
                                    ).join('')}
                                </select>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-md-12">
                                <div class="input-group">
                                    <input type="text" class="form-control" id="filterTransactionSearch" placeholder="Cari produk, referensi, atau keterangan...">
                                    <button class="btn btn-primary" onclick="stockFlowApp.filterTransactions()">
                                        <i class="fas fa-search"></i> Filter
                                    </button>
                                    <button class="btn btn-outline-secondary" onclick="stockFlowApp.resetTransactionFilters()">
                                        <i class="fas fa-redo"></i> Reset
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Transactions Summary -->
                <div class="row mb-4">
                    <div class="col-md-3">
                        <div class="card border-primary">
                            <div class="card-body text-center">
                                <h3 class="mb-0">${transactions.filter(t => t.type === 'in').length}</h3>
                                <small class="text-muted">Stok Masuk</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card border-success">
                            <div class="card-body text-center">
                                <h3 class="mb-0">${transactions.filter(t => t.type === 'out').length}</h3>
                                <small class="text-muted">Stok Keluar</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card border-warning">
                            <div class="card-body text-center">
                                <h3 class="mb-0">${transactions.filter(t => t.type === 'adjust').length}</h3>
                                <small class="text-muted">Adjustment</small>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="card border-info">
                            <div class="card-body text-center">
                                <h3 class="mb-0">${transactions.filter(t => t.type === 'return').length}</h3>
                                <small class="text-muted">Retur</small>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Transactions Table -->
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">Daftar Transaksi</h5>
                        <div class="d-flex align-items-center">
                            <div class="me-2">
                                <small class="text-muted">Menampilkan ${transactions.length} transaksi</small>
                            </div>
                            <button class="btn btn-sm btn-outline-secondary" onclick="stockFlowApp.navigateTo('transactions')">
                                <i class="fas fa-sync-alt"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th width="50">ID</th>
                                        <th>Tanggal</th>
                                        <th>Jenis</th>
                                        <th>Produk</th>
                                        <th>Qty</th>
                                        <th>Gudang</th>
                                        <th>Referensi</th>
                                        <th>Keterangan</th>
                                        <th>User</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody id="transactionsTableBody">
                                    ${transactions.map(transaction => this.renderTransactionRow(transaction)).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="card-footer">
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="text-muted">
                                Total transaksi: ${transactions.length}
                            </div>
                            <nav>
                                <ul class="pagination pagination-sm mb-0">
                                    <li class="page-item disabled"><a class="page-link" href="#">Previous</a></li>
                                    <li class="page-item active"><a class="page-link" href="#">1</a></li>
                                    <li class="page-item"><a class="page-link" href="#">2</a></li>
                                    <li class="page-item"><a class="page-link" href="#">3</a></li>
                                    <li class="page-item"><a class="page-link" href="#">Next</a></li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderTransactionRow(transaction) {
        const product = StockFlowData.getProductById(transaction.productId);
        const warehouse = StockFlowData.warehouses.find(w => w.id == transaction.warehouseId);
        const user = StockFlowData.users.find(u => u.id == transaction.userId);
        
        const typeLabels = {
            'in': { label: 'Stok Masuk', class: 'success', icon: 'arrow-down' },
            'out': { label: 'Stok Keluar', class: 'danger', icon: 'arrow-up' },
            'adjust': { label: 'Adjustment', class: 'warning', icon: 'exchange-alt' },
            'return': { label: 'Retur', class: 'info', icon: 'undo' }
        };
        const type = typeLabels[transaction.type];
        
        return `
            <tr class="transaction-${transaction.type}">
                <td>${transaction.id}</td>
                <td>
                    <small>${new Date(transaction.date).toLocaleDateString('id-ID')}</small><br>
                    <small class="text-muted">${new Date(transaction.date).toLocaleTimeString('id-ID')}</small>
                </td>
                <td>
                    <span class="badge bg-${type.class}">
                        <i class="fas fa-${type.icon}"></i> ${type.label}
                    </span>
                </td>
                <td>
                    <div>${product?.name || 'Produk tidak ditemukan'}</div>
                    <small class="text-muted">${product?.sku || ''}</small>
                </td>
                <td>
                    <span class="fw-bold ${transaction.type === 'in' ? 'text-success' : 'text-danger'}">
                        ${transaction.type === 'in' ? '+' : '-'}${transaction.quantity}
                    </span>
                </td>
                <td>${warehouse?.name || '-'}</td>
                <td><small>${transaction.reference || '-'}</small></td>
                <td><small>${transaction.notes || '-'}</small></td>
                <td><small>${user?.name || 'System'}</small></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="stockFlowApp.viewTransactionDetails(${transaction.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `;
    }
    
    // ==================== REPORTS ====================
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
                                                <button class="btn btn-primary w-100" onclick="stockFlowApp.generateStockReport()">
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
                                                <button class="btn btn-success w-100" onclick="stockFlowApp.generateAnalysisReport()">
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
                                                <button class="btn btn-warning w-100" onclick="stockFlowApp.generateTransactionReport()">
                                                    Generate
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Report Options -->
                                <div class="mt-4">
                                    <div class="card">
                                        <div class="card-body">
                                            <h6>Opsi Laporan</h6>
                                            <div class="row">
                                                <div class="col-md-4">
                                                    <label class="form-label">Periode</label>
                                                    <select class="form-select" id="reportPeriod">
                                                        <option value="today">Hari Ini</option>
                                                        <option value="week">Minggu Ini</option>
                                                        <option value="month" selected>Bulan Ini</option>
                                                        <option value="quarter">Kuartal Ini</option>
                                                        <option value="year">Tahun Ini</option>
                                                        <option value="custom">Custom</option>
                                                    </select>
                                                </div>
                                                <div class="col-md-4">
                                                    <label class="form-label">Format</label>
                                                    <select class="form-select" id="reportFormat">
                                                        <option value="pdf">PDF</option>
                                                        <option value="excel">Excel</option>
                                                        <option value="csv">CSV</option>
                                                        <option value="print">Print</option>
                                                    </select>
                                                </div>
                                                <div class="col-md-4">
                                                    <label class="form-label">Gudang</label>
                                                    <select class="form-select" id="reportWarehouse">
                                                        <option value="">Semua Gudang</option>
                                                        ${StockFlowData.warehouses.map(w => 
                                                            `<option value="${w.id}">${w.name}</option>`
                                                        ).join('')}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Recent Reports -->
                                <div class="mt-4">
                                    <h6>Laporan Terakhir</h6>
                                    <div class="table-responsive">
                                        <table class="table table-sm">
                                            <thead>
                                                <tr>
                                                    <th>Nama Laporan</th>
                                                    <th>Tanggal</th>
                                                    <th>Jenis</th>
                                                    <th>Ukuran</th>
                                                    <th>Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Laporan Stok Bulanan Januari 2024</td>
                                                    <td>31 Jan 2024</td>
                                                    <td><span class="badge bg-primary">Stok</span></td>
                                                    <td>1.2 MB</td>
                                                    <td>
                                                        <button class="btn btn-sm btn-outline-primary">
                                                            <i class="fas fa-download"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Analisis ABC Q1 2024</td>
                                                    <td>31 Mar 2024</td>
                                                    <td><span class="badge bg-success">Analisis</span></td>
                                                    <td>850 KB</td>
                                                    <td>
                                                        <button class="btn btn-sm btn-outline-primary">
                                                            <i class="fas fa-download"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // ==================== SETTINGS ====================
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
                                    <button type="button" class="btn btn-primary" onclick="stockFlowApp.saveSettings()">Simpan Pengaturan</button>
                                </form>
                            </div>
                        </div>
                        
                        <div class="card mb-4">
                            <div class="card-header">
                                <h5 class="mb-0">Kategori Produk</h5>
                            </div>
                            <div class="card-body">
                                <div id="categoriesList">
                                    ${StockFlowData.categories.map(category => `
                                        <div class="d-flex justify-content-between align-items-center mb-2">
                                            <div>
                                                <strong>${category.name}</strong>
                                                <small class="text-muted d-block">${category.subcategories.join(', ')}</small>
                                            </div>
                                            <div>
                                                <button class="btn btn-sm btn-outline-primary" onclick="stockFlowApp.editCategory('${category.name}')">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                                <button class="btn btn-sm btn-primary mt-2" onclick="stockFlowApp.addCategory()">
                                    <i class="fas fa-plus"></i> Tambah Kategori
                                </button>
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
                                    <button class="btn btn-outline-primary w-100 mb-2" onclick="stockFlowApp.backupData()">
                                        <i class="fas fa-download"></i> Backup Data
                                    </button>
                                    <button class="btn btn-outline-warning w-100 mb-2" onclick="stockFlowApp.restoreData()">
                                        <i class="fas fa-upload"></i> Restore Data
                                    </button>
                                    <button class="btn btn-outline-danger w-100" onclick="stockFlowApp.resetData()">
                                        <i class="fas fa-trash"></i> Reset Data ke Default
                                    </button>
                                </div>
                                <div class="alert alert-info">
                                    <small>
                                        <i class="fas fa-info-circle"></i>
                                        <strong>Info:</strong> Backup data secara reguler untuk mencegah kehilangan data.
                                    </small>
                                </div>
                                
                                <div class="mt-4">
                                    <h6>Info Sistem</h6>
                                    <table class="table table-sm">
                                        <tr>
                                            <td>Versi Aplikasi</td>
                                            <td><strong>v1.0.0</strong></td>
                                        </tr>
                                        <tr>
                                            <td>Total Produk</td>
                                            <td>${StockFlowData.products.length}</td>
                                        </tr>
                                        <tr>
                                            <td>Total Transaksi</td>
                                            <td>${StockFlowData.transactions.length}</td>
                                        </tr>
                                        <tr>
                                            <td>Storage Used</td>
                                            <td>${Math.round(JSON.stringify(localStorage).length / 1024)} KB</td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                        
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0">User Management</h5>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Nama</th>
                                                <th>Role</th>
                                                <th>Email</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${StockFlowData.users.map(user => `
                                                <tr>
                                                    <td>${user.name}</td>
                                                    <td><span class="badge bg-primary">${user.role}</span></td>
                                                    <td>${user.email}</td>
                                                    <td><span class="badge bg-success">Active</span></td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                                <button class="btn btn-sm btn-primary mt-2" onclick="stockFlowApp.addUser()">
                                    <i class="fas fa-plus"></i> Tambah User
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // ==================== HELPER METHODS ====================
    
    initPage(page) {
        switch(page) {
            case 'dashboard':
                this.initDashboard();
                break;
            case 'products':
                this.initProducts();
                break;
            case 'inventory':
                this.initInventory();
                break;
            case 'analysis':
                this.initAnalysis();
                break;
            case 'transactions':
                this.initTransactions();
                break;
            case 'reports':
                this.initReports();
                break;
            case 'settings':
                this.initSettings();
                break;
        }
    }
    
    initDashboard() {
        this.initCharts();
        
        // Event listeners for period buttons
        document.querySelectorAll('[data-period]')?.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const period = e.target.getAttribute('data-period');
                this.updateStockMovementChart(parseInt(period));
                
                document.querySelectorAll('[data-period]').forEach(b => {
                    b.classList.remove('active');
                });
                e.target.classList.add('active');
            });
        });
    }
    
    initProducts() {
        // Add event listeners for filters
        document.getElementById('filterCategory')?.addEventListener('change', () => this.filterProducts());
        document.getElementById('filterStatus')?.addEventListener('change', () => this.filterProducts());
        document.getElementById('filterABC')?.addEventListener('change', () => this.filterProducts());
        document.getElementById('filterSupplier')?.addEventListener('change', () => this.filterProducts());
        document.getElementById('productSearch')?.addEventListener('input', () => this.filterProducts());
        document.getElementById('selectAll')?.addEventListener('change', (e) => {
            const checkboxes = document.querySelectorAll('.product-checkbox');
            checkboxes.forEach(checkbox => {
                checkbox.checked = e.target.checked;
            });
        });
    }
    
    initInventory() {
        // Inventory specific initializations
        document.getElementById('criticalStockThreshold')?.addEventListener('input', (e) => {
            document.getElementById('thresholdValue').textContent = e.target.value + '%';
        });
    }
    
    initAnalysis() {
        // Initialize analysis charts
        this.initAnalysisCharts();
    }
    
    initTransactions() {
        // Initialize transaction filters
        document.getElementById('filterTransactionType')?.addEventListener('change', () => this.filterTransactions());
        document.getElementById('filterDateFrom')?.addEventListener('change', () => this.filterTransactions());
        document.getElementById('filterDateTo')?.addEventListener('change', () => this.filterTransactions());
        document.getElementById('filterTransactionWarehouse')?.addEventListener('change', () => this.filterTransactions());
        document.getElementById('filterTransactionSearch')?.addEventListener('input', () => this.filterTransactions());
    }
    
    initReports() {
        // Report specific initializations
        // Can be expanded as needed
    }
    
    initSettings() {
        // Settings specific initializations
        document.getElementById('criticalStockThreshold')?.addEventListener('input', (e) => {
            document.getElementById('thresholdValue').textContent = e.target.value + '%';
        });
    }
    
    // ==================== CHART METHODS ====================
    
    initCharts() {
        // Stock Movement Chart
        const ctx = document.getElementById('stockMovementChart');
        if (ctx) {
            this.charts.stockMovement = new Chart(ctx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: Array.from({length: 30}, (_, i) => `${i+1} Jan`),
                    datasets: [{
                        label: 'Stok Masuk',
                        data: Array.from({length: 30}, () => Math.floor(Math.random() * 100) + 20),
                        borderColor: '#28a745',
                        backgroundColor: 'rgba(40, 167, 69, 0.1)',
                        tension: 0.4
                    }, {
                        label: 'Stok Keluar',
                        data: Array.from({length: 30}, () => Math.floor(Math.random() * 80) + 10),
                        borderColor: '#dc3545',
                        backgroundColor: 'rgba(220, 53, 69, 0.1)',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        title: {
                            display: false
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Jumlah'
                            }
                        }
                    }
                }
            });
        }
    }
    
    initAnalysisCharts() {
        // ABC Chart
        const abcCtx = document.getElementById('abcChart');
        if (abcCtx) {
            const abcAnalysis = StockFlowData.getABCAnalysis();
            this.charts.abcChart = new Chart(abcCtx.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['Kelas A', 'Kelas B', 'Kelas C'],
                    datasets: [{
                        data: [abcAnalysis.A.percentage, abcAnalysis.B.percentage, abcAnalysis.C.percentage],
                        backgroundColor: [
                            '#28a745',
                            '#ffc107',
                            '#6c757d'
                        ]
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        }
                    }
                }
            });
        }
        
        // Turnover Chart
        const turnoverCtx = document.getElementById('turnoverChart');
        if (turnoverCtx) {
            this.charts.turnoverChart = new Chart(turnoverCtx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
                    datasets: [{
                        label: 'Turnover Ratio',
                        data: [4.2, 3.8, 4.5, 3.9, 4.1, 4.3],
                        backgroundColor: '#007bff'
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Ratio'
                            }
                        }
                    }
                }
            });
        }
    }
    
    updateStockMovementChart(period) {
        if (this.charts.stockMovement) {
            // Update chart data based on period
            const labels = Array.from({length: period}, (_, i) => `Day ${i+1}`);
            const inData = Array.from({length: period}, () => Math.floor(Math.random() * 100) + 20);
            const outData = Array.from({length: period}, () => Math.floor(Math.random() * 80) + 10);
            
            this.charts.stockMovement.data.labels = labels;
            this.charts.stockMovement.data.datasets[0].data = inData;
            this.charts.stockMovement.data.datasets[1].data = outData;
            this.charts.stockMovement.update();
        }
    }
    
    // ==================== DATA METHODS ====================
    
    filterProducts() {
        const category = document.getElementById('filterCategory')?.value || '';
        const status = document.getElementById('filterStatus')?.value || '';
        const abcClass = document.getElementById('filterABC')?.value || '';
        const supplier = document.getElementById('filterSupplier')?.value || '';
        const search = document.getElementById('productSearch')?.value.toLowerCase() || '';
        
        let filtered = StockFlowData.getProducts();
        
        // Apply filters
        if (category) {
            filtered = filtered.filter(p => p.category.includes(category));
        }
        
        if (status) {
            filtered = filtered.filter(p => {
                if (status === 'critical') return p.stock <= p.minStock * 0.3;
                if (status === 'low') return p.stock <= p.minStock && p.stock > p.minStock * 0.3;
                if (status === 'normal') return p.stock > p.minStock && p.stock < p.maxStock * 0.9;
                if (status === 'overstock') return p.stock >= p.maxStock * 0.9;
                return true;
            });
        }
        
        if (abcClass) {
            filtered = filtered.filter(p => p.abcClass === abcClass);
        }
        
        if (supplier) {
            filtered = filtered.filter(p => p.supplierId == supplier);
        }
        
        if (search) {
            filtered = filtered.filter(p => 
                p.name.toLowerCase().includes(search) ||
                p.sku.toLowerCase().includes(search) ||
                p.category.toLowerCase().includes(search)
            );
        }
        
        this.filteredProducts = filtered;
        
        // Update table
        const tbody = document.getElementById('productsTableBody');
        if (tbody) {
            tbody.innerHTML = filtered.map(product => this.renderProductRow(product)).join('');
        }
        
        // Update count
        const countElement = document.getElementById('productsCount');
        if (countElement) {
            countElement.textContent = `Menampilkan ${filtered.length} dari ${StockFlowData.products.length} produk`;
        }
    }
    
    filterTransactions() {
        const type = document.getElementById('filterTransactionType')?.value || '';
        const dateFrom = document.getElementById('filterDateFrom')?.value;
        const dateTo = document.getElementById('filterDateTo')?.value;
        const warehouse = document.getElementById('filterTransactionWarehouse')?.value || '';
        const search = document.getElementById('filterTransactionSearch')?.value.toLowerCase() || '';
        
        let filtered = StockFlowData.getTransactions();
        
        // Apply filters
        if (type) {
            filtered = filtered.filter(t => t.type === type);
        }
        
        if (dateFrom) {
            const fromDate = new Date(dateFrom);
            filtered = filtered.filter(t => new Date(t.date) >= fromDate);
        }
        
        if (dateTo) {
            const toDate = new Date(dateTo);
            filtered = filtered.filter(t => new Date(t.date) <= toDate);
        }
        
        if (warehouse) {
            filtered = filtered.filter(t => t.warehouseId == warehouse);
        }
        
        if (search) {
            filtered = filtered.filter(t => {
                const product = StockFlowData.getProductById(t.productId);
                return (
                    (product?.name.toLowerCase().includes(search)) ||
                    (product?.sku.toLowerCase().includes(search)) ||
                    (t.reference?.toLowerCase().includes(search)) ||
                    (t.notes?.toLowerCase().includes(search))
                );
            });
        }
        
        this.filteredTransactions = filtered;
        
        // Update table
        const tbody = document.getElementById('transactionsTableBody');
        if (tbody) {
            tbody.innerHTML = filtered.map(transaction => this.renderTransactionRow(transaction)).join('');
        }
    }
    
    resetTransactionFilters() {
        document.getElementById('filterTransactionType').value = '';
        document.getElementById('filterDateFrom').value = '';
        document.getElementById('filterDateTo').value = '';
        document.getElementById('filterTransactionWarehouse').value = '';
        document.getElementById('filterTransactionSearch').value = '';
        this.filterTransactions();
    }
    
    // ==================== ACTION METHODS ====================
    
    saveProduct() {
        const form = document.getElementById('addProductForm');
        if (!form) return;
        
        const formData = new FormData(form);
        const productData = {
            name: formData.get('name'),
            sku: formData.get('sku'),
            category: formData.get('category'),
            description: formData.get('description'),
            stock: parseInt(formData.get('stock')) || 0,
            minStock: parseInt(formData.get('minStock')) || 10,
            maxStock: parseInt(formData.get('maxStock')) || 100,
            buyPrice: parseInt(formData.get('buyPrice')) || 0,
            sellPrice: parseInt(formData.get('sellPrice')) || 0,
            supplierId: formData.get('supplierId') ? parseInt(formData.get('supplierId')) : null,
            warehouseId: formData.get('warehouseId') ? parseInt(formData.get('warehouseId')) : null,
            unit: formData.get('unit') || 'Pcs',
            abcClass: 'C'
        };
        
        // Validate
        if (!productData.name || !productData.sku || !productData.buyPrice || !productData.sellPrice) {
            this.showAlert('Harap isi semua bidang yang diperlukan', 'danger');
            return;
        }
        
        // Add product
        const newProduct = StockFlowData.addProduct(productData);
        
        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide();
        this.showAlert('Produk berhasil ditambahkan!', 'success');
        
        // Refresh products page
        this.navigateTo('products');
    }
    
    updateProduct() {
        const form = document.getElementById('editProductForm');
        if (!form) return;
        
        const formData = new FormData(form);
        const updates = {
            name: formData.get('name'),
            sku: formData.get('sku'),
            minStock: parseInt(formData.get('minStock')) || 0,
            maxStock: parseInt(formData.get('maxStock')) || 0,
            buyPrice: parseInt(formData.get('buyPrice')) || 0,
            sellPrice: parseInt(formData.get('sellPrice')) || 0,
            description: formData.get('description')
        };
        
        const productId = formData.get('id');
        
        if (StockFlowData.updateProduct(productId, updates)) {
            bootstrap.Modal.getInstance(document.getElementById('editProductModal')).hide();
            this.showAlert('Produk berhasil diperbarui!', 'success');
            this.navigateTo('products');
        }
    }
    
    saveTransaction() {
        const form = document.getElementById('addTransactionForm');
        if (!form) return;
        
        const formData = new FormData(form);
        const transactionData = {
            type: formData.get('type'),
            productId: parseInt(formData.get('productId')),
            quantity: parseInt(formData.get('quantity')),
            warehouseId: parseInt(formData.get('warehouseId')),
            reference: formData.get('reference'),
            notes: formData.get('notes'),
            userId: 1
        };
        
        // Validate
        if (!transactionData.type || !transactionData.productId || !transactionData.quantity || !transactionData.warehouseId) {
            this.showAlert('Harap isi semua bidang yang diperlukan', 'danger');
            return;
        }
        
        // Check stock for outgoing transactions
        if (transactionData.type === 'out') {
            const product = StockFlowData.getProductById(transactionData.productId);
            if (product && product.stock < transactionData.quantity) {
                this.showAlert(`Stok tidak mencukupi! Stok tersedia: ${product.stock} unit`, 'danger');
                return;
            }
        }
        
        // Add transaction
        StockFlowData.addTransaction(transactionData);
        
        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('addTransactionModal')).hide();
        this.showAlert('Transaksi berhasil dicatat!', 'success');
        
        // Refresh current page
        this.navigateTo(this.currentPage);
    }
    
    editProduct(productId) {
        const product = StockFlowData.getProductById(productId);
        if (!product) return;
        
        // Populate edit form
        const form = document.getElementById('editProductForm');
        if (form) {
            form.querySelector('[name="id"]').value = product.id;
            form.querySelector('[name="name"]').value = product.name;
            form.querySelector('[name="sku"]').value = product.sku;
            form.querySelector('[name="stock"]').value = product.stock;
            form.querySelector('[name="minStock"]').value = product.minStock;
            form.querySelector('[name="maxStock"]').value = product.maxStock;
            form.querySelector('[name="buyPrice"]').value = product.buyPrice;
            form.querySelector('[name="sellPrice"]').value = product.sellPrice;
            form.querySelector('[name="description"]').value = product.description || '';
        }
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('editProductModal'));
        modal.show();
    }
    
    quickTransaction(productId, type) {
        const product = StockFlowData.getProductById(productId);
        if (!product) return;
        
        const quantity = prompt(`Masukkan jumlah untuk ${type === 'in' ? 'stok masuk' : 'stok keluar'}:`, '1');
        if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) return;
        
        const transactionData = {
            type: type,
            productId: productId,
            quantity: parseInt(quantity),
            warehouseId: product.warehouseId || 1,
            reference: `QUICK-${type.toUpperCase()}`,
            notes: 'Transaksi cepat dari halaman produk',
            userId: 1
        };
        
        // Validate for outgoing transactions
        if (type === 'out' && product.stock < transactionData.quantity) {
            this.showAlert(`Stok tidak mencukupi! Stok tersedia: ${product.stock} unit`, 'danger');
            return;
        }
        
        StockFlowData.addTransaction(transactionData);
        this.showAlert(`Transaksi ${type === 'in' ? 'masuk' : 'keluar'} berhasil!`, 'success');
        this.navigateTo(this.currentPage);
    }
    
    deleteSelectedProducts() {
        const checkboxes = document.querySelectorAll('.product-checkbox:checked');
        if (checkboxes.length === 0) {
            this.showAlert('Pilih produk yang akan dihapus terlebih dahulu', 'warning');
            return;
        }
        
        if (!confirm(`Anda yakin ingin menghapus ${checkboxes.length} produk?`)) return;
        
        checkboxes.forEach(checkbox => {
            StockFlowData.deleteProduct(checkbox.value);
        });
        
        this.showAlert(`${checkboxes.length} produk berhasil dihapus`, 'success');
        this.navigateTo('products');
    }
    
    adjustStockBatch() {
        const checkboxes = document.querySelectorAll('.product-checkbox:checked');
        if (checkboxes.length === 0) {
            this.showAlert('Pilih produk yang akan disesuaikan terlebih dahulu', 'warning');
            return;
        }
        
        const adjustment = prompt('Masukkan jumlah adjustment (+ untuk tambah, - untuk kurang):', '0');
        if (!adjustment || isNaN(adjustment)) return;
        
        const quantity = parseInt(adjustment);
        
        checkboxes.forEach(checkbox => {
            const productId = checkbox.value;
            const transactionData = {
                type: 'adjust',
                productId: productId,
                quantity: quantity,
                warehouseId: 1,
                reference: 'BATCH-ADJ',
                notes: 'Penyesuaian batch dari halaman produk',
                userId: 1
            };
            
            StockFlowData.addTransaction(transactionData);
        });
        
        this.showAlert(`${checkboxes.length} produk berhasil disesuaikan`, 'success');
        this.navigateTo('products');
    }
    
    exportToExcel() {
        const products = StockFlowData.getProducts();
        const headers = ['SKU', 'Nama', 'Kategori', 'Stok', 'Min', 'Max', 'Harga Beli', 'Harga Jual', 'Status'];
        
        let csv = headers.join(',') + '\n';
        
        products.forEach(product => {
            let status = this.getStockStatusLabel(product);
            
            const row = [
                product.sku,
                `"${product.name}"`,
                `"${product.category}"`,
                product.stock,
                product.minStock,
                product.maxStock,
                product.buyPrice,
                product.sellPrice,
                status
            ];
            
            csv += row.join(',') + '\n';
        });
        
        this.downloadCSV(csv, `produks_${new Date().toISOString().split('T')[0]}.csv`);
        this.showAlert('Data berhasil diekspor ke CSV', 'success');
    }
    
    // ==================== UTILITY METHODS ====================
    
    showAlert(message, type = 'info') {
        // Remove existing alerts
        const existingAlerts = document.querySelectorAll('.alert-notification');
        existingAlerts.forEach(alert => alert.remove());
        
        // Create new alert
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-notification alert-dismissible fade show`;
        alertDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 1050; max-width: 400px;';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
    
    formatNumber(num) {
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1) + 'M';
        }
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'jt';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num.toLocaleString('id-ID');
    }
    
    formatTimeAgo(date) {
        const now = new Date();
        const diffMs = now - new Date(date);
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
        
        if (diffMins < 1) return 'Baru saja';
        if (diffMins < 60) return `${diffMins} menit yang lalu`;
        if (diffHours < 24) return `${diffHours} jam yang lalu`;
        if (diffDays < 7) return `${diffDays} hari yang lalu`;
        return new Date(date).toLocaleDateString('id-ID');
    }
    
    getStockStatusLabel(product) {
        if (product.stock <= product.minStock * 0.3) return 'Kritis';
        if (product.stock <= product.minStock) return 'Hampir Habis';
        if (product.stock >= product.maxStock * 0.9) return 'Overstock';
        return 'Normal';
    }
    
    downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    navigateTo(page) {
        this.currentPage = page;
        
        // Update active nav link
        document.querySelectorAll('.sidebar .nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-page') === page) {
                link.classList.add('active');
            }
        });
        
        // Load page content
        this.loadPage(page);
    }
    
    toggleSidebar() {
        this.isSidebarCollapsed = !this.isSidebarCollapsed;
        document.body.classList.toggle('collapsed-sidebar', this.isSidebarCollapsed);
        
        const logoText = document.getElementById('logoText');
        const toggleIcon = document.querySelector('#sidebarToggle i');
        
        if (this.isSidebarCollapsed) {
            logoText.textContent = 'SF';
            toggleIcon.className = 'fas fa-bars';
        } else {
            logoText.textContent = 'StockFlow';
            toggleIcon.className = 'fas fa-times';
        }
    }
    
    updateNotifications() {
        const stockStatus = StockFlowData.getStockStatus();
        const totalAlerts = stockStatus.critical + stockStatus.low;
        
        // Update notification count
        const notificationCount = document.getElementById('notificationCount');
        if (notificationCount) {
            notificationCount.textContent = totalAlerts;
            notificationCount.style.display = totalAlerts > 0 ? 'inline' : 'none';
        }
        
        // Update notification list
        const notificationList = document.getElementById('notificationList');
        if (notificationList) {
            let notificationsHTML = '';
            
            if (stockStatus.critical > 0) {
                notificationsHTML += `
                    <a class="dropdown-item" href="#" onclick="stockFlowApp.navigateTo('products')">
                        <div class="text-danger">
                            <strong>Stok Kritis:</strong> ${stockStatus.critical} produk perlu perhatian segera
                        </div>
                        <small>Baru saja</small>
                    </a>
                `;
            }
            
            if (stockStatus.low > 0) {
                notificationsHTML += `
                    <a class="dropdown-item" href="#" onclick="stockFlowApp.navigateTo('products')">
                        <div class="text-warning">
                            <strong>Peringatan:</strong> ${stockStatus.low} produk hampir habis
                        </div>
                        <small>1 jam yang lalu</small>
                    </a>
                `;
            }
            
            if (notificationsHTML === '') {
                notificationsHTML = '<a class="dropdown-item"><small>Tidak ada notifikasi baru</small></a>';
            }
            
            notificationList.innerHTML = notificationsHTML;
        }
    }
    
    clearNotifications() {
        // In a real app, you would mark notifications as read
        const notificationCount = document.getElementById('notificationCount');
        if (notificationCount) {
            notificationCount.textContent = '0';
            notificationCount.style.display = 'none';
        }
        
        const notificationList = document.getElementById('notificationList');
        if (notificationList) {
            notificationList.innerHTML = '<a class="dropdown-item"><small>Tidak ada notifikasi baru</small></a>';
        }
    }
    
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + B to toggle sidebar
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault();
            this.toggleSidebar();
        }
        
        // Ctrl/Cmd + 1-7 for navigation
        if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '7') {
            e.preventDefault();
            const pages = ['dashboard', 'products', 'inventory', 'analysis', 'transactions', 'reports', 'settings'];
            const pageIndex = parseInt(e.key) - 1;
            if (pages[pageIndex]) {
                this.navigateTo(pages[pageIndex]);
            }
        }
    }
    
    handleGlobalSearch(query) {
        if (query.length < 2) return;
        
        // Search across products, transactions, etc.
        console.log('Global search:', query);
        // Implement search functionality as needed
    }
    
    logout() {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            this.showAlert('Anda telah keluar dari sistem', 'info');
            setTimeout(() => {
                window.location.reload(); // Reload to simulate logout
            }, 1500);
        }
    }
}

// ==================== STOCKFLOW DATA CLASS ====================

class StockFlowData {
    static products = [];
    static transactions = [];
    static warehouses = [];
    static suppliers = [];
    static categories = [];
    static users = [];

    static initSampleData() {
        // Sample warehouses
        this.warehouses = [
            { id: 1, name: 'Gudang Utama', location: 'Jakarta', capacity: 10000 },
            { id: 2, name: 'Gudang Cabang', location: 'Bandung', capacity: 5000 },
            { id: 3, name: 'Gudang Ekspor', location: 'Surabaya', capacity: 8000 }
        ];

        // Sample suppliers
        this.suppliers = [
            { id: 1, name: 'PT Supplier Utama', contact: '081234567890', email: 'supplier@example.com' },
            { id: 2, name: 'CV Barokah Jaya', contact: '082345678901', email: 'barokah@example.com' },
            { id: 3, name: 'UD Makmur Sentosa', contact: '083456789012', email: 'makmur@example.com' }
        ];

        // Sample categories
        this.categories = [
            { name: 'Elektronik', subcategories: ['Gadget', 'Komputer', 'Aksesoris'] },
            { name: 'Fashion', subcategories: ['Pria', 'Wanita', 'Anak'] },
            { name: 'Kesehatan', subcategories: ['Suplemen', 'Alat Kesehatan', 'Obat-obatan'] },
            { name: 'Makanan', subcategories: ['Snack', 'Minuman', 'Bahan Pokok'] }
        ];

        // Sample products
        this.products = [
            {
                id: 1,
                sku: 'ELEC-001',
                name: 'Smartphone XYZ',
                category: 'Elektronik > Gadget',
                description: 'Smartphone flagship dengan kamera 108MP',
                stock: 15,
                minStock: 10,
                maxStock: 100,
                buyPrice: 5000000,
                sellPrice: 6500000,
                supplierId: 1,
                warehouseId: 1,
                unit: 'Pcs',
                abcClass: 'A',
                lastUpdated: new Date('2024-01-10')
            },
            {
                id: 2,
                sku: 'FASH-001',
                name: 'Kaos Polo Pria',
                category: 'Fashion > Pria > Atasan',
                description: 'Kaos polo bahan katun premium',
                stock: 8,
                minStock: 20,
                maxStock: 200,
                buyPrice: 120000,
                sellPrice: 180000,
                supplierId: 2,
                warehouseId: 1,
                unit: 'Pcs',
                abcClass: 'B',
                lastUpdated: new Date('2024-01-12')
            },
            {
                id: 3,
                sku: 'HEAL-001',
                name: 'Vitamin C 1000mg',
                category: 'Kesehatan > Suplemen',
                description: 'Suplemen vitamin C dosis tinggi',
                stock: 50,
                minStock: 30,
                maxStock: 300,
                buyPrice: 50000,
                sellPrice: 75000,
                supplierId: 3,
                warehouseId: 2,
                unit: 'Botol',
                abcClass: 'C',
                lastUpdated: new Date('2024-01-05')
            }
        ];

        // Sample transactions
        this.transactions = [
            {
                id: 1,
                type: 'in',
                productId: 1,
                quantity: 20,
                warehouseId: 1,
                reference: 'PO-001',
                notes: 'Pembelian dari supplier utama',
                userId: 1,
                date: new Date('2024-01-10T09:00:00')
            },
            {
                id: 2,
                type: 'out',
                productId: 1,
                quantity: 5,
                warehouseId: 1,
                reference: 'INV-001',
                notes: 'Penjualan ke customer A',
                userId: 1,
                date: new Date('2024-01-11T14:30:00')
            },
            {
                id: 3,
                type: 'in',
                productId: 2,
                quantity: 100,
                warehouseId: 1,
                reference: 'PO-002',
                notes: 'Pembelian stok baru',
                userId: 1,
                date: new Date('2024-01-12T11:15:00')
            },
            {
                id: 4,
                type: 'out',
                productId: 3,
                quantity: 10,
                warehouseId: 2,
                reference: 'INV-002',
                notes: 'Penjualan grosir',
                userId: 1,
                date: new Date('2024-01-13T16:45:00')
            }
        ];

        // Sample users
        this.users = [
            { id: 1, username: 'admin', name: 'Admin Gudang', role: 'admin', email: 'admin@stockflow.com' }
        ];

        localStorage.setItem('stockFlowDataInitialized', 'true');
        this.saveToLocalStorage();
    }

    static loadFromLocalStorage() {
        try {
            const initialized = localStorage.getItem('stockFlowDataInitialized');
            if (!initialized) {
                this.initSampleData();
                return;
            }

            this.products = JSON.parse(localStorage.getItem('stockFlowProducts') || '[]');
            this.transactions = JSON.parse(localStorage.getItem('stockFlowTransactions') || '[]');
            this.warehouses = JSON.parse(localStorage.getItem('stockFlowWarehouses') || '[]');
            this.suppliers = JSON.parse(localStorage.getItem('stockFlowSuppliers') || '[]');
            this.categories = JSON.parse(localStorage.getItem('stockFlowCategories') || '[]');
            this.users = JSON.parse(localStorage.getItem('stockFlowUsers') || '[]');

            // Convert date strings back to Date objects
            this.transactions.forEach(t => t.date = new Date(t.date));
            this.products.forEach(p => p.lastUpdated = p.lastUpdated ? new Date(p.lastUpdated) : null);
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            this.initSampleData();
        }
    }

    static saveToLocalStorage() {
        localStorage.setItem('stockFlowProducts', JSON.stringify(this.products));
        localStorage.setItem('stockFlowTransactions', JSON.stringify(this.transactions));
        localStorage.setItem('stockFlowWarehouses', JSON.stringify(this.warehouses));
        localStorage.setItem('stockFlowSuppliers', JSON.stringify(this.suppliers));
        localStorage.setItem('stockFlowCategories', JSON.stringify(this.categories));
        localStorage.setItem('stockFlowUsers', JSON.stringify(this.users));
    }

    static getProducts() {
        return this.products;
    }

    static getProductById(id) {
        return this.products.find(p => p.id == id);
    }

    static getTransactions() {
        return this.transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    static getProductTransactions(productId) {
        return this.transactions.filter(t => t.productId == productId);
    }

    static addProduct(productData) {
        const newId = Math.max(...this.products.map(p => p.id), 0) + 1;
        const newProduct = {
            id: newId,
            ...productData,
            lastUpdated: new Date()
        };
        this.products.push(newProduct);
        this.saveToLocalStorage();
        return newProduct;
    }

    static updateProduct(id, updates) {
        const index = this.products.findIndex(p => p.id == id);
        if (index !== -1) {
            this.products[index] = {
                ...this.products[index],
                ...updates,
                lastUpdated: new Date()
            };
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }

    static deleteProduct(id) {
        const index = this.products.findIndex(p => p.id == id);
        if (index !== -1) {
            this.products.splice(index, 1);
            this.saveToLocalStorage();
            return true;
        }
        return false;
    }

    static addTransaction(transactionData) {
        const newId = Math.max(...this.transactions.map(t => t.id), 0) + 1;
        const newTransaction = {
            id: newId,
            ...transactionData,
            date: new Date()
        };
        this.transactions.push(newTransaction);

        // Update product stock
        const product = this.getProductById(transactionData.productId);
        if (product) {
            if (transactionData.type === 'in') {
                product.stock += transactionData.quantity;
            } else if (transactionData.type === 'out') {
                product.stock -= transactionData.quantity;
            } else if (transactionData.type === 'adjust') {
                product.stock += transactionData.quantity;
            }
            product.lastUpdated = new Date();
        }

        this.saveToLocalStorage();
        return newTransaction;
    }

    static getDashboardMetrics() {
        const totalProducts = this.products.length;
        const inventoryValue = this.products.reduce((sum, p) => sum + (p.stock * p.buyPrice), 0);
        const deadStock = this.getDeadStock().length;
        
        // Calculate turnover ratio (simplified)
        const totalSales = this.transactions
            .filter(t => t.type === 'out')
            .reduce((sum, t) => {
                const product = this.getProductById(t.productId);
                return sum + (t.quantity * (product?.sellPrice || 0));
            }, 0);
        
        const averageInventory = inventoryValue / 2;
        const turnoverRatio = averageInventory > 0 ? (totalSales / averageInventory).toFixed(2) : '0.00';

        return {
            totalProducts,
            inventoryValue,
            turnoverRatio,
            deadStock
        };
    }

    static getStockStatus() {
        let critical = 0;
        let low = 0;
        let normal = 0;
        let overstock = 0;

        this.products.forEach(p => {
            if (p.stock <= p.minStock * 0.3) critical++;
            else if (p.stock <= p.minStock) low++;
            else if (p.stock >= p.maxStock * 0.9) overstock++;
            else normal++;
        });

        return { critical, low, normal, overstock };
    }

    static getRecentTransactions(limit = 5) {
        return this.getTransactions().slice(0, limit);
    }

    static getTopProducts(limit = 5) {
        const productSales = {};
        
        this.transactions
            .filter(t => t.type === 'out')
            .forEach(t => {
                if (!productSales[t.productId]) {
                    productSales[t.productId] = {
                        product: this.getProductById(t.productId),
                        quantity: 0,
                        revenue: 0
                    };
                }
                const product = this.getProductById(t.productId);
                productSales[t.productId].quantity += t.quantity;
                productSales[t.productId].revenue += t.quantity * (product?.sellPrice || 0);
            });

        return Object.values(productSales)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, limit);
    }

    static getABCAnalysis() {
        // Simple ABC analysis based on inventory value
        const productsByValue = [...this.products].sort((a, b) => 
            (b.stock * b.buyPrice) - (a.stock * a.buyPrice)
        );
        
        const totalValue = productsByValue.reduce((sum, p) => sum + (p.stock * p.buyPrice), 0);
        
        let cumulativeValue = 0;
        const classes = { A: { count: 0, percentage: 0 }, B: { count: 0, percentage: 0 }, C: { count: 0, percentage: 0 } };
        
        productsByValue.forEach((product, index) => {
            cumulativeValue += product.stock * product.buyPrice;
            const cumulativePercentage = (cumulativeValue / totalValue) * 100;
            
            // Update ABC class based on existing assignment or calculate
            if (product.abcClass === 'A') classes.A.count++;
            else if (product.abcClass === 'B') classes.B.count++;
            else if (product.abcClass === 'C') classes.C.count++;
            else {
                // Default calculation if not assigned
                if (cumulativePercentage <= 80) {
                    product.abcClass = 'A';
                    classes.A.count++;
                } else if (cumulativePercentage <= 95) {
                    product.abcClass = 'B';
                    classes.B.count++;
                } else {
                    product.abcClass = 'C';
                    classes.C.count++;
                }
            }
        });
        
        // Calculate percentages
        classes.A.percentage = Math.round((classes.A.count / this.products.length) * 100);
        classes.B.percentage = Math.round((classes.B.count / this.products.length) * 100);
        classes.C.percentage = Math.round((classes.C.count / this.products.length) * 100);
        
        return classes;
    }

    static getTurnoverAnalysis() {
        // Simplified turnover analysis
        const transactionsByMonth = {};
        this.transactions.forEach(t => {
            const month = new Date(t.date).toLocaleString('id-ID', { month: 'short' });
            if (!transactionsByMonth[month]) {
                transactionsByMonth[month] = { in: 0, out: 0 };
            }
            transactionsByMonth[month][t.type] += t.quantity;
        });

        const months = Object.keys(transactionsByMonth);
        const turnoverRatios = months.map(month => {
            const monthData = transactionsByMonth[month];
            return monthData.out > 0 ? (monthData.out / monthData.in).toFixed(2) : 0;
        });

        return {
            months,
            turnoverRatios,
            averageTurnover: turnoverRatios.reduce((a, b) => parseFloat(a) + parseFloat(b), 0) / (turnoverRatios.length || 1)
        };
    }

    static getDeadStock() {
        // Products with no sales in last 6 months
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        
        return this.products.filter(product => {
            const productTransactions = this.getProductTransactions(product.id);
            const lastSale = productTransactions
                .filter(t => t.type === 'out')
                .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
            
            return !lastSale || new Date(lastSale.date) < sixMonthsAgo;
        });
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.stockFlowApp = new StockFlowApp();
});
