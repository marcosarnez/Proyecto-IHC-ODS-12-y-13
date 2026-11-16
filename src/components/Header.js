/**
 * Header Institucional de EcoMapa
 * Muestra imagotipo, subtítulo UCB y badge dinámico de EcoPuntos
 */

import { getUsuario } from '../utils/storage.js';

export function renderHeader() {
  const usuario = getUsuario();

  return `
    <header class="app-header" id="app-header">
      <div class="brand-section">
        <div class="brand-logo" aria-hidden="true">🌿</div>
        <div>
          <h1 class="brand-title">EcoMapa</h1>
          <p class="brand-subtitle">UCB Santa Cruz • ODS 12 y 13</p>
        </div>
      </div>
      <button class="user-badge" id="btn-header-profile" title="Ver mi perfil universitario y EcoPuntos" aria-label="EcoPuntos acumulados: ${usuario.ecoPuntos}">
        <span class="user-badge-icon">⭐</span>
        <span class="user-badge-points" id="header-ecopuntos">${usuario.ecoPuntos}</span>
        <span class="user-badge-unit">pts</span>
      </button>
    </header>
  `;
}

export function initHeaderEvents(onNavigate) {
  const btnProfile = document.getElementById('btn-header-profile');
  if (btnProfile && onNavigate) {
    btnProfile.addEventListener('click', () => {
      onNavigate('perfil');
    });
  }
}
