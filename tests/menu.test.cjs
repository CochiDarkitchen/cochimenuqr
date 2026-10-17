const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'data/menu.js'), 'utf8'), context, { filename: 'data/menu.js' });
const menu = context.window.COCHI_MENU;

const productByName = (name) => menu.products.find((product) => product.name === name);

test('el menú real se carga y corresponde a Cochi', () => {
  assert.equal(menu.restaurant.name, 'Cochi');
  assert.equal(menu.restaurant.id, 'cochi');
  assert.equal(menu.products.length, 28);
});

test('las ocho categorías tienen identificadores únicos', () => {
  assert.equal(menu.categories.length, 8);
  assert.equal(new Set(menu.categories.map((category) => category.id)).size, 8);
});

test('todos los productos tienen un identificador único', () => {
  assert.equal(new Set(menu.products.map((product) => product.id)).size, menu.products.length);
});

test('todos los productos pertenecen a una categoría existente', () => {
  const ids = new Set(menu.categories.map((category) => category.id));
  assert.ok(menu.products.every((product) => ids.has(product.categoryId)));
});

test('los precios son numéricos y no negativos', () => {
  assert.ok(menu.products.every((product) => Number.isFinite(product.price) && product.price >= 0));
});

test('los shawarmas conservan los precios de la carta recibida', () => {
  assert.equal(productByName('Shawarma de pollo').price, 7);
  assert.equal(productByName('Shawarma de pollo crispy').price, 8);
  assert.equal(productByName('Shawarma de carne').price, 9);
  assert.equal(productByName('Shawarma de mixto').price, 8);
  assert.equal(productByName('Shawarma Cesar').price, 8);
});

test('las bandejas usan los precios transcritos de la carta', () => {
  assert.equal(productByName('Bandeja 3 carnes').price, 17);
  assert.equal(productByName('Bandeja costilla y lomito').price, 14);
  assert.equal(productByName('Bandeja costilla y pollo').price, 11);
});

test('los precios decimales de adicionales se representan como números', () => {
  assert.equal(productByName('Ración de papas pequeña').price, 1.5);
  assert.equal(productByName('Ración de papas grande').price, 3.5);
  assert.equal(productByName('Refresco 2 litros').price, 2.5);
});

test('el pollo asado indica que está disponible solo los domingos', () => {
  const roastChicken = menu.products.filter((product) => product.categoryId === 'pollo-asado');
  assert.equal(roastChicken.length, 2);
  assert.ok(roastChicken.every((product) => product.availabilityNote === 'Solo domingos'));
});

test('todas las rutas de imágenes de productos existen en el proyecto', () => {
  for (const product of menu.products) {
    assert.ok(fs.existsSync(path.join(root, product.image)), `${product.name}: falta ${product.image}`);
    assert.ok(product.imageAlt && product.imageAlt.length > 4, `${product.name}: falta texto alternativo`);
  }
});

test('los logotipos e isotipos enviados por el usuario están incluidos', () => {
  for (const file of [
    'assets/branding/logo-cochi-rojo.png',
    'assets/branding/logo-cochi-crema.png',
    'assets/branding/isotipo-cochi-rojo.png',
    'assets/branding/isotipo-cochi-crema.png'
  ]) assert.ok(fs.existsSync(path.join(root, file)), `Falta ${file}`);
});

test('la web incluye búsqueda, botones de categoría, detalles y compartir', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const js = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  assert.match(html, /id="search-input"/);
  assert.match(html, /id="category-filter"/);
  assert.match(html, /id="product-dialog"/);
  assert.match(html, /id="share-button"/);
  assert.match(js, /normalizeText/);
  assert.match(js, /openProduct/);
  assert.match(js, /navigator\.share/);
});

test('el generador QR y la biblioteca local se incluyen', () => {
  assert.ok(fs.existsSync(path.join(root, 'qr.html')));
  assert.ok(fs.existsSync(path.join(root, 'qr-tool.js')));
  assert.ok(fs.existsSync(path.join(root, 'vendor/qrcode-lite.js')));
});


test('la nueva pasada visual muestra el isotipo en dos puntos discretos', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /class="hero-eyebrow-isotipo"/);
  assert.match(html, /class="heading-isotipo"/);
  assert.match(html, /assets\/branding\/isotipo-cochi-crema\.png/);
  assert.match(html, /assets\/branding\/isotipo-cochi-rojo\.png/);
});

test('las nuevas animaciones respetan movimiento reducido y entrada por scroll', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
  const js = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  assert.match(html, /class="category-feature motion-item"/);
  assert.match(css, /@keyframes checker-drift/);
  assert.match(css, /@keyframes isotipo-wink/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(js, /function setupMotionItems\(\)/);
  assert.match(js, /new IntersectionObserver/);
});


test('app.js tiene sintaxis válida y declara el renderizado de categorías', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const js = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  assert.doesNotThrow(() => new vm.Script(js, { filename: 'app.js' }));
  assert.match(js, /function renderCategoryButtons\(\)/);
  assert.match(html, /id="sort-dropdown"/);
});

test('los estados de animación no ocultan el contenido si falla JavaScript', () => {
  const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
  const js = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  assert.match(css, /\.reveal\s*\{\s*opacity:\s*1;\s*transform:\s*none;/);
  assert.match(css, /html\.has-motion\s+\.reveal\s*\{/);
  assert.match(js, /document\.documentElement\.classList\.add\('has-motion'\);\s*\}\)\(\);/);
});

test('las tarjetas de productos no anidan botones interactivos', () => {
  const js = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  assert.match(js, /<\/button>\s*<button class="quick-look-btn"/);
  assert.doesNotMatch(js, /<button class="product-open"[\s\S]*?<button class="quick-look-btn"[\s\S]*?<\/button>[\s\S]*?<\/button>/);
});
