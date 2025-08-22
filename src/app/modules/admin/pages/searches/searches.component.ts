import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { SearchService } from '../../services/search.service';
import { FieldsetModule } from 'primeng/fieldset';
import { AccordionModule } from 'primeng/accordion';
import { Chip } from 'primeng/chip';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { DatePicker } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { DataSearches, SearchesRes } from '../../interfaces';

@Component({
  selector: 'app-searches',
  imports: [
    FieldsetModule,
    AccordionModule,
    Chip,
    DatePipe,
    ChartModule,
    DatePicker,
    ButtonModule,
    CardModule,
    FormsModule
  ],
  templateUrl: './searches.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SearchesComponent implements OnInit {
  searchService = inject(SearchService);
  isLoading = this.searchService.isLoading;
  searchesGraph = this.searchService.SearchesGraph;
  searchesAll = this.searchService.SearchesByADmin;
  filteredSearches: SearchesRes[] = [];

  platformId = inject(PLATFORM_ID);
  private cd = inject(ChangeDetectorRef);

  // Variables para el DatePicker
  startDate: Date = new Date(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).setHours(0, 0, 0, 0));
  endDate: Date = new Date(new Date().setHours(0, 0, 0, 0));
  rangeDates: Date[] = [this.startDate, this.endDate];

  // Variables para el gráfico
  data: any;
  options: any;


  ngOnInit(): void {
    this.initChart();
    this.getAllSearches();
    this.getSearchesGraph(this.startDate, this.endDate);
  }

  getAllSearches(): void {
    this.searchService.getAllSearches().subscribe({
      next: (res) => {
        this.filteredSearches = this.searchesAll();
      }
    });
  }

  getSearchesGraph(startDate: Date, endDate: Date): void {
    this.searchService.getSearchesGraph(startDate, endDate).subscribe({
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
      this.getSearchesGraph(this.startDate, this.endDate);

      // Filtrar el arreglo de términos por rango de fechas
      this.filteredSearches = this.searchesAll().map(searchObject => ({
        ...searchObject,
        terms: searchObject.terms.filter(term => {
          const termDate = new Date(term.searchDate);
          const startDate = new Date(this.startDate);
          const endDate = new Date(this.endDate);

          // Establecer las horas para comparación completa del día
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);

          return termDate >= startDate && termDate <= endDate;
        })
      })).filter(searchObject => searchObject.terms.length > 0); // Opcional: remover objetos sin términos
    }
  }

  // Método para aplicar filtro manualmente
  applyDateFilter(): void {
    if (this.startDate && this.endDate) {
      this.getSearchesGraph(this.startDate, this.endDate);
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
            label: 'Búsquedas realizadas por fecha',
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
                return `Búsquedas: ${context.raw}`;
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
  updateChart(searchesData: DataSearches[]): void {
    if (isPlatformBrowser(this.platformId)) {
      const documentStyle = getComputedStyle(document.documentElement);

      if (searchesData && searchesData.length > 0) {
        // Ordenar datos por fecha
        const sortedData = [...searchesData].sort((a: DataSearches, b: DataSearches) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        // Formatear fechas para que sean más legibles
        const formattedDates = sortedData.map((item: DataSearches) => {
          const date = new Date(item.date);
          return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        });

        const quantities = sortedData.map((item: DataSearches) => item.count);

        this.data = {
          labels: formattedDates,
          datasets: [
            {
              label: 'Búsquedas realizadas por fecha',
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
              label: 'Búsquedas realizadas',
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
    const graphData = this.searchesGraph();
    this.updateChart(graphData);
  }

  // Método para limpiar filtros
  clearFilters(): void {
    this.startDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 días antes del actual
    this.endDate = new Date(); // Fecha actual
    this.getSearchesGraph(this.startDate, this.endDate);
  }
}
