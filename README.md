# Silver Play — Shopify Theme (Online Store 2.0)

A production-ready Shopify theme cloned from the Next.js site
(silverplayproject.vercel.app / silverplay.in) — home page layout, spacing,
colors, fonts, copy, imagery and (in simplified CSS/JS form) the marquee and
carousel animations, plus real data-driven product, collection, cart,
search, blog and page templates. No Next.js/React/GSAP/Framer runtime; all
interactivity is vanilla JS in `assets/theme.js` and CSS in `assets/theme.css`.

## What's dynamic now (Phase 2–4)

- **Home product sections are collection-driven**, not hardcoded:
  `best-sellers.liquid`, `gen-z-edit.liquid` (3 tabs, 3 collection settings),
  `royal-simplicity.liquid` and `cool-girl-silver.liquid` each expose a
  `collection` (or per-tab collection) + `count` setting in the theme editor.
  Titles/prices/images/handles are pulled live from `product.title`,
  `product.price | money`, `product.compare_at_price`,
  `product.featured_image`, `product.url` — nothing is hardcoded per block
  anymore. `archive-treasure.liquid` blocks keep the archival "front" art as
  a manual image (non-catalog editorial photography) but now accept an
  optional `collection` picker to drive the link and the "back" product
  photo from that collection's first product.
- **`snippets/product-card.liquid`** now renders a real Shopify `product`
  object: featured image + hover/secondary image (`product.images[1]`),
  title, price, compare-at/sale badge, sold-out state, and a **Quick Add**
  button that posts to `/cart/add.js` via fetch (no reload) for
  single-variant products, or a **View Options** link to the PDP otherwise.
- **Journal section** (`journal-showcase.liquid`) now pulls real
  `blogs[<handle>].articles` (default handle `journal`) — title, image, url,
  limit configurable in the schema — instead of hardcoded story blocks.
