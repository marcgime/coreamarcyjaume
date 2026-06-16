import { Weather } from "../../domain/models/Weather.js";

/**
 * Caso de Uso: Obtener datos para la pantalla de inicio.
 * Coordina la obtención de la geolocalización, clima correspondiente (con fallbacks si falla)
 * y el listado de actividades próximas.
 */
export class GetDashboardData {
  /**
   * @param {Object} ports
   * @param {import("../ports/LocationPort.js").LocationPort} ports.locationPort
   * @param {import("../ports/WeatherPort.js").WeatherPort} ports.weatherPort
   * @param {import("../ports/ActivityRepositoryPort.js").ActivityRepositoryPort} ports.activityRepositoryPort
   */
  constructor({ locationPort, weatherPort, activityRepositoryPort }) {
    this.locationPort = locationPort;
    this.weatherPort = weatherPort;
    this.activityRepositoryPort = activityRepositoryPort;
  }

  /**
   * Ejecuta el caso de uso.
   * @returns {Promise<{ weather: Weather, activities: Array<import("../../domain/models/Activity.js").Activity> }>}
   */
  async execute() {
    let lat = 37.5665; // Coordenadas por defecto (Seúl)
    let lon = 126.9780;
    let city = "Seúl";
    let isCurrentLocation = false;

    // 1. Intentar obtener la ubicación por GPS
    try {
      const coords = await this.locationPort.getCurrentLocation();
      lat = coords.lat;
      lon = coords.lon;
      
      // Intentar obtener el nombre de la ciudad
      try {
        const geoInfo = await this.locationPort.getCityFromCoordinates(lat, lon);
        if (geoInfo && geoInfo.city) {
          city = geoInfo.city;
          isCurrentLocation = true;
        }
      } catch (geoError) {
        console.warn("Error resolviendo el nombre de la ciudad, usando coordenadas. Detalle:", geoError);
        city = `Ubicación (${lat.toFixed(2)}, ${lon.toFixed(2)})`;
        isCurrentLocation = true;
      }
    } catch (locationError) {
      console.warn("Fallo al obtener geolocalización por GPS. Usando Seúl por defecto. Detalle:", locationError);
      // Mantener Seúl como preconfigurado
      city = "Seúl";
      isCurrentLocation = false;
    }

    // 2. Obtener el clima para la ubicación resuelta (o Seúl por defecto)
    let weather;
    try {
      weather = await this.weatherPort.getWeather(lat, lon, city, isCurrentLocation);
    } catch (weatherError) {
      console.error("Fallo al obtener clima. Usando datos de clima por defecto para " + city + ". Detalle:", weatherError);
      // Fallback estático para clima
      weather = new Weather({
        temp: 24,
        condition: "Despejado",
        icon: "wb_sunny",
        city: city,
        isCurrentLocation: isCurrentLocation
      });
    }

    // 3. Obtener actividades de viaje
    let activities = [];
    try {
      activities = await this.activityRepositoryPort.getUpcomingActivities();
    } catch (activityError) {
      console.error("Fallo al recuperar las actividades. Detalle:", activityError);
      activities = [];
    }

    return {
      weather,
      activities
    };
  }
}
