// FakeStore App — Demo completa
// API base
const API = 'https://fakestoreapi.com/products';

// ======= Estado =========
const state = {
  products: [],         // productos originales desde API
  filtered: [],         // resultado después de filtros/orden/búsqueda
  cart: {},             // { [id]: { id, title, price, image, qty } }
  query: '',
  category: 'all',
  sort: 'relevance'
};

// ======= Helpers =========
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const money = (n) => n.toLocaleString('es-CO', { style: 'currency', currency: 'USD' });

const saveCart = () => localStorage.setItem('fakestore-cart', JSON.stringify(state.cart));
const loadCart = () => {
  try {
    const data = JSON.parse(localStorage.getItem('fakestore-cart') || '{}');
    state.cart = data && typeof data === 'object' ? data : {};
  } catch { state.cart = {}; }
};

const debounce = (fn, ms = 300) => {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
};

// ======= Render de Productos =========
const tpl = $('#productCardTpl');

function renderProducts(list) {
  const grid = $('#productsGrid');
  grid.setAttribute('aria-busy', 'true');
  grid.innerHTML = '';

  if (!list.length) {
    grid.innerHTML = `<p class="muted">No se encontraron productos para tu búsqueda/filtros.</p>`;
    grid.setAttribute('aria-busy', 'false');
    return;
  }

  const frag = document.createDocumentFragment();
  for (const p of list) {
    const node = tpl.content.cloneNode(true);
    const img = $('.card__img', node);
    const title = $('.card__title', node);
    const cat = $('.card__category', node);
    const desc = $('.card__desc', node);
    const price = $('.price', node);
    const btn = $('.add-to-cart', node);

    img.src = p.image;
    img.alt = p.title;
    title.textContent = p.title;
    cat.textContent = p.category;
    desc.textContent = p.description;
    price.textContent = money(p.price);

    btn.addEventListener('click', () => addToCart(p));

    
    const card = node.querySelector('.card');
    card.addEventListener('click', (e) => {
      if (!e.target.classList.contains('add-to-cart')) {
        openModal(p);
      }
    });
frag.appendChild(node);
  }
  grid.appendChild(frag);
  grid.setAttribute('aria-busy', 'false');
}

// ======= Filtros, orden y búsqueda =========
function applyPipeline() {
  const q = state.query.trim().toLowerCase();
  let list = [...state.products];

  // filtro por categoría
  if (state.category !== 'all') list = list.filter(p => p.category === state.category);

  // búsqueda en título + descripción
  if (q) list = list.filter(p =>
    p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
  );

  // ordenamiento
  switch (state.sort) {
    case 'price-asc': list.sort((a, b) => a.price - b.price); break;
    case 'price-desc': list.sort((a, b) => b.price - a.price); break;
    case 'title-asc': list.sort((a, b) => a.title.localeCompare(b.title)); break;
    case 'title-desc': list.sort((a, b) => b.title.localeCompare(a.title)); break;
    case 'relevance':
    default: /* no-op */ break;
  }

  state.filtered = list;
  renderProducts(state.filtered);
}

// ======= Carrito =========
function addToCart(product) {
  const id = product.id;
  if (!state.cart[id]) {
    state.cart[id] = { id, title: product.title, price: product.price, image: product.image, qty: 1 };
  } else {
    state.cart[id].qty++;
  }
  saveCart();
  renderCart();
}

function removeFromCart(id) {
  delete state.cart[id];
  saveCart();
  renderCart();
}

function setQty(id, qty) {
  if (qty <= 0) return removeFromCart(id);
  if (state.cart[id]) state.cart[id].qty = qty;
  saveCart();
  renderCart();
}

function cartItemsArr() {
  return Object.values(state.cart);
}

function cartTotal() {
  return cartItemsArr().reduce((sum, it) => sum + it.price * it.qty, 0);
}