- **Header** (`sections/header.liquid`): nav now renders from a `link_list`
  theme-editor setting (`main_menu`, defaults to the `main-menu` handle —
  i.e. Shopify's Main menu) via `linklists[...].links`; falls back to the
  original block-based links only if no menu is selected. The link titled
  "Collections" or "Shop" auto-shows the existing mega-nav
  (`snippets/mega-nav.liquid`). Cart icon shows live `cart.item_count` and
  opens the new cart drawer.
- **Footer** (`sections/footer.liquid`): each of the 3 link columns is now a
  `link_list` setting with a text title setting; same layout/labels as
  before are used as the fallback when no menu is picked.

## Phase 3 — required templates (all present, all schema-valid)

- **Product** — `templates/product.json` + `sections/main-product.liquid`:
  image gallery with thumbnail switcher, title, price/compare-at,
  availability, variant picker rendered as option pills (multi-option
  products resolve the matching variant client-side from an inlined
  `product.variants | json`), quantity stepper, Ajax add-to-cart (opens the
  cart drawer on success, inline success/error message), full
  `product.description`, and related products — tries live
  `routes.product_recommendations_url` first, falls back to a manually
  picked "related collection" schema setting.
- **Collection** — `templates/collection.json` + `sections/main-collection.liquid`:
  title, `collection.description`, product grid via `product-card`, sort-by
  dropdown (`collection.sort_options` / `collection.sort_by`), and
  `{% paginate %}`-driven pagination.
- **Cart** — `templates/cart.json` + `sections/main-cart.liquid` (full page:
  line items, quantity stepper, remove, subtotal, checkout button) **and**
  `snippets/cart-drawer.liquid` (slide-in drawer wired to the header cart
  icon). Both use `/cart/change.js` and `/cart/add.js` so add/update/remove
  happen without a page reload; the cart page updates its own DOM in place,
  the drawer re-renders from `/cart.js`. Empty-cart state is styled to
  match the site (`.cart-drawer__empty`).
- **Search** — `templates/search.json` + `sections/main-search.liquid`:
  results grid reusing `product-card` for products, styled cards for
  articles/pages, result count. The header search icon now opens a
  **predictive search panel** (`.search-panel`) that calls
  `/search/suggest.json` as you type and shows product/article/page
  results inline.
- **Page** — `templates/page.json` + `sections/main-page.liquid`: simple
  `page.content` rich-text layout matching site typography. This is the
  generic fallback for legal/policy pages (Shipping, Returns, Privacy, etc.)
  with no dedicated design.

### Dedicated page templates (About / Stone Guide / Contact)

About, Stone Guide and Contact each have a real from-source design instead
of falling back to the generic rich-text `page.json` template:

- **About** — `templates/page.about-us.json`, composed of
  `sections/main-page-about.liquid` (tall dark hero + editable badge
  blocks), the existing `sections/founder.liquid` (reused as-is), two new
  alternating text/image rows (`sections/about-craft.liquid`,
  `sections/about-values.liquid`), a 3-card gold-frame vision block
  (`sections/about-vision.liquid`), the existing `sections/testimonials.liquid`
  (reused), and a closing CTA row (`sections/about-closing.liquid`) —
  matching `src/app/about/page.tsx` section-for-section. Every heading,
  paragraph, image and the 4 hero badges / 3 vision cards are schema
  settings/blocks, editable in the theme editor.
- **Stone Guide** — `templates/page.stone-guide.json` +
  `sections/main-page-stone-guide.liquid`: a banner hero plus the
  master-detail "stone explorer" from `StoneExplorer.tsx` — a thumbnail
  grid on the left, one full gold-framed write-up (photo, tagline, meaning,
  property tags, wear/care/best-for) on the right that swaps on hover/tap
  (`initStoneExplorer()` in `assets/theme.js`). Ships with all **24 stones**
  from `src/data/stoneGuide.ts` pre-populated as schema blocks (name,
  tagline, meaning, properties, how-to-wear, care, best-for are all text
  settings; photo is an `image_picker` the merchant uploads per stone).
- **Contact** — `templates/page.contact.json` +
  `sections/main-page-contact.liquid`: banner hero, contact-info column
  (email/hours/social as schema settings + blocks), and a gold-framed
  contact form using Shopify's **native** `{% form 'contact' %}` (posts to
  Shopify's real contact-message backend, with `posted_successfully?` and
  `form.errors` handling styled to match) — unlike the Next.js source's
  `mailto:`-only form, this one actually delivers messages to the store's
  Contact notification recipient.

**To select a dedicated template in Admin:** Online Store → Pages → open
the page (or create one) → in the right-hand sidebar under *Theme
template*, choose `page.about-us`, `page.stone-guide` or `page.contact`
from the dropdown (Shopify lists `templates/page.<suffix>.json` files by
their `<suffix>`) → Save. Any page without an explicit template still falls
back to the generic `page.json`.
- **Blog / Article** — `templates/blog.json` + `templates/article.json` with
  `sections/main-blog.liquid` (card grid, same visual language as the home
  Journal cards, paginated) and `sections/main-article.liquid` (hero image,
  `article.content`, tags, back-to-journal link).
- **404** — `templates/404.json` + `sections/main-404.liquid`.
- `templates/list-collections.json` / `sections/main-list-collections.liquid`
  and `templates/password.liquid` are also present as minimal fallbacks.

## What's still simplified vs. the live Next.js site (and why)

- **Cinematic scroll-scrub hero**: the source site (`CinematicHero.tsx`)
  pins the hero for a tall scroll track (450vh of extra runway on desktop,
  300vh on mobile — GSAP `ScrollTrigger`'s `DESKTOP_TRACK_VH`/
  `MOBILE_TRACK_VH`) and maps scroll progress through that track directly
  onto the video's `currentTime`, while five text "chapters" crossfade in
  and out at different points along the same progress value. This theme
  reproduces the **mechanic** with vanilla JS (`initCinematicHero()` in
  `assets/theme.js`, structural pin wrapper `.hero-pin` + `position:
  sticky` `.hero` in `sections/hero.liquid` / `assets/theme.css`): a real
  `scroll`-driven video scrub, with the same 450vh/300vh track heights, the
  same 0.3 lerp-toward-target easing and 1/30s minimum-seek-delta
  throttling as the source, and the header's pin threshold now reads the
  hero's actual pin-release scroll offset (`window.__heroScrollEnd`) the
  same way the source's header does. The one real simplification: this
  theme's hero markup only ever had **one** static content block (title,
  subtitle, CTA) rather than the source's five separate chapter blocks, so
  there is no multi-chapter crossfade — instead that single block fades out
  and lifts (translateY + opacity, `fadeStart 0.12` → `fadeEnd 0.4` of
  scroll progress) as the video takes over, then the section releases into
  the page at the end of the track. `prefers-reduced-motion: reduce` drops
  the tall track entirely (CSS sets `.hero-pin` to `height: auto` and
  `.hero` back to `position: relative`) and the JS bails out early, so
  those visitors just get the video autoplay-looping with the content
  statically visible, matching the source's own reduced-motion fallback.
- **Royal Simplicity / Journal Showcase carousels**: native horizontal
  scroll-snap tracks with prev/next buttons, not Framer Motion
  scroll-linked tracks or a 3D rotating arc — same cards/content/at-rest
  visual, no scroll-linked or 3D motion.
- **Variant selection on the PDP** resolves the matching variant from an
  inlined JSON payload (no `predictive_search`/AJAX call needed) — this
  covers the general case (any option combination) but, as with most
  from-scratch theme builds, is not the full Dawn/`variant-selects.js`
  feature set (no per-option "unavailable" graying-out of impossible
  combinations).
- Framer Motion micro-interactions (staggered reveal-by-word `SplitText`,
  spring-based card pop, GSAP-eased hovers) are approximated with CSS
  transitions/keyframes and a lightweight IntersectionObserver reveal.
- Theme editor **color settings** (`config/settings_schema.json`) exist but
  are not wired into `theme.css` (which uses fixed hex custom properties) —
  cosmetic global recoloring from the editor is out of scope; edit the
  `--sp-*` tokens at the top of `assets/theme.css` directly if the palette
  ever needs to change.

## Alignment/layout fixes vs. the live Next.js site

A width/padding/breakpoint audit compared `src/app/globals.css` and the
Tailwind container classes on `src/components/**` against
`assets/theme.css`'s equivalent selectors. Most containers already matched
exactly (`.sp-container` = `max-w-[1500px] px-5 md:px-10` = Tailwind's
`max-w-[1500px] px-5 md:px-10`; footer `grid-cols-[1.4fr_repeat(3,1fr)]
gap-14`; product grid `gap-3 sm:gap-5 lg:gap-6` + `grid-cols-2
lg:grid-cols-4`). One real mismatch was found and fixed:

- **Header bar padding** (`sections/header.liquid` /
  `.site-header__bar` in `assets/theme.css`): the source
  `Header.tsx` animates `paddingLeft/Right: 34, paddingTop/Bottom: 10`
  constantly, in both the transparent (unpinned) and floating-pill (pinned)
  states. The theme had `padding: 16px 22px` unpinned vs. `10px 34px`
  pinned — a mismatch that made the unpinned nav bar noticeably narrower on
  logo/links than the source. Unpinned padding is now `10px 34px` to match,
  matching the pinned state's — only the background/border-radius/shadow
  change between the two states now, exactly as in the source.
