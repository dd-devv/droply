import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';

@Component({
  selector: 'app-faqs',
  imports: [
    AccordionModule
  ],
  templateUrl: './faqs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class FaqsComponent implements OnInit {
  private meta = inject(Meta);
  private title = inject(Title);

  ngOnInit(): void {
    this.setMetaTags();
  }

  private setMetaTags(): void {
    // Establecer Título para FAQs
    this.title.setTitle('Preguntas Frecuentes - droply.pe | FAQ | Dudas sobre Monitoreo de Precios');

    // Meta tags para SEO básicos
    this.meta.addTags([
      { name: 'description', content: 'Resuelve todas tus dudas sobre droply.pe. Preguntas frecuentes sobre registro, funcionamiento, notificaciones WhatsApp y compatibilidad con tiendas peruanas como Falabella, MercadoLibre, Plaza Vea.' },
      { name: 'keywords', content: 'preguntas frecuentes droply, faq droply, dudas droply, como funciona droply, registro whatsapp, monitoreo precios peru, tiendas compatibles, falabella mercadolibre plazavea' },
      { name: 'author', content: 'droply' },
      { name: 'robots', content: 'index, follow' },

      // Canonical URL para evitar contenido duplicado
      { name: 'canonical', content: 'https://droply.pe/faqs' },

      // Open Graph Meta Tags para compartir en redes sociales
      { property: 'og:title', content: 'Preguntas Frecuentes - droply.pe | Todo sobre Monitoreo de Precios' },
      { property: 'og:description', content: '¿Dudas sobre cómo funciona droply.pe? Encuentra respuestas sobre registro con WhatsApp, tiendas compatibles, notificaciones y más en nuestras FAQ.' },
      { property: 'og:image', content: 'https://droply.pe/assets/images/faq-help.jpg' },
      { property: 'og:url', content: 'https://droply.pe/faqs' },
      { property: 'og:type', content: 'website' },
      { property: 'og:site_name', content: 'droply.pe' },
      { property: 'og:locale', content: 'es_PE' },

      // Twitter Card Meta Tags
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'FAQ droply.pe | Preguntas Frecuentes sobre Monitoreo de Precios' },
      { name: 'twitter:description', content: 'Resuelve tus dudas sobre droply.pe: registro WhatsApp, tiendas compatibles, notificaciones y más.' },
      { name: 'twitter:image', content: 'https://droply.pe/assets/images/faq-help.jpg' },

      // Meta tags adicionales para SEO local
      { name: 'geo.region', content: 'PE' },
      { name: 'geo.country', content: 'Perú' },
      { name: 'geo.placename', content: 'Lima, Perú' },

      // Schema.org structured data para FAQPage
      {
        name: 'schema.org', content: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "¿Cómo me registro en la aplicación?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Para registrarte, solo necesitas ingresar tu número de WhatsApp. Recibirás un código de verificación de 6 dígitos que deberás introducir para completar el registro."
              }
            },
            {
              "@type": "Question",
              "name": "¿Qué hace exactamente la aplicación?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "La aplicación te permite monitorear precios y disponibilidad de productos en línea. Registras las URLs de los productos que te interesan, y nuestro sistema las revisa periódicamente, notificándote sobre cualquier cambio."
              }
            },
            {
              "@type": "Question",
              "name": "¿Con qué frecuencia se actualizan los precios?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Nuestro sistema revisa los precios regularmente. La frecuencia exacta puede variar según la carga del servidor, pero generalmente las actualizaciones ocurren varias veces al día."
              }
            },
            {
              "@type": "Question",
              "name": "¿Qué tiendas o sitios web son compatibles?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Nuestra aplicación es compatible con la mayoría de las tiendas online del Perú como Falabella (falabella, sodimac, tottus, linio), mercado libre, oechsle, platanitos, plazavea y muchas tiendas más."
              }
            },
            {
              "@type": "Question",
              "name": "¿Cómo recibiré las notificaciones?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Recibirás notificaciones a través de WhatsApp y también en la casilla de alertas dentro de la aplicación."
              }
            },
            {
              "@type": "Question",
              "name": "¿Cuáles son los planes?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Actualmente no ofrecemos planes de pago, la aplicación es completamente gratuita para todos los usuarios."
              }
            },
            {
              "@type": "Question",
              "name": "¿Es seguro proporcionar mi número de WhatsApp?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Sí, utilizamos tu número de WhatsApp únicamente para verificar tu identidad y enviarte notificaciones sobre tus productos registrados. No compartimos tu información con terceros."
              }
            }
          ]
        })
      },

      // Meta tags específicos para páginas de ayuda/FAQ
      { name: 'help-topics', content: 'registro,funcionamiento,notificaciones,planes,seguridad' },
      { name: 'support-type', content: 'self-service' },
      { name: 'content-type', content: 'faq' },

      // Meta tags para tiendas compatibles (SEO local)
      { name: 'compatible-stores', content: 'falabella,mercadolibre,plazavea,oechsle,sodimac,tottus,linio,platanitos' },
      { name: 'service-area', content: 'Perú' },
      { name: 'service-type', content: 'monitoreo de precios' },

      // Meta tags adicionales para mejorar visibilidad
      { name: 'page-topic', content: 'ayuda y soporte' },
      { name: 'target-audience', content: 'compradores online peru' },
      { name: 'content-language', content: 'es-PE' },

      // Meta tags para featured snippets
      { name: 'answer-type', content: 'faq' },
      { name: 'question-count', content: '10+' },
      { name: 'help-category', content: 'guía de usuario' }
    ]);
  }
}
