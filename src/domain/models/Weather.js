/**
 * Representa la información meteorológica de una ubicación específica.
 * Lógica pura de dominio sin llamadas de red o DOM.
 */
export class Weather {
  /**
   * @param {Object} params
   * @param {number} params.temp - Temperatura en grados Celsius
   * @param {string} params.condition - Condición textual del clima (ej. "Despejado")
   * @param {string} params.icon - Nombre del símbolo de Material Symbols (ej. "wb_sunny")
   * @param {string} params.city - Ciudad correspondiente
   * @param {boolean} [params.isCurrentLocation=false] - Indica si corresponde a la ubicación GPS real detectada
   */
  constructor({ temp, condition, icon, city, isCurrentLocation = false }) {
    this.temp = Math.round(temp);
    this.condition = condition || "Despejado";
    this.icon = icon || "wb_sunny";
    this.city = city || "Seúl";
    this.isCurrentLocation = !!isCurrentLocation;
  }

  /**
   * Genera el texto formateado del clima.
   * @returns {string}
   */
  getFormattedWeather() {
    return `${this.temp}°C ${this.condition}`;
  }
}
