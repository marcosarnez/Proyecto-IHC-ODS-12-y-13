/**
 * EcoMapa — Mapeo Colaborativo y Reciclaje Urbano (ODS 12 y 13)
 * Universidad Católica Boliviana "San Pablo" — Sede Santa Cruz
 * Integración Completa de Tareas 1 a 9
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
import { renderReportView } from './views/ReportView.js';
import { validarFormularioReporte, aplicarErroresVisuales } from './services/validationService.js';
import { renderSuccessModal } from './views/SuccessModal.js';
import { estaAutenticado } from './services/authService.js';
import { renderLoginModal } from './components/LoginModal.js';
import { guardarNuevoPunto, sumarEcoPuntos } from './utils/storage.js';
import { mostrarToast } from './components/Toast.js';
import { ejecutarPruebasSistema } from './utils/tests.js';

/**
 * Renderiza la vista activa dentro del contenedor principal
 */
function renderizarVista(ruta, params = {}) {
  const mainContainer = document.getElementById('main-view-content');
  const headerContainer = document.getElementById('header-container');
  const navContainer = document.getElementById('nav-container');
  if (!mainContainer) return;

  mainContainer.innerHTML = '';

  // Actualizar Header reactivamente
  if (headerContainer) {
    headerContainer.innerHTML = renderHeader();
    initHeaderEvents((destino) => router.navegar(destino));
  }

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
      // Control de acceso universitario (Tarea 9)
      if (!estaAutenticado()) {
        const modalLogin = renderLoginModal(
          () => {
            renderizarVista('reportar');
          },
          () => {
            router.navegar('mapa');
            mostrarToast('Se requiere cuenta @ucb.edu.bo para publicar reportes', 'advertencia');
          }
        );
        document.body.appendChild(modalLogin);
        return;
      }

      // Renderiza formulario con validación H6 (Tarea 7 y 8)
      vistaElemento = renderReportView(
        (nuevoPuntoData) => {
          // Validación preventiva Nielsen H6
          const res = validarFormularioReporte(nuevoPuntoData);
          if (!res.esValido) {
            aplicarErroresVisuales(vistaElemento, res.errores);
            mostrarToast('Corrige los campos marcados en rojo antes de enviar', 'error');
            return;
          }

          // Guardar y premiar con EcoPuntos
          const puntosActualizados = guardarNuevoPunto(nuevoPuntoData);
          sumarEcoPuntos(50);
          const puntoGuardado = puntosActualizados[0];

          // Mostrar modal de confirmación Hi-Fi 05
          const modalExito = renderSuccessModal(
            puntoGuardado,
            (id) => router.navegar('detalle', { puntoId: id }),
            () => router.navegar('mapa')
          );
          document.body.appendChild(modalExito);
        },
        () => router.navegar('mapa')
      );
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
ejecutarPruebasSistema();
