/**
 * Enrutador SPA ligero para EcoMapa
 * Gestiona el cambio de vistas sin recargas de página y el historial de navegación
 */

class Router {
  constructor() {
    this.rutaActual = 'mapa';
    this.parametros = {};
    this.oyentes = [];
    this.historial = [];
  }

  /**
   * Suscribe una función para reaccionar a los cambios de ruta
   * @param {Function} callback 
   */
  suscribir(callback) {
    if (typeof callback === 'function') {
      this.oyentes.push(callback);
    }
  }

  /**
   * Navega a una ruta destino con parámetros opcionales
   * @param {string} ruta 
   * @param {Object} params 
   */
  navegar(ruta, params = {}) {
    if (this.rutaActual !== ruta || JSON.stringify(this.parametros) !== JSON.stringify(params)) {
      this.historial.push({ ruta: this.rutaActual, params: this.parametros });
      this.rutaActual = ruta;
      this.parametros = params;
      this._notificar();
    }
  }

  /**
   * Regresa a la vista anterior o a la ruta por defecto ('mapa')
   */
  volver() {
    if (this.historial.length > 0) {
      const previo = this.historial.pop();
      this.rutaActual = previo.ruta;
      this.parametros = previo.params;
    } else {
      this.rutaActual = 'mapa';
      this.parametros = {};
    }
    this._notificar();
  }

  _notificar() {
    this.oyentes.forEach(cb => cb(this.rutaActual, this.parametros));
  }
}

export const router = new Router();
