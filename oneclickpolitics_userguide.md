# OneClickPolitics Widget Implementation Guide for Cloudflare Pages

## Quick Reference for Self-Hosting Advocacy Campaigns

### Table of Contents
1. [Prerequisites](#prerequisites)
2. [Campaign Setup](#campaign-setup)
3. [HTML Template](#html-template)
4. [Deployment](#deployment)
5. [Troubleshooting](#troubleshooting)
6. [Best Practices](#best-practices)

---

## Prerequisites

- Active OneClickPolitics subscription
- Cloudflare account with Pages enabled
- GitHub account (recommended for CI/CD)
- Basic HTML/CSS knowledge
- Completed campaign in OneClickPolitics platform

---

## Campaign Setup

### 1. Configure OneClickPolitics Account

**Settings → Account Basics:**
- Account name
- Website URL
- Contact email/phone
- Social media links
- Organization logo

### 2. Create Campaign

**Navigate to: Add Campaign**

**Campaign Basics:**
```
Campaign Name: [Internal use only]
Country: United States | Canada | Australia | UK
Campaign Type: Targeted Delivery | Regulation Document
Content Type: Single Content | Multi-Content
Delivery Type: Immediate | Delayed
Actions: Email | Phone | Video | X/Twitter
Library of Congress Topic: [If targeting Congress]
```

### 3. Campaign Content

**Widget Content:**
- Title: Attention-grabbing CTA
- Subtitle: Additional context
- Custom Questions: Up to 4 (Short Text or Dropdown)

**Email Content (if applicable):**
- Email Subject
- Email Body
- Generate 5-10 variations using AI
- No salutations/closings (added automatically)

**Phone Content (if applicable):**
- Call script/talking points
- Custom greeting recording

**Video Content (if applicable):**
- Video introduction
- Opt-in text for reuse permission

### 4. Campaign Settings

**Form Settings:**
```
☐ Include Opt-In Box
☐ Make Phone Field Required (REQUIRED for US national)
☐ Make Prefix Required (REQUIRED for US national)
☐ Hide Prefix
☐ Kiosk Mode
☐ Accept International Signatures
```

**Delivery Settings:**
```
☐ Constituent Mail Only (AUTO-ON for US Congress)
☐ Petition Mode
☐ Verify Sender's Email
☐ Redirect After Action: [URL]
```

**Social Share Settings:**
```
Shared Link: [Your campaign page URL]
X Share Link: [Pre-filled tweet text]
X Mention Tag: [YourHandle without @]
```

### 5. Widget Theme
```
Background Color: #______
Button Color: #______
Font Color: #______
Font Family: [Select]
Apply to: This campaign | All campaigns
```

### 6. Target Selection

**US Options:**
- Congress (Committees)
- States (Governors, Legislators, Committees)
- Local (Mayors, City Councils)

**Other Countries:**
- Canada: Federal, Provinces
- UK: House of Commons
- Australia: Parliament, States

**Custom Targets:**
- Individual targets (email, phone, X handle)
- Bulk upload via CSV
- Custom Groups for frequent targets

**⚠️ IMPORTANT:** US Congress = Constituent Mail Only

### 7. Get Embed Codes

**Display Options → Campaign Widget tab**
- Copy HTML Library Code (for `<head>`)
- Copy HTML Widget Code (for `<body>`)
- Note your Campaign ID from the widget code

---

## HTML Template

### Complete Landing Page Template
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Take Action: [Issue Name] | [Organization]</title>
    <meta name="description" content="Contact your representatives about [issue]. Make your voice heard.">
    
    <!-- Preconnect for performance -->
    <link rel="preconnect" href="https://widget-files.global.ssl.fastly.net">
    <link rel="dns-prefetch" href="https://widget-files.global.ssl.fastly.net">
    
    <!-- OneClickPolitics Library Code - ADD ONCE -->
    <script src="https://widget-files.global.ssl.fastly.net/ocp-widget.js" type="module"></script>
    <link href="https://widget-files.global.ssl.fastly.net/ocp-widget.css" rel="stylesheet" />
    
    <!-- Open Graph / Social Media -->
    <meta property="og:title" content="Take Action: [Issue Name]">
    <meta property="og:description" content="Contact your representatives about [issue]">
    <meta property="og:image" content="https://your-domain.pages.dev/share-image.jpg">
    <meta property="og:url" content="https://your-domain.pages.dev">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Take Action: [Issue Name]">
    <meta name="twitter:description" content="Contact your representatives about [issue]">
    <meta name="twitter:image" content="https://your-domain.pages.dev/share-image.jpg">
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        header {
            background: #003366;
            color: white;
            padding: 20px 0;
            margin-bottom: 40px;
        }
        
        header .container {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .logo {
            max-height: 60px;
        }
        
        .hero {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 60px 20px;
            margin-bottom: 40px;
            border-radius: 10px;
            text-align: center;
        }
        
        .hero h1 {
            color: white;
            font-size: 3rem;
            margin-bottom: 20px;
        }
        
        .hero p {
            font-size: 1.3rem;
            max-width: 800px;
            margin: 0 auto;
        }
        
        .content-section {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-bottom: 40px;
        }
        
        .info-panel {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 10px;
            border-left: 4px solid #003366;
        }
        
        .info-panel h2 {
            color: #003366;
            margin-bottom: 15px;
        }
        
        .info-panel ul {
            list-style-position: inside;
            margin-left: 20px;
        }
        
        .info-panel li {
            margin-bottom: 10px;
        }
        
        .widget-container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .urgency-banner {
            background: #fff3cd;
            border: 2px solid #ffc107;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 30px;
            text-align: center;
        }
        
        .progress-bar {
            background: #e9ecef;
            border-radius: 10px;
            height: 30px;
            margin-top: 15px;
            overflow: hidden;
        }
        
        .progress {
            background: #28a745;
            height: 100%;
            transition: width 0.3s ease;
        }
        
        .cta-section {
            text-align: center;
            padding: 40px;
            background: #f8f9fa;
            border-radius: 10px;
            margin-top: 40px;
        }
        
        footer {
            background: #003366;
            color: white;
            text-align: center;
            padding: 30px 20px;
            margin-top: 60px;
        }
        
        @media (max-width: 768px) {
            .content-section {
                grid-template-columns: 1fr;
            }
            
            .hero h1 {
                font-size: 2rem;
            }
            
            .hero p {
                font-size: 1.1rem;
            }
        }
    </style>
</head>
<body>
    <header>
        <div class="container">
            <img src="your-logo.png" alt="Organization Name" class="logo">
            <nav>
                <!-- Optional navigation -->
            </nav>
        </div>
    </header>

    <main>
        <section class="hero">
            <div class="container">
                <h1>Take Action on [Issue Name]</h1>
                <p>Your voice matters. Contact your representatives now and make a difference on this critical issue.</p>
            </div>
        </section>

        <div class="container">
            <!-- Optional: Urgency Banner -->
            <div class="urgency-banner">
                <h3>⚠️ Act Now - Vote Scheduled for [Date]</h3>
                <p>We need 1,000 messages by [deadline]. Currently at: <strong>750</strong></p>
                <div class="progress-bar">
                    <div class="progress" style="width: 75%"></div>
                </div>
            </div>

            <div class="content-section">
                <div class="info-panel">
                    <h2>Why This Matters</h2>
                    <p>Provide compelling context about your issue here. Explain:</p>
                    <ul>
                        <li>The current situation or problem</li>
                        <li>Why action is needed now</li>
                        <li>The impact on your community</li>
                        <li>What you're asking legislators to do</li>
                    </ul>
                    
                    <h2 style="margin-top: 30px;">What Happens Next</h2>
                    <p>When you take action:</p>
                    <ul>
                        <li>Your message goes directly to your representatives</li>
                        <li>You'll receive a confirmation email</li>
                        <li>You can track the campaign's progress</li>
                        <li>You'll stay informed about updates</li>
                    </ul>
                </div>

                <div class="widget-container">
                    <!-- OneClickPolitics Widget Code - REPLACE CID -->
                    <one-click-widget cid="YOUR_CAMPAIGN_ID_HERE" language="en" env="staging"></one-click-widget>
                </div>
            </div>

            <div class="cta-section">
                <h2>Share This Campaign</h2>
                <p>Help us reach more people! Share this campaign with your network.</p>
                <!-- Add social sharing buttons here -->
            </div>
        </div>
    </main>

    <footer>
        <div class="container">
            <p>&copy; 2024 Your Organization Name. All rights reserved.</p>
            <p>Contact: your-email@organization.org | (555) 123-4567</p>
        </div>
    </footer>
</body>
</html>
```

### Minimal Template
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Take Action | Your Organization</title>
    
    <!-- OneClickPolitics Library Code -->
    <script src="https://widget-files.global.ssl.fastly.net/ocp-widget.js" type="module"></script>
    <link href="https://widget-files.global.ssl.fastly.net/ocp-widget.css" rel="stylesheet" />
    
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
    </style>
</head>
<body>
    <h1>Take Action</h1>
    <p>Contact your representatives about this important issue.</p>
    
    <!-- Widget -->
    <one-click-widget cid="YOUR_CAMPAIGN_ID_HERE" language="en" env="staging"></one-click-widget>
</body>
</html>
```

### Multiple Campaigns Template
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Active Campaigns | Your Organization</title>
    
    <!-- OneClickPolitics Library Code - ADD ONCE -->
    <script src="https://widget-files.global.ssl.fastly.net/ocp-widget.js" type="module"></script>
    <link href="https://widget-files.global.ssl.fastly.net/ocp-widget.css" rel="stylesheet" />
    
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .campaign {
            margin-bottom: 60px;
            padding: 30px;
            background: #f8f9fa;
            border-radius: 10px;
        }
    </style>
</head>
<body>
    <h1>Our Active Campaigns</h1>
    
    <section class="campaign">
        <h2>Campaign 1: Issue Name</h2>
        <p>Description of campaign 1...</p>
        <one-click-widget cid="CAMPAIGN_1_ID" language="en" env="staging"></one-click-widget>
    </section>
    
    <section class="campaign">
        <h2>Campaign 2: Another Issue</h2>
        <p>Description of campaign 2...</p>
        <one-click-widget cid="CAMPAIGN_2_ID" language="en" env="staging"></one-click-widget>
    </section>
</body>
</html>
```

---

## Deployment

### Option 1: GitHub + Cloudflare Pages (Recommended)

**1. Initialize Git Repository:**
```bash
git init
git add .
git commit -m "Initial commit: Campaign landing page"
git branch -M main
git remote add origin https://github.com/yourusername/your-campaign.git
git push -u origin main
```

**2. Connect to Cloudflare Pages:**
```
1. Login to Cloudflare Dashboard
2. Pages → Create a project
3. Connect to Git
4. Select repository
5. Configure build:
   - Framework preset: None
   - Build command: (leave empty)
   - Build output directory: /
6. Save and Deploy
```

**3. Configure Custom Domain (Optional):**
```
1. In Cloudflare Pages → Custom domains
2. Set up a custom domain
3. Enter domain name
4. Follow DNS configuration
```

### Option 2: Direct Upload
```
1. Prepare all files in single directory
2. Cloudflare Pages → Create a project
3. Direct Upload
4. Drag and drop files
5. Deploy site
```

### Project Structure
```
your-campaign/
├── index.html
├── assets/
│   ├── images/
│   │   ├── logo.png
│   │   └── hero-image.jpg
│   ├── css/
│   │   └── custom.css (optional)
│   └── js/
│       └── custom.js (optional)
└── README.md
```

---

## Troubleshooting

### Widget Not Appearing

**Check 1: Library Code in `<head>`**
```html
<!-- Should appear ONCE in <head> -->
<script src="https://widget-files.global.ssl.fastly.net/ocp-widget.js" type="module"></script>
<link href="https://widget-files.global.ssl.fastly.net/ocp-widget.css" rel="stylesheet" />
```

**Check 2: Widget Code in `<body>`**
```html
<!-- Should appear where you want widget -->
<one-click-widget cid="YOUR_CAMPAIGN_ID" language="en" env="staging"></one-click-widget>
```

**Check 3: Campaign Status**
- Log into OneClickPolitics
- Verify campaign is "Published" (not "Draft")
- Confirm all required fields completed

**Check 4: Browser Console**
```
F12 → Console tab
Look for JavaScript errors
Common issues:
- 404 errors (wrong CDN URL)
- CORS errors (check campaign settings)
- Missing campaign ID
```

### Styling Issues

**Override Widget Styles:**
```css
/* Add after widget library code */
<style>
    one-click-widget {
        max-width: 600px;
        margin: 0 auto;
        display: block;
    }
</style>
```

**Check Widget Theme in OneClickPolitics:**
```
Campaign → Widget Theme
- Background Color
- Button Color
- Font Color
- Font Family
```

### Form Submission Issues

**US Congress Campaigns Checklist:**
```
☑ Phone field is required
☑ Prefix field is required
☑ Constituent Mail Only enabled (automatic)
```

**Verify Campaign Settings:**
```
1. Display Options → Campaign Widget
2. Check delivery type (Immediate vs Delayed)
3. Verify target selection
4. Check email verification settings
```

### Common Error Messages

**Error: "Common queries will not be generated"**
- Solution: Add more specific details to campaign content
- Provide more context about the issue

**Error: Missing required fields**
- Solution: Check Campaign Basics section
- Ensure all required campaign settings completed

**Error: Targets not found**
- Solution: Verify target selection in Targeting section
- For US Congress: ensure constituent addresses valid

---

## Best Practices

### Campaign Design

**✓ DO:**
- Use clear, action-oriented titles
- Generate 5-10 letter variations with AI
- Place widget above the fold
- Test on mobile devices
- Add compelling context about the issue
- Include what happens after submission
- Use bullet points, not long paragraphs

**✗ DON'T:**
- Use generic titles like "Take Action"
- Submit single form letter to avoid spam filters
- Hide widget below content
- Forget mobile testing
- Assume users know the issue
- Leave next steps unclear
- Write essay-length explanations

### Content Strategy

**Hero Section:**
```
- Clear headline about the issue
- 1-2 sentence summary
- Emotional appeal + logical argument
- Sense of urgency if time-sensitive
```

**Context Section:**
```
- What's happening (the problem)
- Why it matters (the impact)
- What you're asking for (the solution)
- Why now (the urgency)
```

**Widget Placement:**
```
- Above the fold on desktop
- In prominent position on mobile
- Adjacent to compelling context
- With clear heading "Take Action Now"
```

### Performance Optimization

**Page Speed:**
```html
<!-- Preconnect to CDN -->
<link rel="preconnect" href="https://widget-files.global.ssl.fastly.net">
<link rel="dns-prefetch" href="https://widget-files.global.ssl.fastly.net">

<!-- Optimize images -->
<img src="hero.jpg" alt="Description" loading="lazy" width="1200" height="600">
```

**Mobile Optimization:**
```css
/* Ensure responsive design */
@media (max-width: 768px) {
    .widget-container {
        padding: 15px;
    }
    
    .hero h1 {
        font-size: 1.75rem;
    }
}
```

### UTM Tracking

**Campaign URLs:**
```
Email: https://your-domain.pages.dev/?utm_source=email&utm_medium=newsletter&utm_campaign=issue-name

Facebook: https://your-domain.pages.dev/?utm_source=facebook&utm_medium=social&utm_campaign=issue-name

Twitter: https://your-domain.pages.dev/?utm_source=twitter&utm_medium=social&utm_campaign=issue-name

SMS: https://your-domain.pages.dev/?utm_source=sms&utm_medium=text&utm_campaign=issue-name
```

**Track in OneClickPolitics:**
```
Analytics → Marketing Exports
Download CSV with UTM parameters
Analyze which sources drive most actions
```

### Accessibility
```html
<!-- Add ARIA labels -->
<section aria-label="Campaign Action Widget">
    <h2 id="widget-heading">Contact Your Representatives</h2>
    <one-click-widget 
        cid="YOUR_CAMPAIGN_ID" 
        language="en" 
        env="staging"
        aria-labelledby="widget-heading">
    </one-click-widget>
</section>

<!-- Ensure sufficient color contrast -->
<style>
    /* WCAG AA standard: 4.5:1 contrast ratio */
    .hero {
        background: #003366; /* Dark blue */
        color: #ffffff; /* White text */
    }
</style>

<!-- Add alt text to images -->
<img src="issue-photo.jpg" alt="Community members affected by [issue]">
```

---

## Analytics

### OneClickPolitics Reports

**Advocate Activity:**
```
Analytics → Advocate Activity
- Sort by: Actions, Campaign, Location, Timeframe
- View: Table or Chart
- Export: CSV
```

**Target Activity:**
```
Analytics → Target Activity
- See which legislators received messages
- Filter by: Campaign, State, District
- Export: CSV
```

**Advocate Universe:**
```
Analytics → Advocate Universe
- Complete advocate list
- Filter by: Action type, Location, District
- Export: CSV with all data
```

**Signature Exports:**
```
Analytics → Advocate Universe → View Exports
Includes:
- Email, Name, Address, Phone
- Timestamp, Campaign Name
- Custom Question Answers
```

### Cloudflare Analytics
```
Cloudflare Dashboard → Pages → Your Project → Analytics

Metrics:
- Requests
- Bandwidth
- Unique visitors
- Geographic distribution
- Referrer sources
```

---

## Quick Reference Commands

### Finding Campaign ID
```
1. OneClickPolitics Dashboard
2. Click campaign name
3. Display Options (left sidebar)
4. Campaign widget tab
5. Copy cid value from HTML Widget Code
```

### Testing Widget
```javascript
// Open browser console (F12)
// Check if widget library loaded
console.log(document.querySelector('one-click-widget'));

// Should see: <one-click-widget cid="..." ...>
// If null: Library code not loaded properly
```

### Updating Campaign
```
1. OneClickPolitics → Campaigns
2. Click campaign name
3. Make changes to any section
4. Click "Save Campaign" (blue button, top right)
5. Changes reflect immediately on live widget
```

### Export Advocate Data
```
1. Analytics → Advocate Universe
2. Apply filters (optional)
3. Click "View Exports"
4. Click "Export CSV"
5. Download file
```

---

## Environment Variables

OneClickPolitics widget supports environment configuration:
```html
<!-- Production -->
<one-click-widget cid="YOUR_ID" language="en" env="production"></one-click-widget>

<!-- Staging (for testing) -->
<one-click-widget cid="YOUR_ID" language="en" env="staging"></one-click-widget>
```

**Language Options:**
- `en` - English (default)
- `es` - Spanish (if supported)
- `fr` - French (if supported)

---

## Security Best Practices

### HTTPS Only
```
- Cloudflare Pages enforces HTTPS automatically
- Widget library uses HTTPS CDN
- No mixed content warnings
```

### Content Security Policy (Optional)
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' https://widget-files.global.ssl.fastly.net 'unsafe-inline'; 
               style-src 'self' https://widget-files.global.ssl.fastly.net 'unsafe-inline'; 
               img-src 'self' data: https:; 
               connect-src 'self' https://widget-files.global.ssl.fastly.net;">
```

### Privacy Considerations
```
- OneClickPolitics collects: Name, Email, Address, Phone
- Data used for: Contacting representatives, campaign analytics
- User can opt-in to communications
- Organization owns advocate data
- Review OneClickPolitics privacy policy
```

---

## Support Resources

### OneClickPolitics
```
Email: support@oneclickpolitics.com
Phone: 202-800-8877
Documentation: User Guide (PDF)
```

### Cloudflare Pages
```
Docs: https://developers.cloudflare.com/pages/
Community: https://community.cloudflare.com/
Status: https://www.cloudflarestatus.com/
```

---

## Version History
```
v1.0 - Initial guide (November 2024)
- Based on OneClickPolitics Summer 2024 User Guide
- Cloudflare Pages deployment instructions
- Complete HTML templates
- Troubleshooting guide
```

---

## Notes

- This guide assumes OneClickPolitics platform features as of Summer 2024
- Always verify current platform capabilities with support
- Test thoroughly in staging before production deployment
- Keep campaign content updated and relevant
- Monitor analytics regularly to optimize campaigns
- Widget library code may update - check documentation

---

## Checklist for New Campaign
```
☐ 1. Complete OneClickPolitics campaign setup
☐ 2. Configure campaign settings (delivery, form options)
☐ 3. Add email/phone/video content
☐ 4. Select targets
☐ 5. Customize widget theme
☐ 6. Publish campaign in OneClickPolitics
☐ 7. Copy embed codes from Display Options
☐ 8. Create HTML landing page
☐ 9. Add library code to <head>
☐ 10. Add widget code to <body>
☐ 11. Replace YOUR_CAMPAIGN_ID with actual ID
☐ 12. Test locally in browser
☐ 13. Deploy to Cloudflare Pages
☐ 14. Test live deployment
☐ 15. Configure custom domain (optional)
☐ 16. Set up UTM tracking for promotion
☐ 17. Launch campaign promotion
☐ 18. Monitor analytics
```

---

**END OF GUIDE**

*For the most up-to-date information, always refer to OneClickPolitics official documentation and support resources.*