/**
 * Controlador de la Interfaz de Usuario (UI Controller).
 * Se encarga de manipular el DOM, escuchar eventos de interacción
 * y actualizar la vista con los resultados de la capa de aplicación.
 */
export class App {
  /**
   * @param {Object} params
   * @param {import("../application/use-cases/GetDashboardData.js").GetDashboardData} params.getDashboardDataUseCase
   * @param {import("../application/ports/ExchangeRatePort.js").ExchangeRatePort} params.exchangeRatePort
   * @param {import("./popup-manager.js").PopupManager} params.popupManager
   */
  constructor({ getDashboardDataUseCase, exchangeRatePort, popupManager }) {
    this.getDashboardDataUseCase = getDashboardDataUseCase;
    this.exchangeRatePort = exchangeRatePort;
    this.popupManager = popupManager;
    this.currentRate = null; // Instancia de ExchangeRate cargada
  }

  /**
   * Inicializa la interfaz y registra los eventos del usuario.
   */
  async init() {
    this.popupManager.init();
    this._registerEvents();
    
    // Carga inicial de datos
    await this.refreshDashboard();
  }

  /**
   * Refresca los datos del Dashboard llamando al caso de uso.
   */
  async refreshDashboard() {
    this._showDashboardSkeletons();

    try {
      const { weather, activities } = await this.getDashboardDataUseCase.execute();
      
      this._renderWeatherHero(weather);
      this._renderActivities(activities);
    } catch (error) {
      console.error("Error al refrescar el dashboard:", error);
      this._showErrorState();
    }
  }

  /**
   * Registra los eventos de click e inputs en la interfaz.
   * @private
   */
  _registerEvents() {
    // 1. Acciones del Bento Grid
    
    // Traductor (Abre Google Translate en una pestaña nueva configurado ES -> KO)
    const translateBtn = document.getElementById('btn-translate');
    if (translateBtn) {
      translateBtn.addEventListener('click', () => {
        // Enlace para Google Traductor de Español a Coreano
        const translateUrl = "https://translate.google.com/?sl=es&tl=ko&op=translate";
        window.open(translateUrl, '_blank');
      });
    }

    // Divisa (Carga tasa en tiempo real y abre el Popup conversor)
    const currencyBtn = document.getElementById('btn-currency');
    if (currencyBtn) {
      currencyBtn.addEventListener('click', async () => {
        this.popupManager.open('modal-currency');
        await this._loadAndSetupConverter();
      });
    }

    // Emergencia (Abre el modal de emergencias)
    const emergencyBtn = document.getElementById('btn-emergency');
    if (emergencyBtn) {
      emergencyBtn.addEventListener('click', () => {
        this.popupManager.open('modal-emergency');
      });
    }

    // 2. Lógica en tiempo real de la calculadora de divisa
    const eurInput = document.getElementById('calc-eur');
    const krwInput = document.getElementById('calc-krw');

    if (eurInput && krwInput) {
      // Evento al escribir en EUR
      eurInput.addEventListener('input', () => {
        if (!this.currentRate) return;
        const eurVal = parseFloat(eurInput.value);
        if (isNaN(eurVal) || eurVal < 0) {
          krwInput.value = '';
          return;
        }
        const krwVal = this.currentRate.convertEurToKrw(eurVal);
        // Formatear a entero o 2 decimales para Won (generalmente no se usan decimales en Won)
        krwInput.value = Math.round(krwVal);
      });

      // Evento al escribir en KRW
      krwInput.addEventListener('input', () => {
        if (!this.currentRate) return;
        const krwVal = parseFloat(krwInput.value);
        if (isNaN(krwVal) || krwVal < 0) {
          eurInput.value = '';
          return;
        }
        const eurVal = this.currentRate.convertKrwToEur(krwVal);
        // Formatear a 2 decimales para Euros
        eurInput.value = parseFloat(eurVal.toFixed(2));
      });
    }
  }

