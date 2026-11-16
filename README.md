# 🗺️ EcoMapa — Mapeo Colaborativo y Reciclaje Urbano
> **Materia:** Interacción Humano-Computador (IHC)  
> **Universidad:** Universidad Católica Boliviana "San Pablo" (UCB) — Semestre 2-2026  
> **Equipo:** Marcos Arnez Pocomani & Emanuel Justiniano  
> **Alineación:** ODS 12 (Producción y Consumo Responsables) y ODS 13 (Acción por el Clima)

---

## 📖 Descripción del Proyecto
**EcoMapa** es una aplicación web responsive desarrollada bajo un enfoque estricto de **Interacción Humano-Computador (IHC)**. Permite a los estudiantes y vecinos del campus UCB Santa Cruz (Av. Bush / 2do Anillo):
1. **Localizar en tiempo real** puntos de acopio y contenedores de reciclaje clasificados (Plástico PET, Vidrio, Cartón, Pilas/RAEE).
2. **Filtrar por tipo de residuo** mediante chips táctiles dinámicos.
3. **Calcular rutas peatonales guiadas** con tiempos y distancias estimadas a pie.
4. **Reportar nuevos contenedores** con geolocalización asistida por GPS y validación preventiva (**Heurística de Nielsen H6**) para evitar reportes falsos.
5. **Ganar EcoPuntos e insignias** acumulables en su perfil universitario.

---

## 🚀 Ejecución en Local (Localhost)

### Requisitos Previos
* **Node.js** (versión 18 o superior recomendada).
* **NPM** (incluido con Node).

### Pasos para Ejecutar
1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/TU-USUARIO/ecomapa-ihc.git
   cd ecomapa-ihc
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor local de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abrir en tu navegador:**
   La aplicación se abrirá automáticamente en:
   👉 **`http://localhost:5173`**

5. **Compilar para producción (Build):**
   ```bash
   npm run build
   ```

---

## 📂 Arquitectura del Proyecto

```text
ecomapa-ihc/
├── public/                 # Recursos estáticos y favicons
├── src/
│   ├── data/               # Catálogos de datos y esquemas del dominio
│   │   ├── puntos.json     # Dataset de puntos de acopio georreferenciados (Santa Cruz)
│   │   ├── materiales.json # Catálogo oficial de tipos de residuos
│   │   └── tipos.js        # Constantes y esquemas de tipos de datos
│   ├── utils/              # Módulos de utilidades y lógica pura
│   │   ├── geo.js          # Cálculo geodésico (Haversine) y tiempos peatonales
│   │   ├── storage.js      # Capa de persistencia en LocalStorage
│   │   └── formatters.js   # Formateo de distancias, horarios y fechas
│   ├── styles/             # Sistema de diseño CSS modular
│   │   ├── variables.css   # Tokens de diseño oficiales (Teal, Navy, Gold)
│   │   ├── typography.css  # Escala tipográfica Inter y jerarquías
│   │   ├── layout.css      # Contenedor responsive (mobile-first)
│   │   └── main.css        # Estilos globales y utilitarios
│   ├── components/         # Componentes UI reutilizables
│   └── main.js             # Punto de entrada de la aplicación
├── index.html              # Shell HTML5 de la aplicación
├── vite.config.js          # Configuración del empaquetador Vite
├── package.json            # Manifiesto de dependencias y scripts
└── README.md               # Documentación general
```

---

## 🧩 Principios SOLID Aplicados en el Frontend

| Principio | Aplicación Concreta en EcoMapa |
|---|---|
| **S (Single Responsibility)** | Cada módulo posee una única responsabilidad: `geo.js` únicamente calcula distancias matemáticas; `storage.js` gestiona la persistencia; los componentes solo renderizan su vista. |
| **O (Open/Closed)** | El catálogo `materiales.json` y los filtros están abiertos a extender nuevos tipos de residuo (ej. orgánicos, textiles) sin modificar la lógica interna del motor de búsqueda. |
| **L (Liskov Substitution)** | Todos los puntos de acopio implementan el mismo contrato de datos base (`PuntoAcopio`), permitiendo tratar puntos fijos y reportes comunitarios de manera intercambiable. |
| **I (Interface Segregation)** | Las utilidades exponen funciones pequeñas y desacopladas (`calcularDistanciaHaversine`, `formatearDistancia`) en lugar de un objeto monolítico pesado. |
| **D (Dependency Inversion)** | La interfaz no depende directamente de `localStorage` en cada componente, sino de la abstracción proporcionada por `StorageService`. |

---

## 👥 Integrantes del Equipo
* **Marcos Arnez Pocomani** — Lead Frontend, Arquitectura CSS y Motor Cartográfico.
* **Emanuel Justiniano** — Data Lead, Lógica Geodésica, Validación Heurística H6 y Autenticación.
