/**
 * Vista Principal: Mapa Interactivo y Drawer de Puntos Cercanos
 * Universidad Católica Boliviana "San Pablo" — EcoMapa (Campus Norte)
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

  // Función para obtener puntos procesados con distancias y filtros actuales
  function obtenerPuntosProcesados() {
    const puntosRaw = getPuntos();
    const favoritos = getFavoritos();

    const puntosConDistancia = puntosRaw.map(p => {
      const distancia = calcularDistanciaHaversine(userCoords, [p.lat, p.lng]);
      const tiempo = calcularTiempoCaminata(distancia);
      const esFav = favoritos.includes(p.id);
      return { ...p, distancia, tiempo, esFav };
    }).sort((a, b) => a.distancia - b.distancia);

    return puntosConDistancia.filter(p => {
      const coincideMaterial = filtroMaterial === 'todos' || (p.materiales && p.materiales.includes(filtroMaterial));
      const coincideTexto = !busquedaTexto || 
        p.nombre.toLowerCase().includes(busquedaTexto) || 
        p.direccion.toLowerCase().includes(busquedaTexto);
      return coincideMaterial && coincideTexto;
    });
  }

  // Genera el HTML de las tarjetas de puntos
  function generarHTMLTarjetas(puntos) {
    if (puntos.length === 0) {
      return `
        <div style="text-align: center; padding: 24px; background: white; border-radius: var(--radius-md); color: var(--text-muted);">
          No se encontraron contenedores con los filtros actuales.
        </div>
      `;
    }

    return puntos.map(pto => `
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
    `).join('');
  }

  // Conecta los eventos de clic en las tarjetas de forma inmutable
  function enlazarEventosTarjetas(puntos) {
    container.querySelectorAll('.card-item').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.fav-btn')) return;
        const id = card.getAttribute('data-id');
        const pto = puntos.find(p => p.id === id);
        if (pto) {
          centrarEnPunto([pto.lat, pto.lng], 16);
          if (onSelectPunto) onSelectPunto(id);
        }
      });
    });

    container.querySelectorAll('.fav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-fav');
        const esAhoraFav = toggleFavorito(id);
        mostrarToast(esAhoraFav ? 'Punto guardado en favoritos ⭐' : 'Punto eliminado de favoritos', 'info');
        actualizarVistaEnVivo();
      });
    });
  }

  // Actualización en vivo sin destruir el input ni perder el foco del teclado
  function actualizarVistaEnVivo() {
    const puntos = obtenerPuntosProcesados();
    
    // Actualizar encabezado del contador
    const contador = container.querySelector('#contador-puntos-texto');
    if (contador) {
      contador.textContent = `Puntos de acopio (${puntos.length})`;
    }

    // Actualizar lista de tarjetas
    const lista = container.querySelector('#contenedor-lista-puntos');
    if (lista) {
      lista.innerHTML = generarHTMLTarjetas(puntos);
      enlazarEventosTarjetas(puntos);
    }

    // Actualizar pines del mapa
    actualizarPinesMapa(puntos, onSelectPunto);
  }

  const puntosIniciales = obtenerPuntosProcesados();

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
        <h2 class="text-h2" id="contador-puntos-texto">Puntos de acopio (${puntosIniciales.length})</h2>
        <span class="text-caption">Cerca de Campus UCB Norte</span>
      </div>

      <div id="contenedor-lista-puntos" style="display: flex; flex-direction: column; gap: 10px;">
        ${generarHTMLTarjetas(puntosIniciales)}
      </div>
    </section>
  `;

  // Inicializar eventos tras montaje
  setTimeout(() => {
    // Inicializar mapa centrado en Campus Norte
    inicializarMapa(puntosIniciales, onSelectPunto, userCoords);
    enlazarEventosTarjetas(puntosIniciales);

    // Eventos de barra de filtros y búsqueda (SIN DESTRUIR EL INPUT NI PERDER EL FOCO)
    initFilterBarEvents(
      (nuevoFiltro) => {
        filtroMaterial = nuevoFiltro;
        actualizarVistaEnVivo();
      },
      (nuevoTexto) => {
        busquedaTexto = nuevoTexto;
        actualizarVistaEnVivo();
      }
    );

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
              mostrarToast('No se obtuvo GPS; centrado en Campus UCB Norte', 'advertencia');
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
