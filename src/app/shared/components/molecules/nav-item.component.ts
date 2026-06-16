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
        <app-icon [name]="icon" size="24px" [color]="rla.isActive ? '#00a3d7' : '#454652'"></app-icon>
        <span class="nav-label">{{ label }}</span>
      </a>
    } @else {
      <a class="nav-item" href="#" (click)="$event.preventDefault()">
        <app-icon [name]="icon" size="24px" color="#454652"></app-icon>
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
      color: #454652;
      text-decoration: none;
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.02em;
      transition: all 0.2s ease;
      flex-grow: 1;
      height: 100%;
      opacity: 0.7;
    }
    .nav-item:hover {
      opacity: 0.9;
      color: #1a237e;
    }
    .nav-label {
      margin-top: 2px;
    }
    .active {
      color: #00a3d7;
      opacity: 1;
      filter: drop-shadow(0 0 6px rgba(0, 163, 215, 0.4));
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
