/**
 * EcoMapa — Aplicación de Mapeo Colaborativo y Reciclaje Urbano
 * Universidad Católica Boliviana "San Pablo" — Sede Santa Cruz
 * Implementación de Tarea 1, Tarea 2 y Tarea 3
 */

import './styles/main.css';
import { CATEGORIAS_RESIDUO } from './data/tipos.js';
import materialesData from './data/materiales.json';
import { calcularDistanciaHaversine, calcularTiempoCaminata } from './utils/geo.js';
import { getPuntos, getFavoritos, toggleFavorito, getUsuario, sumarEcoPuntos } from './utils/storage.js';
import { formatearDistancia, formatearTiempo, capitalizar } from './utils/formatters.js';

// Coordenadas oficiales de origen: Campus UCB Santa Cruz (Av. Bush y Calle Puerto Rico)
const UBICACION_USUARIO = {
  nombre: 'Campus UCB (Tú)',
  lat: -17.7763,
  lng: -63.1951
};

// Estado reactivo de la aplicación
let filtroActivo = 'todos';
let puntos = getPuntos();
let favoritos = getFavoritos();
let usuario = getUsuario();

/**
 * Renderiza la interfaz en el contenedor raíz #app
 */
function renderApp() {
  const appContainer = document.getElementById('app');
  if (!appContainer) return;

  // Filtrado de puntos
  const puntosFiltrados = puntos.filter(pto => {
    if (filtroActivo === 'todos') return true;
    return pto.materiales && pto.materiales.includes(filtroActivo);
  });

  // Cálculo de distancias y tiempos para cada punto
  const puntosConDistancia = puntosFiltrados.map(pto => {
    const distancia = calcularDistanciaHaversine(UBICACION_USUARIO, pto);
    const tiempo = calcularTiempoCaminata(distancia);
    const esFav = favoritos.includes(pto.id);
    return { ...pto, distancia, tiempo, esFav };
  }).sort((a, b) => a.distancia - b.distancia);

  appContainer.innerHTML = `
    <div class="app-container">
      <!-- Encabezado Superior -->
      <header class="app-header">
        <div class="brand-section">
          <div class="brand-logo">🌿</div>
          <div>
            <div class="brand-title">EcoMapa</div>
            <div class="brand-subtitle">UCB Santa Cruz • ODS 12 y 13</div>
          </div>
        </div>
        <div class="user-badge" id="btn-sumar-puntos" title="Click para sumar EcoPuntos de prueba">
          <span>⭐</span>
          <span>${usuario.ecoPuntos} pts</span>
        </div>
      </header>

      <!-- Contenido Principal -->
      <main class="app-main">
        <!-- Banner de Validación del Sprint (Tareas 1, 2 y 3) -->
        <section class="sprint-badge">
          <div class="sprint-badge-header">
            <span class="text-h3" style="color: white;">Sprint 1 • Arquitectura Base</span>
            <span class="sprint-pill">Listo para Git</span>
          </div>
          <p class="text-caption" style="color: #E2E8F0;">
            Repositorio y estructura modular, dataset de puntos en Santa Cruz y funciones geodésicas (Haversine) operativas.
          </p>
          <div class="sprint-checklist">
            <span class="sprint-check-item">✔ Tarea 1: Base Vite & Modular</span>
            <span class="sprint-check-item">✔ Tarea 2: Dataset Real SCZ</span>
            <span class="sprint-check-item">✔ Tarea 3: Haversine & Storage</span>
          </div>
        </section>

        <!-- Barra de Filtros por Categoría de Residuo -->
        <section>
          <div style="margin-bottom: 8px;" class="text-caption">FILTRAR POR MATERIAL:</div>
          <div class="filter-bar">
            <button class="filter-chip ${filtroActivo === 'todos' ? 'active' : ''}" data-cat="todos">
              ♻ Todos (${puntos.length})
            </button>
            ${materialesData.map(mat => `
              <button class="filter-chip ${filtroActivo === mat.id ? 'active' : ''}" data-cat="${mat.id}">
                ${mat.icono} ${mat.nombre}
              </button>
            `).join('')}
          </div>
        </section>

        <!-- Lista de Puntos de Acopio Cercanos -->
        <section>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h2 class="text-h2">Puntos cercanos (${puntosConDistancia.length})</h2>
            <span class="text-caption">Desde Campus UCB</span>
          </div>

          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${puntosConDistancia.length === 0 ? `
              <div style="text-align: center; padding: 24px; color: var(--text-muted); background: white; border-radius: var(--radius-md);">
                No se encontraron puntos con el material seleccionado.
              </div>
            ` : puntosConDistancia.map(pto => `
              <article class="point-card" data-id="${pto.id}">
                <div class="point-card-header">
                  <div class="point-title-group">
                    <div class="point-title">
                      ${pto.nombre}
                      ${pto.verificadoUCB ? '<span title="Verificado por UCB Verde" style="color: var(--color-primary); font-size: 13px;">✔</span>' : ''}
                    </div>
                    <div class="point-address">${pto.direccion}</div>
                  </div>
                  <button class="fav-btn ${pto.esFav ? 'is-fav' : ''}" data-fav-id="${pto.id}" title="${pto.esFav ? 'Quitar de favoritos' : 'Guardar en favoritos'}">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="${pto.esFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                  </button>
                </div>

                <!-- Métricas calculadas con Tarea 3 (Haversine & Tiempo) -->
                <div class="point-meta">
                  <div class="point-distance">
                    <span>🚶 ${formatearDistancia(pto.distancia)}</span>
                    <span style="color: var(--text-muted); font-weight: normal;">• ${formatearTiempo(pto.tiempo)}</span>
                  </div>
                  <div class="point-status">
                    <span class="status-dot ${pto.estado}"></span>
                    <span>${pto.abierto ? 'Abierto' : 'Cerrado'}</span>
                  </div>
                </div>

                <!-- Materiales admitidos del dataset Tarea 2 -->
                <div class="materials-list">
                  ${pto.materiales.map(mat => `
                    <span class="material-tag ${mat}">${capitalizar(mat)}</span>
                  `).join('')}
                </div>
              </article>
            `).join('')}
          </div>
        </section>

        <!-- Caja de Verificación Técnica de Geodesia y Almacenamiento -->
        <section class="test-suite-card">
          <div class="test-suite-title">
            <span>⚙</span> Verificación en Localhost (Tarea 3)
          </div>
          <p style="color: var(--text-body); margin-bottom: 8px;">
            Origen geodésico: <strong>Campus UCB (-17.7763, -63.1951)</strong>. Cálculos de distancia generados matemáticamente mediante fórmula de Haversine con radio esférico WGS-84.
          </p>
          <div style="font-family: monospace; font-size: 11px; background: #F8F9FA; padding: 8px; border-radius: 4px; color: #2D3748;">
            <div>• Puntos en memoria: ${puntos.length}</div>
            <div>• Favoritos guardados: ${favoritos.length} (${favoritos.join(', ') || 'ninguno'})</div>
            <div>• Usuario activo: ${usuario.nombre} (${usuario.email})</div>
          </div>
        </section>
      </main>

      <!-- Barra de Navegación Inferior Móvil (Figma) -->
      <nav class="app-nav">
        <button class="nav-item active">
          <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          <span>Mapa</span>
        </button>
        <button class="nav-item">
          <svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          <span>Reportar</span>
        </button>
        <button class="nav-item">
          <svg viewBox="0 0 24 24"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>
          <span>Guía</span>
        </button>
        <button class="nav-item">
          <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          <span>Perfil</span>
        </button>
      </nav>
    </div>
  `;

  // Event Listeners: Filtros
  document.querySelectorAll('.filter-chip').forEach(btn => {
    btn.addEventListener('click', (e) => {
      filtroActivo = e.currentTarget.getAttribute('data-cat');
      renderApp();
    });
  });

  // Event Listeners: Favoritos
  document.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = e.currentTarget.getAttribute('data-fav-id');
      toggleFavorito(id);
      favoritos = getFavoritos();
      renderApp();
    });
  });

  // Event Listener: Sumar EcoPuntos
  const btnPuntos = document.getElementById('btn-sumar-puntos');
  if (btnPuntos) {
    btnPuntos.addEventListener('click', () => {
      usuario = sumarEcoPuntos(50);
      renderApp();
    });
  }
}

// Inicialización de la aplicación
renderApp();
