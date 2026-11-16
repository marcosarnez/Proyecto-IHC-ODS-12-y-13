/**
 * Vista de Guía Educativa ODS 12/13 y Calculadora de Impacto Ecológico
 * Universidad Católica Boliviana "San Pablo" — EcoMapa
 */

import { getSesionActual } from '../services/authService.js';
import { mostrarToast } from '../components/Toast.js';

export function renderGuiaView() {
  const container = document.createElement('div');
  container.className = 'guide-view-container';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '14px';

  container.innerHTML = `
    <!-- Encabezado con Badges ODS -->
    <div class="guide-card">
      <div>
        <div class="ods-badge-row" style="margin-bottom: 8px;">
          <span class="ods-pill ods-12">ODS 12: Producción y Consumo Responsable</span>
          <span class="ods-pill ods-13">ODS 13: Acción por el Clima</span>
        </div>
        <h2 class="text-h2" style="color: var(--color-secondary);">Manual de Reciclaje Urbano</h2>
        <p class="text-caption">Aprende a preparar tus residuos y calcula el ahorro de emisiones de CO₂ en Santa Cruz.</p>
      </div>
    </div>

    <!-- Calculadora Interactiva de Huella Ecológica -->
    <div class="calc-container">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3 class="text-h3" style="color: var(--color-primary); font-size: 14px;">🧮 Calculadora de Impacto Ambiental</h3>
        <span class="text-caption" style="font-weight: 700; color: #137333;">Simulador UCB</span>
      </div>
      <p class="text-caption" style="color: #2D3748;">
        Indica el material y la cantidad estimada que vas a depositar para conocer tu aporte al medio ambiente:
      </p>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 4px;">
        <div>
          <label class="form-label" style="font-size: 11px;">Material a depositar</label>
          <select id="calc-material-select" class="form-input" style="padding: 8px; font-size: 12px; cursor: pointer;">
            <option value="pet">🥤 Botellas Plásticas PET</option>
            <option value="vidrio">🍾 Botellas de Vidrio</option>
            <option value="carton">📦 Cajas de Cartón / Papel</option>
            <option value="aluminio">🥫 Latas de Aluminio</option>
            <option value="pilas">🔋 Pilas / Baterías RAEE</option>
          </select>
        </div>
        <div>
          <label class="form-label" style="font-size: 11px;">Cantidad (unidades)</label>
          <input type="number" id="calc-cantidad-input" class="form-input" value="10" min="1" max="500" style="padding: 8px; font-size: 12px;" />
        </div>
      </div>

      <!-- Métricas calculadas -->
      <div class="calc-results-grid">
        <div class="calc-result-box">
          <span class="calc-val" id="res-kg">0.35 kg</span>
          <span class="calc-lbl">Masa reciclada</span>
        </div>
        <div class="calc-result-box">
          <span class="calc-val" id="res-co2" style="color: #2B6CB0;">0.53 kg</span>
          <span class="calc-lbl">CO₂ evitado</span>
        </div>
        <div class="calc-result-box">
          <span class="calc-val" id="res-agua" style="color: #D69E2E;">8.4 L</span>
          <span class="calc-lbl">Agua ahorrada</span>
        </div>
      </div>

      <button type="button" class="btn-primary" id="btn-sumar-calculo" style="padding: 8px; font-size: 12px; margin-top: 6px;">
        ✨ Registrar este depósito en mi perfil
      </button>
    </div>

    <!-- Guía Didáctica por Material (Acordeones interactivos) -->
    <div class="guide-card">
      <h3 class="text-h3">📋 Guía de Separación Correcta</h3>
      <div style="display: flex; flex-direction: column; gap: 8px;">

        <div class="guide-accordion-item">
          <div class="guide-accordion-header" data-acc="1">
            <span>🥤 Plásticos PET (Envases de refresco y agua)</span>
            <span>▼</span>
          </div>
          <div class="guide-accordion-body" id="acc-body-1">
            <strong>Instrucciones:</strong>
            <ul style="padding-left: 18px; margin-top: 4px;">
              <li>Enjuaga el envase para eliminar restos de líquidos azucarados.</li>
              <li>Aplasta la botella firmemente (reduce el 70% del volumen en el contenedor).</li>
              <li>Deposita la tapa plástica junto al envase o en el contenedor de tapitas solidarias de la UCB.</li>
            </ul>
          </div>
        </div>

        <div class="guide-accordion-item">
          <div class="guide-accordion-header" data-acc="2">
            <span>🍾 Vidrio Transparente y Ámbar</span>
            <span>▼</span>
          </div>
          <div class="guide-accordion-body" id="acc-body-2" style="display: none;">
            <strong>Instrucciones:</strong>
            <ul style="padding-left: 18px; margin-top: 4px;">
              <li>Retira chapas o coronas metálicas antes de depositar.</li>
              <li>Introduce las botellas con cuidado sin romperlas por seguridad de los recolectores.</li>
              <li>No deposites espejos, cerámica, focos ni tubos fluorescentes en este contenedor.</li>
            </ul>
          </div>
        </div>

        <div class="guide-accordion-item">
          <div class="guide-accordion-header" data-acc="3">
            <span>📦 Papel y Cartón Limpio</span>
            <span>▼</span>
          </div>
          <div class="guide-accordion-body" id="acc-body-3" style="display: none;">
            <strong>Instrucciones:</strong>
            <ul style="padding-left: 18px; margin-top: 4px;">
              <li>El papel y cartón deben estar completamente secos y sin grasa.</li>
              <li>Desarma las cajas para maximizar el espacio útil del contenedor.</li>
              <li>Papel carbónico o servilletas usadas no son reciclables mediante este proceso.</li>
            </ul>
          </div>
        </div>

        <div class="guide-accordion-item">
          <div class="guide-accordion-header" data-acc="4">
            <span>🔋 Pilas y Residuos Electrónicos (RAEE)</span>
            <span>▼</span>
          </div>
          <div class="guide-accordion-body" id="acc-body-4" style="display: none;">
            <strong>Instrucciones:</strong>
            <ul style="padding-left: 18px; margin-top: 4px;">
              <li>Cubre los polos de las pilas de botón con cinta adhesiva antes de depositarlas.</li>
              <li>Nunca deseches pilas alcalinas junto a residuos húmedos ordinarios para proteger el suelo de Santa Cruz.</li>
              <li>Llévalas a los buzones especializados identificados con color morado.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  `;

  // Lógica de la Calculadora de Huella de Carbono
  setTimeout(() => {
    const matSelect = container.querySelector('#calc-material-select');
    const cantInput = container.querySelector('#calc-cantidad-input');
    const resKg = container.querySelector('#res-kg');
    const resCo2 = container.querySelector('#res-co2');
    const resAgua = container.querySelector('#res-agua');
    const btnSumar = container.querySelector('#btn-sumar-calculo');

    // Factores ambientales oficiales por unidad
    const factores = {
      pet: { pesoKg: 0.035, factorCo2: 1.5, factorAgua: 0.8 },
      vidrio: { pesoKg: 0.35, factorCo2: 0.3, factorAgua: 0.2 },
      carton: { pesoKg: 0.25, factorCo2: 0.9, factorAgua: 1.5 },
      aluminio: { pesoKg: 0.015, factorCo2: 9.0, factorAgua: 3.2 },
      pilas: { pesoKg: 0.025, factorCo2: 2.1, factorAgua: 4.0 }
    };

    const actualizarCalculo = () => {
      const mat = matSelect.value;
      const cant = Math.max(1, parseInt(cantInput.value, 10) || 1);
      const conf = factores[mat] || factores.pet;

      const kgTotal = (cant * conf.pesoKg).toFixed(2);
      const co2Total = (cant * conf.pesoKg * conf.factorCo2).toFixed(2);
      const aguaTotal = (cant * conf.factorAgua).toFixed(1);

      resKg.textContent = `${kgTotal} kg`;
      resCo2.textContent = `${co2Total} kg`;
      resAgua.textContent = `${aguaTotal} L`;

      return { kgTotal: parseFloat(kgTotal), co2Total: parseFloat(co2Total) };
    };

    if (matSelect && cantInput) {
      matSelect.addEventListener('change', actualizarCalculo);
      cantInput.addEventListener('input', actualizarCalculo);
      actualizarCalculo();
    }

    if (btnSumar) {
      btnSumar.addEventListener('click', () => {
        const { kgTotal, co2Total } = actualizarCalculo();
        const usr = getSesionActual();
        usr.kgReciclados = parseFloat(((usr.kgReciclados || 0) + kgTotal).toFixed(2));
        usr.co2PrevenidoKg = parseFloat(((usr.co2PrevenidoKg || 0) + co2Total).toFixed(2));
        usr.ecoPuntos = (usr.ecoPuntos || 0) + 25;
        localStorage.setItem('ecomapa_auth_session_v1', JSON.stringify(usr));

        mostrarToast(`¡Guardado! Sumaste ${kgTotal} kg y ganaste +25 EcoPuntos ⭐`, 'exito');
      });
    }

    // Acordeones interactivos
    container.querySelectorAll('.guide-accordion-header').forEach(hdr => {
      hdr.addEventListener('click', () => {
        const id = hdr.getAttribute('data-acc');
        const body = container.querySelector(`#acc-body-${id}`);
        if (body) {
          const isOpen = body.style.display !== 'none';
          body.style.display = isOpen ? 'none' : 'block';
          hdr.querySelector('span:last-child').textContent = isOpen ? '▼' : '▲';
        }
      });
    });
  }, 0);

  return container;
}