  /**
   * Carga la tasa de cambio en tiempo real y actualiza los campos de texto del modal.
   * @private
   */
  async _loadAndSetupConverter() {
    const rateValEl = document.getElementById('rate-value');
    const rateUpdateEl = document.getElementById('rate-update');
    const eurInput = document.getElementById('calc-eur');
    const krwInput = document.getElementById('calc-krw');

    if (rateValEl) rateValEl.textContent = "Cargando tasa en tiempo real...";
    if (eurInput) eurInput.value = '';
    if (krwInput) krwInput.value = '';

    try {
      this.currentRate = await this.exchangeRatePort.getExchangeRate();
      
      if (rateValEl) {
        // Formatear con separadores de miles
        const formattedRate = new Intl.NumberFormat('es-ES', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        }).format(this.currentRate.rate);
        
        rateValEl.textContent = `1 EUR = ${formattedRate} KRW`;
      }
      
      if (rateUpdateEl) {
        const dateStr = this.currentRate.lastUpdated.toLocaleString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        rateUpdateEl.textContent = `Actualizado: ${dateStr}`;
      }

      // Inicializar con 1 EUR por defecto
      if (eurInput && krwInput) {
        eurInput.value = '1';
        krwInput.value = Math.round(this.currentRate.convertEurToKrw(1));
      }
    } catch (e) {
      console.error("Error configurando calculadora de divisa:", e);
      if (rateValEl) rateValEl.textContent = "Error al conectar con el servidor de divisas.";
    }
  }

  /**
   * Renderiza los datos de meteorología y el fondo en el Hero principal.
   * @param {import("../domain/models/Weather.js").Weather} weather
   * @private
   */
  _renderWeatherHero(weather) {
    const heroTitle = document.getElementById('hero-city-name');
    const heroImg = document.getElementById('hero-bg-image');
    const badgeContainer = document.getElementById('hero-badge-row');
    const weatherBadge = document.getElementById('weather-top-badge');

    // 1. Mostrar ciudad
    if (heroTitle) {
      heroTitle.textContent = `${weather.city}, KR`;
    }

    // 2. Gestionar el marcador "Ubicación actual"
    if (badgeContainer) {
      // Limpiar antiguos badges
      badgeContainer.innerHTML = '';
      
      // Añadir siempre el badge de DESTINO ACTUAL
      const destBadge = document.createElement('div');
      destBadge.className = 'hero-badge';
      destBadge.innerHTML = `<span class="material-symbols-outlined text-[14px]">location_on</span>DESTINO ACTUAL`;
      badgeContainer.appendChild(destBadge);

      // Si ha funcionado correctamente el GPS, añadir el marcador "Ubicación actual"
      if (weather.isCurrentLocation) {
        const gpsBadge = document.createElement('div');
        gpsBadge.className = 'hero-badge gps-badge';
        gpsBadge.innerHTML = `<span class="material-symbols-outlined text-[14px] animate-pulse">my_location</span>Ubicación Actual`;
        badgeContainer.appendChild(gpsBadge);
      }
    }

    // 3. Poner imagen de fondo representativa de la ciudad
    if (heroImg) {
      const cityLower = weather.city.toLowerCase().trim();
      let imageUrl = "";

      // Diccionario de imágenes representativas espectaculares de Unsplash
      const cityImages = {
        "seoul": "https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=1200&auto=format&fit=crop",
        "seúl": "https://images.unsplash.com/photo-1517154421773-0529f29ea451?q=80&w=1200&auto=format&fit=crop",
        "busan": "https://images.unsplash.com/photo-1578321278280-e35324c45b85?q=80&w=1200&auto=format&fit=crop",
        "jeju": "https://images.unsplash.com/photo-1542456488-bd98ec4e1f74?q=80&w=1200&auto=format&fit=crop",
        "incheon": "https://images.unsplash.com/photo-1590487988256-9ed24133863e?q=80&w=1200&auto=format&fit=crop",
        "gyeongju": "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=1200&auto=format&fit=crop"
      };

      if (cityImages[cityLower]) {
        imageUrl = cityImages[cityLower];
      } else {
        // Fallback dinámico usando la API gratuita de búsqueda de imágenes de Unsplash
        imageUrl = `https://images.unsplash.com/featured/?${encodeURIComponent(weather.city)},travel&q=80&w=1200&auto=format&fit=crop`;
      }

      heroImg.src = imageUrl;
      heroImg.alt = `Fondo representativo de la ciudad de ${weather.city}`;
    }

    // 4. Actualizar el clima (que ahora está movido a la parte superior sobre la ciudad)
    if (weatherBadge) {
      weatherBadge.innerHTML = `
        <span class="material-symbols-outlined">${weather.icon}</span>
        <span>${weather.getFormattedWeather()}</span>
      `;
      weatherBadge.style.display = 'flex';
    }
  }

  /**
   * Renderiza el listado de actividades próximas.
   * @param {Array<import("../domain/models/Activity.js").Activity>} activities
   * @private
   */
  _renderActivities(activities) {
    const listEl = document.getElementById('activities-list-container');
    if (!listEl) return;

    listEl.innerHTML = '';

    if (activities.length === 0) {
      listEl.innerHTML = `
        <div class="glass-card p-6 rounded-[20px] text-center text-on-surface-variant font-body-md">
          No hay actividades planificadas para hoy.
        </div>
      `;
      return;
    }

    activities.forEach(act => {
      const card = document.createElement('div');
      card.className = 'glass-card activity-card';
      card.innerHTML = `
        <div class="activity-img-wrapper">
          <img class="activity-img" src="${act.image}" alt="${act.imageAlt || act.title}" loading="lazy">
        </div>
        <div class="activity-info">
          <h4 class="activity-title">${act.title}</h4>
          <p class="activity-time">${act.time}</p>
        </div>
        <div class="activity-tag">
          <span>${act.category}</span>
        </div>
      `;
      listEl.appendChild(card);
    });
  }

  /**
   * Muestra Skeletons/Animaciones de carga en el dashboard.
   * @private
   */
  _showDashboardSkeletons() {
    const weatherBadge = document.getElementById('weather-top-badge');
    if (weatherBadge) {
      weatherBadge.style.display = 'none';
    }

    const listEl = document.getElementById('activities-list-container');
    if (listEl) {
      listEl.innerHTML = `
        <div class="glass-card activity-card skeleton-card opacity-75" style="height: 88px; border:none; background:rgba(255,255,255,0.2)">
          <div class="skeleton" style="width: 64px; height: 64px; border-radius: 12px; margin-right: 16px;"></div>
          <div style="flex-grow: 1; display:flex; flex-direction:column; gap:8px;">
            <div class="skeleton" style="width: 60%; height: 16px;"></div>
            <div class="skeleton" style="width: 40%; height: 12px;"></div>
          </div>
        </div>
        <div class="glass-card activity-card skeleton-card opacity-50" style="height: 88px; border:none; background:rgba(255,255,255,0.2)">
          <div class="skeleton" style="width: 64px; height: 64px; border-radius: 12px; margin-right: 16px;"></div>
          <div style="flex-grow: 1; display:flex; flex-direction:column; gap:8px;">
            <div class="skeleton" style="width: 50%; height: 16px;"></div>
            <div class="skeleton" style="width: 30%; height: 12px;"></div>
          </div>
        </div>
      `;
    }
  }

  /**
   * Muestra un estado de error genérico en la UI.
   * @private
   */
  _showErrorState() {
    const listEl = document.getElementById('activities-list-container');
    if (listEl) {
      listEl.innerHTML = `
        <div class="glass-card p-6 rounded-[20px] text-center text-error font-body-md" style="background: var(--error-bg); border-color: var(--error-border);">
          Error al cargar los datos del viaje. Inténtalo de nuevo más tarde.
        </div>
      `;
    }
  }
}
