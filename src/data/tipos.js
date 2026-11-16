/**
 * Tipos de datos, esquemas y constantes oficiales de EcoMapa
 * Universidad Católica Boliviana "San Pablo" — IHC
 */

/**
 * Categorías de residuos admitidos en el sistema
 */
export const CATEGORIAS_RESIDUO = {
  PLASTICO: 'plastico',
  VIDRIO: 'vidrio',
  PAPEL: 'papel',
  CARTON: 'carton',
  PILAS: 'pilas',
  METALES: 'metales'
};

/**
 * Estados operativos posibles para un contenedor de acopio
 */
export const ESTADOS_CONTENEDOR = {
  OPERATIVO: 'operativo',
  LLENO: 'lleno',
  DANADO: 'danado',
  EN_MANTENIMIENTO: 'mantenimiento'
};

/**
 * Esquema base para validar un punto de acopio antes de registrarlo
 * @param {Object} punto 
 * @returns {boolean}
 */
export function validarPuntoAcopio(punto) {
  if (!punto || typeof punto !== 'object') return false;
  if (!punto.nombre || punto.nombre.trim().length < 3) return false;
  if (typeof punto.lat !== 'number' || typeof punto.lng !== 'number') return false;
  if (!Array.isArray(punto.materiales) || punto.materiales.length === 0) return false;
  return true;
}

/**
 * Usuario predeterminado para la sesión universitaria (Perfil UCB)
 */
export const USUARIO_DEFAULT = {
  id: 'usr-ucb-001',
  nombre: 'Valentina Roca',
  email: 'valentina.roca@ucb.edu.bo',
  carrera: 'Ingeniería de Software',
  semestre: '5.º Semestre',
  campus: 'Santa Cruz — Campus Norte (Km 9)',
  ecoPuntos: 350,
  kgReciclados: 14.5,
  co2PrevenidoKg: 42.1,
  insignias: [
    { id: 'badge-1', nombre: 'Primer Depósito', icono: '🌱', descripcion: 'PET reciclado en punto verificado' },
    { id: 'badge-2', nombre: 'Mapeadora UCB', icono: '📍', descripcion: 'Primer reporte comunitario aprobado' },
    { id: 'badge-3', nombre: 'Protectora del Piraí', icono: '💧', descripcion: 'Más de 10 kg de residuos separados' }
  ]
};
