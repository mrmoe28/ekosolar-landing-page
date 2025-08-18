// Comprehensive Schema Markup for EkoSolar
// This file contains all structured data for Google rich results

const EkoSolarSchema = {
    // Enhanced LocalBusiness Schema
    localBusiness: {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "@id": "https://ekosolarpros.com/#business",
        "name": "EkoSolarPros",
        "alternateName": ["EkoSolar", "Eko Solar Pros", "EkoSolar Professional Installation"],
        "url": "https://ekosolarpros.com",
        "logo": {
            "@type": "ImageObject",
            "url": "https://ekosolarpros.com/images/ekosolar-logo.png",
            "width": 600,
            "height": 200
        },
        "image": [
            "https://ekosolarpros.com/images/ekosolar-solar-installation-georgia.jpg",
            "https://ekosolarpros.com/images/solar-panel-installation.jpg",
            "https://ekosolarpros.com/images/solar-repair-service.jpg"
        ],
        "description": "Professional solar panel installation and repair services throughout Georgia. Licensed solar contractors serving Atlanta, Savannah, Columbus, Augusta, Macon, and surrounding areas. 24/7 emergency repair, 25-year warranty, 30% federal tax credit available.",
        "slogan": "Solar Power, Simplified",
        "priceRange": "$$",
        "telephone": "+1-678-555-SOLAR",
        "email": "info@ekosolarpros.com",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "123 Solar Drive",
            "addressLocality": "Atlanta",
            "addressRegion": "GA",
            "postalCode": "30309",
            "addressCountry": "US"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": 33.7490,
            "longitude": -84.3880
        },
        "areaServed": [
            {
                "@type": "State",
                "name": "Georgia",
                "@id": "https://en.wikipedia.org/wiki/Georgia_(U.S._state)"
            },
            {
                "@type": "City",
                "name": "Atlanta",
                "sameAs": "https://en.wikipedia.org/wiki/Atlanta"
            },
            {
                "@type": "City",
                "name": "Savannah",
                "sameAs": "https://en.wikipedia.org/wiki/Savannah,_Georgia"
            },
            {
                "@type": "City",
                "name": "Columbus",
                "sameAs": "https://en.wikipedia.org/wiki/Columbus,_Georgia"
            },
            {
                "@type": "City",
                "name": "Augusta",
                "sameAs": "https://en.wikipedia.org/wiki/Augusta,_Georgia"
            },
            {
                "@type": "City",
                "name": "Macon",
                "sameAs": "https://en.wikipedia.org/wiki/Macon,_Georgia"
            }
        ],
        "openingHoursSpecification": [
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                "opens": "08:00",
                "closes": "18:00"
            },
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": "Saturday",
                "opens": "09:00",
                "closes": "16:00"
            },
            {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": "Sunday",
                "opens": "00:00",
                "closes": "00:00",
                "description": "24/7 Emergency Solar Repair Service Available"
            }
        ],
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Solar Services",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Residential Solar Installation",
                        "description": "Complete solar panel system installation for homes"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Commercial Solar Installation",
                        "description": "Large-scale solar installations for businesses"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Solar Panel Repair",
                        "description": "Expert repair services for all solar panel brands"
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Emergency Solar Service",
                        "description": "24/7 emergency solar system repair"
                    }
                }
            ]
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "287",
            "bestRating": "5",
            "worstRating": "1"
        },
        "review": [
            {
                "@type": "Review",
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5",
                    "bestRating": "5"
                },
                "author": {
                    "@type": "Person",
                    "name": "John Smith"
                },
                "reviewBody": "EkoSolar installed our 10kW system flawlessly. Professional team, great communication, and our energy bills dropped 85%!",
                "datePublished": "2025-01-10"
            },
            {
                "@type": "Review",
                "reviewRating": {
                    "@type": "Rating",
                    "ratingValue": "5",
                    "bestRating": "5"
                },
                "author": {
                    "@type": "Person",
                    "name": "Sarah Johnson"
                },
                "reviewBody": "Emergency repair service was incredible. They fixed our inverter issue within 2 hours of calling. Highly recommend!",
                "datePublished": "2025-01-08"
            }
        ],
        "sameAs": [
            "https://www.facebook.com/ekosolarpros",
            "https://www.instagram.com/ekosolarpros",
            "https://www.linkedin.com/company/ekosolarpros",
            "https://www.youtube.com/@ekosolarpros"
        ],
        "potentialAction": {
            "@type": "OrderAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://ekosolarpros.com/#contact",
                "inLanguage": "en-US",
                "actionPlatform": [
                    "http://schema.org/DesktopWebPlatform",
                    "http://schema.org/IOSPlatform",
                    "http://schema.org/AndroidPlatform"
                ]
            },
            "result": {
                "@type": "Order",
                "name": "Solar Installation Quote"
            }
        }
    },

    // Service Schema for Solar Installation
    solarInstallationService: {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": "https://ekosolarpros.com/#solar-installation",
        "serviceType": "Solar Panel Installation",
        "provider": {
            "@id": "https://ekosolarpros.com/#business"
        },
        "areaServed": {
            "@type": "State",
            "name": "Georgia"
        },
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Solar Installation Packages",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "name": "Residential Solar Installation",
                    "description": "Complete home solar system installation with 25-year warranty",
                    "priceCurrency": "USD",
                    "priceSpecification": {
                        "@type": "PriceSpecification",
                        "minPrice": "15000",
                        "maxPrice": "45000",
                        "priceCurrency": "USD"
                    }
                },
                {
                    "@type": "Offer",
                    "name": "Commercial Solar Installation",
                    "description": "Large-scale commercial solar installations",
                    "priceCurrency": "USD",
                    "priceSpecification": {
                        "@type": "PriceSpecification",
                        "minPrice": "50000",
                        "priceCurrency": "USD"
                    }
                }
            ]
        }
    },

    // FAQ Schema
    faqSchema: {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
            {
                "@type": "Question",
                "name": "How much does solar installation cost in Georgia?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Solar installation in Georgia typically costs between $15,000-$45,000 for residential systems before incentives. With the 30% federal tax credit and Georgia's net metering programs, most homeowners see a final cost of $10,500-$31,500. The exact cost depends on system size, roof type, and energy needs."
                }
            },
            {
                "@type": "Question",
                "name": "What solar incentives are available in Georgia in 2025?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Georgia offers several solar incentives in 2025: 30% Federal Tax Credit (expires Dec 2025), Net Metering programs through Georgia Power, Property tax exemption for solar equipment, and various local utility rebates. These incentives can reduce your solar investment by 30-40%."
                }
            },
            {
                "@type": "Question",
                "name": "How long does solar panel installation take?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Most residential solar installations in Georgia take 1-3 days for the actual installation. The complete process, including permits, utility approval, and inspection, typically takes 4-8 weeks. EkoSolar handles all permitting and paperwork to streamline the process."
                }
            },
            {
                "@type": "Question",
                "name": "Do you offer emergency solar repair services?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, EkoSolar offers 24/7 emergency solar repair services throughout Georgia. We can typically respond within 2-4 hours for urgent issues like inverter failures, storm damage, or complete system outages. Call our emergency hotline at 678-555-SOLAR."
                }
            },
            {
                "@type": "Question",
                "name": "What areas in Georgia do you service?",
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "EkoSolar services all of Georgia, with primary service areas including Atlanta, Savannah, Columbus, Augusta, Macon, Stone Mountain, and surrounding communities. We have local technicians throughout the state to ensure fast response times."
                }
            }
        ]
    },

    // BreadcrumbList Schema
    breadcrumbs: {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://ekosolarpros.com"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Services",
                "item": "https://ekosolarpros.com/#services"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": "Contact",
                "item": "https://ekosolarpros.com/#contact"
            }
        ]
    },

    // Organization Schema
    organization: {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "EkoSolarPros",
        "url": "https://ekosolarpros.com",
        "logo": "https://ekosolarpros.com/images/ekosolar-logo.png",
        "contactPoint": [
            {
                "@type": "ContactPoint",
                "telephone": "+1-678-555-SOLAR",
                "contactType": "sales",
                "areaServed": "US-GA",
                "availableLanguage": ["en"]
            },
            {
                "@type": "ContactPoint",
                "telephone": "+1-678-555-SOLAR",
                "contactType": "customer support",
                "areaServed": "US-GA",
                "availableLanguage": ["en"],
                "contactOption": "TollFree",
                "availableHours": "24/7"
            }
        ],
        "sameAs": [
            "https://www.facebook.com/ekosolarpros",
            "https://www.instagram.com/ekosolarpros",
            "https://www.linkedin.com/company/ekosolarpros"
        ]
    },

    // WebSite Schema with SearchAction
    website: {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "EkoSolarPros",
        "url": "https://ekosolarpros.com",
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://ekosolarpros.com/search?q={search_term_string}"
            },
            "query-input": "required name=search_term_string"
        }
    },

    // Product Schema for Solar Panels
    solarPanelProduct: {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Premium Solar Panel Installation",
        "description": "High-efficiency solar panel systems with 25-year warranty and professional installation",
        "brand": {
            "@type": "Brand",
            "name": "EkoSolarPros"
        },
        "offers": {
            "@type": "AggregateOffer",
            "priceCurrency": "USD",
            "lowPrice": "15000",
            "highPrice": "45000",
            "offerCount": "5",
            "availability": "https://schema.org/InStock",
            "seller": {
                "@id": "https://ekosolarpros.com/#business"
            }
        },
        "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "287"
        }
    }
};

// Function to inject all schema markup into the page
function injectSchemaMarkup() {
    const schemas = [
        EkoSolarSchema.localBusiness,
        EkoSolarSchema.solarInstallationService,
        EkoSolarSchema.faqSchema,
        EkoSolarSchema.breadcrumbs,
        EkoSolarSchema.organization,
        EkoSolarSchema.website,
        EkoSolarSchema.solarPanelProduct
    ];

    schemas.forEach((schema, index) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = `ekosolar-schema-${index}`;
        script.textContent = JSON.stringify(schema, null, 2);
        document.head.appendChild(script);
    });

    console.log('✅ Schema Markup: Injected ' + schemas.length + ' structured data blocks');
}

// Auto-inject on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectSchemaMarkup);
} else {
    injectSchemaMarkup();
}

// Export for manual use
window.EkoSolarSchema = EkoSolarSchema;