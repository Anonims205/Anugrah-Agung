// Inventory real-time management
class InventoryManager {
    constructor() {
        this.selectedWarehouse = null;
        this.inventoryData = null;
    }
    
    async loadInventoryPage() {
        const warehouses = StockFlowData.warehouses;
        const transactions = StockFlowData.getRecentTransactions(20);
        const lowStockProducts = StockFlowData.getProducts().filter(p => p.stock <= p.minStock);
        
        return `
            <div id="inventoryContent">
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h3 class="mb-0">Stok Real-time</h3>
                    <div>
                        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addTransactionModal">
                            <i class="fas fa-plus"></i> Transaksi Baru
                        </button>
                        <button class="btn btn-outline-secondary ms-2" onclick="inventoryManager.exportInventoryReport()">
                            <i class="fas fa-file-export"></i> Export Laporan
                        </button>
                    </div>
                </div>
                
                <!-- Warehouse Summary -->
                <div class="row mb-4">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0">Lokasi Penyimpanan</h5>
                            </div>
                            <div class="card-body">
                                <div class="row text-center" id="warehouseSummary">
                                    ${warehouses.map(warehouse => this.renderWarehouseCard(warehouse)).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Real-time Updates -->
                <div class="row">
                    <!-- Today's Transactions -->
                    <div class="col-md-8">
                        <div class="card">
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <h5 class="mb-0">Transaksi Hari Ini</h5>
                                <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#addTransactionModal">
                                    <i class="fas fa-plus"></i> Transaksi Baru
                                </button>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-sm">
                                        <thead>
                                            <tr>
                                                <th>Waktu</th>
                                                <th>Jenis</th>
                                                <th>Produk</th>
                                                <th>Qty</th>
                                                <th>Lokasi</th>
                                                <th>Referensi</th>
                                            </tr>
                                        </thead>
                                        <tbody id="todayTransactions">
                                            ${transactions.map(transaction => this.renderTransactionRow(transaction)).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Quick Actions & Alerts -->
                    <div class="col-md-4">
                        <div class="card mb-4">
                            <div class="card-header">
                                <h5 class="mb-0">Quick Actions</h5>
                            </div>
                            <div class="card-body">
                                <div class="row g-2">
                                    <div class="col-6">
                                        <button class="btn btn-outline-primary w-100 py-3 d-flex flex-column align-items-center"
                                                onclick="inventoryManager.quickAction('in')">
                                            <i class="fas fa-shipping-fast fa-2x mb-2"></i>
                                            <span>Stok Masuk</span>
                                        </button>
                                    </div>
                                    <div class="col-6">
                                        <button class="btn btn-outline-danger w-100 py-3 d-flex flex-column align-items-center"
                                                onclick="inventoryManager.quickAction('out')">
                                            <i class="fas fa-truck-loading fa-2x mb-2"></i>
                                            <span>Stok Keluar</span>
                                        </button>
                                    </div>
                                    <div class="col-6">
                                        <button class="btn btn-outline-warning w-100 py-3 d-flex flex-column align-items-center"
                                                onclick="inventoryManager.quickAction('adjust')">
                                            <i class="fas fa-exchange-alt fa-2x mb-2"></i>
                                            <span>Adjustment</span>
                                        </button>
                                    </div>
                                    <div class="col-6">
                                        <button class="btn btn-outline-info w-100 py-3 d-flex flex-column align-items-center"
                                                onclick="inventoryManager.quickAction('return')">
                                            <i class="fas fa-undo fa-2x mb-2"></i>
                                            <span>Retur</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Low Stock Alerts -->
                        <div class="card">
                            <div class="card-header">
                                <h5 class="mb-0">Produk Stok Rendah</h5>
                            </div>
                            <div class="card-body p-0">
                                <div class="list-group list-group-flush">
                                    ${lowStockProducts.slice(0, 5).map(product => `
                                        <div class="list-group-item">
                                            <div class="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6 class="mb-1">${product.name}</h6>
                                                    <small class="text-muted">${product.sku}</small>
                                                </div>
                                                <div class="text-end">
                                                    <span class="badge ${product.stock <= product.minStock * 0.3 ? 'bg-danger' : 'bg-warning'}">
                                                        ${product.stock} unit
                                                    </span>
                                                    <div>
                                                        <small class="text-muted">Min: ${product.minStock}</small>
                                                    </div>
                                                </div>
                                            </div>
                                            <button class="btn btn-sm btn-outline-primary w-100 mt-2"
                                                    onclick="inventoryManager.restockProduct(${product.id})">
                                                <i class="fas fa-cart-plus"></i> Restock
                                            </button>
                                        </div>
                                    `).join('')}
                                    ${lowStockProducts.length > 5 ? `
                                        <div class="list-group-item text-center">
                                            <a href="#" onclick="stockFlowApp.navigateTo('products')" class="text-decoration-none">
                                                Lihat ${lowStockProducts.length - 5} produk lainnya
                                            </a>
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Warehouse Details -->
                <div class="row mt-4" id="warehouseDetails">
                    <!-- Will be populated by JavaScript -->
                </div>
            </div>
        `;
    }
    
    renderWarehouseCard(warehouse) {
        const productsInWarehouse = StockFlowData.getProducts().filter(p => p.warehouseId == warehouse.id);
        const totalValue = productsInWarehouse.reduce((sum, p) => sum + (p.stock * p.buyPrice), 0);
        const lowStockCount = productsInWarehouse.filter(p => p.stock <= p.minStock).length;
        
        return `
            <div class="col-md-3 col-6 mb-3">
                <div class="p-3 border rounded warehouse-card" 
                     data-warehouse-id="${warehouse.id}"
                     style="cursor: pointer; transition: all 0.3s;"
                     onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 5px 15px rgba(0,0,0,0.1)';"
                     onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';"
                     onclick="inventoryManager.showWarehouseDetails(${warehouse.id})">
                    <div class="h4 mb-1">${warehouse.name}</div>
                    <div class="text-muted">${productsInWarehouse.length} Produk</div>
                    <div class="mt-2">
                        <span class="badge bg-success">Rp ${stockFlowApp.formatNumber(totalValue)}</span>
                    </div>
                    ${lowStockCount > 0 ? `
                        <div class="mt-2">
                            <span class="badge bg-danger">${lowStockCount} Stok Rendah</span>
                        </div>
                    ` : ''}
                    <div class="mt-2 small text-muted">
                        <i class="fas fa-map-marker-alt"></i> ${warehouse.location}
                    </div>
                </div>
            </div>
        `;
    }
    
    renderTransactionRow(transaction) {
        const product = StockFlowData.getProductById(transaction.productId);
        const warehouse = StockFlowData.warehouses.find(w => w.id == transaction.warehouseId);
        const time = new Date(transaction.date).toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        const typeBadges = {
            'in': { class: 'success', text: 'Masuk' },
            'out': { class: 'danger', text: 'Keluar' },
            'adjust': { class: 'warning', text: 'Adjust' },
            'return': { class: 'info', text: 'Retur' }
        };
        
        const type = typeBadges[transaction.type] || { class: 'secondary', text: 'Unknown' };
        
        return `
            <tr>
                <td>${time}</td>
                <td><span class="badge bg-${type.class}">${type.text}</span></td>
                <td>${product?.name || 'Unknown'}</td>
                <td>${transaction.quantity}</td>
                <td>${warehouse?.name || '-'}</td>
                <td><small class="text-muted">${transaction.reference || '-'}</small></td>
            </tr>
        `;
    }
    
    init() {
        this.setupWarehouseListeners();
        this.setupAutoRefresh();
    }
    
    setupWarehouseListeners() {
        // Warehouse card click events are handled inline
    }
    
    showWarehouseDetails(warehouseId) {
        this.selectedWarehouse = StockFlowData.warehouses.find(w => w.id == warehouseId);
        const products = StockFlowData.getProducts().filter(p => p.warehouseId == warehouseId);
        
        const detailsHTML = `
            <div class="col-12">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">Detail: ${this.selectedWarehouse.name}</h5>
                        <button class="btn btn-sm btn-outline-secondary" onclick="inventoryManager.closeWarehouseDetails()">
                            <i class="fas fa-times"></i> Tutup
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="row mb-3">
                            <div class="col-md-3">
                                <div class="card bg-light">
                                    <div class="card-body text-center">
                                        <h6 class="text-muted">Total Produk</h6>
                                        <h3>${products.length}</h3>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card bg-light">
                                    <div class="card-body text-center">
                                        <h6 class="text-muted">Nilai Inventaris</h6>
                                        <h3>Rp ${stockFlowApp.formatNumber(
                                            products.reduce((sum, p) => sum + (p.stock * p.buyPrice), 0)
                                        )}</h3>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card bg-light">
                                    <div class="card-body text-center">
                                        <h6 class="text-muted">Stok Rendah</h6>
                                        <h3 class="text-danger">${products.filter(p => p.stock <= p.minStock).length}</h3>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card bg-light">
                                    <div class="card-body text-center">
                                        <h6 class="text-muted">Kapasitas</h6>
                                        <h3>${this.selectedWarehouse.capacity} unit</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <h6 class="mb-3">Daftar Produk di ${this.selectedWarehouse.name}</h6>
                        <div class="table-responsive">
                            <table class="table table-sm">
                                <thead>
                                    <tr>
                                        <th>Produk</th>
                                        <th>SKU</th>
                                        <th>Stok</th>
                                        <th>Min/Max</th>
                                        <th>Nilai</th>
                                        <th>Status</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${products.map(product => {
                                        const status = product.stock <= product.minStock * 0.3 ? 'danger' : 
                                                      product.stock <= product.minStock ? 'warning' : 
                                                      product.stock >= product.maxStock * 0.9 ? 'info' : 'success';
                                        const statusText = product.stock <= product.minStock * 0.3 ? 'Kritis' : 
                                                          product.stock <= product.minStock ? 'Rendah' : 
                                                          product.stock >= product.maxStock * 0.9 ? 'Tinggi' : 'Normal';
                                        
                                        return `
                                            <tr>
                                                <td>${product.name}</td>
                                                <td><span class="badge bg-light text-dark">${product.sku}</span></td>
                                                <td class="fw-bold text-${status}">${product.stock}</td>
                                                <td>
                                                    <small>Min: ${product.minStock}</small><br>
                                                    <small>Max: ${product.maxStock}</small>
                                                </td>
                                                <td>Rp ${(product.stock * product.buyPrice).toLocaleString('id-ID')}</td>
                                                <td><span class="badge bg-${status}">${statusText}</span></td>
                                                <td>
                                                    <button class="btn btn-sm btn-outline-primary" 
                                                            onclick="inventoryManager.transferProduct(${product.id}, ${warehouseId})">
                                                        <i class="fas fa-exchange-alt"></i> Transfer
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
            </div>
        `;
        
        document.getElementById('warehouseDetails').innerHTML = detailsHTML;
    }
    
    closeWarehouseDetails() {
        document.getElementById('warehouseDetails').innerHTML = '';
        this.selectedWarehouse = null;
    }
    
    quickAction(actionType) {
        // Open transaction modal with pre-selected type
        const modal = new bootstrap.Modal(document.getElementById('addTransactionModal'));
        const typeSelect = document.querySelector('#addTransactionForm select[name="type"]');
        
        if (typeSelect) {
            typeSelect.value = actionType;
        }
        
        modal.show();
    }
    
    restockProduct(productId) {
        const product = StockFlowData.getProductById(productId);
        if (!product) return;
        
        const quantity = prompt(`Restock ${product.name}\n\nStok saat ini: ${product.stock} unit\nMinimal stok: ${product.minStock} unit\n\nMasukkan jumlah restock:`, 
                               (product.minStock - product.stock + 10).toString());
        
        if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) return;
        
        const transactionData = {
            type: 'in',
            productId: productId,
            quantity: parseInt(quantity),
            warehouseId: product.warehouseId || 1,
            reference: 'RESTOCK-' + new Date().getTime(),
            notes: 'Restock otomatis dari sistem',
            userId: 1
        };
        
        StockFlowData.addTransaction(transactionData);
        stockFlowApp.showAlert(`${product.name} berhasil di-restock ${quantity} unit`, 'success');
        
        // Refresh inventory page
        if (stockFlowApp.currentPage === 'inventory') {
            stockFlowApp.navigateTo('inventory');
        }
    }
    
    transferProduct(productId, fromWarehouseId) {
        const product = StockFlowData.getProductById(productId);
        if (!product) return;
        
        const quantity = prompt(`Transfer ${product.name}\n\nStok tersedia: ${product.stock} unit\n\nMasukkan jumlah transfer:`, '1');
        if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) return;
        
        if (parseInt(quantity) > product.stock) {
            stockFlowApp.showAlert(`Stok tidak mencukupi! Hanya ${product.stock} unit tersedia`, 'danger');
            return;
        }
        
        // Show warehouse selection for transfer
        const warehouses = StockFlowData.warehouses.filter(w => w.id != fromWarehouseId);
        let warehouseOptions = warehouses.map(w => `<option value="${w.id}">${w.name}</option>`).join('');
        
        const targetWarehouseId = prompt(`Pilih tujuan transfer:\n\n${warehouses.map(w => `${w.id}. ${w.name}`).join('\n')}\n\nMasukkan ID tujuan:`, warehouses[0]?.id);
        
        if (!targetWarehouseId || !warehouses.find(w => w.id == targetWarehouseId)) return;
        
        // Create two transactions: out from source, in to target
        const outTransaction = {
            type: 'out',
            productId: productId,
            quantity: parseInt(quantity),
            warehouseId: fromWarehouseId,
            reference: 'TRANSFER-OUT-' + new Date().getTime(),
            notes: `Transfer ke Gudang ${targetWarehouseId}`,
            userId: 1
        };
        
        const inTransaction = {
            type: 'in',
            productId: productId,
            quantity: parseInt(quantity),
            warehouseId: parseInt(targetWarehouseId),
            reference: 'TRANSFER-IN-' + new Date().getTime(),
            notes: `Transfer dari Gudang ${fromWarehouseId}`,
            userId: 1
        };
        
        StockFlowData.addTransaction(outTransaction);
        StockFlowData.addTransaction(inTransaction);
        
        stockFlowApp.showAlert(`Berhasil transfer ${quantity} unit ke Gudang ${targetWarehouseId}`, 'success');
        
        // Refresh view
        if (this.selectedWarehouse) {
            this.showWarehouseDetails(this.selectedWarehouse.id);
        }
    }
    
    exportInventoryReport() {
        const warehouses = StockFlowData.warehouses;
        let csv = 'Lokasi,Total Produk,Nilai Inventaris,Stok Rendah,Kapasitas\n';
        
        warehouses.forEach(warehouse => {
            const products = StockFlowData.getProducts().filter(p => p.warehouseId == warehouse.id);
            const totalValue = products.reduce((sum, p) => sum + (p.stock * p.buyPrice), 0);
            const lowStock = products.filter(p => p.stock <= p.minStock).length;
            
            csv += `"${warehouse.name}",${products.length},${totalValue},${lowStock},${warehouse.capacity}\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inventory_report_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        stockFlowApp.showAlert('Laporan inventaris berhasil diekspor', 'success');
    }
    
    setupAutoRefresh() {
        // Auto-refresh inventory data every 60 seconds
        setInterval(() => {
            if (stockFlowApp.currentPage === 'inventory') {
                this.refreshInventoryData();
            }
        }, 60000);
    }
    
    refreshInventoryData() {
        // Update warehouse summary
        const warehouses = StockFlowData.warehouses;
        const summaryContainer = document.getElementById('warehouseSummary');
        if (summaryContainer) {
            summaryContainer.innerHTML = warehouses.map(warehouse => this.renderWarehouseCard(warehouse)).join('');
        }
        
        // Update today's transactions
        const transactions = StockFlowData.getRecentTransactions(20);
        const transactionsContainer = document.getElementById('todayTransactions');
        if (transactionsContainer) {
            transactionsContainer.innerHTML = transactions.map(transaction => this.renderTransactionRow(transaction)).join('');
        }
        
        console.log('Inventory data refreshed');
    }
}

// Initialize inventory manager
window.inventoryManager = new InventoryManager();
