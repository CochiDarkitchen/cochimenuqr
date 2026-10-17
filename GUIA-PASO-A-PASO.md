# Guía paso a paso — Personalizar el menú digital de Cochi

Esta guía está escrita para empezar desde cero. **No necesitas programar ni instalar una base de datos.** Para cambiar el menú normalmente solo editarás un archivo, guardarás y volverás a publicar la carpeta.

## 1. Descargar y extraer el proyecto

1. Descarga el ZIP que acompaña esta guía.
2. En Windows 10 u 11, abre el Explorador de archivos y ve a **Descargas**.
3. Haz clic derecho sobre `ENMA_DESIGN_Menu_QR_Cochi_CORREGIDO.zip` y selecciona **Extraer todo…**.
4. Pulsa **Extraer**. Windows creará una carpeta llamada `ENMA_DESIGN_Menu_QR_Cochi`.
5. Entra en esa carpeta. Debes ver `index.html`, `styles.css`, `app.js`, `qr.html` y carpetas como `data` y `assets`.

No trabajes dentro de la ventana que muestra el contenido del ZIP. Primero extrae todos los archivos para que la página pueda encontrar las imágenes y los estilos.

## 2. Ver el menú en tu ordenador

1. Abre la carpeta extraída.
2. Haz doble clic en `index.html`.
3. Se abrirá el menú en tu navegador predeterminado.
4. Desplázate por las categorías, escribe algo en el buscador, toca una tarjeta y cierra los detalles con la X.
5. Puedes volver a la carpeta y abrir `qr.html` para probar la página del QR. Para generar el QR definitivo necesitas primero publicar el menú y tener una URL HTTPS.

Si abres el menú directamente desde tu disco, el enlace para compartir será una dirección local que otros teléfonos no pueden abrir. Eso es normal; no significa que el menú esté dañado.

## 3. Instalar un editor para modificar los archivos

Recomendamos Visual Studio Code porque muestra las carpetas y el texto con colores.

1. Abre <https://code.visualstudio.com/>.
2. Descarga la versión para Windows e instala usando las opciones predeterminadas.
3. Abre Visual Studio Code.
4. Ve a **Archivo → Abrir carpeta…**.
5. Selecciona `ENMA_DESIGN_Menu_QR_Cochi`, la carpeta que extrajiste, y confirma.
6. En el panel izquierdo verás los archivos del proyecto. Para cambiar la carta, abre `data` y después `menu.js`.

No necesitas abrir una terminal ni ejecutar `npm install` para cambiar el menú.

## 4. Cambiar el nombre, la descripción principal o un precio

1. En Visual Studio Code, abre `data/menu.js`.
2. Busca `window.COCHI_MENU` al principio.
3. Cada producto está dentro de la lista `products`. Un producto empieza con `{` y contiene campos como `id`, `name`, `categoryId`, `price`, `description` e `image`.
4. Cambia solo el valor entre comillas o el número que necesitas. Por ejemplo:

```js
{
  id: "shawarma-pollo",
  name: "Shawarma de pollo",
  categoryId: "shawarmas",
  price: 7,
  description: "Pan árabe, lechuga, cebolla, tomate, pepinillos, perejil, papas hilachas, pollo y salsas árabes.",
  image: "assets/images/products/shawarma-pareja.webp",
  imageAlt: "Shawarma de pollo de Cochi",
  imageNote: "",
  available: true
}
```

5. Pulsa **Ctrl + S** para guardar.
6. Regresa al navegador y pulsa **Ctrl + R** para actualizar el menú.

### Reglas sencillas para evitar errores

- Los textos se escriben entre comillas dobles.
- Los precios son números, sin el símbolo de dólar. Usa `price: 7` o `price: 1.5`.
- No elimines las comas que separan propiedades ni la coma entre productos.
- Cada `id` debe ser único. Por ejemplo, utiliza `shawarma-extra-queso`, no repitas `shawarma-pollo`.
- `categoryId` debe coincidir exactamente con un `id` de `categories`.
- Para marcar un producto como no disponible, cambia `available: true` a `available: false`. Al volver a estar disponible, restaura `true`.
- Para indicar una disponibilidad especial, puedes usar `availabilityNote: "Solo domingos"`. El sitio mostrará esa etiqueta en la tarjeta.

## 5. Añadir un producto nuevo

Lo más seguro es copiar un producto parecido y cambiar sus campos.

