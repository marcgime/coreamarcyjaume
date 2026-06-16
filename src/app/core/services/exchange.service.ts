import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface ExchangeRateResponse {
  result: string;
  rates: {
    KRW: number;
    [key: string]: number;
  };
  time_last_update_utc?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExchangeService {
  private http = inject(HttpClient);
  
  private readonly apiUrl = 'https://open.er-api.com/v6/latest/EUR';
  private readonly cacheKey = 'korea_voyage_exchange_rate_angular';
  private readonly cacheDuration = 14400000; // 4 horas en ms

  // Signals para el tipo de cambio y telemetría
  private rateSignal = signal<number>(1480.0);
  private lastUpdatedSignal = signal<Date>(new Date());
  
  // Signals para los inputs de la calculadora
  private eurInputSignal = signal<string>('1');
  private krwInputSignal = signal<string>('1480');

  readonly rate = this.rateSignal.asReadonly();
  readonly lastUpdated = this.lastUpdatedSignal.asReadonly();
  readonly eurValue = this.eurInputSignal.asReadonly();
  readonly krwValue = this.krwInputSignal.asReadonly();

  /**
   * Carga la tasa de cambio en tiempo real (con caché y fallback)
   */
  async loadExchangeRate(): Promise<number> {
    const cached = this.getCachedRate();
    if (cached) {
      this.rateSignal.set(cached.rate);
      this.lastUpdatedSignal.set(cached.lastUpdated);
      this.recalculateFromEur();
      return cached.rate;
    }

    try {
      const data = await firstValueFrom(this.http.get<ExchangeRateResponse>(this.apiUrl));
      if (data && data.result === 'success' && data.rates && data.rates.KRW) {
        const rateVal = data.rates.KRW;
        const updateDate = data.time_last_update_utc ? new Date(data.time_last_update_utc) : new Date();
        
        this.rateSignal.set(rateVal);
        this.lastUpdatedSignal.set(updateDate);
        this.setCachedRate(rateVal, updateDate);
        this.recalculateFromEur();
        return rateVal;
      }
      throw new Error('Invalid rate format');
    } catch (error) {
      console.warn('Fallo al obtener tipo de cambio de la API. Usando fallbacks. Detalle:', error);
      const expiredCached = this.getCachedRate(true);
      if (expiredCached) {
        this.rateSignal.set(expiredCached.rate);
        this.lastUpdatedSignal.set(expiredCached.lastUpdated);
      } else {
        this.rateSignal.set(1480.0);
        this.lastUpdatedSignal.set(new Date());
      }
      this.recalculateFromEur();
      return this.rateSignal();
    }
  }

  /**
   * Actualiza el valor de Euros e impulsa reactivamente el valor en Won.
   */
  updateEur(val: string): void {
    this.eurInputSignal.set(val);
    const numeric = parseFloat(val);
    if (isNaN(numeric) || numeric < 0) {
      this.krwInputSignal.set('');
      return;
    }
    const krw = Math.round(numeric * this.rateSignal());
    this.krwInputSignal.set(krw.toString());
  }

  /**
   * Actualiza el valor de Won Surcoreano e impulsa reactivamente el valor en Euros.
   */
  updateKrw(val: string): void {
    this.krwInputSignal.set(val);
    const numeric = parseFloat(val);
    if (isNaN(numeric) || numeric < 0) {
      this.eurInputSignal.set('');
      return;
    }
    const eur = numeric / this.rateSignal();
    this.eurInputSignal.set(parseFloat(eur.toFixed(2)).toString());
  }

  /**
   * Recalcula el Won a partir de los Euros actuales del estado de la Signal.
   */
  private recalculateFromEur(): void {
    const eur = parseFloat(this.eurInputSignal());
    if (!isNaN(eur) && eur >= 0) {
      this.krwInputSignal.set(Math.round(eur * this.rateSignal()).toString());
    }
  }

  private getCachedRate(allowExpired = false): { rate: number, lastUpdated: Date } | null {
    try {
      const cached = localStorage.getItem(this.cacheKey);
      if (!cached) return null;
      const { rate, lastUpdated, timestamp } = JSON.parse(cached);
      const age = Date.now() - timestamp;
      if (allowExpired || age < this.cacheDuration) {
        return { rate, lastUpdated: new Date(lastUpdated) };
      }
    } catch (e) {
      console.warn('Error leyendo caché local de divisas:', e);
    }
    return null;
  }

  private setCachedRate(rate: number, lastUpdated: Date): void {
    try {
      localStorage.setItem(this.cacheKey, JSON.stringify({
        rate,
        lastUpdated,
        timestamp: Date.now()
      }));
    } catch (e) {
      console.warn('Error escribiendo caché local de divisas:', e);
    }
  }
}
