// SEO Components for EkoSolar - Google Best Practices Implementation
// Breadcrumbs, Internal Linking, Performance Optimization

class EkoSolarSEO {
    constructor() {
        this.currentPage = this.detectCurrentPage();
        this.initializeSEOComponents();
    }

    detectCurrentPage() {
        const path = window.location.pathname;
        const pageName = path.split('/').pop().replace('.html', '') || 'home';
        return pageName;
    }

    initializeSEOComponents() {
        this.addBreadcrumbs();
        this.optimizeImages();
        this.addInternalLinking();
        this.setupPerformanceMonitoring();
        console.log('✅ EkoSolar SEO components initialized');
    }

    // Breadcrumb Navigation with Schema Markup
    addBreadcrumbs() {
        const breadcrumbData = this.getBreadcrumbData();
        if (!breadcrumbData || breadcrumbData.length <= 1) return;

        // Create breadcrumb HTML
        const breadcrumbHTML = this.createBreadcrumbHTML(breadcrumbData);
        
        // Create breadcrumb schema
        const breadcrumbSchema = this.createBreadcrumbSchema(breadcrumbData);
        
        // Insert into page
        this.insertBreadcrumbs(breadcrumbHTML, breadcrumbSchema);
    }

    getBreadcrumbData() {
        const breadcrumbs = {
            'home': [
                { name: 'Home', url: '/' }
            ],
            'solar-installation-atlanta': [
                { name: 'Home', url: '/' },
                { name: 'Services', url: '/#services' },
                { name: 'Atlanta Solar Installation', url: '/solar-installation-atlanta.html' }
            ],
            'solar-installation-savannah': [
                { name: 'Home', url: '/' },
                { name: 'Services', url: '/#services' },
                { name: 'Savannah Solar Installation', url: '/solar-installation-savannah.html' }
            ],
            'solar-panel-repair-georgia': [
                { name: 'Home', url: '/' },
                { name: 'Services', url: '/#services' },
                { name: 'Solar Panel Repair', url: '/solar-panel-repair-georgia.html' }
            ],
            'emergency-solar-repair': [
                { name: 'Home', url: '/' },
                { name: 'Services', url: '/#services' },
                { name: 'Emergency Solar Repair', url: '/emergency-solar-repair.html' }
            ],
            'solar-inverter-repair': [
                { name: 'Home', url: '/' },
                { name: 'Services', url: '/#services' },
                { name: 'Solar Inverter Repair', url: '/solar-inverter-repair.html' }
            ],
            'blog/georgia-solar-installation-guide-2025': [
                { name: 'Home', url: '/' },
                { name: 'Blog', url: '/blog/' },
                { name: 'Georgia Solar Installation Guide 2025', url: '/blog/georgia-solar-installation-guide-2025.html' }
            ]
        };

        return breadcrumbs[this.currentPage] || breadcrumbs['home'];
    }

    createBreadcrumbHTML(breadcrumbData) {
        const breadcrumbItems = breadcrumbData.map((item, index) => {
            const isLast = index === breadcrumbData.length - 1;
            if (isLast) {
                return `<span class="breadcrumb-current">${item.name}</span>`;
            } else {
                return `<a href="${item.url}" class="breadcrumb-link">${item.name}</a>`;
            }
        }).join(' <span class="breadcrumb-separator">›</span> ');

        return `
            <nav class="breadcrumb-nav" aria-label="Breadcrumb">
                <div class="container">
                    <ol class="breadcrumb-list">
                        <li class="breadcrumb-items">${breadcrumbItems}</li>
                    </ol>
                </div>
            </nav>
        `;
    }

    createBreadcrumbSchema(breadcrumbData) {
        const listItems = breadcrumbData.map((item, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": item.name,
            "item": item.url.startsWith('http') ? item.url : `https://ekosolarpros.com${item.url}`
        }));

