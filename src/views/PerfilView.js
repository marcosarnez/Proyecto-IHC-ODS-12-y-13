/**
 * Vista de Perfil Universitario del Usuario (Valentina Roca — UCB)
 */

import { getUsuario, getFavoritos } from '../utils/storage.js';

export function renderPerfilView() {
  const usuario = getUsuario();
  const favoritos = getFavoritos();

  const container = document.createElement('div');
  container.className = 'profile-view-container';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '12px';

  container.innerHTML = `
    <div style="background: white; padding: 18px; border-radius: var(--radius-lg); border: 1px solid var(--border-color); text-align: center;">
      <div style="width: 64px; height: 64px; background: #E6F4EA; color: #137333; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 10px;">
        👩‍🎓
      </div>
      <h2 class="text-h2">${usuario.nombre}</h2>
      <p class="text-caption">${usuario.carrera} • ${usuario.semestre}</p>
      <p style="font-size: 11px; color: var(--color-primary); font-weight: 600;">${usuario.email}</p>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border-color);">
        <div style="background: var(--bg-subtle); padding: 8px; border-radius: 8px;">
          <div style="font-size: 16px; font-weight: 700; color: #C4A35A;">⭐ ${usuario.ecoPuntos}</div>
          <div style="font-size: 10px; color: var(--text-muted);">EcoPuntos</div>
        </div>
        <div style="background: var(--bg-subtle); padding: 8px; border-radius: 8px;">
          <div style="font-size: 16px; font-weight: 700; color: #1B7A6E;">♻ ${usuario.kgReciclados} kg</div>
          <div style="font-size: 10px; color: var(--text-muted);">Reciclados</div>
        </div>
        <div style="background: var(--bg-subtle); padding: 8px; border-radius: 8px;">
          <div style="font-size: 16px; font-weight: 700; color: #1B365D;">📍 ${favoritos.length}</div>
          <div style="font-size: 10px; color: var(--text-muted);">Favoritos</div>
        </div>
      </div>
    </div>

    <!-- Insignias UCB -->
    <div style="background: white; padding: 16px; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
      <h3 class="text-h3" style="margin-bottom: 8px;">🏅 Insignias Obtenidas</h3>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        ${usuario.insignias.map(ins => `
          <div style="display: flex; align-items: center; gap: 10px; padding: 8px; background: var(--bg-subtle); border-radius: 8px;">
            <span style="font-size: 20px;">${ins.icono}</span>
            <div>
              <strong style="font-size: 12px; color: var(--text-main);">${ins.nombre}</strong>
              <div style="font-size: 11px; color: var(--text-muted);">${ins.descripcion}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  return container;
}
