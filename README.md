# Cochi — Menú digital de ENMA DESIGN

Sitio público estático para consultar el menú de Cochi desde un teléfono, tablet u ordenador. Esta versión está construida con **HTML, CSS y JavaScript**, sin Next.js, servidor de aplicación, cuentas, panel administrativo, base de datos ni proceso de compilación.

## Abrir la web

1. Descarga y extrae `ENMA_DESIGN_Menu_QR_Cochi_CORREGIDO.zip`.
2. Abre la carpeta `ENMA_DESIGN_Menu_QR_Cochi`.
3. Haz doble clic en `index.html`.
4. Para ver el generador QR, abre `qr.html`.

No necesitas instalar Node.js ni usar una terminal para abrir o editar el menú. Los archivos del proyecto son públicos y se sirven directamente desde el hosting.

## Qué incluye

- Identidad de Cochi con los logotipos e isotipos incluidos en el ZIP que enviaste.
- Colores basados en los archivos de marca: rojo aproximado `#EB140C` y crema `#E6E0BF`.
- Tipografía Montserrat mediante Google Fonts, con fuentes del sistema como alternativa si no hay internet.
- Diseño adaptable con una segunda pasada de movimiento: entrada escalonada del texto principal, deriva sutil del patrón ajedrezado, aparición de tarjetas por scroll, microinteracciones para botones/precios y pequeñas animaciones del isotipo. Respeta `prefers-reduced-motion` para visitantes que reducen animaciones en su dispositivo.
- 28 productos agrupados en 8 categorías, con búsqueda, filtros por categoría, fichas de detalle, precios y etiqueta de disponibilidad.
- Generador de QR local en `qr.html`; crea PNG dentro del navegador y no envía la URL a un generador externo.
- Ilustraciones SVG locales provisionales para los platos que no tenían fotografía individual.
- Guía para cambiar textos, precios, categorías, imágenes, logotipo y colores.

## Archivos que vas a editar normalmente

| Archivo o carpeta | Para qué sirve |
|---|---|
| `data/menu.js` | Nombres, precios, descripciones, categorías, disponibilidad y rutas de imagen. |
| `styles.css` | Colores, tamaños, tipografía, composición, animaciones y adaptación móvil. |
| `assets/branding/` | Logotipos, isotipos y favicon de Cochi. |
| `assets/images/products/` | Fotografías recortadas de las piezas promocionales y dibujos SVG temporales. |
| `index.html` | Estructura del menú y textos de la página. |
| `qr.html` y `qr-tool.js` | Página que crea y descarga el QR del menú publicado. |
| `tests/menu.test.cjs` | Pruebas de los datos y rutas de los recursos. |

## Imágenes: importante antes de publicar como carta definitiva

Las imágenes `shawarma-cesar.webp`, `shawarma-carne-papas.webp`, `shawarma-pareja.webp` y `pollo-asado.webp` son recortes de piezas promocionales que compartiste. Para costillas, bandejas, arroz chino, churrasco, tenders, alitas y algunos adicionales se incluyeron **ilustraciones SVG temporales**, marcadas en pantalla como ilustración temporal.

Cuando tengas fotos reales de cada plato, cópialas dentro de `assets/images/products/` y actualiza la propiedad `image` del producto en `data/menu.js`. Cambia `imageNote` a `""` después de sustituir una ilustración por la fotografía correcta. No presentes una ilustración como fotografía real.

## Datos de la carta

Los productos y precios se transcribieron de la imagen del menú que enviaste. Antes de publicar e imprimir un QR para clientes, confirma los nombres, precios, descripciones y especialmente las opciones de los combos con Cochi. La información que aparece en el menú es estática: cada modificación requiere editar el archivo y volver a publicar el sitio.

## Publicar sin compilar

La opción de publicación más sencilla para este proyecto es Netlify Drop, porque acepta una carpeta con archivos HTML, CSS, JavaScript e imágenes:

1. Abre <https://app.netlify.com/drop>.
2. Inicia sesión si quieres conservar y actualizar fácilmente el sitio desde tu cuenta.
3. Arrastra la carpeta extraída `ENMA_DESIGN_Menu_QR_Cochi` al área de carga. Comprueba que `index.html` está en la raíz de esa carpeta.
4. Cuando finalice, abre la URL HTTPS publicada y comprueba que el menú funciona desde un teléfono con datos móviles.
5. Abre `https://TU-DOMINIO/qr.html`, pega la URL pública principal (no la de `qr.html`) y genera/descarga el QR.
6. Escanea el código y confirma que llega al menú correcto antes de imprimirlo.

Netlify describe la publicación por arrastrar y soltar en su documentación oficial: <https://docs.netlify.com/welcome/add-new-site/>. Si prefieres Vercel, puedes publicar la carpeta desde un repositorio Git conectado; consulta <https://vercel.com/docs/git>. No hace falta configurar un build command para una web estática pura.

## Última actualización visual

La versión corregida también repara el bloqueo que dejaba vacía la portada cuando `app.js` fallaba. Se restauró el renderizado de categorías, se corrigieron los controles de ordenamiento y se hizo que el contenido siga visible si el JavaScript no logra inicializarse. Los detalles están en `INFORME-PRUEBAS.md`.

Esta revisión visual hace un poco más visible el isotipo sin repetirlo en todas las secciones: aparece en pequeño junto al rótulo de la portada y como sello junto al título de la carta. Se mantienen también los usos previos en la pegatina de portada, el banner de cierre y los detalles de producto. Las animaciones nuevas son sutiles y no requieren librerías externas.

## Pruebas

La revisión corregida incluye 18 pruebas automatizadas. Si tienes Node.js instalado, abre una terminal en esta carpeta y ejecuta:

```bash
node --test tests/menu.test.cjs
```

No hace falta instalar paquetes con `npm install`.

## Privacidad y límites

- No hay base de datos, login, panel administrativo, carrito, pedidos, pagos, reservas, analítica ni cookies propias.
- No se almacena información de los visitantes en el proyecto.
- Los datos de platos y precios son públicos porque forman parte de la web descargada por cada visitante.
- La tipografía Montserrat se carga desde Google Fonts cuando hay conexión. Esto implica una solicitud externa de fuente; si se pierde esa conexión, el sitio usa una fuente alternativa del sistema.
- El sitio no está publicado por ENMA DESIGN desde este entorno. Para que el QR funcione para tus clientes, tienes que desplegarlo y usar la URL real que te entregue el hosting.
- Antes de venderlo como versión final, sustituye las ilustraciones temporales y prueba el sitio publicado en teléfonos reales.

## Estructura

```text
ENMA_DESIGN_Menu_QR_Cochi/
├── index.html
├── styles.css
├── app.js
├── qr.html
├── qr-tool.js
├── data/
│   └── menu.js
├── assets/
│   ├── branding/
│   └── images/products/
├── vendor/
│   └── qrcode-lite.js
├── tests/
│   └── menu.test.cjs
├── GUIA-PASO-A-PASO.md
└── INFORME-PRUEBAS.md
```
