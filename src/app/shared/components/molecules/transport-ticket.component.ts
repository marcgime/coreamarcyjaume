import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Transport } from '../../../core/services/transports.service';
import { IconComponent } from '../atoms/icon.component';

@Component({
  selector: 'app-transport-ticket',
  standalone: true,
  imports: [CommonModule, IconComponent],
  template: `
    <div class="ticket" [class.ticket-expanded]="isExpanded()">
      <!-- HEADER -->
      <div class="ticket-header" [ngClass]="transport.type" (click)="toggleExpand()">
        <div class="header-left">
          <app-icon [name]="transport.logo" size="24px" color="#ffffff"></app-icon>
          <div class="title-details">
            <span class="company-name">{{ transport.company }}</span>
            <span class="collapsed-route" *ngIf="!isExpanded()">{{ getCollapsedRouteSummary() }}</span>
          </div>
        </div>
        <div class="header-right">
          <div class="category">{{ transport.category }}</div>
          <app-icon name="keyboard_arrow_down" size="24px" color="#ffffff" class="chevron" [class.rotated]="isExpanded()"></app-icon>
        </div>
      </div>
      
      <!-- DETALLES EXPANDIBLES -->
      <div class="expandable-content" [class.show]="isExpanded()">
        <!-- BODY -->
        <div class="ticket-body">
          <!-- VUELOS (INTERNACIONALES O DOMÉSTICOS) -->
          <ng-container *ngIf="transport.type.startsWith('flight') && transport.segments">
            <div class="segments-container">
              <div *ngFor="let seg of transport.segments; let i = index" class="segment">
                
                <!-- Fila 1: Aeropuertos e Icono de Trayecto -->
                <div class="airport-row">
                  <div class="airport-col">
                    <span class="code">{{ seg.departure.code }}</span>
                    <span class="city">{{ seg.departure.city }}</span>
                    <span class="terminal" *ngIf="seg.departure.terminal">T{{ seg.departure.terminal }}</span>
                  </div>
                  
                  <div class="journey-col">
                    <span class="duration">{{ seg.duration }}</span>
                    <div class="journey-line">
                      <span class="line-dot"></span>
                      <app-icon name="flight" size="16px" color="#999" class="plane-icon"></app-icon>
                      <span class="line-dot"></span>
                    </div>
                    <span class="flight-no">{{ seg.flight }}</span>
                  </div>
                  
                  <div class="airport-col text-right">
                    <span class="code">{{ seg.arrival.code }}</span>
                    <span class="city">{{ seg.arrival.city }}</span>
                    <span class="terminal" *ngIf="seg.arrival.terminal">T{{ seg.arrival.terminal }}</span>
                  </div>
                </div>

                <!-- Fila 2: Tiempos y Fechas -->
                <div class="datetime-row">
                  <div class="datetime-col">
                    <span class="time">{{ seg.departure.time }}</span>
                    <span class="date">{{ seg.departure.date }}</span>
                  </div>
                  <div class="class-info">
                    <span class="class-badge">{{ seg.class }}</span>
                  </div>
                  <div class="datetime-col text-right">
                    <span class="time">{{ seg.arrival.time }}</span>
                    <span class="date">{{ seg.arrival.date }}</span>
                  </div>
                </div>

                <!-- Fila Extra: Equipaje -->
                <div class="extra-row">
                  <span class="baggage-tag">
                    <app-icon name="luggage" size="16px" color="#666"></app-icon>
                    Equipaje: {{ seg.baggage }}
                  </span>
                </div>

                <!-- Separador entre trayectos/escalas -->
                <div *ngIf="i < transport.segments.length - 1" class="layover-divider">
                  <span class="layover-text">Conexión en aeropuerto</span>
                </div>
              </div>
            </div>
          </ng-container>

          <!-- COCHE DE ALQUILER -->
          <ng-container *ngIf="transport.type === 'car_rental'">
            <div class="car-container">
              <div class="car-header-details">
                <span class="car-title">{{ transport.vehicle }}</span>
                <span class="car-badge-cdw">🛡️ {{ transport.cdw }}</span>
              </div>
              
              <div class="car-dates-grid">
                <div class="car-date-card">
                  <span class="card-label">Recogida</span>
                  <span class="car-time">{{ transport.pickup?.time }}</span>
                  <span class="car-date">{{ transport.pickup?.date }}</span>
                  <span class="car-loc">{{ transport.pickup?.location }}</span>
                </div>
                
                <div class="car-date-card">
                  <span class="card-label">Devolución</span>
                  <span class="car-time">{{ transport.dropoff?.time }}</span>
                  <span class="car-date">{{ transport.dropoff?.date }}</span>
                  <span class="car-loc">{{ transport.dropoff?.location }}</span>
                </div>
              </div>

              <div class="car-address-box">
                <app-icon name="location_on" size="18px" color="#E65100"></app-icon>
                <span class="address-text">{{ transport.pickup?.address }}</span>
              </div>

              <div class="car-price-box" *ngIf="transport.totalAmount">
                <span class="price-label">Importe Total</span>
                <span class="price-val">{{ transport.totalAmount }}</span>
              </div>
            </div>
          </ng-container>
        </div>

        <!-- DIVIDER (TICKET STYLE) -->
        <div class="ticket-divider"></div>

        <!-- FOOTER -->
        <div class="ticket-footer">
          <div class="pnr-row">
            <span class="pnr-label">Localizador (PNR)</span>
            <span class="pnr-value">{{ transport.pnr }}</span>
          </div>
          
          <!-- PASAJEROS / DETALLES -->
          <div class="passengers-box" *ngIf="transport.passengers && transport.passengers.length > 0">
            <div class="passenger-item" *ngFor="let pass of transport.passengers">
              <div class="pass-header">
                <app-icon name="person" size="16px" color="#888"></app-icon>
                <span class="pass-name">{{ pass.name }}</span>
              </div>
              <div class="pass-meta">
                <span *ngIf="pass.ticket" class="ticket-code">Tkt: {{ pass.ticket }}</span>
                <span *ngIf="pass.seats && pass.seats.length > 0" class="seat-badge">
                  💺 {{ pass.seats.join(' | ') }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ticket {
      background: var(--glass-bg, rgba(255, 255, 255, 0.7));
      backdrop-filter: var(--glass-blur, blur(20px));
      -webkit-backdrop-filter: var(--glass-blur, blur(20px));
      border: 1px solid var(--glass-border, rgba(255, 255, 255, 0.4));
      border-radius: 24px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      position: relative;
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.04);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .ticket-expanded {
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
      transform: translateY(-2px);
    }
    
    .ticket-header {
      padding: 16px 18px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: white;
      cursor: pointer;
      user-select: none;
      gap: 12px;
    }
    
    .flight_international { background: linear-gradient(135deg, #1A237E, #303F9F); }
    .flight_domestic { background: linear-gradient(135deg, #00838F, #0097A7); }
    .car_rental { background: linear-gradient(135deg, #E65100, #F57C00); }
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
      min-width: 0; /* Permite truncar texto si es necesario */
    }

    .title-details {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }
    
    .company-name {
      font-weight: 700;
      font-size: 1.05rem;
      letter-spacing: 0.2px;
      line-height: 1.2;
    }

    .collapsed-route {
      font-size: 0.75rem;
      font-weight: 500;
      opacity: 0.85;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .category {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      font-weight: 700;
      background: rgba(255, 255, 255, 0.2);
      padding: 4px 8px;
      border-radius: 6px;
      white-space: nowrap;
    }

    .chevron {
      transition: transform 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .chevron.rotated {
      transform: rotate(180deg);
    }

    /* CONTENEDOR COLAPSABLE */
    .expandable-content {
      max-height: 0;
      opacity: 0;
      overflow: hidden;
      transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
    }

    .expandable-content.show {
      max-height: 1500px;
      opacity: 1;
    }

    .ticket-body {
      padding: 20px 18px;
    }

    /* SEGMENTS */
    .segments-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .segment {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    /* FILA 1: AEROPUERTOS */
    .airport-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
    }

    .airport-col {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .airport-col.text-right {
      text-align: right;
      align-items: flex-end;
    }

    .code {
      font-size: 1.8rem;
      font-weight: 800;
      color: var(--primary, #1A237E);
      line-height: 1.1;
    }

    .city {
      font-size: 0.85rem;
      color: #333;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 110px;
    }

    .terminal {
      font-size: 0.7rem;
      color: #666;
      font-weight: 700;
      background: rgba(0,0,0,0.05);
      padding: 1px 5px;
      border-radius: 4px;
      margin-top: 2px;
      width: fit-content;
    }

    .journey-col {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1.2;
    }

    .duration {
      font-size: 0.7rem;
      color: #777;
      font-weight: 600;
      margin-bottom: 2px;
    }

    .journey-line {
      display: flex;
      align-items: center;
      width: 100%;
      gap: 4px;
    }

    .line-dot {
      width: 4px;
      height: 4px;
      background-color: #bbb;
      border-radius: 50%;
    }

    .plane-icon {
      transform: rotate(90deg);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .journey-line::before, .journey-line::after {
      content: '';
      flex: 1;
      height: 1px;
      background: repeating-linear-gradient(90deg, #ccc, #ccc 3px, transparent 3px, transparent 6px);
    }

    .flight-no {
      font-size: 0.75rem;
      font-weight: 700;
      color: #555;
      margin-top: 2px;
    }

    /* FILA 2: DATETIME */
    .datetime-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(0,0,0,0.02);
      padding: 8px 12px;
      border-radius: 10px;
    }

    .datetime-col {
      display: flex;
      flex-direction: column;
    }

    .datetime-col.text-right {
      text-align: right;
    }

    .time {
      font-size: 1.1rem;
      font-weight: 800;
      color: #222;
    }

    .date {
      font-size: 0.75rem;
      color: #666;
      font-weight: 600;
    }

    .class-info {
      display: flex;
      justify-content: center;
    }

    .class-badge {
      font-size: 0.7rem;
      font-weight: 700;
      color: #00838F;
      background: rgba(0, 131, 143, 0.08);
      padding: 2px 6px;
      border-radius: 4px;
    }

    .extra-row {
      display: flex;
      justify-content: flex-start;
    }

    .baggage-tag {
      font-size: 0.75rem;
      color: #666;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .layover-divider {
      position: relative;
      text-align: center;
      margin: 10px 0;
    }

    .layover-divider::before {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      top: 50%;
      height: 1px;
      background: rgba(0,0,0,0.06);
      z-index: 1;
    }

    .layover-text {
      position: relative;
      z-index: 2;
      background: #fdfdfd;
      padding: 2px 10px;
      font-size: 0.7rem;
      font-weight: 700;
      color: #666;
      border-radius: 99px;
      border: 1px solid rgba(0,0,0,0.05);
    }

    /* CAR RENTAL */
    .car-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .car-header-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(0,0,0,0.06);
      padding-bottom: 8px;
    }

    .car-title {
      font-size: 1.1rem;
      font-weight: 800;
      color: #E65100;
    }

    .car-badge-cdw {
      font-size: 0.75rem;
      font-weight: 700;
      color: #E65100;
      background: rgba(230, 81, 0, 0.08);
      padding: 3px 8px;
      border-radius: 6px;
    }

    .car-dates-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .car-date-card {
      background: rgba(0,0,0,0.02);
      border-radius: 12px;
      padding: 10px;
      display: flex;
      flex-direction: column;
    }

    .card-label {
      font-size: 0.7rem;
      text-transform: uppercase;
      font-weight: 700;
      color: #777;
    }

    .car-time {
      font-size: 1.25rem;
      font-weight: 800;
      color: #222;
      margin: 2px 0;
    }

    .car-date {
      font-size: 0.75rem;
      font-weight: 600;
      color: #555;
    }

    .car-loc {
      font-size: 0.7rem;
      color: #777;
      margin-top: 4px;
      font-weight: 500;
    }

    .car-address-box {
      display: flex;
      gap: 6px;
      background: #fff;
      border: 1px solid rgba(0,0,0,0.05);
      border-radius: 10px;
      padding: 8px 10px;
      align-items: center;
    }

    .address-text {
      font-size: 0.75rem;
      color: #555;
      line-height: 1.3;
      font-weight: 500;
    }

    .car-price-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(230, 81, 0, 0.04);
      padding: 8px 12px;
      border-radius: 10px;
    }

    .price-label {
      font-size: 0.8rem;
      font-weight: 700;
      color: #555;
    }

    .price-val {
      font-size: 1.1rem;
      font-weight: 800;
      color: #E65100;
    }

    /* TICKET DIVIDER */
    .ticket-divider {
      height: 1px;
      background: repeating-linear-gradient(90deg, #ccc, #ccc 6px, transparent 6px, transparent 12px);
      margin: 0 16px;
      position: relative;
    }

    .ticket-divider::before, .ticket-divider::after {
      content: '';
      position: absolute;
      top: -8px;
      width: 16px;
      height: 16px;
      background: #f0f2f5;
      border-radius: 50%;
      border: 1px solid var(--glass-border, rgba(255,255,255,0.4));
      box-sizing: border-box;
    }

    .ticket-divider::before {
      left: -25px;
      border-left: 0;
    }

    .ticket-divider::after {
      right: -25px;
      border-right: 0;
    }

    /* FOOTER */
    .ticket-footer {
      padding: 16px 18px;
      background: rgba(0, 0, 0, 0.01);
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .pnr-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .pnr-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      color: #777;
      font-weight: 700;
    }

    .pnr-value {
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--primary, #1A237E);
      letter-spacing: 0.5px;
    }

    /* PASSENGERS */
    .passengers-box {
      display: flex;
      flex-direction: column;
      gap: 8px;
      border-top: 1px dashed rgba(0, 0, 0, 0.08);
      padding-top: 10px;
    }

    .passenger-item {
      display: flex;
      flex-direction: column;
      background: #fff;
      border: 1px solid rgba(0,0,0,0.04);
      border-radius: 10px;
      padding: 8px 12px;
      gap: 4px;
    }

    .pass-header {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .pass-name {
      font-size: 0.8rem;
      font-weight: 700;
      color: #333;
    }

    .pass-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.75rem;
    }

    .ticket-code {
      color: #777;
      font-family: monospace;
      font-weight: 500;
    }

    .seat-badge {
      font-weight: 700;
      color: var(--primary, #1A237E);
      background: rgba(26, 35, 126, 0.05);
      padding: 1px 6px;
      border-radius: 4px;
    }
  `]
})
export class TransportTicketComponent {
  @Input() transport!: Transport;
  
  isExpanded = signal<boolean>(false);

  toggleExpand() {
    this.isExpanded.update(val => !val);
  }

  getCollapsedRouteSummary(): string {
    if (this.transport.type.startsWith('flight') && this.transport.segments) {
      const firstSegment = this.transport.segments[0];
      const lastSegment = this.transport.segments[this.transport.segments.length - 1];
      return `${firstSegment.departure.code} ➔ ${lastSegment.arrival.code} (${this.transport.segments.length} trayectos)`;
    } else if (this.transport.type === 'car_rental') {
      return `Alquiler en ${this.transport.pickup?.location || 'Jeju'}`;
    }
    return '';
  }
}
