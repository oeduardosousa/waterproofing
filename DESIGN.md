# DESIGN.md — Waterproofing (empresa fictícia, projeto de portfólio)

Direction: **Deep Navy + Safety Amber**. A calm, premium, industrial look for adults and entrepreneurs, on phones first. Cinematic motion, but the quote path (WhatsApp) is never in doubt.

All values are mirrored in `src/styles/tokens.css`. Pages use token names, never raw values. Copy is pt-BR. Placeholder content is labelled "sample" / "exemplo".

## 1. Visual direction

- **Feeling:** dependable, precise, quietly bold. Water is the enemy; the site feels dry, sealed and confident.
- **Gap we fill:** the niche is product-led and cluttered (catalog grids, loud brand colours, cookie banners over heroes). We pair a premium editorial look with one clear action.
- **Principles taken from research (no assets or layouts copied):**
  1. Floating WhatsApp button and finding services by area (roof, basement, tank).
  2. One honest worksite photo in warm light, plus one contrasting accent word per heading.
  3. A short, purposeful loader.
  4. Pinned sections telling one idea per scroll.
- **Avoid:** purple/blue gradients, glassmorphism, centred everything, three identical cards, emoji icons, gradient text, stock "handshake" imagery.
- **Signature:** deep navy sections, a single amber accent, a serif-italic accent word, hairline rules, and a thin amber scroll-progress bar.

## 2. Color

Light surfaces are warm paper; dark surfaces are navy. Both are first-class (hero, process and footer are dark; content sections alternate).

| Token | Value | Role |
|---|---|---|
| `--ink-950` | `#07141F` | Deepest surface (footer, loader) |
| `--ink-900` | `#0B1F33` | Primary dark surface; text on light |
| `--ink-800` | `#12304D` | Raised dark surface, cards on dark |
| `--ink-700` | `#1D4468` | Borders and hover on dark |
| `--ink-600` | `#46627C` | Secondary text on light |
| `--ink-300` | `#9FB0C1` | Secondary text on dark |
| `--ink-200` | `#CBD5DF` | Borders on light |
| `--paper` | `#F6F3EC` | Primary light surface |
| `--paper-2` | `#ECE7DC` | Alternate light surface, input fill |
| `--white` | `#FFFFFF` | Cards on paper |
| `--amber-500` | `#F2A900` | **Only accent**: primary CTA fill, progress bar, key highlights |
| `--amber-300` | `#FFC933` | CTA hover; accent marks on dark |
| `--teal-700` | `#0F6B6B` | Water / sealed state, links on light |
| `--teal-300` | `#4FD1C5` | Links and sealed state on dark |
| `--success` | `#1F7A4D` | Success text on light |
| `--warning` | `#8A5A00` | Warning text on light |
| `--error` | `#B3261E` | Error text on light (`#FF8A80` on dark) |

Verified contrast: ink-900 on paper 15.1:1; ink-600 on paper 5.7:1; ink-900 on amber-500 8.3:1; ink-300 on ink-900 7.5:1; teal-700 on paper 5.7:1; teal-300 on ink-900 9.0:1; success 4.8:1; warning 5.4:1; error 5.9:1.

Rules:
- Amber is a **fill**, never body text on paper (it fails contrast). Text on amber is always `--ink-900`.
- One amber element per viewport as the dominant action. No amber decoration beyond that.
- Photography carries the colour; UI stays navy, paper and amber.

## 3. Typography

Both families are open-licence (SIL OFL) and **self-hosted** (`@fontsource-variable`), `font-display: swap`, preloaded for the heading weight. Full pt-BR accent coverage.

- **Sans: Schibsted Grotesk** (variable, 400 to 800): headings, body, UI.
- **Serif accent: Instrument Serif Italic**: one accent word per heading only (e.g. "Obras feitas para *durar*"). Never body text.

Fluid scale (`clamp`), line height and weight:

| Token | Size (mobile to desktop) | Line height | Weight | Use |
|---|---|---|---|---|
| `--text-display` | 2.75rem to 6.5rem | 0.98 | 700, tracking -0.03em | Hero headline |
| `--text-h1` | 2.25rem to 4.5rem | 1.02 | 700 | Page titles |
| `--text-h2` | 1.75rem to 3rem | 1.08 | 650 | Section titles |
| `--text-h3` | 1.25rem to 1.75rem | 1.2 | 600 | Cards, steps |
| `--text-body-lg` | 1.125rem to 1.25rem | 1.55 | 400 | Lead paragraphs |
| `--text-body` | 1rem | 1.6 | 400 | Body (never below 16px) |
| `--text-small` | 0.875rem | 1.5 | 500 | Captions, labels |
| `--text-eyebrow` | 0.75rem | 1.2 | 600, uppercase, +0.12em | Section eyebrows |