function renderCart() {
  const list = $('#cartItems');
  list.innerHTML = '';

  const frag = document.createDocumentFragment();
  for (const it of cartItemsArr()) {
    const li = document.createElement('li');
    li.className = 'cart__item';

    li.innerHTML = `
      <img class="cart__thumb" src="${it.image}" alt="${it.title}" />
      <div class="cart__meta">
        <p class="cart__title">${it.title}</p>
        <div class="cart__price">${money(it.price)}</div>
        <div class="qty" role="group" aria-label="Cantidad">
          <button aria-label="Disminuir" data-act="dec">−</button>
          <input type="number" min="1" value="${it.qty}" aria-label="Cantidad del producto"/>
          <button aria-label="Aumentar" data-act="inc">+</button>
        </div>
      </div>
      <div>
        <button class="icon-btn" aria-label="Eliminar del carrito" data-act="remove">🗑</button>
      </div>
    `;

    // eventos de qty
    const input = $('input[type="number"]', li);
    const [dec, inc] = $$('button[data-act]', li);
    dec.addEventListener('click', () => setQty(it.id, (state.cart[it.id]?.qty || 1) - 1));
    inc.addEventListener('click', () => setQty(it.id, (state.cart[it.id]?.qty || 1) + 1));
    input.addEventListener('change', () => {
      const v = Math.max(1, parseInt(input.value || '1', 10));
      setQty(it.id, v);
    });
    $('button[data-act="remove"]', li).addEventListener('click', () => removeFromCart(it.id));

    frag.appendChild(li);
  }
  list.appendChild(frag);

  $('#cartTotal').textContent = money(cartTotal());
  $('#cartCount').textContent = cartItemsArr().reduce((n, it) => n + it.qty, 0);
}

// ======= Cargar categorías =========
async function loadCategories() {
  const res = await fetch(API + '/categories');
  if (!res.ok) throw new Error('Error al obtener categorías');
  const cats = await res.json();
  const sel = $('#categoryFilter');
  for (const c of cats) {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    sel.appendChild(opt);
  }
}

// ======= Inicialización =========
async function init() {
  loadCart();
  renderCart();

  // eventos UI
  $('#cartButton').addEventListener('click', () => toggleCart(true));
  $('#closeCart').addEventListener('click', () => toggleCart(false));
  $('#clearCart').addEventListener('click', () => { state.cart = {}; saveCart(); renderCart(); });
  $('#checkout').addEventListener('click', () => {
    alert('Simulación de pago. ¡Gracias por tu compra!');
    state.cart = {}; saveCart(); renderCart();
  });

  $('#searchInput').addEventListener('input', debounce((e) => {
    state.query = e.target.value;
    applyPipeline();
  }, 250));

  $('#categoryFilter').addEventListener('change', (e) => {
    state.category = e.target.value;
    applyPipeline();
  });

  $('#sortSelect').addEventListener('change', (e) => {
    state.sort = e.target.value;
    applyPipeline();
  });

  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error('Error al obtener productos');
    state.products = await res.json();
    await loadCategories();
    applyPipeline();
  } catch (err) {
    console.error(err);
    $('#productsGrid').innerHTML = `<p class="muted">Ocurrió un error al cargar productos. Reintenta más tarde.</p>`;
  }
}

function toggleCart(open) {
  const panel = $('#cartPanel');
  panel.classList.toggle('open', open);
  panel.setAttribute('aria-hidden', String(!open));
  $('#cartButton').setAttribute('aria-expanded', String(open));
}


// ======= Modal de producto =========
function openModal(product) {
  $('#modalImg').src = product.image;
  $('#modalImg').alt = product.title;
  $('#modalTitle').textContent = product.title;
  $('#modalCategory').textContent = product.category;
  $('#modalDesc').textContent = product.description;
  $('#modalPrice').textContent = money(product.price);

  $('#modalAdd').onclick = () => addToCart(product);

  $('#productModal').classList.add('open');
  $('#productModal').setAttribute('aria-hidden', 'false');
}

function closeModal() {
  $('#productModal').classList.remove('open');
  $('#productModal').setAttribute('aria-hidden', 'true');
}

document.addEventListener('DOMContentLoaded', () => {
  $('#closeModal').addEventListener('click', closeModal);
  document.querySelector('.modal__overlay').addEventListener('click', closeModal);
});


document.addEventListener('DOMContentLoaded', init);
