/* ============================================
   VANESSA MORELLI — Admin Panel
   ============================================ */

const Admin = {
    currentSection: 'dashboard',

    init() {
        initializeData();
        this.bindEvents();
        this.navigate('dashboard');
        this.loadWhatsAppConfig();
        this.initMobileSidebar();
    },

    // ─── Navigation ───
    navigate(section) {
        this.currentSection = section;

        // Update active link
        document.querySelectorAll('.admin-sidebar__link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.section === section) link.classList.add('active');
        });

        // Render section
        switch (section) {
            case 'dashboard': this.renderDashboard(); break;
            case 'products': this.renderProducts(); break;
            case 'stock': this.renderStock(); break;
            case 'sales': this.renderSales(); break;
            case 'settings': this.renderSettings(); break;
        }

        // Close mobile sidebar
        this.closeMobileSidebar();
    },

    // ─── Dashboard ───
    renderDashboard() {
        const stats = Store.getStats();
        const main = document.getElementById('adminContent');

        main.innerHTML = `
      <div class="admin-header">
        <h1 class="admin-header__title">Dashboard</h1>
        <div class="admin-header__actions">
          <button class="btn btn--primary btn--sm" onclick="Admin.navigate('products')">+ Novo Produto</button>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="dashboard-card">
          <div class="dashboard-card__icon dashboard-card__icon--gold">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
          </div>
          <div class="dashboard-card__label">Total de Produtos</div>
          <div class="dashboard-card__value">${stats.totalProducts}</div>
        </div>
        <div class="dashboard-card">
          <div class="dashboard-card__icon dashboard-card__icon--navy">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
          </div>
          <div class="dashboard-card__label">Vendas Totais</div>
          <div class="dashboard-card__value">${stats.totalSales}</div>
        </div>
        <div class="dashboard-card">
          <div class="dashboard-card__icon dashboard-card__icon--success">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>
          </div>
          <div class="dashboard-card__label">Receita Total</div>
          <div class="dashboard-card__value">${Admin.formatPrice(stats.totalRevenue)}</div>
        </div>
        <div class="dashboard-card">
          <div class="dashboard-card__icon dashboard-card__icon--danger">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          </div>
          <div class="dashboard-card__label">Estoque Baixo</div>
          <div class="dashboard-card__value">${stats.lowStockCount + stats.outOfStockCount}</div>
          ${stats.outOfStockCount > 0 ? `<div class="dashboard-card__change dashboard-card__change--negative">${stats.outOfStockCount} esgotado(s)</div>` : ''}
        </div>
      </div>

      <!-- Recent Sales -->
      <div class="admin-table-wrapper">
        <div class="admin-table-header">
          <h3 class="admin-table-header__title">Vendas Recentes</h3>
          <button class="btn btn--outline btn--sm" onclick="Admin.navigate('sales')">Ver Todas</button>
        </div>
        <table class="admin-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Cliente</th>
              <th>Valor</th>
              <th>Status</th>
              <th>Data</th>
            </tr>
          </thead>
          <tbody>
            ${Store.getSales().slice(-5).reverse().map(sale => `
              <tr>
                <td><strong>${sale.productName}</strong></td>
                <td>${sale.customerName}</td>
                <td>${Admin.formatPrice(sale.totalPrice)}</td>
                <td>
                  <span class="status-badge status-badge--${sale.status}">
                    <span class="status-badge__dot"></span>
                    ${sale.status === 'completed' ? 'Concluída' : 'Pendente'}
                  </span>
                </td>
                <td>${Admin.formatDate(sale.date)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    },

    // ─── Products ───
    renderProducts() {
        const products = Store.getProducts();
        const main = document.getElementById('adminContent');

        main.innerHTML = `
      <div class="admin-header">
        <h1 class="admin-header__title">Produtos</h1>
        <div class="admin-header__actions">
          <button class="btn btn--primary btn--sm" onclick="Admin.showProductForm()">+ Novo Produto</button>
        </div>
      </div>

      <div class="admin-table-wrapper">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(product => `
              <tr>
                <td>
                  <div class="admin-table__product-cell">
                    <img src="${product.image}" alt="${product.name}" class="admin-table__product-img">
                    <div>
                      <div class="admin-table__product-name">${product.name}</div>
                      ${product.badge ? `<span style="font-size: var(--fs-xs); color: var(--color-gold);">${product.badge}</span>` : ''}
                    </div>
                  </div>
                </td>
                <td>${product.category}</td>
                <td>${Admin.formatPrice(product.price)}</td>
                <td>
                  <span class="status-badge ${product.stock === 0 ? 'status-badge--out' : product.stock <= 3 ? 'status-badge--low' : 'status-badge--active'}">
                    <span class="status-badge__dot"></span>
                    ${product.stock} un.
                  </span>
                </td>
                <td>
                  <span class="status-badge status-badge--${product.status === 'active' ? 'active' : 'out'}">
                    <span class="status-badge__dot"></span>
                    ${product.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td>
                  <div class="admin-table__actions">
                    <button class="admin-table__action-btn" onclick="Admin.editProduct('${product.id}')">Editar</button>
                    <button class="admin-table__action-btn admin-table__action-btn--danger" onclick="Admin.deleteProduct('${product.id}')">Excluir</button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    },

    showProductForm(productId) {
        const product = productId ? Store.getProduct(productId) : null;
        const categories = Store.getCategories();
        const modal = document.getElementById('adminModal');

        modal.querySelector('.modal__content').innerHTML = `
      <div class="modal__details" style="grid-column: 1/-1;">
        <h3 class="admin-modal__title">${product ? 'Editar Produto' : 'Novo Produto'}</h3>
        <form class="admin-form admin-form--two-cols" onsubmit="event.preventDefault(); Admin.saveProduct('${productId || ''}');">
          <div class="admin-form__group">
            <label class="admin-form__label" for="prodName">Nome</label>
            <input class="admin-form__input" type="text" id="prodName" value="${product ? product.name : ''}" required>
          </div>
          <div class="admin-form__group">
            <label class="admin-form__label" for="prodCategory">Categoria</label>
            <select class="admin-form__select" id="prodCategory">
              ${categories.map(c => `<option value="${c}" ${product && product.category === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
          </div>
          <div class="admin-form__group">
            <label class="admin-form__label" for="prodPrice">Preço (R$)</label>
            <input class="admin-form__input" type="number" id="prodPrice" value="${product ? product.price : ''}" step="0.01" min="0" required>
          </div>
          <div class="admin-form__group">
            <label class="admin-form__label" for="prodStock">Estoque</label>
            <input class="admin-form__input" type="number" id="prodStock" value="${product ? product.stock : '0'}" min="0" required>
          </div>
          <div class="admin-form__group">
            <label class="admin-form__label" for="prodBadge">Badge (opcional)</label>
            <input class="admin-form__input" type="text" id="prodBadge" value="${product ? product.badge || '' : ''}" placeholder="Ex: Exclusivo, Edição Limitada">
          </div>
          <div class="admin-form__group">
            <label class="admin-form__label" for="prodFeatured">Destaque</label>
            <select class="admin-form__select" id="prodFeatured">
              <option value="false" ${product && !product.featured ? 'selected' : ''}>Não</option>
              <option value="true" ${product && product.featured ? 'selected' : ''}>Sim</option>
            </select>
          </div>
          <div class="admin-form__group admin-form__group--full">
            <label class="admin-form__label" for="prodDescription">Descrição</label>
            <textarea class="admin-form__textarea" id="prodDescription" required>${product ? product.description : ''}</textarea>
          </div>
          <div class="admin-form__actions">
            <button type="button" class="btn btn--outline btn--sm" onclick="Admin.closeModal()">Cancelar</button>
            <button type="submit" class="btn btn--primary btn--sm">${product ? 'Salvar Alterações' : 'Criar Produto'}</button>
          </div>
        </form>
      </div>
    `;

        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    },

    saveProduct(id) {
        const data = {
            name: document.getElementById('prodName').value,
            category: document.getElementById('prodCategory').value,
            price: parseFloat(document.getElementById('prodPrice').value),
            stock: parseInt(document.getElementById('prodStock').value),
            badge: document.getElementById('prodBadge').value,
            description: document.getElementById('prodDescription').value,
            featured: document.getElementById('prodFeatured').value === 'true',
            status: 'active',
            image: 'img/placeholder-product.svg'
        };

        if (id) {
            Store.updateProduct(id, data);
            Admin.showToast('Produto atualizado com sucesso!');
        } else {
            Store.addProduct(data);
            Admin.showToast('Produto criado com sucesso!');
        }

        this.closeModal();
        this.renderProducts();
    },

    editProduct(id) {
        this.showProductForm(id);
    },

    deleteProduct(id) {
        if (confirm('Tem certeza que deseja excluir este produto?')) {
            Store.deleteProduct(id);
            Admin.showToast('Produto excluído.');
            this.renderProducts();
        }
    },

    // ─── Stock ───
    renderStock() {
        const products = Store.getProducts();
        const main = document.getElementById('adminContent');

        main.innerHTML = `
      <div class="admin-header">
        <h1 class="admin-header__title">Controle de Estoque</h1>
      </div>

      <div class="admin-table-wrapper">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Estoque Atual</th>
              <th>Status</th>
              <th>Atualizar</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(product => `
              <tr>
                <td>
                  <div class="admin-table__product-cell">
                    <img src="${product.image}" alt="${product.name}" class="admin-table__product-img">
                    <span class="admin-table__product-name">${product.name}</span>
                  </div>
                </td>
                <td>${product.category}</td>
                <td>
                  <input type="number" id="stock-${product.id}" value="${product.stock}" min="0" 
                    style="width: 80px; padding: var(--space-xs); border: 1px solid var(--color-border); border-radius: var(--radius-md); text-align: center;">
                </td>
                <td>
                  <span class="status-badge ${product.stock === 0 ? 'status-badge--out' : product.stock <= 3 ? 'status-badge--low' : 'status-badge--active'}">
                    <span class="status-badge__dot"></span>
                    ${product.stock === 0 ? 'Esgotado' : product.stock <= 3 ? 'Baixo' : 'Normal'}
                  </span>
                </td>
                <td>
                  <button class="admin-table__action-btn" onclick="Admin.updateStockItem('${product.id}')">Salvar</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    },

    updateStockItem(id) {
        const input = document.getElementById(`stock-${id}`);
        if (input) {
            Store.updateStock(id, parseInt(input.value));
            Admin.showToast('Estoque atualizado!');
            this.renderStock();
        }
    },

    // ─── Sales ───
    renderSales() {
        const sales = Store.getSales();
        const main = document.getElementById('adminContent');

        const totalRevenue = sales.filter(s => s.status === 'completed').reduce((sum, s) => sum + s.totalPrice, 0);
        const pendingCount = sales.filter(s => s.status === 'pending').length;

        main.innerHTML = `
      <div class="admin-header">
        <h1 class="admin-header__title">Controle de Vendas</h1>
      </div>

      <div class="dashboard-grid" style="margin-bottom: var(--space-2xl);">
        <div class="dashboard-card">
          <div class="dashboard-card__label">Receita Confirmada</div>
          <div class="dashboard-card__value">${Admin.formatPrice(totalRevenue)}</div>
        </div>
        <div class="dashboard-card">
          <div class="dashboard-card__label">Vendas Pendentes</div>
          <div class="dashboard-card__value">${pendingCount}</div>
        </div>
        <div class="dashboard-card">
          <div class="dashboard-card__label">Total de Pedidos</div>
          <div class="dashboard-card__value">${sales.length}</div>
        </div>
      </div>

      <div class="admin-table-wrapper">
        <div class="admin-table-header">
          <h3 class="admin-table-header__title">Histórico de Vendas</h3>
        </div>
        <table class="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Produto</th>
              <th>Cliente</th>
              <th>Qtd</th>
              <th>Valor</th>
              <th>Canal</th>
              <th>Status</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            ${sales.slice().reverse().map(sale => `
              <tr>
                <td style="font-size: var(--fs-xs); color: var(--color-gray-400);">${sale.id.slice(-6)}</td>
                <td><strong>${sale.productName}</strong></td>
                <td>${sale.customerName}</td>
                <td>${sale.quantity}</td>
                <td>${Admin.formatPrice(sale.totalPrice)}</td>
                <td>
                  <span style="font-size: var(--fs-xs); text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-success);">
                    ${sale.channel === 'whatsapp' ? '📱 WhatsApp' : sale.channel}
                  </span>
                </td>
                <td>
                  <span class="status-badge status-badge--${sale.status}">
                    <span class="status-badge__dot"></span>
                    ${sale.status === 'completed' ? 'Concluída' : 'Pendente'}
                  </span>
                </td>
                <td>${Admin.formatDate(sale.date)}</td>
                <td>
                  <div class="admin-table__actions">
                    ${sale.status === 'pending' ? `
                      <button class="admin-table__action-btn" onclick="Admin.completeSale('${sale.id}')" title="Marcar como concluída">✓</button>
                    ` : ''}
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    },

    completeSale(id) {
        Store.updateSaleStatus(id, 'completed');
        Admin.showToast('Venda marcada como concluída!');
        this.renderSales();
    },

    // ─── Settings ───
    renderSettings() {
        const config = Store.getConfig();
        const main = document.getElementById('adminContent');

        main.innerHTML = `
      <div class="admin-header">
        <h1 class="admin-header__title">Configurações</h1>
      </div>

      <div class="admin-table-wrapper" style="padding: var(--space-2xl);">
        <h3 style="font-family: var(--font-heading); font-size: var(--fs-h4); margin-bottom: var(--space-xl);">WhatsApp para Vendas</h3>
        <form class="admin-form" onsubmit="event.preventDefault(); Admin.saveSettings();" style="max-width: 500px;">
          <div class="admin-form__group">
            <label class="admin-form__label" for="settingsWhatsApp">Número do WhatsApp</label>
            <input class="admin-form__input" type="tel" id="settingsWhatsApp" value="${config.whatsappNumber || ''}" placeholder="5511999999999">
            <span style="font-size: var(--fs-xs); color: var(--color-gray-400); margin-top: var(--space-2xs);">
              Inclua o código do país (55) + DDD + número. Ex: 5511999999999
            </span>
          </div>
          <div class="admin-form__group">
            <label class="admin-form__label" for="settingsStoreName">Nome da Loja</label>
            <input class="admin-form__input" type="text" id="settingsStoreName" value="${config.storeName || ''}">
          </div>
          <div class="admin-form__group">
            <label class="admin-form__label" for="settingsSubtitle">Subtitle</label>
            <input class="admin-form__input" type="text" id="settingsSubtitle" value="${config.storeSubtitle || ''}">
          </div>
          <button type="submit" class="btn btn--gold btn--sm">Salvar Configurações</button>
        </form>
      </div>

      <div class="admin-table-wrapper" style="padding: var(--space-2xl); margin-top: var(--space-xl);">
        <h3 style="font-family: var(--font-heading); font-size: var(--fs-h4); margin-bottom: var(--space-xl); color: var(--color-danger);">Zona de Perigo</h3>
        <p style="color: var(--color-gray-500); margin-bottom: var(--space-lg); font-size: var(--fs-small);">
          Estas ações são irreversíveis. Use com cuidado.
        </p>
        <button class="btn btn--danger btn--sm" onclick="Admin.resetAllData()">Resetar Todos os Dados</button>
      </div>
    `;
    },

    saveSettings() {
        const whatsapp = document.getElementById('settingsWhatsApp').value.trim();
        const storeName = document.getElementById('settingsStoreName').value.trim();
        const subtitle = document.getElementById('settingsSubtitle').value.trim();

        Store.updateConfig({
            whatsappNumber: whatsapp,
            storeName: storeName,
            storeSubtitle: subtitle
        });

        Admin.showToast('Configurações salvas com sucesso!');
    },

    resetAllData() {
        if (confirm('Tem certeza? Todos os dados serão apagados e os dados padrão serão restaurados.')) {
            localStorage.removeItem(DATA_KEYS.PRODUCTS);
            localStorage.removeItem(DATA_KEYS.SALES);
            localStorage.removeItem(DATA_KEYS.CONFIG);
            localStorage.removeItem(DATA_KEYS.CATEGORIES);
            initializeData();
            Admin.showToast('Dados restaurados para o padrão.');
            this.navigate('dashboard');
        }
    },

    // ─── WhatsApp Config ───
    loadWhatsAppConfig() {
        const number = Store.getWhatsAppNumber();
        const el = document.getElementById('adminWhatsappStatus');
        if (el) {
            if (number) {
                el.innerHTML = `<span style="color: var(--color-success);">✓</span> ${number}`;
            } else {
                el.innerHTML = `<span style="color: var(--color-warning);">Não configurado</span>`;
            }
        }
    },

    // ─── Mobile Sidebar ───
    initMobileSidebar() {
        const toggle = document.getElementById('adminMobileToggle');
        const sidebar = document.querySelector('.admin-sidebar');
        const overlay = document.querySelector('.admin-sidebar-overlay');

        if (toggle) {
            toggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
                if (overlay) overlay.classList.toggle('open');
            });
        }

        if (overlay) {
            overlay.addEventListener('click', () => this.closeMobileSidebar());
        }
    },

    closeMobileSidebar() {
        const sidebar = document.querySelector('.admin-sidebar');
        const overlay = document.querySelector('.admin-sidebar-overlay');
        if (sidebar) sidebar.classList.remove('open');
        if (overlay) overlay.classList.remove('open');
    },

    // ─── Modal ───
    closeModal() {
        const modal = document.getElementById('adminModal');
        if (modal) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }
    },

    // ─── Utilities ───
    formatPrice(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    },

    formatDate(dateStr) {
        const date = new Date(dateStr + 'T00:00:00');
        return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    },

    showToast(message, type = 'success') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast--${type}`;
        toast.textContent = message;
        container.appendChild(toast);

        requestAnimationFrame(() => toast.classList.add('show'));

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // ─── Events ───
    bindEvents() {
        // Close modal on overlay click
        const modal = document.getElementById('adminModal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModal();
            });
        }

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModal();
        });
    }
};

// ─── Initialize on DOM Ready ───
document.addEventListener('DOMContentLoaded', () => Admin.init());
