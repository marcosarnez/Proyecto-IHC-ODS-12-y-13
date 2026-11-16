/**
 * Vista Principal: Mapa Interactivo y Drawer de Puntos Cercanos
 * Universidad Católica Boliviana "San Pablo" — EcoMapa
 */

import { renderFilterBar, initFilterBarEvents } from '../components/FilterBar.js';
import { inicializarMapa, centrarEnPunto, actualizarPinesMapa, COORD_UCB } from '../components/Map.js';
import { getPuntos, getFavoritos, toggleFavorito } from '../utils/storage.js';
import { calcularDistanciaHaversine, calcularTiempoCaminata } from '../utils/geo.js';
import { formatearDistancia, formatearTiempo, capitalizar } from '../utils/formatters.js';
import { mostrarToast } from '../components/Toast.js';

let filtroMaterial = 'todos';
let busquedaTexto = '';

export function renderMapView(onSelectPunto, userCoords = COORD_UCB) {
  const container = document.createElement('div');
  container.className = 'map-view-container';

  const puntosRaw = getPuntos();
  const favoritos = getFavoritos();

  // Calcular distancias
  const puntosConDistancia = puntosRaw.map(p => {
    const distancia = calcularDistanciaHaversine(userCoords, [p.lat, p.lng]);
    const tiempo = calcularTiempoCaminata(distancia);
    const esFav = favoritos.includes(p.id);
    return { ...p, distancia, tiempo, esFav };
  }).sort((a, b) => a.distancia - b.distancia);

  // Filtrar
  const puntosFiltrados = puntosConDistancia.filter(p => {
    const coincideMaterial = filtroMaterial === 'todos' || (p.materiales && p.materiales.includes(filtroMaterial));
    const coincideTexto = !busquedaTexto || 
      p.nombre.toLowerCase().includes(busquedaTexto) || 
      p.direccion.toLowerCase().includes(busquedaTexto);
    return coincideMaterial && coincideTexto;
  });

  container.innerHTML = `
    <!-- Filtros y Búsqueda -->
    ${renderFilterBar(filtroMaterial, busquedaTexto)}

    <!-- Contenedor del Mapa Leaflet -->
    <div class="map-card">
      <div id="leaflet-map"></div>
      <button class="btn-gps-float" id="btn-mi-ubicacion" title="Centrar en mi ubicación actual">
        🎯
      </button>
    </div>

    <!-- Lista / Panel de Puntos Cercanos -->
    <section>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
        <h2 class="text-h2">Puntos de acopio (${puntosFiltrados.length})</h2>
        <span class="text-caption">Cerca de Campus UCB</span>
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px;">
        ${puntosFiltrados.length === 0 ? `
          <div style="text-align: center; padding: 20px; background: white; border-radius: var(--radius-md); color: var(--text-muted);">
            No se encontraron contenedores con los filtros actuales.
          </div>
        ` : puntosFiltrados.map(pto => `
          <article class="point-card card-item" data-id="${pto.id}" style="cursor: pointer;">
            <div class="point-card-header">
              <div class="point-title-group">
                <div class="point-title">
                  ${pto.nombre}
                  ${pto.verificadoUCB ? '<span title="Verificado por UCB Verde" style="color: var(--color-primary); font-size: 13px;">✔</span>' : ''}
                </div>
                <div class="point-address">${pto.direccion}</div>
              </div>
              <button class="fav-btn ${pto.esFav ? 'is-fav' : ''}" data-fav="${pto.id}" title="${pto.esFav ? 'Quitar favorito' : 'Añadir favorito'}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="${pto.esFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>

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

            <div class="materials-list">
              ${pto.materiales.map(m => `<span class="material-tag ${m}">${capitalizar(m)}</span>`).join('')}
            </div>
          </article>
        `).join('')}
      </div>
    </section>
  `;

  // Inicializar eventos tras montaje
  setTimeout(() => {
    // Inicializar mapa
    inicializarMapa(puntosFiltrados, onSelectPunto, userCoords);

    // Eventos de filtros
    initFilterBarEvents(
      (nuevoFiltro) => {
        filtroMaterial = nuevoFiltro;
        if (onSelectPunto) onSelectPunto(null, true); // refrescar vista
      },
      (nuevoTexto) => {
        busquedaTexto = nuevoTexto;
        if (onSelectPunto) onSelectPunto(null, true);
      }
    );

    // Eventos de tarjetas (click para centrar o ver detalle)
    container.querySelectorAll('.card-item').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.fav-btn')) return;
        const id = card.getAttribute('data-id');
        const pto = puntosFiltrados.find(p => p.id === id);
        if (pto) {
          centrarEnPunto([pto.lat, pto.lng], 16);
          if (onSelectPunto) onSelectPunto(id);
        }
      });
    });

    // Eventos de favoritos
    container.querySelectorAll('.fav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-fav');
        const esAhoraFav = toggleFavorito(id);
        mostrarToast(esAhoraFav ? 'Punto guardado en favoritos ⭐' : 'Punto eliminado de favoritos', 'info');
        if (onSelectPunto) onSelectPunto(null, true);
      });
    });

    // Botón GPS
    const btnGps = container.querySelector('#btn-mi-ubicacion');
    if (btnGps) {
      btnGps.addEventListener('click', () => {
        if ('geolocation' in navigator) {
          btnGps.innerHTML = '⏳';
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              btnGps.innerHTML = '🎯';
              const coords = [pos.coords.latitude, pos.coords.longitude];
              centrarEnPunto(coords, 16);
              mostrarToast('Ubicación detectada por GPS', 'exito');
            },
            () => {
              btnGps.innerHTML = '🎯';
              centrarEnPunto(COORD_UCB, 15);
              mostrarToast('No se obtuvo GPS; centrado en Campus UCB', 'advertencia');
            },
            { timeout: 5000 }
          );
        } else {
          centrarEnPunto(COORD_UCB, 15);
        }
      });
    }
  }, 0);

  return container;
}
