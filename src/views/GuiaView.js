/**
 * Vista de Guía de Reciclaje Urbano (ODS 12 y 13)
 */

export function renderGuiaView() {
  const container = document.createElement('div');
  container.className = 'guide-view-container';
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.gap = '12px';

  container.innerHTML = `
    <div style="background: white; padding: 16px; border-radius: var(--radius-lg); border: 1px solid var(--border-color);">
      <h2 class="text-h2" style="color: var(--color-primary); margin-bottom: 4px;">Guía de Reciclaje UCB</h2>
      <p class="text-caption" style="margin-bottom: 12px;">Compromiso con los Objetivos de Desarrollo Sostenible (ODS 12 y 13)</p>
      
      <div style="display: flex; flex-direction: column; gap: 10px;">
        <div style="padding: 10px; background: var(--bg-subtle); border-radius: 8px;">
          <strong style="color: #137333;">🥤 Plásticos PET (Tipo 1)</strong>
          <p style="font-size: 12px; color: var(--text-body);">Enjuaga la botella, aplástala para reducir volumen y coloca la tapa por separado.</p>
        </div>
        <div style="padding: 10px; background: var(--bg-subtle); border-radius: 8px;">
          <strong style="color: #1A73E8;">🍾 Botellas y Frascos de Vidrio</strong>
          <p style="font-size: 12px; color: var(--text-body);">Sin etiquetas metálicas y completamente limpios. No mezclar con espejos o cerámica.</p>
        </div>
        <div style="padding: 10px; background: var(--bg-subtle); border-radius: 8px;">
          <strong style="color: #B06000;">📦 Papel y Cartón</strong>
          <p style="font-size: 12px; color: var(--text-body);">Debe estar seco y libre de restos de grasa alimentaria (cajas de pizza sucias no aplican).</p>
        </div>
        <div style="padding: 10px; background: var(--bg-subtle); border-radius: 8px;">
          <strong style="color: #7627BB;">🔋 Pilas y Baterías (RAEE)</strong>
          <p style="font-size: 12px; color: var(--text-body);">Depositar únicamente en contenedores especializados para evitar lixiviados tóxicos.</p>
        </div>
      </div>
    </div>
  `;
  return container;
}
