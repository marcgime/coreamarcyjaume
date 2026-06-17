import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ItineraryDay {
  day: number;
  date: string;
  location: string;
  title: string;
  description: string;
  tags: string[];
}

@Component({
  selector: 'app-itinerary-screen',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="content-area relative pt-[40px] pb-[120px] px-[20px]">
      <div class="relative mt-[24px]">
        <div class="absolute left-[18px] top-4 bottom-4 timeline-line opacity-20"></div>
        
        <div *ngFor="let item of days; let i = index" class="relative pl-14 mb-[20px] group">
          <!-- Bolita del día -->
          <div class="absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center z-10 shadow-lg transition-transform cursor-pointer hover:scale-105 active:scale-95"
               [ngClass]="getDotClass(i)"
               (click)="toggleDay(i)">
            <span class="text-white font-bold text-[16px]">{{item.day}}</span>
          </div>
          
          <div class="flex flex-col">
            <!-- Ubicación del día (Visible siempre) -->
            <div class="flex flex-col justify-center min-h-[40px] cursor-pointer" (click)="toggleDay(i)">
              <h3 class="font-headline-sm text-[18px] font-semibold leading-tight" [ngClass]="getTextClass(i)">
                {{item.location}}
              </h3>
              <span class="text-[12px] text-[#454652] mt-0.5 flex items-center gap-1">
                <span class="material-symbols-outlined text-[14px]">calendar_today</span>
                {{item.date}}
              </span>
            </div>
            
            <!-- Detalles expandidos -->
            <div *ngIf="expandedDay === i" class="glass-card rounded-xl p-4 mt-2 flex flex-col gap-3 relative overflow-hidden transition-all duration-300 animate-fade-in">
              <div class="flex justify-between items-start">
                <h4 class="font-headline-sm text-headline-sm text-[#1a1c1f] text-[18px] font-semibold">{{item.title}}</h4>
                <span class="material-symbols-outlined cursor-pointer hover:bg-black/5 rounded-full p-1 -mr-1 -mt-1 transition-colors" [ngClass]="getTextClass(i)" (click)="toggleDay(i)">
                  close
                </span>
              </div>
              
              <div class="flex items-center text-[#454652] text-[13px] gap-1 -mt-1">
                 <span class="material-symbols-outlined text-[16px]">calendar_today</span>
                 {{item.date}}
              </div>
              
              <div class="flex flex-col gap-3 mt-1 max-h-[50vh] overflow-y-auto custom-scroll pr-1">
                <p class="font-body-md text-body-md text-[#454652] text-[15px]" [innerHTML]="formatDescription(item.description)"></p>
                
                <div class="flex flex-wrap gap-2 mt-2">
                  <span *ngFor="let tag of item.tags" class="glass-card px-2 py-1 rounded-lg font-caption text-caption text-[#1a237e] text-[11px]">{{tag}}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
      width: 100%;
      height: 100%;
      min-height: 0;
      overflow: hidden;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, transparent 50%, #f9f9fe 100%);
    }
    .content-area {
      flex: 1;
      width: 100%;
      height: 100%;
      overflow-y: auto;
    }
    .bg-surface { background-color: #f9f9fe; }
    .glass-card {
      background: rgba(255, 255, 255, 0.4);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.5);
    }
    .timeline-line {
      width: 2px;
      background: linear-gradient(180deg, #1a237e 0%, #00a3d7 50%, #1a237e 100%);
    }
    .custom-scroll::-webkit-scrollbar {
      width: 4px;
    }
    .custom-scroll::-webkit-scrollbar-thumb {
      background: rgba(26, 35, 126, 0.2);
      border-radius: 4px;
    }
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out;
    }
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class ItineraryScreenComponent implements OnInit {
  days: ItineraryDay[] = [];
  expandedDay: number | null = null;
  
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    fetch('assets/data/itinerary.json')
      .then(res => res.json())
      .then(data => {
        this.days = data;
        this.cdr.detectChanges();
      })
      .catch(err => console.error('Error fetching itinerary:', err));
  }

  getDotClass(index: number) {
    const colors = [
      'bg-[#1a237e] shadow-[#1a237e]/20',
      'bg-[#864e5a] shadow-[#864e5a]/20',
      'bg-[#00a3d7] shadow-[#00a3d7]/20',
      'bg-[#2e7d32] shadow-[#2e7d32]/20',
      'bg-[#ef6c00] shadow-[#ef6c00]/20',
      'bg-[#6a1b9a] shadow-[#6a1b9a]/20',
      'bg-[#c62828] shadow-[#c62828]/20',
      'bg-[#00838f] shadow-[#00838f]/20',
    ];
    return colors[index % colors.length];
  }

  getTextClass(index: number) {
    const colors = [
      'text-[#1a237e]',
      'text-[#864e5a]',
      'text-[#00a3d7]',
      'text-[#2e7d32]',
      'text-[#ef6c00]',
      'text-[#6a1b9a]',
      'text-[#c62828]',
      'text-[#00838f]',
    ];
    return colors[index % colors.length];
  }

  formatDescription(desc: string) {
    return desc.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  }

  toggleDay(index: number) {
    if (this.expandedDay === index) {
      this.expandedDay = null;
    } else {
      this.expandedDay = index;
    }
  }

}
