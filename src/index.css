@import url('https://fonts.googleapis.com/css2?family=Geist:wght@100;200;300;400;500;600;700;800;900&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 0%;
    --foreground: 0 0% 100%;
    --card: 0 0% 6%;
    --card-foreground: 0 0% 100%;
    --popover: 0 0% 6%;
    --popover-foreground: 0 0% 100%;
    --primary: 0 0% 100%;
    --primary-foreground: 0 0% 0%;
    --secondary: 0 0% 10%;
    --secondary-foreground: 0 0% 100%;
    --muted: 0 0% 15%;
    --muted-foreground: 0 0% 60%;
    --accent: 0 100% 46%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 98%;
    --border: 0 0% 20%;
    --input: 0 0% 15%;
    --ring: 0 100% 46%;
    --radius: 0.5rem;
    
    /* Custom properties */
    --white: #ffffff;
    --black: #000000;
    --highlight: #ea0000;
    --dark-gray: #1a1a1a;
    --alpha-white: rgba(255, 255, 255, 0.5);
    --light-gray: #f1f1f1;
    --deep-black: #0a0a0a;
    --chrome-white: #f8f8f8;
    
    /* Animation easings */
    --ease-dramatic: cubic-bezier(0.87, 0, 0.13, 1);
    --ease-elastic: cubic-bezier(0.68, -0.55, 0.265, 1.55);
    --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
    --ease-expo-out: cubic-bezier(0.16, 1, 0.3, 1);
    --ease-expo-in: cubic-bezier(0.7, 0, 0.84, 0);
    --ease-back: cubic-bezier(0.34, 1.56, 0.64, 1);
    
    /* Mouse position for parallax */
    --mouse-x: 0;
    --mouse-y: 0;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  
  html {
    scroll-behavior: smooth;
  }
  
  body {
    @apply bg-black text-white;
    font-family: 'Geist', sans-serif;
    overflow-x: hidden;
  }
  
  ::selection {
    background: var(--highlight);
    color: var(--white);
  }
}

@layer components {
  /* Noise texture overlay */
  .noise-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9999;
    opacity: 0.02;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    animation: noise-animation 20s linear infinite;
  }
  
  @keyframes noise-animation {
    0%, 100% { transform: translate(0, 0); }
    10% { transform: translate(-5%, -5%); }
    20% { transform: translate(-10%, 5%); }
    30% { transform: translate(5%, -10%); }
    40% { transform: translate(-5%, 15%); }
    50% { transform: translate(-10%, 5%); }
    60% { transform: translate(15%, 0); }
    70% { transform: translate(0, 10%); }
    80% { transform: translate(-15%, 0); }
    90% { transform: translate(10%, 5%); }
  }

  /* Custom cursor */
  .custom-cursor {
    position: fixed;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(234, 0, 0, 0.3);
    pointer-events: none;
    z-index: 10000;
    mix-blend-mode: screen;
    transform: translate(-50%, -50%);
    transition: transform 0.2s ease-out, width 0.2s ease-out, height 0.2s ease-out;
  }
  
  .custom-cursor.hover {
    width: 48px;
    height: 48px;
  }

  /* Chromatic aberration effect */
  .chromatic-aberration {
    position: relative;
  }
  
  .chromatic-aberration::before,
  .chromatic-aberration::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: inherit;
    background-size: cover;
    pointer-events: none;
  }
  
  .chromatic-aberration::before {
    mix-blend-mode: multiply;
    transform: translate(-1px, 0);
    filter: url('#red-filter');
  }
  
  .chromatic-aberration::after {
    mix-blend-mode: multiply;
    transform: translate(1px, 0);
    filter: url('#blue-filter');
  }

  /* Section transitions */
  .section-reveal {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s var(--ease-smooth), transform 0.6s var(--ease-smooth);
  }
  
  .section-reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Red accent line */
  .accent-line {
    height: 2px;
    background: var(--highlight);
    animation: pulse-glow 3s ease-in-out infinite;
  }
  
  /* Interactive hover states */
  .hover-lift {
    transition: transform 0.3s var(--ease-smooth), box-shadow 0.3s var(--ease-smooth);
  }
  
  .hover-lift:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  /* Text gradient */
  .text-gradient {
    background: linear-gradient(135deg, var(--white) 0%, var(--alpha-white) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Glass effect */
  .glass {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  /* 3D perspective container */
  .perspective-container {
    perspective: 1200px;
    transform-style: preserve-3d;
  }

  /* Marquee container */
  .marquee-container {
    overflow: hidden;
    white-space: nowrap;
  }
  
  .marquee-content {
    display: inline-block;
    animation: marquee 25s linear infinite;
  }
  
  .marquee-content:hover {
    animation-play-state: paused;
  }

  @keyframes marquee {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  /* Clip path reveal */
  .clip-reveal {
    clip-path: inset(0 100% 0 0);
    animation: clip-reveal 1.2s var(--ease-expo-out) forwards;
  }
  
  @keyframes clip-reveal {
    to {
      clip-path: inset(0 0 0 0);
    }
  }

  /* Stagger animations */
  .stagger-1 { animation-delay: 0.1s; }
  .stagger-2 { animation-delay: 0.2s; }
  .stagger-3 { animation-delay: 0.3s; }
  .stagger-4 { animation-delay: 0.4s; }
  .stagger-5 { animation-delay: 0.5s; }
  .stagger-6 { animation-delay: 0.6s; }
  .stagger-7 { animation-delay: 0.7s; }
  .stagger-8 { animation-delay: 0.8s; }
}

@layer utilities {
  /* Text balance */
  .text-balance {
    text-wrap: balance;
  }
  
  /* Hide scrollbar */
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }

  /* 3D transforms */
  .preserve-3d {
    transform-style: preserve-3d;
  }
  
  .backface-hidden {
    backface-visibility: hidden;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .marquee-content {
    animation: none !important;
  }
  
  .noise-overlay {
    animation: none !important;
  }
}

/* Mobile optimizations */
@media (max-width: 768px) {
  :root {
    --display-xxl: 64px;
    --display-xl: 48px;
  }
  
  .custom-cursor {
    display: none;
  }
}
