# GOTLEB Rebrand — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Live HTML/CSS prototype on GitHub Pages — 4 screens (index/catalog/product/about) в эстетике C2 Парижский архив × T2 ASCII-перебивки × Q1 документальные поля. Концепт для согласования с Андреем Жакевичем.

**Architecture:** Чистая статика — HTML5 + CSS3 (CSS-переменные, Grid) + ванильный JS. Без билд-степа, без npm. Шрифты через Google Fonts. Фото скачаны с tildacdn.com и оверлеены sepia + film grain через CSS. Деплой — GitHub Pages из main-ветки.

**Tech Stack:** HTML / CSS / vanilla JS / Google Fonts (Cormorant Garamond, Inter, JetBrains Mono) / GitHub Pages.

**Spec:** `docs/specs/2026-05-10-gotleb-rebrand-design.md`

**Verification approach:** Это статический landing — нет unit-тестов. Smoke check = открыть в браузере и пройти acceptance criteria из spec §9. Для каждой task есть `Verify` step с конкретным наблюдением.

---

## Task 1: Bootstrap project structure

**Files:**
- Create: `~/Desktop/gotleb-rebrand/styles/`
- Create: `~/Desktop/gotleb-rebrand/js/`
- Create: `~/Desktop/gotleb-rebrand/assets/photos/`
- Create: `~/Desktop/gotleb-rebrand/assets/icons/`
- Create: `~/Desktop/gotleb-rebrand/.gitignore`

- [ ] **Step 1: Create empty subfolders**

```bash
cd ~/Desktop/gotleb-rebrand
mkdir -p styles js assets/photos assets/icons
```

- [ ] **Step 2: Write `.gitignore`**

File: `~/Desktop/gotleb-rebrand/.gitignore`

```
.DS_Store
*.swp
*.swo
node_modules/
.vscode/
.idea/
```

- [ ] **Step 3: Verify structure**

```bash
ls -la ~/Desktop/gotleb-rebrand/
```
Expected: see `docs/`, `styles/`, `js/`, `assets/`, `.gitignore`, `.git/`

- [ ] **Step 4: Commit**

```bash
cd ~/Desktop/gotleb-rebrand
git add .gitignore
git commit -m "chore: project structure scaffold"
```

---

## Task 2: Download photos from gotleb.ru

**Files:**
- Create: `~/Desktop/gotleb-rebrand/assets/photos/`
- Create: `~/Desktop/gotleb-rebrand/assets/photos/_inventory.txt`

**Why:** Нам нужны все hero + categories + product фотографии с текущего сайта. Они хостятся на `static.tildacdn.com` и `thb.tildacdn.com`.

- [ ] **Step 1: Fetch all source pages and extract tildacdn image URLs**

```bash
cd ~/Desktop/gotleb-rebrand
mkdir -p assets/photos
for page in "" all man woman about contact; do
  curl -s "https://gotleb.ru/$page" >> /tmp/gotleb-pages.html
done
grep -oE 'https://(static|thb)\.tildacdn\.com/[a-z0-9_/.-]+\.(jpg|jpeg|png|webp)' /tmp/gotleb-pages.html | sort -u > /tmp/gotleb-urls.txt
wc -l /tmp/gotleb-urls.txt
```

Expected: 20-100+ URLs depending on catalog size.

- [ ] **Step 2: Filter out tilda system icons (logo placeholders, cart icons), keep product/hero photos**

```bash
grep -v 'Mask_group\|Group_390587\|tildacopy\|placeholder\|loader' /tmp/gotleb-urls.txt > /tmp/gotleb-content-urls.txt
wc -l /tmp/gotleb-content-urls.txt
```

- [ ] **Step 3: Download all content URLs into `assets/photos/`**

```bash
cd ~/Desktop/gotleb-rebrand/assets/photos
while read url; do
  filename=$(basename "$url")
  curl -s -o "$filename" "$url"
done < /tmp/gotleb-content-urls.txt
ls -la | wc -l
```

Expected: file count matches URL count.

- [ ] **Step 4: Save logo separately**

```bash
cd ~/Desktop/gotleb-rebrand/assets/icons
curl -s -o "logo-gotleb.png" "https://static.tildacdn.com/tild6536-6536-4665-a637-633639633461/Mask_group.png"
ls -la logo-gotleb.png
```

Expected: file exists, non-zero size.

- [ ] **Step 5: Write inventory file**

```bash
cd ~/Desktop/gotleb-rebrand/assets/photos
{
  echo "# GOTLEB photo inventory"
  echo "# Source: https://gotleb.ru (Tilda CDN)"
  echo "# Date: 2026-05-10"
  echo ""
  ls -la *.jpg *.jpeg *.png *.webp 2>/dev/null
} > _inventory.txt
cat _inventory.txt
```

- [ ] **Step 6: Verify**

```bash
cd ~/Desktop/gotleb-rebrand
du -sh assets/photos/
ls assets/photos/ | head -5
```

Expected: размер папки в МБ, видны файлы с tild* именами.

- [ ] **Step 7: Commit**

```bash
git add assets/
git commit -m "assets: download all photos from gotleb.ru"
```

---

## Task 3: Write `styles/tokens.css`

**Files:**
- Create: `~/Desktop/gotleb-rebrand/styles/tokens.css`

- [ ] **Step 1: Write tokens file**

File: `~/Desktop/gotleb-rebrand/styles/tokens.css`

```css
/* GOTLEB design tokens — палитра, типография, сетка */

@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400&display=swap');

:root {
  /* Палитра — Парижский архив C2 */
  --paper:      #ece7df;
  --paper-deep: #e2dcd0;
  --ink:        #2b2620;
  --ink-soft:   #5a5247;
  --ink-faint:  #948b7d;
  --rule:       #c9c1b3;
  --accent:     #a06a3c;

  /* Типография */
  --font-serif: 'Cormorant Garamond', Georgia, serif;
  --font-sans:  'Inter', -apple-system, system-ui, sans-serif;
  --font-mono:  'JetBrains Mono', ui-monospace, monospace;

  /* Размеры (8px baseline) */
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-5: 48px;
  --space-6: 64px;
  --space-7: 80px;
  --space-8: 120px;
  --space-9: 200px;

  /* Сетка */
  --max-content: 1400px;
  --gutter:      32px;
  --gutter-mob:  16px;

  /* Hairline */
  --hairline: 1px solid var(--rule);

  /* Transitions */
  --t-link: 200ms ease-out;
  --t-photo: 400ms ease-out;
}

@media (max-width: 640px) {
  :root {
    --gutter: var(--gutter-mob);
    --space-8: 64px;
    --space-7: 48px;
    --space-6: 40px;
  }
}
```

- [ ] **Step 2: Verify**

```bash
cat ~/Desktop/gotleb-rebrand/styles/tokens.css | head -20
```

- [ ] **Step 3: Commit**

```bash
cd ~/Desktop/gotleb-rebrand
git add styles/tokens.css
git commit -m "styles: design tokens (palette, typography, grid)"
```

---

## Task 4: Write `styles/main.css` — reset + base + header + footer

**Files:**
- Create: `~/Desktop/gotleb-rebrand/styles/main.css`

- [ ] **Step 1: Reset + base + typography**

File start: `~/Desktop/gotleb-rebrand/styles/main.css`

```css
/* GOTLEB — main stylesheet */

@import url('./tokens.css');

*, *::before, *::after { box-sizing: border-box; }

html, body { margin: 0; padding: 0; }

body {
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

img { display: block; max-width: 100%; height: auto; }

a {
  color: inherit;
  text-decoration: none;
  position: relative;
}

a:hover, a:focus-visible {
  color: var(--ink);
}

a:focus-visible {
  outline: 1px solid var(--ink);
  outline-offset: 4px;
}

/* Typography utility classes */

.t-hero {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
  font-size: clamp(40px, 6vw, 96px);
  line-height: 1.1;
}

.t-h2 {
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: clamp(28px, 4vw, 48px);
  line-height: 1.2;
}

.t-h3 {
  font-family: var(--font-sans);
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.t-quote {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
  font-size: clamp(20px, 2.5vw, 28px);
  line-height: 1.5;
  color: var(--ink-soft);
}

.t-body { font-size: 16px; line-height: 1.7; }

.t-meta {
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  color: var(--ink-soft);
}

.t-caption {
  font-family: var(--font-sans);
  font-size: 11px;
  letter-spacing: 0.12em;
  color: var(--ink-faint);
  text-transform: uppercase;
}

.t-mono {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.04em;
  color: var(--ink-soft);
}
```

