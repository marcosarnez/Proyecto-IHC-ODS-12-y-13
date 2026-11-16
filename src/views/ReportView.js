/**
 * Vista de Formulario de Reporte Ciudadano (Figma Mid-Fi 04)
 * Permite registrar un nuevo punto de acopio con geolocalización y foto
 */

import materialesData from '../data/materiales.json';
import { COORD_UCB } from '../components/Map.js';
import { mostrarToast } from '../components/Toast.js';

export function renderReportView(onSubmitReporte, onVolver) {
  const container = document.createElement('div');
  container.className = 'report-view-container';

  container.innerHTML = `
    <!-- Barra superior -->
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <button class="btn-back" id="btn-cancelar-reporte">
        ← Cancelar
      </button>
      <span class="text-caption">Nuevo Reporte Comunitario</span>
    </div>

    <form id="form-reportar-punto" novalidate>
      <div class="report-card">
        <div>
          <h2 class="text-h2" style="color: var(--color-secondary);">Reportar Punto de Acopio</h2>
          <p class="text-caption">Tus datos ayudarán a mantener el mapa actualizado para toda la comunidad UCB.</p>
        </div>

        <!-- Paso 1: Ubicación -->
        <div class="form-group">
          <div class="report-step-title">
            <span class="report-step-num">1</span>
            <span>Ubicación del contenedor</span>
          </div>

          <label class="form-label" for="report-nombre">Nombre descriptivo o referencia *</label>
          <input 
            type="text" 
            id="report-nombre" 
            class="form-input" 
            placeholder="Ej. Contenedor Vidrio / PET Calle Puerto Rico" 
            required 
          />
          <span class="form-error-msg" id="error-nombre">El nombre debe tener al menos 3 caracteres.</span>

          <label class="form-label" for="report-direccion" style="margin-top: 8px;">Dirección o intersección *</label>
          <input 
            type="text" 
            id="report-direccion" 
            class="form-input" 
            placeholder="Ej. Av. Bush casi 2do Anillo (frente a UCB)" 
            required 
          />
          <span class="form-error-msg" id="error-direccion">Ingresa una dirección o referencia válida.</span>

          <!-- Botón de GPS -->
          <div style="margin-top: 8px; display: flex; flex-direction: column; gap: 6px;">
            <button type="button" class="gps-capture-btn" id="btn-capturar-gps">
              <span>📍</span>
              <span id="txt-gps">Capturar mi ubicación GPS actual</span>
            </button>
            <div class="gps-coords-badge" id="badge-coordenadas">
              Coordenadas: Lat <span id="val-lat">${COORD_UCB[0]}</span>, Lng <span id="val-lng">${COORD_UCB[1]}</span>
            </div>
            <span class="form-error-msg" id="error-coordenadas">Las coordenadas deben estar dentro del área urbana de Santa Cruz.</span>
          </div>
        </div>

        <!-- Paso 2: Materiales -->
        <div class="form-group">
          <div class="report-step-title">
            <span class="report-step-num">2</span>
            <span>Materiales que recibe *</span>
          </div>

          <div class="materials-grid" id="grid-materiales">
            ${materialesData.map(mat => `
              <label class="material-checkbox-label" data-mat="${mat.id}">
                <input type="checkbox" name="material" value="${mat.id}" style="accent-color: var(--color-primary);" />
                <span>${mat.icono} ${mat.nombre}</span>
              </label>
            `).join('')}
          </div>
          <span class="form-error-msg" id="error-materiales">Debes marcar al menos un tipo de residuo admitido.</span>
        </div>

        <!-- Paso 3: Estado y Horario -->
        <div class="form-group">
          <div class="report-step-title">
            <span class="report-step-num">3</span>
            <span>Estado operativo</span>
          </div>

          <label class="form-label" for="report-estado">Condición del contenedor</label>
          <select id="report-estado" class="form-input" style="cursor: pointer;">
            <option value="operativo">🟢 Operativo (Limpio y con espacio)</option>
            <option value="medio">🟡 Capacidad media (50% lleno)</option>
            <option value="lleno">🔴 Lleno (Requiere recojo)</option>
            <option value="danado">⚙ Dañado / Requiere mantenimiento</option>
          </select>
        </div>

        <!-- Paso 4: Evidencia Fotográfica -->
        <div class="form-group">
          <div class="report-step-title">
            <span class="report-step-num">4</span>
            <span>Fotografía de respaldo (Opcional)</span>
          </div>

          <input type="file" id="input-foto" accept="image/*" style="display: none;" />
          <div class="photo-dropzone" id="dropzone-foto">
            <span style="font-size: 28px;">📷</span>
            <strong style="font-size: 13px; color: var(--color-secondary);">Toca para subir o tomar una foto</strong>
            <span class="text-caption">Formatos JPG, PNG (máx. 5 MB)</span>
            <img id="preview-foto" class="photo-preview-img" alt="Vista previa del contenedor" />
          </div>
        </div>

        <!-- Botón de Envío -->
        <button type="submit" class="btn-primary" id="btn-submit-reporte" style="padding: 12px; font-size: 14px; margin-top: 8px;">
          🚀 Publicar Reporte (+50 EcoPuntos)
        </button>
      </div>
    </form>
  `;

  // Variables locales de coordenadas y foto
  let latActual = COORD_UCB[0];
  let lngActual = COORD_UCB[1];
  let fotoDataUrl = null;

  setTimeout(() => {
    // Evento volver
    const btnVolver = container.querySelector('#btn-cancelar-reporte');
    if (btnVolver && onVolver) {
      btnVolver.addEventListener('click', onVolver);
    }

    // Toggle visual de checkboxes
    container.querySelectorAll('.material-checkbox-label').forEach(lbl => {
      const chk = lbl.querySelector('input');
      chk.addEventListener('change', () => {
        lbl.classList.toggle('checked', chk.checked);
      });
    });

    // Captura GPS
    const btnGps = container.querySelector('#btn-capturar-gps');
    const txtGps = container.querySelector('#txt-gps');
    const valLat = container.querySelector('#val-lat');
    const valLng = container.querySelector('#val-lng');

    if (btnGps) {
      btnGps.addEventListener('click', () => {
        if ('geolocation' in navigator) {
          txtGps.textContent = 'Obteniendo GPS...';
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              latActual = parseFloat(pos.coords.latitude.toFixed(5));
              lngActual = parseFloat(pos.coords.longitude.toFixed(5));
              valLat.textContent = latActual;
              valLng.textContent = lngActual;
              txtGps.textContent = '¡Ubicación GPS capturada con éxito!';
              mostrarToast('GPS fijado con precisión', 'exito');
            },
            () => {
              latActual = COORD_UCB[0];
              lngActual = COORD_UCB[1];
              valLat.textContent = latActual;
              valLng.textContent = lngActual;
              txtGps.textContent = 'Ubicación fijada en Campus UCB';
              mostrarToast('No se obtuvo GPS satelital; usando Campus UCB', 'info');
            },
            { timeout: 6000 }
          );
        }
      });
    }

    // Carga de Fotografía
    const dropzone = container.querySelector('#dropzone-foto');
    const inputFoto = container.querySelector('#input-foto');
    const previewFoto = container.querySelector('#preview-foto');

    if (dropzone && inputFoto) {
      dropzone.addEventListener('click', () => inputFoto.click());

      inputFoto.addEventListener('change', (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (loadEvt) => {
            fotoDataUrl = loadEvt.target.result;
            previewFoto.src = fotoDataUrl;
            previewFoto.classList.add('visible');
            mostrarToast('Foto cargada correctamente', 'exito');
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Envío del formulario
    const form = container.querySelector('#form-reportar-punto');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const materialesSeleccionados = Array.from(
          container.querySelectorAll('input[name="material"]:checked')
        ).map(chk => chk.value);

        const nuevoPuntoData = {
          nombre: container.querySelector('#report-nombre').value.trim(),
          direccion: container.querySelector('#report-direccion').value.trim(),
          lat: latActual,
          lng: lngActual,
          materiales: materialesSeleccionados,
          estado: container.querySelector('#report-estado').value,
          foto: fotoDataUrl
        };

        if (onSubmitReporte) {
          onSubmitReporte(nuevoPuntoData);
        }
      });
    }
  }, 0);

  return container;
}
