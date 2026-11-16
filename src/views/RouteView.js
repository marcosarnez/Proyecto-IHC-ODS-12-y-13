/**
 * Asistente de Navegación Peatonal Guiada (Figma Mid-Fi 03)
 * Muestra métrica de tiempo/distancia a pie y pasos numerados
 */

import { getPuntos, sumarEcoPuntos } from '../utils/storage.js';
import { formatearDistancia, formatearTiempo } from '../utils/formatters.js';
import { calcularDistanciaHaversine, calcularTiempoCaminata } from '../utils/geo.js';
import { COORD_UCB, trazarRuta, limpiarRuta } from '../components/Map.js';
import { mostrarToast } from '../components/Toast.js';

export function renderRouteView(puntoId, onCancelar, onLlegada) {
  const container = document.createElement('div');
  container.className = 'route-view-container';

  const puntos = getPuntos();
  const punto = puntos.find(p => p.id === puntoId) || puntos[0];

  const distancia = calcularDistanciaHaversine(COORD_UCB, [punto.lat, punto.lng]);
  const tiempo = calcularTiempoCaminata(distancia);

  // Pasos de caminata contextualizados a Santa Cruz
  const pasos = [
    {
      num: 1,
      titulo: 'Salida de la Universidad',
      instruccion: 'Sal por el portón principal de la UCB hacia la Av. Bush.',
      pista: 'Usa la acera derecha y mantén atención a la ciclovía.'
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
    <!-- Cabecera -->
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <button class="btn-back" id="btn-cancelar-ruta-top">
        ← Cancelar ruta
      </button>
      <span class="text-caption">Navegación Peatonal</span>
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

  // Trazar ruta en el mapa
  setTimeout(() => {
    trazarRuta(COORD_UCB, [punto.lat, punto.lng]);

    const handleCancelar = () => {
      limpiarRuta();
      if (onCancelar) onCancelar();
    };

    const btnCancelarTop = container.querySelector('#btn-cancelar-ruta-top');
    if (btnCancelarTop) btnCancelarTop.addEventListener('click', handleCancelar);

    const btnCancelar = container.querySelector('#btn-cancelar-ruta');
    if (btnCancelar) btnCancelar.addEventListener('click', handleCancelar);

    const btnLlegada = container.querySelector('#btn-completar-llegada');
    if (btnLlegada) {
      btnLlegada.addEventListener('click', () => {
        sumarEcoPuntos(50);
        limpiarRuta();
        mostrarToast('🎉 ¡Excelente! Sumaste +50 EcoPuntos por tu depósito', 'exito', 4000);
        if (onLlegada) onLlegada();
      });
    }
  }, 50);

  return container;
}
