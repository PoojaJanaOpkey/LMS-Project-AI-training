import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private meta = inject(Meta);
  private title = inject(Title);
  private router = inject(Router);

  constructor() {
    this.setupRouteListener();
  }

  private setupRouteListener(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateMetaTags();
      });
  }

  updateTitle(title: string): void {
    this.title.setTitle(`${title} | LMS - Learning Management System`);
  }

  updateMetaTags(config?: {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
  }): void {
    if (config?.title) {
      this.updateTitle(config.title);
    }

    const description = config?.description || 'Learn from the best courses online. Access thousands of courses in programming, design, business, and more.';
    const keywords = config?.keywords || 'online courses, e-learning, education, training, LMS, programming, design, business';
    const image = config?.image || '/assets/images/og-image.jpg';
    const url = config?.url || window.location.href;

    // Update or create meta tags
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: keywords });
    this.meta.updateTag({ name: 'author', content: 'LMS Platform' });
    
    // Open Graph tags for social media
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: 'LMS - Learning Management System' });
    this.meta.updateTag({ property: 'og:title', content: config?.title || 'LMS - Learning Management System' });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:url', content: url });
    
    // Twitter Card tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: config?.title || 'LMS - Learning Management System' });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });
    
    // Additional SEO tags
    this.meta.updateTag({ name: 'robots', content: 'index, follow' });
    this.meta.updateTag({ name: 'viewport', content: 'width=device-width, initial-scale=1' });
    this.meta.updateTag({ 'http-equiv': 'Content-Type', content: 'text/html; charset=utf-8' });
  }

  generateCourseSchema(course: any): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: course.title,
      description: course.description,
      provider: {
        '@type': 'Organization',
        name: 'LMS Platform',
        sameAs: window.location.origin
      },
      offers: {
        '@type': 'Offer',
        category: 'Paid',
        priceCurrency: 'USD',
        price: course.price
      }
    };

    this.addJsonLdSchema(schema);
  }

  generateOrganizationSchema(): void {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: 'LMS - Learning Management System',
      url: window.location.origin,
      logo: `${window.location.origin}/assets/images/logo.png`,
      description: 'Online learning platform offering courses in various subjects',
      sameAs: [
        'https://facebook.com/lms',
        'https://twitter.com/lms',
        'https://linkedin.com/company/lms'
      ]
    };

    this.addJsonLdSchema(schema);
  }

  private addJsonLdSchema(schema: any): void {
    let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }
    
    script.textContent = JSON.stringify(schema);
  }

  removeJsonLdSchema(): void {
    const script = document.querySelector('script[type="application/ld+json"]');
    if (script) {
      script.remove();
    }
  }
}
