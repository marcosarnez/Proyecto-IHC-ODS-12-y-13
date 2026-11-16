/**
 * Utilidades de formateo visual para la interfaz de EcoMapa
 * Garantiza consistencia tipográfica y claridad según Heurísticas de Usabilidad
 */

/**
 * Formatea una distancia en metros a formato legible para el usuario (m o km)
 * @param {number} metros 
 * @returns {string} Ejemplo: "350 m" o "1.4 km"
 */
export function formatearDistancia(metros) {
  if (typeof metros !== 'number' || isNaN(metros)) return '-- m';
  if (metros < 1000) {
    return `${Math.round(metros)} m`;
  }
  const km = (metros / 1000).toFixed(1);
  return `${km} km`;
}

/**
 * Formatea el tiempo estimado de caminata
 * @param {number} minutos 
 * @returns {string} Ejemplo: "5 min a pie"
 */
export function formatearTiempo(minutos) {
  if (typeof minutos !== 'number' || isNaN(minutos) || minutos <= 0) return '1 min a pie';
  if (minutos >= 60) {
    const horas = Math.floor(minutos / 60);
    const minsRestantes = minutos % 60;
    return minsRestantes > 0 ? `${horas} h ${minsRestantes} min a pie` : `${horas} h a pie`;
  }
  return `${minutos} min a pie`;
}

/**
 * Capitaliza la primera letra de un texto
 * @param {string} texto 
 * @returns {string}
 */
export function capitalizar(texto) {
  if (!texto || typeof texto !== 'string') return '';
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

/**
 * Determina el color y etiqueta para el indicador de capacidad de un contenedor
 * @param {string} capacidadStr Ejemplo: "30%", "85%"
 * @returns {{ nivel: 'bajo'|'medio'|'alto', etiqueta: string, color: string }}
 */
export function obtenerEstadoCapacidad(capacidadStr = '0%') {
  const valor = parseInt(capacidadStr, 10) || 0;
  if (valor >= 80) {
    return { nivel: 'alto', etiqueta: 'Casi lleno', color: '#D9534F' };
  } else if (valor >= 50) {
    return { nivel: 'medio', etiqueta: 'Capacidad media', color: '#F0AD4E' };
  }
  return { nivel: 'bajo', etiqueta: 'Espacio disponible', color: '#1B7A6E' };
}