- [ ] **Step 2: Add layout containers and ASCII rule component**

Append to `styles/main.css`:

```css
/* Layout */

.container {
  max-width: var(--max-content);
  margin: 0 auto;
  padding: 0 var(--gutter);
}

.container-narrow {
  max-width: 780px;
  margin: 0 auto;
  padding: 0 var(--gutter);
}

.section {
  padding: var(--space-8) 0;
}

.section-tight {
  padding: var(--space-6) 0;
}

/* T2 ASCII rule — Q1 документальные перебивки */

.archive-rule {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.04em;
  color: var(--ink-soft);
  text-align: center;
  white-space: pre;
  padding: var(--space-7) 0;
  margin: 0;
  user-select: none;
}

.archive-rule__inner {
  display: inline-block;
  text-align: left;
}

@media (max-width: 640px) {
  .archive-rule {
    font-size: 10px;
    overflow-x: auto;
    padding: var(--space-5) 0;
  }
}

/* Hairline link — CTA without buttons */

.hairline-link {
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 500;
  color: var(--ink);
  display: inline-block;
  padding: 8px 0;
  border-bottom: 1px solid var(--ink);
  transition: opacity var(--t-link);
}

.hairline-link:hover { opacity: 0.6; }
```

- [ ] **Step 3: Add header (sticky)**

Append:

```css
/* Header — sticky, hairline-bottom */

.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--paper);
  border-bottom: var(--hairline);
  height: 60px;
  display: flex;
  align-items: center;
}

.header__inner {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  width: 100%;
  max-width: var(--max-content);
  margin: 0 auto;
  padding: 0 var(--gutter);
}

.header__logo {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 500;
  font-size: 20px;
  letter-spacing: 0.04em;
}

.header__nav {
  display: flex;
  gap: var(--space-5);
  justify-self: center;
}

.header__nav a {
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  transition: opacity var(--t-link);
}

.header__nav a:hover { opacity: 0.6; }

.header__nav a.is-active::after {
  content: '';
  display: block;
  height: 1px;
  background: var(--ink);
  margin-top: 4px;
}

.header__icons {
  display: flex;
  gap: var(--space-3);
  justify-self: end;
  align-items: center;
}

.header__icons a {
  font-size: 14px;
  opacity: 0.85;
  transition: opacity var(--t-link);
}

.header__icons a:hover { opacity: 1; }

.header__burger {
  display: none;
  background: none;
  border: 0;
  width: 28px;
  height: 20px;
  position: relative;
  cursor: pointer;
}

.header__burger span {
  position: absolute;
  left: 0;
  width: 100%;
  height: 1px;
  background: var(--ink);
}

.header__burger span:nth-child(1) { top: 4px; }
.header__burger span:nth-child(2) { top: 50%; }
.header__burger span:nth-child(3) { bottom: 4px; }

@media (max-width: 980px) {
  .header__nav {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    background: var(--paper);
    flex-direction: column;
    gap: var(--space-3);
    padding: var(--space-5) var(--gutter);
    border-bottom: var(--hairline);
    transform: translateY(-110%);
    transition: transform 300ms ease-out;
  }

  .header.is-open .header__nav { transform: translateY(0); }
  .header__burger { display: block; }
  .header__inner { grid-template-columns: auto 1fr auto; }
  .header__nav { grid-column: unset; }
}
```

- [ ] **Step 4: Add footer**

Append:

```css
/* Footer */

.footer {
  border-top: var(--hairline);
  padding: var(--space-7) 0 var(--space-5);
  margin-top: var(--space-8);
}

.footer__cols {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-5);
  max-width: var(--max-content);
  margin: 0 auto;
  padding: 0 var(--gutter);
}

.footer__col h4 {
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--ink-soft);
  margin: 0 0 var(--space-3);
}

.footer__col ul { list-style: none; padding: 0; margin: 0; }

.footer__col li {
  font-family: var(--font-sans);
  font-size: 13px;
  line-height: 1.9;
}

.footer__col li a {
  border-bottom: 1px solid transparent;
  transition: border-color var(--t-link);
}

.footer__col li a:hover { border-bottom-color: var(--ink); }

.footer__bottom {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--ink-faint);
  text-align: center;
  margin-top: var(--space-6);
  padding: var(--space-2) 0 0;
  border-top: var(--hairline);
}

@media (max-width: 640px) {
  .footer__cols { grid-template-columns: 1fr; gap: var(--space-4); }
}
```

- [ ] **Step 5: Verify**

```bash
wc -l ~/Desktop/gotleb-rebrand/styles/main.css
```

Expected: 200-300 lines.

- [ ] **Step 6: Commit**

```bash
cd ~/Desktop/gotleb-rebrand
git add styles/main.css
git commit -m "styles: base reset, typography, header, footer, archive-rule"
```

---

## Task 5: Add product card + hero + photo overlay components to `main.css`

**Files:**
- Modify: `~/Desktop/gotleb-rebrand/styles/main.css`

- [ ] **Step 1: Add hero block**

Append to `styles/main.css`:

```css
/* Hero — full-bleed photo with sepia overlay */

.hero {
  position: relative;
  width: 100%;
  height: 90vh;
  min-height: 600px;
  overflow: hidden;
}

.hero__photo {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: sepia(0.12) contrast(0.96) saturate(0.92) brightness(1.02);
}

.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: url('../assets/icons/grain.svg');
  opacity: 0.06;
  pointer-events: none;
  mix-blend-mode: multiply;
}

.hero__caption {
  position: absolute;
  left: var(--gutter);
  bottom: var(--space-7);
  max-width: 720px;
  color: var(--paper);
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.25);
}

.hero__scroll-hint {
  position: absolute;
  bottom: var(--space-3);
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-mono);
  font-size: 14px;
  color: var(--paper);
  opacity: 0.7;
  animation: hint-bounce 2s ease-in-out infinite;
}

@keyframes hint-bounce {
  0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.7; }
  50%      { transform: translateX(-50%) translateY(8px); opacity: 1; }
}

@media (max-width: 640px) {
  .hero { height: 80vh; min-height: 480px; }
}
```

- [ ] **Step 2: Add category-pair block (Men/Women full-bleed two-column)**

Append:

```css
/* Categories — Men / Women */

.cats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
}

.cat {
  position: relative;
  height: 60vh;
  min-height: 480px;
  overflow: hidden;
}

.cat img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: sepia(0.12) contrast(0.96) saturate(0.92);
  transition: transform 600ms ease-out;
}

.cat:hover img { transform: scale(1.03); }

.cat__title {
  position: absolute;
  left: var(--space-5);
  bottom: var(--space-5);
  color: var(--paper);
  z-index: 2;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.cat__title-main {
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: clamp(28px, 4vw, 48px);
  margin: 0 0 4px;
}

.cat__title-meta {
  font-family: var(--font-sans);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  opacity: 0.85;
}

@media (max-width: 640px) {
  .cats { grid-template-columns: 1fr; }
  .cat { height: 50vh; min-height: 360px; }
}
```

- [ ] **Step 3: Add product-card grid + hover-swap**

Append:

