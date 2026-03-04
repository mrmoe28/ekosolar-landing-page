// ============================================================================
// Site Configuration
// ============================================================================

export interface SiteConfig {
  title: string;
  description: string;
  language: string;
}

export const siteConfig: SiteConfig = {
  title: "EKO SOLAR PROS | Atlanta's Solar Troubleshooting Specialist",
  description: "EKO SOLAR PROS specializes in solar panel repair, troubleshooting, and maintenance for existing systems in Atlanta, GA. We fix solar systems installed by any company and process RMA warranty claims. Get your solar working again!",
  language: "en",
};

// ============================================================================
// Navigation Configuration
// ============================================================================

export interface NavItem {
  label: string;
  href: string;
}

export interface NavigationConfig {
  logo: string;
  items: NavItem[];
}

export const navigationConfig: NavigationConfig = {
  logo: "EKO SOLAR PROS",
  items: [
    { label: "Repairs", href: "#works" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ],
};

// ============================================================================
// Hero Section Configuration
// ============================================================================

export interface HeroConfig {
  title: string;
  subtitle: string;
  backgroundImage: string;
  servicesLabel: string;
  copyright: string;
}

export const heroConfig: HeroConfig = {
  title: "EKO SOLAR PROS",
  subtitle: "Solar Not Working? We'll Fix It.",
  backgroundImage: "/hero-main.jpg",
  servicesLabel: "Repair | Troubleshoot | Restore",
  copyright: "© 2026 EKO SOLAR PROS Atlanta",
};

// ============================================================================
// About Section Configuration
// ============================================================================

export interface AboutConfig {
  titleLine1: string;
  titleLine2: string;
  description: string;
  image1: string;
  image1Alt: string;
  image2: string;
  image2Alt: string;
  authorImage: string;
  authorName: string;
  authorBio: string;
}

export const aboutConfig: AboutConfig = {
  titleLine1: "We specialize in fixing solar systems that others can't,",
  titleLine2: "bringing dead panels back to life and restoring your energy savings.",
  description: "Founded in 2015, EKO SOLAR PROS has become Atlanta's trusted name in solar repair and troubleshooting. While other companies only install new systems, we focus on what happens after the installation - keeping your investment working. We've repaired over 1,500 solar systems across Georgia, many installed by other companies who refused to help. Our certified technicians diagnose and fix inverter failures, panel issues, wiring problems, and monitoring glitches. We also process RMA warranty equipment replacement claims, handling all the paperwork to get your faulty equipment replaced at no cost. No matter who installed your solar, we'll get it producing again.",
  image1: "/about-1.jpg",
  image1Alt: "EKO SOLAR PROS technician diagnosing solar system issues",
  image2: "/about-2.jpg",
  image2Alt: "Close-up of solar panel inspection",
  authorImage: "",
  authorName: "",
  authorBio: "",
};

// ============================================================================
// Works Section Configuration
// ============================================================================

export interface WorkItem {
  id: number;
  title: string;
  category: string;
  image: string;
}

export interface WorksConfig {
  title: string;
  subtitle: string;
  projects: WorkItem[];
}

export const worksConfig: WorksConfig = {
  title: "Recent Repairs",
  subtitle: "Solar systems we've brought back to life across Atlanta and Georgia.",
  projects: [
    { 
      id: 1, 
      title: "Inverter Replacement - Buckhead", 
      category: "Inverter Repair", 
      image: "/work-1.jpg" 
    },
    { 
      id: 2, 
      title: "Commercial System Restore - Midtown", 
      category: "Commercial Repair", 
      image: "/work-2.jpg" 
    },
    { 
      id: 3, 
      title: "Battery Integration Fix - Alpharetta", 
      category: "Battery Repair", 
      image: "/work-3.jpg" 
    },
    { 
      id: 4, 
      title: "Panel Replacement - Decatur", 
      category: "Panel Repair", 
      image: "/work-4.jpg" 
    },
  ],
};

// ============================================================================
// Services Section Configuration
// ============================================================================

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface ServicesConfig {
  title: string;
  subtitle: string;
  services: ServiceItem[];
}

export const servicesConfig: ServicesConfig = {
  title: "Our Repair Services",
  subtitle: "Expert troubleshooting and repair for any solar system, regardless of who installed it.",
  services: [
    { 
      id: "01", 
      title: "System Diagnostics", 
      description: "Comprehensive analysis of your entire solar system. We identify why your panels aren't producing, using professional testing equipment to check inverters, panels, wiring, and monitoring systems. You'll get a clear diagnosis and repair plan.", 
      image: "/service-1.jpg" 
    },
    { 
      id: "02", 
      title: "Inverter Repair & Replacement", 
      description: "Inverters are the most common failure point. We repair or replace all major brands including SolarEdge, Enphase, SMA, and Fronius. Our technicians carry common parts for same-day repairs when possible.", 
      image: "/service-2.jpg" 
    },
    { 
      id: "03", 
      title: "Panel Replacement & Repair", 
      description: "Cracked, damaged, or underperforming panels? We replace individual panels or entire arrays, matching specifications to maintain system warranty and performance. We work with all panel manufacturers.", 
      image: "/service-3.jpg" 
    },
    { 
      id: "04", 
      title: "Monitoring & Electrical Fixes", 
      description: "Can't see your production data? We fix monitoring systems, app connections, and electrical issues including faulty wiring, grounding problems, and disconnects. Get your system visibility back.", 
      image: "/service-4.jpg" 
    },
    { 
      id: "05", 
      title: "RMA Warranty Claims", 
      description: "We handle all paperwork and processing for manufacturer warranty claims. If your inverter or panels are under warranty, we'll get them replaced at no equipment cost to you. We work directly with SolarEdge, Enphase, Tesla, and all major manufacturers.", 
      image: "/service-1.jpg" 
    },
  ],
};

// ============================================================================
// Testimonials Section Configuration
// ============================================================================

export interface TestimonialItem {
  id: number;
  name: string;
  title: string;
  quote: string;
  image: string;
}

export interface TestimonialsConfig {
  title: string;
  testimonials: TestimonialItem[];
}

export const testimonialsConfig: TestimonialsConfig = {
  title: "What Our Customers Say",
  testimonials: [
    { 
      id: 1, 
      name: "Jennifer Williams", 
      title: "Homeowner, Sandy Springs", 
      quote: "My solar stopped working 3 years after installation. The original installer went out of business. EKO SOLAR PROS diagnosed a failed inverter within an hour and had it replaced the same week. My panels are producing again and I'm saving $250/month!", 
      image: "/testimonial-1.jpg" 
    },
    { 
      id: 2, 
      name: "Robert Chen", 
      title: "Business Owner, Atlanta", 
      quote: "Our commercial solar system was underperforming by 40%. The installer said everything was fine. EKO SOLAR PROS found faulty wiring and replaced 12 panels. Production is now higher than when it was new. These guys know their stuff.", 
      image: "/testimonial-2.jpg" 
    },
    { 
      id: 3, 
      name: "Amanda Davis", 
      title: "Homeowner, Marietta", 
      quote: "My monitoring app stopped working and I had no idea if my panels were producing. EKO SOLAR PROS fixed the communication issue and discovered my inverter was failing. They saved me months of lost production. Highly recommend!", 
      image: "/testimonial-3.jpg" 
    },
  ],
};

// ============================================================================
// Pricing Section Configuration
// ============================================================================

export interface PricingPlan {
  id: number;
  name: string;
  price: number;
  unit: string;
  featured: boolean;
  features: string[];
}

export interface PricingConfig {
  title: string;
  subtitle: string;
  ctaButtonText: string;
  plans: PricingPlan[];
}

export const pricingConfig: PricingConfig = {
  title: "Solar Troubleshooting Specialist",
  subtitle: "Transparent pricing for diagnostics and repairs. We work on all brands and systems installed by any company. We also process RMA warranty claims for equipment replacement at no cost to you.",
  ctaButtonText: "Schedule Service",
  plans: [
    { 
      id: 1, 
      name: "Diagnostic Service", 
      price: 400, 
      unit: "site visit & diagnostic", 
      featured: false, 
      features: [
        "Complete system inspection",
        "Inverter performance test",
        "Panel output analysis",
        "Electrical connection check",
        "Monitoring system review",
        "Written diagnosis report",
        "Repair estimate provided",
        "RMA warranty claim processing"
      ] 
    },
    { 
      id: 2, 
      name: "Standard Repair", 
      price: 499, 
      unit: "starting price", 
      featured: true, 
      features: [
        "Includes diagnostic service",
        "Inverter repair/replacement",
        "Panel replacement (1-4 panels)",
        "Wiring and connection fixes",
        "Monitoring system repair",
        "90-day repair warranty",
        "Same-day service when possible",
        "All major brands supported"
      ] 
    },
    { 
      id: 3, 
      name: "Major System Restore", 
      price: 1299, 
      unit: "starting price", 
      featured: false, 
      features: [
        "Includes diagnostic service",
        "Complete inverter replacement",
        "Multiple panel replacement",
        "Full electrical rework",
        "System reconfiguration",
        "1-year repair warranty",
        "Priority scheduling",
        "Performance guarantee"
      ] 
    },
  ],
};

// ============================================================================
// FAQ Section Configuration
// ============================================================================

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQConfig {
  title: string;
  faqs: FAQItem[];
}

export const faqConfig: FAQConfig = {
  title: "Common Questions",
  faqs: [
    { 
      question: "Do you work on systems installed by other companies?", 
      answer: "Absolutely! Most of our repairs are on systems we didn't install. We work on all brands and systems regardless of who originally installed them. Many solar companies go out of business or stop providing service - we're here to fill that gap and keep your system running."
    },
    { 
      question: "How do I know if my solar system isn't working?", 
      answer: "Signs your system needs attention: higher electric bills than expected, monitoring app showing zero or low production, error messages on your inverter, physical damage to panels, or your system hasn't been cleaned in over a year. If you're unsure, our $400 site visit and diagnostic will tell you exactly what's happening."
    },
    { 
      question: "What is RMA warranty claim processing?", 
      answer: "RMA (Return Merchandise Authorization) is the process of getting faulty equipment replaced under manufacturer warranty. We handle all the paperwork, documentation, and communication with manufacturers like SolarEdge, Enphase, Tesla, and others. If your inverter or panels are under warranty, we process the claim at no additional cost - you only pay for our diagnostic and installation labor."
    },
    { 
      question: "What brands do you repair?", 
      answer: "We repair all major solar brands including SolarEdge, Enphase, SMA, Fronius, Tesla, SunPower, LG, Panasonic, Canadian Solar, Q Cells, and many more. Our technicians are trained on multiple platforms and carry common replacement parts for faster repairs."
    },
    { 
      question: "Will repairs void my warranty?", 
      answer: "No. We use manufacturer-approved parts and follow proper procedures to maintain your existing warranties. In many cases, we can work directly with manufacturers for warranty claims, potentially saving you money on covered repairs."
    },
    { 
      question: "How quickly can you fix my system?", 
      answer: "We offer same-week diagnostic appointments. Many common repairs like inverter replacements can be completed same-day or next-day if we have parts in stock. For specialty parts, we typically get them within 3-5 business days. Emergency service is available for critical issues."
    },
    { 
      question: "Why did my solar system stop working?", 
      answer: "Common causes include inverter failure (most common), panel damage from weather, loose electrical connections, monitoring system issues, or shading from new tree growth. Our diagnostic service identifies the exact cause and provides a clear repair plan with upfront pricing."
    },
  ],
};

// ============================================================================
// Blog Section Configuration
// ============================================================================

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  image: string;
  category: string;
}

