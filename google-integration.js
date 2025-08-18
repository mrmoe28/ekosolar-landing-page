// Google Analytics GA4 Configuration
// Replace 'G-XXXXXXXXXX' with your actual GA4 Measurement ID
const GA4_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // TODO: Replace with your GA4 ID

// Google Tag Manager Configuration
// Replace 'GTM-XXXXXXX' with your actual GTM Container ID
const GTM_CONTAINER_ID = 'GTM-XXXXXXX'; // TODO: Replace with your GTM ID

// Initialize Google Analytics GA4
function initGoogleAnalytics() {
    // GA4 Global Site Tag (gtag.js)
    const gaScript = document.createElement('script');
    gaScript.async = true;
    gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_MEASUREMENT_ID}`;
    document.head.appendChild(gaScript);

    // GA4 Configuration
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA4_MEASUREMENT_ID, {
        'page_title': document.title,
        'page_location': window.location.href,
        'send_page_view': true
    });

    // Enhanced Ecommerce for Solar Quote Requests
    gtag('event', 'page_view', {
        'page_title': 'Solar Installation Georgia - EkoSolarPros',
        'page_location': window.location.href,
        'page_path': window.location.pathname,
        'solar_service_type': getSolarServiceType()
    });
}

// Initialize Google Tag Manager
function initGoogleTagManager() {
    // GTM Head Script
    const gtmScript = `
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${GTM_CONTAINER_ID}');</script>
    <!-- End Google Tag Manager -->`;
    
    // Add GTM to head
    const gtmElement = document.createElement('div');
    gtmElement.innerHTML = gtmScript;
    document.head.appendChild(gtmElement.firstChild);
    
    // GTM Body Script (noscript fallback)
    const gtmNoScript = document.createElement('noscript');
    gtmNoScript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_CONTAINER_ID}"
    height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    document.body.insertBefore(gtmNoScript, document.body.firstChild);
}

// Track Custom Events for Solar Services
function trackSolarEvent(eventName, parameters = {}) {
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            'event_category': 'Solar Services',
            'event_label': parameters.label || '',
            'value': parameters.value || 0,
            ...parameters
        });
    }
}

// Track Form Submissions
function trackFormSubmission(formType) {
    trackSolarEvent('generate_lead', {
        'currency': 'USD',
        'value': getLeadValue(formType),
        'form_type': formType,
        'service_area': getCurrentServiceArea()
    });
}

// Track Phone Clicks
function trackPhoneClick(phoneNumber) {
    trackSolarEvent('contact', {
        'contact_method': 'phone',
        'phone_number': phoneNumber
    });
}

// Track Calculator Usage
function trackCalculatorUsage(step, data = {}) {
    trackSolarEvent('solar_calculator', {
        'calculator_step': step,
        'estimated_savings': data.savings || 0,
        'system_size': data.systemSize || 0,
        'roof_area': data.roofArea || 0
    });
}

// Helper Functions
function getSolarServiceType() {
    const path = window.location.pathname;
    if (path.includes('repair')) return 'Solar Repair';
    if (path.includes('installation')) return 'Solar Installation';
    if (path.includes('maintenance')) return 'Solar Maintenance';
    if (path.includes('emergency')) return 'Emergency Solar Service';
    return 'General Solar Services';
}

function getCurrentServiceArea() {
    const path = window.location.pathname;
    if (path.includes('atlanta')) return 'Atlanta';
    if (path.includes('savannah')) return 'Savannah';
    if (path.includes('columbus')) return 'Columbus';
    if (path.includes('augusta')) return 'Augusta';
    if (path.includes('macon')) return 'Macon';
    if (path.includes('stone-mountain')) return 'Stone Mountain';
    return 'Georgia';
}

function getLeadValue(formType) {
    // Estimated lead values for different form types
    const leadValues = {
        'solar_quote': 500,
        'emergency_repair': 300,
        'maintenance_contract': 200,
        'consultation': 150,
        'contact': 100
    };
    return leadValues[formType] || 100;
}

// Initialize Enhanced Ecommerce Tracking
function initEnhancedTracking() {
    // Track scroll depth
    let scrollDepths = [25, 50, 75, 90];
    let scrolledDepths = [];
    
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
        
        scrollDepths.forEach(depth => {
            if (scrollPercent >= depth && !scrolledDepths.includes(depth)) {
                scrolledDepths.push(depth);
                trackSolarEvent('scroll', {
                    'percent_scrolled': depth,
                    'page_section': getPageSection(depth)
                });
            }
        });
    });
    
    // Track time on page
    let timeOnPage = 0;
    setInterval(() => {
        timeOnPage += 10;
        if (timeOnPage % 60 === 0) { // Track every minute
            trackSolarEvent('engagement_time', {
                'time_seconds': timeOnPage,
                'engagement_type': timeOnPage > 180 ? 'highly_engaged' : 'engaged'
            });
        }
    }, 10000);
}

function getPageSection(scrollPercent) {
    if (scrollPercent < 25) return 'Hero';
    if (scrollPercent < 50) return 'Services';
    if (scrollPercent < 75) return 'Testimonials';
    return 'Contact';
}

// Google Site Verification Check
function checkGoogleVerification() {
    // Check if Google verification file exists
    fetch('/google44d7e3a72b5cfc88.html')
        .then(response => {
            if (response.ok) {
                console.log('✅ Google Site Verification: Active');
                trackSolarEvent('site_verification', {
                    'verification_status': 'verified',
                    'verification_method': 'html_file'
                });
            }
        })
        .catch(() => {
            console.warn('⚠️ Google Site Verification file not found');
        });
}

// Initialize All Google Services
function initGoogleServices() {
    // Check if IDs are configured
    if (GA4_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
        console.warn('⚠️ Google Analytics: Not configured. Please add your GA4 Measurement ID.');
    } else {
        initGoogleAnalytics();
        console.log('✅ Google Analytics GA4: Initialized');
    }
    
    if (GTM_CONTAINER_ID === 'GTM-XXXXXXX') {
        console.warn('⚠️ Google Tag Manager: Not configured. Please add your GTM Container ID.');
    } else {
        initGoogleTagManager();
        console.log('✅ Google Tag Manager: Initialized');
    }
    
    // Initialize enhanced tracking
    initEnhancedTracking();
    
    // Check verification status
    checkGoogleVerification();
    
    // Log initialization
    console.log('🚀 EkoSolar Google Integration: Ready');
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGoogleServices);
} else {
    initGoogleServices();
}

// Export functions for manual use
window.EkoSolarTracking = {
    trackEvent: trackSolarEvent,
    trackForm: trackFormSubmission,
    trackPhone: trackPhoneClick,
    trackCalculator: trackCalculatorUsage
};