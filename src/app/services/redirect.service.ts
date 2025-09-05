import { Injectable, inject, PLATFORM_ID, signal, computed } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import AuthService from '../modules/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RedirectService {
  private router = inject(Router);
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);
  private destroy$ = new Subject<void>();

  // Signal para la URL de redirección
  private redirectUrl = signal<string>('/');

  // Computed para determinar si debe trackear navegación
  private shouldTrack = computed(() =>
    isPlatformBrowser(this.platformId) && !this.authService.isAuthenticated()
  );

  // Rutas que no deben ser trackeadas
  private readonly excludedRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/verify-whatsapp',
    '/logout'
  ];

  constructor() {
    // Solo inicializa el tracking en el navegador
    if (isPlatformBrowser(this.platformId)) {
      this.initializeNavigationTracking();
    }
  }

  /**
   * Inicializa el tracking de navegación automático
   */
  private initializeNavigationTracking(): void {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: NavigationEnd) => {
        // Solo trackea si debe hacerlo según el computed signal
        if (this.shouldTrack()) {
          this.updateRedirectUrl(event.urlAfterRedirects);
        }
      });
  }

  /**
   * Actualiza la URL de redirección si cumple las condiciones
   */
  private updateRedirectUrl(url: string): void {
    if (this.isValidRedirectUrl(url)) {
      this.redirectUrl.set(url);
    }
  }

  /**
   * Verifica si la URL es válida para redirección
   */
  private isValidRedirectUrl(url: string): boolean {
    return !this.excludedRoutes.some(excludedRoute =>
      url.toLowerCase().includes(excludedRoute.toLowerCase())
    );
  }

  /**
   * Establece manualmente una URL de redirección
   * Útil para botones de login en páginas públicas
   */
  setRedirectUrl(url: string): void {
    if (isPlatformBrowser(this.platformId) && this.isValidRedirectUrl(url)) {
      this.redirectUrl.set(url);
    }
  }

  /**
   * Método principal para ir al login guardando la URL actual
   * Usar este método en lugar de navegar directamente a /login
   */
  goToLogin(customUrl?: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    // Si se proporciona una URL específica, la usa; sino usa la actual
    const urlToSave = customUrl || this.router.url;
    this.setRedirectUrl(urlToSave);

    this.router.navigate(['/login']);
  }

  /**
   * Obtiene la URL de redirección actual
   */
  getRedirectUrl(): string {
    return this.redirectUrl();
  }

  /**
   * Redirige a la URL guardada y la limpia
   */
  redirectToSavedUrl(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const url = this.redirectUrl();
    this.clearRedirectUrl();

    // Pequeño delay para asegurar que el estado de auth se haya actualizado
    setTimeout(() => {
      this.router.navigateByUrl(url);
    }, 100);
  }

  /**
   * Limpia la URL de redirección
   */
  clearRedirectUrl(): void {
    this.redirectUrl.set('/');
  }

  /**
   * Método para limpiar subscripciones
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
