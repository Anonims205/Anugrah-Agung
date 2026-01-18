// Reports Generator
function generateStockReport() {
    const products = StockFlowData.getProducts();
    const inventoryValue = StockFlowData.getInventoryValue();
    const stockStatus = StockFlowData.getStockStatus();
    
    const report = {
        timestamp: new Date().toISOString(),
        summary: {
            totalProducts: products.length,
            inventoryValue: inventoryValue,
            criticalStock: stockStatus.critical,
            lowStock: stockStatus.low,
            overstock: stockStatus.overstock
        },
        products: products.map(p => ({
            name: p.name,
            sku: p.sku,
            stock: p.stock,
            minStock: p.minStock,
            maxStock: p.maxStock,
            status: p.stock <= p.minStock * 0.3 ? 'CRITICAL' : 
                   p.stock <= p.minStock ? 'LOW' : 
                   p.stock >= p.maxStock * 0.9 ? 'HIGH' : 'NORMAL',
            value: p.stock * p.buyPrice
        }))
    };
    
    downloadJSON(report, 'stock_report');
}

function generateAnalysisReport() {
    const abcAnalysis = StockFlowData.getABCAnalysis();
    const deadStock = window.analysisManager?.getDeadStock() || [];
    
    const report = {
        timestamp: new Date().toISOString(),
        abcAnalysis: {
            classA: abcAnalysis.classA,
            classB: abcAnalysis.classB,
            classC: abcAnalysis.classC
        },
        deadStock: {
            count: deadStock.length,
            totalValue: deadStock.reduce((sum, item) => sum + item.value, 0),
            items: deadStock.map(item => ({
                product: item.product.name,
                sku: item.product.sku,
                stock: item.product.stock,
                daysInactive: item.daysInactive,
                value: item.value
            }))
        }
    };
    
    downloadJSON(report, 'analysis_report');
}

function generateTransactionReport() {
    const transactions = StockFlowData.getTransactions(100);
    
    const report = {
        timestamp: new Date().toISOString(),
        period: 'Last 100 transactions',
        summary: {
            total: transactions.length,
            in: transactions.filter(t => t.type === 'in').length,
            out: transactions.filter(t => t.type === 'out').length,
            adjust: transactions.filter(t => t.type === 'adjust').length,
            return: transactions.filter(t => t.type === 'return').length
        },
        transactions: transactions.map(t => ({
            date: t.date,
            type: t.type,
            productId: t.productId,
            quantity: t.quantity,
            reference: t.reference,
            notes: t.notes
        }))
    };
    
    downloadJSON(report, 'transaction_report');
}

function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    stockFlowApp.showAlert(`Laporan ${filename} berhasil di-generate`, 'success');
}

// System functions
function backupData() {
    const data = localStorage.getItem('stockflow_data');
    if (!data) {
        stockFlowApp.showAlert('Tidak ada data untuk di-backup', 'warning');
        return;
    }
    
    const blob = new Blob([data], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stockflow_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    stockFlowApp.showAlert('Backup data berhasil', 'success');
}

function restoreData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(event) {
            try {
                const data = JSON.parse(event.target.result);
                localStorage.setItem('stockflow_data', JSON.stringify(data));
                stockFlowApp.showAlert('Data berhasil di-restore. Silakan refresh halaman.', 'success');
                setTimeout(() => location.reload(), 2000);
            } catch (error) {
                stockFlowApp.showAlert('File backup tidak valid', 'danger');
            }
        };
        
        reader.readAsText(file);
    };
    
    input.click();
}

function resetData() {
    if (confirm('Reset semua data ke default? Aksi ini tidak dapat dibatalkan.')) {
        localStorage.removeItem('stockflow_data');
        stockFlowApp.showAlert('Data berhasil di-reset. Silakan refresh halaman.', 'success');
        setTimeout(() => location.reload(), 2000);
    }
}
