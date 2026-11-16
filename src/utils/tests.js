/**
 * Suite de Pruebas Unitarias e Integración para EcoMapa (Tarea 13)
 * Verifica: Haversine, Geocercas de Santa Cruz, Validación Preventiva H6 y Regex UCB
 */

import { calcularDistanciaHaversine, estaEnRangoSantaCruz } from './geo.js';
import { esCorreoUCBValido } from '../services/authService.js';
import { validarFormularioReporte } from '../services/validationService.js';

export function ejecutarPruebasSistema() {
  const resultados = [];

  // Prueba 1: Cálculo Haversine entre Campus UCB Norte (-17.6939, -63.1481) y 8vo Anillo (-17.7080, -63.1530)
  const d = calcularDistanciaHaversine([-17.6939, -63.1481], [-17.7080, -63.1530]);
  const p1 = d > 1000 && d < 2200;
  resultados.push({ nombre: 'Haversine Geodésico UCB Norte ➔ 8vo Anillo (~1.6 km)', exito: p1, valor: `${d} m` });

  // Prueba 2: Geocerca de Santa Cruz
  const dentroSCZ = estaEnRangoSantaCruz(-17.78, -63.18);
  const fueraSCZ = !estaEnRangoSantaCruz(-16.50, -68.15); // La Paz
  resultados.push({ nombre: 'Geocerca Metropolitana Santa Cruz (H6)', exito: dentroSCZ && fueraSCZ });

  // Prueba 3: Validación Regex institucional @ucb.edu.bo
  const c1 = esCorreoUCBValido('valentina.roca@ucb.edu.bo');
  const c2 = !esCorreoUCBValido('estudiante@gmail.com');
  const c3 = !esCorreoUCBValido('usuario@hotmail.com');
  resultados.push({ nombre: 'Autenticación Universitaria Regex @ucb.edu.bo', exito: c1 && c2 && c3 });

  // Prueba 4: Prevención de errores Nielsen H6 (Formulario incompleto)
  const formInvalido = validarFormularioReporte({ nombre: '', lat: 0, lng: 0, materiales: [] });
  resultados.push({ nombre: 'Bloqueo Preventivo H6 (Formulario Vacío)', exito: !formInvalido.esValido });

  // Prueba 5: Formulario válido
  const formValido = validarFormularioReporte({
    nombre: 'Punto Bush UCB',
    direccion: 'Av. Bush casi 2do Anillo',
    lat: -17.7763,
    lng: -63.1951,
    materiales: ['plastico', 'vidrio']
  });
  resultados.push({ nombre: 'Aprobación de Reporte Válido en SCZ', exito: formValido.esValido });

  console.group('🌿 [EcoMapa Test Suite — Tarea 13]');
  resultados.forEach(r => {
    console.log(`${r.exito ? '✔' : '✖'} ${r.nombre}`, r.valor || '');
  });
  console.groupEnd();

  return resultados;
}
