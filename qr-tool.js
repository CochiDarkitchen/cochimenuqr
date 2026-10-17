(function () {
  'use strict';
  const $ = (selector) => document.querySelector(selector);
  const input = $('#qr-public-url');
  const generateButton = $('#qr-generate');
  const canvas = $('#qr-canvas');
  const emptyArt = $('#qr-empty-art');
  const status = $('#qr-tool-status');
  const downloadButton = $('#qr-download');
  const previewLink = $('#qr-preview-link');
  const previewLabel = $('#qr-preview-label');
  let lastUrl = '';

  if (window.location.protocol !== 'file:' && window.location.pathname.endsWith('/qr.html')) {
    const home = new URL('./', window.location.href);
    input.value = home.toString();
  }

  function getUrl() {
    const raw = input.value.trim();
    if (!raw) throw new Error('Escribe primero la URL pública del menú.');
    let url;
    try { url = new URL(raw); } catch (_) { throw new Error('La URL no parece válida. Asegúrate de incluir https://'); }
    if (!['http:', 'https:'].includes(url.protocol)) throw new Error('La dirección debe empezar con http:// o https://');
    if (url.protocol !== 'https:' && !['localhost', '127.0.0.1'].includes(url.hostname)) {
      throw new Error('Para un menú público real, utiliza una dirección HTTPS segura.');
    }
    url.hash = '';
    return url.toString();
  }

  function resetPreview(message) {
    canvas.hidden = true;
    emptyArt.hidden = false;
    downloadButton.disabled = true;
    previewLink.hidden = true;
    lastUrl = '';
    if (message) status.textContent = message;
  }

  function generate() {
    if (!window.ENMAQRCode || typeof window.ENMAQRCode.createMatrix !== 'function') {
      resetPreview('No se cargó el generador QR local. Comprueba que exista vendor/qrcode-lite.js.');
      return;
    }
    try {
      const url = getUrl();
      const matrix = window.ENMAQRCode.createMatrix(url);
      window.ENMAQRCode.drawMatrix(canvas, matrix, 520, 4);
      canvas.hidden = false;
      emptyArt.hidden = true;
      downloadButton.disabled = false;
      previewLink.href = url;
      previewLink.hidden = false;
      previewLabel.textContent = 'QR listo · verifica la URL antes de imprimir';
      status.textContent = 'QR generado en este navegador. No se ha enviado la dirección a ningún servicio.';
      lastUrl = url;
    } catch (error) {
      resetPreview(error.message || 'No se pudo generar el QR. Revisa la dirección.');
    }
  }

  generateButton.addEventListener('click', generate);
  input.addEventListener('input', () => resetPreview('La dirección cambió. Genera el código otra vez para actualizarlo.'));
  downloadButton.addEventListener('click', () => {
    if (!lastUrl || canvas.hidden) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'QR-Cochi-menu.png';
    document.body.appendChild(link);
    link.click();
    link.remove();
    status.textContent = 'Descarga preparada. Escanea el PNG descargado antes de imprimirlo.';
  });
})();
