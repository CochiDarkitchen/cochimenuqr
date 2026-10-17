(function () {
  'use strict';

  // Activa los estados de animación solo cuando JavaScript está disponible;
  // si un script falla, el contenido principal sigue siendo legible.
  document.documentElement.classList.add('has-motion');

  const menu = window.COCHI_MENU;
  if (!menu || !menu.restaurant || !Array.isArray(menu.products)) {
    document.body.innerHTML = '<main style="font-family:Arial,sans-serif;padding:2rem"><h1>No pudimos cargar el menú</h1><p>Revisa que el archivo data/menu.js esté en la carpeta correcta.</p></main>';
    return;
  }

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const state = { category: 'all', search: '', toastTimer: 0 };
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
    toast: $('#toast')
  };

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (character) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[character]));
  }

  function normalizeText(value) {
    return String(value ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');
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
    const buttons = [
      { id: 'all', name: 'Todo el menú' },
      ...menu.categories.map((category) => ({ id: category.id, name: category.shortName || category.name }))
    ];
    els.categoryFilter.innerHTML = buttons.map((category) => `
      <button class="category-chip" type="button" data-category="${escapeHtml(category.id)}" aria-pressed="${category.id === state.category}">${escapeHtml(category.name)}</button>
    `).join('');
  }

  function filteredProducts() {
    const query = normalizeText(state.search.trim());
    return menu.products.filter((product) => {
      if (state.category !== 'all' && product.categoryId !== state.category) return false;
      if (!query) return true;
      const category = categoryById(product.categoryId);
      const haystack = normalizeText([product.name, product.description, category?.name].join(' '));
      return haystack.includes(query);
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
    return `
      <article class="product-card${unavailable ? ' is-unavailable' : ''}" style="--delay:${Math.min(index % 6, 5) * 55}ms">
        <button class="product-open" type="button" data-open-product="${escapeHtml(product.id)}" aria-label="Ver detalles de ${escapeHtml(product.name)}, ${escapeHtml(formatPrice(product.price))}">
          <span class="product-image-wrap">
            <img src="${escapeHtml(product.image || 'assets/images/products/extras.svg')}" alt="${escapeHtml(product.imageAlt || product.name)}" loading="lazy" decoding="async" ${product.imageNote ? 'class="is-illustration"' : ''}>
            ${imageNote}${badge}<span class="product-category-label">${escapeHtml(category?.shortName || category?.name || 'COCHI')}</span>${availability}
          </span>
          <span class="product-copy">
            <span class="product-meta"><span class="product-title" role="heading" aria-level="4">${escapeHtml(product.name)}</span><span class="product-price">${escapeHtml(formatPrice(product.price))}</span></span>
            <span class="product-description">${escapeHtml(description)}</span>
            <span class="product-card-bottom"><span class="open-label">Ver detalles</span><span class="open-arrow" aria-hidden="true">↗</span></span>
          </span>
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
    if (typeof els.productDialog.showModal === 'function') els.productDialog.showModal();
    else els.productDialog.setAttribute('open', '');
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
        } catch (error) {
          if (error?.name !== 'AbortError') els.shareStatus.textContent = 'No se pudo abrir la función de compartir.';
        }
      } else {
        await copyMenuLink();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName) && !els.productDialog.open && !els.shareDialog.open) {
        event.preventDefault();
        els.search.focus();
      }
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

  function updateHeroDescription() {
    $('#hero-description').textContent = menu.restaurant.intro;
  }

  updateHeroDescription();
  renderCategoryButtons();
  renderMenu();
  setupEvents();
  setupReveals();
  setupMotionItems();
})();