1. En `data/menu.js`, dentro de `products`, selecciona un producto completo —desde su `{` inicial hasta su `}` final— y cópialo.
2. Pega la copia junto a los demás objetos de `products`.
3. Cambia `id`, `name`, `categoryId`, `price`, `description`, `image` y `imageAlt`.
4. Verifica que hay una coma entre el producto anterior y el nuevo.
5. Guarda con **Ctrl + S** y actualiza el navegador.

Plantilla corta para recordar los campos:

```js
{
  id: "nuevo-plato",
  name: "Nombre del plato",
  categoryId: "shawarmas",
  price: 5,
  description: "Descripción aprobada por Cochi.",
  image: "assets/images/products/nuevo-plato.webp",
  imageAlt: "Descripción de la imagen",
  imageNote: "Ilustración temporal",
  available: true
}
```

Usa una categoría existente. Las categorías que incluye esta versión son: `shawarmas`, `costillas`, `bandejas`, `arroz-chino`, `churrasco`, `tenders-alitas`, `pollo-asado` y `adicionales`.

## 6. Cambiar o reemplazar las imágenes de los platos

Las fotos provisionales extraídas de las publicaciones de Cochi son:

- `shawarma-cesar.webp`
- `shawarma-carne-papas.webp`
- `shawarma-pareja.webp`
- `pollo-asado.webp`

Las ilustraciones provisionales son archivos `.svg`, también dentro de `assets/images/products/`. Las tarjetas que usan ilustraciones muestran una etiqueta **Ilustración temporal**.

Para reemplazar una imagen:

1. Prepara la fotografía que te dio Cochi. Mejor una foto nítida, bien iluminada, sin textos superpuestos y con el plato centrado.
2. Entra en `assets/images/products/` desde el Explorador de archivos.
3. Copia la fotografía a esa carpeta. Puedes usar JPG, PNG o WebP; el nombre no debe contener caracteres raros. Ejemplo: `shawarma-pollo-real.webp`.
4. En Visual Studio Code, abre `data/menu.js` y busca el producto al que corresponde la foto.
5. Cambia su campo `image` a `assets/images/products/shawarma-pollo-real.webp`.
6. Actualiza `imageAlt` con una descripción sencilla y cambia `imageNote` por `""` si ya es la foto correcta del producto.
7. Guarda y actualiza el navegador.

Si quieres conservar el nombre anterior, puedes sustituir el archivo antiguo por la nueva fotografía usando exactamente el mismo nombre. Eso evita cambiar la ruta del menú.

**Importante:** las ilustraciones SVG son referencias visuales temporales, no fotografías. No las mantengas en la carta comercial definitiva si pueden confundir al cliente sobre el aspecto real del plato.

## 7. Cambiar el logotipo y el isotipo

Los archivos están en `assets/branding/`:

- `logo-cochi-rojo.png`: logotipo rojo sobre fondo claro.
- `logo-cochi-crema.png`: logotipo crema para el pie de página rojo.
- `isotipo-cochi-rojo.png`: isotipo rojo.
- `isotipo-cochi-crema.png`: isotipo crema para fondos oscuros.

Para reemplazar un logo sin editar código, exporta la versión nueva como PNG transparente, haz una copia de seguridad del archivo actual y guarda el nuevo con exactamente el mismo nombre. Mantén suficiente espacio transparente alrededor del logo para que no quede cortado.

Si prefieres cambiar los nombres de los archivos, abre `data/menu.js` para las rutas declaradas y `index.html` para las rutas que aparecen directamente en la página.

## 8. Cambiar colores, tipografía y animaciones

1. Abre `styles.css`.
2. Al principio encontrarás variables como estas:

```css
:root {
  --red: #eb140c;
  --red-deep: #bb1009;
  --cream: #e6e0bf;
  --paper: #fbf8ed;
  --ink: #181716;
}
```

3. Cambia el código hexadecimal del color. Ejemplo: `--red: #e21d18;`.
4. Guarda y actualiza la página. Cambiar las variables principales actualizará gran parte del diseño.
5. La página carga Montserrat desde Google Fonts. Si el equipo no tiene conexión, utilizará una fuente alternativa del sistema.
6. Las animaciones también están en `styles.css`, dentro de reglas `@keyframes`, y se reducen automáticamente cuando el sistema tiene activada la opción de movimiento reducido. La pasada más reciente está agrupada al final del archivo, bajo el comentario `COCHI — Pasada de movimiento v2`; ahí también están las nuevas apariciones discretas del isotipo.

Haz cambios pequeños de uno en uno. Si el resultado no te gusta, pulsa **Ctrl + Z**, guarda y actualiza.

