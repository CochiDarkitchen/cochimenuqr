# Informe de pruebas — Cochi Menú QR

## Resultado general

La carpeta contiene un sitio estático con HTML, CSS y JavaScript. No se requiere compilación, base de datos ni servidor de aplicación. El proyecto no se ha publicado desde este entorno y no tiene todavía una URL pública de Cochi.

## Comprobaciones completadas

| Comprobación | Resultado |
|---|---|
| Pruebas automatizadas de datos (`node --test tests/menu.test.cjs`) | **15 aprobadas, 0 fallidas** |
| Sintaxis de `app.js` | Correcta (`node --check`) |
| Sintaxis de `data/menu.js` | Correcta (`node --check`) |
| Sintaxis de `qr-tool.js` | Correcta (`node --check`) |
| Análisis estático de CSS | 260 reglas top-level analizadas, 0 errores de parseo con `tinycss2` |
| IDs repetidos en las páginas | Ninguno encontrado en `index.html` o `qr.html` |
| Referencias locales (`src` / `href`) | Todas las referencias locales encontradas existen |
| Rutas de imágenes de los 28 productos | Todas presentes |
| Logotipos e isotipos entregados | Incluidos en la carpeta de recursos |
| Animación/isotipo v2 (presencia visual, observador de entrada y movimiento reducido) | Incluida y comprobada mediante pruebas estáticas |
| Generación QR | Matriz de 33 × 33 módulos generada para una URL de prueba |
| Lectura independiente del QR | OpenCV recuperó exactamente `https://example.com/cochi-menu` de la imagen de prueba |

El enlace `example.com` se usó solo para comprobar el generador; **no es el QR definitivo de Cochi**.

## Cambios de esta revisión visual

- Añadido un isotipo crema pequeño junto al rótulo de portada.
- Añadido un isotipo rojo discreto junto al título de la carta.
- Añadida una entrada escalonada del contenido de portada y movimiento lento del patrón ajedrezado.
- Añadida entrada escalonada de tarjetas de categorías al aparecer en pantalla.
- Añadidas microinteracciones de botones, filtros, imágenes y precios.
- Conservada la compatibilidad con `prefers-reduced-motion`.

## Pruebas que no se pudieron completar aquí

Intenté abrir la página con Chromium automatizado tanto desde el servidor local como mediante `file://`, pero el navegador de este entorno bloqueó ambas rutas con `ERR_BLOCKED_BY_ADMINISTRATOR`. Por esa razón no declaro verificada la prueba visual automatizada de clics, búsqueda, modal ni adaptación móvil. El código de esas funciones está incluido, y sus rutas y sintaxis fueron revisadas, pero hace falta probarlas en un navegador no bloqueado.

## Pendiente antes de uso comercial

1. Abrir `index.html` localmente en Chrome, Edge o Firefox y comprobar búsqueda, categorías, detalles y compartir.
2. Revisar la apariencia en un teléfono real (Android y/o iPhone).
3. Confirmar con Cochi todos los nombres, precios, descripciones y disponibilidad transcritos de la imagen del menú.
4. Sustituir las ilustraciones temporales por fotografías reales aprobadas para los productos que corresponda.
5. Publicar la carpeta en un hosting estático HTTPS.
6. Generar el QR con la URL pública y escanearlo desde un teléfono con datos móviles antes de imprimirlo.

## Alcance no implementado (intencionalmente)

No se incluyeron pedidos, pagos, reservas, carrito, inicio de sesión, panel administrativo, base de datos, analítica o almacenamiento de datos de visitantes. Esa es la intención de esta fase: una carta pública e interactiva y un generador QR local.
