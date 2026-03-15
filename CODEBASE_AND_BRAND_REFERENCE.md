# Lifewood Webdev – Codebase & Brand Reference

Reference for migrating and developing the Lifewood site in Cursor. Aligns code structure, animations, and styling with the **Llifewood brand style guide 3.pdf**.

---

## 1. Project structure

### Stack
- **Runtime:** React 19, Vite 6, TypeScript (tsconfig)
- **Styling:** Tailwind via CDN (`index.html`), no `tailwind.config.js` (config inline in `<script>`)
- **Animation:** GSAP (ScrollTrigger), Motion (ex- Framer Motion), CSS keyframes
- **Backend/Auth:** Supabase (auth, profiles, career_applications)
- **AI:** `@google/genai` (Gemini), used for IVA chat
- **3D:** Three.js (e.g. `FloatingLines`), OGL available

### Entry & routing
- **Entry:** `index.html` → `index.jsx` → `App.jsx`
- **Routing:** Hash-based (no React Router). `types.ts` defines `Page` enum; `App.jsx` maps `pageToHash` / `hashToPage` and renders by `currentPage`
- **Auth:** Supabase session + `profiles.role` (admin vs intern). Login → Internal Dashboard; admin → Admin Dashboard

### Pages (from `Page` enum)
| Page            | Hash                     | Notes                          |
|-----------------|--------------------------|--------------------------------|
| HOME            | `#home`                  | Dark serpent hero + sections   |
| LOGIN           | `#login`                 | LoginPortal                    |
| INTERNAL        | `#internal`              | InternalDashboard / AdminDashboard |
| SERVICES        | `#ai-data-services`      | Services                       |
| PROJECTS        | `#ai-projects`           | Projects                       |
| ABOUT           | `#about`                 | About                          |
| OFFICES         | `#global-offices`        | Offices (Leaflet map)          |
| TYPE_A/B/C/D    | `#type-a` etc.           | OfferTypePage                  |
| PHIL_IMPACT     | `#philanthropy-impact`   | PhilImpact                     |
| CAREERS         | `#careers`               | Careers                        |
| CAREERS_APPLY   | `#careers-apply`         | CareersApplication             |
| CONTACT         | `#contact`               | Contact                        |
| IVA             | `#iva`                   | IvaChat                        |

### Layout (App.jsx)
- **Shell:** `min-h-screen flex flex-col`, background by page: HOME → `bg-lifewood-darkSerpent`, INTERNAL → `#0a0f0d`, else → `bg-lifewood-paper`
- **Navbar:** Hidden on INTERNAL
- **IvaFloatButton:** Shown except on IVA and LOGIN
- **Footer:** Hidden on LOGIN and INTERNAL

### Key directories
- **`/components`** – All UI (Navbar, Hero, Home, Services, About, Footer, etc.)
- **`/services`** – `supabaseClient.ts`, `geminiService.ts`
- **`/supabase`** – `functions/careers-thank-you`, `sql/career_applications.sql`
- **Root:** `App.jsx`, `types.ts`, `index.css`, `index.html`, `index.jsx`, `vite.config.ts`

---

## 2. Lifewood brand guide (from PDF) – color & typography

### Official color palette (use these as source of truth)
| Name           | Hex       | Usage (guide) |
|----------------|-----------|----------------|
| **Paper**      | `#f5eedb` | Main background |
| **White**      | `#ffffff` | Background, logo variant |
| **Sea Salt**   | `#F9F7F7` | Background |
| **Saffaron**   | `#FFB347` | Accent, buttons (not on colored backgrounds) |
| **Castleton Green** | `#046241` | Brand green |
| **Dark Serpent**    | `#133020` | Dark green, text on light |
| **Earth yellow**    | `#FFC370` | Secondary accent |

### Extended palette (graphs/diagrams)
- Oranges: `#C17110`, `#E89131`, `#FFB347`, `#FFC370`, `#F4D0A4`
- Greens: `#133020`, `#034E34`, `#417256`, `#708E7C`, `#9CAFA4`
- Neutrals: `#666666`, `#999999`, `#CCCCCC`, `#E6E6E6`, `#FFFFFF`

### Color guidelines (Western logo)
- **Logo:** Green, Saffaron, or white only.
- **Text:** White, Paper, or Dark green.
- **Accent (e.g. buttons):** Saffaron; avoid on colored backgrounds.
- **Backgrounds:** White & Paper primary; Dark green and Saffaron for emphasis.

### Typography (guide)
- **Font:** Manrope (Regular, Medium, Semibold). Chinese: Alimama ShuHeiTi Bold, 微软雅黑 Regular.
- **Kerning:** 15.
- **Scale:** Body = ½ Headline, Headline = ½ Display (2:1).
- **Alignment:** Left or center. Sentence case.

---

## 3. Current implementation vs brand

