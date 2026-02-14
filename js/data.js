/* ============================================
   VANESSA MORELLI — Data Layer
   Initial fake data + localStorage management
   ============================================ */

const DATA_KEYS = {
  PRODUCTS: 'vm_products',
  SALES: 'vm_sales',
  CONFIG: 'vm_config',
  CATEGORIES: 'vm_categories'
};

const DEFAULT_CATEGORIES = [
  'Mobiliário',
  'Iluminação',
  'Decoração',
  'Têxteis',
  'Arte',
  'Acessórios'
];

const DEFAULT_PRODUCTS = [
  {
    id: 'prod_001',
    name: 'Poltrona Milão',
    category: 'Mobiliário',
    price: 12800,
    description: 'Poltrona artesanal em veludo italiano com estrutura em nogueira maciça. Design exclusivo inspirado nas linhas minimalistas do modernismo italiano.',
    stock: 5,
    status: 'active',
    featured: true,
    badge: 'Exclusivo',
    image: 'img/placeholder-product.svg',
    createdAt: '2026-01-15'
  },
  {
    id: 'prod_002',
    name: 'Luminária Cascata',
    category: 'Iluminação',
    price: 8500,
    description: 'Luminária pendente em latão escovado com difusores em cristal soprado artesanalmente. Peça de iluminação escultural para ambientes sofisticados.',
    stock: 3,
    status: 'active',
    featured: true,
    badge: 'Edição Limitada',
    image: 'img/placeholder-product.svg',
    createdAt: '2026-01-18'
  },
  {
    id: 'prod_003',
    name: 'Mesa de Centro Atenas',
    category: 'Mobiliário',
    price: 15200,
    description: 'Mesa de centro em mármore Carrara com base em aço inoxidável dourado. Uma peça central que combina a nobreza do mármore com o requinte do metal.',
    stock: 2,
    status: 'active',
    featured: true,
    badge: '',
    image: 'img/placeholder-product.svg',
    createdAt: '2026-01-20'
  },
  {
    id: 'prod_004',
    name: 'Vaso Murano',
    category: 'Decoração',
    price: 4200,
    description: 'Vaso decorativo em vidro de Murano soprado à mão. Cada peça é única, com nuances de azul e dourado que capturam a tradição do artesanato veneziano.',
    stock: 8,
    status: 'active',
    featured: false,
    badge: '',
    image: 'img/placeholder-product.svg',
    createdAt: '2026-01-22'
  },
  {
    id: 'prod_005',
    name: 'Almofada Heritage Seda',
    category: 'Têxteis',
    price: 1800,
    description: 'Almofada em seda natural com bordado artesanal geométrico. Enchimento em pluma de ganso para máximo conforto e sofisticação.',
    stock: 15,
    status: 'active',
    featured: false,
    badge: '',
    image: 'img/placeholder-product.svg',
    createdAt: '2026-01-25'
  },
  {
    id: 'prod_006',
    name: 'Espelho Versailles',
    category: 'Decoração',
    price: 9800,
    description: 'Espelho com moldura em folha de ouro aplicada à mão sobre talha em madeira. Inspirado nos grandes palácios europeus, reinterpretado com proporções contemporâneas.',
    stock: 4,
    status: 'active',
    featured: true,
    badge: 'Sob Encomenda',
    image: 'img/placeholder-product.svg',
    createdAt: '2026-01-28'
  },
  {
    id: 'prod_007',
    name: 'Tapete Kashmiri',
    category: 'Têxteis',
    price: 22000,
    description: 'Tapete em lã e seda da Caxemira, tecido à mão com padrão floral persa. Peça certificada de colecionador com tingimento natural.',
    stock: 1,
    status: 'active',
    featured: true,
    badge: 'Peça Única',
    image: 'img/placeholder-product.svg',
    createdAt: '2026-02-01'
  },
  {
    id: 'prod_008',
    name: 'Abajur Eclipse',
    category: 'Iluminação',
    price: 3600,
    description: 'Abajur de mesa em cerâmica esmaltada com cúpula em linho belga. Luz ambiente suave e acolhedora, perfeita para salas de estar e quartos.',
    stock: 7,
    status: 'active',
    featured: false,
    badge: '',
    image: 'img/placeholder-product.svg',
    createdAt: '2026-02-03'
  },
  {
    id: 'prod_009',
    name: 'Sofá Capri',
    category: 'Mobiliário',
    price: 28500,
    description: 'Sofá modular em linho premium com estrutura em carvalho europeu. Configuração flexível que se adapta a qualquer ambiente com elegância atemporal.',
    stock: 2,
    status: 'active',
    featured: true,
    badge: 'Premium',
    image: 'img/placeholder-product.svg',
    createdAt: '2026-02-05'
  },
  {
    id: 'prod_010',
    name: 'Quadro Abstrato Riviera',
    category: 'Arte',
    price: 6700,
    description: 'Pintura original em técnica mista sobre tela. Composição abstrata em tons de azul marinho e dourado, emoldurada em carvalho natural.',
    stock: 1,
    status: 'active',
    featured: false,
    badge: 'Original',
    image: 'img/placeholder-product.svg',
    createdAt: '2026-02-07'
  },
  {
    id: 'prod_011',
    name: 'Bandeja Carrara',
    category: 'Acessórios',
    price: 2100,
    description: 'Bandeja decorativa em mármore Carrara com acabamento polido e detalhes em latão. Peça funcional com refinamento para qualquer superfície.',
    stock: 10,
    status: 'active',
    featured: false,
    badge: '',
    image: 'img/placeholder-product.svg',
    createdAt: '2026-02-09'
  },
  {
    id: 'prod_012',
    name: 'Cortina Sheer Monaco',
    category: 'Têxteis',
    price: 5400,
    description: 'Cortina em organza de seda com caimento fluido e transparência elegante. Confecção sob medida com acabamento em bainha francesa.',
    stock: 0,
    status: 'active',
    featured: false,
    badge: '',
    image: 'img/placeholder-product.svg',
    createdAt: '2026-02-10'
  }
];