```css
/* Product card grid */

.products {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-5);
  max-width: var(--max-content);
  margin: 0 auto;
  padding: 0 var(--gutter);
}

@media (max-width: 980px) { .products { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .products { grid-template-columns: 1fr; } }

.product-card {
  display: block;
  background: var(--paper);
  transition: background var(--t-photo);
}

.product-card:hover { background: var(--paper-deep); }

.product-card__photo {
  position: relative;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: var(--paper-deep);
}

.product-card__photo img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: sepia(0.12) contrast(0.96) saturate(0.92);
  transition: opacity var(--t-photo);
}

.product-card__photo img.is-back {
  opacity: 0;
}

.product-card:hover .product-card__photo img.is-front { opacity: 0; }
.product-card:hover .product-card__photo img.is-back  { opacity: 1; }

.product-card__info {
  padding: var(--space-2) 0 var(--space-4);
}

.product-card__name {
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: clamp(18px, 2vw, 22px);
  margin: 0 0 4px;
}

.product-card__meta {
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--ink-soft);
  margin: 0;
}
```

- [ ] **Step 4: Add manifesto block, newsletter, scroll utilities**

Append:

```css
/* Manifesto block */

.manifesto {
  text-align: center;
  padding: var(--space-7) var(--gutter);
}

.manifesto__quote {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(24px, 3vw, 36px);
  line-height: 1.4;
  color: var(--ink);
  max-width: 700px;
  margin: 0 auto;
}

/* Newsletter */

.newsletter {
  text-align: center;
  padding: var(--space-6) var(--gutter);
}

.newsletter__lead {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 22px;
  color: var(--ink-soft);
  margin: 0 0 var(--space-4);
}

.newsletter__form {
  display: flex;
  gap: var(--space-2);
  justify-content: center;
  align-items: end;
  max-width: 480px;
  margin: 0 auto;
}

.newsletter__input {
  flex: 1;
  background: transparent;
  border: 0;
  border-bottom: 1px solid var(--ink-soft);
  padding: 8px 0;
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--ink);
}

.newsletter__input:focus {
  outline: 0;
  border-bottom-color: var(--ink);
}

.newsletter__submit {
  background: none;
  border: 0;
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  color: var(--ink);
  cursor: pointer;
  border-bottom: 1px solid var(--ink);
  padding: 8px 0;
  transition: opacity var(--t-link);
}

.newsletter__submit:hover { opacity: 0.6; }
```

- [ ] **Step 5: Add product-detail layout + size pills + specs ASCII block**

Append:

```css
/* Product detail page */

.pdp {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: var(--space-6);
  max-width: var(--max-content);
  margin: 0 auto;
  padding: var(--space-5) var(--gutter) 0;
}

.pdp__gallery-main {
  position: relative;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: var(--paper-deep);
}

.pdp__gallery-main img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: sepia(0.12) contrast(0.96) saturate(0.92);
}

.pdp__thumbs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-2);
  margin-top: var(--space-2);
}

.pdp__thumb {
  aspect-ratio: 4 / 5;
  background: var(--paper-deep);
  overflow: hidden;
  cursor: pointer;
  border: 0;
  padding: 0;
  opacity: 0.6;
  transition: opacity var(--t-link);
}

.pdp__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: sepia(0.12);
}

.pdp__thumb.is-active { opacity: 1; }
.pdp__thumb:hover { opacity: 1; }

.pdp__info { padding-top: var(--space-3); }

.pdp__title {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
  font-size: clamp(28px, 4vw, 48px);
  margin: 0 0 var(--space-2);
}

.pdp__rule {
  width: 40px;
  height: 1px;
  background: var(--ink);
  margin: var(--space-2) 0 var(--space-3);
}

.pdp__material {
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--ink-soft);
  margin: 0 0 var(--space-2);
}

.pdp__price {
  font-family: var(--font-sans);
  font-size: 18px;
  font-weight: 500;
  margin: 0 0 var(--space-4);
}

.specs-block {
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 1.8;
  color: var(--ink-soft);
  background: var(--paper-deep);
  padding: var(--space-3);
  margin: var(--space-4) 0;
  white-space: pre;
  overflow-x: auto;
}

.sizes {
  margin: var(--space-4) 0;
}

.sizes__label {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 13px;
  margin: 0 0 var(--space-2);
}

.sizes__pills {
  display: flex;
  gap: var(--space-1);
  flex-wrap: wrap;
}

.size-pill {
  background: transparent;
  border: 1px solid var(--ink-soft);
  padding: 8px 14px;
  font-family: var(--font-sans);
  font-size: 13px;
  cursor: pointer;
  transition: all var(--t-link);
}

.size-pill:hover { border-color: var(--ink); }

.size-pill.is-active {
  background: var(--ink);
  color: var(--paper);
  border-color: var(--ink);
}

.pdp__actions {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin: var(--space-4) 0;
}

.pdp__delivery {
  margin-top: var(--space-3);
}

.pdp__delivery-title {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 14px;
  margin: 0 0 4px;
}

.pdp__delivery-text {
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--ink-soft);
  margin: 0;
}

@media (max-width: 980px) {
  .pdp { grid-template-columns: 1fr; gap: var(--space-4); }
}
```

- [ ] **Step 6: Add about-page rows (material + stitch image-text)**

Append:

```css
/* About page */

.about-hero {
  text-align: center;
  padding: var(--space-9) var(--gutter);
}

.about-hero__title {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(36px, 5vw, 80px);
  line-height: 1.2;
  max-width: 800px;
  margin: 0 auto;
}

.about-row {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: var(--space-4);
  max-width: 900px;
  margin: 0 auto var(--space-5);
  padding: 0 var(--gutter);
  align-items: start;
}

.about-row__photo {
  aspect-ratio: 4 / 5;
  background: var(--paper-deep);
  overflow: hidden;
}

.about-row__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: sepia(0.12) contrast(0.96) saturate(0.92);
}

.about-row__text h3 {
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: 24px;
  margin: 0 0 var(--space-2);
}

.about-row__text p {
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1.7;
  margin: 0;
  color: var(--ink-soft);
}

.about-stitch {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-5);
  max-width: var(--max-content);
  margin: 0 auto;
  padding: 0 var(--gutter);
}

.about-stitch__photo {
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--paper-deep);
}

.about-stitch__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: sepia(0.12) contrast(0.96) saturate(0.92);
}

.about-stitch__text {
  align-self: center;
  max-width: 500px;
}

.about-stitch__text h2 {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(28px, 4vw, 48px);
  margin: 0 0 var(--space-2);
}

.about-stitch__rule {
  width: 40px;
  height: 1px;
  background: var(--ink);
  margin: var(--space-2) 0 var(--space-3);
}

.about-path-quote {
  text-align: center;
  padding: var(--space-7) var(--gutter);
}

.about-path-quote p {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(22px, 2.5vw, 36px);
  line-height: 1.5;
  max-width: 700px;
  margin: 0 auto;
  color: var(--ink);
}

@media (max-width: 640px) {
  .about-row { grid-template-columns: 1fr; }
  .about-stitch { grid-template-columns: 1fr; }
}
```

- [ ] **Step 7: Add catalog-page filter bar**

Append:

```css
/* Catalog filter bar */

.catalog-head {
  max-width: var(--max-content);
  margin: 0 auto;
  padding: var(--space-5) var(--gutter) var(--space-3);
}

.catalog-head__title {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: clamp(40px, 5vw, 64px);
  margin: 0 0 var(--space-4);
}

.catalog-filters {
  display: flex;
  justify-content: space-between;
  align-items: end;
  flex-wrap: wrap;
  gap: var(--space-2);
  border-bottom: var(--hairline);
  padding-bottom: var(--space-2);
}

.catalog-filters__group {
  display: flex;
  gap: var(--space-3);
}

.catalog-filters__group a {
  font-family: var(--font-sans);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  padding: 6px 0;
  border-bottom: 1px solid transparent;
  transition: border-color var(--t-link);
}

.catalog-filters__group a:hover,
.catalog-filters__group a.is-active {
  border-bottom-color: var(--ink);
}
```

- [ ] **Step 8: Verify total file**

```bash
wc -l ~/Desktop/gotleb-rebrand/styles/main.css
```
Expected: 700-900 lines.

- [ ] **Step 9: Commit**

