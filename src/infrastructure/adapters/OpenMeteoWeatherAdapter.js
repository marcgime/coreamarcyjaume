import { WeatherPort } from "../../application/ports/WeatherPort.js";
import { Weather } from "../../domain/models/Weather.js";

/**
 * Adaptador de Infraestructura para Meteorología.
 * Implementa el puerto WeatherPort mediante llamadas a la API pública de Open-Meteo.
 */
export class OpenMeteoWeatherAdapter extends WeatherPort {
  /**
   * Obtiene el clima para coordenadas geográficas.
   * @param {number} lat - Latitud
   * @param {number} lon - Longitud
   * @param {string} cityName - Ciudad a asignar
   * @param {boolean} [isCurrentLocation=false]
   * @returns {Promise<Weather>}
   */
  async getWeather(lat, lon, cityName, isCurrentLocation = false) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather API failed with status: ${response.status}`);
    }

    const data = await response.json();
    if (!data || !data.current_weather) {
      throw new Error("Invalid response from Weather API");
    }

    const temp = data.current_weather.temperature;
    const code = data.current_weather.weathercode;
    
    // Mapeo de códigos WMO a texto e icono de Material Symbols
    const { condition, icon } = this._mapWmoCode(code);

    return new Weather({
      temp,
      condition,
      icon,
      city: cityName,
      isCurrentLocation
    });
  }

  /**
   * Mapea el código WMO (World Meteorological Organization) a descripciones e iconos legibles.
   * @param {number} code
   * @returns {{condition: string, icon: string}}
   * @private
   */
  _mapWmoCode(code) {
    // Tabla de códigos WMO
    if (code === 0) {
      return { condition: "Despejado", icon: "wb_sunny" };
    } else if (code === 1 || code === 2 || code === 3) {
      return { condition: "Nublado", icon: "cloud" };
    } else if (code === 45 || code === 48) {
      return { condition: "Niebla", icon: "foggy" };
    } else if (code === 51 || code === 53 || code === 55) {
      return { condition: "Llovizna", icon: "rainy_light" };
    } else if (code === 61 || code === 63 || code === 65) {
      return { condition: "Lluvia", icon: "rainy" };
    } else if (code === 66 || code === 67) {
      return { condition: "Lluvia Helada", icon: "ac_unit" };
    } else if (code === 71 || code === 73 || code === 75) {
      return { condition: "Nieve", icon: "ac_unit" };
    } else if (code === 77) {
      return { condition: "Granizo", icon: "ac_unit" };
    } else if (code === 80 || code === 81 || code === 82) {
      return { condition: "Chubascos", icon: "rainy" };
    } else if (code === 85 || code === 86) {
      return { condition: "Chubascos de Nieve", icon: "ac_unit" };
    } else if (code === 95 || code === 96 || code === 99) {
      return { condition: "Tormenta", icon: "thunderstorm" };
    }
    return { condition: "Despejado", icon: "wb_sunny" }; // Fallback
  }
}
