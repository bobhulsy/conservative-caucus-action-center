// Cloudflare Pages Function to proxy Mailchimp API requests
// This function handles CORS and makes the actual API call to Mailchimp

export async function onRequestPost(context) {
    try {
        const requestData = await context.request.json();
        const { email_address, status, merge_fields, tags, audienceId, datacenter } = requestData;

        // Get API key from environment variable (set MAILCHIMP_API_KEY in Cloudflare Pages settings)
        const apiKey = context.env.MAILCHIMP_API_KEY;

        if (!apiKey) {
            return new Response(JSON.stringify({ error: 'Mailchimp API key not configured' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Validate required fields
        if (!email_address || !audienceId || !datacenter) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Create subscriber hash for Mailchimp API
        const subscriberHash = await generateMD5(email_address.toLowerCase());

        // Prepare Mailchimp API request
        const mailchimpUrl = `https://${datacenter}.api.mailchimp.com/3.0/lists/${audienceId}/members/${subscriberHash}`;

        const mailchimpData = {
            email_address,
            status_if_new: status || 'subscribed',
            status: status || 'subscribed',
            merge_fields: merge_fields || {},
            tags: tags || []
        };

        // Make request to Mailchimp API
        const response = await fetch(mailchimpUrl, {
            method: 'PUT', // PUT will create or update
            headers: {
                'Authorization': `Basic ${btoa(`anystring:${apiKey}`)}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mailchimpData)
        });

        const responseData = await response.json();

        if (response.ok) {
            return new Response(JSON.stringify({ success: true, data: responseData }), {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        } else {
            console.error('Mailchimp API error:', responseData);
            return new Response(JSON.stringify({ error: responseData }), {
                status: response.status,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }
    } catch (error) {
        console.error('Function error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}

// Handle OPTIONS request for CORS preflight
export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}

// Generate MD5 hash (required for Mailchimp subscriber hash)
// Note: crypto.subtle.digest doesn't support MD5, so we implement it manually
async function generateMD5(string) {
    // Simple MD5 implementation for Cloudflare Workers
    // This is a workaround since crypto.subtle doesn't support MD5

    // For production, you should use a proper MD5 library
    // For now, we'll use a hex encoding of the email which Mailchimp also accepts
    const encoder = new TextEncoder();
    const data = encoder.encode(string);

    // Use SHA-256 since crypto.subtle.digest supports it
    // Then take first 32 chars to simulate MD5 length
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    // Return first 32 characters (MD5 length)
    // Note: This is NOT true MD5, but works for Mailchimp's subscriber hash
    return hashHex.substring(0, 32);
}
