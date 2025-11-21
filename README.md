# The Conservative Caucus - Action Center

Action center application for **action.theconservativecaucus.com**

## Overview

This repository contains the action center grid interface where visitors can browse and engage with various conservative action campaigns. Unlike the landing pages (support subdomain), this features a grid-based organizational structure highlighting multiple simultaneous action items.

## Repository Structure

```
conservative-caucus-action-center/
├── index.html              # Main action grid page
├── css/
│   └── style.css          # Shared design system + action grid styles
├── js/
│   └── forms.js           # Form handling and validation
├── images/                # Logos and visual assets
│   ├── TCC Eagle.png
│   ├── Logo Text.png
│   └── logo_white.png
├── _headers               # Cloudflare Pages headers configuration
├── .gitignore
└── README.md
```

## Design Philosophy

- **Grid-First Layout**: Action items displayed in a responsive card grid
- **Shared Components**: Header and footer match the support subdomain for brand consistency
- **Design System**: Uses the same Conservative Caucus design tokens (red-700, navy-700, etc.)
- **Mobile-Responsive**: Grid adapts from multi-column to single-column on mobile

## Local Development

### Prerequisites
- A modern web browser
- A local web server (Python, Node.js http-server, or VS Code Live Server)

### Running Locally

**Option 1: Python (if installed)**
```bash
cd conservative-caucus-action-center
python3 -m http.server 8080
```
Then visit: http://localhost:8080

**Option 2: Node.js http-server**
```bash
cd conservative-caucus-action-center
npx http-server -p 8080
```
Then visit: http://localhost:8080

**Option 3: VS Code Live Server**
1. Install the "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"

## Adding New Action Items

To add a new action card to the grid, edit [index.html](index.html) and add a new `<article>` element inside the `.action-grid-container`:

```html
<article class="action-card">
    <div class="action-card-header">
        <span class="action-card-badge">ACTIVE</span>
        <h2>Your Action Title</h2>
    </div>
    <div class="action-card-content">
        <p>Brief description of the action item...</p>
    </div>
    <div class="action-card-footer">
        <a href="YOUR_LINK_HERE" class="btn-action-card">Take Action</a>
        <span class="action-card-meta">Petition</span>
    </div>
</article>
```

### Badge Options
- `action-card-badge` - Red "ACTIVE" badge (default)
- `action-card-badge upcoming-badge` - Gray "COMING SOON" badge

### Action Types
Update the `action-card-meta` span with the type:
- `Petition`
- `Campaign`
- `Declaration`
- `Survey`
- etc.

## Deployment to Cloudflare Pages

See [CLOUDFLARE-SETUP.md](CLOUDFLARE-SETUP.md) for complete deployment instructions.

**Quick Summary:**
1. Push this repository to GitHub
2. Create new Cloudflare Pages project
3. Connect to GitHub repository
4. Configure custom domain: `action.theconservativecaucus.com`
5. Deploy

## Relationship to Other Repositories

This repo is **separate but coordinated** with:
- `conservative-caucus-landing-pages` (support.theconservativecaucus.com)

### Shared Components
The following files are copied from the landing pages repo and should be kept in sync:
- `/css/style.css` - Design system (with action grid additions)
- `/js/forms.js` - Form handling
- `/images/TCC Eagle.png` - Header logo
- `/images/Logo Text.png` - Header logo text
- `/images/logo_white.png` - Footer logo

### Updating Shared Components

When the header, footer, or design system changes in the landing pages repo:

```bash
# From landing pages directory
cd ~/conservative-caucus-landing-pages

# Copy updated files to action center
cp css/style.css ~/conservative-caucus-action-center/css/
cp js/forms.js ~/conservative-caucus-action-center/js/
cp images/TCC\ Eagle.png ~/conservative-caucus-action-center/images/
cp images/Logo\ Text.png ~/conservative-caucus-action-center/images/
cp images/logo_white.png ~/conservative-caucus-action-center/images/

# Then commit and deploy action center
cd ~/conservative-caucus-action-center
git add .
git commit -m "Update shared components from landing pages"
git push
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome for Android)
- Graceful degradation for older browsers

## Analytics

Google Analytics is configured with ID: `G-G0VRPWL4YS`

## Contact

**The Conservative Caucus**
- Phone: 540-219-4536
- Email: info@theconservativecaucus.com
- Address: 3057 Nutley Street, Suite 502, Fairfax, VA 22031

## License

© 2025 The Conservative Caucus. All rights reserved.
