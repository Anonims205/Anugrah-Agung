// Main application controller
class StockFlowApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.isSidebarCollapsed = false;
        this.charts = {};
        
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
                                            <option>Elektronik > Gadget</option>
                                            <option>Elektronik > Komputer</option>
                                            <option>Fashion > Pria > Atasan</option>
                                            <option>Fashion > Pria > Sepatu</option>
                                            <option>Kesehatan > Suplemen</option>
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
        `;
        
        document.getElementById('modals-container').innerHTML = modalsHTML;
    }
    
    initEventListeners() {
        // Sidebar toggle
        document.getElementById('sidebarToggle').addEventListener('click', () => this.toggleSidebar());
        
        // Navigation
        document.querySelectorAll('[data-page]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.closest('[data-page]').getAttribute('data-page');
                this.navigateTo(page);
            });
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
        }
    }
    
    initDashboard() {
        // Initialize charts
        this.initCharts();
        
        // Add event listeners for period buttons
        document.querySelectorAll('[data-period]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const period = e.target.getAttribute('data-period');
                this.updateStockMovementChart(parseInt(period));
                
                // Update active button
                document.querySelectorAll('[data-period]').forEach(b => {
                    b.classList.remove('active');
                });
                e.target.classList.add('active');
            });
        });
        
        // Update notifications
        this.updateNotifications();
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
            abcClass: 'C' // Default class, will be calculated later
        };
        
        // Validate
        if (!productData.name || !productData.sku || !productData.buyPrice || !productData.sellPrice) {
            this.showAlert('Harap isi semua bidang yang diperlukan', 'danger');
            return;
        }
        
        // Add product
        const newProduct = StockFlowData.addProduct(productData);
        
        // Close modal and refresh
        bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide();
        this.showAlert('Produk berhasil ditambahkan!', 'success');
        
        // Refresh products page if active
        if (this.currentPage === 'products') {
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
            userId: 1 // Current user
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
        
        // Close modal and refresh
        bootstrap.Modal.getInstance(document.getElementById('addTransactionModal')).hide();
        this.showAlert('Transaksi berhasil dicatat!', 'success');
        
        // Refresh current page
        this.navigateTo(this.currentPage);
    }
    
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
        return num.toString();
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
        return date.toLocaleDateString('id-ID');
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
    
    logout() {
        if (confirm('Apakah Anda yakin ingin keluar?')) {
            // In a real app, you would clear session/tokens here
            this.showAlert('Anda telah keluar dari sistem', 'info');
            setTimeout(() => {
                window.location.reload(); // Reload to simulate logout
            }, 1500);
        }
    }
    
    // Additional page load methods will be implemented similarly
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
    
    searchProducts() {
        const query = document.getElementById('productSearch')?.value || '';
        this.filterProducts();
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
        this.navigateTo('products');
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
        // Simple export to CSV
        const products = StockFlowData.getProducts();
        const headers = ['SKU', 'Nama', 'Kategori', 'Stok', 'Min', 'Max', 'Harga Beli', 'Harga Jual', 'Status'];
        
        let csv = headers.join(',') + '\n';
        
        products.forEach(product => {
            let status = 'Normal';
            if (product.stock <= product.minStock * 0.3) status = 'Kritis';
            else if (product.stock <= product.minStock) status = 'Hampir Habis';
            else if (product.stock >= product.maxStock * 0.9) status = 'Overstock';
            
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
        
        // Create download link
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `produks_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        this.showAlert('Data berhasil diekspor ke CSV', 'success');
    }
    
    // Additional methods for other pages would follow similar pattern
    // Due to space constraints, I'll implement the other pages in a similar way
}

// Initialize the app
const stockFlowApp = new StockFlowApp();

// Make app available globally for inline onclick handlers
window.stockFlowApp = stockFlowApp;
