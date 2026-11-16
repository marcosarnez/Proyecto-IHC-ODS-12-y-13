/**
 * Modal de Identificación Universitaria UCB
 * Exige correo @ucb.edu.bo para permitir la publicación de reportes
 */

import { loginConCorreoUCB } from '../services/authService.js';
import { mostrarToast } from './Toast.js';

export function renderLoginModal(onLoginExitoso, onCancelar) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'login-modal-overlay';

  overlay.innerHTML = `
    <div class="auth-modal-card">
      <div class="auth-brand-badge">
        <span class="auth-ucb-logo">🎓</span>
        <div>
          <strong style="color: var(--color-secondary); font-size: 14px; display: block;">Comunidad UCB Santa Cruz</strong>
          <span style="font-size: 11px; color: var(--text-muted);">Acceso institucional para mapeo y EcoPuntos</span>
        </div>
      </div>

      <div>
        <h3 class="text-h3" style="margin-bottom: 4px;">Identifícate con tu correo UCB</h3>
        <p class="text-caption">Para mantener la veracidad de los puntos de acopio, solo estudiantes y docentes pueden registrar contenedores.</p>
      </div>

      <form id="form-login-ucb" novalidate style="display: flex; flex-direction: column; gap: 10px;">
        <div class="form-group">
          <label class="form-label" for="login-nombre">Nombre completo</label>
          <input type="text" id="login-nombre" class="form-input" placeholder="Ej. Valentina Roca" value="Valentina Roca" required />
        </div>

        <div class="form-group">
          <label class="form-label" for="login-email">Correo Institucional (@ucb.edu.bo) *</label>
          <input 
            type="email" 
            id="login-email" 
            class="form-input" 
            placeholder="usuario@ucb.edu.bo" 
            value="valentina.roca@ucb.edu.bo" 
            required 
          />
          <span class="form-error-msg" id="error-login-email"></span>
        </div>

        <button type="submit" class="btn-primary" style="margin-top: 6px;">
          Ingresar y continuar
        </button>
      </form>

      <!-- Accesos Rápidos de Estudiantes de Prueba -->
      <div>
        <span class="text-caption" style="font-weight: 600; display: block; margin-bottom: 6px;">O selecciona un perfil de prueba:</span>
        <div class="quick-users-list">
          <button type="button" class="quick-user-btn" data-email="valentina.roca@ucb.edu.bo" data-nombre="Valentina Roca" data-carrera="Ingeniería de Software">
            <span>👩‍🎓 Valentina Roca</span>
            <span style="color: var(--text-muted); font-size: 11px;">@ucb.edu.bo</span>
          </button>
          <button type="button" class="quick-user-btn" data-email="marcos.arnez@ucb.edu.bo" data-nombre="Marcos Arnez" data-carrera="Ingeniería de Sistemas">
            <span>👨‍💻 Marcos Arnez</span>
            <span style="color: var(--text-muted); font-size: 11px;">@ucb.edu.bo</span>
          </button>
          <button type="button" class="quick-user-btn" data-email="emanuel.justiniano@ucb.edu.bo" data-nombre="Emanuel Justiniano" data-carrera="Ingeniería de Telecomunicaciones">
            <span>👨‍💻 Emanuel Justiniano</span>
            <span style="color: var(--text-muted); font-size: 11px;">@ucb.edu.bo</span>
          </button>
        </div>
      </div>

      <button type="button" class="btn-secondary" id="btn-login-cancelar" style="margin-top: 4px;">
        Continuar como invitado (solo explorar)
      </button>
    </div>
  `;

  setTimeout(() => {
    const form = overlay.querySelector('#form-login-ucb');
    const inputEmail = overlay.querySelector('#login-email');
    const inputNombre = overlay.querySelector('#login-nombre');
    const errorMsg = overlay.querySelector('#error-login-email');

    // Procesar login
    const intentarLogin = (email, nombre, carrera) => {
      const res = loginConCorreoUCB(email, nombre, carrera);
      if (res.exito) {
        mostrarToast(`Bienvenido/a, ${res.usuario.nombre} 👋`, 'exito');
        overlay.remove();
        if (onLoginExitoso) onLoginExitoso(res.usuario);
      } else {
        errorMsg.textContent = res.mensaje;
        errorMsg.classList.add('visible');
        inputEmail.classList.add('error');
      }
    };

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        intentarLogin(inputEmail.value, inputNombre.value, 'Ingeniería');
      });
    }

    // Botones rápidos
    overlay.querySelectorAll('.quick-user-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const email = btn.getAttribute('data-email');
        const nombre = btn.getAttribute('data-nombre');
        const carrera = btn.getAttribute('data-carrera');
        intentarLogin(email, nombre, carrera);
      });
    });

    // Cancelar / Modo invitado
    const btnCancel = overlay.querySelector('#btn-login-cancelar');
    if (btnCancel) {
      btnCancel.addEventListener('click', () => {
        overlay.remove();
        if (onCancelar) onCancelar();
      });
    }
  }, 0);

  return overlay;
}