```bash
cd ~/Desktop/gotleb-rebrand
git add styles/main.css
git commit -m "styles: hero, categories, product-card, manifesto, newsletter, pdp, about, catalog"
```

---

## Task 6: Create film-grain SVG overlay

**Files:**
- Create: `~/Desktop/gotleb-rebrand/assets/icons/grain.svg`

- [ ] **Step 1: Write grain.svg**

File: `~/Desktop/gotleb-rebrand/assets/icons/grain.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
  <filter id="n">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
    <feColorMatrix values="0 0 0 0 0.17  0 0 0 0 0.15  0 0 0 0 0.13  0 0 0 0.4 0"/>
  </filter>
  <rect width="100%" height="100%" filter="url(#n)"/>
</svg>
```

- [ ] **Step 2: Verify**

```bash
cat ~/Desktop/gotleb-rebrand/assets/icons/grain.svg | head -3
```

- [ ] **Step 3: Commit**

```bash
cd ~/Desktop/gotleb-rebrand
git add assets/icons/grain.svg
git commit -m "assets: film-grain SVG overlay"
```

---

## Task 7: Write `js/main.js`

**Files:**
- Create: `~/Desktop/gotleb-rebrand/js/main.js`

- [ ] **Step 1: Write main.js**

File: `~/Desktop/gotleb-rebrand/js/main.js`

```js
/* GOTLEB — minimal vanilla JS */

(function () {
  'use strict';

  // 1. Mobile menu toggle
  const burger = document.querySelector('.header__burger');
  const header = document.querySelector('.header');
  if (burger && header) {
    burger.addEventListener('click', () => {
      header.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', header.classList.contains('is-open'));
    });
  }

  // 2. Product gallery — click thumb to swap main image
  const gallery = document.querySelector('.pdp__gallery-main');
  const thumbs = document.querySelectorAll('.pdp__thumb');
  if (gallery && thumbs.length) {
    const mainImg = gallery.querySelector('img');
    thumbs.forEach((t) => {
      t.addEventListener('click', () => {
        const src = t.querySelector('img').src;
        mainImg.src = src;
        thumbs.forEach((x) => x.classList.remove('is-active'));
        t.classList.add('is-active');
      });
    });
  }

  // 3. Size pills — single-select
  const pills = document.querySelectorAll('.size-pill');
  pills.forEach((p) => {
    p.addEventListener('click', () => {
      pills.forEach((x) => x.classList.remove('is-active'));
      p.classList.add('is-active');
    });
  });

  // 4. Catalog filters — visual toggle (no real filtering, prototype)
  const filterLinks = document.querySelectorAll('.catalog-filters__group a');
  filterLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const group = link.closest('.catalog-filters__group');
      if (group) {
        group.querySelectorAll('a').forEach((x) => x.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    });
  });

  // 5. Newsletter form — prevent default, show "thanks" placeholder
  const newsForm = document.querySelector('.newsletter__form');
  if (newsForm) {
    newsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const lead = newsForm.parentElement.querySelector('.newsletter__lead');
      if (lead) lead.textContent = 'Спасибо. Письмо придёт в начале сезона.';
      newsForm.style.opacity = '0.4';
      newsForm.style.pointerEvents = 'none';
    });
  }
})();
```

- [ ] **Step 2: Verify**

```bash
wc -l ~/Desktop/gotleb-rebrand/js/main.js
```
Expected: 50-70 lines.

- [ ] **Step 3: Commit**

```bash
cd ~/Desktop/gotleb-rebrand
git add js/main.js
git commit -m "js: mobile menu, gallery swap, size pills, catalog filter toggle"
```

---

## Task 8: Write `index.html` (main page)

**Files:**
- Create: `~/Desktop/gotleb-rebrand/index.html`

**Notes:** Замени имена фотографий ниже на реальные из `assets/photos/` (см. inventory). Пока — placeholder-имена. После Task 2 у тебя есть список — выбери:
- 1 hero photo (большое, желательно 1080+ по высоте)
- 2 category photos (Men + Women)
- 6 product photos (по две на пару — front/back) для featured-3
- Если категорийные не выделить — взять пары крупного плана

- [ ] **Step 1: Write index.html**

File: `~/Desktop/gotleb-rebrand/index.html`

```html
<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>GOTLEB — обувь ручной работы из натуральной кожи</title>
  <meta name="description" content="GOTLEB — обувь ручной работы. Натуральная кожа, ручной шов.">
  <link rel="stylesheet" href="styles/main.css">
</head>
<body>

<header class="header">
  <div class="header__inner">
    <button class="header__burger" aria-label="Меню" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
    <a class="header__logo" href="index.html">GOTLEB</a>
    <nav class="header__nav" aria-label="Главное меню">
      <a href="about.html">История</a>
      <a href="catalog.html">Коллекция</a>
      <a href="about.html#contact">Контакты</a>
    </nav>
    <div class="header__icons">
      <a href="#" aria-label="Поиск">⌕</a>
      <a href="#" aria-label="Избранное">♡</a>
      <a href="#" aria-label="Корзина">◯</a>
    </div>
  </div>
</header>

<!-- HERO -->
<section class="hero">
  <!-- TODO: replace src with actual hero photo from assets/photos/ -->
  <img class="hero__photo" src="assets/photos/HERO.jpg" alt="">
  <div class="hero__caption">
    <h1 class="t-hero">[ Обувь, которая помнит руку ]</h1>
  </div>
  <div class="hero__scroll-hint">↓</div>
</section>

<!-- ARCHIVE RULE -->
<div class="archive-rule">
  <span class="archive-rule__inner">┌─ GOTLEB — Hand-stitched leather — [ Москва · atelier ] ─┐
└──────────────────────────────────────────────────────────┘</span>
</div>

<!-- CATEGORIES -->
<section class="cats">
  <a class="cat" href="catalog.html?cat=men">
    <img src="assets/photos/CAT_MEN.jpg" alt="">
    <div class="cat__title">
      <p class="cat__title-main">Мужская</p>
      <p class="cat__title-meta">Men's · [ N ] pairs · Spring 2026</p>
    </div>
  </a>
  <a class="cat" href="catalog.html?cat=women">
    <img src="assets/photos/CAT_WOMEN.jpg" alt="">
    <div class="cat__title">
      <p class="cat__title-main">Женская</p>
      <p class="cat__title-meta">Women's · [ N ] pairs · Spring 2026</p>
    </div>
  </a>
</section>

<!-- ARCHIVE RULE -->
<div class="archive-rule">
  <span class="archive-rule__inner">┌─ spring collection — 03 selected pairs ─┐
└──────────────────────────────────────────┘</span>
</div>

<!-- FEATURED 3 -->
<section class="products">
  <a class="product-card" href="product.html">
    <div class="product-card__photo">
      <img class="is-front" src="assets/photos/P1_A.jpg" alt="Oxford 04">
      <img class="is-back"  src="assets/photos/P1_B.jpg" alt="">
    </div>
    <div class="product-card__info">
      <p class="product-card__name">Oxford 04</p>
      <p class="product-card__meta">Calf · 28 000 ₽</p>
    </div>
  </a>
  <a class="product-card" href="product.html">
    <div class="product-card__photo">
      <img class="is-front" src="assets/photos/P2_A.jpg" alt="Derby 02">
      <img class="is-back"  src="assets/photos/P2_B.jpg" alt="">
    </div>
    <div class="product-card__info">
      <p class="product-card__name">Derby 02</p>
      <p class="product-card__meta">Calf · 26 000 ₽</p>
    </div>
  </a>
  <a class="product-card" href="product.html">
    <div class="product-card__photo">
      <img class="is-front" src="assets/photos/P3_A.jpg" alt="Loafer 01">
      <img class="is-back"  src="assets/photos/P3_B.jpg" alt="">
    </div>
    <div class="product-card__info">
      <p class="product-card__name">Loafer 01</p>
      <p class="product-card__meta">Suede · 24 000 ₽</p>
    </div>
  </a>
</section>

<!-- ARCHIVE RULE -->
<div class="archive-rule">
  <span class="archive-rule__inner">┌─ manifest ─────────────────────────────────┐
└────────────────────────────────────────────┘</span>
</div>

<!-- MANIFESTO -->
<section class="manifesto">
  <p class="manifesto__quote">[ GOTLEB — это … одна-две фразы манифеста от Андрея, до 40 слов ]</p>
</section>

<!-- ARCHIVE RULE -->
<div class="archive-rule">
  <span class="archive-rule__inner">┌─ archive — letters from the atelier ─┐
└───────────────────────────────────────┘</span>
</div>

<!-- NEWSLETTER -->
<section class="newsletter">
  <p class="newsletter__lead">Письма из мастерской. Раз в сезон.</p>
  <form class="newsletter__form" action="#">
    <input type="email" class="newsletter__input" placeholder="email" aria-label="email" required>
    <button type="submit" class="newsletter__submit">подписаться</button>
  </form>
</section>

<!-- FOOTER -->
<footer class="footer">
  <div class="footer__cols">
    <div class="footer__col">
      <h4>GOTLEB</h4>
      <ul>
        <li>обувь ручной работы</li>
        <li>с [ года ]</li>
        <li><a href="about.html">история</a></li>
      </ul>
    </div>
    <div class="footer__col">
      <h4>Клиенту</h4>
      <ul>
        <li><a href="#">доставка</a></li>
        <li><a href="#">возврат</a></li>
        <li><a href="#">оплата</a></li>
        <li><a href="#">уход</a></li>
      </ul>
    </div>
    <div class="footer__col">
      <h4>Контакт</h4>
      <ul>
        <li><a href="mailto:a.zhakevich@gmail.com">a.zhakevich@gmail.com</a></li>
        <li><a href="tel:+79263435468">+7 926 343 5468</a></li>
        <li><a href="https://t.me/a_zhakevich">t.me/a_zhakevich</a></li>
      </ul>
    </div>
  </div>
  <div class="footer__bottom">© 2026 GOTLEB · [ Москва ]</div>
</footer>

<script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Update photo filenames**

```bash
cd ~/Desktop/gotleb-rebrand/assets/photos
ls *.jpg *.jpeg *.png 2>/dev/null | head -10
```

Затем в `index.html` замени `HERO.jpg`, `CAT_MEN.jpg`, `CAT_WOMEN.jpg`, `P1_A.jpg` ... `P3_B.jpg` на актуальные имена из inventory.

- [ ] **Step 3: Verify in browser**

```bash
cd ~/Desktop/gotleb-rebrand
python3 -m http.server 8000 &
sleep 1
open http://localhost:8000/index.html
```

Expected: главная открывается, hero виден, ASCII-перебивки видны, 3 продуктовые карточки рендерятся, hover на карточке переключает фото.

- [ ] **Step 4: Commit**

```bash
cd ~/Desktop/gotleb-rebrand
git add index.html
git commit -m "page: main (hero, archive rules, categories, featured 3, manifesto, newsletter, footer)"
```

---

## Task 9: Write `catalog.html`

**Files:**
- Create: `~/Desktop/gotleb-rebrand/catalog.html`

- [ ] **Step 1: Write catalog.html with 12 product cards (placeholders)**

File: `~/Desktop/gotleb-rebrand/catalog.html`

```html
<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Коллекция — GOTLEB</title>
  <link rel="stylesheet" href="styles/main.css">
