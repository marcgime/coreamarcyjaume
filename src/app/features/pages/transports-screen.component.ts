import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransportsService } from '../../core/services/transports.service';
import { TransportTicketComponent } from '../../shared/components/molecules/transport-ticket.component';

@Component({
  selector: 'app-transports-screen',
  standalone: true,
  imports: [CommonModule, TransportTicketComponent],
  template: `
    <main class="content-area">
      <!-- Encabezado de la Sección -->
      <div class="header-section">
        <h1 class="header-title">Transportes</h1>
        <p class="subtitle">{{ transportsService.transports().length }} reservas de viaje confirmadas</p>
      </div>

      <div class="transports-list">
        @for (transport of transportsService.transports(); track transport.id) {
          <app-transport-ticket [transport]="transport"></app-transport-ticket>
        } @empty {
          <div class="glass-card empty-card">
            <span class="material-symbols-rounded">luggage</span>
            <p>No se han encontrado reservas de transporte.</p>
          </div>
        }
      </div>
    </main>
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
      padding: 24px 20px 110px 20px;
      display: flex;
      flex-direction: column;
      gap: 24px;
      overflow-y: auto;
      flex-grow: 1;
    }
    .header-section {
      margin-bottom: 4px;
    }
    .header-title {
      font-size: 34px;
      font-weight: 700;
      line-height: 41px;
      letter-spacing: -0.02em;
      color: var(--primary, #1A237E);
    }
    .subtitle {
      font-size: 15px;
      color: var(--text-secondary, #666);
      opacity: 0.8;
      margin-top: 4px;
    }
    .transports-list {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    .glass-card {
      background: var(--glass-bg, rgba(255, 255, 255, 0.7));
      backdrop-filter: var(--glass-blur, blur(20px));
      -webkit-backdrop-filter: var(--glass-blur, blur(20px));
      border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.4));
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.04);
    }
    .empty-card {
      padding: 40px;
      text-align: center;
      color: var(--text-secondary, #666);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      border-radius: 20px;
    }
    .empty-card span {
      font-size: 48px;
      color: #ccc;
    }
  `]
})
export class TransportsScreenComponent implements OnInit {
  transportsService = inject(TransportsService);

  ngOnInit() {
    this.transportsService.loadTransports().catch(err => {
      console.error('Error al inicializar la pantalla de transportes:', err);
    });
  }
}
