# ProPair Marketing Site

Static marketing website for [mypropair.com](https://www.mypropair.com). Built with Astro, hosted on Hostinger.

## Architecture

This is a **standalone static site** — completely independent from the ProPair app infrastructure (Firebase, Cloud Functions, Cloud Run). The only integration point is the early access signup form, which writes leads directly to the production Firestore `earlyAccessLeads` collection using the Firebase JS SDK.

```
mypropair.com (Hostinger)
  └── Static HTML/CSS/JS (Astro build output)
        └── Early Access Form → Firebase JS SDK → propair-prod Firestore
```

The Firebase client-side API keys in `.env` are safe to expose in browser JavaScript. They only grant access as defined by Firestore security rules (unauthenticated create with field validation, no reads).

## Local Development

```bash
# Install dependencies
npm install

# Copy environment template and fill in values
cp .env.example .env
# Edit .env with your Firebase config (see .env.example for details)

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### How it works

1. Push to `main` branch
2. GitHub Actions builds the Astro site with production Firebase config
3. Build output is pushed to the `build` branch
4. Hostinger's Git auto-deployment pulls from `build` into `public_html`
5. Site is live at mypropair.com

### Hostinger Setup (one-time)

1. Log into [hPanel](https://hpanel.hostinger.com)
2. Go to **Websites** → **mypropair.com** → **Git** (under Advanced)
3. Add repository:
   - **Repository URL**: `https://github.com/yaronhayo/propair-marketing.git`
   - **Branch**: `build`
   - **Install Path**: leave empty (deploys to `/public_html`)
4. Click **Auto Deployment** and copy the Webhook URL
5. In GitHub repo → **Settings** → **Webhooks** → **Add webhook**:
   - **Payload URL**: paste the Hostinger webhook URL
   - **Content type**: `application/json`
   - **Events**: Just the push event
6. Done — every push to `main` auto-deploys

### GitHub Secrets (one-time)

Go to GitHub repo → **Settings** → **Secrets and variables** → **Actions** and add:

| Secret | Value |
|--------|-------|
| `PUBLIC_FIREBASE_API_KEY` | Firebase web API key from propair-prod |
| `PUBLIC_FIREBASE_AUTH_DOMAIN` | `propair-prod.firebaseapp.com` |
| `PUBLIC_FIREBASE_PROJECT_ID` | `propair-prod` |
| `PUBLIC_FIREBASE_STORAGE_BUCKET` | `propair-prod.firebasestorage.app` |
| `PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `265412841094` |
| `PUBLIC_FIREBASE_APP_ID` | Firebase web app ID from propair-prod |
| `PUBLIC_FIREBASE_MEASUREMENT_ID` | GA measurement ID |

### DNS (already configured)

| Type | Name | Value |
|------|------|-------|
| A | @ | 199.36.158.100 |
| A | @ | 199.36.158.101 |
| CNAME | www | mypropair.com |

## Project Structure

```
marketing-site/
├── src/
│   ├── components/
│   │   └── EarlyAccessForm.astro    # Lead capture form → Firestore
│   ├── layouts/
│   │   └── Layout.astro             # Base layout with SEO meta tags
│   └── pages/
│       └── index.astro              # Landing page
├── public/
│   ├── robots.txt                   # Search engine crawling rules
│   ├── sitemap.xml                  # Sitemap for SEO
│   └── propair-og-card.png          # Social sharing image
├── .env.example                     # Environment variable template
├── .github/workflows/deploy.yml     # CI/CD pipeline
├── astro.config.mjs                 # Astro configuration
└── package.json
```

## Related Repos

- **propair** (main repo) — Flutter app, Cloud Functions, Admin Dashboard, Firestore rules
- **propair-marketing** (this repo) — Marketing site at mypropair.com
