# BRIEF

## Business
Fictional waterproofing (impermeabilização) company serving residential and commercial clients in Brazil. Portfolio project: no real company, customers, or claims.

## Audience
Adults and entrepreneurs: business owners, building managers, developers, plus homeowners. Mostly on phones (iOS and Android).

## Goals
1. Convert visitors to a WhatsApp quote request.
2. Showcase craft: clean design with bold, cinematic animation.
Both weigh equally.

## Offers (sample)
Typical services such as roofs/slabs, basements, reservoirs/tanks, facades, and parking decks. All labeled "sample"; final list to be confirmed.

## Pages
- Home (hero, services, process, projects, FAQ, contact)
- Service pages (one per service)
- Projects gallery (sample case studies)
- About and Blog (sample articles)

## Content
- Language: pt-BR.
- Photography: real photos from free stock (Unsplash/Pexels), license-checked, labeled sample. Replace with the user's photos later if provided.
- No invented testimonials, certifications, numbers, or claims. Any placeholder text is labeled "sample".

## Features
- Cinematic, non-3D hero (no 3D models; no generic hero). Approach decided at design time, e.g. full-bleed photo with scroll-driven reveals and masked/clip-path transitions.
- Before/after photo slider on projects.
- WhatsApp button with prefilled message (wa.me link), plus social media links.
- Responsive, accessible, prefers-reduced-motion respected.
- No database, SQL, checkout, or payments. No analytics unless added later.

## Design
Clean and bold. Palette: start from the sector norm (blues/teals, deep navy, white/grey) but push it somewhere distinctive rather than the standard look. Final world defined via Impeccable shape/new-work.

## Stack (approved by recommendation)
- **Astro** (static output) with content collections for services, projects, and blog.
- **GSAP + ScrollTrigger** for animation (free, mature, reliable on iOS Safari), applied per emil-design-eng.
- Plain CSS (modern, custom properties); minimal JS.
- Image optimization via Astro's built-in image pipeline.

Why: the site is multi-page with a blog and repeated layouts, so a static-site framework avoids duplication; it ships almost no JS by default (fast on mobile); no server or database is needed; GSAP delivers the cinematic motion. Plain HTML would be simplest but gets repetitive across many pages; Next.js adds runtime complexity and cost without benefit.

## Deployment
Cloudflare Pages (free, static, global CDN) on the default `*.pages.dev` URL; no custom domain yet. Repo: github.com/oeduardosousa/waterproofing (branch `main`). Deploys happen only with user approval.

## Acceptance criteria
- Works on iOS Safari, Android Chrome, and current Chrome/Firefox/Safari/Edge.
- WhatsApp button opens chat with prefilled message on mobile and desktop.
- Animations run smoothly and are replaced by simple fades/static when prefers-reduced-motion is on.
- All images are real photographs with alt text; all placeholder content marked "sample".
- Lighthouse mobile: Performance, Accessibility, and Best Practices high (target 90+).
- No secrets or .env files in the repo; build passes.

## Assumptions
- Company name, services, city, WhatsApp number, and social URLs are placeholders until provided.
- Palette and hero concept are not yet chosen.
- Cloudflare Pages is the host (GitHub Pages is the fallback).

## Open questions
- Company name, brand voice, and logo?
- Real WhatsApp number and social handles?
- Final hero concept and palette?
- Any real photos to supply instead of stock?
- Custom domain later?
