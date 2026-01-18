// Tambahkan method-method ini di dalam class StockFlowApp

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

async loadInventory() {
    const products = StockFlowData.getProducts();
    const warehouses = StockFlowData.warehouses;
    
    // Group products by warehouse
    const warehouseGroups = {};
    warehouses.forEach(warehouse => {
        warehouseGroups[warehouse.id] = {
            warehouse: warehouse,
            products:
