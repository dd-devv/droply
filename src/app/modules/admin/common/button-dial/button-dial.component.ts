import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { SpeedDial } from 'primeng/speeddial';

@Component({
  selector: 'app-button-dial',
  imports: [SpeedDial],
  templateUrl: './button-dial.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonDialComponent implements OnInit {
  private router = inject(Router);
  items: MenuItem[] = [];

  ngOnInit(): void {
    this.items = [
      {
        label: 'Regresar',
        icon: 'text-lg pi pi-sign-out',
        command: () => {
          this.router.navigate(['/']);
        },
      },
      {
        label: 'Mensajes',
        icon: 'text-lg pi pi-whatsapp',
        command: () => {
          this.router.navigate(['/admin/messages']);
        },
      },
      {
        label: 'Compras',
        icon: 'text-lg pi pi-shopping-bag',
        command: () => {
          this.router.navigate(['/admin/buys']);
        },
      },
      {
        label: 'Visualizaciones',
        icon: 'text-lg pi pi-eye',
        command: () => {
          this.router.navigate(['/admin/views']);
        },
      },
      {
        label: 'Búsquedas',
        icon: 'text-lg pi pi-search',
        command: () => {
          this.router.navigate(['/admin/searches']);
        },
      },
      {
        label: 'Seguimientos',
        icon: 'text-lg pi pi-check-square',
        command: () => {
          this.router.navigate(['/admin/tracks']);
        },
      },
      {
        label: 'Inicio',
        icon: 'text-lg pi pi-home',
        command: () => {
          this.router.navigate(['/admin']);
        },
      }
    ];
  }
}
