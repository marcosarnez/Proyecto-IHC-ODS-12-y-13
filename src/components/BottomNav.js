/**
 * Barra de Navegación Inferior Móvil (Bottom Navigation Bar)
 * Cumple con Ley de Fitts (>44px de área táctil) y Heurística de Consistencia
 */

export function renderBottomNav(vistaActiva = 'mapa') {
  const tabs = [
    {
      id: 'mapa',
      etiqueta: 'Mapa',
      icono: `<svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>`
    },
    {
      id: 'reportar',
      etiqueta: 'Reportar',
      icono: `<svg viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>`
    },
    {
      id: 'guia',
      etiqueta: 'Guía',
      icono: `<svg viewBox="0 0 24 24"><path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/></svg>`
    },
    {
      id: 'perfil',
      etiqueta: 'Perfil',
      icono: `<svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`
    }
  ];

  return `
    <nav class="app-nav" aria-label="Navegación principal">
      ${tabs.map(tab => `
        <button 
          class="nav-item ${vistaActiva === tab.id ? 'active' : ''}" 
          data-nav="${tab.id}"
          role="tab"
          aria-selected="${vistaActiva === tab.id ? 'true' : 'false'}"
          aria-label="${tab.etiqueta}"
        >
          ${tab.icono}
          <span>${tab.etiqueta}</span>
        </button>
      `).join('')}
    </nav>
  `;
}

export function initBottomNavEvents(onNavigate) {
  const items = document.querySelectorAll('.nav-item');
  items.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const destino = e.currentTarget.getAttribute('data-nav');
      if (destino && onNavigate) {
        onNavigate(destino);
      }
    });
  });
}
