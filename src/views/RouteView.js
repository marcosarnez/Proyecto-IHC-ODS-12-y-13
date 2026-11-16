/**
 * Asistente de Navegación Peatonal Guiada (Figma Mid-Fi 03)
 * Muestra el mapa interactivo con la trayectoria trazada, métricas y pasos a pie
 */

import L from 'leaflet';
import { getPuntos, sumarEcoPuntos } from '../utils/storage.js';
import { formatearDistancia, formatearTiempo } from '../utils/formatters.js';
import { calcularDistanciaHaversine, calcularTiempoCaminata } from '../utils/geo.js';
import { COORD_UCB } from '../components/Map.js';
import { mostrarToast } from '../components/Toast.js';

let routeMapInstance = null;

export function renderRouteView(puntoId, onCancelar, onLlegada) {
  const container = document.createElement('div');
  container.className = 'route-view-container';

  const puntos = getPuntos();
  const punto = puntos.find(p => p.id === puntoId) || puntos[0];

  const distancia = calcularDistanciaHaversine(COORD_UCB, [punto.lat, punto.lng]);
  const tiempo = calcularTiempoCaminata(distancia);

  // Pasos de caminata contextualizados a Santa Cruz (Zona Norte / Campus UCB)
  const pasos = [
    {
      num: 1,
      titulo: 'Salida de la Universidad',
      instruccion: 'Sal por el acceso principal del Campus UCB Norte hacia la Av. Cristo Redentor.',
      pista: 'Usa la acera lateral peatonal y mantén precaución al cruzar.'
    },
    {
      num: 2,
      titulo: 'Avance hacia el punto',
      instruccion: `Camina aproximadamente ${formatearDistancia(distancia * 0.7)} en dirección hacia ${punto.direccion}.`,
      pista: 'Cruce seguro por paso de cebra peatonal.'
    },
    {
      num: 3,
      titulo: 'Llegada al Contenedor',
      instruccion: `El contenedor de reciclaje de ${punto.nombre} está a la vista.`,
      pista: 'Verifica los compartimentos según el tipo de material.'
    }
  ];

  container.innerHTML = `
    <!-- Cabecera de Navegación -->
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <button class="btn-back" id="btn-cancelar-ruta-top">
        ← Cancelar ruta
      </button>
      <span class="text-caption">Navegación Peatonal</span>
    </div>

    <!-- Mapa Interactivo con la Trayectoria de la Ruta -->
    <div class="map-card" style="height: 240px; position: relative; border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-sm);">
      <div id="route-map" style="width: 100%; height: 100%;"></div>
    </div>

    <!-- Banner de Resumen de Recorrido (Hi-Fi 03) -->
    <div class="route-summary-banner">
      <div>
        <div class="route-time-big">${formatearTiempo(tiempo)}</div>
        <div class="route-dist-label">Distancia a pie: ${formatearDistancia(distancia)}</div>
        <div style="font-size: 11px; color: #E2E8F0; margin-top: 4px;">Destino: ${punto.nombre}</div>
      </div>
      <div class="route-icon-badge">🚶</div>
    </div>

    <!-- Lista de Instrucciones Paso a Paso -->
    <div class="route-timeline">
      ${pasos.map((paso, idx) => `
        <div class="timeline-step">
          <div class="step-number ${idx === pasos.length - 1 ? 'final' : ''}">${paso.num}</div>
          <div class="step-content">
            <span class="text-caption" style="color: var(--color-primary); font-weight: 700;">PASO ${paso.num}</span>
            <div class="step-instruction">${paso.instruccion}</div>
            <div class="step-hint">${paso.pista}</div>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Botones de Acción -->
    <div class="route-actions-col">
      <button class="btn-primary" id="btn-completar-llegada">
        ✔ ¡He llegado al contenedor! (+50 pts)
      </button>
      <button class="btn-secondary" id="btn-cancelar-ruta">
        Cancelar navegación
      </button>
    </div>
  `;

  // Inicializar mapa de ruta y trazar la polilínea
  setTimeout(() => {
    const mapEl = container.querySelector('#route-map');
    if (!mapEl) return;

    if (routeMapInstance) {
      try {
        routeMapInstance.remove();
      } catch (e) {}
      routeMapInstance = null;
    }

    // Crear mapa centrado en el punto medio
    routeMapInstance = L.map(mapEl, {
      zoomControl: false,
      attributionControl: false
    });

    // Mosaicos oficiales OpenStreetMap
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(routeMapInstance);

    L.control.zoom({ position: 'topright' }).addTo(routeMapInstance);

    // Marcador de origen (Campus UCB Norte)
    const origenIcon = L.divIcon({
      className: 'user-pulse-container',
      html: `
        <div class="pin-bubble ucb" style="width: 32px; height: 32px;" title="Inicio: Campus UCB Norte">
          <span style="font-size: 14px;">🎓</span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });
    L.marker(COORD_UCB, { icon: origenIcon }).addTo(routeMapInstance).bindPopup('<strong>Tu origen:</strong><br>Campus UCB Norte (Km 9)');

    // Marcador de destino (Punto de reciclaje)
    const destinoIcon = L.divIcon({
      className: 'custom-pin-eco',
      html: `
        <div class="pin-bubble" style="width: 32px; height: 32px;" title="${punto.nombre}">
          <span style="font-size: 14px;">♻</span>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32]
    });
    L.marker([punto.lat, punto.lng], { icon: destinoIcon }).addTo(routeMapInstance).bindPopup(`<strong>Destino:</strong><br>${punto.nombre}`);

    // Trazar polilínea de la trayectoria peatonal
    const polyline = L.polyline([COORD_UCB, [punto.lat, punto.lng]], {
      color: '#1B7A6E',
      weight: 6,
      opacity: 0.9,
      dashArray: '8, 8',
      lineCap: 'round'
    }).addTo(routeMapInstance);

    // Ajustar el zoom automáticamente para que quepa todo el recorrido con margen
    routeMapInstance.fitBounds(polyline.getBounds(), { padding: [40, 40] });

    // Eventos de botones
    const limpiarYSalir = (callback) => {
      if (routeMapInstance) {
        try { routeMapInstance.remove(); } catch (e) {}
        routeMapInstance = null;
      }
      if (callback) callback();
    };

    const btnCancelarTop = container.querySelector('#btn-cancelar-ruta-top');
    if (btnCancelarTop) {
      btnCancelarTop.addEventListener('click', () => limpiarYSalir(onCancelar));
    }

    const btnCancelar = container.querySelector('#btn-cancelar-ruta');
    if (btnCancelar) {
      btnCancelar.addEventListener('click', () => limpiarYSalir(onCancelar));
    }

    const btnLlegada = container.querySelector('#btn-completar-llegada');
    if (btnLlegada) {
      btnLlegada.addEventListener('click', () => {
        sumarEcoPuntos(50);
        mostrarToast('🎉 ¡Excelente! Sumaste +50 EcoPuntos por tu depósito', 'exito', 4000);
        limpiarYSalir(onLlegada);
      });
    }
  }, 50);

  return container;
}
