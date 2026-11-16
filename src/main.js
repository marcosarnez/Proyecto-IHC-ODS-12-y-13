/**
 * EcoMapa — Mapeo Colaborativo y Reciclaje Urbano (ODS 12 y 13)
 * Universidad Católica Boliviana "San Pablo" — Sede Santa Cruz
 * Integración de Tareas 1 a 6
 */

import './styles/main.css';
import { renderHeader, initHeaderEvents } from './components/Header.js';
import { renderBottomNav, initBottomNavEvents } from './components/BottomNav.js';
import { router } from './router.js';
import { renderMapView } from './views/MapView.js';
import { renderDetailView } from './views/DetailView.js';
import { renderRouteView } from './views/RouteView.js';
import { renderGuiaView } from './views/GuiaView.js';
import { renderPerfilView } from './views/PerfilView.js';
import { renderReportarView } from './views/ReportarView.js';

/**
 * Renderiza la vista activa dentro del contenedor principal
 */
function renderizarVista(ruta, params = {}) {
  const mainContainer = document.getElementById('main-view-content');
  const navContainer = document.getElementById('nav-container');
  if (!mainContainer) return;

  mainContainer.innerHTML = '';

  let vistaElemento = null;

  switch (ruta) {
    case 'mapa':
      vistaElemento = renderMapView(
        (puntoId, refrescar = false) => {
          if (refrescar) {
            renderizarVista('mapa');
          } else if (puntoId) {
            router.navegar('detalle', { puntoId });
          }
        }
      );
      break;

    case 'detalle':
      vistaElemento = renderDetailView(
        params.puntoId,
        () => router.navegar('mapa'),
        (puntoId) => router.navegar('ruta', { puntoId })
      );
      break;

    case 'ruta':
      vistaElemento = renderRouteView(
        params.puntoId,
        () => router.navegar('detalle', { puntoId: params.puntoId }),
        () => router.navegar('mapa')
      );
      break;

    case 'guia':
      vistaElemento = renderGuiaView();
      break;

    case 'perfil':
      vistaElemento = renderPerfilView();
      break;

    case 'reportar':
      vistaElemento = renderReportarView(() => router.navegar('mapa'));
      break;

    default:
      vistaElemento = renderMapView((id) => router.navegar('detalle', { puntoId: id }));
  }

  if (vistaElemento) {
    mainContainer.appendChild(vistaElemento);
  }

  // Actualizar BottomNav activo
  if (navContainer) {
    const tabActiva = ['mapa', 'reportar', 'guia', 'perfil'].includes(ruta) ? ruta : 'mapa';
    navContainer.innerHTML = renderBottomNav(tabActiva);
    initBottomNavEvents((destino) => router.navegar(destino));
  }
}

/**
 * Inicializa el Shell de la Aplicación
 */
function iniciarApp() {
  const root = document.getElementById('app');
  if (!root) return;

  root.innerHTML = `
    <div class="app-container">
      <!-- Header Superior Persistente -->
      <div id="header-container">
        ${renderHeader()}
      </div>

      <!-- Contenedor Principal de Vista -->
      <main class="app-main" id="main-view-content" role="main"></main>

      <!-- Barra de Navegación Inferior Persistente -->
      <div id="nav-container">
        ${renderBottomNav('mapa')}
      </div>
    </div>
  `;

  // Inicializar eventos de navegación
  initHeaderEvents((destino) => router.navegar(destino));
  initBottomNavEvents((destino) => router.navegar(destino));

  // Conectar con el enrutador
  router.suscribir((nuevaRuta, nuevosParams) => {
    renderizarVista(nuevaRuta, nuevosParams);
  });

  // Render inicial
  renderizarVista(router.rutaActual, router.parametros);
}

// Iniciar aplicación al cargar
iniciarApp();
