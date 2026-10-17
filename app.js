(function () {
  'use strict';

  // Las animaciones se activan al final de una inicialización correcta.
  // Si hay un error de JavaScript, el contenido permanece visible.

  const menu = window.COCHI_MENU;
  if (!menu || !menu.restaurant || !Array.isArray(menu.products)) {
    document.body.innerHTML = '<main style="font-family:Arial,sans-serif;padding:2rem"><h1>No pudimos cargar el menú</h1><p>Revisa que el archivo data/menu.js esté en la carpeta correcta.</p></main>';
    return;
  }

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));

  // El almacenamiento local es opcional. La web también debe funcionar si el
  // navegador bloquea localStorage o si los datos guardados están dañados.
  const storage = {
    get(key) {
      try { return window.localStorage.getItem(key); } catch (_) { return null; }
    },
    set(key, value) {
      try { window.localStorage.setItem(key, value); return true; } catch (_) { return false; }
    }
  };

  function readStoredArray(key) {
    try {
      const value = JSON.parse(storage.get(key) || '[]');
      return Array.isArray(value) ? value : [];
    } catch (_) {
      return [];
    }
  }

  const rememberedCategory = storage.get('cochiLastCategory') || 'all';
  const validRememberedCategory = rememberedCategory === 'all'
    || menu.categories.some((category) => category.id === rememberedCategory);
  const initialCategory = validRememberedCategory ? rememberedCategory : 'all';
  const state = {
    category: initialCategory,
    search: '',
    sort: 'default',
    lastCategory: initialCategory,
    toastTimer: 0
  };
  const els = {
    categoryFilter: $('#category-filter'),
    categoryBento: $('#category-bento'),
    search: $('#search-input'),
    menuGroups: $('#menu-groups'),
    resultSummary: $('#results-summary'),
    clearFilters: $('#clear-filters'),
    emptyState: $('#empty-state'),
    emptyReset: $('#empty-reset'),
    productDialog: $('#product-dialog'),
    dialogClose: $('#dialog-close'),
    dialogImage: $('#dialog-product-image'),
    dialogCategory: $('#dialog-category'),
    dialogName: $('#dialog-product-name'),
    dialogDescription: $('#dialog-product-description'),
    dialogPrice: $('#dialog-product-price'),
    dialogAvailability: $('#dialog-product-availability'),
    dialogImageNote: $('#dialog-image-note'),
    shareButton: $('#share-button'),
    shareDialog: $('#share-dialog'),
    shareClose: $('#share-close'),
    shareUrl: $('#share-url'),
    copyLinkButton: $('#copy-link-button'),
    nativeShareButton: $('#native-share-button'),
    shareStatus: $('#share-status'),
    toast: $('#toast'),
    // Claude Enhancements
    sortDropdown: $('#sort-dropdown'),
    sortSelected: $('.sort-selected'),
    sortOptions: $('.sort-options'),
    mobileCategorySelect: $('#mobile-category-select'),
    dialogFavorite: $('#dialog-favorite'),
    confettiContainer: $('.confetti-container'),
    isotopoFollower: $('.isotopo-follower'),
    quickLookOverlay: $('.quick-look-overlay'),
    quickLookClose: $('.quick-look-close'),
    quickLookTitle: $('#quick-look-title'),
    quickLookImage: $('#quick-look-image'),
    quickLookCategory: $('#quick-look-category'),
    quickLookDescription: $('#quick-look-description'),
    quickLookPrice: $('#quick-look-price')
  };

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[character]));
  }

  function normalizeText(value) {
    return String(value ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLocaleLowerCase('es');
  }

  function formatPrice(value) {
    const number = Number(value);
    const formatted = Number.isFinite(number)
      ? number.toLocaleString('en-US', { maximumFractionDigits: 2, minimumFractionDigits: 0 })
      : '—';
    return `${menu.restaurant.currencySymbol || '$'}${formatted}`;
  }

  function categoryById(categoryId) {
    return menu.categories.find((category) => category.id === categoryId);
  }

  function renderCategoryButtons() {
    const categoryCounts = new Map();
    menu.products.forEach((product) => {
      categoryCounts.set(product.categoryId, (categoryCounts.get(product.categoryId) || 0) + 1);
    });

    const allCount = menu.products.length;
    const buttons = [
      `<button class="category-chip" type="button" data-category="all" aria-pressed="${state.category === 'all'}">Todo el menú <span class="category-chip-count">${allCount}</span></button>`,
      ...menu.categories.map((category) => {
        const count = categoryCounts.get(category.id) || 0;
        return `<button class="category-chip" type="button" data-category="${escapeHtml(category.id)}" aria-pressed="${state.category === category.id}">${escapeHtml(category.name)} <span class="category-chip-count">${count}</span></button>`;
      })
    ];
    els.categoryFilter.innerHTML = buttons.join('');

    const options = [
      `<option value="all">Todo el menú (${allCount})</option>`,
      ...menu.categories.map((category) => {
        const count = categoryCounts.get(category.id) || 0;
        return `<option value="${escapeHtml(category.id)}">${escapeHtml(category.name)} (${count})</option>`;
      })
    ];
    els.mobileCategorySelect.innerHTML = options.join('');
    els.mobileCategorySelect.value = state.category;
  }

  function filteredProducts() {
    const query = normalizeText(state.search.trim());
    const filtered = menu.products.filter((product) => {
      if (state.category !== 'all' && product.categoryId !== state.category) return false;
      if (!query) return true;
      const category = categoryById(product.categoryId);
      const haystack = normalizeText([product.name, product.description, category?.name].join(' '));
      return haystack.includes(query);
    });

    return filtered.sort((a, b) => {
      if (state.sort === 'price-asc') return a.price - b.price;
      if (state.sort === 'price-desc') return b.price - a.price;
      if (state.sort === 'name-asc') return a.name.localeCompare(b.name, 'es');
      if (state.sort === 'name-desc') return b.name.localeCompare(a.name, 'es');
      return 0; // default order
    });
  }

  function productCard(product, index) {
    const category = categoryById(product.categoryId);
    const unavailable = product.available === false;
    const badge = product.availabilityNote
      ? `<span class="product-badge">${escapeHtml(product.availabilityNote)}</span>`
      : (product.badge ? `<span class="product-badge">${escapeHtml(product.badge)}</span>` : '');
    const imageNote = product.imageNote
      ? `<span class="image-reference-tag">${escapeHtml(product.imageNote)}</span>` : '';
    const availability = unavailable ? '<span class="product-unavailable">No disponible</span>' : '';
    const description = product.description || '';
    // Determine tags for featured products
    const isFeatured = product.featured === true;
    const featuredClass = isFeatured ? 'featured-pulse' : '';

    return `
      <article class="product-card${unavailable ? ' is-unavailable' : ''} ${featuredClass}" style="--delay:${Math.min(index % 6, 5) * 55}ms">
        <button class="product-open" type="button" data-open-product="${escapeHtml(product.id)}" aria-label="Ver detalles de ${escapeHtml(product.name)}, ${escapeHtml(formatPrice(product.price))}">
          <span class="product-image-wrap">
            <img src="${escapeHtml(product.image || 'assets/images/products/extras.svg')}" alt="${escapeHtml(product.imageAlt || product.name)}" loading="lazy" decoding="async" ${product.imageNote ? 'class="is-illustration"' : ''}>
            ${imageNote}${badge}
            ${isFeatured ? '<span class="product-tag featured">Destacado</span>' : ''}
            <span class="product-category-label">${escapeHtml(category?.shortName || category?.name || 'COCHI')}</span>${availability}
          </span>
          <span class="product-copy">
            <span class="product-meta"><span class="product-title" role="heading" aria-level="4">${escapeHtml(product.name)}</span><span class="product-price">${escapeHtml(formatPrice(product.price))}</span></span>
            <span class="product-description">${escapeHtml(description)}</span>
            <span class="product-card-bottom">
              <span class="open-label">Ver detalles</span><span class="open-arrow" aria-hidden="true">↗</span>
            </span>
          </span>
        </button>
        <button class="quick-look-btn" type="button" aria-label="Vista rápida de ${escapeHtml(product.name)}" title="Vista rápida">
          <span class="quick-look-icon" aria-hidden="true">◉</span>
        </button>
      </article>`;
  }

  function groupMarkup(category, products) {
    const count = products.length;
    return `
      <section class="menu-group" aria-labelledby="group-${escapeHtml(category.id)}">
        <div class="menu-group-heading">
          <div><p class="menu-group-kicker">COCHI · ${escapeHtml(String(menu.categories.findIndex((item) => item.id === category.id) + 1).padStart(2, '0'))}</p><h3 id="group-${escapeHtml(category.id)}">${escapeHtml(category.name)}</h3></div>
          <p>${escapeHtml(category.description || '')}</p>
        </div>
        <div class="product-grid">${products.map(productCard).join('')}</div>
      </section>`;
  }

  function renderMenu() {
    const products = filteredProducts();
    const visibleCategories = state.category === 'all'
      ? menu.categories
      : menu.categories.filter((category) => category.id === state.category);
    const groups = visibleCategories.map((category) => ({
      category,
      products: products.filter((product) => product.categoryId === category.id)
    })).filter((group) => group.products.length > 0);

    els.menuGroups.innerHTML = groups.map((group) => groupMarkup(group.category, group.products)).join('');
    els.menuGroups.setAttribute('aria-busy', 'false');
    els.menuGroups.hidden = products.length === 0;
    if (els.mobileCategorySelect) els.mobileCategorySelect.value = state.category;
    els.emptyState.hidden = products.length > 0;
    const filtersActive = state.category !== 'all' || Boolean(state.search.trim());
    els.clearFilters.hidden = !filtersActive;
    els.resultSummary.textContent = filtersActive
      ? `${products.length} ${products.length === 1 ? 'resultado' : 'resultados'} · ${menu.products.length} productos en la carta`
      : `${menu.products.length} productos · ${menu.categories.length} categorías`;
    $$('#category-filter [data-category]').forEach((button) => {
      button.setAttribute('aria-pressed', String(button.dataset.category === state.category));
    });

    // Si una ruta de imagen cambia o un archivo falta, muestra la ilustración local de respaldo.
    $$('img', els.menuGroups).forEach((image) => {
      image.addEventListener('error', () => {
        if (!image.dataset.fallbackTried) {
          image.dataset.fallbackTried = 'true';
          image.src = 'assets/images/products/extras.svg';
          image.alt = 'Ilustración temporal de referencia';
        }
      }, { once: true });
    });
  }

  function clearFilters() {
    state.category = 'all';
    storage.set('cochiLastCategory', 'all');
    state.search = '';
    els.search.value = '';
    renderMenu();
  }

  function openProduct(productId) {
    const product = menu.products.find((item) => item.id === productId);
    if (!product) return;
    const category = categoryById(product.categoryId);
    els.dialogImage.src = product.image || 'assets/images/products/extras.svg';
    els.dialogImage.alt = product.imageAlt || product.name;
    els.dialogCategory.textContent = category?.name || 'DETALLES DEL PLATO';
    els.dialogName.textContent = product.name;
    els.dialogDescription.textContent = product.description || '';
    els.dialogPrice.textContent = formatPrice(product.price);
    const unavailable = product.available === false;
    els.dialogAvailability.textContent = unavailable ? 'No disponible' : (product.availabilityNote || 'Disponible en menú');
    els.dialogAvailability.classList.toggle('is-unavailable', unavailable);
    els.dialogImageNote.hidden = !product.imageNote;
    els.dialogImageNote.textContent = product.imageNote ? `${product.imageNote}. Esta imagen es provisional y puede sustituirse en data/menu.js.` : '';

    // Store current product ID in dialog for reference
    els.productDialog.dataset.currentProductId = productId;

    // Restore favorite state from localStorage
    const favorites = readStoredArray('cochiFavorites');
    els.dialogFavorite.classList.toggle('is-favorited', favorites.includes(productId));

    if (typeof els.productDialog.showModal === 'function') els.productDialog.showModal();
    else els.productDialog.setAttribute('open', '');
  }

  function showQuickLook(productId) {
    const product = menu.products.find((item) => item.id === productId);
    if (!product) return;

    const category = categoryById(product.categoryId);

    // Set quick look content
    els.quickLookTitle.textContent = product.name;
    els.quickLookImage.src = product.image || 'assets/images/products/extras.svg';
    els.quickLookImage.alt = product.imageAlt || product.name;
    els.quickLookCategory.textContent = category?.name || '';
    els.quickLookDescription.textContent = product.description || '';
    els.quickLookPrice.textContent = formatPrice(product.price);

    // Show quick look overlay
    els.quickLookOverlay.classList.add('active');
    els.quickLookOverlay.setAttribute('aria-hidden', 'false');
    els.quickLookClose.focus();
  }

  function showConfetti() {
    const container = els.confettiContainer;
    if (!container) return;

    // Create confetti pieces
    const confettiCount = 50;
    const colors = [
      [235, 20, 12],      // Rojo Cochi
      [230, 224, 191],   // Crema de marca
      [255, 255, 255],   // Blanco
      [255, 100, 100]    // Rojo claro
    ];

    // Clear existing confetti
    container.innerHTML = '';

    // Create confetti elements
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';

      // Random position
      confetti.style.left = Math.random() * 100 + 'vw';
      const [red, green, blue] = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.background = `rgb(${red}, ${green}, ${blue})`;

      // Random size
      const size = Math.random() * 8 + 4;
      confetti.style.width = size + 'px';
      confetti.style.height = size + 'px';

      // Random animation duration and delay
      const duration = Math.random() * 3 + 2;
      const delay = Math.random() * 2;
      confetti.style.animation = `confettiFall ${duration}s ease-out ${delay}s forwards`;

      // Set hue for color variation
      confetti.style.setProperty('--hue', Math.random() * 360);
      confetti.style.setProperty('--duration', `${duration}s`);

      container.appendChild(confetti);
    }

    // Remove confetti after animation ends
    setTimeout(() => {
      container.innerHTML = '';
    }, 5000);
  }

  function publicMenuUrl() {
    const url = new URL(window.location.href);
    url.search = '';
    url.hash = '';
    return url.toString();
  }

  function showToast(message) {
    els.toast.textContent = message;
    els.toast.classList.add('is-visible');
    window.clearTimeout(state.toastTimer);
    state.toastTimer = window.setTimeout(() => els.toast.classList.remove('is-visible'), 2600);
  }

  async function copyMenuLink() {
    const url = publicMenuUrl();
    els.shareUrl.value = url;
    try {
      await navigator.clipboard.writeText(url);
      els.shareStatus.textContent = 'Enlace copiado al portapapeles.';
      showToast('Enlace del menú copiado');
      showConfetti();
    } catch (_) {
      els.shareUrl.focus();
      els.shareUrl.select();
      const copied = document.execCommand && document.execCommand('copy');
      els.shareStatus.textContent = copied ? 'Enlace copiado al portapapeles.' : 'Selecciona y copia el enlace manualmente.';
    }
  }

  function setupEvents() {
    els.categoryFilter.addEventListener('click', (event) => {
      const button = event.target.closest('[data-category]');
      if (!button) return;
      state.category = button.dataset.category;
      storage.set('cochiLastCategory', state.category);
      renderMenu();
    });

    els.search.addEventListener('input', () => {
      state.search = els.search.value;
      renderMenu();
    });

    els.clearFilters.addEventListener('click', clearFilters);
    els.emptyReset.addEventListener('click', clearFilters);
    els.menuGroups.addEventListener('click', (event) => {
      const button = event.target.closest('[data-open-product]');
      if (button) openProduct(button.dataset.openProduct);
    });

    els.categoryBento.addEventListener('click', (event) => {
      const link = event.target.closest('[data-jump-category]');
      if (!link) return;
      state.category = link.dataset.jumpCategory;
      storage.set('cochiLastCategory', state.category);
      state.search = '';
      els.search.value = '';
      renderMenu();
    });

    els.dialogClose.addEventListener('click', () => els.productDialog.close());
    els.productDialog.addEventListener('click', (event) => {
      if (event.target === els.productDialog) els.productDialog.close();
    });

    els.shareButton.addEventListener('click', () => {
      els.shareUrl.value = publicMenuUrl();
      els.shareStatus.textContent = window.location.protocol === 'file:'
        ? 'Vista local: publica la web primero para obtener un enlace que otras personas puedan abrir.' : '';
      if (typeof els.shareDialog.showModal === 'function') els.shareDialog.showModal();
      else els.shareDialog.setAttribute('open', '');
    });
    els.shareClose.addEventListener('click', () => els.shareDialog.close());
    els.shareDialog.addEventListener('click', (event) => {
      if (event.target === els.shareDialog) els.shareDialog.close();
    });
    els.copyLinkButton.addEventListener('click', copyMenuLink);
    els.nativeShareButton.addEventListener('click', async () => {
      const url = publicMenuUrl();
      if (navigator.share) {
        try {
          await navigator.share({ title: 'Cochi — Menú digital', text: 'Mira el menú de Cochi.', url });
          els.shareStatus.textContent = 'Menú compartido.';
          showConfetti();
        } catch (error) {
          if (error?.name !== 'AbortError') els.shareStatus.textContent = 'No se pudo abrir la función de compartir.';
        }
      } else {
        await copyMenuLink();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && els.quickLookOverlay.classList.contains('active')) {
        els.quickLookOverlay.classList.remove('active');
        els.quickLookOverlay.setAttribute('aria-hidden', 'true');
      }
      if (event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName) && !els.productDialog.open && !els.shareDialog.open) {
        event.preventDefault();
        els.search.focus();
      }
    });

    // Claude Enhancements Event Listeners
    // Sort dropdown
    const toggleSortOptions = () => {
      const isOpen = els.sortOptions.classList.toggle('open');
      els.sortDropdown.setAttribute('aria-expanded', String(isOpen));
    };
    els.sortDropdown.addEventListener('click', toggleSortOptions);
    els.sortDropdown.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleSortOptions();
      }
    });

    els.sortOptions.addEventListener('click', (event) => {
      const option = event.target.closest('.sort-option');
      if (!option) return;

      // Update selected sort
      els.sortOptions.querySelectorAll('.sort-option').forEach(opt => {
        opt.classList.remove('active');
        opt.setAttribute('aria-checked', 'false');
      });
      option.classList.add('active');
      option.setAttribute('aria-checked', 'true');

      // Update state and UI
      state.sort = option.dataset.sort;
      els.sortSelected.textContent = option.textContent.trim();
      els.sortOptions.classList.remove('open');
      els.sortDropdown.setAttribute('aria-expanded', 'false');

      // Re-render menu with new sort
      renderMenu();
    });

    // Close sort options when clicking outside
    document.addEventListener('click', (event) => {
      if (!els.sortDropdown.contains(event.target) && !els.sortOptions.contains(event.target)) {
        els.sortOptions.classList.remove('open');
        els.sortDropdown.setAttribute('aria-expanded', 'false');
      }
    });

    // Mobile category dropdown
    els.mobileCategorySelect.addEventListener('change', () => {
      state.category = els.mobileCategorySelect.value;
      // Save to localStorage
      storage.set('cochiLastCategory', state.category);
      renderMenu();
    });

    // Favorite button in product dialog
    els.dialogFavorite.addEventListener('click', () => {
      const isFavorited = els.dialogFavorite.classList.toggle('is-favorited');
      const productId = els.productDialog.dataset.currentProductId;

      if (productId) {
        // Save favorite state to localStorage
        const favorites = readStoredArray('cochiFavorites');
        if (isFavorited) {
          if (!favorites.includes(productId)) {
            favorites.push(productId);
            storage.set('cochiFavorites', JSON.stringify(favorites));
          }
          showToast('Agregado a favoritos');
        } else {
          const index = favorites.indexOf(productId);
          if (index > -1) {
            favorites.splice(index, 1);
            storage.set('cochiFavorites', JSON.stringify(favorites));
          }
          showToast('Eliminado de favoritos');
        }
      }
    });

    // Quick look controls
    const closeQuickLook = () => {
      els.quickLookOverlay.classList.remove('active');
      els.quickLookOverlay.setAttribute('aria-hidden', 'true');
    };
    els.quickLookClose.addEventListener('click', closeQuickLook);
    els.quickLookOverlay.addEventListener('click', (event) => {
      if (event.target === els.quickLookOverlay) closeQuickLook();
    });

    // Quick look buttons in product cards
    els.menuGroups.addEventListener('click', (event) => {
      const quickLookButton = event.target.closest('.quick-look-btn');
      if (!quickLookButton) return;

      // Find the product card to get the product ID
      const productCard = quickLookButton.closest('.product-card');
      if (!productCard) return;

      // Find the product-open button within the same card to get the product ID
      const openButton = productCard.querySelector('[data-open-product]');
      if (!openButton) return;

      const productId = openButton.dataset.openProduct;
      showQuickLook(productId);
    });
  }

  function setupReveals() {
    const revealElements = $$('.reveal');
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      revealElements.forEach((element) => element.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -25px 0px' });
    revealElements.forEach((element) => observer.observe(element));
  }

  function setupMotionItems() {
    const items = $$('.motion-item');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!('IntersectionObserver' in window) || reducedMotion) {
      items.forEach((item) => item.classList.add('is-motion-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-motion-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    items.forEach((item) => observer.observe(item));
  }

  function setupIsotopoFollower() {
    const isotopoFollower = els.isotopoFollower;
    if (!isotopoFollower) return;

    let lastScrollY = window.scrollY;
    let targetY = lastScrollY;
    let isUpdating = false;

    function updateIsotopoPosition() {
      if (!isUpdating) {
        isUpdating = true;
        requestAnimationFrame(() => {
          // Smooth follow with some delay
          targetY += (lastScrollY - targetY) * 0.1;
          isotopoFollower.style.transform = `translate3d(0, ${targetY}px, 0)`;
          isUpdating = false;
        });
      }
    }

    function onScroll() {
      lastScrollY = window.scrollY;
      updateIsotopoPosition();
    }

    // Initial position
    isotopoFollower.style.transform = `translate3d(0, ${window.scrollY}px, 0)`;

    // Add event listener
    window.addEventListener('scroll', onScroll, { passive: true });

    // Also update on resize
    window.addEventListener('resize', () => {
      lastScrollY = window.scrollY;
      targetY = lastScrollY;
    }, { passive: true });
  }

  function updateHeroDescription() {
    $('#hero-description').textContent = menu.restaurant.intro;
  }

  updateHeroDescription();
  renderCategoryButtons();
  renderMenu();
  setupEvents();
  setupReveals();
  setupMotionItems();
  setupIsotopoFollower();
  document.documentElement.classList.add('has-motion');
})();