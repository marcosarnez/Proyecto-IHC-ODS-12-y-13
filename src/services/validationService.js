/**
 * Servicio de Validación Preventiva (Heurística Nielsen H6: Prevención de Errores)
 * Evita el envío de reportes incompletos o fuera de los límites de Santa Cruz
 */

import { estaEnRangoSantaCruz } from '../utils/geo.js';

/**
 * Valida integralmente el formulario de reporte de un nuevo punto
 * @param {Object} datos 
 * @returns {{ esValido: boolean, errores: Object }}
 */
export function validarFormularioReporte(datos) {
  const errores = {};

  // 1. Validación de Nombre (H6 / H9)
  if (!datos.nombre || typeof datos.nombre !== 'string' || datos.nombre.trim().length < 3) {
    errores.nombre = 'El nombre o referencia debe tener al menos 3 caracteres.';
  }

  // 2. Validación de Dirección / Referencia
  if (!datos.direccion || typeof datos.direccion !== 'string' || datos.direccion.trim().length < 4) {
    errores.direccion = 'Ingresa una calle, avenida o referencia clara.';
  }

  // 3. Validación de Coordenadas Geográficas (Geocerca de Santa Cruz)
  if (typeof datos.lat !== 'number' || typeof datos.lng !== 'number' || !estaEnRangoSantaCruz(datos.lat, datos.lng)) {
    errores.coordenadas = 'Las coordenadas están fuera del radio urbano de Santa Cruz de la Sierra.';
  }

  // 4. Validación de Categorías de Residuos
  if (!Array.isArray(datos.materiales) || datos.materiales.length === 0) {
    errores.materiales = 'Debes seleccionar al menos un tipo de residuo aceptado.';
  }

  return {
    esValido: Object.keys(errores).length === 0,
    errores
  };
}

/**
 * Muestra u oculta los mensajes de error inline en el formulario
 * @param {HTMLElement} formContainer 
 * @param {Object} errores 
 */
export function aplicarErroresVisuales(formContainer, errores) {
  if (!formContainer) return;

  const campos = ['nombre', 'direccion', 'coordenadas', 'materiales'];

  campos.forEach(campo => {
    const errorEl = formContainer.querySelector(`#error-${campo}`);
    const inputEl = formContainer.querySelector(`#report-${campo}`);

    if (errores[campo]) {
      if (errorEl) {
        errorEl.textContent = errores[campo];
        errorEl.classList.add('visible');
      }
      if (inputEl) {
        inputEl.classList.add('error');
      }
    } else {
      if (errorEl) {
        errorEl.classList.remove('visible');
      }
      if (inputEl) {
        inputEl.classList.remove('error');
      }
    }
  });
}
