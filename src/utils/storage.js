/**
 * Capa de persistencia en LocalStorage para EcoMapa
 * Aplica Principio de Responsabilidad Única (SOLID) aislando el acceso al almacenamiento.
 */

import puntosIniciales from '../data/puntos.json';
import { USUARIO_DEFAULT } from '../data/tipos.js';

const CLAVES = {
  PUNTOS: 'ecomapa_puntos_v1',
  FAVORITOS: 'ecomapa_favoritos_v1',
  USUARIO: 'ecomapa_usuario_v1'
};

/**
 * Obtiene la lista completa de puntos de acopio (iniciales + reportados)
 * @returns {Array<Object>}
 */
export function getPuntos() {
  try {
    const raw = localStorage.getItem(CLAVES.PUNTOS);
    if (!raw) {
      localStorage.setItem(CLAVES.PUNTOS, JSON.stringify(puntosIniciales));
      return puntosIniciales;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error al leer puntos de localStorage, usando base inicial:', err);
    return puntosIniciales;
  }
}

/**
 * Agrega un nuevo punto reportado por la comunidad universitaria
 * @param {Object} nuevoPunto 
 * @returns {Array<Object>} Lista actualizada de puntos
 */
export function guardarNuevoPunto(nuevoPunto) {
  try {
    const puntos = getPuntos();
    const puntoCompleto = {
      id: `pto-usr-${Date.now()}`,
      abierto: true,
      verificadoUCB: false,
      capacidad: '10%',
      estado: 'operativo',
      fechaRegistro: new Date().toISOString(),
      ...nuevoPunto
    };
    const actualizados = [puntoCompleto, ...puntos];
    localStorage.setItem(CLAVES.PUNTOS, JSON.stringify(actualizados));
    return actualizados;
  } catch (err) {
    console.error('Error al guardar nuevo punto en localStorage:', err);
    return getPuntos();
  }
}

/**
 * Obtiene los IDs de los puntos marcados como favoritos
 * @returns {Array<string>}
 */
export function getFavoritos() {
  try {
    const raw = localStorage.getItem(CLAVES.FAVORITOS);
    return raw ? JSON.parse(raw) : ['pto-01', 'pto-02']; // Favoritos iniciales sugeridos
  } catch (err) {
    console.error('Error al leer favoritos:', err);
    return [];
  }
}

/**
 * Alterna el estado de favorito de un punto
 * @param {string} puntoId 
 * @returns {boolean} true si ahora es favorito, false si se removió
 */
export function toggleFavorito(puntoId) {
  try {
    const favs = getFavoritos();
    const index = favs.indexOf(puntoId);
    let nuevoEstado = false;

    if (index >= 0) {
      favs.splice(index, 1);
      nuevoEstado = false;
    } else {
      favs.push(puntoId);
      nuevoEstado = true;
    }

    localStorage.setItem(CLAVES.FAVORITOS, JSON.stringify(favs));
    return nuevoEstado;
  } catch (err) {
    console.error('Error al actualizar favorito:', err);
    return false;
  }
}

/**
 * Verifica si un punto específico es favorito
 * @param {string} puntoId 
 * @returns {boolean}
 */
export function esFavorito(puntoId) {
  return getFavoritos().includes(puntoId);
}

/**
 * Obtiene los datos del usuario activo
 * @returns {Object}
 */
export function getUsuario() {
  try {
    const raw = localStorage.getItem(CLAVES.USUARIO);
    if (!raw) {
      localStorage.setItem(CLAVES.USUARIO, JSON.stringify(USUARIO_DEFAULT));
      return USUARIO_DEFAULT;
    }
    return JSON.parse(raw);
  } catch (err) {
    return USUARIO_DEFAULT;
  }
}

/**
 * Adjudica EcoPuntos al usuario actual tras un reporte o acción ecológica
 * @param {number} puntosASumar 
 * @returns {Object} Usuario actualizado
 */
export function sumarEcoPuntos(puntosASumar = 50) {
  try {
    const usr = getUsuario();
    usr.ecoPuntos = (usr.ecoPuntos || 0) + puntosASumar;
    localStorage.setItem(CLAVES.USUARIO, JSON.stringify(usr));
    return usr;
  } catch (err) {
    console.error('Error al sumar EcoPuntos:', err);
    return USUARIO_DEFAULT;
  }
}
