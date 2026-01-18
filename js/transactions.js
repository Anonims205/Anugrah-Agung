// Transactions Management System
class TransactionsManager {
    constructor() {
        this.currentFilter = 'all';
        this.transactionTypes = [
            { value: 'all', label: 'Semua', icon: 'list', color: 'secondary' },
            { value: 'in', label: 'Stok Masuk', icon: 'arrow-down', color: 'success' },
            { value: 'out', label: 'Stok Keluar', icon: 'arrow-up', color: 'danger' },
            { value: 'adjust', label: 'Adjustment', icon: 'exchange-alt', color: 'warning' },
            { value: 'return', label: 'Retur', icon: 'undo', color: 'info' }
        ];
    }
    
    async loadTransactionsPage() {
        const transactions = StockFlowData.getTransactions(50);
        
        return `
            <div id="transactionsContent">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h3 class="mb-0">Manajemen Transaksi</h3>
                    <div>
                        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addTransactionModal">
                            <i class="fas fa-plus"></i> Transaksi Baru
                        </button>
                        <button class="btn btn-outline-secondary ms-2" onclick="transactionsManager.exportTransactions()">
                            <i class="fas fa-file-export"></i> Export
                        </button>
                    </div>
                </div>
                
                <!-- Filters and Search -->
                <div class="card mb-4">
                    <div class="card-body">
                        <div class="row g-3">
                            <div class="col-md-3">
                                <label class="form-label">Jenis Transaksi</label>
                                <select class="form-select" id="filterType">
                                    <option value="all">Semua Jenis</option>
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
                                <label class="form-label">Lokasi</label>
                                <select class="form-select" id="filterWarehouse">
                                    <option value="">Semua Lokasi</option>
                                    ${StockFlowData.warehouses.map(w => 
                                        `<option value="${w.id}">${w.name}</option>`
                                    ).join('')}
                                </select>
                            </div>
                            <div class="col-md-9">
                                <label class="form-label">Cari Produk/Referensi</label>
                                <input type="text" class="form-control" id="filterSearch" placeholder="Cari berdasarkan produk, SKU, atau referensi...">
                            </div>
                            <div class="col-md-3 d-flex align-items-end">
                                <button class="btn btn-primary w-100" onclick="transactionsManager.applyFilters()">
                                    <i class="fas fa-filter"></i> Filter
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Quick Stats -->
                <div class="row mb-4">
                    ${this.transactionTypes.map(type => {
                        const count = transactions.filter(t => type.value === 'all' || t.type === type.value).length;
                        const total = type.value === 'all' ? 
                            transactions.length : 
                            transactions.filter(t => t.type === type.value).length;
                        
                        return `
                            <div class="col-md-3 col-6 mb-3">
                                <div class="card border-${type.color}">
                                    <div class="card-body text-center">
                                        <i class="fas fa-${type.icon} fa-2x text-${type.color} mb-2"></i>
                                        <h5 class="card-title">${total}</h5>
                                        <p class="card-text small">${type.label}</p>
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <!-- Transactions Table -->
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">Daftar Transaksi</h5>
                        <div class="d-flex align-items-center">
                            <div class="input-group input-group-sm me-2" style="width: 200px;">
                                <input type="text" class="form-control" placeholder="Cari..." id="searchTransactions">
                                <button class="btn btn-outline-secondary" type="button" onclick="transactionsManager.searchTransactions()">
                                    <i class="fas fa-search"></i>
                                </button>
                            </div>
                            <button class="btn btn-sm btn-outline-secondary" onclick="transactionsManager.refreshTransactions()">
                                <i class="fas fa-sync-alt"></i>
                            </button>
                        </div>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive">
                            <table class="table table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>Tanggal/Waktu</th>
                                        <th>Jenis</th>
                                        <th>Produk</th>
                                        <th>SKU</th>
                                        <th>Quantity</th>
                                        <th>Lokasi</th>
                                        <th>Referensi</th>
                                        <th>Catatan</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody id="transactionsTableBody">
                                    ${transactions.map(transaction => this.renderTransactionRow(transaction)).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="card-footer d-flex justify-content-between align-items-center">
                        <div class="text-muted">
                            Menampilkan ${transactions.length} transaksi terbaru
                        </div>
                        <nav>
                            <ul class="pagination pagination-sm mb-0">
                                <li class="page-item disabled">
                                    <a class="page-link" href="#">Sebelumnya</a>
                                </li>
                                <li class="page-item active">
                                    <a class="page-link" href="#">1</a>
                                </li>
                                <li class="page-item">
                                    <a class="page-link" href="#">2</a>
                                </li>
                                <li class="page-item">
                                    <a class="page-link" href="#">3</a>
                                </li>
                                <li class="page-item">
                                    <a class="page-link" href="#">Berikutnya</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
                
                <!-- Transaction Summary -->
                <div class="row mt-4">
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0">Ringkasan Bulan Ini</h5>
                            </div>
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-6">
                                        <h6>Total Stok Masuk</h6>
                                        <h3 class="text-success">${this.getMonthlyTotal('in')} unit</h3>
                                    </div>
                                    <div class="col-6">
                                        <h6>Total Stok Keluar</h6>
                                        <h3 class="text-danger">${this.getMonthlyTotal('out')} unit</h3>
                                    </div>
                                </div>
                                <div class="row mt-3">
                                    <div class="col-12">
                                        <div class="progress" style="height: 20px;">
                                            <div class="progress-bar bg-success" style="width: ${this.getInOutRatio()}%">
                                                Masuk: ${this.getMonthlyTotal('in')}
                                            </div>
                                            <div class="progress-bar bg-danger" style="width: ${100 - this.getInOutRatio()}%">
                                                Keluar: ${this.getMonthlyTotal('out')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0">Aksi Batch</h5>
                            </div>
                            <div class="card-body">
                                <div class="row g-2">
                                    <div class="col-6">
                                        <button class="btn btn-outline-primary w-100" onclick="transactionsManager.reverseSelected()">
                                            <i class="fas fa-undo"></i> Reverse Selected
                                        </button>
                                    </div>
                                    <div class="col-6">
                                        <button class="btn btn-outline-danger w-100" onclick="transactionsManager.deleteSelected()">
                                            <i class="fas fa-trash"></i> Delete Selected
                                        </button>
                                    </div>
                                    <div class="col-12">
                                        <button class="btn btn-outline-warning w-100 mt-2" onclick="transactionsManager.generateTransactionReport()">
                                            <i class="fas fa-file-pdf"></i> Generate Report
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderTransactionRow(transaction) {
        const product = StockFlowData.getProductById(transaction.productId);
        const warehouse = StockFlowData.warehouses.find(w => w.id == transaction.warehouseId);
        const date = new Date(transaction.date);
        const timeString = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        const dateString = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
        
        const typeBadges = {
            'in': { class: 'success', text: 'Masuk', icon: 'arrow-down' },
            'out': { class: 'danger', text: 'Keluar', icon: 'arrow-up' },
            'adjust': { class: 'warning', text: 'Adjust', icon: 'exchange-alt' },
            'return': { class: 'info', text: 'Retur', icon: 'undo' }
        };
        
        const type = typeBadges[transaction.type] || { class: 'secondary', text: 'Unknown', icon: 'question' };
        
        return `
            <tr data-transaction-id="${transaction.id}">
                <td>
                    <div class="small text-muted">${dateString}</div>
                    <div class="small">${timeString}</div>
                </td>
                <td>
                    <span class="badge bg-${type.class}">
                        <i class="fas fa-${type.icon} me-1"></i> ${type.text}
                    </span>
                </td>
                <td>${product?.name || 'Unknown'}</td>
                <td><span class="badge bg-light text-dark">${product?.sku || '-'}</span></td>
                <td>
                    <span class="fw-bold ${type.class === 'success' ? 'text-success' : type.class === 'danger' ? 'text-danger' : 'text-warning'}">
                        ${transaction.type === 'in' || transaction.type === 'adjust' && transaction.quantity > 0 ? '+' : ''}
                        ${transaction.quantity}
                    </span>
                </td>
                <td>${warehouse?.name || '-'}</td>
                <td><small class="text-muted">${transaction.reference || '-'}</small></td>
                <td><small>${transaction.notes || '-'}</small></td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-info" onclick="transactionsManager.viewTransaction(${transaction.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-outline-warning" onclick="transactionsManager.reverseTransaction(${transaction.id})">
                            <i class="fas fa-undo"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="transactionsManager.deleteTransaction(${transaction.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }
    
    init() {
        this.setupFilterListeners();
        this.setupSearch();
    }
    
    setupFilterListeners() {
        // Filter type
        document.getElementById('filterType')?.addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.applyFilters();
        });
        
        // Date filters
        document.getElementById('filterDateFrom')?.addEventListener('change', () => this.applyFilters());
        document.getElementById('filterDateTo')?.addEventListener('change', () => this.applyFilters());
        
        // Warehouse filter
        document.getElementById('filterWarehouse')?.addEventListener('change', () => this.applyFilters());
        
        // Search filter
        document.getElementById('filterSearch')?.addEventListener('input', () => {
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(() => this.applyFilters(), 300);
        });
    }
    
    setupSearch() {
        document.getElementById('searchTransactions')?.addEventListener('input', () => {
            clearTimeout(this.tableSearchTimeout);
            this.tableSearchTimeout = setTimeout(() => this.searchTransactions(), 300);
        });
    }
    
    applyFilters() {
        const type = document.getElementById('filterType')?.value || 'all';
        const dateFrom = document.getElementById('filterDateFrom')?.value;
        const dateTo = document.getElementById('filterDateTo')?.value;
        const warehouse = document.getElementById('filterWarehouse')?.value;
        const search = document.getElementById('filterSearch')?.value.toLowerCase() || '';
        
        let transactions = StockFlowData.getTransactions(100);
        
        // Apply type filter
        if (type !== 'all') {
            transactions = transactions.filter(t => t.type === type);
        }
        
        // Apply date filter
        if (dateFrom) {
            const fromDate = new Date(dateFrom);
            transactions = transactions.filter(t => new Date(t.date) >= fromDate);
        }
        
        if (dateTo) {
            const toDate = new Date(dateTo);
            toDate.setHours(23, 59, 59, 999);
            transactions = transactions.filter(t => new Date(t.date) <= toDate);
        }
        
        // Apply warehouse filter
        if (warehouse) {
            transactions = transactions.filter(t => t.warehouseId == warehouse);
        }
        
        // Apply search filter
        if (search) {
            transactions = transactions.filter(t => {
                const product = StockFlowData.getProductById(t.productId);
                return (
                    (product?.name?.toLowerCase().includes(search)) ||
                    (product?.sku?.toLowerCase().includes(search)) ||
                    (t.reference?.toLowerCase().includes(search)) ||
                    (t.notes?.toLowerCase().includes(search))
                );
            });
        }
        
        // Update table
        this.updateTransactionsTable(transactions);
    }
    
    searchTransactions() {
        const searchTerm = document.getElementById('searchTransactions')?.value.toLowerCase() || '';
        let transactions = StockFlowData.getTransactions(100);
        
        if (searchTerm) {
            transactions = transactions.filter(t => {
                const product = StockFlowData.getProductById(t.productId);
                return (
                    (product?.name?.toLowerCase().includes(searchTerm)) ||
                    (product?.sku?.toLowerCase().includes(searchTerm)) ||
                    (t.reference?.toLowerCase().includes(searchTerm))
                );
            });
        }
        
        this.updateTransactionsTable(transactions);
    }
    
    updateTransactionsTable(transactions) {
        const tbody = document.getElementById('transactionsTableBody');
        if (tbody) {
            tbody.innerHTML = transactions.map(transaction => this.renderTransactionRow(transaction)).join('');
        }
        
        // Update count
        const countElement = document.querySelector('#transactionsContent .card-footer .text-muted');
        if (countElement) {
            countElement.textContent = `Menampilkan ${transactions.length} transaksi`;
        }
    }
    
    refreshTransactions() {
        this.applyFilters();
        stockFlowApp.showAlert('Data transaksi diperbarui', 'info');
    }
    
    getMonthlyTotal(type) {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        return StockFlowData.transactions
            .filter(t => t.type === type && new Date(t.date) >= startOfMonth)
            .reduce((sum, t) => sum + t.quantity, 0);
    }
    
    getInOutRatio() {
        const inTotal = this.getMonthlyTotal('in');
        const outTotal = this.getMonthlyTotal('out');
        const total = inTotal + outTotal;
        
        return total > 0 ? Math.round((inTotal / total) * 100) : 50;
    }
    
    viewTransaction(transactionId) {
        const transaction = StockFlowData.transactions.find(t => t.id == transactionId);
        if (!transaction) return;
        
        const product = StockFlowData.getProductById(transaction.productId);
        const warehouse = StockFlowData.warehouses.find(w => w.id == transaction.warehouseId);
        const date = new Date(transaction.date);
        
        const typeLabels = {
            'in': { label: 'Stok Masuk', color: 'success' },
            'out': { label: 'Stok Keluar', color: 'danger' },
            'adjust': { label: 'Adjustment', color: 'warning' },
            'return': { label: 'Retur', color: 'info' }
        };
        
        const type = typeLabels[transaction.type] || { label: 'Unknown', color: 'secondary' };
        
        const modalHTML = `
            <div class="modal fade" id="viewTransactionModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Detail Transaksi #${transaction.id}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-12 mb-3">
                                    <h6>Informasi Transaksi</h6>
                                    <table class="table table-sm">
                                        <tr>
                                            <td width="40%">Tanggal</td>
                                            <td>${date.toLocaleString('id-ID')}</td>
                                        </tr>
                                        <tr>
                                            <td>Jenis</td>
                                            <td>
                                                <span class="badge bg-${type.color}">${type.label}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Referensi</td>
                                            <td>${transaction.reference || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td>Lokasi</td>
                                            <td>${warehouse?.name || '-'}</td>
                                        </tr>
                                    </table>
                                </div>
                                
                                <div class="col-12 mb-3">
                                    <h6>Informasi Produk</h6>
                                    <table class="table table-sm">
                                        <tr>
                                            <td width="40%">Produk</td>
                                            <td>${product?.name || 'Unknown'}</td>
                                        </tr>
                                        <tr>
                                            <td>SKU</td>
                                            <td>${product?.sku || '-'}</td>
                                        </tr>
                                        <tr>
                                            <td>Quantity</td>
                                            <td>
                                                <span class="fw-bold ${type.color === 'success' ? 'text-success' : type.color === 'danger' ? 'text-danger' : 'text-warning'}">
                                                    ${transaction.type === 'in' || transaction.type === 'adjust' && transaction.quantity > 0 ? '+' : ''}
                                                    ${transaction.quantity} unit
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Harga Satuan</td>
                                            <td>Rp ${product?.buyPrice?.toLocaleString('id-ID') || '0'}</td>
                                        </tr>
                                        <tr>
                                            <td>Total Nilai</td>
                                            <td>Rp ${(transaction.quantity * (product?.buyPrice || 0)).toLocaleString('id-ID')}</td>
                                        </tr>
                                    </table>
                                </div>
                                
                                <div class="col-12">
                                    <h6>Catatan</h6>
                                    <div class="alert alert-light">
                                        ${transaction.notes || 'Tidak ada catatan'}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                            <button type="button" class="btn btn-warning" onclick="transactionsManager.reverseTransaction(${transaction.id})">
                                <i class="fas fa-undo"></i> Reverse
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to DOM
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = modalHTML;
        document.body.appendChild(modalContainer);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('viewTransactionModal'));
        modal.show();
        
        // Remove modal from DOM after hide
        modalContainer.addEventListener('hidden.bs.modal', () => {
            modalContainer.remove();
        });
    }
    
    reverseTransaction(transactionId) {
        const transaction = StockFlowData.transactions.find(t => t.id == transactionId);
        if (!transaction) return;
        
        const product = StockFlowData.getProductById(transaction.productId);
        if (!product) return;
        
        if (!confirm(`Reverse transaksi ${transaction.type} ${transaction.quantity} unit ${product.name}?`)) return;
        
        // Create reverse transaction
        const reverseType = transaction.type === 'in' ? 'out' : 
                           transaction.type === 'out' ? 'in' : 
                           transaction.type;
        
        const reverseQuantity = transaction.type === 'adjust' ? -transaction.quantity : transaction.quantity;
        
        // Check stock for outgoing reverse
        if (reverseType === 'out' && product.stock < reverseQuantity) {
            stockFlowApp.showAlert(`Stok tidak mencukupi untuk reverse! Stok tersedia: ${product.stock} unit`, 'danger');
            return;
        }
        
        const reverseTransaction = {
            type: reverseType,
            productId: transaction.productId,
            quantity: reverseQuantity,
            warehouseId: transaction.warehouseId,
            reference: `REV-${transaction.reference || transaction.id}`,
            notes: `Reverse dari transaksi #${transaction.id}`,
            userId: 1
        };
        
        StockFlowData.addTransaction(reverseTransaction);
        stockFlowApp.showAlert('Transaksi berhasil di-reverse', 'success');
        
        // Refresh transactions page
        if (stockFlowApp.currentPage === 'transactions') {
            stockFlowApp.navigateTo('transactions');
        }
    }
    
    deleteTransaction(transactionId) {
        if (!confirm('Hapus transaksi ini? Aksi ini tidak dapat dibatalkan.')) return;
        
        // In a real app, you would mark as deleted or move to archive
        // For this demo, we'll just remove from array
        const index = StockFlowData.transactions.findIndex(t => t.id == transactionId);
        if (index !== -1) {
            StockFlowData.transactions.splice(index, 1);
            StockFlowData.saveToLocalStorage();
            stockFlowApp.showAlert('Transaksi berhasil dihapus', 'success');
            
            // Refresh transactions page
            if (stockFlowApp.currentPage === 'transactions') {
                stockFlowApp.navigateTo('transactions');
            }
        }
    }
    
    reverseSelected() {
        const selected = this.getSelectedTransactions();
        if (selected.length === 0) {
            stockFlowApp.showAlert('Pilih transaksi yang akan di-reverse terlebih dahulu', 'warning');
            return;
        }
        
        if (!confirm(`Reverse ${selected.length} transaksi terpilih?`)) return;
        
        selected.forEach(transactionId => {
            this.reverseTransaction(transactionId);
        });
        
        stockFlowApp.showAlert(`${selected.length} transaksi sedang di-reverse`, 'info');
    }
    
    deleteSelected() {
        const selected = this.getSelectedTransactions();
        if (selected.length === 0) {
            stockFlowApp.showAlert('Pilih transaksi yang akan dihapus terlebih dahulu', 'warning');
            return;
        }
        
        if (!confirm(`Hapus ${selected.length} transaksi terpilih?`)) return;
        
        selected.forEach(transactionId => {
            this.deleteTransaction(transactionId);
        });
        
        stockFlowApp.showAlert(`${selected.length} transaksi berhasil dihapus`, 'success');
    }
    
    getSelectedTransactions() {
        // This would get selected checkboxes in a real implementation
        // For now, return empty array
        return [];
    }
    
    exportTransactions() {
        const transactions = StockFlowData.getTransactions(1000);
        let csv = 'ID,Tanggal,Jenis,Produk,SKU,Quantity,Lokasi,Referensi,Catatan\n';
        
        transactions.forEach(t => {
            const product = StockFlowData.getProductById(t.productId);
            const warehouse = StockFlowData.warehouses.find(w => w.id == t.warehouseId);
            const date = new Date(t.date);
            
            csv += `"${t.id}",`;
            csv += `"${date.toLocaleString('id-ID')}",`;
            csv += `"${t.type}",`;
            csv += `"${product?.name || ''}",`;
            csv += `"${product?.sku || ''}",`;
            csv += `"${t.quantity}",`;
            csv += `"${warehouse?.name || ''}",`;
            csv += `"${t.reference || ''}",`;
            csv += `"${t.notes || ''}"\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transactions_export_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        stockFlowApp.showAlert('Data transaksi berhasil diekspor', 'success');
    }
    
    generateTransactionReport() {
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        
        const monthlyTransactions = StockFlowData.transactions.filter(t => new Date(t.date) >= startOfMonth);
        const inTotal = monthlyTransactions.filter(t => t.type === 'in').reduce((sum, t) => sum + t.quantity, 0);
        const outTotal = monthlyTransactions.filter(t => t.type === 'out').reduce((sum, t) => sum + t.quantity, 0);
        const adjustTotal = monthlyTransactions.filter(t => t.type === 'adjust').reduce((sum, t) => sum + t.quantity, 0);
        
        const report = `
            LAPORAN TRANSAKSI BULANAN
            =========================
            
            Periode: ${startOfMonth.toLocaleDateString('id-ID')} - ${now.toLocaleDateString('id-ID')}
            Generated: ${now.toLocaleString('id-ID')}
            
            RINGKASAN:
            ----------
            Total Stok Masuk: ${inTotal} unit
            Total Stok Keluar: ${outTotal} unit
            Total Adjustment: ${adjustTotal} unit
            Total Transaksi: ${monthlyTransactions.length} transaksi
            
            DETAIL TRANSAKSI:
            -----------------
            
            ${monthlyTransactions.map(t => {
                const product = StockFlowData.getProductById(t.productId);
                const date = new Date(t.date);
                const typeMap = { in: 'MASUK', out: 'KELUAR', adjust: 'ADJUST', return: 'RETUR' };
                
                return `${date.toLocaleDateString('id-ID')} | ${typeMap[t.type] || t.type} | ${product?.name || 'Unknown'} | ${t.quantity} unit | ${t.reference || '-'}`;
            }).join('\n')}
            
            =========================
            Generated by StockFlow System
        `;
        
        const blob = new Blob([report], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `transaction_report_${now.getFullYear()}_${now.getMonth() + 1}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        stockFlowApp.showAlert('Laporan transaksi berhasil di-generate', 'success');
    }
}

// Initialize transactions manager
window.transactionsManager = new TransactionsManager();
