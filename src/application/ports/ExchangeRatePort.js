/**
 * Puerto de Salida para la obtención de tipos de cambio de divisas.
 * Define la interfaz abstracta que la infraestructura debe implementar.
 */
export class ExchangeRatePort {
  /**
   * Obtiene la tasa de cambio de EUR a KRW actualizada.
   * @returns {Promise<import("../../domain/models/ExchangeRate.js").ExchangeRate>}
   */
  async getExchangeRate() {
    throw new Error("Method ExchangeRatePort.getExchangeRate() not implemented");
  }
}
