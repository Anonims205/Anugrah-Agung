// Data storage and management
const StockFlowData = {
    // Initialize with sample data
    products: [],
    transactions: [],
    categories: [],
    suppliers: [],
    warehouses: [],
    
    // Initialize sample data
    initSampleData() {
        // Categories
        this.categories = [
            { id: 1, name: 'Elektronik', subcategories: ['Gadget', 'Komputer', 'Aksesoris'] },
            { id: 2, name: 'Fashion', subcategories: ['Pria', 'Wanita', 'Anak'] },
            { id: 3, name: 'Kesehatan', subcategories: ['Suplemen', 'Obat', 'Alat Kesehatan'] },
            { id: 4, name: 'Makanan & Minuman', subcategories: ['Makanan', 'Minuman', 'Snack'] },
            { id: 5, name: 'ATK', subcategories: ['Kertas', 'Alat Tulis', 'Furnitur'] }
        ];
        
        // Suppliers
        this.suppliers = [
            { id: 1, name: 'PT. Elektronik Maju', contact: '021-123456', email: 'contact@elektronikmaju.com' },
            { id: 2, name: 'CV. Fashion Trend', contact: '021-234567', email: 'info@fashiontrend.co.id' },
            { id: 3, name: 'PT. Sehat Selalu', contact: '021-345678', email: 'sales@sehatselalu.com' }
        ];
        
        // Warehouses
        this.warehouses = [
            { id: 1, name: 'Gudang A', location: 'Jakarta Pusat', capacity: 1000 },
            { id: 2, name: 'Gudang B', location: 'Jakarta Selatan', capacity: 1500 },
            { id: 3, name: 'Toko Utama', location: 'Jakarta Barat', capacity: 300 },
            { id: 4, name: 'Toko Cabang', location: 'Tangerang', capacity: 200 }
        ];
        
        // Sample products
        this.products = [
            {
                id: 1,
                name: 'Smartphone X10',
                sku: 'SKU-E001',
                category: 'Elektronik > Gadget',
                description: 'Smartphone flagship dengan kamera 108MP',
                stock: 5,
                minStock: 10,
                maxStock: 100,
                buyPrice: 2000000,
                sellPrice: 2500000,
                supplierId: 1,
                warehouseId: 1,
                abcClass: 'A',
                lastUpdated: new Date(),
                image: null
            },
            {
                id: 2,
                name: 'Laptop Pro 15',
                sku: 'SKU-E002',
                category: 'Elektronik > Komputer',
                description: 'Laptop bisnis untuk profesional',
                stock: 42,
                minStock: 20,
                maxStock: 80,
                buyPrice: 7500000,
                sellPrice: 8500000,
                supplierId: 1,
                warehouseId: 1,
                abcClass: 'A',
                lastUpdated: new Date(),
                image: null
            },
            {
                id: 3,
                name: 'Kemeja Casual',
                sku: 'SKU-F001',
                category: 'Fashion > Pria > Atasan',
                description: 'Kemeja pria casual bahan katun',
                stock: 12,
                minStock: 15,
                maxStock: 150,
                buyPrice: 350000,
                sellPrice: 400000,
                supplierId: 2,
                warehouseId: 2,
                abcClass: 'B',
                lastUpdated: new Date(),
                image: null
            }
        ];
        
        // Sample transactions
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        this.transactions = [
            {
                id: 1,
                type: 'in',
                productId: 1,
                quantity: 50,
                warehouseId: 1,
                reference: 'PO-2023-001',
                notes: 'Pembelian dari supplier',
                date: today,
                userId: 1
            },
            {
                id: 2,
                type: 'out',
                productId: 2,
                quantity: 3,
                warehouseId: 3,
                reference: 'INV-2023-08765',
                notes: 'Penjualan ke customer',
                date: today,
                userId: 2
            },
            {
                id: 3,
                type: 'adjust',
                productId: 3,
                quantity: 5,
                warehouseId: 2,
                reference: 'ADJ-2023-001',
                notes: 'Penyesuaian stok fisik',
                date: yesterday,
                userId: 1
            }
        ];
        
        this.saveToLocalStorage();
    },
    
    // Load from localStorage
    loadFromLocalStorage() {
        const savedData = localStorage.getItem('stockflow_data');
        if (savedData) {
            const data = JSON.parse(savedData);
            Object.assign(this, data);
            
            // Convert date strings back to Date objects
            this.products.forEach(p => p.lastUpdated = new Date(p.lastUpdated));
            this.transactions.forEach(t => t.date = new Date(t.date));
        } else {
            this.initSampleData();
        }
    },
    
    // Save to localStorage
    saveToLocalStorage() {
        localStorage.setItem('stockflow_data', JSON.stringify({
            products: this.products,
            transactions: this.transactions,
            categories: this.categories,
            suppliers: this.suppliers,
            warehouses: this.warehouses
        }));
    },
    
    // Product methods
    getProducts() {
        return this.products;
    },
    
    getProductById(id) {
        return this.products.find(p => p.id == id);
    },
    
    addProduct(product) {
        const newId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
        product.id = newId;
        product.lastUpdated = new Date();
        this.products.push(product);
        this.saveToLocalStorage();
        return product;
    },
    
    updateProduct(id, updates) {
        const index = this.products.findIndex(p => p.id == id);
        if (index !== -1) {
            updates.lastUpdated = new Date();
            this.products[index] = { ...this.products[index], ...updates };
            this.saveToLocalStorage();
            return true;
        }
        return false;
    },
    
    deleteProduct(id) {
        const index = this.products.findIndex(p => p.id == id);
        if (index !== -1) {
            this.products.splice(index, 1);
            this.saveToLocalStorage();
            return true;
        }
        return false;
    },
    
    // Transaction methods
    addTransaction(transaction) {
        const newId = this.transactions.length > 0 ? Math.max(...this.transactions.map(t => t.id)) + 1 : 1;
        transaction.id = newId;
        transaction.date = new Date();
        
        // Update product stock
        const product = this.getProductById(transaction.productId);
        if (product) {
            if (transaction.type === 'in') {
                product.stock += transaction.quantity;
            } else if (transaction.type === 'out') {
                product.stock -= transaction.quantity;
            } else if (transaction.type === 'adjust') {
                product.stock += transaction.quantity;
            }
            product.lastUpdated = new Date();
        }
        
        this.transactions.unshift(transaction);
        this.saveToLocalStorage();
        return transaction;
    },
    
    getTransactions(limit = 50) {
        return this.transactions.slice(0, limit);
    },
    
    // Analytics methods
    getStockStatus() {
        const critical = this.products.filter(p => p.stock <= p.minStock * 0.3).length;
        const low = this.products.filter(p => p.stock <= p.minStock && p.stock > p.minStock * 0.3).length;
        const overstock = this.products.filter(p => p.stock >= p.maxStock * 0.9).length;
        const normal = this.products.filter(p => p.stock > p.minStock && p.stock < p.maxStock * 0.9).length;
        
        return { critical, low, overstock, normal };
    },
    
    getInventoryValue() {
        return this.products.reduce((total, product) => {
            return total + (product.stock * product.buyPrice);
        }, 0);
    },
    
    getDashboardMetrics() {
        const totalProducts = this.products.length;
        const inventoryValue = this.getInventoryValue();
        const stockStatus = this.getStockStatus();
        
        // Calculate turnover ratio (simplified)
        const totalSales = this.transactions
            .filter(t => t.type === 'out')
            .reduce((sum, t) => {
                const product = this.getProductById(t.productId);
                return sum + (product ? t.quantity * product.sellPrice : 0);
            }, 0);
        
        const avgInventory = inventoryValue / 2;
        const turnoverRatio = avgInventory > 0 ? totalSales / avgInventory : 0;
        
        // Dead stock (no sales in last 90 days)
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
        
        const deadStock = this.products.filter(product => {
            const lastSale = this.transactions
                .filter(t => t.productId === product.id && t.type === 'out')
                .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
            
            return !lastSale || new Date(lastSale.date) < ninetyDaysAgo;
        }).length;
        
        return {
            totalProducts,
            inventoryValue,
            turnoverRatio: turnoverRatio.toFixed(1),
            deadStock,
            stockAlerts: stockStatus.critical + stockStatus.low
        };
    },
    
    // Search products
    searchProducts(query) {
        const lowerQuery = query.toLowerCase();
        return this.products.filter(product => 
            product.name.toLowerCase().includes(lowerQuery) ||
            product.sku.toLowerCase().includes(lowerQuery) ||
            product.category.toLowerCase().includes(lowerQuery)
        );
    },
    
    // Get products by category
    getProductsByCategory(category) {
        return this.products.filter(p => p.category.includes(category));
    },
    
    // Get ABC analysis
    getABCAnalysis() {
        const productsWithValue = this.products.map(p => ({
            ...p,
            totalValue: p.stock * p.sellPrice
        })).sort((a, b) => b.totalValue - a.totalValue);
        
        const totalValue = productsWithValue.reduce((sum, p) => sum + p.totalValue, 0);
        let cumulativeValue = 0;
        
        const abcProducts = productsWithValue.map(p => {
            cumulativeValue += p.totalValue;
            const percentage = (cumulativeValue / totalValue) * 100;
            
            let abcClass = 'C';
            if (percentage <= 80) abcClass = 'A';
            else if (percentage <= 95) abcClass = 'B';
            
            return { ...p, abcClass };
        });
        
        const classA = abcProducts.filter(p => p.abcClass === 'A');
        const classB = abcProducts.filter(p => p.abcClass === 'B');
        const classC = abcProducts.filter(p => p.abcClass === 'C');
        
        return {
            classA: {
                count: classA.length,
                percentage: Math.round((classA.length / abcProducts.length) * 100),
                value: classA.reduce((sum, p) => sum + p.totalValue, 0)
            },
            classB: {
                count: classB.length,
                percentage: Math.round((classB.length / abcProducts.length) * 100),
                value: classB.reduce((sum, p) => sum + p.totalValue, 0)
            },
            classC: {
                count: classC.length,
                percentage: Math.round((classC.length / abcProducts.length) * 100),
                value: classC.reduce((sum, p) => sum + p.totalValue, 0)
            },
            products: abcProducts
        };
    },
    
    // Get recent transactions
    getRecentTransactions(limit = 10) {
        return this.transactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, limit);
    },
    
    // Get top selling products
    getTopProducts(limit = 5) {
        const salesByProduct = {};
        
        this.transactions
            .filter(t => t.type === 'out')
            .forEach(t => {
                if (!salesByProduct[t.productId]) {
                    salesByProduct[t.productId] = 0;
                }
                salesByProduct[t.productId] += t.quantity;
            });
        
        return Object.entries(salesByProduct)
            .map(([productId, quantity]) => {
                const product = this.getProductById(productId);
                return {
                    product,
                    quantity,
                    revenue: quantity * (product ? product.sellPrice : 0)
                };
            })
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, limit);
    }
};
