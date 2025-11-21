// Cloudflare Pages Middleware for Dynamic OG Tags
// This injects correct social sharing meta tags based on campaign ID

// ===========================================
// CAMPAIGN CONFIGURATION
// ===========================================
// Add new campaigns here with their metadata
// Image path convention: /images/campaigns/{cid}.png
// ===========================================

const campaigns = {
  'S27wY8ZyVAjaV0qqmHaBg': {
    title: "Release the Sexual Harassment Settlement Records Now!",
    description: "Congress has exposed its secret slush fund used to pay off sexual harassment victims. Exposed members of Congress are hiding behind NDAs. Demand they release these records now!",
  },
  'eLN1BQF0AW11pFo6vLzRs': {
    title: "Pass Trump's Agenda WITHOUT Ending the Filibuster!",
    description: "The Senate has rules that let Majority Leader Thune pass ALL of Trump's agenda WITHOUT ending the filibuster. Send your GOP Senators an instant message to make America great again!",
  },
  // ADD NEW CAMPAIGNS HERE:
  // 'campaignIdHere': {
  //   title: 'Campaign Title',
  //   description: 'Brief description for social sharing.',
  // },
};

const BASE_URL = 'https://action.theconservativecaucus.com';

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  // Only process campaign.html requests
  if (!url.pathname.endsWith('/campaign.html') && !url.pathname.endsWith('/campaign')) {
    return next();
  }

  const cid = url.searchParams.get('cid');

  // If no campaign ID, just pass through
  if (!cid) {
    return next();
  }

  // Get the original response
  const response = await next();

  // Only modify HTML responses
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) {
    return response;
  }

  // Get campaign data (with fallback defaults)
  const campaign = campaigns[cid] || {
    title: 'Take Action',
    description: 'Take action with The Conservative Caucus on this important issue.',
  };

  // Build image URL from campaign ID
  const imageUrl = `${BASE_URL}/images/campaigns/${cid}.png?v=1`;
  const pageUrl = `${BASE_URL}/campaign.html?cid=${cid}`;

  // Get the HTML
  let html = await response.text();

  // Replace OG tags
  html = html.replace(
    /<meta property="og:title"[^>]*>/,
    `<meta property="og:title" content="${escapeHtml(campaign.title)} | The Conservative Caucus">`
  );

  html = html.replace(
    /<meta property="og:description"[^>]*>/,
    `<meta property="og:description" content="${escapeHtml(campaign.description)}">`
  );

  html = html.replace(
    /<meta property="og:image"[^>]*>/,
    `<meta property="og:image" content="${imageUrl}">`
  );

  html = html.replace(
    /<meta property="og:url"[^>]*>/,
    `<meta property="og:url" content="${pageUrl}">`
  );

  // Replace Twitter tags
  html = html.replace(
    /<meta name="twitter:title"[^>]*>/,
    `<meta name="twitter:title" content="${escapeHtml(campaign.title)} | The Conservative Caucus">`
  );

  html = html.replace(
    /<meta name="twitter:description"[^>]*>/,
    `<meta name="twitter:description" content="${escapeHtml(campaign.description)}">`
  );

  html = html.replace(
    /<meta name="twitter:image"[^>]*>/,
    `<meta name="twitter:image" content="${imageUrl}">`
  );

  html = html.replace(
    /<meta name="twitter:url"[^>]*>/,
    `<meta name="twitter:url" content="${pageUrl}">`
  );

  // Replace page title
  html = html.replace(
    /<title[^>]*>[^<]*<\/title>/,
    `<title>${escapeHtml(campaign.title)} | The Conservative Caucus</title>`
  );

  // Return modified response
  return new Response(html, {
    status: response.status,
    headers: response.headers,
  });
}

// Helper to escape HTML entities
function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
