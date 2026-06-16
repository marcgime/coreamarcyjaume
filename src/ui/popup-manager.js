/**
 * Gestor de Modales y Popups.
 * Controla la visualización, animaciones y gestos táctiles (deslizar para cerrar)
 * para los popups glassmorphic.
 */
export class PopupManager {
  constructor() {
    this.activeModal = null;
    this._initTouchEvents();
  }

  /**
   * Abre un modal específico por ID de overlay.
   * @param {string} modalId
   */
  open(modalId) {
    const overlay = document.getElementById(modalId);
    if (!overlay) return;

    // Cerrar cualquier modal activo previo
    if (this.activeModal) {
      this.close(this.activeModal.id);
    }

    overlay.classList.add('active');
    this.activeModal = overlay;
    document.body.style.overflow = 'hidden'; // Prevenir scroll de fondo

    // Reiniciar transformaciones por arrastre
    const content = overlay.querySelector('.modal-content');
    if (content) {
      content.style.transform = '';
      content.style.transition = '';
    }
  }

  /**
   * Cierra un modal específico por ID.
   * @param {string} modalId
   */
  close(modalId) {
    const overlay = document.getElementById(modalId);
    if (!overlay) return;

    overlay.classList.remove('active');
    
    // Si era el modal activo, limpiarlo
    if (this.activeModal && this.activeModal.id === modalId) {
      this.activeModal = null;
    }

    // Si no quedan modales abiertos, reactivar scroll del body
    if (!document.querySelector('.modal-overlay.active')) {
      document.body.style.overflow = '';
    }

    // Limpiar estilos inline añadidos por gestos
    const content = overlay.querySelector('.modal-content');
    if (content) {
      setTimeout(() => {
        content.style.transform = '';
        content.style.transition = '';
      }, 300); // Esperar a que termine la transición CSS de salida
    }
  }

  /**
   * Inicializa escuchadores globales para cerrar modales (clic fuera y botones cerrar).
   */
  init() {
    // 1. Botones de cerrar del DOM
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const modalId = e.currentTarget.getAttribute('data-close-modal');
        this.close(modalId);
      });
    });

    // 2. Cerrar haciendo clic en el fondo difuminado (overlay)
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          this.close(overlay.id);
        }
      });
    });
  }

  /**
   * Añade gestos táctiles de "deslizar hacia abajo" para cerrar,
   * emulando el comportamiento nativo de hojas de ruta de iOS.
   * @private
   */
  _initTouchEvents() {
    let startY = 0;
    let currentY = 0;
    let isDragging = false;
    let activeContent = null;

    document.addEventListener('touchstart', (e) => {
      if (!this.activeModal) return;

      // Detectar si el toque comenzó en el tirador o en el contenido del modal activo
      const content = this.activeModal.querySelector('.modal-content');
      const handle = this.activeModal.querySelector('.modal-handle');
      
      const isTouchInHandle = handle && handle.contains(e.target);
      const isTouchInHeader = e.target.closest('.modal-header');

      // Solo permitir arrastrar desde el tirador o cabecera para evitar conflictos con scroll interno
      if (isTouchInHandle || isTouchInHeader) {
        startY = e.touches[0].clientY;
        activeContent = content;
        isDragging = true;
        activeContent.style.transition = 'none'; // Desactivar transición durante el arrastre
      }
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (!isDragging || !activeContent) return;

      currentY = e.touches[0].clientY;
      const deltaY = currentY - startY;

      // Solo permitir arrastrar hacia abajo
      if (deltaY > 0) {
        activeContent.style.transform = `translateY(${deltaY}px)`;
      }
    }, { passive: true });

    document.addEventListener('touchend', () => {
      if (!isDragging || !activeContent) return;

      isDragging = false;
      const deltaY = currentY - startY;
      const threshold = 120; // Píxeles necesarios para cerrar

      activeContent.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';

      if (deltaY > threshold) {
        // Cerrar modal
        const overlayId = this.activeModal.id;
        activeContent.style.transform = 'translateY(100%)';
        setTimeout(() => {
          this.close(overlayId);
        }, 150);
      } else {
        // Devolver a su posición original
        activeContent.style.transform = 'translateY(0)';
      }

      activeContent = null;
    });
  }
}
