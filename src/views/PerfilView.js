/**
 * Vista de Perfil Universitario, Gestión de Sesión e Historial (Figma Hi-Fi 06)
 * Permite cambiar de estudiante, ver puntos favoritos y contenedores reportados
 */

import { getSesionActual, cerrarSesion } from '../services/authService.js';
import { getPuntos, getFavoritos, toggleFavorito } from '../utils/storage.js';
import { formatearDistancia } from '../utils/formatters.js';
import { renderLoginModal } from '../components/LoginModal.js';
import { router } from '../router.js';
import { mostrarToast } from '../components/Toast.js';

export function renderPerfilView() {
  const container = document.createElement('div');
  container.className = 'profile-view-container';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '14px';

  const usuario = getSesionActual();
  const todosLosPuntos = getPuntos();
  const idsFavoritos = getFavoritos();

  // Filtrar puntos favoritos
  const puntosFavoritos = todosLosPuntos.filter(p => idsFavoritos.includes(p.id));

  // Filtrar puntos reportados por la comunidad/usuario (aquellos con id que empieza en 'pto-usr')
  const puntosReportados = todosLosPuntos.filter(p => p.id && p.id.startsWith('pto-usr'));

  container.innerHTML = `
    <!-- Tarjeta de Identificación Institucional -->
    <div class="profile-card">
      <div class="profile-header-banner">
        <div class="profile-avatar">
          ${usuario.estaAutenticado === false ? '👤' : '👩‍🎓'}
        </div>
        <div style="flex: 1;">
          <h2 class="text-h2" style="font-size: 17px; color: var(--color-secondary);">${usuario.nombre}</h2>
          <p class="text-caption" style="color: var(--text-body); font-weight: 500;">
            ${usuario.carrera} • ${usuario.semestre || 'Campus UCB'}
          </p>
          <p style="font-size: 11px; color: var(--color-primary); font-weight: 600;">
            ${usuario.email}
          </p>
        </div>
      </div>

      <!-- Cuadrícula de Métricas -->
      <div class="profile-stats-grid">
        <div class="stat-box">
          <span class="stat-value" style="color: #C4A35A;">⭐ ${usuario.ecoPuntos}</span>
          <span class="stat-label">EcoPuntos</span>
        </div>
        <div class="stat-box">
          <span class="stat-value" style="color: var(--color-primary);">♻ ${usuario.kgReciclados || 14.5} kg</span>
          <span class="stat-label">Reciclados</span>
        </div>
        <div class="stat-box">
          <span class="stat-value" style="color: var(--color-secondary);">🌱 ${usuario.co2PrevenidoKg || 42.1} kg</span>
          <span class="stat-label">CO₂ Evitado</span>
        </div>
      </div>

      <!-- Botones de Acción de Cuenta -->
      <div style="display: flex; gap: 8px; margin-top: 4px;">
        <button class="btn-secondary" id="btn-cambiar-cuenta" style="flex: 1; font-size: 12px; padding: 7px;">
          🔄 Cambiar de cuenta UCB
        </button>
        <button class="btn-secondary" id="btn-cerrar-sesion" style="font-size: 12px; padding: 7px; color: var(--color-danger);">
          Salir
        </button>
      </div>
    </div>

    <!-- Puntos Favoritos Guardados -->
    <div class="profile-card">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3 class="text-h3">⭐ Mis Puntos Favoritos (${puntosFavoritos.length})</h3>
        <span class="text-caption">Acceso rápido</span>
      </div>

      <div style="display: flex; flex-direction: column; gap: 8px;">
        ${puntosFavoritos.length === 0 ? `
          <p class="text-caption" style="text-align: center; padding: 12px; color: var(--text-muted);">
            No tienes puntos guardados en favoritos aún.
          </p>
        ` : puntosFavoritos.map(pto => `
          <div class="fav-item-row">
            <div class="fav-item-info">
              <strong style="color: var(--text-main); font-size: 13px;">${pto.nombre}</strong>
              <span style="font-size: 11px; color: var(--text-muted);">${pto.direccion}</span>
            </div>
            <div style="display: flex; gap: 6px;">
              <button class="fav-action-btn btn-ir-detalle" data-id="${pto.id}">
                Ver
              </button>
              <button class="fav-action-btn btn-quitar-fav" data-id="${pto.id}" style="color: var(--color-danger);" title="Eliminar de favoritos">
                ✕
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Puntos Reportados por la Comunidad -->
    <div class="profile-card">
      <h3 class="text-h3">📍 Mis Contenedores Reportados (${puntosReportados.length})</h3>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        ${puntosReportados.length === 0 ? `
          <p class="text-caption" style="text-align: center; padding: 12px; color: var(--text-muted);">
            Aún no has reportado nuevos contenedores. Pulsa en "Reportar" para registrar uno y ganar 50 puntos.
          </p>
        ` : puntosReportados.map(pto => `
          <div class="fav-item-row">
            <div class="fav-item-info">
              <strong style="color: var(--text-main); font-size: 13px;">${pto.nombre}</strong>
              <span style="font-size: 11px; color: #137333; font-weight: 600;">● Publicado y activo en el mapa</span>
            </div>
            <button class="fav-action-btn btn-ir-detalle" data-id="${pto.id}">
              Ver en mapa
            </button>
          </div>
        `).join('')}
      </div>
    </div>

    <!-- Insignias Universitarias -->
    <div class="profile-card">
      <h3 class="text-h3">🏅 Insignias Universitarias UCB</h3>
      <div class="badges-container">
        ${(usuario.insignias || []).map(ins => `
          <div class="badge-card unlocked">
            <div class="badge-card-icon">${ins.icono}</div>
            <div>
              <strong style="font-size: 13px; color: var(--color-secondary);">${ins.nombre}</strong>
              <div style="font-size: 11px; color: var(--text-muted);">${ins.descripcion}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  setTimeout(() => {
    // Ver detalle de favorito
    container.querySelectorAll('.btn-ir-detalle').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        router.navegar('detalle', { puntoId: id });
      });
    });

    // Quitar favorito
    container.querySelectorAll('.btn-quitar-fav').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        toggleFavorito(id);
        mostrarToast('Punto retirado de tus favoritos', 'info');
        router.navegar('perfil'); // refresca vista
      });
    });

    // Cambiar de cuenta
    const btnCambiar = container.querySelector('#btn-cambiar-cuenta');
    if (btnCambiar) {
      btnCambiar.addEventListener('click', () => {
        const modal = renderLoginModal(
          () => router.navegar('perfil'),
          () => {}
        );
        document.body.appendChild(modal);
      });
    }

    // Cerrar sesión
    const btnSalir = container.querySelector('#btn-cerrar-sesion');
    if (btnSalir) {
      btnSalir.addEventListener('click', () => {
        cerrarSesion();
        mostrarToast('Has salido de tu cuenta institucional', 'info');
        router.navegar('perfil');
      });
    }
  }, 0);

  return container;
}
