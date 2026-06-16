import { ExchangeRatePort } from "../../application/ports/ExchangeRatePort.js";
import { ExchangeRate } from "../../domain/models/ExchangeRate.js";

/**
 * Adaptador de Infraestructura para el Tipo de Cambio.
 * Implementa el puerto ExchangeRatePort consultando un servicio de cambio en tiempo real,
 * implementando caché local (LocalStorage) y una tasa de fallback segura.
 */
export class ExchangeRateApiAdapter extends ExchangeRatePort {
  constructor() {
    super();
    this.apiUrl = "https://open.er-api.com/v6/latest/EUR";
    this.cacheKey = "korea_voyage_exchange_rate";
    // Caché de 4 horas en milisegundos (4 * 60 * 60 * 1000)
    this.cacheDuration = 14400000; 
  }

  /**
   * Obtiene la tasa de cambio de EUR a KRW.
   * @returns {Promise<ExchangeRate>}
   */
  async getExchangeRate() {
    // 1. Intentar obtener de la caché si no ha expirado
    const cached = this._getCachedRate();
    if (cached) {
      return cached;
    }

    // 2. Si no hay caché o expiró, solicitar a la API
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error(`Exchange API returned status ${response.status}`);
      }

      const data = await response.json();
      if (data && data.result === "success" && data.rates && data.rates.KRW) {
        const rateVal = data.rates.KRW;
        const lastUpdated = data.time_last_update_utc || new Date();
        
        // Guardar en la caché
        this._setCachedRate(rateVal, lastUpdated);

        return new ExchangeRate({
          rate: rateVal,
          lastUpdated: lastUpdated
        });
      } else {
        throw new Error("Invalid exchange rate data format");
      }
    } catch (error) {
      console.warn("Fallo al obtener tipo de cambio de la API, usando caché local o fallback. Detalle:", error);
      
      // Intentar retornar de la caché incluso si está expirada
      const expiredCached = this._getCachedRate(true);
      if (expiredCached) {
        return expiredCached;
      }

      // Si no hay nada en caché, usar fallback fijo razonable (1 EUR = 1480 KRW)
      return new ExchangeRate({
        rate: 1480.0,
        lastUpdated: new Date()
      });
    }
  }

  /**
   * Obtiene la tasa de cambio guardada en LocalStorage.
   * @param {boolean} [allowExpired=false] - Si es true, retorna la tasa aunque haya expirado
   * @returns {ExchangeRate|null}
   * @private
   */
  _getCachedRate(allowExpired = false) {
    try {
      const cachedData = localStorage.getItem(this.cacheKey);
      if (!cachedData) return null;

      const { rate, lastUpdated, timestamp } = JSON.parse(cachedData);
      
      const now = Date.now();
      const age = now - timestamp;

      if (allowExpired || age < this.cacheDuration) {
        return new ExchangeRate({
          rate,
          lastUpdated
        });
      }
    } catch (e) {
      console.warn("Error leyendo la caché de tipo de cambio de LocalStorage:", e);
    }
    return null;
  }

  /**
   * Guarda la tasa de cambio en LocalStorage con marca de tiempo.
   * @param {number} rate
   * @param {string|Date} lastUpdated
   * @private
   */
  _setCachedRate(rate, lastUpdated) {
    try {
      const cacheObj = {
        rate,
        lastUpdated: lastUpdated,
        timestamp: Date.now()
      };
      localStorage.setItem(this.cacheKey, JSON.stringify(cacheObj));
    } catch (e) {
      console.warn("Error escribiendo la caché de tipo de cambio en LocalStorage:", e);
    }
  }
}
