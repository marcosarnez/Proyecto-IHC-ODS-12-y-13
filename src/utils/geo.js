/**
 * Utilidades matemáticas y geodésicas para cálculo de distancias y tiempos peatonales
 * Contexto: Santa Cruz de la Sierra — Campus UCB
 */

// Radio medio de la Tierra en metros (WGS-84)
const RADIO_TIERRA_METROS = 6371000;

// Velocidad peatonal promedio universitaria en Santa Cruz (4.5 km/h ≈ 75 metros/minuto)
const VELOCIDAD_PEATONAL_M_MIN = 75;

/**
 * Convierte grados sexagesimales a radianes
 * @param {number} grados 
 * @returns {number}
 */
function aRadianes(grados) {
  return (grados * Math.PI) / 180;
}

/**
 * Calcula la distancia ortodrómica real entre dos puntos geográficos
 * utilizando la fórmula trigonométrica del Haversine.
 * 
 * @param {{lat: number, lng: number}|[number, number]} puntoA 
 * @param {{lat: number, lng: number}|[number, number]} puntoB 
 * @returns {number} Distancia calculada en metros
 */
export function calcularDistanciaHaversine(puntoA, puntoB) {
  const lat1 = Array.isArray(puntoA) ? puntoA[0] : puntoA.lat;
  const lon1 = Array.isArray(puntoA) ? puntoA[1] : puntoA.lng;
  const lat2 = Array.isArray(puntoB) ? puntoB[0] : puntoB.lat;
  const lon2 = Array.isArray(puntoB) ? puntoB[1] : puntoB.lng;

  const dLat = aRadianes(lat2 - lat1);
  const dLon = aRadianes(lon2 - lon1);

  const radLat1 = aRadianes(lat1);
  const radLat2 = aRadianes(lat2);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(radLat1) * Math.cos(radLat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(RADIO_TIERRA_METROS * c);
}

/**
 * Estima el tiempo necesario para recorrer una distancia caminando
 * @param {number} distanciaMetros 
 * @returns {number} Tiempo estimado en minutos (mínimo 1 minuto)
 */
export function calcularTiempoCaminata(distanciaMetros) {
  if (!distanciaMetros || distanciaMetros <= 0) return 1;
  return Math.max(1, Math.round(distanciaMetros / VELOCIDAD_PEATONAL_M_MIN));
}

/**
 * Valida si un punto se encuentra dentro de los límites metropolitanos de Santa Cruz
 * (Para prevenir reportes erróneos según Heurística Nielsen H6)
 * @param {number} lat 
 * @param {number} lng 
 * @returns {boolean}
 */
export function estaEnRangoSantaCruz(lat, lng) {
  // Cuadro delimitador aproximado del área urbana de Santa Cruz de la Sierra
  const MIN_LAT = -17.9500;
  const MAX_LAT = -17.6500;
  const MIN_LNG = -63.3500;
  const MAX_LNG = -63.0500;

  return lat >= MIN_LAT && lat <= MAX_LAT && lng >= MIN_LNG && lng <= MAX_LNG;
}
