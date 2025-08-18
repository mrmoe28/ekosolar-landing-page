// Mobile-First Indexing Compliance Audit for EkoSolar
// Google 2025 Requirements Implementation

class MobileFirstIndexingAudit {
    constructor() {
        this.isMobile = this.detectMobileDevice();
        this.viewport = this.getViewportInfo();
        this.auditResults = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            viewport: this.viewport,
            compliance: {},
            issues: [],
            recommendations: []
        };
        
        this.init();
    }
    
    init() {
        console.log('🔍 Starting Mobile-First Indexing Compliance Audit...');
        
        // Run all audit checks
        this.auditContentParity();
        this.auditMobileUsability();
        this.auditRobotsMetaTags();
        this.auditStructuredData();
        this.auditResourceAccessibility();
        this.auditImageOptimization();
        this.auditTouchTargets();
        this.auditFontSizes();
        this.auditPageSpeed();
        this.auditCoreWebVitals();
        
        // Generate final report
        this.generateComplianceReport();
        
        console.log('✅ Mobile-First Indexing Audit Complete');
    }
    
    detectMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               window.innerWidth <= 768;
    }
    
    getViewportInfo() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio || 1,
            orientation: window.orientation || 'unknown'
        };
    }
    
    // Content Parity Check
    auditContentParity() {
        console.log('📄 Auditing content parity...');
        
        const issues = [];
        const recommendations = [];
        
        // Check for hidden content on mobile
        const hiddenElements = this.findHiddenMobileContent();
        if (hiddenElements.length > 0) {
            issues.push(`${hiddenElements.length} elements hidden on mobile that may contain important content`);
            recommendations.push('Ensure all important content is visible on mobile devices');
        }
        
        // Check for missing navigation items
        const navigation = this.auditNavigationParity();
        if (navigation.missingItems > 0) {
            issues.push(`${navigation.missingItems} navigation items may be missing on mobile`);
            recommendations.push('Ensure mobile navigation includes all important links from desktop');
        }
        
        // Check for lazy-loaded primary content
        const lazyContent = this.findLazyLoadedPrimaryContent();
        if (lazyContent.length > 0) {
            issues.push(`${lazyContent.length} primary content elements use lazy loading`);
            recommendations.push('Avoid lazy-loading primary content that requires user interaction');
        }
        
        this.auditResults.compliance.contentParity = {
            passed: issues.length === 0,
            score: Math.max(0, 100 - (issues.length * 20)),
            issues,
            recommendations
        };
    }
    
    findHiddenMobileContent() {
        const hiddenElements = [];
        const allElements = document.querySelectorAll('*');
        
        allElements.forEach(element => {
            const style = getComputedStyle(element);
            const isHidden = style.display === 'none' || 
                            style.visibility === 'hidden' || 
                            style.opacity === '0' ||
                            parseInt(style.height) === 0;
            
            if (isHidden && element.textContent && element.textContent.trim().length > 50) {
                // Check if it's intentionally hidden for mobile
                const hasContent = element.querySelector('h1, h2, h3, p, img, a');
                if (hasContent) {
                    hiddenElements.push({
                        element: element.tagName,
                        class: element.className,
                        content: element.textContent.substring(0, 100) + '...'
                    });
                }
            }
        });
        
        return hiddenElements;
    }
    
    auditNavigationParity() {
        const desktopNavLinks = document.querySelectorAll('nav a, .navbar a, .menu a');
        const mobileNavLinks = document.querySelectorAll('.mobile-nav a, .hamburger-menu a, [data-mobile-nav] a');
        
        return {
            desktopLinks: desktopNavLinks.length,
            mobileLinks: mobileNavLinks.length,
            missingItems: Math.max(0, desktopNavLinks.length - mobileNavLinks.length)
        };
    }
    
    findLazyLoadedPrimaryContent() {
        const primarySelectors = 'h1, h2, .hero-content, .main-content, .service-description';
        const primaryElements = document.querySelectorAll(primarySelectors);
        const lazyElements = [];
        
        primaryElements.forEach(element => {
            const hasLazyLoading = element.hasAttribute('loading') ||
                                 element.querySelector('[loading]') ||
                                 element.classList.contains('lazy') ||
                                 element.hasAttribute('data-src');
            
            if (hasLazyLoading) {
                lazyElements.push(element);
            }
        });
        
        return lazyElements;
    }
    
    // Mobile Usability Audit
    auditMobileUsability() {
        console.log('📱 Auditing mobile usability...');
        
        const issues = [];
        const recommendations = [];
        
        // Check viewport meta tag
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        if (!viewportMeta) {
            issues.push('Missing viewport meta tag');
            recommendations.push('Add <meta name="viewport" content="width=device-width, initial-scale=1">');
        } else {
            const content = viewportMeta.getAttribute('content');
            if (!content.includes('width=device-width')) {
                issues.push('Viewport meta tag not properly configured');
                recommendations.push('Ensure viewport includes width=device-width');
            }
        }
        
        // Check for horizontal scrolling
        const bodyWidth = document.body.scrollWidth;
        const viewportWidth = window.innerWidth;
        if (bodyWidth > viewportWidth + 10) {
            issues.push('Page content wider than viewport (horizontal scrolling)');
            recommendations.push('Ensure all content fits within viewport width');
        }
        
        // Check responsive design
        const responsiveElements = this.checkResponsiveDesign();
        if (responsiveElements.issues > 0) {
            issues.push(`${responsiveElements.issues} elements may not be responsive`);
            recommendations.push('Use responsive design techniques (flexbox, CSS grid, media queries)');
        }
        
        this.auditResults.compliance.mobileUsability = {
            passed: issues.length === 0,
            score: Math.max(0, 100 - (issues.length * 25)),
            issues,
            recommendations
        };
    }
    
    checkResponsiveDesign() {
        const fixedWidthElements = [];
        const allElements = document.querySelectorAll('*');
        
        allElements.forEach(element => {
            const style = getComputedStyle(element);
            const width = parseInt(style.width);
            
            // Check for fixed widths that exceed mobile viewport
            if (width > this.viewport.width && !style.width.includes('%') && !style.width.includes('auto')) {
                fixedWidthElements.push(element);
            }
        });
        
        return {
            issues: fixedWidthElements.length,
            elements: fixedWidthElements
        };
    }
    
    // Robots Meta Tags Audit
    auditRobotsMetaTags() {
        console.log('🤖 Auditing robots meta tags...');
        
        const issues = [];
        const recommendations = [];
        
        const robotsMeta = document.querySelector('meta[name="robots"]');
        if (robotsMeta) {
            const content = robotsMeta.getAttribute('content').toLowerCase();
            
            if (content.includes('noindex')) {
                issues.push('Page has noindex directive');
                recommendations.push('Remove noindex if you want this page to be indexed');
            }
            
            if (content.includes('nofollow')) {
                issues.push('Page has nofollow directive');
                recommendations.push('Consider removing nofollow to allow link equity flow');
            }
        }
        
        this.auditResults.compliance.robotsMetaTags = {
            passed: issues.length === 0,
            score: issues.length === 0 ? 100 : 0,
            issues,
            recommendations
        };
    }
    
    // Structured Data Audit
    auditStructuredData() {
        console.log('📋 Auditing structured data...');
        
        const issues = [];
        const recommendations = [];
        
        const structuredDataScripts = document.querySelectorAll('script[type="application/ld+json"]');
        const structuredDataCount = structuredDataScripts.length;
        
        if (structuredDataCount === 0) {
            issues.push('No structured data found');
            recommendations.push('Add JSON-LD structured data for better search results');
        } else {
            // Validate structured data
            structuredDataScripts.forEach((script, index) => {
                try {
                    const data = JSON.parse(script.textContent);
                    
                    // Check for required properties
                    if (data['@type'] === 'LocalBusiness') {
                        const requiredProps = ['name', 'address', 'telephone'];
                        requiredProps.forEach(prop => {
                            if (!data[prop]) {
                                issues.push(`LocalBusiness schema missing ${prop} property`);
                            }
                        });
                    }
                } catch (e) {
                    issues.push(`Invalid JSON-LD in script ${index + 1}`);
                }
            });
        }
        
        this.auditResults.compliance.structuredData = {
            passed: issues.length === 0,
            score: Math.max(0, 100 - (issues.length * 15)),
            count: structuredDataCount,
            issues,
            recommendations
        };
    }
    
    // Resource Accessibility Audit
    auditResourceAccessibility() {
        console.log('🔗 Auditing resource accessibility...');
        
        const issues = [];
        const recommendations = [];
        
        // Check CSS files
        const cssLinks = document.querySelectorAll('link[rel="stylesheet"]');
        cssLinks.forEach(link => {
            if (link.hasAttribute('disabled')) {
                issues.push('CSS file is disabled');
                recommendations.push('Ensure all critical CSS files are enabled');
            }
        });
        
        // Check JavaScript files
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach(script => {
            if (script.hasAttribute('defer') && script.src.includes('critical')) {
                issues.push('Critical JavaScript is deferred');
                recommendations.push('Load critical JavaScript immediately, defer non-critical scripts');
            }
        });
        
        this.auditResults.compliance.resourceAccessibility = {
            passed: issues.length === 0,
            score: Math.max(0, 100 - (issues.length * 20)),
            issues,
            recommendations
        };
    }
    
    // Image Optimization Audit
    auditImageOptimization() {
        console.log('🖼️ Auditing image optimization...');
        
        const issues = [];
        const recommendations = [];
        
        const images = document.querySelectorAll('img');
        let missingAlt = 0;
        let missingDimensions = 0;
        let notOptimized = 0;
        
        images.forEach(img => {
            // Check alt text
            if (!img.hasAttribute('alt') || img.getAttribute('alt').trim() === '') {
                missingAlt++;
            }
            
            // Check dimensions to prevent layout shift
            if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
                missingDimensions++;
            }
            
            // Check for modern image formats
            const src = img.src.toLowerCase();
            if (!src.includes('.webp') && !src.includes('format=webp')) {
                notOptimized++;
            }
        });
        
        if (missingAlt > 0) {
            issues.push(`${missingAlt} images missing alt text`);
            recommendations.push('Add descriptive alt text to all images');
        }
        
        if (missingDimensions > 0) {
            issues.push(`${missingDimensions} images missing width/height attributes`);
            recommendations.push('Add width and height attributes to prevent layout shift');
        }
        
        if (notOptimized > 0) {
            issues.push(`${notOptimized} images not using modern formats`);
            recommendations.push('Use WebP or AVIF formats for better compression');
        }
        
        this.auditResults.compliance.imageOptimization = {
            passed: issues.length === 0,
            score: Math.max(0, 100 - (issues.length * 15)),
            totalImages: images.length,
            issues,
            recommendations
        };
    }
    
    // Touch Targets Audit
    auditTouchTargets() {
        console.log('👆 Auditing touch targets...');
        
        const issues = [];
        const recommendations = [];
        
        const clickableElements = document.querySelectorAll('a, button, input, select, textarea, [onclick], [role="button"]');
        let smallTargets = 0;
        let tooClose = 0;
        
        clickableElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const minSize = 48; // Google's minimum recommended touch target size
            
            // Check size
            if (rect.width < minSize || rect.height < minSize) {
                smallTargets++;
            }
            
            // Check spacing (simplified check)
            const siblings = Array.from(element.parentElement?.children || []);
            const index = siblings.indexOf(element);
            if (index > 0) {
                const prevSibling = siblings[index - 1];
                const prevRect = prevSibling.getBoundingClientRect();
                const distance = rect.top - (prevRect.top + prevRect.height);
                
                if (distance < 8) { // Minimum 8px spacing
                    tooClose++;
                }
            }
        });
        
        if (smallTargets > 0) {
            issues.push(`${smallTargets} touch targets smaller than 48px`);
            recommendations.push('Ensure all touch targets are at least 48x48 pixels');
        }
        
        if (tooClose > 0) {
            issues.push(`${tooClose} touch targets too close together`);
            recommendations.push('Add adequate spacing between touch targets (minimum 8px)');
        }
        
        this.auditResults.compliance.touchTargets = {
            passed: issues.length === 0,
            score: Math.max(0, 100 - (issues.length * 25)),
            totalTargets: clickableElements.length,
            issues,
            recommendations
        };
    }
    
    // Font Size Audit
    auditFontSizes() {
        console.log('🔤 Auditing font sizes...');
        
        const issues = [];
        const recommendations = [];
        
        const textElements = document.querySelectorAll('p, span, div, a, li, td, th');
        let smallText = 0;
        
        textElements.forEach(element => {
            const style = getComputedStyle(element);
            const fontSize = parseInt(style.fontSize);
            
            // Check if element has visible text
            if (element.textContent && element.textContent.trim().length > 0) {
                if (fontSize < 16) {
                    smallText++;
                }
            }
        });
        
        if (smallText > 0) {
            issues.push(`${smallText} text elements smaller than 16px`);
            recommendations.push('Use minimum 16px font size for body text on mobile');
        }
        
        this.auditResults.compliance.fontSizes = {
            passed: issues.length === 0,
            score: Math.max(0, 100 - (smallText * 2)),
            totalElements: textElements.length,
            smallTextCount: smallText,
            issues,
            recommendations
        };
    }
    
    // Page Speed Audit
    auditPageSpeed() {
        console.log('⚡ Auditing page speed...');
        
        const issues = [];
        const recommendations = [];
        
        const navigationTiming = performance.getEntriesByType('navigation')[0];
        if (navigationTiming) {
            const loadTime = navigationTiming.loadEventEnd - navigationTiming.fetchStart;
            const domContentLoaded = navigationTiming.domContentLoadedEventEnd - navigationTiming.fetchStart;
            
            if (loadTime > 3000) {
                issues.push(`Page load time too slow: ${(loadTime/1000).toFixed(2)}s`);
                recommendations.push('Optimize page load time to under 3 seconds for mobile');
            }
            
            if (domContentLoaded > 1500) {
                issues.push(`DOM content loaded too slow: ${(domContentLoaded/1000).toFixed(2)}s`);
                recommendations.push('Optimize critical rendering path');
            }
        }
        
        this.auditResults.compliance.pageSpeed = {
            passed: issues.length === 0,
            score: Math.max(0, 100 - (issues.length * 30)),
            loadTime: navigationTiming ? (navigationTiming.loadEventEnd - navigationTiming.fetchStart) / 1000 : null,
            issues,
            recommendations
        };
    }
    
    // Core Web Vitals Audit
    auditCoreWebVitals() {
        console.log('📈 Auditing Core Web Vitals...');
        
        const issues = [];
        const recommendations = [];
        
        // This would integrate with the existing Core Web Vitals monitoring
        if (window.coreWebVitalsOptimizer) {
            const metrics = window.coreWebVitalsOptimizer.metrics;
            
            if (metrics.lcp && metrics.lcp > 2500) {
                issues.push(`LCP too slow: ${metrics.lcp.toFixed(0)}ms`);
                recommendations.push('Optimize Largest Contentful Paint (target: <2.5s)');
            }
            
            if (metrics.fid && metrics.fid > 100) {
                issues.push(`FID too slow: ${metrics.fid.toFixed(0)}ms`);
                recommendations.push('Optimize First Input Delay (target: <100ms)');
            }
            
            if (metrics.cls && metrics.cls > 0.1) {
                issues.push(`CLS too high: ${metrics.cls.toFixed(3)}`);
                recommendations.push('Reduce Cumulative Layout Shift (target: <0.1)');
            }
        }
        
        this.auditResults.compliance.coreWebVitals = {
            passed: issues.length === 0,
            score: Math.max(0, 100 - (issues.length * 33)),
            issues,
            recommendations
        };
    }
    
    // Generate Compliance Report
    generateComplianceReport() {
        const totalChecks = Object.keys(this.auditResults.compliance).length;
        const passedChecks = Object.values(this.auditResults.compliance).filter(check => check.passed).length;
        const overallScore = Object.values(this.auditResults.compliance).reduce((sum, check) => sum + check.score, 0) / totalChecks;
        
        this.auditResults.summary = {
            overallScore: Math.round(overallScore),
            passedChecks,
            totalChecks,
            complianceRate: `${passedChecks}/${totalChecks}`,
            status: overallScore >= 80 ? 'EXCELLENT' : overallScore >= 60 ? 'GOOD' : overallScore >= 40 ? 'NEEDS_IMPROVEMENT' : 'POOR'
        };
        
        // Collect all issues and recommendations
        this.auditResults.allIssues = [];
        this.auditResults.allRecommendations = [];
        
        Object.values(this.auditResults.compliance).forEach(check => {
            this.auditResults.allIssues.push(...check.issues);
            this.auditResults.allRecommendations.push(...check.recommendations);
        });
        
        // Log summary
        console.log('\n' + '='.repeat(60));
        console.log('📊 MOBILE-FIRST INDEXING COMPLIANCE REPORT');
        console.log('='.repeat(60));
        console.log(`Overall Score: ${this.auditResults.summary.overallScore}/100 (${this.auditResults.summary.status})`);
        console.log(`Compliance Rate: ${this.auditResults.summary.complianceRate}`);
        console.log(`Total Issues: ${this.auditResults.allIssues.length}`);
        console.log(`Device Type: ${this.isMobile ? 'Mobile' : 'Desktop'}`);
        console.log(`Viewport: ${this.viewport.width}x${this.viewport.height}`);
        
        if (this.auditResults.allIssues.length > 0) {
            console.log('\n🚨 Issues Found:');
            this.auditResults.allIssues.forEach((issue, index) => {
                console.log(`${index + 1}. ${issue}`);
            });
        }
        
        if (this.auditResults.allRecommendations.length > 0) {
            console.log('\n💡 Recommendations:');
            this.auditResults.allRecommendations.forEach((rec, index) => {
                console.log(`${index + 1}. ${rec}`);
            });
        }
        
        return this.auditResults;
    }
    
    // Export results
    exportResults() {
        const blob = new Blob([JSON.stringify(this.auditResults, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mobile-first-indexing-audit-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        console.log('📁 Audit results exported');
    }
    
    // Quick fix implementations
    applyQuickFixes() {
        console.log('🔧 Applying quick fixes...');
        
        let fixesApplied = 0;
        
        // Fix viewport if missing
        if (!document.querySelector('meta[name="viewport"]')) {
            const viewport = document.createElement('meta');
            viewport.name = 'viewport';
            viewport.content = 'width=device-width, initial-scale=1';
            document.head.appendChild(viewport);
            fixesApplied++;
        }
        
        // Add missing alt text
        const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
        imagesWithoutAlt.forEach(img => {
            img.alt = 'EkoSolar professional solar services in Georgia';
            fixesApplied++;
        });
        
        // Add dimensions to images
        const imagesWithoutDimensions = document.querySelectorAll('img:not([width]):not([height])');
        imagesWithoutDimensions.forEach(img => {
            img.addEventListener('load', () => {
                img.width = img.naturalWidth;
                img.height = img.naturalHeight;
            });
            fixesApplied++;
        });
        
        console.log(`✅ Applied ${fixesApplied} quick fixes`);
        return fixesApplied;
    }
}

// Auto-run audit on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.mobileFirstAudit = new MobileFirstIndexingAudit();
    });
} else {
    window.mobileFirstAudit = new MobileFirstIndexingAudit();
}

// Export for manual use
window.MobileFirstIndexingAudit = MobileFirstIndexingAudit;