// Core Web Vitals Optimizer for EkoSolar
// Implements Google's performance best practices

class CoreWebVitalsOptimizer {
    constructor() {
        this.metrics = {
            lcp: null,
            fid: null,
            cls: null,
            ttfb: null
        };
        
        this.thresholds = {
            lcp: { good: 2500, poor: 4000 },
            fid: { good: 100, poor: 300 },
            cls: { good: 0.1, poor: 0.25 },
            ttfb: { good: 800, poor: 1800 }
        };
        
        this.init();
    }
    
    init() {
        // Start measuring immediately
        this.measureTTFB();
        this.measureLCP();
        this.measureFID();
        this.measureCLS();
        
        // Apply optimizations
        this.optimizeImages();
        this.optimizeFonts();
        this.optimizeCSS();
        this.preventLayoutShift();
        this.preloadCriticalResources();
        
        // Setup monitoring
        this.setupContinuousMonitoring();
        
        console.log('🚀 Core Web Vitals Optimizer initialized');
    }
    
    // Measure Time to First Byte (TTFB)
    measureTTFB() {
        const navigationEntries = performance.getEntriesByType('navigation');
        if (navigationEntries.length > 0) {
            const navigationEntry = navigationEntries[0];
            this.metrics.ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
            
            console.log(`📊 TTFB: ${this.metrics.ttfb.toFixed(2)}ms`);
            this.reportMetric('TTFB', this.metrics.ttfb);
        }
    }
    
