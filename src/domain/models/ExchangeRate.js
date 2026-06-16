/**
 * Representa la tasa de cambio entre Euro (EUR) y Won Surcoreano (KRW)
 * y provee operaciones matemáticas puras de conversión.
 */
export class ExchangeRate {
  /**
   * @param {Object} params
   * @param {number} params.rate - Cuántos KRW equivalen a 1 EUR (tasa EUR -> KRW)
   * @param {Date|string} [params.lastUpdated] - Fecha de última actualización de la tasa
   */
  constructor({ rate, lastUpdated = new Date() }) {
    if (!rate || isNaN(rate) || rate <= 0) {
      // Usar una tasa por defecto razonable en caso de error (ej. 1 EUR = 1500 KRW aproximadamente en 2026)
      this.rate = 1500;
    } else {
      this.rate = rate;
    }
    this.lastUpdated = typeof lastUpdated === 'string' ? new Date(lastUpdated) : lastUpdated;
  }

  /**
   * Convierte Euros a Wons Surcoreanos.
   * @param {number} eurAmount
   * @returns {number}
   */
  convertEurToKrw(eurAmount) {
    if (isNaN(eurAmount) || eurAmount < 0) return 0;
    return eurAmount * this.rate;
  }

  /**
   * Convierte Wons Surcoreanos a Euros.
   * @param {number} krwAmount
   * @returns {number}
   */
  convertKrwToEur(krwAmount) {
    if (isNaN(krwAmount) || krwAmount < 0 || this.rate === 0) return 0;
    return krwAmount / this.rate;
  }
}