</head>
<body>

<header class="header">
  <div class="header__inner">
    <button class="header__burger" aria-label="Меню" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
    <a class="header__logo" href="index.html">GOTLEB</a>
    <nav class="header__nav" aria-label="Главное меню">
      <a href="about.html">История</a>
      <a href="catalog.html" class="is-active">Коллекция</a>
      <a href="about.html#contact">Контакты</a>
    </nav>
    <div class="header__icons">
      <a href="#" aria-label="Поиск">⌕</a>
      <a href="#" aria-label="Избранное">♡</a>
      <a href="#" aria-label="Корзина">◯</a>
    </div>
  </div>
</header>

<!-- CATALOG HEAD -->
<div class="catalog-head">
  <h1 class="catalog-head__title">Коллекция</h1>
  <div class="catalog-filters">
    <div class="catalog-filters__group" role="tablist">
      <a href="#" class="is-active">Всё</a>
      <a href="#">Мужская</a>
      <a href="#">Женская</a>
    </div>
    <div class="catalog-filters__group">
      <a href="#" class="is-active">Новые</a>
      <a href="#">По цене</a>
    </div>
  </div>
</div>

<!-- ARCHIVE RULE -->
<div class="archive-rule">
  <span class="archive-rule__inner">┌─ spring 2026 — [ N ] pairs · hand-stitched · calf, suede, cordovan ─┐
└──────────────────────────────────────────────────────────────────────┘</span>
</div>

<!-- PRODUCTS GRID — replace placeholders with real photos -->
<section class="products">
  <!-- repeat product-card 12 times -->
  <a class="product-card" href="product.html">
    <div class="product-card__photo">
      <img class="is-front" src="assets/photos/P1_A.jpg" alt="">
      <img class="is-back"  src="assets/photos/P1_B.jpg" alt="">
    </div>
    <div class="product-card__info">
      <p class="product-card__name">Oxford 04</p>
      <p class="product-card__meta">Calf · 28 000 ₽</p>
    </div>
  </a>
  <a class="product-card" href="product.html">
    <div class="product-card__photo">
      <img class="is-front" src="assets/photos/P2_A.jpg" alt="">
      <img class="is-back"  src="assets/photos/P2_B.jpg" alt="">
    </div>
    <div class="product-card__info">
      <p class="product-card__name">Derby 02</p>
      <p class="product-card__meta">Calf · 26 000 ₽</p>
    </div>
  </a>
  <a class="product-card" href="product.html">
    <div class="product-card__photo">
      <img class="is-front" src="assets/photos/P3_A.jpg" alt="">
      <img class="is-back"  src="assets/photos/P3_B.jpg" alt="">
    </div>
    <div class="product-card__info">
      <p class="product-card__name">Loafer 01</p>
      <p class="product-card__meta">Suede · 24 000 ₽</p>
    </div>
  </a>
  <a class="product-card" href="product.html">
    <div class="product-card__photo">
      <img class="is-front" src="assets/photos/P4_A.jpg" alt="">
      <img class="is-back"  src="assets/photos/P4_B.jpg" alt="">
    </div>
    <div class="product-card__info">
      <p class="product-card__name">Monk 03</p>
      <p class="product-card__meta">Cordovan · 32 000 ₽</p>
    </div>
  </a>
  <a class="product-card" href="product.html">
    <div class="product-card__photo">
      <img class="is-front" src="assets/photos/P5_A.jpg" alt="">
      <img class="is-back"  src="assets/photos/P5_B.jpg" alt="">
    </div>
    <div class="product-card__info">
      <p class="product-card__name">Boot 05</p>
      <p class="product-card__meta">Calf · 36 000 ₽</p>
    </div>
  </a>
  <a class="product-card" href="product.html">
    <div class="product-card__photo">
      <img class="is-front" src="assets/photos/P6_A.jpg" alt="">
      <img class="is-back"  src="assets/photos/P6_B.jpg" alt="">
    </div>
    <div class="product-card__info">
      <p class="product-card__name">Loafer 02</p>
      <p class="product-card__meta">Suede · 24 000 ₽</p>
    </div>
  </a>
  <a class="product-card" href="product.html">
    <div class="product-card__photo">
      <img class="is-front" src="assets/photos/P7_A.jpg" alt="">
      <img class="is-back"  src="assets/photos/P7_B.jpg" alt="">
    </div>
    <div class="product-card__info">
      <p class="product-card__name">Oxford 06</p>
      <p class="product-card__meta">Calf · 30 000 ₽</p>
    </div>
  </a>
  <a class="product-card" href="product.html">
    <div class="product-card__photo">
      <img class="is-front" src="assets/photos/P8_A.jpg" alt="">
      <img class="is-back"  src="assets/photos/P8_B.jpg" alt="">
    </div>
    <div class="product-card__info">
      <p class="product-card__name">Boot 07</p>
      <p class="product-card__meta">Suede · 38 000 ₽</p>
    </div>
  </a>
  <a class="product-card" href="product.html">
    <div class="product-card__photo">
      <img class="is-front" src="assets/photos/P9_A.jpg" alt="">
      <img class="is-back"  src="assets/photos/P9_B.jpg" alt="">
    </div>
    <div class="product-card__info">
      <p class="product-card__name">Derby 08</p>
      <p class="product-card__meta">Calf · 27 000 ₽</p>
    </div>
  </a>
