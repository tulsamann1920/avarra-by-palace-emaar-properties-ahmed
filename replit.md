# Wealth Gap Engine

## Overview

This is a real estate wealth comparison tool that helps users visualize the financial difference between renting and buying property. The application allows users to input their current rent, available deposit, and desired timeframe to calculate projected wealth gaps and compare against available properties in Dubai. It includes lead capture functionality to collect interested buyer information and send email notifications.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **Styling**: Tailwind CSS v4 with shadcn/ui component library (New York style)
- **State Management**: TanStack React Query for server state, React useState for local state
- **Build Tool**: Vite with custom plugins for Replit integration

The frontend follows a single-page application pattern with a component-based architecture. UI components are organized in `client/src/components/ui/` using the shadcn/ui pattern with Radix UI primitives.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with tsx for development
- **API Design**: RESTful endpoints under `/api/` prefix
- **Build**: esbuild for production bundling with selective dependency bundling for cold start optimization

The server handles API routes, static file serving, and integrates with external services. In development, Vite middleware provides HMR; in production, pre-built static files are served.

### Data Storage
- **Database**: PostgreSQL via Neon Serverless
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Schema Location**: `shared/schema.ts` for shared types between client and server
- **Migrations**: Drizzle Kit with `db:push` command

The leads table stores user inquiries with property interest details, calculator inputs, and contact information.

### Landing Page Architecture
The application features a full landing page (`client/src/pages/landing.tsx`) that wraps the calculator with marketing sections:
1. Hero with embedded YouTube video (URL from config)
2. "What I Made" — 3 deliverable cards
3. "Why This Will Work" — pain/solution copy
4. Credibility — stats bar + case study
5. **Calculator** — shared component (`client/src/components/rent-vs-buy-calculator.tsx`)
6. "How It Works" — 4 numbered steps
7. Book A Call — Calendly embed
8. FAQ — accordion with 6 questions
9. About Me — Tulsa Mann bio + social links
10. Final CTA — Calendly link

The calculator is extracted into a shared component used by both the landing page and the standalone calculator page (`client/src/pages/wealth-gap.tsx`).

### Configuration Architecture
The application uses a centralized configuration file (`client/src/config.ts`) for all dynamic content. The config is organized into two domains:

**Per-Prospect Fields** (change for each developer/project):
- `prospectName` — prospect's first name, used in personalised greetings throughout
- `developer.name`, `developer.logo`, `developer.favicon`, `developer.tagline`, `developer.brandColor`
- `project.headline`, `project.subHeadline`, `project.description` — used in the calculator component
- `walkthroughVideoUrl` — YouTube embed URL for the landing page hero
- `localization` — currency, locale settings
- `assumptions` — mortgage rate, term, rent inflation, property appreciation
- `data[]` — property listings with id, price, beds, image, monthlyCharge, location

**TPL Brand Fields** (`tpl.*`, same across all prospects):
- `calendlyUrl` — Calendly booking link used in nav, CTA buttons, and embed
- `tpl.logo` — The Property Look logo URL
- `tpl.about` — name, title, bio, photo, headshot, and social links (linkedin, instagram, website)
- `tpl.credibility.stats[]` — array of {value, label} for the stats bar
- `tpl.credibility.caseStudy` — name, metrics[], and description
- `tpl.faq[]` — array of {q, a} for the FAQ accordion

All landing page content is now config-driven. No hardcoded strings remain in the landing page component.

## External Dependencies

### Database
- **Neon Serverless PostgreSQL**: Cloud-hosted PostgreSQL with serverless driver (`@neondatabase/serverless`)
- **Connection**: Via `DATABASE_URL` environment variable

### Email Service
- **Resend**: Transactional email service for lead notifications
- **Integration**: Via Replit Connectors API for credential management
- **Usage**: Sends formatted HTML emails to configured notification address when leads are captured

### Third-Party Libraries
- **Radix UI**: Accessible component primitives for the UI library
- **TanStack Query**: Data fetching and caching
- **Zod**: Runtime type validation for API inputs
- **date-fns**: Date manipulation utilities

### Replit-Specific Integrations
- **Vite plugins**: Runtime error overlay, cartographer, dev banner
- **Meta images plugin**: Dynamic OpenGraph image URL injection
- **Connectors**: Resend email service credentials via Replit's connector system