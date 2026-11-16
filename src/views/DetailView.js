/**
 * Vista de Detalle del Punto de Acopio (Figma Mid-Fi 02)
 * Muestra horarios, materiales verificados, capacidad y opciones de ruta
 */

import { getPuntos, getFavoritos, toggleFavorito } from '../utils/storage.js';
import { formatearDistancia, formatearTiempo, capitalizar, obtenerEstadoCapacidad } from '../utils/formatters.js';
import { calcularDistanciaHaversine, calcularTiempoCaminata } from '../utils/geo.js';
import { COORD_UCB } from '../components/Map.js';
import { mostrarToast } from '../components/Toast.js';

export function renderDetailView(puntoId, onVolver, onIniciarRuta) {
  const container = document.createElement('div');
  container.className = 'detail-view-container';

  const puntos = getPuntos();
  const punto = puntos.find(p => p.id === puntoId) || puntos[0];
  const favoritos = getFavoritos();
  let esFav = favoritos.includes(punto.id);

  const distancia = calcularDistanciaHaversine(COORD_UCB, [punto.lat, punto.lng]);
  const tiempo = calcularTiempoCaminata(distancia);
  const estadoCapacidad = obtenerEstadoCapacidad(punto.capacidad || '30%');

  container.innerHTML = `
    <!-- Botón de regreso -->
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <button class="btn-back" id="btn-volver-mapa">
        ← Volver al mapa
      </button>
      <span class="text-caption">Detalle de Punto</span>
    </div>

    <!-- Ficha Principal -->
    <div class="detail-header-card">
      <div>
        <h2 class="detail-title">${punto.nombre}</h2>
        <p class="detail-address">📍 ${punto.direccion}</p>
      </div>

      <div class="detail-badges-row">
        <span class="badge-pill status-active">
          ● ${punto.abierto ? 'Operativo / Abierto' : 'Cerrado temporalmente'}
        </span>
        ${punto.verificadoUCB ? `
          <span class="badge-pill ucb-verified">
            🎓 Verificado UCB Verde
          </span>
        ` : ''}
        <span class="badge-pill" style="background: var(--bg-subtle); color: var(--text-body);">
          🚶 ${formatearDistancia(distancia)} • ${formatearTiempo(tiempo)}
        </span>
      </div>
    </div>

    <!-- Capacidad del Contenedor -->
    <div class="capacity-card">
      <div class="capacity-header">
        <span>Nivel de llenado actual</span>
        <span style="color: ${estadoCapacidad.color}; font-weight: 700;">
          ${punto.capacidad || '30%'} (${estadoCapacidad.etiqueta})
        </span>
      </div>
      <div class="progress-bar-bg">
        <div class="progress-bar-fill" style="width: ${punto.capacidad || '30%'}; background-color: ${estadoCapacidad.color};"></div>
      </div>
    </div>

    <!-- Horarios de Recepción -->
    <div class="detail-materials-card">
      <h3 class="text-h3">🕒 Horario de Atención</h3>
      <p class="text-body" style="font-weight: 500;">
        ${punto.horario || 'Lunes a Sábado: 08:00 – 18:00'}
      </p>
      <p class="text-caption" style="color: var(--text-muted);">
        Depósitos fuera de horario permitidos en buzones externos habilitados.
      </p>
    </div>

    <!-- Materiales Admitidos con Verificación -->
    <div class="detail-materials-card">
      <h3 class="text-h3">♻ Residuos Aceptados</h3>
      <div>
        ${punto.materiales.map(mat => `
          <div class="material-check-item">
            <span class="check-icon">✔</span>
            <div>
              <strong style="color: var(--text-main); font-size: 13px;">${capitalizar(mat)}</strong>
              <div style="font-size: 11px; color: var(--text-muted);">Limpio, seco y compactado</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Botones de Acción -->
    <div class="detail-actions-row">
      <button class="btn-primary" id="btn-iniciar-ruta">
        🧭 Cómo llegar
      </button>
      <button class="btn-secondary" id="btn-toggle-fav">
        ${esFav ? '⭐ Guardado' : '☆ Guardar'}
      </button>
    </div>
  `;

  // Event Listeners
  setTimeout(() => {
    const btnVolver = container.querySelector('#btn-volver-mapa');
    if (btnVolver && onVolver) {
      btnVolver.addEventListener('click', onVolver);
    }

    const btnRuta = container.querySelector('#btn-iniciar-ruta');
    if (btnRuta && onIniciarRuta) {
      btnRuta.addEventListener('click', () => onIniciarRuta(punto.id));
    }

    const btnFav = container.querySelector('#btn-toggle-fav');
    if (btnFav) {
      btnFav.addEventListener('click', () => {
        esFav = toggleFavorito(punto.id);
        btnFav.innerHTML = esFav ? '⭐ Guardado' : '☆ Guardar';
        mostrarToast(esFav ? 'Punto guardado en tus favoritos' : 'Punto retirado de favoritos', 'info');
      });
    }
  }, 0);

  return container;
}