</section>

<!-- ARCHIVE RULE END -->
<div class="archive-rule">
  <span class="archive-rule__inner">┌─ end of archive — All [ N ] pairs shown · last update 2026-05-10 ─┐
└────────────────────────────────────────────────────────────────────┘</span>
</div>

<!-- FOOTER (same as index) -->
<footer class="footer">
  <div class="footer__cols">
    <div class="footer__col"><h4>GOTLEB</h4><ul><li>обувь ручной работы</li><li>с [ года ]</li><li><a href="about.html">история</a></li></ul></div>
    <div class="footer__col"><h4>Клиенту</h4><ul><li><a href="#">доставка</a></li><li><a href="#">возврат</a></li><li><a href="#">оплата</a></li><li><a href="#">уход</a></li></ul></div>
    <div class="footer__col"><h4>Контакт</h4><ul><li><a href="mailto:a.zhakevich@gmail.com">a.zhakevich@gmail.com</a></li><li><a href="tel:+79263435468">+7 926 343 5468</a></li><li><a href="https://t.me/a_zhakevich">t.me/a_zhakevich</a></li></ul></div>
  </div>
  <div class="footer__bottom">© 2026 GOTLEB · [ Москва ]</div>
</footer>

<script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Replace placeholder photo names from inventory**

В `catalog.html` замени `P1_A.jpg ... P9_B.jpg` на актуальные имена. Если у Андрея <9 пар — удали лишние карточки. Если >9 — добавь по шаблону.

- [ ] **Step 3: Verify in browser**

Открыть `http://localhost:8000/catalog.html`. Сетка 3-кол на десктопе, 2 на планшете, 1 на мобиле.

- [ ] **Step 4: Commit**

```bash
cd ~/Desktop/gotleb-rebrand
git add catalog.html
git commit -m "page: catalog (filter bar, archive rules, 9 product cards)"
```

---

## Task 10: Write `product.html`

**Files:**
- Create: `~/Desktop/gotleb-rebrand/product.html`

- [ ] **Step 1: Write product.html (Oxford 04 demo)**

File: `~/Desktop/gotleb-rebrand/product.html`

```html
<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Oxford 04 — GOTLEB</title>
  <link rel="stylesheet" href="styles/main.css">
</head>
<body>

<header class="header">
  <div class="header__inner">
    <button class="header__burger" aria-label="Меню" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
    <a class="header__logo" href="index.html">GOTLEB</a>
    <nav class="header__nav" aria-label="Главное меню">
      <a href="about.html">История</a>
      <a href="catalog.html" class="is-active">Коллекция</a>
      <a href="about.html#contact">Контакты</a>
    </nav>
    <div class="header__icons">
      <a href="#" aria-label="Поиск">⌕</a>
      <a href="#" aria-label="Избранное">♡</a>
      <a href="#" aria-label="Корзина">◯</a>
    </div>
  </div>
</header>

<!-- BREADCRUMB -->
<div class="container" style="padding-top: var(--space-3);">
  <a href="catalog.html" class="t-meta" style="text-decoration: none; opacity: 0.7;">← коллекция</a>
</div>

<!-- PDP -->
<section class="pdp">
  <div>
    <div class="pdp__gallery-main">
      <img src="assets/photos/P1_A.jpg" alt="Oxford 04">
    </div>
    <div class="pdp__thumbs">
      <button class="pdp__thumb is-active"><img src="assets/photos/P1_A.jpg" alt=""></button>
      <button class="pdp__thumb"><img src="assets/photos/P1_B.jpg" alt=""></button>
      <button class="pdp__thumb"><img src="assets/photos/P1_C.jpg" alt=""></button>
      <button class="pdp__thumb"><img src="assets/photos/P1_D.jpg" alt=""></button>
    </div>
  </div>

  <div class="pdp__info">
    <h1 class="pdp__title">Oxford 04</h1>
    <div class="pdp__rule"></div>
    <p class="pdp__material">Телячья кожа · ручной шов</p>
    <p class="pdp__price">28 000 ₽</p>

    <pre class="specs-block">┌─ specs ───────────┐
│ sku    OX-04      │
│ leather  calf     │
│ sole     leather  │
│ stitch   goodyear │
│ last     [ name ] │
└───────────────────┘</pre>

    <div class="sizes">
      <p class="sizes__label">размер</p>
      <div class="sizes__pills">
        <button class="size-pill">41</button>
        <button class="size-pill">42</button>
        <button class="size-pill is-active">43</button>
        <button class="size-pill">44</button>
        <button class="size-pill">45</button>
        <button class="size-pill">46</button>
      </div>
    </div>

    <div class="pdp__actions">
      <a href="#" class="hairline-link">в корзину</a>
      <a href="#" class="hairline-link">в избранное</a>
    </div>

    <div class="pdp__delivery">
      <p class="pdp__delivery-title">Доставка по России</p>
      <p class="pdp__delivery-text">3–7 дней · СДЭК / Почта России</p>
    </div>
  </div>
</section>

<!-- ARCHIVE RULE -->
<div class="archive-rule" style="margin-top: var(--space-7);">
  <span class="archive-rule__inner">┌─ from the atelier ─────────────────────────────┐
└────────────────────────────────────────────────┘</span>
</div>

<section class="manifesto">
  <p class="manifesto__quote">[ Заглушка от Андрея — 2-3 строки про модель Oxford: про колодку, материал, кому и для чего ]</p>
</section>

<!-- ARCHIVE RULE -->
<div class="archive-rule">
  <span class="archive-rule__inner">┌─ similar pairs ─┐
└─────────────────┘</span>
</div>

<!-- SIMILAR -->
<section class="products" style="grid-template-columns: repeat(4, 1fr);">
  <a class="product-card" href="product.html">
    <div class="product-card__photo">
      <img class="is-front" src="assets/photos/P2_A.jpg" alt="">
      <img class="is-back"  src="assets/photos/P2_B.jpg" alt="">
    </div>
    <div class="product-card__info">
      <p class="product-card__name">Derby 02</p>
      <p class="product-card__meta">Calf · 26 000 ₽</p>
    </div>
  </a>
  <a class="product-card" href="product.html">
    <div class="product-card__photo">
      <img class="is-front" src="assets/photos/P3_A.jpg" alt="">
      <img class="is-back"  src="assets/photos/P3_B.jpg" alt="">
    </div>
    <div class="product-card__info">
      <p class="product-card__name">Loafer 01</p>
      <p class="product-card__meta">Suede · 24 000 ₽</p>
    </div>
  </a>
  <a class="product-card" href="product.html">
    <div class="product-card__photo">
      <img class="is-front" src="assets/photos/P4_A.jpg" alt="">
      <img class="is-back"  src="assets/photos/P4_B.jpg" alt="">
    </div>
    <div class="product-card__info">
      <p class="product-card__name">Monk 03</p>
      <p class="product-card__meta">Cordovan · 32 000 ₽</p>
    </div>
  </a>
  <a class="product-card" href="product.html">
    <div class="product-card__photo">
      <img class="is-front" src="assets/photos/P7_A.jpg" alt="">
      <img class="is-back"  src="assets/photos/P7_B.jpg" alt="">
    </div>
    <div class="product-card__info">
      <p class="product-card__name">Oxford 06</p>
      <p class="product-card__meta">Calf · 30 000 ₽</p>
    </div>
  </a>
</section>

<!-- FOOTER (same as index) -->
<footer class="footer">
  <div class="footer__cols">
    <div class="footer__col"><h4>GOTLEB</h4><ul><li>обувь ручной работы</li><li>с [ года ]</li><li><a href="about.html">история</a></li></ul></div>
    <div class="footer__col"><h4>Клиенту</h4><ul><li><a href="#">доставка</a></li><li><a href="#">возврат</a></li><li><a href="#">оплата</a></li><li><a href="#">уход</a></li></ul></div>
    <div class="footer__col"><h4>Контакт</h4><ul><li><a href="mailto:a.zhakevich@gmail.com">a.zhakevich@gmail.com</a></li><li><a href="tel:+79263435468">+7 926 343 5468</a></li><li><a href="https://t.me/a_zhakevich">t.me/a_zhakevich</a></li></ul></div>
  </div>
  <div class="footer__bottom">© 2026 GOTLEB · [ Москва ]</div>
</footer>

<script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Replace placeholder photo names**

Замени `P1_A.jpg`, `P1_B.jpg`, `P1_C.jpg`, `P1_D.jpg` на 4 реальных фото одной пары обуви из inventory (если у Андрея есть).

- [ ] **Step 3: Verify in browser**

Открыть `http://localhost:8000/product.html`. Кликом на миниатюры главное фото меняется. Размер-pills работают.