const DEFAULT_SALES = [
  {
    id: 'sale_001',
    productId: 'prod_001',
    productName: 'Poltrona Milão',
    customerName: 'Carolina Mendes',
    quantity: 1,
    totalPrice: 12800,
    status: 'completed',
    date: '2026-01-20',
    channel: 'whatsapp'
  },
  {
    id: 'sale_002',
    productId: 'prod_003',
    productName: 'Mesa de Centro Atenas',
    quantity: 1,
    customerName: 'Roberto Almeida',
    totalPrice: 15200,
    status: 'completed',
    date: '2026-01-25',
    channel: 'whatsapp'
  },
  {
    id: 'sale_003',
    productId: 'prod_007',
    productName: 'Tapete Kashmiri',
    quantity: 1,
    customerName: 'Isabela Ferreira',
    totalPrice: 22000,
    status: 'pending',
    date: '2026-02-01',
    channel: 'whatsapp'
  },
  {
    id: 'sale_004',
    productId: 'prod_002',
    productName: 'Luminária Cascata',
    quantity: 2,
    customerName: 'André Martins',
    totalPrice: 17000,
    status: 'completed',
    date: '2026-02-05',
    channel: 'whatsapp'
  },
  {
    id: 'sale_005',
    productId: 'prod_009',
    productName: 'Sofá Capri',
    quantity: 1,
    customerName: 'Mariana Costa',
    totalPrice: 28500,
    status: 'pending',
    date: '2026-02-10',
    channel: 'whatsapp'
  }
];

const DEFAULT_CONFIG = {
  whatsappNumber: '',
  storeName: 'Vanessa Morelli',
  storeSubtitle: 'Estúdio de Interiores',
  currency: 'BRL'
};

/**
 * Initialize all data in localStorage if not present
 */
function initializeData() {
  if (!localStorage.getItem(DATA_KEYS.PRODUCTS)) {
    localStorage.setItem(DATA_KEYS.PRODUCTS, JSON.stringify(DEFAULT_PRODUCTS));
  }
  if (!localStorage.getItem(DATA_KEYS.SALES)) {
    localStorage.setItem(DATA_KEYS.SALES, JSON.stringify(DEFAULT_SALES));
  }
  if (!localStorage.getItem(DATA_KEYS.CONFIG)) {
    localStorage.setItem(DATA_KEYS.CONFIG, JSON.stringify(DEFAULT_CONFIG));
  }
  if (!localStorage.getItem(DATA_KEYS.CATEGORIES)) {
    localStorage.setItem(DATA_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
  }
}