## 9. Cambiar o crear una categoría

1. Abre `data/menu.js` y localiza el arreglo `categories`.
2. Cada categoría incluye un `id`, `name`, `shortName` y `description`.
3. Para renombrarla, cambia `name` y `shortName`.
4. Para crear una categoría, copia un objeto de categoría y cambia su `id`. Usa un identificador sin espacios ni tildes, por ejemplo `combos-familia`.
5. Asigna el mismo `categoryId` a los productos que deban aparecer en ella.
6. Guarda y comprueba la navegación en el navegador.

Si creas una categoría nueva, piensa también si quieres añadirla a los bloques visuales destacados de la sección inicial. Eso se hace en `index.html` mediante los elementos `data-jump-category`.

## 10. Generar y probar el QR final

1. Publica la carpeta del menú siguiendo la sección 11.
2. Copia la dirección HTTPS que termina en el dominio que te haya asignado el hosting. Ejemplo de formato: `https://nombre-del-menu.netlify.app/`.
3. Abre `https://TU-DOMINIO/qr.html` en el navegador.
4. Pega la dirección principal del menú en el campo. No pegues la dirección de `qr.html`; debes pegar la página que quieres que vea el cliente al escanear.
5. Pulsa **Generar código QR**.
6. Comprueba la vista previa y pulsa **Descargar PNG**.
7. Escanea el PNG en una pantalla o imprime una prueba. Comprueba que el teléfono abre el menú real y que el texto y las imágenes se ven bien.
8. No mandes a imprimir grandes cantidades hasta haber comprobado el QR con otro teléfono y datos móviles.

El generador utiliza una biblioteca incluida dentro de `vendor/`; no envía la URL a una página externa. Si después cambia la dirección del sitio, genera y vuelve a imprimir el QR con la nueva dirección.

## 11. Publicar la web en internet (sin comandos)

### Ruta sencilla: Netlify Drop

1. Abre <https://app.netlify.com/drop>.
2. Inicia sesión en Netlify si quieres mantener el proyecto en tu cuenta y subir versiones nuevas más adelante.
3. En Windows, abre el Explorador de archivos con la carpeta `ENMA_DESIGN_Menu_QR_Cochi` extraída.
4. Arrastra la carpeta completa al área de carga de Netlify Drop. No arrastres solo `index.html`; deben ir también `styles.css`, `app.js`, `data`, `assets` y `vendor`.
5. Espera a que termine la publicación y copia la URL HTTPS que te muestre Netlify.
6. Abre la URL en una pestaña nueva. Prueba búsqueda, categorías, detalles e imágenes.
7. Abre la misma dirección añadiendo `/qr.html`, genera el QR y pruébalo.

Cuando actualices platos o precios, guarda los cambios localmente y vuelve a subir la carpeta actualizada desde la zona de despliegues del sitio de Netlify. La interfaz de Netlify puede cambiar ligeramente.

### Alternativa: Vercel

Vercel suele trabajar con un repositorio Git conectado. Si prefieres Vercel, crea un repositorio con los archivos de esta carpeta, impórtalo en Vercel, configura el proyecto como sitio estático sin comando de compilación y utiliza la carpeta raíz como salida. Puedes consultar la guía oficial aquí: <https://vercel.com/docs/git>.

## 12. Lista final antes de entregar a Cochi

- [ ] Cochi confirmó los precios y descripciones.
- [ ] Se sustituyeron todas las ilustraciones por fotos correctas o se acordó expresamente mantenerlas como ilustraciones.
- [ ] El logotipo y el isotipo están aprobados.
- [ ] Se probó el menú en un móvil real.
- [ ] Se probó el buscador y todas las categorías.
- [ ] Se comprobó el mensaje de pollo asado solo los domingos.
- [ ] El sitio usa una URL HTTPS pública.
- [ ] El QR abre la carta correcta en un teléfono con datos móviles.
- [ ] Se escaneó una prueba antes de imprimir el QR definitivo.

## Si algo deja de funcionar

1. No cambies muchos archivos al mismo tiempo.
2. Revisa `data/menu.js`: una coma o comilla borrada puede impedir que se cargue la carta.
3. Revisa el nombre y la ruta exacta de la foto en `image`.
4. Guarda con **Ctrl + S** y actualiza la página con **Ctrl + F5**.
5. Si me compartes la versión del ZIP y me dices qué archivo estabas editando, puedo ayudarte a corregirlo.