### Tailwind theme (in `index.html`)
```js
lifewood: {
  paper: '#f5eedb',
  white: '#ffffff',
  seasalt: '#F9F7F7',
  darkSerpent: '#133020',
  castleton: '#046241',
  saffron: '#FFB347',
  earth: '#FFC370',
  pale: '#F4D0A4',
  grey: { light: '#E6E6E6', medium: '#CCCCCC', dark: '#666666' }
}
```
Matches brand. Use classes: `bg-lifewood-paper`, `text-lifewood-darkSerpent`, `border-lifewood-castleton`, `text-lifewood-saffron`, etc.

### Global CSS (`index.css`)
- **Theme:** `.theme-light` / `.theme-dark` (color-scheme, overrides for nav, inputs, careers, phil-impact, IVA).
- **Nav:** `.nav-glass-shell`, `.nav-glass-menu` (backdrop blur, gradients, shadows).
- **Map:** `.lifewood-impact-map`, `.lifewood-impact-pin` (Castleton/Saffaron pin, Dark Serpent border).
- **IVA button:** `.iva-float-btn`, `.iva-float-btn__icon`, `ivaPulse` keyframes (Saffaron glow).

### Body default (index.html inline)
- `background-color: #f5eedb` (Paper), `color: #133020` (Dark Serpent), `font-family: 'Manrope', sans-serif`.

---

## 4. Animations

### Tailwind (index.html)
- **Named:** `pulse-slow`, `fade-in-up`, `fade-in-up-delay-1`, `fade-in-up-delay-2`, `slide-in-right`, `float`.
- **Keyframes:** `fadeInUp`, `slideInRight`, `float` (translateY).

### Global CSS
- **Marquee:** `marqueeLeft` (translateX), `.marquee-track` (26s linear infinite), disabled for `prefers-reduced-motion`.
- **IVA:** `ivaPulse` (scale + box-shadow on Saffaron).

### Component-level keyframes
- **InternalDashboard:** `panelRise`, `fadeUp`, `growBar` (staggered panel/text/bar).
- **LoginPortal:** `loginFloatUp`, `loginFadeIn`.
- **OfferTypePage:** `fadeSlide`, `imageReveal`, `fadeUp`, `mediaZoom`, `orbFloatA/B/C`.
- **Careers:** `fadeUp` (with reduced-motion override).

### GSAP
- **ScrollReveal:** ScrollTrigger, word-by-word reveal, optional blur/rotation.
- **PixelTransition:** Grid-based pixel reveal (configurable color, grid size, duration).

### Motion (ex-Framer)
- **Navbar:** `useScroll`, `useMotionValueEvent` for hide-on-scroll.

### Patterns
- Stagger: delay classes (`delay-100`, `delay-200`) or inline `animationDelay` / `style={{ animation: '... 120ms both' }}`.
- Prefer `prefers-reduced-motion: reduce` where applicable (e.g. Careers, marquee).

---

## 5. Component patterns

- **Navigation:** `onNavigate(page: Page)` passed from App; Navbar/Footer use it for links and buttons.
- **Theming:** Class `theme-dark` on a parent (e.g. body) triggers `index.css` overrides; no CSS variables for palette (Tailwind + overrides).
- **Logo:** `/lifewood-logo-custom.svg`, class `brand-logo` (no filter in dark theme).
- **Glass:** `glass-panel` (index.html), `nav-glass-shell`, `nav-glass-menu` (index.css).
- **Home:** Uses `FloatingLines` (Three.js), `VariableProximity`, `GlareHover`, custom `RevealOnScroll` (IntersectionObserver).
- **Maps:** Leaflet; custom popup/pin styles in `index.css` (`.lifewood-impact-map`, `.lifewood-impact-pin`).

---

## 6. Vite & env

- **Config:** `vite.config.ts` – React plugin, `@` → project root, `GEMINI_API_KEY` / `API_KEY` from env.
- **Env:** `.env` (not committed), `.env.example`; Supabase URL/keys for client.

---

## 7. Migration checklist (VS Code → Cursor)

- [ ] Ensure Node version matches `.nvmrc` / `package.json` engines (≥18).
- [ ] Run `npm install` and `npm run dev` (Vite on 127.0.0.1:5173).
- [ ] Tailwind: no separate config file; theme lives in `index.html` – search for “tailwind.config” there when changing colors.
- [ ] For new Lifewood colors, add to `lifewood` in `index.html` and use `bg-lifewood-*`, `text-lifewood-*`, etc.; keep `index.css` theme overrides in sync for dark mode.
- [ ] Typography: stick to Manrope (already loaded); keep body/headline scale consistent with guide (2:1).
- [ ] Buttons/accents: prefer `lifewood-saffron` on light (Paper/White); avoid Saffaron on dark green backgrounds per guide.
- [ ] Logo: only green, Saffaron, or white variants; no outline, shadow, stretch, or tilt (see PDF).

---

## 8. Quick reference – brand colors (hex)

```text
#f5eedb  Paper
#ffffff  White
#F9F7F7  Sea Salt
#FFB347  Saffaron (accent/buttons)
#046241  Castleton Green
#133020  Dark Serpent
#FFC370  Earth yellow
```

Use these when adding inline styles or new CSS; otherwise prefer Tailwind `lifewood.*` classes.
