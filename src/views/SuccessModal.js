/**
 * Modal de Confirmación de Reporte Exitoso (Figma Mid-Fi 05)
 * Informa el éxito, muestra la recompensa de EcoPuntos y permite ver el punto en el mapa
 */

export function renderSuccessModal(nuevoPunto, onVerEnMapa, onCerrar) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'success-modal-overlay';

  overlay.innerHTML = `
    <div class="success-modal-card">
      <div class="success-check-icon" aria-hidden="true">✔</div>

      <div>
        <h2 class="text-h2" style="color: var(--color-secondary); margin-bottom: 6px;">¡Punto Publicado!</h2>
        <p class="text-body" style="font-size: 13px;">
          Tu reporte <strong>"${nuevoPunto.nombre}"</strong> ha sido incorporado al mapa y ya es visible para la comunidad UCB.
        </p>
      </div>

      <div class="success-points-pill">
        <span>⭐</span>
        <span>+50 EcoPuntos Ganados</span>
      </div>

      <div class="success-actions">
        <button class="btn-primary" id="btn-modal-ver-mapa">
          🗺 Ver nuevo punto en el mapa
        </button>
        <button class="btn-secondary" id="btn-modal-cerrar">
          Volver a la vista principal
        </button>
      </div>
    </div>
  `;

  setTimeout(() => {
    const btnVer = overlay.querySelector('#btn-modal-ver-mapa');
    if (btnVer && onVerEnMapa) {
      btnVer.addEventListener('click', () => {
        overlay.remove();
        onVerEnMapa(nuevoPunto.id);
      });
    }

    const btnCerrar = overlay.querySelector('#btn-modal-cerrar');
    if (btnCerrar && onCerrar) {
      btnCerrar.addEventListener('click', () => {
        overlay.remove();
        onCerrar();
      });
    }
  }, 0);

  return overlay;
}
