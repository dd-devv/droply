import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { FieldsetModule } from 'primeng/fieldset';
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { Tooltip } from 'primeng/tooltip';
import { DataRegs } from '../../interfaces';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'app-users',
  imports: [
    FieldsetModule,
    TableModule,
    CommonModule,
    Tooltip,
    ChartModule,
    DatePicker,
    ButtonModule,
    CardModule,
    FormsModule
  ],
  templateUrl: './users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class UsersComponent implements OnInit {
  userService = inject(UserService);
  platformId = inject(PLATFORM_ID);
  private cd = inject(ChangeDetectorRef);

  isLoading = this.userService.isLoading;
  usersGraph = this.userService.UsersRegGraph;
  usersAll = this.userService.UsersByADmin;

  // Variables para el DatePicker
  startDate: Date = new Date(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0));
  endDate: Date = new Date(new Date().setHours(0, 0, 0, 0));
  rangeDates: Date[] = [this.startDate, this.endDate];

  // Variables para el gráfico
  data: any;
  options: any;

  ngOnInit(): void {
    this.getAllUsers();
    this.getUsersGraph(this.startDate, this.endDate);
    this.initChart();
  }

  getAllUsers(): void {
    this.userService.getAllUsers().subscribe();
  }

  getUsersGraph(startDate: Date, endDate: Date): void {
    this.userService.getUsersGraph(startDate, endDate).subscribe({
      next: () => {
        this.updateChartData();
      }
    });
  }

  // Método para actualizar las fechas desde el DatePicker
  onDateRangeChange(): void {
    if (this.rangeDates && this.rangeDates.length === 2 && this.rangeDates[0] && this.rangeDates[1]) {
      this.startDate = this.rangeDates[0];
      this.endDate = this.rangeDates[1];
      this.getUsersGraph(this.startDate, this.endDate);
    }
  }

  // Método para aplicar filtro manualmente
  applyDateFilter(): void {
    if (this.startDate && this.endDate) {
      this.getUsersGraph(this.startDate, this.endDate);
    }
  }

  // Inicializar configuración del gráfico
  initChart(): void {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--p-text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
      const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

      // Inicializar con datos vacíos
      this.data = {
        labels: [],
        datasets: [
          {
            label: 'Usuarios registrados por fecha',
            data: [],
            fill: true,
            borderColor: documentStyle.getPropertyValue('--p-primary-500'),
            backgroundColor: 'rgba(34, 197, 94, 0.2)',
            tension: 0.4
          }
        ]
      };

      this.options = {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
          legend: {
            labels: {
              color: textColor
            }
          },
          tooltip: {
            callbacks: {
              label: function (context: any) {
                return `Usuarios: ${context.raw}`;
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              color: textColorSecondary
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false
            }
          },
          y: {
            ticks: {
              color: textColorSecondary,
              stepSize: 1
            },
            grid: {
              color: surfaceBorder,
              drawBorder: false
            },
            beginAtZero: true
          }
        }
      };
      this.cd.markForCheck();
    }
  }

  // Método para actualizar el gráfico con los datos de usuarios
  updateChart(usersData: DataRegs[]): void {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);

      if (usersData && usersData.length > 0) {
        // Ordenar datos por fecha
        const sortedData = [...usersData].sort((a: DataRegs, b: DataRegs) =>
          new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
        );

        // Formatear fechas para que sean más legibles
        const formattedDates = sortedData.map((item: DataRegs) => {
          const date = new Date(item.fecha);
          return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        });

        const quantities = sortedData.map((item: DataRegs) => item.cantidad);

        this.data = {
          labels: formattedDates,
          datasets: [
            {
              label: 'Usuarios registrados por fecha',
              data: quantities,
              fill: true,
              borderColor: documentStyle.getPropertyValue('--p-primary-500'),
              backgroundColor: 'rgba(34, 197, 94, 0.2)',
              tension: 0.4
            }
          ]
        };
      } else {
        // Datos vacíos
        this.data = {
          labels: ['Sin datos'],
          datasets: [
            {
              label: 'Usuarios registrados',
              data: [0],
              fill: true,
              borderColor: '#E5E7EB',
              backgroundColor: 'rgba(243, 244, 246, 0.2)',
              tension: 0.4
            }
          ]
        };
      }

      this.cd.markForCheck();
    }
  }

  // Actualizar datos del gráfico (método simplificado)
  updateChartData(): void {
    const graphData = this.usersGraph();
    this.updateChart(graphData);
  }

  // Método para limpiar filtros
  clearFilters(): void {
    this.startDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 días antes del actual
    this.endDate = new Date(); // Fecha actual
    this.getUsersGraph(this.startDate, this.endDate);
  }
}
