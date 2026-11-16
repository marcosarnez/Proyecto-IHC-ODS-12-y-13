/**
 * Vista de Reporte de Puntos de Acopio (Preview preliminar)
 */

export function renderReportarView(onVolver) {
  const container = document.createElement('div');
  container.className = 'report-view-container';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '12px';

  container.innerHTML = `
    <div style="background: white; padding: 16px; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
      <h2 class="text-h2" style="color: var(--color-secondary); margin-bottom: 4px;">Reportar Punto de Acopio</h2>
      <p class="text-caption" style="margin-bottom: 14px;">Colabora con el mapeo ecológico de Santa Cruz (Campus UCB y alrededores)</p>

      <form id="form-reportar-preview" onsubmit="event.preventDefault();" style="display: flex; flex-direction: column; gap: 10px;">
        <div>
          <label class="text-caption" style="font-weight: 600; display: block; margin-bottom: 4px;">Nombre del punto / contenedor</label>
          <input type="text" class="search-input" placeholder="Ej. Contenedor de Vidrio Campus UCB" required style="padding-left: 12px;" />
        </div>

        <div>
          <label class="text-caption" style="font-weight: 600; display: block; margin-bottom: 4px;">Dirección aproximada</label>
          <input type="text" class="search-input" placeholder="Ej. Calle Puerto Rico casi Av. Bush" required style="padding-left: 12px;" />
        </div>

        <div>
          <label class="text-caption" style="font-weight: 600; display: block; margin-bottom: 4px;">Materiales que recibe</label>
          <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px;">
            <label style="font-size: 12px; display: flex; align-items: center; gap: 4px; background: var(--bg-subtle); padding: 4px 8px; border-radius: 4px;">
              <input type="checkbox" checked /> Plástico
            </label>
            <label style="font-size: 12px; display: flex; align-items: center; gap: 4px; background: var(--bg-subtle); padding: 4px 8px; border-radius: 4px;">
              <input type="checkbox" checked /> Vidrio
            </label>
            <label style="font-size: 12px; display: flex; align-items: center; gap: 4px; background: var(--bg-subtle); padding: 4px 8px; border-radius: 4px;">
              <input type="checkbox" /> Papel / Cartón
            </label>
            <label style="font-size: 12px; display: flex; align-items: center; gap: 4px; background: var(--bg-subtle); padding: 4px 8px; border-radius: 4px;">
              <input type="checkbox" /> Pilas / Baterías
            </label>
          </div>
        </div>

        <button class="btn-primary" type="button" id="btn-mock-enviar" style="margin-top: 10px;">
          Enviar reporte para revisión (+50 pts)
        </button>
      </form>
    </div>
  `;

  setTimeout(() => {
    const btn = container.querySelector('#btn-mock-enviar');
    if (btn) {
      btn.addEventListener('click', () => {
        alert('Reporte simulado registrado con éxito. Será parte del Sprint 3.');
      });
    }
  }, 0);

  return container;
}
