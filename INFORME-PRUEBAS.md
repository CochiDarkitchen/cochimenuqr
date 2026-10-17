# Informe de diagnóstico y pruebas — Cochi Menú QR corregido

## Resultado general

Se reparó el proyecto estático de Cochi. La causa del bloque rojo vacío era que el navegador no podía ejecutar `app.js`, por lo que las secciones con clase `.reveal` permanecían invisibles. La web corregida fue comprobada mediante pruebas automatizadas y una prueba de interacción en Chromium con los archivos locales integrados en el documento de prueba. **La URL publicada en Vercel no se modificó desde este entorno**; tendrás que actualizar el repositorio y volver a desplegarla.

## Problemas detectados y corregidos

1. **Error de sintaxis en `app.js`:** una lista de colores contenía comentarios con sintaxis CSS (`-- comentario`) dentro de JavaScript. Eso impedía analizar el archivo completo. Se corrigieron los comentarios y se usa la paleta roja/crema en el efecto de confeti.
2. **Faltaba `renderCategoryButtons()`:** el código llamaba a esa función durante el inicio, pero no estaba declarada. Se implementó la creación de filtros de categorías con contadores y el selector para móvil.
3. **Selector incorrecto para ordenar:** `app.js` buscaba `#sort-dropdown`, pero el HTML no tenía ese identificador. Se añadió y se mejoraron los estados de teclado/accesibilidad.
4. **Contenido oculto cuando falla JavaScript:** `.reveal` ahora es visible por defecto. Las transiciones de entrada solo se activan después de una inicialización correcta; un fallo no vuelve a esconder toda la portada.
5. **Botones anidados dentro de botones:** se separó el acceso a la vista rápida para mantener HTML válido y evitar comportamientos extraños al pulsar una tarjeta.
6. **Tarjetas destacadas invisibles:** la animación de pulso estaba reemplazando la animación de entrada de las tarjetas. Ahora ambas animaciones conviven y los 28 productos quedan visibles.
7. **Controles que se superponían o quedaban mal colocados:** se separaron los botones de cerrar/favorito del detalle de producto, se envolvió el ordenamiento para posicionar correctamente su menú y se adaptaron búsqueda/ordenamiento para móviles.
8. **Almacenamiento opcional:** la lectura de preferencias y favoritos ya no rompe la página si `localStorage` está bloqueado o contiene datos inválidos.

## Comprobaciones técnicas

| Comprobación | Resultado |
|---|---|
| `node --check app.js` | Correcta |
| `node --check data/menu.js` | Correcta |
| `node --check qr-tool.js` | Correcta |
| `node --test tests/menu.test.cjs` | **18 aprobadas, 0 fallidas** |
| Análisis de `styles.css` con PostCSS | Correcto, sin errores de parseo |
| IDs repetidos en `index.html` y `qr.html` | Ninguno encontrado |
| Referencias de recursos e imágenes de productos | Archivos presentes |
| Tarjetas tras inicialización | **28 de 28 visibles** |
| Botones de categoría generados | **9** (Todo el menú + 8 categorías) |

## Prueba de navegador (Chromium)

Se ejecutaron `index.html` y `qr.html` en Chromium mediante un documento de prueba que integraba el HTML, CSS, JavaScript e imágenes locales para superar el bloqueo del entorno a las rutas locales directas. Resultados:

- Portada y fotografía principal visibles; opacidad calculada de los dos bloques de portada: `1`.
- 28 tarjetas de producto y 9 botones de categoría; el indicador de carga desaparece.
- Las 28 tarjetas tienen opacidad final visible, también las destacadas.
- Búsqueda por `Cesar` responde y filtra resultados.
- El detalle de producto abre y se cierra correctamente.
- La vista rápida abre y se cierra correctamente.
- El menú de ordenamiento abre y selecciona «Precio: bajo a alto».
- A 390 px de ancho no aparece desbordamiento horizontal; el campo de búsqueda ocupa 360 px dentro del ancho disponible.
- Sin errores JavaScript ni errores de consola durante los recorridos probados.
- El generador QR crea un PNG; un decodificador independiente recuperó exactamente `https://example.com/cochi-menu` del QR de prueba.

La dirección `example.com` se usó solo para validar el generador; no es el QR final del restaurante.

## Pendiente antes de darlo por publicado

1. Actualizar el repositorio que usa Vercel con los archivos corregidos y esperar a que termine el nuevo despliegue.
2. Abrir la URL pública real de Cochi en una ventana normal y privada, en ordenador y en teléfono.
3. Confirmar con Cochi todos los nombres, precios, descripciones y disponibilidad.
4. Sustituir las ilustraciones temporales por fotografías reales autorizadas de los platos correspondientes.
5. Generar el QR con la URL pública definitiva y escanearlo desde un teléfono usando tanto Wi-Fi como datos móviles.

## Alcance

Es un menú público estático. No incorpora panel de administración, usuarios, base de datos, carrito, pedidos, pagos, reservas ni analítica. Las preferencias/favoritos que ofrece la interfaz, si se usan, solo quedan en el almacenamiento local del navegador del visitante.
