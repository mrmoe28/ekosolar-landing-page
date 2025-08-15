        // ===== GLOBAL ANIMATED GRID SYSTEM =====
        class GlobalGridSystem {
            constructor() {
                this.gridLayers = document.querySelectorAll('.grid-layer');
                this.dynamicLinesContainer = document.getElementById('dynamic-grid-lines');
                this.intersectionsContainer = document.getElementById('grid-intersections');
                this.solarGridContainer = document.getElementById('solar-grid');
                this.circuitGridContainer = document.getElementById('circuit-grid');
                this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                
                this.init();
            }
            
            init() {
                if (this.isReducedMotion) return;
                
                this.animateGridLayers();
                this.createDynamicLines();
                this.createGridIntersections();
                this.createSolarGrid();
                this.createCircuitGrid();
                this.setupMouseInteraction();
                this.setupResizeHandler();
            }
            
            animateGridLayers() {
                // Animate the base CSS grid layers with different speeds and directions
                anime({
                    targets: '.grid-layer-1',
                    translateX: ['0px', '80px'],
                    translateY: ['0px', '40px'],
                    duration: 45000,
                    easing: 'linear',
                    loop: true
                });
                
                anime({
                    targets: '.grid-layer-2',
                    translateX: ['0px', '-40px'],
                    translateY: ['0px', '60px'],
                    duration: 35000,
                    easing: 'linear',
                    loop: true
                });
                
                anime({
                    targets: '.grid-layer-3',
                    translateX: ['0px', '160px'],
                    translateY: ['0px', '-80px'],
                    duration: 60000,
                    easing: 'linear',
                    loop: true
                });
            }
            
            createDynamicLines() {
                // Responsive line count based on screen size
                const isMobile = window.innerWidth <= 768;
                const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
                const lineCount = isMobile ? 3 : isTablet ? 4 : 6;
                
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                
                // Create horizontal lines
                for (let i = 0; i < lineCount; i++) {
                    const line = document.createElement('div');
                    line.className = 'animated-grid-line grid-line-horizontal';
                    line.style.top = `${(viewportHeight / lineCount) * i}px`;
                    line.style.transform = `translateX(-100%)`;
                    this.dynamicLinesContainer.appendChild(line);
                    
                    // Animate with staggered delays
                    anime({
                        targets: line,
                        translateX: ['-100%', '100%'],
                        duration: 8000 + (i * 1000),
                        easing: 'easeInOutSine',
                        loop: true,
                        delay: i * 500
                    });
                }
                
                // Create vertical lines
                for (let i = 0; i < lineCount; i++) {
                    const line = document.createElement('div');
                    line.className = 'animated-grid-line grid-line-vertical';
                    line.style.left = `${(viewportWidth / lineCount) * i}px`;
                    line.style.transform = `translateY(-100%)`;
                    this.dynamicLinesContainer.appendChild(line);
                    
                    // Animate with staggered delays
                    anime({
                        targets: line,
                        translateY: ['-100%', '100%'],
                        duration: 10000 + (i * 800),
                        easing: 'easeInOutSine',
                        loop: true,
                        delay: i * 700
                    });
                }
            }
            
            createGridIntersections() {
                // Responsive intersection count
                const isMobile = window.innerWidth <= 768;
                const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
                const intersectionCount = isMobile ? 8 : isTablet ? 12 : 20;
                
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                
                for (let i = 0; i < intersectionCount; i++) {
                    const intersection = document.createElement('div');
                    intersection.className = 'grid-intersection';
                    intersection.style.left = `${Math.random() * viewportWidth}px`;
                    intersection.style.top = `${Math.random() * viewportHeight}px`;
                    this.intersectionsContainer.appendChild(intersection);
                    
                    // Pulse animation
                    anime({
                        targets: intersection,
                        opacity: [0, 0.345, 0], /* Increased by 15% from [0, 0.3, 0] */
                        scale: [0.5, 1.2, 0.5],
                        duration: 3000,
                        easing: 'easeInOutSine',
                        loop: true,
                        delay: Math.random() * 2000
                    });
                }
            }
            
            createSolarGrid() {
                // Responsive cell size
                const isMobile = window.innerWidth <= 768;
                const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
                const cellSize = isMobile ? 80 : isTablet ? 100 : 120;
                
                const cols = Math.ceil(window.innerWidth / cellSize) + 1;
                const rows = Math.ceil(window.innerHeight / cellSize) + 1;
                
                for (let row = 0; row < rows; row++) {
                    for (let col = 0; col < cols; col++) {
                        const cell = document.createElement('div');
                        cell.className = 'solar-grid-cell';
                        cell.style.left = `${col * cellSize}px`;
                        cell.style.top = `${row * cellSize}px`;
                        cell.style.width = `${cellSize - 2}px`;
                        cell.style.height = `${cellSize - 2}px`;
                        this.solarGridContainer.appendChild(cell);
                        
                        // Random activation animation
                        anime({
                            targets: cell,
                            opacity: [0.0575, 0.1725, 0.0575], /* Increased by 15% from [0.05, 0.15, 0.05] */
                            duration: 4000 + Math.random() * 3000,
                            easing: 'easeInOutSine',
                            loop: true,
                            delay: Math.random() * 5000
                        });
                    }
                }
            }
            
            createCircuitGrid() {
                // Responsive counts for mobile/tablet
                const isMobile = window.innerWidth <= 768;
                const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
                const pathCount = isMobile ? 4 : isTablet ? 6 : 8;
                const nodeCount = isMobile ? 8 : isTablet ? 10 : 15;
                
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                
                // Create circuit paths
                for (let i = 0; i < pathCount; i++) {
                    const path = document.createElement('div');
                    path.className = 'circuit-path';
                    path.style.top = `${Math.random() * viewportHeight}px`;
                    path.style.left = `0px`;
                    path.style.width = `${viewportWidth * 0.3}px`;
                    this.circuitGridContainer.appendChild(path);
                    
                    // Flowing animation
                    anime({
                        targets: path,
                        opacity: [0, 0.345, 0], /* Increased by 15% from [0, 0.3, 0] */
                        scaleX: [0, 1, 0],
                        duration: 6000,
                        easing: 'easeInOutSine',
                        loop: true,
                        delay: i * 800
                    });
                }
                
                // Create circuit nodes
                for (let i = 0; i < nodeCount; i++) {
                    const node = document.createElement('div');
                    node.className = 'circuit-node';
                    node.style.left = `${Math.random() * viewportWidth}px`;
                    node.style.top = `${Math.random() * viewportHeight}px`;
                    this.circuitGridContainer.appendChild(node);
                    
                    // Blinking animation
                    anime({
                        targets: node,
                        opacity: [0, 0.69, 0], /* Increased by 15% from [0, 0.6, 0] */
                        scale: [0.5, 1, 0.5],
                        duration: 2000,
                        easing: 'easeInOutSine',
                        loop: true,
                        delay: Math.random() * 3000
                    });
                }
            }
            
            setupMouseInteraction() {
                let mouseX = 0;
                let mouseY = 0;
                
                // Only enable mouse interaction on non-touch devices
                if (!window.matchMedia('(pointer: coarse)').matches) {
                    document.addEventListener('mousemove', (e) => {
                        mouseX = e.clientX / window.innerWidth;
                        mouseY = e.clientY / window.innerHeight;
                        
                        // Subtle parallax effect on grid layers
                        anime({
                            targets: '.grid-layer-1',
                            translateX: `${mouseX * 20}px`,
                            translateY: `${mouseY * 15}px`,
                            duration: 1000,
                            easing: 'easeOutQuint'
                        });
                        
                        anime({
                            targets: '.grid-layer-2',
                            translateX: `${mouseX * -15}px`,
                            translateY: `${mouseY * 10}px`,
                            duration: 800,
                            easing: 'easeOutQuint'
                        });
                    });
                }
            }
            
            setupResizeHandler() {
                let resizeTimeout;
                window.addEventListener('resize', () => {
                    clearTimeout(resizeTimeout);
                    resizeTimeout = setTimeout(() => {
                        // Clear existing elements
                        this.dynamicLinesContainer.innerHTML = '';
                        this.intersectionsContainer.innerHTML = '';
                        this.solarGridContainer.innerHTML = '';
                        this.circuitGridContainer.innerHTML = '';
                        
                        // Recreate with new dimensions
                        if (!this.isReducedMotion) {
                            this.createDynamicLines();
                            this.createGridIntersections();
                            this.createSolarGrid();
                            this.createCircuitGrid();
                        }
                    }, 250);
                });
            }
        }
        
        // ===== GLOBAL VARIABLES =====
        let currentTestimonial = 0;
        const totalTestimonials = 3;
        let testimonialInterval;
        let globalGridSystem;
        
        // ===== NAVIGATION FUNCTIONALITY =====
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize Global Grid System
            globalGridSystem = new GlobalGridSystem();
            
            // Mobile menu toggle
            const mobileToggle = document.getElementById('mobileToggle');
            const navMenu = document.getElementById('navMenu');
            
            mobileToggle.addEventListener('click', function() {
                navMenu.classList.toggle('active');
                this.textContent = navMenu.classList.contains('active') ? '✕' : '≡';
            });
            
            // Handle mobile dropdown toggles
            document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
                toggle.addEventListener('click', function(e) {
                    if (window.innerWidth <= 768) {
                        e.preventDefault();
                        const dropdown = this.closest('.nav-dropdown');
                        dropdown.classList.toggle('active');
                        
                        // Close other dropdowns
                        document.querySelectorAll('.nav-dropdown').forEach(other => {
                            if (other !== dropdown) {
                                other.classList.remove('active');
                            }
                        });
                    }
                });
            });
            
            // Smooth scrolling and active nav updates
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    const href = this.getAttribute('href');
                    
                    // Allow external links (like blog) to work normally
                    if (href.includes('.html') || href.includes('http')) {
                        return; // Don't prevent default for external links
                    }
                    
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetSection = document.getElementById(targetId);
                    
                    if (targetSection) {
                        const headerHeight = document.querySelector('.header').offsetHeight;
                        const targetPosition = targetSection.offsetTop - headerHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                        // Close mobile menu if open
                        navMenu.classList.remove('active');
                        mobileToggle.textContent = '≡';
                        
                        // Update active nav link
                        updateActiveNavLink(targetId);
                    }
                });
            });
            
            // Update active nav link on scroll
            window.addEventListener('scroll', updateActiveNavOnScroll);
            
            // Initialize animations and counters
            initializeAnimations();
            initializeCalculator();
            initializeTestimonials();
            initializeContactForm();
        });
        
        function updateActiveNavLink(activeId) {
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                if (link.getAttribute('href') === `#${activeId}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
        
        function updateActiveNavOnScroll() {
            const sections = document.querySelectorAll('section');
            const headerHeight = document.querySelector('.header').offsetHeight;
            const scrollPosition = window.scrollY + headerHeight + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition <= sectionBottom) {
                    updateActiveNavLink(section.id);
                }
            });
        }
        
        // ===== ANIMATION FUNCTIONS =====
        function initializeAnimations() {
            // Initialize intersection observer for fade-in animations
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('fade-in');
                        
                        // Trigger counter animation for statistics
                        if (entry.target.classList.contains('hero')) {
                            animateCounters();
                        }
                    }
                });
            }, observerOptions);
            
            // Observe sections for animations
            document.querySelectorAll('section').forEach(section => {
                observer.observe(section);
            });
        }
        
        function animateCounters() {
            const counters = document.querySelectorAll('.stat-number');
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60 FPS
                let current = 0;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current).toLocaleString();
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target.toLocaleString();
                    }
                };
                
                updateCounter();
            });
        }
        
        // ===== SERVICE CARD FUNCTIONALITY =====
        function toggleService(card) {
            // Close other expanded cards
            document.querySelectorAll('.service-card').forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('expanded');
                }
            });
            
            // Toggle current card
            card.classList.toggle('expanded');
        }
        
        // ===== SOLAR CALCULATOR FUNCTIONALITY =====
        function initializeCalculator() {
            const electricBillInput = document.getElementById('electricBill');
            const homeSizeInput = document.getElementById('homeSize');
            const sunExposureSlider = document.getElementById('sunExposure');
            const energyUsageSlider = document.getElementById('energyUsage');
            const sunExposureValue = document.getElementById('sunExposureValue');
            const energyUsageValue = document.getElementById('energyUsageValue');
            
            // Update slider display values
            sunExposureSlider.addEventListener('input', function() {
                const exposureTexts = ['Poor', 'Good', 'Excellent'];
                sunExposureValue.textContent = exposureTexts[this.value - 1];
                calculateSolarSavings();
            });
            
            energyUsageSlider.addEventListener('input', function() {
                const usageTexts = ['Low', 'Average', 'High'];
                energyUsageValue.textContent = usageTexts[this.value - 1];
                calculateSolarSavings();
            });
            
            // Calculate on input change
            electricBillInput.addEventListener('input', debounce(calculateSolarSavings, 500));
            homeSizeInput.addEventListener('input', debounce(calculateSolarSavings, 500));
            
            // Initial calculation
            calculateSolarSavings();
        }
        
        function calculateSolarSavings() {
            const electricBill = parseFloat(document.getElementById('electricBill').value) || 0;
            const homeSize = parseFloat(document.getElementById('homeSize').value) || 0;
            const sunExposure = parseInt(document.getElementById('sunExposure').value);
            const energyUsage = parseInt(document.getElementById('energyUsage').value);
            
            if (electricBill === 0 || homeSize === 0) {
                // Show placeholder values
                document.getElementById('monthlySavings').textContent = '$0';
                document.getElementById('annualSavings').textContent = '$0';
                document.getElementById('systemCost').textContent = '$0';
                document.getElementById('paybackPeriod').textContent = '0 yrs';
                return;
            }
            
            // Calculation factors
            const sunMultiplier = [0.7, 0.9, 1.2][sunExposure - 1];
            const usageMultiplier = [0.8, 1.0, 1.3][energyUsage - 1];
            
            // Basic calculations
            const systemSizeKW = (homeSize / 1000) * 8 * usageMultiplier; // Rough estimate
            const monthlyGeneration = systemSizeKW * 130 * sunMultiplier; // kWh per month
            const monthlySavings = Math.min(monthlyGeneration * 0.22, electricBill * 0.95); // Max 95% savings
            const annualSavings = monthlySavings * 12;
            const systemCost = systemSizeKW * 3200; // $3.20 per watt average
            const paybackPeriod = annualSavings > 0 ? systemCost / annualSavings : 0;
            
            // Update display with animation
            animateValue('monthlySavings', monthlySavings, '$');
            animateValue('annualSavings', annualSavings, '$');
            animateValue('systemCost', systemCost, '$');
            document.getElementById('paybackPeriod').textContent = `${Math.round(paybackPeriod * 10) / 10} yrs`;
        }
        
        function animateValue(elementId, targetValue, prefix = '') {
            const element = document.getElementById(elementId);
            const currentValue = parseFloat(element.textContent.replace(/[^0-9.]/g, '')) || 0;
            const increment = (targetValue - currentValue) / 20;
            let current = currentValue;
            
            const updateValue = () => {
                current += increment;
                if ((increment > 0 && current < targetValue) || (increment < 0 && current > targetValue)) {
                    element.textContent = prefix + Math.round(current).toLocaleString();
                    requestAnimationFrame(updateValue);
                } else {
                    element.textContent = prefix + Math.round(targetValue).toLocaleString();
                }
            };
            
            updateValue();
        }
        
        // ===== TESTIMONIALS CAROUSEL =====
        function initializeTestimonials() {
            startTestimonialAutoplay();
        }
        
        function showTestimonial(index) {
            const track = document.getElementById('testimonialsTrack');
            const dots = document.querySelectorAll('.carousel-dot');
            
            currentTestimonial = index;
            track.style.transform = `translateX(-${index * 100}%)`;
            
            // Update active dot
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            
            // Restart autoplay
            clearInterval(testimonialInterval);
            startTestimonialAutoplay();
        }
        
        function startTestimonialAutoplay() {
            testimonialInterval = setInterval(() => {
                const nextIndex = (currentTestimonial + 1) % totalTestimonials;
                showTestimonial(nextIndex);
            }, 5000); // Change every 5 seconds
        }
        
        // ===== CONTACT FORM FUNCTIONALITY =====
        function initializeContactForm() {
            const form = document.getElementById('contactForm');
            form.addEventListener('submit', handleFormSubmission);
            
            // Real-time validation
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', validateField);
                input.addEventListener('input', clearFieldError);
            });
            
            // File upload handling
            const fileInput = document.getElementById('powerBillUpload');
            const fileDisplay = document.getElementById('fileDisplay');
            
            fileInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    // Validate file type
                    if (!file.type.includes('pdf')) {
                        showFormMessage('Please upload a PDF file only.', 'error');
                        fileInput.value = '';
                        fileDisplay.classList.remove('show');
                        return;
                    }
                    
                    // Validate file size (10MB limit)
                    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
                    if (file.size > maxSize) {
                        showFormMessage('File size must be less than 10MB. Please compress your PDF or use a smaller file.', 'error');
                        fileInput.value = '';
                        fileDisplay.classList.remove('show');
                        return;
                    }
                    
                    // Show file info
                    const fileSize = (file.size / (1024 * 1024)).toFixed(2);
                    fileDisplay.innerHTML = `
                        <span class="file-name">📄 ${file.name}</span>
                        <span class="file-size">(${fileSize} MB)</span>
                    `;
                    fileDisplay.classList.add('show');
                    hideFormMessage();
                } else {
                    fileDisplay.classList.remove('show');
                }
            });
        }
        
        function handleFormSubmission(e) {
            e.preventDefault();
            const submitButton = e.target.querySelector('.submit-button');
            const messageDiv = document.getElementById('formMessage');
            
            // Validate form
            if (!validateForm(e.target)) {
                showFormMessage('Please fill in all required fields correctly.', 'error');
                return;
            }
            
            // Show loading state
            submitButton.classList.add('loading');
            submitButton.disabled = true;
            hideFormMessage();
            
            // Submit to Netlify Forms (automatic email notifications)
            const formData = new FormData(e.target);
            
            fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            })
            .then(response => {
                submitButton.classList.remove('loading');
                submitButton.disabled = false;
                
                if (response.ok) {
                    // Show success message
                    showFormMessage('Thank you! Your solar consultation request has been automatically sent to ekosolarize@gmail.com. We\'ll contact you within 24 hours to schedule your free consultation.', 'success');
                    
                    // Reset form after success
                    e.target.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch((error) => {
                submitButton.classList.remove('loading');
                submitButton.disabled = false;
                
                console.error('Form submission error:', error);
                showFormMessage('There was an issue submitting your request. Please try again or call us directly at (404) 551-6532.', 'error');
            });
        }
        
        function validateForm(form) {
            const requiredFields = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!validateField({ target: field })) {
                    isValid = false;
                }
            });
            
            return isValid;
        }
        
        function validateField(e) {
            const field = e.target;
            const value = field.value.trim();
            let isValid = true;
            
            // Remove existing error styling
            field.classList.remove('error');
            
            // Check required fields
            if (field.hasAttribute('required') && !value) {
                isValid = false;
            }
            
            // Email validation
            if (field.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    isValid = false;
                }
            }
            
            // Phone validation (basic)
            if (field.type === 'tel' && value) {
                const phoneRegex = /^[\d\s\-\(\)]{10,}$/;
                if (!phoneRegex.test(value)) {
                    isValid = false;
                }
            }
            
            // Add error styling if invalid
            if (!isValid) {
                field.classList.add('error');
                field.style.borderColor = '#EF4444';
            } else {
                field.style.borderColor = '#10B981';
            }
            
            return isValid;
        }
        
        function clearFieldError(e) {
            const field = e.target;
            field.classList.remove('error');
            field.style.borderColor = '';
        }
        
        function showFormMessage(message, type) {
            const messageDiv = document.getElementById('formMessage');
            messageDiv.textContent = message;
            messageDiv.className = `form-message ${type}`;
            messageDiv.style.display = 'block';
            
            // Auto-hide success messages after 5 seconds
            if (type === 'success') {
                setTimeout(() => {
                    hideFormMessage();
                }, 5000);
            }
        }
        
        function hideFormMessage() {
            const messageDiv = document.getElementById('formMessage');
            messageDiv.style.display = 'none';
        }
        
        // ===== UTILITY FUNCTIONS =====
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
        
        // ===== PAGE PERFORMANCE OPTIMIZATIONS =====
        
        // Lazy load images when they come into view
        document.addEventListener('DOMContentLoaded', function() {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        });
        
        // Preload critical resources
        function preloadCriticalResources() {
            const criticalImages = [
                // Add paths to critical images that should be preloaded
            ];
            
            criticalImages.forEach(src => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = src;
                document.head.appendChild(link);
            });
        }
        
        // Initialize performance optimizations
        document.addEventListener('DOMContentLoaded', preloadCriticalResources);
        
        // ===== ERROR HANDLING =====
        window.addEventListener('error', function(e) {
            console.error('JavaScript Error:', e.error);
            // In production, you might want to send this to an error tracking service
        });
        
        // ===== ACCESSIBILITY ENHANCEMENTS =====
        
        // Keyboard navigation for custom elements
        document.addEventListener('keydown', function(e) {
            // Handle Enter key for clickable elements
            if (e.key === 'Enter') {
                const target = e.target;
                if (target.classList.contains('service-card')) {
                    toggleService(target);
                }
                if (target.classList.contains('carousel-dot')) {
                    const index = Array.from(target.parentNode.children).indexOf(target);
                    showTestimonial(index);
                }
            }
            
            // Handle Escape key to close mobile menu
            if (e.key === 'Escape') {
                const navMenu = document.getElementById('navMenu');
                const mobileToggle = document.getElementById('mobileToggle');
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    mobileToggle.textContent = '☰';
                }
            }
        });
        
        // Add appropriate ARIA labels and roles
        document.addEventListener('DOMContentLoaded', function() {
            // Make service cards focusable and add appropriate roles
            document.querySelectorAll('.service-card').forEach((card, index) => {
                card.setAttribute('tabindex', '0');
                card.setAttribute('role', 'button');
                card.setAttribute('aria-expanded', 'false');
                card.setAttribute('aria-label', `Expand details for ${card.querySelector('.service-title').textContent}`);
            });
            
            // Add carousel labels
            document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
                dot.setAttribute('aria-label', `Show testimonial ${index + 1}`);
            });
            
            // Add form labels and descriptions
            const form = document.getElementById('contactForm');
            form.setAttribute('aria-label', 'Solar consultation request form');
        });

        // Fast CSS-only animations - no external dependencies
        function initializeAnimations() {
            // Respect reduced motion preferences
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                return; // Skip animations for users who prefer reduced motion
            }
            
            // Add CSS animation classes to elements
            const elements = document.querySelectorAll('.service-card, .testimonial-card, .feature-card');
            elements.forEach((el, index) => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                setTimeout(() => {
                    el.classList.add('animate-fade-in-up');
                }, index * 100);
            });
            
            // Simple CSS animations for service cards
            const systemServiceCards = document.querySelectorAll('.service-card-advanced');
            systemServiceCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                setTimeout(() => {
                    card.classList.add('animate-fade-in-up', `stagger-${Math.min(index + 1, 6)}`);
                }, 200 + (index * 100));
            });

            // Simple CSS-based animations for service elements
            const serviceElements = document.querySelectorAll('.service-title-advanced, .service-description-advanced, .service-cta-advanced');
            serviceElements.forEach((el, index) => {
                el.style.opacity = '0';
                setTimeout(() => {
                    el.classList.add('animate-fade-in');
                }, 300 + (index * 50));
            });

            // Simple CSS hover effects - no external dependencies
            const serviceCards = document.querySelectorAll('.service-card-advanced');
            serviceCards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-5px)';
                    this.style.transition = 'transform 0.3s ease';
                });
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                });
            });

        }
        
        // Initialize animations when DOM is ready
        document.addEventListener('DOMContentLoaded', initializeAnimations);

        // Lazy load images for better performance
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        observer.unobserve(img);
                    }
                });
            }, { rootMargin: '50px' });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        }

        // Preload next critical resources
        const preloadNextResources = () => {
            const linkPrefetch = document.createElement('link');
            linkPrefetch.rel = 'prefetch';
            linkPrefetch.href = '#calculator';
            document.head.appendChild(linkPrefetch);
        };
        setTimeout(preloadNextResources, 3000);

        // ===== HERO SLIDESHOW FUNCTIONALITY =====
        class HeroSlideshow {
            constructor() {
                this.slides = document.querySelectorAll('.slide');
                this.dots = document.querySelectorAll('.dot');
                this.prevBtn = document.querySelector('.nav-arrow.prev');
                this.nextBtn = document.querySelector('.nav-arrow.next');
                this.currentSlide = 0;
                this.slideInterval = null;
                this.isPlaying = true;
                this.touchStartX = 0;
                this.touchEndX = 0;
                
                this.init();
            }

            init() {
                // Set initial slide
                this.setActiveSlide(0);
                
                // Start automatic slideshow
                this.startSlideshow();
                
                // Event listeners
                this.prevBtn?.addEventListener('click', () => this.prevSlide());
                this.nextBtn?.addEventListener('click', () => this.nextSlide());
                
                // Dot navigation
                this.dots.forEach((dot, index) => {
                    dot.addEventListener('click', () => this.goToSlide(index));
                });
                
                // Pause on hover
                const slideshow = document.querySelector('.hero-slideshow');
                slideshow?.addEventListener('mouseenter', () => this.pauseSlideshow());
                slideshow?.addEventListener('mouseleave', () => this.resumeSlideshow());
                
                // Touch/swipe support
                slideshow?.addEventListener('touchstart', (e) => this.handleTouchStart(e));
                slideshow?.addEventListener('touchmove', (e) => this.handleTouchMove(e));
                slideshow?.addEventListener('touchend', (e) => this.handleTouchEnd(e));
                
                // Keyboard navigation
                document.addEventListener('keydown', (e) => this.handleKeyPress(e));
                
                // Visibility API - pause when tab is not visible
                document.addEventListener('visibilitychange', () => {
                    if (document.hidden) {
                        this.pauseSlideshow();
                    } else {
                        this.resumeSlideshow();
                    }
                });
                
                // Preload background images
                this.preloadImages();
            }

            setActiveSlide(index) {
                // Remove active class from all slides and dots
                this.slides.forEach(slide => slide.classList.remove('active'));
                this.dots.forEach(dot => dot.classList.remove('active'));
                
                // Add active class to current slide and dot
                if (this.slides[index]) {
                    this.slides[index].classList.add('active');
                    
                    // Update background image
                    const bgImage = this.slides[index].getAttribute('data-bg');
                    if (bgImage) {
                        this.slides[index].style.backgroundImage = this.getBackgroundImage(bgImage);
                    }
                }
                
                if (this.dots[index]) {
                    this.dots[index].classList.add('active');
                }
                
                this.currentSlide = index;
                
                // Re-animate statistics for new slide
                this.animateStats();
            }

            nextSlide() {
                const nextIndex = (this.currentSlide + 1) % this.slides.length;
                this.setActiveSlide(nextIndex);
            }

            prevSlide() {
                const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
                this.setActiveSlide(prevIndex);
            }

            goToSlide(index) {
                if (index >= 0 && index < this.slides.length) {
                    this.setActiveSlide(index);
                }
            }

            startSlideshow() {
                if (!this.slideInterval) {
                    this.slideInterval = setInterval(() => {
                        if (this.isPlaying) {
                            this.nextSlide();
                        }
                    }, 6000); // 6 seconds per slide
                }
            }

            pauseSlideshow() {
                this.isPlaying = false;
            }

            resumeSlideshow() {
                this.isPlaying = true;
            }

            stopSlideshow() {
                if (this.slideInterval) {
                    clearInterval(this.slideInterval);
                    this.slideInterval = null;
                }
                this.isPlaying = false;
            }

            // Touch/swipe functionality
            handleTouchStart(e) {
                this.touchStartX = e.touches[0].clientX;
            }

            handleTouchMove(e) {
                // Prevent default scrolling during swipe
                if (Math.abs(e.touches[0].clientX - this.touchStartX) > 10) {
                    e.preventDefault();
                }
            }

            handleTouchEnd(e) {
                this.touchEndX = e.changedTouches[0].clientX;
                const swipeThreshold = 50;
                const diff = this.touchStartX - this.touchEndX;

                if (Math.abs(diff) > swipeThreshold) {
                    if (diff > 0) {
                        this.nextSlide(); // Swipe left - next slide
                    } else {
                        this.prevSlide(); // Swipe right - previous slide
                    }
                }
                
                // Reset touch positions
                this.touchStartX = 0;
                this.touchEndX = 0;
            }

            // Keyboard navigation
            handleKeyPress(e) {
                // Only handle if focus is on slideshow or no form elements are focused
                const activeElement = document.activeElement;
                const isFormElement = activeElement && (
                    activeElement.tagName === 'INPUT' || 
                    activeElement.tagName === 'TEXTAREA' || 
                    activeElement.tagName === 'SELECT'
                );

                if (!isFormElement) {
                    switch(e.key) {
                        case 'ArrowLeft':
                            e.preventDefault();
                            this.prevSlide();
                            break;
                        case 'ArrowRight':
                            e.preventDefault();
                            this.nextSlide();
                            break;
                        case ' ': // Spacebar
                            e.preventDefault();
                            if (this.isPlaying) {
                                this.pauseSlideshow();
                            } else {
                                this.resumeSlideshow();
                            }
                            break;
                    }
                }
            }

            // Get background image with gradient overlay
            getBackgroundImage(imagePath) {
                const gradients = {
                    'installation': 'linear-gradient(rgba(234, 88, 12, 0.6), rgba(251, 146, 60, 0.4))',
                    'repair': 'linear-gradient(rgba(220, 38, 38, 0.7), rgba(239, 68, 68, 0.5))',
                    'maintenance': 'linear-gradient(rgba(16, 185, 129, 0.6), rgba(52, 211, 153, 0.4))',
                    'commercial': 'linear-gradient(rgba(59, 130, 246, 0.6), rgba(147, 197, 253, 0.4))',
                    'diagnostics': 'linear-gradient(rgba(168, 85, 247, 0.6), rgba(196, 181, 253, 0.4))'
                };

                // Determine gradient based on image name
                let gradient = gradients.installation; // default
                for (const [key, value] of Object.entries(gradients)) {
                    if (imagePath.includes(key)) {
                        gradient = value;
                        break;
                    }
                }

                return `${gradient}, url('${imagePath}')`;
            }

            // Animate statistics counters
            animateStats() {
                const currentSlideElement = this.slides[this.currentSlide];
                const statNumbers = currentSlideElement.querySelectorAll('.stat-number');
                
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    let current = 0;
                    
                    const counter = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            stat.textContent = target;
                            clearInterval(counter);
                        } else {
                            stat.textContent = Math.floor(current);
                        }
                    }, 16);
                });
            }

            // Preload background images for better performance
            preloadImages() {
                const imageUrls = [
                    'https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
                    'https://images.unsplash.com/photo-1613665813446-82a78c468a1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
                    'https://images.unsplash.com/photo-1624397640148-949b1732bb0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
                    'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
                    'https://images.unsplash.com/photo-1603030070898-b67bb3ef6d7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
                ];

                imageUrls.forEach(url => {
                    const img = new Image();
                    img.src = url;
                });
            }
        }

        // Initialize slideshow when DOM is loaded
        document.addEventListener('DOMContentLoaded', () => {
            new HeroSlideshow();
        });

        // If DOM is already loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => new HeroSlideshow());
        } else {
            new HeroSlideshow();
        }
    </script>
