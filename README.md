# 🗺️ EcoMapa — Mapeo Colaborativo y Reciclaje Urbano
> **Materia:** Interacción Humano-Computador (IHC)  
> **Universidad:** Universidad Católica Boliviana "San Pablo" (UCB) — Sede Santa Cruz  
> **Semestre:** 2-2026  
> **Equipo:** Marcos Arnez Pocomani & Emanuel Justiniano  
> **Alineación:** ODS 12 (Producción y Consumo Responsables) y ODS 13 (Acción por el Clima)  
> **Repositorio Oficial:** [https://github.com/marcosarnez/Proyecto-IHC-ODS-12-y-13](https://github.com/marcosarnez/Proyecto-IHC-ODS-12-y-13)

---

## 📖 Descripción del Proyecto
**EcoMapa** es una aplicación web interactiva y responsive desarrollada bajo los principios de la **Interacción Humano-Computador (IHC)** y las **Heurísticas de Usabilidad de Jakob Nielsen**. Permite a los estudiantes y vecinos del campus UCB Santa Cruz (Av. Bush / 2do Anillo):
1. **Localizar en tiempo real** puntos de acopio clasificados (Plástico PET, Vidrio, Papel/Cartón, Pilas/RAEE y Metales) sobre un mapa cartográfico interactivo de Leaflet.js.
2. **Filtrar por tipo de residuo y buscar por texto** mediante chips táctiles dinámicos y buscador predictivo.
3. **Ficha de detalle completa** con horarios de atención verificados, capacidad del contenedor y guía de separación.
4. **Asistente de navegación peatonal guiada** con cálculo geodésico exacto (Fórmula de Haversine), estimación de tiempo de caminata a pie y trazado de polilínea visual en el mapa.
5. **Reportar nuevos contenedores comunitarios** con detección satelital por GPS, selector de condición y subida de fotografía de respaldo con previsualización en miniatura.
6. **Validación preventiva (Heurística Nielsen H6)** que impide reportes erróneos o fuera de la geocerca de Santa Cruz.
7. **Autenticación institucional simulada** con correo `@ucb.edu.bo` para garantizar la veracidad de los datos.
8. **Gamificación y Educación:** Saldo dinámico de EcoPuntos, insignias universitarias y calculadora de huella ecológica (CO₂ evitado y kg reciclados).

---

## 🚀 Ejecución en Local (Localhost)

### Requisitos Previos
* **Node.js** (versión 18 o superior).
* **NPM** (incluido con Node).

### Pasos para Ejecutar
```bash
# 1. Clonar el repositorio
git clone https://github.com/marcosarnez/Proyecto-IHC-ODS-12-y-13.git
cd "Proyecto-IHC-ODS-12-y-13"

# 2. Instalar dependencias
npm install

# 3. Iniciar el servidor local de desarrollo
npm run dev
```

Abre en tu navegador:  
👉 **`http://localhost:5173`**

### Compilar para Producción (Build)
```bash
npm run build
```

---

## 🏛️ Matriz de Principios SOLID Aplicados

| Principio SOLID | Implementación en la Arquitectura de EcoMapa | Archivo de Referencia |
|---|---|---|
| **S — Single Responsibility Principle (SRP)** | Cada módulo atiende una sola responsabilidad: `geo.js` calcula trigonometría esférica de Haversine, `storage.js` gestiona la persistencia de `localStorage`, `validationService.js` valida reglas de negocio, y `authService.js` administra sesiones. | `src/utils/geo.js`<br>`src/services/validationService.js` |
| **O — Open/Closed Principle (OCP)** | El catálogo de materiales (`materiales.json`) y puntos (`puntos.json`) está desacoplado del motor de renderizado. Se pueden añadir nuevos residuos (ej. Tetrapak, Orgánicos) sin alterar la lógica de cálculo o de componentes. | `src/data/materiales.json`<br>`src/data/puntos.json` |
| **L — Liskov Substitution Principle (LSP)** | Todas las vistas del enrutador SPA (`MapView`, `DetailView`, `RouteView`, `GuiaView`, `PerfilView`, `ReportView`) implementan contratos homogéneos que devuelven elementos DOM estandarizados consumibles por el enrutador. | `src/views/*`<br>`src/router.js` |
| **I — Interface Segregation Principle (ISP)** | Los servicios exponen únicamente los métodos indispensables: `authService` expone `login`, `logout` y `estaAutenticado`; evitando acoplamientos innecesarios con la capa de presentación. | `src/services/authService.js` |
| **D — Dependency Inversion Principle (DIP)** | Las vistas y componentes no acceden a variables globales ni modifican el DOM de sus ancestros; reciben dependencias y notifican eventos mediante callbacks de primer nivel (`onSelectPunto`, `onNavigate`, `onVolver`). | `src/components/Header.js`<br>`src/views/MapView.js` |

---

## 🎯 Cumplimiento de Heurísticas de Usabilidad (Jakob Nielsen)

* **H1: Visibilidad del estado del sistema:** Notificaciones Toast flotantes ante cada acción (guardado en favoritos, captura de GPS, suma de EcoPuntos).
* **H3: Control y libertad del usuario:** Botones explícitos de retroceso (*"← Volver al mapa"*, *"Cancelar ruta"*), permitiendo salir de cualquier flujo sin consecuencias.
* **H4: Consistencia y estándares:** Paleta cromática oficial (Teal `#1B7A6E`, Navy `#1B365D`, Gold `#C4A35A`), tipografía Inter en toda la interfaz y cumplimiento de la Ley de Fitts con botones táctiles mayores a 44px.
* **H6: Prevención de errores (Requisito clave):** Validación estricta que bloquea envíos incompletos y verifica mediante geocercas que las coordenadas pertenezcan al radio urbano de Santa Cruz de la Sierra.
* **H7: Flexibilidad y eficiencia de uso:** Buscador en vivo, filtros por categorías, selector rápido de perfiles de prueba y navegación directa por mapa o lista.
* **H8: Estética y diseño minimalista:** Jerarquía visual limpia, información modularizada en tarjetas y ausencia de elementos superfluos.
* **H9: Ayudar a reconocer, diagnosticar y recuperarse de errores:** Mensajes inline en color rojo accesible (`#D9534F`) indicando con claridad qué campo debe corregirse sin borrar los datos válidos ya ingresados.

---

## 📂 Estructura Modular del Proyecto

```text
Proyecto-IHC-ODS-12-y-13/
├── index.html                   # Shell base HTML5 mobile-first con Inter font
├── package.json                 # Dependencias (Vite, Leaflet)
├── vite.config.js               # Configuración del servidor en puerto 5173
├── src/
│   ├── components/              # Piezas de interfaz reutilizables
│   │   ├── BottomNav.js         # Barra inferior fija de navegación
│   │   ├── FilterBar.js         # Chips de filtrado y buscador
│   │   ├── Header.js            # Encabezado institucional y EcoPuntos
│   │   ├── LoginModal.js        # Modal de acceso universitario @ucb.edu.bo
│   │   ├── Map.js               # Motor cartográfico Leaflet.js
│   │   └── Toast.js             # Notificaciones no bloqueantes
│   ├── data/                    # Datasets y constantes
│   │   ├── materiales.json      # Catálogo oficial de residuos
│   │   ├── puntos.json          # 6 puntos georreferenciados en Santa Cruz
│   │   └── tipos.js             # Esquemas y usuario default UCB
│   ├── services/                # Lógica de negocio y reglas
│   │   ├── authService.js       # Autenticación con regex @ucb.edu.bo
│   │   └── validationService.js # Validación preventiva Nielsen H6
│   ├── styles/                  # Sistema de diseño CSS
│   │   ├── auth.css             # Estilos de autenticación
│   │   ├── components.css       # Estilos de componentes base
│   │   ├── detail.css           # Ficha de detalle de contenedor
│   │   ├── guide.css            # Estilos de manual ODS 12/13
│   │   ├── layout.css           # Layout responsivo mobile-first
│   │   ├── main.css             # Punto de entrada de estilos
│   │   ├── map.css              # Pines SVG y contenedor de Leaflet
│   │   ├── modal.css            # Modales de éxito y alerta
│   │   ├── profile.css          # Perfil, estadísticas e insignias
│   │   ├── report.css           # Formulario y dropzone fotográfico
│   │   ├── route.css            # Asistente de ruta peatonal
│   │   ├── typography.css       # Escala tipográfica Inter
│   │   └── variables.css        # Tokens CSS de color y espaciado
│   ├── utils/                   # Utilidades matemáticas y almacenamiento
│   │   ├── formatters.js        # Formato de metros, km y minutos
│   │   ├── geo.js               # Fórmula de Haversine y geocercas
│   │   └── storage.js           # Capa de almacenamiento LocalStorage
│   ├── views/                   # Pantallas del flujo de la aplicación
│   │   ├── DetailView.js        # Ficha de detalle (Hi-Fi 02)
│   │   ├── GuiaView.js          # Guía ODS y calculadora ambiental
│   │   ├── MapView.js           # Pantalla principal con mapa interactivo
│   │   ├── PerfilView.js        # Perfil del estudiante (Hi-Fi 06)
│   │   ├── ReportView.js        # Formulario de reporte con GPS (Hi-Fi 04)
│   │   └── RouteView.js         # Asistente peatonal guiado (Hi-Fi 03)
│   ├── main.js                  # Orquestador principal y punto de entrada SPA
│   └── router.js                # Enrutador cliente SPA sin recargas
```

---

## 📋 Registro Histórico de Tareas y Commits (14/14 Issues)

1. **Tarea 1:** `feat: inicializa entorno base con vite, estructura modular y configuracion (Tarea 1)`
2. **Tarea 2:** `feat: define dataset de puntos de acopio y categorias de reciclaje en santa cruz (Tarea 2)`
3. **Tarea 3:** `feat: implementa utilidades geodesicas de haversine, persistencia local y vista interactiva (Tarea 3)`
4. **Tarea 4:** `feat: implementa componentes reutilizables, header institucional, bottom nav y enrutador spa (Tarea 4)`
5. **Tarea 5:** `feat: implementa vista de mapa interactivo con leaflet, pines personalizados y filtros de material (Tarea 5)`
6. **Tarea 6:** `feat: construye ficha de detalle de contenedor y asistente de navegacion peatonal guiada (Tarea 6)`
7. **Tarea 7:** `feat: construye formulario de reporte ciudadano con geolocalizacion y previsualizacion de foto (Tarea 7)`
8. **Tarea 8:** `feat: aplica validacion preventiva nielsen h6 y modal de confirmacion con adjudicacion de ecopuntos (Tarea 8)`
9. **Tarea 9:** `feat: implementa autenticacion universitaria simulada con correo ucb y control de acceso (Tarea 9)`
10. **Tarea 10:** `feat: implementa gestion de perfil universitario, favoritos interactivos e historial de reportes (Tarea 10)`
11. **Tarea 11:** `feat: incorpora modulo interactivo de guia ods 12-13 y calculadora de impacto ecologico (Tarea 11)`
12. **Tarea 12:** `docs: actualiza documentacion integral con matriz solid, tabla de heuristicas nielsen y cierre (Tarea 12)`
13. **Tarea 13:** `test: implementa suite de pruebas unitarias para haversine, validacion h6 y contrastes wcag (Tarea 13)`
14. **Tarea 14:** `ci: anade flujo de integracion continua github actions y configuracion de despliegue (Tarea 14)`
