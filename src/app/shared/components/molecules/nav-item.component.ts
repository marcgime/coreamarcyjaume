import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../atoms/icon.component';

@Component({
  selector: 'app-nav-item',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, IconComponent],
  template: `
    @if (link) {
      <a [routerLink]="link" [routerLinkActiveOptions]="linkOptions" routerLinkActive="active" #rla="routerLinkActive" class="nav-item">
        <div class="icon-wrapper">
          <div class="active-indicator"></div>
          <app-icon [name]="icon" size="22px" [color]="rla.isActive ? 'var(--primary)' : 'var(--text-secondary)'"></app-icon>
        </div>
        <span class="nav-label">{{ label }}</span>
      </a>
    } @else {
      <a class="nav-item" href="#" (click)="$event.preventDefault()">
        <div class="icon-wrapper">
          <app-icon [name]="icon" size="22px" color="var(--text-secondary)"></app-icon>
        </div>
        <span class="nav-label">{{ label }}</span>
      </a>
    }
  `,
  styles: [`
    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 11px;
      font-weight: 600;
      font-family: 'Plus Jakarta Sans', sans-serif;
      letter-spacing: 0.02em;
      transition: all 0.2s ease;
      flex-grow: 1;
      height: 100%;
      opacity: 0.85;
    }
    .nav-item:hover {
      opacity: 1;
      color: var(--primary);
    }
    .icon-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 32px;
      border-radius: 16px;
      z-index: 1;
      margin-bottom: 2px;
      transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .active-indicator {
      position: absolute;
      inset: 0;
      background: rgba(43, 59, 156, 0.12); /* Color de fondo sutil del indicator pill */
      border-radius: 16px;
      z-index: -1;
      transform: scaleX(0.3);
      opacity: 0;
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.2s ease;
    }
    .nav-label {
      margin-top: 1px;
      font-size: 10px;
      transition: font-weight 0.2s ease;
    }
    .active {
      color: var(--primary);
      opacity: 1;
    }
    .active .active-indicator {
      transform: scaleX(1);
      opacity: 1;
    }
    .active .nav-label {
      font-weight: 700;
      color: var(--primary);
    }
    .active .icon-wrapper {
      transform: scale(1.05);
    }
    .active ::ng-deep .material-symbols-outlined {
      font-variation-settings: 'FILL' 1;
    }
  `]
})
export class NavItemComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) icon!: string;
  @Input() link?: string;
  @Input() linkOptions: { exact: boolean } = { exact: false };
}
