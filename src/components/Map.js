/**
 * Módulo de integración cartográfica con Leaflet.js
 * Centrado en Campus UCB Santa Cruz (Av. Bush / 2do Anillo)
 */

import L from 'leaflet';
import { formatearDistancia } from '../utils/formatters.js';

let mapInstance = null;
let markersLayer = null;
let routePolyline = null;
let userMarker = null;

// Coordenadas oficiales de origen: Campus UCB Santa Cruz
export const COORD_UCB = [-17.7763, -63.1951];

/**
 * Inicializa o re-inicializa el mapa en el elemento #leaflet-map
 * @param {Array<Object>} puntos 
 * @param {Function} onSelectPunto 
 * @param {[number, number]} userCoords 
 */
export function inicializarMapa(puntos = [], onSelectPunto = null, userCoords = COORD_UCB) {
  const container = document.getElementById('leaflet-map');
  if (!container) return;

  // Limpiar cualquier referencia previa
  if (container._leaflet_id) {
    container._leaflet_id = null;
  }
  if (mapInstance) {
    try {
      mapInstance.remove();
    } catch (e) {
      // Ignorar si ya fue removido
    }
    mapInstance = null;
  }

  // Instanciar mapa centrado en Santa Cruz / Campus UCB
  mapInstance = L.map('leaflet-map', {
    zoomControl: false,
    attributionControl: false
  }).setView(userCoords, 15);

  // Capa de mosaicos moderna y limpia (CartoDB Positron)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    subdomains: 'abcd'
  }).addTo(mapInstance);

  // Controles de zoom compactos
  L.control.zoom({ position: 'topright' }).addTo(mapInstance);

  // Capa para marcadores
  markersLayer = L.layerGroup().addTo(mapInstance);

  // Marcador de ubicación del usuario
  actualizarMarcadorUsuario(userCoords);

  // Cargar pines de los puntos
  actualizarPinesMapa(puntos, onSelectPunto);

  return mapInstance;
}

/**
 * Renderiza los marcadores SVG para la lista de puntos
 * @param {Array<Object>} puntos 
 * @param {Function} onSelectPunto 
 */
export function actualizarPinesMapa(puntos = [], onSelectPunto = null) {
  if (!mapInstance || !markersLayer) return;

  markersLayer.clearLayers();

  puntos.forEach(pto => {
    const coords = [pto.lat, pto.lng];
    
    // Icono SVG personalizado
    const customIcon = L.divIcon({
      className: 'custom-pin-eco',
      html: `
        <div class="pin-bubble ${pto.verificadoUCB ? 'ucb' : ''}" title="${pto.nombre}">
          <span>${pto.verificadoUCB ? '🎓' : '♻'}</span>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -32]
    });

    const marker = L.marker(coords, { icon: customIcon });

    // Popup informativo interactivo
    const popupHtml = `
      <div style="font-family: 'Inter', sans-serif; font-size: 12px; line-height: 1.4; min-width: 160px;">
        <strong style="color: #1B365D; font-size: 13px; display: block; margin-bottom: 2px;">${pto.nombre}</strong>
        <div style="color: #718096; margin-bottom: 6px;">${pto.direccion}</div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="color: #1B7A6E; font-weight: 600;">● ${pto.abierto ? 'Abierto' : 'Cerrado'}</span>
          <span style="background: #EDF2F7; padding: 2px 6px; border-radius: 4px; font-weight: 600;">${formatearDistancia(pto.distancia)}</span>
        </div>
        <button id="btn-popup-${pto.id}" style="width: 100%; background: #1B7A6E; color: white; border: none; padding: 6px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer;">
          Ver Detalle Completo →
        </button>
      </div>
    `;

    marker.bindPopup(popupHtml);

    marker.on('popupopen', () => {
      const btn = document.getElementById(`btn-popup-${pto.id}`);
      if (btn && onSelectPunto) {
        btn.addEventListener('click', () => {
          onSelectPunto(pto.id);
        });
      }
    });

    marker.on('click', () => {
      mapInstance.panTo(coords);
    });

    markersLayer.addLayer(marker);
  });
}

/**
 * Centra el mapa en un punto específico
 * @param {[number, number]} coords 
 * @param {number} zoom 
 */
export function centrarEnPunto(coords, zoom = 16) {
  if (mapInstance && coords) {
    mapInstance.flyTo(coords, zoom, { duration: 1.2 });
  }
}

/**
 * Actualiza la posición del pulso del usuario
 * @param {[number, number]} coords 
 */
export function actualizarMarcadorUsuario(coords) {
  if (!mapInstance) return;

  if (userMarker) {
    userMarker.setLatLng(coords);
  } else {
    const userIcon = L.divIcon({
      className: 'user-pulse-container',
      html: `<div class="user-pulse-marker" title="Tu ubicación (Campus UCB)"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });
    userMarker = L.marker(coords, { icon: userIcon, zIndexOffset: 1000 }).addTo(mapInstance);
  }
}

/**
 * Traza una polilínea de ruta entre usuario y punto de reciclaje
 * @param {[number, number]} origen 
 * @param {[number, number]} destino 
 */
export function trazarRuta(origen, destino) {
  if (!mapInstance) return;
  limpiarRuta();

  // Polilínea estilizada con color Teal y trazado discontinuo
  routePolyline = L.polyline([origen, destino], {
    color: '#1B7A6E',
    weight: 5,
    opacity: 0.85,
    dashArray: '8, 8',
    lineCap: 'round'
  }).addTo(mapInstance);

  mapInstance.fitBounds(routePolyline.getBounds(), { padding: [50, 50] });
}

/**
 * Elimina la polilínea de ruta actual
 */
export function limpiarRuta() {
  if (routePolyline && mapInstance) {
    mapInstance.removeLayer(routePolyline);
    routePolyline = null;
  }
}
