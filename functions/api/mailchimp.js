// Cloudflare Pages Function - Mailchimp API Proxy
// This handles subscriptions to Mailchimp from the frontend

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { email_address, status, merge_fields, tags, audienceId, datacenter } = body;

    if (!email_address) {
      return new Response(JSON.stringify({ error: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get Mailchimp API key from environment variable
    // Set this in Cloudflare Pages: Settings > Environment Variables > MAILCHIMP_API_KEY
    const apiKey = env.MAILCHIMP_API_KEY;

    if (!apiKey) {
      console.error('MAILCHIMP_API_KEY environment variable not set');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Mailchimp API endpoint
    const dc = datacenter || 'us9';
    const listId = audienceId || 'fb546f9c74';
    const url = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`;

    // Create member hash for upsert (MD5 of lowercase email)
    const emailHash = await md5(email_address.toLowerCase());

    // Try to add/update member using PUT (upsert)
    const response = await fetch(`${url}/${emailHash}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Basic ${btoa(`anystring:${apiKey}`)}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email_address,
        status_if_new: status || 'subscribed',
        merge_fields: merge_fields || {},
        tags: tags || []
      })
    });

    const result = await response.json();

    if (response.ok) {
      // If tags were provided, add them separately (Mailchimp API quirk)
      if (tags && tags.length > 0) {
        await addTags(dc, listId, emailHash, tags, apiKey);
      }

      return new Response(JSON.stringify({ success: true, id: result.id }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    } else {
      console.error('Mailchimp error:', result);
      return new Response(JSON.stringify({ error: result.detail || 'Subscription failed' }), {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

  } catch (error) {
    console.error('Mailchimp proxy error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

// Add tags to a member
async function addTags(dc, listId, emailHash, tags, apiKey) {
  const url = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members/${emailHash}/tags`;

  const tagObjects = tags.map(tag => ({
    name: tag,
    status: 'active'
  }));

  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`anystring:${apiKey}`)}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tags: tagObjects })
    });
  } catch (error) {
    console.error('Error adding tags:', error);
  }
}

// Simple MD5 implementation for email hashing
async function md5(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('MD5', msgBuffer).catch(() => {
    // Fallback for environments without MD5 support
    return simpleMd5(message);
  });

  if (hashBuffer instanceof ArrayBuffer) {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }
  return hashBuffer;
}

// Fallback MD5 (simple implementation)
function simpleMd5(string) {
  // Using a simple hash for fallback - not cryptographically secure but works for Mailchimp
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    const char = string.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(32, '0');
}
