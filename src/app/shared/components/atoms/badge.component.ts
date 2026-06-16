import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [ngClass]="['badge', typeClass]">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      color: #ffffff;
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(5px);
    }
    .gps {
      background: rgba(0, 163, 215, 0.3);
      border-color: rgba(0, 163, 215, 0.5);
      box-shadow: 0 0 10px rgba(0, 163, 215, 0.2);
      animation: pulse-border 2s infinite;
    }
    .tag {
      padding: 4px 10px;
      font-size: 9px;
      color: #00a3d7;
      border: 1px solid rgba(0, 163, 215, 0.2);
      background: rgba(0, 163, 215, 0.05);
      backdrop-filter: none;
    }
    @keyframes pulse-border {
      0% { box-shadow: 0 0 0 0 rgba(0, 163, 215, 0.4); }
      70% { box-shadow: 0 0 0 6px rgba(0, 163, 215, 0); }
      100% { box-shadow: 0 0 0 0 rgba(0, 163, 215, 0); }
    }
  `]
})
export class BadgeComponent {
  @Input() type: 'default' | 'gps' | 'tag' = 'default';

  get typeClass(): string {
    return this.type === 'gps' ? 'gps' : this.type === 'tag' ? 'tag' : '';
  }
}
