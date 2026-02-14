/* ============================================
   VANESSA MORELLI — E-commerce Module
   ============================================ */

const Ecommerce = {
    currentFilter: 'Todos',
    currentProduct: null,

    init() {
        this.renderProducts();
        this.renderFilters();
        this.bindEvents();
    },

    // ─── Render Products Grid ───
    renderProducts(filter) {
        const container = document.getElementById('productsGrid');
        if (!container) return;

        const category = filter || this.currentFilter;
        const products = Store.getProductsByCategory(category);

        if (products.length === 0) {
            container.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding: var(--space-4xl) 0;">
          <p class="text-accent" style="font-size: var(--fs-h3); margin-bottom: var(--space-md);">Nenhum produto encontrado</p>
          <p style="color: var(--color-gray-500);">Explore outras categorias para encontrar peças exclusivas.</p>
        </div>
      `;
            return;
        }

        container.innerHTML = products.map((product, i) => `
      <div class="product-card reveal stagger-${(i % 4) + 1}" data-product-id="${product.id}" onclick="Ecommerce.openProductDetail('${product.id}')">
        <div class="product-card__image-wrap">
          <img src="${product.image}" alt="${product.name}" class="product-card__image" loading="lazy">
          ${product.badge ? `<span class="product-card__badge ${product.stock <= 2 ? 'product-card__badge--limited' : ''}">${product.badge}</span>` : ''}
          ${product.stock === 0 ? '<span class="product-card__badge product-card__badge--out">Esgotado</span>' : ''}
          <button class="product-card__quick-view btn btn--ghost btn--sm" onclick="event.stopPropagation(); Ecommerce.openProductDetail('${product.id}')">
            Ver Detalhes
          </button>
        </div>
        <div class="product-card__info">
          <div class="product-card__category">${product.category}</div>
          <h3 class="product-card__name">${product.name}</h3>
          <div class="product-card__price">${Ecommerce.formatPrice(product.price)}</div>
        </div>
      </div>
    `).join('');

        // Re-trigger reveal animations
        setTimeout(() => initRevealAnimations(), 100);
    },

    // ─── Render Filters ───
    renderFilters() {
        const container = document.getElementById('shopFilters');
        if (!container) return;

        const categories = ['Todos', ...Store.getCategories()];

        container.innerHTML = categories.map(cat => `
      <button class="filter-btn ${cat === this.currentFilter ? 'active' : ''}" onclick="Ecommerce.filterByCategory('${cat}')">
        ${cat}
      </button>
    `).join('');
    },

    // ─── Filter ───
    filterByCategory(category) {
        this.currentFilter = category;
        this.renderProducts(category);
        this.renderFilters();
    },

    // ─── Product Detail Modal ───
    openProductDetail(id) {
        const product = Store.getProduct(id);
        if (!product) return;

        this.currentProduct = product;
        const modal = document.getElementById('productModal');
        if (!modal) return;

        let stockStatus = '';
        let stockClass = '';
        if (product.stock === 0) {
            stockStatus = 'Indisponível no momento';
            stockClass = 'modal__stock--out';
        } else if (product.stock <= 3) {
            stockStatus = `Apenas ${product.stock} ${product.stock === 1 ? 'unidade disponível' : 'unidades disponíveis'}`;
            stockClass = 'modal__stock--low';
        } else {
            stockStatus = 'Disponível em estoque';
            stockClass = '';
        }

        modal.querySelector('.modal__content').innerHTML = `
      <div class="modal__image">
        <img src="${product.image}" alt="${product.name}">
      </div>
      <div class="modal__details">
        <div class="modal__category">${product.category}</div>
        <h2 class="modal__title">${product.name}</h2>
        <div class="modal__price">${Ecommerce.formatPrice(product.price)}</div>
        <p class="modal__description">${product.description}</p>
        <div class="modal__stock ${stockClass}">
          <span class="modal__stock-dot"></span>
          ${stockStatus}
        </div>
        ${product.stock > 0 ? `
          <button class="modal__whatsapp" onclick="Ecommerce.buyViaWhatsApp('${product.id}')">
            <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" fill="currentColor"/></svg>
            Solicitar via WhatsApp
          </button>
        ` : `
          <button class="btn btn--outline btn--lg" disabled style="width:100%; opacity:0.5; cursor:not-allowed;">
            Produto Indisponível
          </button>
        `}
      </div>
    `;

        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    },

    closeProductDetail() {
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }
        this.currentProduct = null;
    },

    // ─── WhatsApp Integration ───
    buyViaWhatsApp(productId) {
        const product = Store.getProduct(productId);
        if (!product) return;

        const whatsappNumber = Store.getWhatsAppNumber();

        if (!whatsappNumber) {
            this.showWhatsAppConfig();
            return;
        }

        // Register as a pending sale
        Store.addSale({
            productId: product.id,
            productName: product.name,
            customerName: 'Cliente via Site',
            quantity: 1,
            totalPrice: product.price,
            status: 'pending'
        });

        const message = encodeURIComponent(
            `Olá! Tenho interesse no produto:\n\n` +
            `🏷️ *${product.name}*\n` +
            `📂 Categoria: ${product.category}\n` +
            `💰 Valor: ${Ecommerce.formatPrice(product.price)}\n\n` +
            `Gostaria de mais informações e dar continuidade à compra.`
        );

        const cleanNumber = whatsappNumber.replace(/\D/g, '');
        const url = `https://wa.me/${cleanNumber}?text=${message}`;

        window.open(url, '_blank');
        this.closeProductDetail();
        showToast('Redirecionando para o WhatsApp...', 'success');
    },

    // ─── WhatsApp Config ───
    showWhatsAppConfig() {
        const modal = document.getElementById('whatsappConfigModal');
        if (modal) {
            const input = modal.querySelector('#whatsappNumberInput');
            if (input) {
                input.value = Store.getWhatsAppNumber();
            }
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    },

    closeWhatsAppConfig() {
        const modal = document.getElementById('whatsappConfigModal');
        if (modal) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }
    },

    saveWhatsAppNumber() {
        const input = document.getElementById('whatsappNumberInput');
        if (input && input.value.trim()) {
            Store.setWhatsAppNumber(input.value.trim());
            this.closeWhatsAppConfig();
            showToast('Número do WhatsApp salvo com sucesso!', 'success');

            // If there was a pending product, retry
            if (this.currentProduct) {
                setTimeout(() => this.buyViaWhatsApp(this.currentProduct.id), 300);
            }
        } else {
            showToast('Por favor, insira um número válido.', 'error');
        }
    },

    // ─── Render Showcase (Collections) ───
    renderShowcase() {
        const container = document.getElementById('collectionsGrid');
        if (!container) return;

        const featured = Store.getFeaturedProducts().slice(0, 6);

        container.innerHTML = featured.map((product, i) => `
      <div class="collection-card reveal stagger-${(i % 3) + 1}" onclick="Ecommerce.openProductDetail('${product.id}')">
        <img src="${product.image}" alt="${product.name}" class="collection-card__image">
        <div class="collection-card__overlay">
          <span class="collection-card__label">${product.category}</span>
          <h3 class="collection-card__title">${product.name}</h3>
          <span class="collection-card__cta">Explorar →</span>
        </div>
      </div>
    `).join('');

        setTimeout(() => initRevealAnimations(), 100);
    },

    // ─── Utilities ───
    formatPrice(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    },

    bindEvents() {
        // Close modal on overlay click
        const productModal = document.getElementById('productModal');
        if (productModal) {
            productModal.addEventListener('click', (e) => {
                if (e.target === productModal) this.closeProductDetail();
            });
        }

        const whatsappModal = document.getElementById('whatsappConfigModal');
        if (whatsappModal) {
            whatsappModal.addEventListener('click', (e) => {
                if (e.target === whatsappModal) this.closeWhatsAppConfig();
            });
        }

        // Close modals with Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeProductDetail();
                this.closeWhatsAppConfig();
            }
        });
    }
};
