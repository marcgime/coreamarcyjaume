import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavItemComponent } from '../molecules/nav-item.component';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, NavItemComponent],
  template: `
    <nav class="nav-container">
      <div class="nav-bar">
        <app-nav-item label="Inicio" icon="home" link="/" [linkOptions]="{ exact: true }"></app-nav-item>
        <app-nav-item label="Alojamiento" icon="bed" link="/alojamiento"></app-nav-item>
        <app-nav-item label="Ruta" icon="map" link="/ruta"></app-nav-item>
        <app-nav-item label="Transporte" icon="train" link="/transporte"></app-nav-item>
      </div>
    </nav>
  `,
  styles: [`
    .nav-container {
      position: fixed;
      bottom: calc(var(--safe-area-bottom, 34px) + 2px); /* Flota sobre el Home Indicator de Apple */
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% - 40px); /* Margen elegante de 20px a cada lado */
      max-width: 480px; /* Cápsula compacta y centrada */
      z-index: 100;
      display: flex;
      justify-content: center;
      background: var(--glass-bg);
      backdrop-filter: var(--glass-nav-blur);
      -webkit-backdrop-filter: var(--glass-nav-blur);
      border: 1px solid var(--glass-border);
      border-radius: 9999px; /* Forma de píldora tipo dock de Apple */
      box-shadow: 0 12px 40px 0 rgba(43, 59, 156, 0.16); /* Sombra elegante e integrada */
    }
    .nav-bar {
      display: flex;
      justify-content: space-around;
      align-items: center;
      height: 60px; /* Estilizada */
      width: 100%;
      padding: 0 12px;
    }
  `]
})
export class BottomNavComponent {
}