- [ ] **Step 4: Commit**

```bash
cd ~/Desktop/gotleb-rebrand
git add product.html
git commit -m "page: product (gallery, specs ASCII block, sizes, atelier text, similar)"
```

---

## Task 11: Write `about.html`

**Files:**
- Create: `~/Desktop/gotleb-rebrand/about.html`

- [ ] **Step 1: Write about.html**

File: `~/Desktop/gotleb-rebrand/about.html`

```html
<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>История — GOTLEB</title>
  <link rel="stylesheet" href="styles/main.css">
</head>
<body>

<header class="header">
  <div class="header__inner">
    <button class="header__burger" aria-label="Меню" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
    <a class="header__logo" href="index.html">GOTLEB</a>
    <nav class="header__nav" aria-label="Главное меню">
      <a href="about.html" class="is-active">История</a>
      <a href="catalog.html">Коллекция</a>
      <a href="#contact">Контакты</a>
    </nav>
    <div class="header__icons">
      <a href="#" aria-label="Поиск">⌕</a>
      <a href="#" aria-label="Избранное">♡</a>
      <a href="#" aria-label="Корзина">◯</a>
    </div>
  </div>
</header>

<!-- ABOUT HERO -->
<section class="about-hero">
  <h1 class="about-hero__title">[ Каждая пара GOTLEB — это … одна-две фразы манифеста от Андрея ]</h1>
</section>

<!-- ARCHIVE RULE -->
<div class="archive-rule">
  <span class="archive-rule__inner">┌─ atelier — [ Москва ] · since [ year ] · [ N ] pairs per month ─┐
└──────────────────────────────────────────────────────────────────┘</span>
</div>

<!-- MATERIALS -->
<h2 class="t-h2" style="text-align: center; padding: 0 var(--gutter); margin: var(--space-7) 0 var(--space-5); font-style: italic;">Материалы</h2>

<div class="about-row">
  <div class="about-row__photo"><img src="assets/photos/MAT_CALF.jpg" alt=""></div>
  <div class="about-row__text">
    <h3>Calf — телячья кожа</h3>
    <p>[ заглушка от Андрея — 2-3 строки про итальянскую выделку, происхождение, тактильность ]</p>
  </div>
</div>

<div class="about-row">
  <div class="about-row__photo"><img src="assets/photos/MAT_SUEDE.jpg" alt=""></div>
  <div class="about-row__text">
    <h3>Suede — замша</h3>
    <p>[ заглушка от Андрея — про замшу: происхождение, для какой обуви, как стареет ]</p>
  </div>
</div>

<div class="about-row">
  <div class="about-row__photo"><img src="assets/photos/MAT_CORDO.jpg" alt=""></div>
  <div class="about-row__text">
    <h3>Cordovan — конская кожа</h3>
    <p>[ заглушка от Андрея — про cordovan: что это, почему дороже, как меняется со временем ]</p>
  </div>
</div>

<!-- ARCHIVE RULE -->
<div class="archive-rule">
  <span class="archive-rule__inner">┌─ stitch — Goodyear welt · hand-finished · 200+ stitches per pair ─┐
└────────────────────────────────────────────────────────────────────┘</span>
</div>

<!-- STITCH -->
<section class="about-stitch">
  <div class="about-stitch__photo"><img src="assets/photos/STITCH.jpg" alt=""></div>
  <div class="about-stitch__text">
    <h2>Шов</h2>
    <div class="about-stitch__rule"></div>
    <p class="t-body" style="color: var(--ink-soft);">[ заглушка от Андрея — 3-4 строки про метод: какой шов используется, сколько часов на пару, почему именно так ]</p>
  </div>
</section>

<!-- ARCHIVE RULE -->
<div class="archive-rule" style="margin-top: var(--space-7);">
  <span class="archive-rule__inner">┌─ path of a pair — Hide → Cut → Last → Stitch → Sole → Polish → Box ─┐
└──────────────────────────────────────────────────────────────────────┘</span>
</div>

<!-- PATH QUOTE -->
<section class="about-path-quote">
  <p>От куска кожи до пары — [ N ] недель.<br>[ заглушка от Андрея ]</p>
</section>

<!-- ARCHIVE RULE -->
<div class="archive-rule" id="contact">
  <span class="archive-rule__inner">┌─ contact ─────────────────────────────────────────────────────────────┐
│ a.zhakevich@gmail.com · +7 926 343 5468 · t.me/a_zhakevich           │
└───────────────────────────────────────────────────────────────────────┘</span>
</div>

<!-- CONTACT -->
<section class="manifesto">
  <p class="manifesto__quote">
    <a href="mailto:a.zhakevich@gmail.com" class="hairline-link">a.zhakevich@gmail.com</a><br>
    <a href="tel:+79263435468" class="hairline-link">+7 926 343 5468</a><br>
    <a href="https://t.me/a_zhakevich" class="hairline-link">t.me/a_zhakevich</a>
  </p>
</section>

<!-- FOOTER -->
<footer class="footer">
  <div class="footer__cols">
    <div class="footer__col"><h4>GOTLEB</h4><ul><li>обувь ручной работы</li><li>с [ года ]</li><li><a href="about.html">история</a></li></ul></div>
    <div class="footer__col"><h4>Клиенту</h4><ul><li><a href="#">доставка</a></li><li><a href="#">возврат</a></li><li><a href="#">оплата</a></li><li><a href="#">уход</a></li></ul></div>
    <div class="footer__col"><h4>Контакт</h4><ul><li><a href="mailto:a.zhakevich@gmail.com">a.zhakevich@gmail.com</a></li><li><a href="tel:+79263435468">+7 926 343 5468</a></li><li><a href="https://t.me/a_zhakevich">t.me/a_zhakevich</a></li></ul></div>
  </div>
  <div class="footer__bottom">© 2026 GOTLEB · [ Москва ]</div>
</footer>

<script src="js/main.js"></script>
</body>
</html>
```

- [ ] **Step 2: Replace placeholder photo names**

Если у Андрея нет фото материалов отдельно — взять crop'ы существующих product-фото или close-up'ы кожи с product-shoots.

- [ ] **Step 3: Verify in browser**

Открыть `http://localhost:8000/about.html`. Все секции рендерятся, ASCII-перебивки выровнены, мобильная версия (320-480px) перестраивается.

- [ ] **Step 4: Commit**

```bash
cd ~/Desktop/gotleb-rebrand
git add about.html
git commit -m "page: about (manifesto, materials, stitch, path of a pair, contact)"
```

---

## Task 12: Write `README.md`

**Files:**
- Create: `~/Desktop/gotleb-rebrand/README.md`

- [ ] **Step 1: Write README**

