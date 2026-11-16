/**
 * Servicio de Autenticación Universitaria Simulada (Perfil Institucional UCB)
 * Exige correo @ucb.edu.bo para garantizar la integridad de los aportes (Heurística H6 / H7)
 */

import { USUARIO_DEFAULT } from '../data/tipos.js';

const CLAVE_AUTH = 'ecomapa_auth_session_v1';
const REGEX_CORREO_UCB = /^[a-zA-Z0-9._%+-]+@ucb\.edu\.bo$/i;

/**
 * Valida si una dirección de correo pertenece al dominio oficial de la UCB
 * @param {string} email 
 * @returns {boolean}
 */
export function esCorreoUCBValido(email) {
  if (!email || typeof email !== 'string') return false;
  return REGEX_CORREO_UCB.test(email.trim());
}

/**
 * Obtiene la sesión activa actual o el usuario por defecto
 * @returns {Object}
 */
export function getSesionActual() {
  try {
    const raw = localStorage.getItem(CLAVE_AUTH);
    if (!raw) {
      // Sesión predeterminada activa con Valentina Roca
      localStorage.setItem(CLAVE_AUTH, JSON.stringify(USUARIO_DEFAULT));
      return USUARIO_DEFAULT;
    }
    return JSON.parse(raw);
  } catch (err) {
    return USUARIO_DEFAULT;
  }
}

/**
 * Inicia sesión simulada con credenciales universitarias UCB
 * @param {string} email 
 * @param {string} nombre 
 * @param {string} carrera 
 * @returns {{ exito: boolean, mensaje?: string, usuario?: Object }}
 */
export function loginConCorreoUCB(email, nombre = 'Estudiante UCB', carrera = 'Ingeniería') {
  if (!esCorreoUCBValido(email)) {
    return {
      exito: false,
      mensaje: 'Acceso restringido: Debes utilizar tu correo institucional terminado en @ucb.edu.bo'
    };
  }

  const nuevoUsuario = {
    ...USUARIO_DEFAULT,
    id: `usr-${Date.now()}`,
    nombre: nombre.trim() || 'Estudiante UCB',
    email: email.trim().toLowerCase(),
    carrera: carrera,
    estaAutenticado: true
  };

  localStorage.setItem(CLAVE_AUTH, JSON.stringify(nuevoUsuario));
  return { exito: true, usuario: nuevoUsuario };
}

/**
 * Cierra la sesión activa y regresa al modo invitado
 */
export function cerrarSesion() {
  const invitado = {
    id: 'invitado',
    nombre: 'Modo Invitado',
    email: 'invitado@comunidad.bo',
    carrera: 'Visitante',
    semestre: 'Público general',
    campus: 'Santa Cruz',
    ecoPuntos: 0,
    estaAutenticado: false,
    insignias: []
  };
  localStorage.setItem(CLAVE_AUTH, JSON.stringify(invitado));
  return invitado;
}

/**
 * Verifica si el usuario actual cuenta con sesión universitaria activa
 * @returns {boolean}
 */
export function estaAutenticado() {
  const usr = getSesionActual();
  return Boolean(usr && usr.email && esCorreoUCBValido(usr.email));
}