        return {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": listItems
        };
    }

    insertBreadcrumbs(breadcrumbHTML, breadcrumbSchema) {
        // Add breadcrumb styles
        this.addBreadcrumbStyles();
        
        // Insert breadcrumb HTML after navbar
        const navbar = document.querySelector('nav') || document.querySelector('.navbar');
        if (navbar) {
            navbar.insertAdjacentHTML('afterend', breadcrumbHTML);
        }

        // Add breadcrumb schema
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(breadcrumbSchema, null, 2);
        document.head.appendChild(script);

        console.log('✅ Breadcrumbs added with schema markup');
    }

    addBreadcrumbStyles() {
        const styles = `
            <style>
            .breadcrumb-nav {
                background: #f8f9fa;
                border-bottom: 1px solid #e9ecef;
                padding: 12px 0;
                font-size: 14px;
            }
            .breadcrumb-list {
                list-style: none;
                margin: 0;
                padding: 0;
            }
            .breadcrumb-items {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
            }
            .breadcrumb-link {
                color: #667eea;
                text-decoration: none;
                transition: color 0.3s ease;
            }
            .breadcrumb-link:hover {
                color: #5a67d8;
                text-decoration: underline;
            }
            .breadcrumb-separator {
                color: #6c757d;
                margin: 0 8px;
            }
            .breadcrumb-current {
                color: #495057;
                font-weight: 500;
            }
            @media (max-width: 768px) {
                .breadcrumb-nav {
                    padding: 8px 0;
                    font-size: 12px;
                }
                .breadcrumb-separator {
                    margin: 0 4px;
                }
            }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', styles);
    }

    // Internal Linking Strategy
    addInternalLinking() {
        this.addRelatedServicesLinks();
        this.addLocationLinks();
        this.addBlogLinks();
    }

    addRelatedServicesLinks() {
        const serviceLinks = {
            'solar-installation': [
                { text: 'Solar Panel Repair Services', url: '/solar-panel-repair-georgia.html' },
                { text: 'Emergency Solar Repair', url: '/emergency-solar-repair.html' },
                { text: 'Solar Maintenance Contracts', url: '/solar-maintenance-contracts.html' }
            ],
            'solar-repair': [
                { text: 'Solar Installation Services', url: '/#services' },
                { text: 'Solar Inverter Repair', url: '/solar-inverter-repair.html' },
                { text: 'System Troubleshooting', url: '/system-troubleshooting.html' }
            ]
        };

        this.insertRelatedLinks(serviceLinks);
    }

    addLocationLinks() {
        const locationLinks = [
            { text: 'Atlanta Solar Installation', url: '/solar-installation-atlanta.html' },
            { text: 'Savannah Solar Services', url: '/solar-installation-savannah.html' },
            { text: 'Columbus Solar Installation', url: '/solar-installation-columbus.html' },
            { text: 'Augusta Solar Services', url: '/solar-installation-augusta.html' },
            { text: 'Macon Solar Installation', url: '/solar-installation-macon.html' }
        ];

        this.insertLocationLinks(locationLinks);
    }

    insertRelatedLinks(serviceLinks) {
        // Find appropriate places to insert internal links
        const contentSections = document.querySelectorAll('.service-description, .content-section');
        
        contentSections.forEach(section => {
            // Add contextual internal links based on content
            const sectionText = section.textContent.toLowerCase();
            
            if (sectionText.includes('solar installation') || sectionText.includes('install')) {
                this.addLinkToSection(section, serviceLinks['solar-installation']);
            }
            
            if (sectionText.includes('repair') || sectionText.includes('maintenance')) {
                this.addLinkToSection(section, serviceLinks['solar-repair']);
            }
        });
    }

    addLinkToSection(section, links) {
        if (!links || section.querySelector('.internal-links')) return;
        
        const linksHTML = links.map(link => 
            `<a href="${link.url}" class="internal-link">${link.text}</a>`
        ).join(' | ');
        
        const linkContainer = document.createElement('div');
        linkContainer.className = 'internal-links';
        linkContainer.innerHTML = `<p><strong>Related Services:</strong> ${linksHTML}</p>`;
        
        section.appendChild(linkContainer);
    }

    insertLocationLinks(locationLinks) {
        // Add location links to appropriate sections
        const locationSections = document.querySelectorAll('.service-areas, .location-section');
        
        locationSections.forEach(section => {
            const linksHTML = locationLinks.map(link => 
                `<a href="${link.url}" class="location-link">${link.text}</a>`
            ).join(' | ');
            
            const linkContainer = document.createElement('div');
            linkContainer.className = 'location-links';
            linkContainer.innerHTML = `<p><strong>Service Areas:</strong> ${linksHTML}</p>`;
            
            section.appendChild(linkContainer);
        });
    }

    // Image Optimization for Core Web Vitals
    optimizeImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Add loading="lazy" if not present
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
            
            // Add proper width and height to prevent layout shift
            if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
                img.addEventListener('load', () => {
                    if (!img.hasAttribute('width')) {
                        img.setAttribute('width', img.naturalWidth);
                    }
                    if (!img.hasAttribute('height')) {
                        img.setAttribute('height', img.naturalHeight);
                    }
                });
            }
            
            // Optimize alt text if missing or generic
            this.optimizeAltText(img);
        });
        
        console.log(`✅ Optimized ${images.length} images for Core Web Vitals`);
    }

    optimizeAltText(img) {
        const alt = img.getAttribute('alt');
        if (!alt || alt.length < 10) {
            // Generate descriptive alt text based on src and context
            const src = img.getAttribute('src');
            const context = img.closest('section')?.className || '';
            
            let newAlt = 'EkoSolar professional solar services in Georgia';
            
            if (src.includes('installation')) {
                newAlt = 'Professional solar panel installation services in Georgia by certified EkoSolar technicians';
            } else if (src.includes('repair')) {
                newAlt = 'Expert solar panel repair and maintenance services Georgia EkoSolar certified technicians';
            } else if (src.includes('commercial')) {
                newAlt = 'Commercial solar installation services Georgia EkoSolar business solar solutions';
            }
            
            img.setAttribute('alt', newAlt);
        }
    }

    // Performance Monitoring
    setupPerformanceMonitoring() {
        // Monitor Core Web Vitals
        this.monitorCoreWebVitals();
        
        // Setup lazy loading for non-critical resources
        this.setupLazyLoading();
        
        // Preload critical resources
        this.preloadCriticalResources();
    }

    monitorCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);
            
            // Track in analytics if available
            if (typeof gtag !== 'undefined') {
                gtag('event', 'core_web_vitals', {
                    metric_name: 'LCP',
                    metric_value: Math.round(lastEntry.startTime),
                    metric_rating: lastEntry.startTime < 2500 ? 'good' : lastEntry.startTime < 4000 ? 'needs_improvement' : 'poor'
                });
            }
        }).observe({entryTypes: ['largest-contentful-paint']});

        // First Input Delay (FID)
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                console.log('FID:', entry.processingStart - entry.startTime);
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'core_web_vitals', {
                        metric_name: 'FID',
                        metric_value: Math.round(entry.processingStart - entry.startTime),
                        metric_rating: entry.processingStart - entry.startTime < 100 ? 'good' : entry.processingStart - entry.startTime < 300 ? 'needs_improvement' : 'poor'
                    });
                }
            });
        }).observe({entryTypes: ['first-input']});

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });
            
            console.log('CLS:', clsValue);
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'core_web_vitals', {
                    metric_name: 'CLS',
                    metric_value: Math.round(clsValue * 1000) / 1000,
                    metric_rating: clsValue < 0.1 ? 'good' : clsValue < 0.25 ? 'needs_improvement' : 'poor'
                });
            }
        }).observe({entryTypes: ['layout-shift']});
    }

    setupLazyLoading() {
        // Lazy load non-critical CSS
        const nonCriticalCSS = document.querySelectorAll('link[rel="stylesheet"][data-lazy]');
        nonCriticalCSS.forEach(link => {
            const href = link.getAttribute('data-href');
            if (href) {
                link.setAttribute('href', href);
                link.removeAttribute('data-lazy');
            }
        });
    }

    preloadCriticalResources() {
        // Preload critical fonts
        const criticalFonts = [
            'https://fonts.googleapis.com/css2?family=Outfit:wght@400;600&display=swap'
        ];
        
        criticalFonts.forEach(fontUrl => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = fontUrl;
            document.head.appendChild(link);
        });
        
        // Preload hero images
        const heroImages = document.querySelectorAll('.hero-image, .slideshow img:first-child');
        heroImages.forEach(img => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = img.src;
            document.head.appendChild(link);
        });
    }

    // SEO Audit Function
    runSEOAudit() {
        const audit = {
            h1Count: document.querySelectorAll('h1').length,
            metaDescription: document.querySelector('meta[name="description"]')?.content?.length || 0,
            altTextMissing: document.querySelectorAll('img:not([alt])').length,
            internalLinks: document.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]').length,
            externalLinks: document.querySelectorAll('a[href^="http"]:not([href*="ekosolarpros.com"])').length,
            schemaMarkup: document.querySelectorAll('script[type="application/ld+json"]').length
        };
        
        console.table(audit);
        return audit;
    }
}

// Initialize SEO components when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new EkoSolarSEO());
} else {
    new EkoSolarSEO();
}

// Export for manual use
window.EkoSolarSEO = EkoSolarSEO;