- Reading measure 60 to 72 characters (`max-width: 68ch`).
- Numerals use tabular figures in process steps and any data. Do not show numbers that are not real; sample figures are labelled "exemplo".

## 4. Spacing and layout

- **Scale (4px base):** `--space-1` 4, 2 8, 3 12, 4 16, 5 24, 6 32, 7 48, 8 64, 9 96, 10 144.
- **Section spacing:** `clamp(4rem, 10vw, 9rem)` vertical.
- **Grid:** 12 columns desktop, 4 on mobile, gutter 16 (mobile) / 24 (desktop). Page gutter 16px mobile, 32px tablet, 48px desktop.
- **Max content width:** 1280px; text blocks 68ch; full-bleed allowed for photography.
- **Composition:** left-aligned and asymmetric. Large headline offset against a small descriptive column. Alternate dark and paper sections. Hairline rules and large numerals structure content instead of boxes.
- **Home order:** hero, services by area, process (pinned), projects with before/after, FAQ, contact CTA.

## 5. Shape and depth

- **Radius:** `--radius-sm` 4, `--radius-md` 8, `--radius-pill` 999 (buttons only). Photography is rectangular or clip-path masked; no heavy rounding.
- **Borders:** 1px hairlines (`--ink-200` on light, `--ink-700` on dark).
- **Shadow:** none by default. One shadow `--shadow-lift: 0 12px 32px -12px rgb(7 20 31 / 0.35)` for floating UI (WhatsApp button, menus).

## 6. Components

- **Primary button:** amber fill, ink-900 text, pill, 52px min height, 600 weight, arrow icon. Hover: amber-300 and arrow nudge 4px. Press: scale(0.97). Focus: 3px offset ring in `--ink-900` on light, `--amber-300` on dark. Disabled: 40% opacity, no hover.
- **Secondary:** transparent, 1.5px ink border (or paper border on dark). Hover fills ink or paper with inverted text.
- **Quiet:** text with animated underline, teal link colour.
- **WhatsApp CTA:** the primary action sitewide (`wa.me` with a prefilled pt-BR message). Fixed bottom-right button on mobile and desktop, 56px, amber with ink glyph, safe-area aware, never covering the footer legal text. A full-width WhatsApp bar also ends every page.
- **Navigation:** transparent over the hero, then solid navy after scroll. Slim bar with logo, 4 links, WhatsApp CTA. Mobile: full-screen menu with staggered links. Thin amber progress bar under it.
- **Service cards:** big numeral, serif-italic name accent, area tag, photo. Not equal-weight thirds: one feature card plus a list.
- **Process (pinned):** numbered steps beside a sticky photo that changes per step.
- **Before/after slider:** drag handle 44px, keyboard operable (arrow keys), labelled "Antes" / "Depois", photo only, tagged "exemplo".
- **FAQ:** native `details`, hairline separators, plus icon rotates.
- **Inputs:** none required (contact is WhatsApp). If one is ever added: 52px, paper-2 fill, 1px border, 2px teal focus, visible labels, errors in text plus icon.
- **Footer:** ink-950, large wordmark, social links, "empresa fictícia" note.
- **Icons:** one set, Lucide, 1.5px stroke, 24px. No emoji.
- **Labels:** every placeholder carries a small "exemplo" tag.

## 7. Imagery

Real photographs only: no illustrations, no AI-generated images. Free stock (Unsplash/Pexels), licence checked and recorded per image, labelled "exemplo", replaceable later with the owner's photos.

- **Subjects:** applicators working on roofs and slabs, basement and tank interiors, parking decks, facades, membrane/coating application close-ups, clean finished surfaces, water beading, site managers with tablets.
- **People:** adults only, working, in PPE, candid. No posed handshakes, no cartoons, no children.
- **Framing:** wide establishing shots for heroes (space for the headline on the left); tight material and texture details for rhythm; before/after pairs shot from the same angle.
- **Lighting:** natural daylight or low golden-hour light, hard-edged shadows, wet surfaces catching highlights.
- **Single colour grade:** cool shadows pushed toward navy, warm highlights (amber-leaning), contrast slightly up, saturation down about 15%, no heavy vignette. Apply a consistent treatment (same preset or CSS/Sharp pipeline) to every photo so mixed sources feel like one shoot.
- **Delivery:** Astro image pipeline (AVIF/WebP, responsive `srcset`), explicit width/height, descriptive pt-BR alt text, hero preloaded, the rest lazy.

## 8. Responsive rules

