import { BrowserLocationAdapter } from "./infrastructure/adapters/BrowserLocationAdapter.js";
import { OpenMeteoWeatherAdapter } from "./infrastructure/adapters/OpenMeteoWeatherAdapter.js";
import { ExchangeRateApiAdapter } from "./infrastructure/adapters/ExchangeRateApiAdapter.js";
import { StaticActivityRepository } from "./infrastructure/adapters/StaticActivityRepository.js";
import { GetDashboardData } from "./application/use-cases/GetDashboardData.js";
import { PopupManager } from "./ui/popup-manager.js";
import { App } from "./ui/app.js";

/**
 * Punto de entrada global y Composición Root de la aplicación.
 * Instancia los adaptadores concretos de infraestructura, realiza la inyección
 * de dependencias en los casos de uso correspondientes y levanta el controlador de UI.
 */
document.addEventListener("DOMContentLoaded", () => {
  // 1. Instanciación de Adaptadores de Infraestructura
  const locationAdapter = new BrowserLocationAdapter();
  const weatherAdapter = new OpenMeteoWeatherAdapter();
  const exchangeRateAdapter = new ExchangeRateApiAdapter();
  const activityRepository = new StaticActivityRepository();

  // 2. Instanciación de Casos de Uso con Inyección de Dependencias
  const getDashboardDataUseCase = new GetDashboardData({
    locationPort: locationAdapter,
    weatherPort: weatherAdapter,
    activityRepositoryPort: activityRepository
  });

  // 3. Inicialización del Gestor de Popups
  const popupManager = new PopupManager();

  // 4. Inicialización del Controlador de UI Principal
  const app = new App({
    getDashboardDataUseCase,
    exchangeRatePort: exchangeRateAdapter,
    popupManager
  });

  // 5. Arranque de la Aplicación
  app.init()
    .then(() => {
      console.log("Corea Voyage Hub inicializado correctamente.");
    })
    .catch((error) => {
      console.error("Error crítico durante la inicialización de la aplicación:", error);
    });
});
