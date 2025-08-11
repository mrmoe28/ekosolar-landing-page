# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is the EkoSolar landing page project - a solar energy company website focused on clean energy solutions, solar installations, and renewable power systems.

## CRITICAL: EkoSolar Brand Protection
**ABSOLUTE BRAND IDENTITY - NEVER MODIFY WITHOUT PERMISSION**
- **Brand Name**: EkoSolar (NEVER change to other names)
- **Theme Focus**: Solar Energy & Clean Power (NEVER change to AI, analytics, or other themes)
- **Icon System**: Zap, Sun, Battery, Leaf icons (NEVER use AI-related icons)
- **Color Palette**: Solar-themed (yellows, oranges, amber)
- **Content Focus**: Solar installation, clean energy, renewable power

## Development Commands

### Initial Project Setup
```bash
# If using Next.js (recommended for EkoSolar)
npx create-next-app@latest . --typescript --tailwind --app
pnpm install

# Alternative React setup
npx create-react-app . --template typescript
pnpm install
```

### Common Development Commands
```bash
pnpm dev                 # Start development server
pnpm build              # Build for production
pnpm start              # Start production server
pnpm lint               # Run ESLint
pnpm typecheck          # TypeScript type checking
```

### EkoSolar Specific Setup
```bash
# Install solar-themed dependencies
pnpm add lucide-react @heroicons/react
pnpm add -D @types/node

# If using database for contact forms
pnpm add @prisma/client prisma
pnpm add nodemailer @types/nodemailer
```

## Architecture Guidelines

### Recommended Tech Stack
- **Framework**: Next.js 14+ with App Router (for SEO and performance)
- **Styling**: Tailwind CSS with solar color palette
- **Icons**: Lucide React (Zap, Sun, Battery icons)
- **Forms**: React Hook Form for contact forms
- **Email**: Nodemailer for solar consultation requests
- **Database**: PostgreSQL with Prisma (if backend needed)

### Project Structure
```
/
├── app/                 # Next.js App Router pages
│   ├── page.tsx        # Homepage with solar hero section
│   ├── contact/        # Solar consultation contact
│   ├── services/       # Solar services pages
│   └── layout.tsx      # Root layout with EkoSolar branding
├── components/         # Reusable UI components
│   ├── ui/            # Base UI components
│   ├── navbar.tsx     # EkoSolar navigation
│   ├── hero.tsx       # "SOLAR POWER, SIMPLIFIED" hero
│   ├── solar-calculator.tsx  # Energy savings calculator
│   └── testimonials.tsx      # Solar customer testimonials
├── lib/               # Utilities and server functions
│   ├── gmail.ts       # Email functionality
│   └── solar-utils.ts # Solar calculation utilities
├── public/            # Static assets
│   ├── solar-images/  # Solar panel, installation images
│   └── favicon.ico    # EkoSolar favicon
└── styles/            # Global styles with solar theme
```

### Key Components Architecture

#### Protected Components (Require Permission to Modify)
- **navbar.tsx**: EkoSolar branding, solar-focused navigation
- **hero.tsx**: Solar power messaging and energy statistics
- **testimonials.tsx**: Solar customer success stories
- **All existing UI components with established branding**

#### Safe to Modify (Backend/Functionality)
- **lib/** utilities and server functions
- **app/actions/** server actions for forms
- **api/** routes for contact and calculations
- Contact form processing and email integration
- Solar calculator logic and energy estimation tools

### Content Guidelines

#### Required Solar-Themed Content
- Hero section: "SOLAR POWER, SIMPLIFIED" or similar
- Services: Solar installation, energy audits, maintenance
- Testimonials: Real solar customer stories and energy savings
- Contact: Solar consultation and quote requests
- Calculator: Solar savings and ROI calculator

#### Visual Elements
- Solar panel images and installation photos
- Energy efficiency graphics and statistics
- Clean, bright color scheme (yellows, oranges, greens)
- Professional imagery of solar installations
- Icons: Sun, Zap, Battery, Leaf, Home energy themes

## Development Workflow

### Starting Development
1. Ensure proper Node.js version (18+ recommended)
2. Install dependencies with `pnpm install`
3. Set up environment variables for email/contact forms
4. Start development server with `pnpm dev`
5. Focus on solar energy messaging and clean energy theme

### Adding New Features
1. **Backend First**: Implement server logic, APIs, calculations
2. **Preserve Branding**: Never modify existing EkoSolar branding
3. **Solar Focus**: All features should relate to solar energy services
4. **New Components**: Create isolated components rather than modifying existing
5. **Ask Before UI Changes**: Always get permission for visual modifications

### Contact Form Integration
- Use server actions for form processing
- Integrate with Gmail API for solar consultation requests
- Include fields: name, email, phone, address, energy usage
- Send automated responses about solar consultation scheduling

### Performance Considerations
- Optimize images (especially solar panel photos)
- Use Next.js Image component for responsive solar imagery
- Implement lazy loading for testimonials and service sections
- SEO optimization for solar energy keywords

## Environment Variables
```env
# Email configuration for solar consultations
GMAIL_USER=
GMAIL_PASSWORD=
CONTACT_EMAIL=

# Optional: Solar calculator API keys
SOLAR_API_KEY=
ENERGY_DATA_API_KEY=
```

## Brand Protection Protocol
- **Never change** EkoSolar name or solar energy theme
- **Always preserve** existing color schemes and solar branding
- **Get explicit permission** before modifying UI components
- **Focus on functionality** - enhance backend without changing visuals
- **Emergency restoration** instructions in global CLAUDE.md apply

This project represents a solar energy company's digital presence. All development must maintain focus on clean energy, solar installations, and renewable power solutions.