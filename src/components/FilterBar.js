/**
 * Barra de Filtros y Búsqueda para EcoMapa
 * Permite filtrar por material reciclable y buscar por texto
 */

import materialesData from '../data/materiales.json';

export function renderFilterBar(filtroActivo = 'todos', valorBusqueda = '') {
  return `
    <div class="search-filter-section">
      <!-- Buscador de puntos o avenidas -->
      <div class="search-input-wrapper">
        <span class="search-icon">🔍</span>
        <input 
          type="text" 
          id="search-point-input" 
          class="search-input" 
          placeholder="Buscar contenedor, calle o avenida..." 
          value="${valorBusqueda}"
          autocomplete="off"
          aria-label="Buscar puntos de acopio"
        />
      </div>

      <!-- Chips horizontales de categorías -->
      <div class="filter-bar" role="tablist" aria-label="Categorías de reciclaje">
        <button 
          class="filter-chip ${filtroActivo === 'todos' ? 'active' : ''}" 
          data-filter="todos"
          role="tab"
          aria-selected="${filtroActivo === 'todos' ? 'true' : 'false'}"
        >
          ♻ Todos
        </button>
        ${materialesData.map(mat => `
          <button 
            class="filter-chip ${filtroActivo === mat.id ? 'active' : ''}" 
            data-filter="${mat.id}"
            role="tab"
            aria-selected="${filtroActivo === mat.id ? 'true' : 'false'}"
          >
            ${mat.icono} ${mat.nombre}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

export function initFilterBarEvents(onFilterChange, onSearchChange) {
  const chips = document.querySelectorAll('.filter-chip');
  chips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      const cat = e.currentTarget.getAttribute('data-filter');
      chips.forEach(c => {
        c.classList.remove('active');
        c.setAttribute('aria-selected', 'false');
      });
      e.currentTarget.classList.add('active');
      e.currentTarget.setAttribute('aria-selected', 'true');
      if (cat && onFilterChange) {
        onFilterChange(cat);
      }
    });
  });

  const searchInput = document.getElementById('search-point-input');
  if (searchInput && onSearchChange) {
    searchInput.addEventListener('input', (e) => {
      onSearchChange(e.target.value.trim().toLowerCase());
    });
  }
}
