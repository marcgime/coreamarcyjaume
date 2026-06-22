import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationService } from '../../core/services/location.service';
import { WeatherService } from '../../core/services/weather.service';
import { ExchangeService } from '../../core/services/exchange.service';
import { DestinationHeroComponent } from '../../shared/components/organisms/destination-hero.component';
import { QuickActionsComponent } from '../../shared/components/organisms/quick-actions.component';
import { CurrencyModalComponent } from '../../shared/components/organisms/currency-modal.component';
import { EmergencyModalComponent } from '../../shared/components/organisms/emergency-modal.component';

@Component({
  selector: 'app-home-screen',
  standalone: true,
  imports: [
    CommonModule,
    DestinationHeroComponent,
    QuickActionsComponent,
    CurrencyModalComponent,
    EmergencyModalComponent
  ],
  template: `
    <!-- Main Scrollable Content -->
    <main class="content-area">
      <!-- Large Header Title -->
      <div>
        <h1 class="header-title">Corea Agosto 2026</h1>
      </div>

      <!-- Hero Destination Card (Weather & City) -->
      <app-destination-hero></app-destination-hero>

      <!-- Bento Grid Action Buttons -->
      <app-quick-actions
        (openCurrency)="isCurrencyOpen.set(true)"
        (openEmergency)="isEmergencyOpen.set(true)">
      </app-quick-actions>
    </main>

    <!-- Modals -->
    <app-currency-modal 
      [isOpen]="isCurrencyOpen()" 
      (close)="isCurrencyOpen.set(false)">
    </app-currency-modal>

    <app-emergency-modal 
      [isOpen]="isEmergencyOpen()" 
      (close)="isEmergencyOpen.set(false)">
    </app-emergency-modal>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      min-height: 0;
      overflow: hidden;
    }
    .content-area {
      padding: 24px 20px 100px 20px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      overflow-y: auto;
      flex-grow: 1;
    }
    .header-title {
      font-size: 34px;
      font-weight: 800;
      line-height: 41px;
      letter-spacing: -0.02em;
      color: var(--primary);
      margin-bottom: 8px;
    }
  `]
})
export class HomeScreenComponent implements OnInit {
  locationService = inject(LocationService);
  weatherService = inject(WeatherService);
  exchangeService = inject(ExchangeService);

  // Signals para visibilidad de modales
  isCurrencyOpen = signal<boolean>(false);
  isEmergencyOpen = signal<boolean>(false);

  async ngOnInit() {
    // Orquestación de la carga inicial reactiva mediante Signals
    try {
      // 1. Obtener localización
      const coords = await this.locationService.updateLocation();
      
      // 2. Cargar clima para las coordenadas
      await this.weatherService.fetchWeather(coords.lat, coords.lon);
      
      // 3. Pre-cargar tasas del conversor
      await this.exchangeService.loadExchangeRate();
    } catch (err) {
      console.error('Error inicializando pantalla de inicio:', err);
    }
  }
}