- **Mobile-first**, breakpoints at 640, 900, 1200.
- Touch targets at least 48px, WhatsApp always reachable in one tap.
- Pinned sections collapse to normal flow below 900px or when the viewport is shorter than 620px; stacked step cards replace the sticky photo.
- Hover and cursor effects exist only under `(hover: hover) and (pointer: fine)`.
- Use `100svh` / `dvh` for heroes (iOS Safari toolbar). No fixed-attachment backgrounds. Test iOS Safari and Android Chrome.
- Heavy parallax is reduced on touch; photography is never taller than needed.

## 9. Accessibility

- Text contrast at least 4.5:1 (3:1 large); focus ring at least 3:1 against neighbours.
- Visible `:focus-visible` on every interactive element; skip link; logical heading order; landmarks.
- `lang="pt-BR"`. Meaningful alt text; decorative images `alt=""`.
- Slider, menu, and accordion are keyboard and screen-reader operable.
- Animated text keeps real text in the DOM (split into spans with an `aria-label` on the parent), so it reads normally.
- Nothing essential is conveyed by colour alone. No autoplaying audio. Videos, if any, are muted, short and paused under reduced motion.
- Cookie/consent: no analytics, so no banner is planned; if added later, default to decline.

## 10. Motion

Principle (emil-design-eng): motion explains and rewards; it never blocks. UI feedback is fast (150 to 250ms), cinematic moments are longer (0.8 to 1.4s) and run once. Animate only `transform`, `opacity`, `clip-path`; never layout properties. Start entrances from `scale(0.95)` or offset, never from nothing. Exits are faster than entrances.

**Tokens:** `--ease-out: cubic-bezier(0.22, 1, 0.36, 1)`, `--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)`, durations `--dur-fast` 150ms, `--dur-base` 250ms, `--dur-slow` 900ms.

| Moment | What happens | Library |
|---|---|---|
| **Loading animation** | First visit only, at most 1.2s, skippable. Navy screen, wordmark letters rise in a mask, an amber line draws across, then the screen wipes up to the hero. Content is already in the DOM; if JS fails, the loader is never shown. Skipped on repeat visits in the session. | GSAP timeline |
| **Hero intro** | Full-bleed photo reveals with an `inset()` clip-path opening from the centre while scaling 1.12 to 1. Headline lines rise out of overflow masks (stagger 0.08s), the serif accent word fades in last, then CTA and WhatsApp button. | GSAP timeline, SplitText-style manual line splitting (no paid plugin) |
| **Scroll-driven storytelling** | Hero photo scrubs: slight zoom, navy overlay deepens, headline translates up as the user scrolls out. Services then enter section by section. | GSAP ScrollTrigger (scrub) |
| **Pinned sections** | The process section pins for roughly four screens: steps advance in a sticky column while the photo cross-clips between stages. A thin progress rail shows position. Desktop and tall viewports only; stacked on mobile. | ScrollTrigger (pin, snap off) |
| **Text reveals** | Headings: line-by-line mask rise on enter, once. Lead paragraphs: fade plus 16px rise. Large numerals count up only if the figure is real. | ScrollTrigger + GSAP |
| **Parallax** | Photos move 8 to 12% against their frames, clipped by the frame. Disabled below 900px width and under reduced motion. | ScrollTrigger (scrub) |
| **Cursor effects** | Desktop fine-pointer only. A 10px amber dot follows with lag; it grows to a "Ver" label over project images and to a "Arraste" label over the slider. Hidden on touch. | GSAP `quickTo` |
| **Hover states** | Buttons: fill shift and 4px arrow nudge; cards: photo scales 1.04 over 600ms with an amber underline drawn; links: underline wipes in from the left. All under `(hover: hover)`. | CSS transitions |
| **Page transitions** | Navy panel wipes up (400ms), new page content rises. Falls back to an instant swap if unsupported. | Astro View Transitions + GSAP |
| **Before/after slider** | Handle follows the pointer with direct 1:1 tracking, no easing lag; on release it settles with a short ease-out. | Pointer events + CSS clip-path |
| **Scroll progress bar** | 3px amber line under the nav. | ScrollTrigger |
| **Smooth scroll** | **Not** used on touch devices. If added on desktop only, it syncs with ScrollTrigger. Pending your decision. | Lenis (optional) |

**Reduced motion** (`prefers-reduced-motion: reduce`): no loader, pinning, parallax, scrubbing, cursor follower or page wipes. Sections simply fade in (200ms) and the slider remains. Implemented via `gsap.matchMedia()` so animations are never created at all.

**Performance guardrails:** one ScrollTrigger refresh after images load; `will-change` only during animation; lazy-init heavy sections; target 60fps on mid-range Android; Lighthouse mobile 90+.

## 11. Content rules reflected in design

- All sample copy, projects, articles and figures are marked "exemplo".
- No invented testimonials, certifications or numbers; trust comes from process clarity, real-looking project case structure (marked sample) and a visible, honest "empresa fictícia" note.
