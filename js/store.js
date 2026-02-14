/* ============================================
   VANESSA MORELLI — Store (localStorage CRUD)
   ============================================ */

const Store = {
    // ─── Products ───
    getProducts() {
        return JSON.parse(localStorage.getItem(DATA_KEYS.PRODUCTS) || '[]');
    },

    getProduct(id) {
        return this.getProducts().find(p => p.id === id);
    },

    getActiveProducts() {
        return this.getProducts().filter(p => p.status === 'active');
    },

    getFeaturedProducts() {
        return this.getActiveProducts().filter(p => p.featured);
    },

    getProductsByCategory(category) {
        if (!category || category === 'Todos') return this.getActiveProducts();
        return this.getActiveProducts().filter(p => p.category === category);
    },

    addProduct(product) {
        const products = this.getProducts();
        product.id = 'prod_' + Date.now();
        product.createdAt = new Date().toISOString().split('T')[0];
        products.push(product);
        localStorage.setItem(DATA_KEYS.PRODUCTS, JSON.stringify(products));
        return product;
    },

    updateProduct(id, updates) {
        const products = this.getProducts();
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = { ...products[index], ...updates };
            localStorage.setItem(DATA_KEYS.PRODUCTS, JSON.stringify(products));
            return products[index];
        }
        return null;
    },

    deleteProduct(id) {
        const products = this.getProducts().filter(p => p.id !== id);
        localStorage.setItem(DATA_KEYS.PRODUCTS, JSON.stringify(products));
    },

    updateStock(id, quantity) {
        const product = this.getProduct(id);
        if (product) {
            this.updateProduct(id, { stock: Math.max(0, quantity) });
        }
    },

    getLowStockProducts(threshold = 3) {
        return this.getActiveProducts().filter(p => p.stock <= threshold && p.stock > 0);
    },

    getOutOfStockProducts() {
        return this.getActiveProducts().filter(p => p.stock === 0);
    },

    // ─── Sales ───
    getSales() {
        return JSON.parse(localStorage.getItem(DATA_KEYS.SALES) || '[]');
    },

    addSale(sale) {
        const sales = this.getSales();
        sale.id = 'sale_' + Date.now();
        sale.date = new Date().toISOString().split('T')[0];
        sale.channel = 'whatsapp';
        sales.push(sale);
        localStorage.setItem(DATA_KEYS.SALES, JSON.stringify(sales));
        return sale;
    },

    updateSaleStatus(id, status) {
        const sales = this.getSales();
        const index = sales.findIndex(s => s.id === id);
        if (index !== -1) {
            sales[index].status = status;
            localStorage.setItem(DATA_KEYS.SALES, JSON.stringify(sales));
        }
    },

    getTotalRevenue() {
        return this.getSales()
            .filter(s => s.status === 'completed')
            .reduce((sum, s) => sum + s.totalPrice, 0);
    },

    getMonthSales() {
        const now = new Date();
        const month = now.getMonth();
        const year = now.getFullYear();
        return this.getSales().filter(s => {
            const d = new Date(s.date);
            return d.getMonth() === month && d.getFullYear() === year;
        });
    },

    // ─── Config ───
    getConfig() {
        return JSON.parse(localStorage.getItem(DATA_KEYS.CONFIG) || '{}');
    },

    updateConfig(updates) {
        const config = this.getConfig();
        Object.assign(config, updates);
        localStorage.setItem(DATA_KEYS.CONFIG, JSON.stringify(config));
        return config;
    },

    getWhatsAppNumber() {
        return this.getConfig().whatsappNumber || '';
    },

    setWhatsAppNumber(number) {
        this.updateConfig({ whatsappNumber: number });
    },

    // ─── Categories ───
    getCategories() {
        return JSON.parse(localStorage.getItem(DATA_KEYS.CATEGORIES) || '[]');
    },

    // ─── Stats ───
    getStats() {
        const products = this.getActiveProducts();
        const sales = this.getSales();
        const monthSales = this.getMonthSales();

        return {
            totalProducts: products.length,
            totalSales: sales.length,
            totalRevenue: this.getTotalRevenue(),
            monthSalesCount: monthSales.length,
            monthRevenue: monthSales.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.totalPrice, 0),
            lowStockCount: this.getLowStockProducts().length,
            outOfStockCount: this.getOutOfStockProducts().length,
            pendingSales: sales.filter(s => s.status === 'pending').length
        };
    }
};
