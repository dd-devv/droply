import { ChangeDetectionStrategy, Component, inject, ViewChild, HostListener  } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { ThemeService } from '../../../../services/theme.service';
import { Button, ButtonModule } from 'primeng/button';
import { Card } from 'primeng/card';
import { Ripple } from 'primeng/ripple';
import { AsyncPipe } from '@angular/common';
import { Tooltip } from 'primeng/tooltip';
import { Popover } from 'primeng/popover';
import { PopoverModule } from 'primeng/popover';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import AuthService from '../../../auth/services/auth.service';
import { HideHeaderDirective } from '../../../../directives/hide-header.directive';
import { FormsModule } from '@angular/forms';
import { InputGroup } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputTextModule } from 'primeng/inputtext';
import { RedirectService } from '../../../../services/redirect.service';

@Component({
  selector: 'app-header',
  imports: [
    Button,
    Ripple,
    AsyncPipe,
    Tooltip,
    Card,
    RouterLink,
    PopoverModule,
    HideHeaderDirective,
    RouterLinkActive,
    FormsModule, InputGroup, InputGroupAddonModule, InputTextModule, ButtonModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  authService = inject(AuthService);
  authenticated = this.authService.isAuthenticated;
  router = inject(Router);
  isDarkTheme$: Observable<boolean>;
  redirectService = inject(RedirectService);

  // @ViewChild('op') op!: Popover;
  @ViewChild('op') popover!: Popover;
  private isPopoverOpen = false;

  @HostListener('window:scroll', [])
  hidePopoverOnScroll() {
    if (this.popover && this.isPopoverOpen) {
      this.popover.hide();
    }
  }

  toggle(event: any) {
    this.popover.toggle(event);
  }

  onPopoverShow() {
    this.isPopoverOpen = true;
  }

  onPopoverHide() {
    this.isPopoverOpen = false;
  }
  

  search = '';

  // toggle(event: any) {
  //   this.op.toggle(event);
  // }

  constructor(private themeService: ThemeService) {
    this.isDarkTheme$ = this.themeService.isDarkTheme$;
  }


  toggleTheme() {
    this.themeService.toggleTheme();
  }

  logout() {
    this.authService.logout();
  }

  searchTerm() {
    this.router.navigate(['/search'], {
      queryParams: { q: this.search }
    });
    this.search = '';
  }

  onLoginClick(): void {
    this.redirectService.goToLogin();
  }

  isSideMenuOpen = false;

  toggleSideMenu(): void {
    this.isSideMenuOpen = !this.isSideMenuOpen;
  }

  // Cerrar el menú al navegar
  // Puedes llamar a esta función en los eventos de clic de los enlaces del menú
  closeSideMenu(): void {
    this.isSideMenuOpen = false;
  }


  
}