export interface BlogConfig {
  title: string;
  subtitle: string;
  allPostsLabel: string;
  readMoreLabel: string;
  readTimePrefix: string;
  posts: BlogPost[];
}

export const blogConfig: BlogConfig = {
  title: "Solar Repair Insights",
  subtitle: "Learn about common solar problems, maintenance tips, and when to call a professional.",
  allPostsLabel: "All Articles",
  readMoreLabel: "Read More",
  readTimePrefix: "Read ",
  posts: [
    { 
      id: 1, 
      title: "5 Signs Your Solar System Needs Repair", 
      excerpt: "Learn the warning signs that your solar panels aren't working properly. From rising electric bills to error codes, we cover what to watch for and when to call a professional.", 
      readTime: "5 min", 
      date: "Feb 28, 2026", 
      image: "/blog-1.jpg", 
      category: "Troubleshooting" 
    },
    { 
      id: 2, 
      title: "Why Do Solar Inverters Fail?", 
      excerpt: "Inverters are the heart of your solar system and the most common failure point. Understand why they fail, how to prevent issues, and what replacement options are available.", 
      readTime: "6 min", 
      date: "Feb 15, 2026", 
      image: "/blog-2.jpg", 
      category: "Repairs" 
    },
  ],
};

// ============================================================================
// Contact Section Configuration
// ============================================================================