- **Header transparency logic** (`sections/header.liquid` /
  `.site-header__bar` in `assets/theme.css` / `initHeader()` in
  `assets/theme.js`): two bugs vs. `Header.tsx`. First, the bar's base
  (unpinned) background was a fixed `rgba(36,26,16,0.55)` wash, and the
  markup hardcoded a `no-hero` class on every page — so the header never
  actually went transparent over the homepage hero, and every page (not
  just the no-hero ones) got the dim brown wash. The source is fully
  transparent (`rgba(245,242,237,0)`) unpinned when a `[data-page-hero]`
  exists anywhere on the page, and solid brown (`rgba(36,26,16,0.97)`) only
  when it doesn't (the single product page has no page hero at all — every
  other template, including collection/cart/search/blog/article/generic
  page, has none either in this theme's current markup and so also gets
  the solid-brown-until-scroll state, matching the source's actual
  "is there a hero on this page" check rather than a route-based guess).
  Fixed: base background is now transparent, and `initHeader()` toggles
  `no-hero` at runtime based on whether `[data-page-hero]` exists in the
  DOM, instead of it being hardcoded in the liquid markup. Second, the pin
  threshold now prefers `window.__heroScrollEnd` (written by
  `initCinematicHero()` to the hero's true pin-release scroll offset) over
  the flat hero-height guess, mirroring the source's own
  `window.__heroScrollEnd` handoff between the cinematic hero and header.

## Validation performed

- Every `sections/*.liquid` `{% schema %}` block parses as valid JSON (32
  sections checked via a Node script that extracts and `JSON.parse`s each
  block).
- Every `templates/*.json` file parses as valid JSON and every section
  `"type"` it references has a matching file under `sections/` (13
  templates checked, including the 3 new `page.about-us` / `page.stone-guide`
  / `page.contact` alternate templates).
- Grepped the whole theme for Next.js/React/Framer artifacts (`import `,
  `export default`, `useState`, `.tsx`, `vercel.app`, `localhost`, JSX) —
  none found in `.liquid`/`.js`/`.css`; fixed two leftover
  `silverplayproject.vercel.app` references in
  `config/settings_schema.json` (`theme_documentation_url`/
  `theme_support_url`), now pointed at `silverplay.in`.
- Cross-checked every `data-*` hook used in `assets/theme.js` against the
  markup in `sections/`, `snippets/`, and `layout/theme.liquid` — no
  orphaned selectors.

## Upload steps

1. `cd shopify-theme` (this folder — `theme.liquid` etc. must sit at the zip
   root, not nested inside another folder).
2. Zip the **contents** of `shopify-theme/`, not the folder itself:
   ```
   cd shopify-theme
   zip -r ../shopify-theme.zip . -x ".*"
   ```
3. Shopify Admin → **Online Store → Themes → Add theme → Upload zip** →
   select `shopify-theme.zip`.

## First-time setup after upload (do this before Publish)

1. **Create the collections** the home page sections expect (Admin →
   Products → Collections), then open **Customize** on the theme and pick
   them in each section's settings (they ship with the `collection` setting
   blank on purpose — pick a live collection, no fake data ships):
   - Best Sellers → any collection of top sellers
   - Fresh Edit (Gen-Z) → 3 pickers: New Arrivals / Earrings / Pendants
   - Her Royal Simplicity → a minimalist/everyday collection
   - Cool Girl Silver (Kavach) → your Kavach/pendant collection
   - Archive Silver Treasure blocks → optionally attach a `collection` per
     tile for the link + fallback back-image (front archival art stays a
     manual image upload)
2. **Create a blog** with handle `journal` (Admin → Online Store → Blog
   posts → Manage blogs) so `journal-showcase.liquid` and
   `templates/blog.json`/`templates/article.json` have content. Add at
   least 3–4 posts with a featured image.
3. **Set up navigation** (Admin → Online Store → Navigation):
   - Create/edit the **Main menu** (handle `main-menu`) — the header's
     `main_menu` setting defaults to it. Name one top-level item
     "Collections" or "Shop" to auto-trigger the mega-nav.
   - Create up to 3 more menus for the footer columns and pick them in the
     Footer section's Column 1/2/3 menu settings (titles are editable too).
4. **Pages**: create `about`, `stone-guide`, `contact`, `jewellery-care`,
   `shipping-policy`, `returns`, `faqs`, `privacy`, `terms` pages if you
   want the existing footer/header default links to resolve (they use
   `templates/page.json` automatically).
5. In **Customize**, confirm the Home template loads the 14 home sections
   in order, spot-check a product page, a collection page, the cart drawer
   (Ajax add-to-cart from a product-card Quick Add button), and the header
   search icon's predictive results.
6. Publish when ready.