    // Measure Largest Contentful Paint (LCP)
    measureLCP() {
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.lcp = lastEntry.startTime;
            
            console.log(`📊 LCP: ${this.metrics.lcp.toFixed(2)}ms`);
            this.reportMetric('LCP', this.metrics.lcp);
        }).observe({entryTypes: ['largest-contentful-paint']});
    }
    
    // Measure First Input Delay (FID)
    measureFID() {
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            entries.forEach(entry => {
                this.metrics.fid = entry.processingStart - entry.startTime;
                
                console.log(`📊 FID: ${this.metrics.fid.toFixed(2)}ms`);
                this.reportMetric('FID', this.metrics.fid);
            });
        }).observe({entryTypes: ['first-input']});
    }
    
    // Measure Cumulative Layout Shift (CLS)
    measureCLS() {
        let clsValue = 0;
        let sessionValue = 0;
        let sessionEntries = [];
        
        new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries();
            
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    const firstSessionEntry = sessionEntries[0];
                    const lastSessionEntry = sessionEntries[sessionEntries.length - 1];
                    
                    // If the entry occurred less than 1 second after the previous entry and
                    // less than 5 seconds after the first entry in the session, include the
                    // entry in the current session. Otherwise, start a new session.
                    if (sessionValue &&
                        entry.startTime - lastSessionEntry.startTime < 1000 &&
                        entry.startTime - firstSessionEntry.startTime < 5000) {
                        sessionValue += entry.value;
                        sessionEntries.push(entry);
                    } else {
                        sessionValue = entry.value;
                        sessionEntries = [entry];
                    }
                    
                    // If the current session value is larger than the current CLS value,
                    // update CLS and the entries contributing to it.
                    if (sessionValue > clsValue) {
                        clsValue = sessionValue;
                        this.metrics.cls = clsValue;
                        
                        console.log(`📊 CLS: ${this.metrics.cls.toFixed(4)}`);
                        this.reportMetric('CLS', this.metrics.cls);
                    }
                }
            });
        }).observe({entryTypes: ['layout-shift']});
    }
    
    // Report metrics to analytics
    reportMetric(metricName, value) {
        const threshold = this.thresholds[metricName.toLowerCase()];
        let rating = 'good';
        
        if (threshold) {
            if (value > threshold.poor) {
                rating = 'poor';
            } else if (value > threshold.good) {
                rating = 'needs_improvement';
            }
        }
        
        // Send to Google Analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'core_web_vitals', {
                'metric_name': metricName,
                'metric_value': Math.round(value),
                'metric_rating': rating,
                'page_path': window.location.pathname
            });
        }
        
        // Send to console for debugging
        console.log(`✅ ${metricName}: ${value.toFixed(2)} (${rating})`);
    }
    
    // Optimize Images for LCP improvement
    optimizeImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach((img, index) => {
            // Prioritize above-the-fold images
            if (index < 3 || this.isInViewport(img)) {
                img.loading = 'eager';
                img.fetchPriority = 'high';
                
                // Add proper dimensions to prevent CLS
                this.setImageDimensions(img);
            } else {
                img.loading = 'lazy';
            }
            
            // Add responsive images for better performance
            this.makeImageResponsive(img);
        });
        
        console.log(`🖼️ Optimized ${images.length} images`);
    }
    
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top < window.innerHeight &&
            rect.bottom > 0 &&
            rect.left < window.innerWidth &&
            rect.right > 0
        );
    }
    
    setImageDimensions(img) {
        if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
            // Set default dimensions to prevent layout shift
            const container = img.closest('.service-thumbnail, .hero-image, .slideshow');
            if (container) {
                const containerStyle = getComputedStyle(container);
                img.width = parseInt(containerStyle.width) || 400;
                img.height = parseInt(containerStyle.height) || 300;
            }
        }
    }
    
    makeImageResponsive(img) {
        if (!img.hasAttribute('srcset') && img.src.includes('unsplash.com')) {
            // Generate responsive images for Unsplash
            const baseSrc = img.src.split('?')[0];
            const srcset = [
                `${baseSrc}?w=400&q=80 400w`,
                `${baseSrc}?w=800&q=80 800w`,
                `${baseSrc}?w=1200&q=80 1200w`
            ].join(', ');
            
            img.srcset = srcset;
            img.sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
        }
    }
    
    // Optimize Fonts to reduce CLS
    optimizeFonts() {
        // Preload critical fonts
        const criticalFonts = [
            'https://fonts.googleapis.com/css2?family=Outfit:wght@400;600&display=swap'
        ];
        
        criticalFonts.forEach(fontUrl => {
            const existingLink = document.querySelector(`link[href="${fontUrl}"]`);
            if (existingLink && !existingLink.hasAttribute('rel-preload')) {
                const preloadLink = document.createElement('link');
                preloadLink.rel = 'preload';
                preloadLink.as = 'style';
                preloadLink.href = fontUrl;
                preloadLink.crossOrigin = 'anonymous';
                document.head.insertBefore(preloadLink, existingLink);
            }
        });
        
        // Add font-display: swap to existing font declarations
        this.addFontDisplaySwap();
        
        console.log('🔤 Font optimization complete');
    }
    
    addFontDisplaySwap() {
        const style = document.createElement('style');
        style.textContent = `
            @font-face {
                font-family: 'Outfit';
                font-display: swap;
            }
            * {
                font-display: swap;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Optimize CSS delivery
    optimizeCSS() {
        // Move non-critical CSS to load asynchronously
        const stylesheets = document.querySelectorAll('link[rel="stylesheet"]:not([data-critical])');
        
        stylesheets.forEach(link => {
            if (!link.href.includes('fonts.googleapis.com')) {
                this.loadCSSAsync(link);
            }
        });
        
        // Inline critical CSS for above-the-fold content
        this.inlineCriticalCSS();
        
        console.log('🎨 CSS optimization complete');
    }
    
    loadCSSAsync(link) {
        const href = link.href;
        link.rel = 'preload';
        link.as = 'style';
        link.onload = function() {
            this.rel = 'stylesheet';
        };
        
        // Fallback for browsers that don't support preload
        const noscript = document.createElement('noscript');
        const fallbackLink = document.createElement('link');
        fallbackLink.rel = 'stylesheet';
        fallbackLink.href = href;
        noscript.appendChild(fallbackLink);
        document.head.appendChild(noscript);
    }
    
    inlineCriticalCSS() {
        const criticalCSS = `
            /* Critical CSS for above-the-fold content */
            .hero-section {
                min-height: 60vh;
                display: flex;
                align-items: center;
            }
            .navbar {
                position: fixed;
                top: 0;
                width: 100%;
                z-index: 1000;
                background: white;
            }
            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 20px;
            }
            .hero-title {
                font-size: clamp(2rem, 5vw, 4rem);
                line-height: 1.2;
                margin-bottom: 1rem;
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = criticalCSS;
        document.head.appendChild(style);
    }
    
    // Prevent Layout Shift
    preventLayoutShift() {
        // Reserve space for dynamic content
        this.reserveSpaceForSlideshow();
        this.reserveSpaceForForms();
        this.stabilizeNavigationHeight();
        
        console.log('📐 Layout shift prevention applied');
    }
    
    reserveSpaceForSlideshow() {
        const slideshows = document.querySelectorAll('.slideshow, .hero-slideshow');
        slideshows.forEach(slideshow => {
            if (!slideshow.style.height) {
                slideshow.style.height = '400px';
                slideshow.style.minHeight = '400px';
            }
        });
    }
    
    reserveSpaceForForms() {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.style.minHeight = '200px';
        });
    }
    
    stabilizeNavigationHeight() {
        const navbar = document.querySelector('.navbar, nav');
        if (navbar) {
            navbar.style.height = '80px';
            navbar.style.minHeight = '80px';
        }
    }
    
    // Preload Critical Resources
    preloadCriticalResources() {
        // Preload above-the-fold images
        const heroImages = document.querySelectorAll('.hero-image img, .slideshow img:first-child');
        heroImages.forEach(img => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = img.src;
            document.head.appendChild(link);
        });
        
        // Preload critical scripts
        const criticalScripts = [
            '/google-integration.js',
            '/schema-markup.js'
        ];
        
        criticalScripts.forEach(scriptSrc => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'script';
            link.href = scriptSrc;
            document.head.appendChild(link);
        });
        
        console.log('⚡ Critical resources preloaded');
    }
    
    // Setup Continuous Monitoring
    setupContinuousMonitoring() {
        // Monitor performance every 30 seconds
        setInterval(() => {
            this.checkPerformance();
        }, 30000);
        
        // Monitor on visibility change
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.checkPerformance();
            }
        });
    }
    
    checkPerformance() {
        const performanceEntries = performance.getEntriesByType('navigation');
        if (performanceEntries.length > 0) {
            const entry = performanceEntries[0];
            
            // Check various timing metrics
            const timings = {
                'DNS Lookup': entry.domainLookupEnd - entry.domainLookupStart,
                'TCP Connect': entry.connectEnd - entry.connectStart,
                'SSL Handshake': entry.connectEnd - entry.secureConnectionStart,
                'TTFB': entry.responseStart - entry.requestStart,
                'Download': entry.responseEnd - entry.responseStart,
                'DOM Processing': entry.domContentLoadedEventStart - entry.responseEnd,
                'Resource Loading': entry.loadEventStart - entry.domContentLoadedEventStart
            };
            
            // Log slow operations
            Object.entries(timings).forEach(([name, time]) => {
                if (time > 1000) {
                    console.warn(`⚠️ Slow ${name}: ${time.toFixed(2)}ms`);
                }
            });
        }
    }
    
    // Generate Performance Report
    generateReport() {
        const report = {
            timestamp: new Date().toISOString(),
            metrics: this.metrics,
            scores: {
                lcp: this.getMetricScore('lcp'),
                fid: this.getMetricScore('fid'),
                cls: this.getMetricScore('cls'),
                ttfb: this.getMetricScore('ttfb')
            },
            recommendations: this.getRecommendations()
        };
        
        console.table(report.scores);
        return report;
    }
    
    getMetricScore(metric) {
        const value = this.metrics[metric];
        if (!value) return 'Not measured';
        
        const threshold = this.thresholds[metric];
        if (value <= threshold.good) return 'Good';
        if (value <= threshold.poor) return 'Needs Improvement';
        return 'Poor';
    }
    
    getRecommendations() {
        const recommendations = [];
        
        if (this.metrics.lcp && this.metrics.lcp > this.thresholds.lcp.good) {
            recommendations.push('Optimize largest contentful paint: compress images, preload critical resources');
        }
        
        if (this.metrics.fid && this.metrics.fid > this.thresholds.fid.good) {
            recommendations.push('Reduce first input delay: minimize JavaScript execution time');
        }
        
        if (this.metrics.cls && this.metrics.cls > this.thresholds.cls.good) {
            recommendations.push('Reduce cumulative layout shift: set image dimensions, reserve space for dynamic content');
        }
        
        if (this.metrics.ttfb && this.metrics.ttfb > this.thresholds.ttfb.good) {
            recommendations.push('Improve time to first byte: optimize server response time');
        }
        
        return recommendations;
    }
}

// Initialize Core Web Vitals Optimizer
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.coreWebVitalsOptimizer = new CoreWebVitalsOptimizer();
    });
} else {
    window.coreWebVitalsOptimizer = new CoreWebVitalsOptimizer();
}

// Export for manual use
window.CoreWebVitalsOptimizer = CoreWebVitalsOptimizer;