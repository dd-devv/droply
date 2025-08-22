import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  imports: [CardModule, RouterLink],
  templateUrl: './about.component.html',
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AboutComponent implements OnInit {
  private meta = inject(Meta);
  private title = inject(Title);

  ngOnInit(): void {
    this.setMetaTags();
  }

  private setMetaTags(): void {
    // Establecer Título para About
    this.title.setTitle('Sobre Nosotros - droply.pe | Quiénes Somos | Misión y Visión');

    // Meta tags para SEO básicos
    this.meta.addTags([
      { name: 'description', content: 'Conoce la historia de droply.pe, el equipo detrás de la plataforma líder en monitoreo de precios en Perú. Nuestra misión es ayudarte a ahorrar tiempo y dinero en tus compras online.' },
      { name: 'keywords', content: 'sobre droply, equipo droply, historia droply, misión droply, visión droply, quienes somos, acerca de nosotros, empresa peruana, startup perú, tecnología perú' },
      { name: 'author', content: 'droply' },
      { name: 'robots', content: 'index, follow' },

      // Canonical URL para evitar contenido duplicado
      { name: 'canonical', content: 'https://droply.pe/about' },

      // Open Graph Meta Tags para compartir en redes sociales
      { property: 'og:title', content: 'Sobre Nosotros - droply.pe | La Historia de Nuestra Startup Peruana' },
      { property: 'og:description', content: 'Descubre cómo nació droply.pe y conoce al equipo que está revolucionando las compras online en Perú con tecnología de monitoreo de precios.' },
      { property: 'og:image', content: 'https://droply.pe/assets/images/team-droply.jpg' },
      { property: 'og:url', content: 'https://droply.pe/about' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'droply.pe' },
      { property: 'og:locale', content: 'es_PE' },

      // Twitter Card Meta Tags
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Sobre Nosotros - droply.pe | Startup Peruana de Monitoreo de Precios' },
      { name: 'twitter:description', content: 'Conoce la historia y misión del equipo droply.pe. Innovación peruana al servicio del ahorro inteligente.' },
      { name: 'twitter:image', content: 'https://droply.pe/assets/images/team-droply.jpg' },
      { name: 'twitter:site', content: '@droplyPeru' },

      // Meta tags adicionales para SEO local
      { name: 'geo.region', content: 'PE' },
      { name: 'geo.country', content: 'Perú' },
      { name: 'geo.placename', content: 'Lima, Perú' },

      // Schema.org structured data para organización
      {
        name: 'schema.org', content: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "droply.pe",
          "url": "https://droply.pe",
          "logo": "https://droply.pe/logo.png",
          "description": "Plataforma peruana de monitoreo de precios y alertas de ofertas online",
          "foundingDate": "2025", // Ajusta según corresponda
          "foundingLocation": "Lima, Perú",
          "sameAs": [
            "https://www.facebook.com/droply.pe",
              "https://www.instagram.com/droply_pe",
              "https://www.tiktok.com/@droply_pe",
              "https://www.youtube.com/@droply_pe"
          ]
        })
      }
    ]);
  }
}
