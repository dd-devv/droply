import { ChangeDetectionStrategy, Component, inject, PLATFORM_ID, signal } from '@angular/core';
import ProductService from '../services/product.service';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CurrencyPipe, isPlatformBrowser, TitleCasePipe } from '@angular/common';
import { BadgeModule } from 'primeng/badge';
import { TimeAgoPipe } from '../../../pipes/timeAgo.pipe';
import { Skeleton } from 'primeng/skeleton';
import { ExtractDomainPipe } from '../../../pipes/extract-domain.pipe';
import { RouterLink } from '@angular/router';
import { Select } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { Tooltip } from 'primeng/tooltip';
import AuthService from '../../auth/services/auth.service';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { PaginatePipe } from '../../../pipes/paginate.pipe';
import { ProductPublic } from '../interfaces';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SkeletonProdComponent } from "../../../ui/skeleton-prod/skeleton-prod.component";
import { DrawerModule } from 'primeng/drawer';
import { CategoryService } from '../services/category.service';
import { firstValueFrom } from 'rxjs';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-offers',
  standalone: true,
  imports: [
    ButtonModule,
    CardModule,
    TitleCasePipe,
    CurrencyPipe,
    TimeAgoPipe,
    BadgeModule,
    ExtractDomainPipe,
    RouterLink,
    Select,
    FormsModule,
    Tooltip,
    Toast,
    PaginationComponent,
    PaginatePipe,
    InputTextModule,
    FloatLabelModule,
    SkeletonProdComponent,
    DrawerModule
  ],
  providers: [ExtractDomainPipe, MessageService],
  templateUrl: './offers.component.html',
  styleUrl: './offers.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OffersComponent {
  productService = inject(ProductService);
  extractDomainPipe = inject(ExtractDomainPipe);
  private messageService = inject(MessageService);
  authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);

  categoryService = inject(CategoryService);
  categorysUser = this.categoryService.categorysUser;

  selectedStore: string | null = null;
  availableStores: string[] = [];
  selectedCategory: string | null = null;
  availableCategories: string[] = [];
  searchTerm: string = '';

  // Configuración interna de cuántas categorías considerar
  private categoriesToConsider: number = 1; // Solo primera categoría por defecto
  // Para cambiar a todas las categorías: this.categoriesToConsider = Infinity;

  componentLoading = this.productService.isLoading;
  products = this.productService.productsPublic;
  filteredProducts = signal<ProductPublic[]>([]);
  isLoading = this.productService.isLoading;

  estadosOfertas = signal<{ [key: string]: boolean }>({});
  isAuthenticated = false;

  currentPage = 1;
  pageSize = 30

  selectedDiscountRange: any = null;
  discountRanges = [
    { label: '10% o más', value: { min: 10, max: 100 } },
    { label: '20% o más', value: { min: 20, max: 100 } },
    { label: '30% o más', value: { min: 30, max: 100 } },
    { label: '40% o más', value: { min: 40, max: 100 } },
    { label: '50% o más', value: { min: 50, max: 100 } },
    { label: '60% o más', value: { min: 60, max: 100 } },
    { label: '70% o más', value: { min: 70, max: 100 } },
    { label: '80% o más', value: { min: 80, max: 100 } },
    { label: '90% o más', value: { min: 90, max: 100 } }
  ];

  showSidebar = false;
  sidebarVisible = false;
  drawerVisible = false;

  private meta = inject(Meta);
  private title = inject(Title);

  loadStores() {
    const stores = new Set<string>();
    this.products().forEach(product => {
      const domain = this.extractDomainPipe.transform(product.url);
      if (domain) stores.add(domain);
    });
    this.availableStores = Array.from(stores).sort();
  }

  loadCategories() {
    const categories = new Set<string>();
    this.products().forEach(product => {
      if (product.categories && Array.isArray(product.categories)) {
        // Tomar solo el número configurado de categorías
        const categoriesToAdd = this.categoriesToConsider === Infinity
          ? product.categories
          : product.categories.slice(0, this.categoriesToConsider);

        categoriesToAdd.forEach(category => {
          if (category) categories.add(category);
        });
      }
    });
    this.availableCategories = Array.from(categories).sort();
  }

  async ngOnInit(): Promise<void> {
    this.setMetaTags();
    this.isLoading.set(true);
    // Primero verificar autenticación
    this.isAuthenticated = await firstValueFrom(this.authService.checkAuthStatus());

    // Luego ejecutar las queries
    this.obteneOfertas();

    if (this.isAuthenticated) {
      this.getCategorysUser();
    }
  }

  private setMetaTags(): void {
    // Establecer Título para Ofertas
    this.title.setTitle('Mejores Ofertas y Descuentos Perú - droply.pe | +25 Tiendas | Hasta 70% OFF');

    // Meta tags para SEO básicos
    this.meta.addTags([
      { name: 'description', content: 'Descubre las mejores ofertas y descuentos de más de 25 tiendas del Perú en un solo lugar. Filtra por tienda, categoría y porcentaje de descuento. Ofertas actualizadas diariamente de Falabella, MercadoLibre, Plaza Vea y más.' },
      { name: 'keywords', content: 'ofertas peru, descuentos peru, ofertas falabella, ofertas mercadolibre, ofertas plazavea, cyber ofertas, descuentos online, ofertas sodimac, ofertas oechsle, mejores ofertas peru, cyber monday peru, black friday peru' },
      { name: 'author', content: 'droply' },
      { name: 'robots', content: 'index, follow' },

      // Canonical URL para evitar contenido duplicado
      { name: 'canonical', content: 'https://droply.pe/ofertas' },

      // Open Graph Meta Tags para compartir en redes sociales
      { property: 'og:title', content: 'Mejores Ofertas Perú 🔥 | Descuentos hasta 70% OFF | +25 Tiendas' },
      { property: 'og:description', content: '¡Encuentra las mejores ofertas del Perú! Descuentos increíbles de Falabella, MercadoLibre, Plaza Vea y más de 25 tiendas. Actualizado diariamente.' },
      { property: 'og:image', content: 'https://droply.pe/assets/images/ofertas-descuentos.jpg' },
      { property: 'og:url', content: 'https://droply.pe/ofertas' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'droply.pe' },
      { property: 'og:locale', content: 'es_PE' },

      // Twitter Card Meta Tags
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Mejores Ofertas Perú 🔥 | Descuentos hasta 70% OFF' },
      { name: 'twitter:description', content: 'Encuentra ofertas increíbles de +25 tiendas peruanas. Filtra por descuento, tienda y categoría. ¡Actualizado diariamente!' },
      { name: 'twitter:image', content: 'https://droply.pe/assets/images/ofertas-descuentos.jpg' },

      // Meta tags adicionales para SEO local
      { name: 'geo.region', content: 'PE' },
      { name: 'geo.country', content: 'Perú' },
      { name: 'geo.placename', content: 'Lima, Perú' },

      // Schema.org structured data para ofertas
      {
        name: 'schema.org', content: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Mejores Ofertas y Descuentos Perú",
          "description": "Descubre las mejores ofertas y descuentos de más de 25 tiendas del Perú",
          "url": "https://droply.pe/ofertas",
          "mainEntity": {
            "@type": "ItemList",
            "name": "Ofertas Destacadas",
            "numberOfItems": "500+",
            "itemListElement": {
              "@type": "Offer",
              "category": "Ofertas y Descuentos",
              "areaServed": "Perú",
              "availableAtOrFrom": {
                "@type": "Organization",
                "name": "droply.pe"
              }
            }
          },
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Inicio",
                "item": "https://droply.pe"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Ofertas",
                "item": "https://droply.pe/ofertas"
              }
            ]
          }
        })
      },

      // Meta tags específicos para ofertas y descuentos
      { name: 'offer-type', content: 'descuentos,ofertas,promociones' },
      { name: 'discount-range', content: '10%-70%' },
      { name: 'store-count', content: '25+' },
      { name: 'update-frequency', content: 'daily' },

      // Meta tags para filtros y búsqueda
      { name: 'filter-options', content: 'tienda,categoria,descuento' },
      { name: 'search-enabled', content: 'true' },
      { name: 'sort-options', content: 'descuento,precio,popularidad' },

      // Meta tags para tiendas principales (SEO)
      { name: 'featured-stores', content: 'falabella,mercadolibre,plazavea,sodimac,oechsle,tottus,linio,platanitos,ripley,saga' },
      { name: 'categories', content: 'tecnologia,moda,hogar,deportes,belleza,electrodomesticos' },

      // Meta tags para eventos especiales
      { name: 'special-events', content: 'cyber monday,black friday,cyber days,hot sale' },
      { name: 'deal-types', content: 'flash sale,liquidacion,clearance,outlet' },

      // Meta tags para mejorar CTR
      { name: 'max-discount', content: '70%' },
      { name: 'min-discount', content: '10%' },
      { name: 'avg-savings', content: '35%' },
      { name: 'deal-count', content: '500+' },

      // Meta tags para rich snippets de ofertas
      { property: 'product:retailer', content: 'Multiple' },
      { property: 'product:availability', content: 'in stock' },
      { property: 'product:condition', content: 'new' },
      { property: 'product:price:currency', content: 'PEN' },

      // Meta tags adicionales para SEO local de ofertas
      { name: 'shopping-region', content: 'Peru' },
      { name: 'deal-location', content: 'online' },
      { name: 'shipping-area', content: 'Peru' },

      // Meta tags para tiempo y urgencia
      { name: 'offer-validity', content: 'limited time' },
      { name: 'update-time', content: 'real-time' },
      { name: 'deal-freshness', content: 'daily updated' },

      // Meta tags para móvil y experiencia
      { name: 'mobile-optimized', content: 'true' },
      { name: 'fast-loading', content: 'true' },
      { name: 'user-friendly', content: 'true' }
    ]);
  }

  getCategorysUser() {
    this.categoryService.getUserCategorys().subscribe({
      next: () => {
        this.categorysUser.set(this.categoryService.categorysUser());
      }
    });
  }

  obteneOfertas() {
    this.productService.getLatestResultsPublic().subscribe({
      next: (res) => {
        this.loadStores();
        this.loadCategories();

        if (this.isAuthenticated) {
          this.products().forEach(prod => {
            this.cargarEstadoJobs(prod.urlId);
          });
        }

        this.filteredProducts.set(this.products());
        this.applyFilter();
      },
      error: (err) => {
        console.error('Error al cargar ofertas:', err);
      }
    });
  }

  // applyFilter() {
  //   this.currentPage = 1;

  //   let filtered = this.products();

  //   // Aplicar filtro por tienda si está seleccionada
  //   if (this.selectedStore) {
  //     filtered = filtered.filter(product =>
  //       this.extractDomainPipe.transform(product.url) === this.selectedStore
  //     );
  //   }

  //   // Aplicar filtro por búsqueda si hay término
  //   if (this.searchTerm.trim()) {
  //     const searchTermLower = this.searchTerm.toLowerCase().trim();
  //     filtered = filtered.filter(product =>
  //       product.productTitle.toLowerCase().includes(searchTermLower)
  //     );
  //   }

  //   // Ordenar productos por categorías del usuario (si está autenticado)
  //   if (this.authService.isAuthenticatedUser() && this.categorysUser().length > 0) {
  //     filtered = this.sortProductsByUserCategories(filtered);
  //   }

  //   this.filteredProducts.set(filtered);
  // }
  applyFilter() {
    this.currentPage = 1;

    let filtered = this.products();

    // Filtro por tienda
    if (this.selectedStore) {
      filtered = filtered.filter(product =>
        this.extractDomainPipe.transform(product.url) === this.selectedStore
      );
    }

    // Filtro por búsqueda
    if (this.searchTerm.trim()) {
      const searchTermLower = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(product =>
        product.productTitle.toLowerCase().includes(searchTermLower)
      );
    }

    // Filtro por descuento (nuevo)
    if (this.selectedDiscountRange) {
      filtered = filtered.filter(product =>
        product.discountPercentage >= this.selectedDiscountRange.value.min &&
        product.discountPercentage <= this.selectedDiscountRange.value.max
      );
    }

    // Ordenar por categorías del usuario
    if (this.authService.isAuthenticatedUser() && this.categorysUser().length > 0) {
      filtered = this.sortProductsByUserCategories(filtered);
    }

    this.filteredProducts.set(filtered);
  }

  private sortProductsByUserCategories(products: ProductPublic[]): ProductPublic[] {
    const userCategories = this.categorysUser();

    // Separar productos que coinciden y no coinciden con las categorías del usuario
    const matchingProducts: ProductPublic[] = [];
    const nonMatchingProducts: ProductPublic[] = [];

    products.forEach(product => {
      // Si no tiene categorías, va directamente a no coincidentes
      if (product.categories.every(cat => !cat || cat.trim() === '')) {
        nonMatchingProducts.push(product);
        return;
      }

      const hasMatchingCategory = product.categories.some(productCategory =>
        userCategories.some(userCategory =>
          productCategory.toLowerCase().includes(userCategory.toLowerCase()) ||
          userCategory.toLowerCase().includes(productCategory.toLowerCase())
        )
      );

      if (hasMatchingCategory) {
        matchingProducts.push(product);
      } else {
        nonMatchingProducts.push(product);
      }
    });

    // Retornar productos coincidentes primero, seguidos de los no coincidentes
    return [...matchingProducts, ...nonMatchingProducts];
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedStore = null;
    this.selectedDiscountRange = null;
    this.selectedCategory = null;
    this.applyFilter();
    this.currentPage = 1;

    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  get totalPages(): number {
    return Math.ceil(this.filteredProducts().length / this.pageSize);
  }

  onPageChange(page: number): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo({ top: 10, behavior: 'smooth' });
    }
    this.currentPage = page;
  }

  redirect(url: string) {
    if (typeof window !== 'undefined') {
      const newWindow = window.open(url, '_blank');
      if (newWindow) {
        newWindow.focus();
      }
    }
  }

  truncateText(text: string, length: number = 40): string {
    if (text.length <= length) {
      return text;
    }
    return text.substring(0, length) + '...';
  }

  addUrlForMe(sourceJobId: string, urlId: string) {
    this.isLoading.set(true);
    this.productService.addUrlForMe(sourceJobId, urlId).subscribe({
      next: (response) => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Agregado a tu seguimiento', life: 3000 });
        this.obteneOfertas();
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: error.error.error, life: 3000 });
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  cargarEstadoJobs(urlId: string): void {
    this.productService.getMyJob(urlId).subscribe({
      next: (res) => {
        this.estadosOfertas.update(estados => ({
          ...estados,
          [urlId]: res.myjob
        }));
      },
      error: (err) => {
        this.estadosOfertas.update(estados => ({
          ...estados,
          [urlId]: false
        }));
      }
    });
  }

  getMyJob(urlId: string): boolean {
    return this.estadosOfertas()[urlId] || false;
  }

  deleteUrl(urlId: string): void {
    this.productService.deleteUrl(urlId).subscribe({
      next: (res) => {
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Dejaste de seguir', life: 3000 });
        this.obteneOfertas();
      }
    });
  }
}
