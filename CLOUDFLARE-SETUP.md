# Cloudflare Pages Setup Instructions

Complete guide for deploying the Conservative Caucus Action Center to Cloudflare Pages with the custom domain `action.theconservativecaucus.com`.

## Prerequisites

- GitHub account with this repository pushed
- Cloudflare account with access to manage `theconservativecaucus.com` domain
- Domain DNS already managed by Cloudflare (should already be configured if support subdomain is working)

## Step-by-Step Deployment

### 1. Push Repository to GitHub

First, ensure this repository is on GitHub:

```bash
cd ~/conservative-caucus-action-center

# Initialize git if not already done
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Action center for action.theconservativecaucus.com"

# Create GitHub repository (via GitHub CLI or web interface)
# Via GitHub CLI:
gh repo create conservative-caucus-action-center --public --source=. --remote=origin --push

# Or manually:
# 1. Go to https://github.com/new
# 2. Name: conservative-caucus-action-center
# 3. Create repository
# 4. Follow instructions to push existing repository
```

### 2. Create Cloudflare Pages Project

1. **Log in to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com/
   - Select your account

2. **Navigate to Pages**
   - Click "Workers & Pages" in the left sidebar
   - Click "Create application"
   - Click "Pages" tab
   - Click "Connect to Git"

3. **Connect GitHub Repository**
   - Click "Connect GitHub" (may need to authorize Cloudflare first time)
   - Select the `conservative-caucus-action-center` repository
   - Click "Begin setup"

4. **Configure Build Settings**
   - **Project name**: `conservative-caucus-action-center` (or your preference)
   - **Production branch**: `main` (or `master` if that's your default)
   - **Build command**: Leave empty (static HTML site)
   - **Build output directory**: `/` (root directory)
   - **Root directory**: Leave empty

5. **Environment Variables**
   - None required for this static site
   - Click "Save and Deploy"

6. **Wait for Initial Deployment**
   - Cloudflare will deploy your site
   - You'll get a temporary URL like: `https://conservative-caucus-action-center.pages.dev`
   - Test this URL to ensure the site works

### 3. Configure Custom Domain

1. **Add Custom Domain**
   - In your Cloudflare Pages project dashboard
   - Click "Custom domains" tab
   - Click "Set up a custom domain"

2. **Enter Domain**
   - Type: `action.theconservativecaucus.com`
   - Click "Continue"

3. **DNS Configuration**
   - Cloudflare will automatically detect that you manage DNS through Cloudflare
   - It will prompt you to add a CNAME record
   - Click "Activate domain"
   - Cloudflare will automatically create the DNS record for you

4. **Verify DNS**
   - The CNAME record should point to your Pages project:
     ```
     Type: CNAME
     Name: action
     Target: conservative-caucus-action-center.pages.dev
     Proxy status: Proxied (orange cloud)
     TTL: Auto
     ```

5. **SSL/TLS Certificate**
   - Cloudflare automatically provisions an SSL certificate
   - This may take a few minutes
   - Once complete, your site will be available at: `https://action.theconservativecaucus.com`

### 4. Verify Deployment

Visit your new site:
- https://action.theconservativecaucus.com

**Check that:**
- [ ] Page loads correctly
- [ ] Header logo displays
- [ ] Footer displays correctly
- [ ] Action cards render properly
- [ ] Links work (especially those pointing to support.theconservativecaucus.com)
- [ ] Mobile responsive layout works
- [ ] SSL certificate is active (padlock in browser)

## Continuous Deployment

Once set up, Cloudflare Pages automatically deploys when you push to GitHub:

```bash
cd ~/conservative-caucus-action-center

# Make changes to your files
# Then commit and push:

git add .
git commit -m "Update action cards"
git push origin main
```

Cloudflare will automatically:
1. Detect the push to GitHub
2. Build and deploy your changes
3. Your site updates within 1-2 minutes

## Managing Multiple Cloudflare Pages Projects

You now have two separate Cloudflare Pages projects:

| Subdomain | Repository | Project Name |
|-----------|------------|--------------|
| support.theconservativecaucus.com | conservative-caucus-landing-pages | (existing project) |
| action.theconservativecaucus.com | conservative-caucus-action-center | conservative-caucus-action-center |

**Benefits:**
- Each subdomain deploys independently
- Changes to one don't affect the other
- Separate git histories and deployment logs

## Rollback to Previous Version

If you need to rollback:

1. Go to Cloudflare Pages project dashboard
2. Click "Deployments" tab
3. Find the previous successful deployment
4. Click "..." menu → "Rollback to this deployment"

## Troubleshooting

### Domain Not Resolving

**Check DNS:**
```bash
dig action.theconservativecaucus.com
```

Should return CNAME pointing to `*.pages.dev`

**Solutions:**
1. Verify CNAME record exists in Cloudflare DNS
2. Ensure proxy status is "Proxied" (orange cloud)
3. Wait 5-10 minutes for DNS propagation
4. Clear browser cache

### Images Not Loading

**Check paths in HTML:**
- Images should use absolute paths: `/images/TCC Eagle.png`
- NOT relative paths: `./images/TCC Eagle.png`

**Verify files exist:**
```bash
ls ~/conservative-caucus-action-center/images/
```

### CSS Not Applying

**Check browser console** (F12 → Console tab):
- Look for 404 errors on `/css/style.css`
- Verify path is absolute: `/css/style.css`

**Clear cache:**
- Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)

### Links to Support Subdomain Not Working

Verify links in index.html use full URLs:
```html
<!-- Correct -->
<a href="https://support.theconservativecaucus.com/faithless-five/">

<!-- Incorrect -->
<a href="/faithless-five/">
```

## DNS Records Summary

After setup, your Cloudflare DNS should have:

```
Type    Name      Target                                         Proxy
CNAME   support   conservative-caucus-landing-pages.pages.dev   Proxied
CNAME   action    conservative-caucus-action-center.pages.dev   Proxied
```

Both pointing to their respective Cloudflare Pages projects.

## Performance Optimization

Cloudflare Pages automatically provides:
- ✅ Global CDN distribution
- ✅ Automatic SSL/TLS certificates
- ✅ HTTP/2 and HTTP/3 support
- ✅ Brotli compression
- ✅ DDoS protection
- ✅ Web Application Firewall (WAF)

No additional configuration needed!

## Monitoring

**View Analytics:**
1. Go to Cloudflare Pages project dashboard
2. Click "Analytics" tab
3. View:
   - Page views
   - Requests
   - Bandwidth
   - Status codes

**Deployment History:**
1. Click "Deployments" tab
2. View all deployments, their status, and logs

## Support

If you encounter issues:
1. Check Cloudflare Pages documentation: https://developers.cloudflare.com/pages/
2. View deployment logs in Cloudflare dashboard
3. Check Cloudflare Status: https://www.cloudflarestatus.com/
4. Contact Cloudflare support (if on paid plan)

## Next Steps

After successful deployment:
1. ✅ Test all action card links
2. ✅ Test on mobile devices
3. ✅ Update main website (theconservativecaucus.com) to link to action center
4. ✅ Add action center link to email campaigns
5. ✅ Monitor Google Analytics for traffic
6. ✅ Add more action items as campaigns launch

---

**Congratulations!** Your action center is now live at `action.theconservativecaucus.com`
