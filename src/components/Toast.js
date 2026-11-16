/**
 * Notificaciones Toast no bloqueantes para retroalimentación al usuario
 * Cumple con Heurística Nielsen H1 (Visibilidad del estado del sistema)
 */

let toastTimeout = null;

export function mostrarToast(mensaje, tipo = 'exito', duracionMs = 3000) {
  let toastEl = document.getElementById('ecomapa-toast');
  
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.id = 'ecomapa-toast';
    toastEl.className = 'toast-container';
    document.body.appendChild(toastEl);
  }

  const iconos = {
    exito: '✔',
    info: 'ℹ',
    advertencia: '⚠',
    error: '✖'
  };

  toastEl.innerHTML = `
    <div class="toast-item toast-${tipo}">
      <span class="toast-icon">${iconos[tipo] || '✔'}</span>
      <span class="toast-message">${mensaje}</span>
    </div>
  `;

  toastEl.classList.add('visible');

  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toastTimeout = setTimeout(() => {
    toastEl.classList.remove('visible');
  }, duracionMs);
}