export interface ContactFormOption {
  value: string;
  label: string;
}

export interface ContactConfig {
  title: string;
  subtitle: string;
  nameLabel: string;
  emailLabel: string;
  projectTypeLabel: string;
  projectTypePlaceholder: string;
  projectTypeOptions: ContactFormOption[];
  messageLabel: string;
  submitButtonText: string;
  image: string;
}

export const contactConfig: ContactConfig = {
  title: "Get Your Solar Working Again",
  subtitle: "Schedule a diagnostic appointment or tell us about your solar problem. We repair all brands and systems.",
  nameLabel: "Name *",
  emailLabel: "Email *",
  projectTypeLabel: "Service Needed",
  projectTypePlaceholder: "Select service type...",
  projectTypeOptions: [
    { value: "diagnostic", label: "Site Visit & Diagnostic ($400)" },
    { value: "inverter", label: "Inverter Issue" },
    { value: "panels", label: "Panel Problems" },
    { value: "monitoring", label: "Monitoring/Connection Issue" },
    { value: "warranty", label: "RMA Warranty Claim" },
    { value: "other", label: "Other / Not Sure" },
  ],
  messageLabel: "Describe Your Issue (Optional)",
  submitButtonText: "Schedule Service",
  image: "/contact.jpg",
};

// ============================================================================
// Footer Configuration
// ============================================================================

export interface FooterLink {
  label: string;
  href: string;
  icon?: string;
}

export interface FooterConfig {
  marqueeText: string;
  marqueeHighlightChars: string[];
  navLinks1: FooterLink[];
  navLinks2: FooterLink[];
  ctaText: string;
  ctaHref: string;
  copyright: string;
  tagline: string;
}

export const footerConfig: FooterConfig = {
  marqueeText: "We Fix Solar Systems That Others Wont",
  marqueeHighlightChars: ["F", "S", "O", "W"],
  navLinks1: [
    { label: "Home", href: "#hero" },
    { label: "Repairs", href: "#works" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
  ],
  navLinks2: [
    { label: "Instagram", href: "#", icon: "Instagram" },
    { label: "Facebook", href: "#", icon: "Dribbble" },
    { label: "LinkedIn", href: "#", icon: "Dribbble" },
  ],
  ctaText: "Schedule Repair",
  ctaHref: "#contact",
  copyright: "© 2026 EKO SOLAR PROS. All rights reserved.",
  tagline: "Atlanta's Solar Repair Experts",
};