File: `~/Desktop/gotleb-rebrand/README.md`

```markdown
# GOTLEB — Rebrand Prototype

Концепт сайта для бренда обуви ручной работы [GOTLEB](https://gotleb.ru).
Заказчик: Андрей Жакевич.

**Эстетика:** Парижский архив (бумага + sepia + Cormorant Italic) × терминал-перебивки (JetBrains Mono ASCII между секциями).

## Запуск локально

```bash
cd gotleb-rebrand
python3 -m http.server 8000
open http://localhost:8000/
```

Без билд-степа, без npm. Чистая статика.

## Деплой

GitHub Pages, ветка `main`, корень репозитория.
URL: `https://vasiliiberezinart-ops.github.io/gotleb-rebrand/`

```bash
git push origin main
# Settings → Pages → Source: Deploy from branch → main / (root)
```

## Структура

```
.
├── index.html         главная
├── catalog.html       коллекция (9 пар)
├── product.html       карточка одной модели (Oxford 04)
├── about.html         история / материалы / шов / контакт
├── styles/
│   ├── tokens.css     CSS-переменные (палитра, шрифты, сетка)
│   └── main.css       компоненты, layout, состояния
├── js/main.js         меню, gallery, размер-pills, фильтры
├── assets/
│   ├── photos/        фото из gotleb.ru (Tilda CDN)
│   └── icons/         logo + grain.svg
└── docs/
    ├── specs/         design-doc
    └── plans/         implementation plan
```

## Что заменить (заглушки от Андрея)

Все заглушки помечены `[ ... ]` в HTML. Список полей — в `docs/specs/2026-05-10-gotleb-rebrand-design.md` §6 и §10:

- Hero-фраза главной (1 строка)
- Манифест-блок (2-3 фразы)
- Город мастерской, год основания, пар/мес
- Тип шва
- Описания материалов (Calf / Suede / Cordovan)
- Описание шва
- Путь пары
- Описания моделей в product-карточках

## Что НЕ работает (по дизайну)

Это концепт-прототип, не production e-commerce. Не реализовано:

- Корзина и оплата (UI присутствует, логики нет)
- Личный кабинет
- Реальный поиск
- Newsletter-отправка
- Динамический каталог (товары захардкожены в HTML)
- Многоязычность

Полный список — в spec §7.

## Лицензия и шрифты

Прототип использует free Google Fonts (Cormorant Garamond, Inter, JetBrains Mono).
В production можно заменить на коммерческие близнецы: GT Sectra Italic, Söhne, в одном месте — `styles/tokens.css`.
```

- [ ] **Step 2: Commit**

```bash
cd ~/Desktop/gotleb-rebrand
git add README.md
git commit -m "docs: README — local run, deploy, structure, placeholders, scope"
```

---

## Task 13: Create GitHub repo and push

**Files:**
- Modify: git remote

- [ ] **Step 1: Verify gh auth**

```bash
gh auth status
```
Expected: "Logged in to github.com account vasiliiberezinart-ops".

If not logged in: `gh auth login` (interactive).

- [ ] **Step 2: Create remote repo**

```bash
cd ~/Desktop/gotleb-rebrand
gh repo create vasiliiberezinart-ops/gotleb-rebrand \
  --public \
  --description "GOTLEB rebrand prototype — Парижский архив × ASCII" \
  --source=. \
  --remote=origin \
  --push
```

Expected: репо создан, push прошёл.

- [ ] **Step 3: Enable GitHub Pages**

```bash
gh api -X POST /repos/vasiliiberezinart-ops/gotleb-rebrand/pages \
  -f "source[branch]=main" \
  -f "source[path]=/"
```

Expected: 201 Created with Pages config.

If Pages already configured: ignore the 409 error.

- [ ] **Step 4: Wait for first deploy and check URL**

```bash
sleep 60
curl -sI https://vasiliiberezinart-ops.github.io/gotleb-rebrand/ | head -1
```

Expected: `HTTP/2 200`. Если `404` — подождать 1-2 минуты, повторить.

- [ ] **Step 5: Open in browser**

```bash
open https://vasiliiberezinart-ops.github.io/gotleb-rebrand/
```

---

## Task 14: Acceptance smoke check

**Files:** none (verification only)

Запусти локально и пройди по acceptance criteria из spec §9:

- [ ] **Step 1: Open all 4 pages**

```bash
cd ~/Desktop/gotleb-rebrand
python3 -m http.server 8000 &
for p in index.html catalog.html product.html about.html; do
  open "http://localhost:8000/$p"
  sleep 1
done
```

Expected: каждая страница рендерится без 404 и без console errors.

- [ ] **Step 2: Hairline-нав работает**

Кликни по `ИСТОРИЯ`, `КОЛЛЕКЦИЯ`, `КОНТАКТЫ` на каждой странице — переходы работают, активная подсвечена.

- [ ] **Step 3: Hover на product-card**

На главной и каталоге наведи мышь на карточку — фото переключается на back, фон карточки темнеет до `paper-deep`.

- [ ] **Step 4: ASCII-перебивки выровнены**

На десктопе (≥1200px) и мобиле (≤480px) ASCII-блоки видны и читаются. Mobile может скроллиться горизонтально внутри `.archive-rule` — это OK.

- [ ] **Step 5: Mobile breakpoint**

Открой DevTools → toggle device toolbar → 375x667 (iPhone SE). Сетка product-cards становится 2 → 1, hero уменьшается до 80vh, header burger-menu работает.

- [ ] **Step 6: Все фото грузятся**

DevTools Network tab → перезагрузка → проверить нет 404 на `assets/photos/*`. Если есть — заменить placeholder-имена в HTML на реальные из `assets/photos/_inventory.txt`.

- [ ] **Step 7: Final commit**

Если всё ОК и были последние правки на photo-имена:

```bash
cd ~/Desktop/gotleb-rebrand
git status
git add -A
git diff --cached --stat
git commit -m "fix: replace placeholder photo names with inventory" || echo "Nothing to commit"
git push origin main
```

- [ ] **Step 8: Send Андрею**

Готово. Андрею пишем:

> «Концепт ребрендинга — `https://vasiliiberezinart-ops.github.io/gotleb-rebrand/`. Внутри 4 экрана: главная, коллекция, карточка модели, история. Эстетика: бумажный фон + ручной шрифт + терминальные перебивки. Все заглушки `[ ... ]` ждут текстов от тебя — список вопросов прислал отдельно (см. open questions). Пройдись, скажи, идёт ли направление.»

И список open questions из spec §10 — в письме отдельным блоком.

---

## Self-review (executed)

**1. Spec coverage:**
- §1 Brief → прототип в Tasks 8-11
- §2 эстетические решения → реализованы в Tasks 3-5
- §3 архитектура → Task 1, 2
- §4 design system → Task 3-4
- §5.1-5.4 экраны → Tasks 8-11
- §6 контент-заглушки → присутствуют как `[ ... ]` в каждом HTML
- §7 скоуп (что НЕ делаем) → README §"Что НЕ работает"
- §8 deliverables → весь plan
- §9 acceptance → Task 14
- §10 open questions → README + send-to-Андрей в T14.S8

Все секции покрыты.

**2. Placeholder scan:**
- Photos `P1_A.jpg ... P9_B.jpg` — это intentional placeholders, заменяемые из inventory в Steps "replace placeholder photo names". Помечены как TODO в коде.
- Контент `[ ... ]` — тоже intentional, ждёт текстов Андрея, документировано в README.
- Никаких "TBD" / "implement later" / "similar to Task N".

**3. Type consistency:**
- CSS-классы согласованы: `.archive-rule`, `.archive-rule__inner`, `.product-card`, `.product-card__photo`, `.pdp__*` — везде одинаковые имена.
- HTML использует `class="header__burger"` — соответствует CSS.
- `is-front` / `is-back` — согласованы между HTML и CSS hover-rule.
- ASCII-перебивки используют `┌─ ... ─┐` / `└─...─┘` — одинаковый формат на всех страницах.

Готов к выполнению.
