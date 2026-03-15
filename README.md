# Art Gallery — E-Commerce Website

A high-performance art e-commerce website built with Next.js 15, featuring static generation for near-instant page loads, Sanity CMS for content management, and Stripe for secure payments.

## Tech Stack

- **Framework**: Next.js 15 (App Router) + TypeScript
- **Styling**: Tailwind CSS 4 + Framer Motion
- **CMS**: Sanity.io (headless)
- **Payments**: Stripe (international) + JazzCash/EasyPaisa (PKR)
- **Database**: Supabase (Postgres)
- **Email**: Resend
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
cd art-website
npm install
```

### Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your API keys:

```bash
cp .env.local.example .env.local
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Project Structure

```
art-website/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── collections/      # Collection listing + detail
│   │   ├── artwork/[slug]/   # Artwork detail with zoom
│   │   ├── cart/             # Shopping cart
│   │   ├── checkout/         # Checkout + success page
│   │   ├── blog/             # Blog listing + posts
│   │   ├── about/            # Artist bio
│   │   ├── contact/          # Contact form
│   │   ├── commission/       # Commission request
│   │   ├── wishlist/         # Saved favorites
│   │   ├── admin/            # Order dashboard
│   │   └── api/              # API routes (Stripe, contact)
│   ├── components/           # Reusable UI components
│   ├── context/              # React Context (Cart, Currency)
│   ├── lib/                  # Utilities + service clients
│   └── types/                # TypeScript definitions
├── sanity/schemas/           # Sanity CMS content schemas
└── public/                   # Static assets
```

## Features

- **Gallery & Collections**: Organized artwork browsing with categories
- **Artwork Detail**: Image zoom, full details, add to cart
- **Shopping Cart**: Persistent cart with drawer and full page view
- **Secure Checkout**: Stripe integration, multiple payment methods
- **Multi-Currency**: USD, PKR, EUR, GBP display toggle
- **Wishlist**: Save favorites with localStorage
- **Blog/Journal**: Studio updates and process insights
- **Commission Form**: Custom artwork requests
- **Admin Dashboard**: Order tracking and analytics
- **SEO**: Sitemap, robots.txt, Open Graph metadata
- **Performance**: Static generation, image optimization, minimal JS

## Setting Up External Services

### Sanity CMS

1. Create a project at [sanity.io](https://www.sanity.io)
2. Add your project ID and dataset to `.env.local`
3. Deploy the schemas from `sanity/schemas/`

### Stripe

1. Create an account at [stripe.com](https://stripe.com)
2. Add your API keys to `.env.local`
3. Set up a webhook endpoint pointing to `/api/webhook`

### Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `src/lib/supabase.ts`
3. Add your URL and keys to `.env.local`

### Resend

1. Create an account at [resend.com](https://resend.com)
2. Add your API key to `.env.local`
3. Verify your sending domain

## Deployment

Deploy to Vercel with one click:

```bash
npm install -g vercel
vercel
```

Or connect your Git repository to Vercel for automatic deployments.
