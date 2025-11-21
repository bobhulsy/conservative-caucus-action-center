// Conservative Caucus Landing Pages - Form Handling
// This file handles form validation and submission

// Mailchimp Configuration (API key stored server-side for security)
const MAILCHIMP_CONFIG = {
    audienceId: 'fb546f9c74',
    datacenter: 'us9'
};

// ===========================================
// OneClickPolitics Widget Data Capture
// ===========================================
// Attempts to capture form data from OCP widget and send to Mailchimp

function initOCPWidgetCapture() {
    // Store captured data
    let capturedData = {
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        zip: '',
        address: '',
        city: '',
        state: ''
    };

    // Try to access widget shadow DOM and attach listeners
    function attachWidgetListeners() {
        const widgets = document.querySelectorAll('one-click-widget');

        widgets.forEach(widget => {
            // Try to access shadow root (only works if mode is 'open')
            const shadowRoot = widget.shadowRoot;

            if (shadowRoot) {
                console.log('🟢 OCP Widget: Shadow DOM accessible');

                // Find all input fields in the widget
                const inputs = shadowRoot.querySelectorAll('input, select, textarea');

                inputs.forEach(input => {
                    // Listen for changes
                    input.addEventListener('change', (e) => captureField(e.target));
                    input.addEventListener('blur', (e) => captureField(e.target));
                });

                // Try to find and listen to the submit button
                const submitBtns = shadowRoot.querySelectorAll('button[type="submit"], button.submit, .ocp-submit');
                submitBtns.forEach(btn => {
                    btn.addEventListener('click', () => {
                        // Capture all fields one more time before submit
                        const allInputs = shadowRoot.querySelectorAll('input, select, textarea');
                        allInputs.forEach(input => captureField(input));

                        // Send to Mailchimp
                        setTimeout(() => sendToMailchimp(capturedData), 500);
                    });
                });

                // Also listen for form submit events
                const forms = shadowRoot.querySelectorAll('form');
                forms.forEach(form => {
                    form.addEventListener('submit', () => {
                        const allInputs = form.querySelectorAll('input, select, textarea');
                        allInputs.forEach(input => captureField(input));
                        setTimeout(() => sendToMailchimp(capturedData), 500);
                    });
                });

            } else {
                console.log('🟡 OCP Widget: Shadow DOM not accessible (closed mode)');
                // Try alternative approach - listen for input events that bubble up
                widget.addEventListener('input', handleBubbledInput);
                widget.addEventListener('change', handleBubbledInput);
            }
        });
    }

    // Capture field value based on field name/type
    function captureField(input) {
        const name = (input.name || input.id || input.placeholder || '').toLowerCase();
        const value = input.value;

        if (!value) return;

        if (name.includes('email')) {
            capturedData.email = value;
        } else if (name.includes('first') || name === 'fname') {
            capturedData.firstName = value;
        } else if (name.includes('last') || name === 'lname') {
            capturedData.lastName = value;
        } else if (name.includes('phone') || name.includes('tel')) {
            capturedData.phone = value;
        } else if (name.includes('zip') || name.includes('postal')) {
            capturedData.zip = value;
        } else if (name.includes('address') || name.includes('street')) {
            capturedData.address = value;
        } else if (name.includes('city')) {
            capturedData.city = value;
        } else if (name.includes('state')) {
            capturedData.state = value;
        } else if (name.includes('name') && !name.includes('first') && !name.includes('last')) {
            // Full name field - split it
            const parts = value.split(' ');
            capturedData.firstName = parts[0] || '';
            capturedData.lastName = parts.slice(1).join(' ') || '';
        }

        console.log('🔵 OCP Capture:', name, '=', value);
    }

    // Handle input events that bubble up (fallback)
    function handleBubbledInput(e) {
        if (e.target && e.target.tagName && ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) {
            captureField(e.target);
        }
    }

    // Send captured data to Mailchimp
    function sendToMailchimp(data) {
        if (!data.email) {
            console.log('🟡 OCP Capture: No email captured, skipping Mailchimp');
            return;
        }

        console.log('🟢 OCP Capture: Sending to Mailchimp', data);

        // Determine campaign tag from current page
        const urlParams = new URLSearchParams(window.location.search);
        const cid = urlParams.get('cid') || 'homepage';

        const memberData = {
            email_address: data.email,
            status: 'subscribed',
            merge_fields: {
                FNAME: data.firstName,
                LNAME: data.lastName,
                PHONE: data.phone,
                ZIP: data.zip,
                ADDRESS: data.address,
                CITY: data.city,
                STATE: data.state
            },
            tags: ['OCP-WIDGET', cid.toUpperCase()]
        };

        // Submit to Mailchimp API endpoint
        fetch('/api/mailchimp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...memberData,
                audienceId: MAILCHIMP_CONFIG.audienceId,
                datacenter: MAILCHIMP_CONFIG.datacenter
            })
        }).then(response => {
            console.log('🟢 OCP Capture: Mailchimp response', response.status);
        }).catch(error => {
            console.warn('🔴 OCP Capture: Mailchimp error', error);
        });
    }

    // Wait for widgets to load, then attach listeners
    // Retry a few times since widget may load asynchronously
    let attempts = 0;
    const maxAttempts = 10;

    function tryAttach() {
        const widgets = document.querySelectorAll('one-click-widget');
        if (widgets.length > 0) {
            // Wait a bit for shadow DOM to initialize
            setTimeout(attachWidgetListeners, 1000);
        } else if (attempts < maxAttempts) {
            attempts++;
            setTimeout(tryAttach, 500);
        }
    }

    // Start trying to attach
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', tryAttach);
    } else {
        tryAttach();
    }
}

// Initialize OCP widget capture
initOCPWidgetCapture();

document.addEventListener('DOMContentLoaded', function() {
    console.log('🟢 forms.js loaded and DOMContentLoaded fired');

    // Add form validation and handling to all petition forms
    const forms = document.querySelectorAll('form');
    console.log('🟢 Found', forms.length, 'form(s) on page');

    // Check if we're on a donate or thank-you page (skip Mailchimp integration there)
    const isDonateOrThankYouPage = window.location.pathname.includes('/donate') ||
                                    window.location.pathname.includes('/thank-you');
    console.log('🟢 Page type - isDonateOrThankYouPage:', isDonateOrThankYouPage);

    forms.forEach((form, formIndex) => {
        console.log(`🟢 Attaching submit handler to form #${formIndex}:`, form.id || '(no id)');

        form.addEventListener('submit', function(e) {
            console.log('🔵 ========== FORM SUBMIT EVENT FIRED ==========');
            console.log('🔵 Form ID:', form.id || '(no id)');
            console.log('🔵 Form action attribute:', form.getAttribute('action'));
            console.log('🔵 Event type:', e.type);

            // Always prevent default - we'll handle submission manually
            e.preventDefault();
            console.log('🔵 preventDefault() called successfully');

            // Validate required fields
            const requiredFields = form.querySelectorAll('[required]');
            console.log('🔵 Found', requiredFields.length, 'required field(s)');
            let isValid = true;

            requiredFields.forEach(field => {
                const fieldName = field.name || field.id || 'unnamed';
                const fieldValue = field.value.trim();
                console.log(`🔵 Validating required field "${fieldName}":`, fieldValue ? '✓ has value' : '✗ empty');

                if (!fieldValue) {
                    isValid = false;
                    field.style.borderColor = '#DC2626';
                } else {
                    field.style.borderColor = '#D1D5DB';
                }
            });

            // Validate email format
            const emailFields = form.querySelectorAll('input[type="email"]');
            emailFields.forEach(field => {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const emailValue = field.value;
                const emailValid = emailRegex.test(emailValue);
                console.log('🔵 Email validation:', emailValue, '→', emailValid ? '✓ valid' : '✗ invalid');

                if (field.value && !emailValid) {
                    isValid = false;
                    field.style.borderColor = '#DC2626';
                    alert('Please enter a valid email address');
                }
            });

            // Validate phone number (basic)
            const phoneFields = form.querySelectorAll('input[type="tel"]');
            phoneFields.forEach(field => {
                const phoneRegex = /^[\d\s\-\(\)]+$/;
                const phoneValue = field.value;
                const phoneValid = phoneRegex.test(phoneValue);
                console.log('🔵 Phone validation:', phoneValue, '→', phoneValid ? '✓ valid' : '✗ invalid');

                if (field.value && !phoneValid) {
                    isValid = false;
                    field.style.borderColor = '#DC2626';
                    alert('Please enter a valid phone number');
                }
            });

            // Validate ZIP code
            const zipFields = form.querySelectorAll('input[name="zip"]');
            zipFields.forEach(field => {
                const zipRegex = /^\d{5}$/;
                const zipValue = field.value;
                const zipValid = zipRegex.test(zipValue);
                console.log('🔵 ZIP validation:', zipValue, '→', zipValid ? '✓ valid' : '✗ invalid');

                if (field.value && !zipValid) {
                    isValid = false;
                    field.style.borderColor = '#DC2626';
                    alert('Please enter a valid 5-digit ZIP code');
                }
            });

            console.log('🔵 Overall validation result:', isValid ? '✓ VALID' : '✗ INVALID');

            // Stop here if validation failed
            if (!isValid) {
                console.log('🔴 Validation failed - stopping execution');
                return false;
            }

            // Track form submission in Google Analytics if available
            if (typeof gtag !== 'undefined') {
                console.log('🔵 Google Analytics available - tracking form_submit event');
                gtag('event', 'form_submit', {
                    'event_category': 'engagement',
                    'event_label': form.id || 'petition_form'
                });
            } else {
                console.log('🟡 Google Analytics not available');
            }

            // Get form data for redirect
            const redirectUrl = form.getAttribute('action');
            const formData = new FormData(form);
            const params = new URLSearchParams();
            params.append('name', formData.get('name'));
            params.append('email', formData.get('email'));
            params.append('phone', formData.get('phone'));
            params.append('zip', formData.get('zip'));

            console.log('🔵 Building redirect URL...');
            console.log('🔵   - Base URL:', redirectUrl);
            console.log('🔵   - Name:', formData.get('name'));
            console.log('🔵   - Email:', formData.get('email'));
            console.log('🔵   - Phone:', formData.get('phone'));
            console.log('🔵   - ZIP:', formData.get('zip'));
            console.log('🔵   - Query params:', params.toString());

            // Only submit to Mailchimp on petition pages (not donate/thank-you pages)
            if (!isDonateOrThankYouPage) {
                console.log('🔵 Submitting to Mailchimp (fire-and-forget)');
                // Fire-and-forget Mailchimp request
                submitToMailchimpAsync(formData);
            } else {
                console.log('🔵 Skipping Mailchimp (on donate/thank-you page)');
            }

            // Redirect with parameters (works for both petition and other pages)
            const finalUrl = `${redirectUrl}?${params.toString()}`;
            console.log('🔵 Final redirect URL:', finalUrl);
            console.log('🔵 Executing window.location.href redirect NOW...');

            window.location.href = finalUrl;

            console.log('🔵 window.location.href executed (this line may not appear if redirect is instant)');
        });
        
        // Clear error styling on input
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                this.style.borderColor = '#D1D5DB';
            });
        });
    });
    
    // Add smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Format phone numbers as user types
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            if (value.length >= 6) {
                e.target.value = `(${value.slice(0,3)}) ${value.slice(3,6)}-${value.slice(6)}`;
            } else if (value.length >= 3) {
                e.target.value = `(${value.slice(0,3)}) ${value.slice(3)}`;
            } else {
                e.target.value = value;
            }
        });
    });
    
    // ZIP code formatting
    const zipInputs = document.querySelectorAll('input[name="zip"]');
    zipInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '').slice(0, 5);
        });
    });
    
    // Handle radio button groups - ensure accessible keyboard navigation
    const radioGroups = document.querySelectorAll('.radio-group');
    radioGroups.forEach(group => {
        const radios = group.querySelectorAll('input[type="radio"]');
        radios.forEach((radio, index) => {
            radio.addEventListener('keydown', function(e) {
                if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    const nextIndex = (index + 1) % radios.length;
                    radios[nextIndex].focus();
                    radios[nextIndex].checked = true;
                } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
                    e.preventDefault();
                    const prevIndex = (index - 1 + radios.length) % radios.length;
                    radios[prevIndex].focus();
                    radios[prevIndex].checked = true;
                }
            });
        });
    });
    
    // Log page view for analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href,
            page_path: window.location.pathname
        });
    }
});

// Utility function to get URL parameters (for pre-filling forms from email links)
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Pre-fill form fields if parameters are present in URL
window.addEventListener('load', function() {
    const nameParam = getUrlParameter('name');
    const emailParam = getUrlParameter('email');
    const phoneParam = getUrlParameter('phone');
    const zipParam = getUrlParameter('zip');

    if (nameParam) {
        const nameField = document.getElementById('name');
        if (nameField) nameField.value = nameParam;
    }
    if (emailParam) {
        const emailField = document.getElementById('email');
        if (emailField) emailField.value = emailParam;
    }
    if (phoneParam) {
        const phoneField = document.getElementById('phone');
        if (phoneField) phoneField.value = phoneParam;
    }
    if (zipParam) {
        const zipField = document.getElementById('zip');
        if (zipField) zipField.value = zipParam;
    }
});

// Fire-and-forget Mailchimp submission (doesn't block redirect)
function submitToMailchimpAsync(formData) {
    const email = formData.get('email');
    const name = formData.get('name');
    const phone = formData.get('phone');
    const zip = formData.get('zip');

    // Determine campaign tag from URL path
    const pathParts = window.location.pathname.split('/').filter(p => p);
    const campaign = pathParts[0] || 'general';

    // Prepare data for Mailchimp
    const memberData = {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
            FNAME: name.split(' ')[0] || name,
            LNAME: name.split(' ').slice(1).join(' ') || '',
            PHONE: phone,
            ZIP: zip
        },
        tags: [campaign.toUpperCase()]
    };

    // Submit in background - don't wait or check response
    fetch('/api/mailchimp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...memberData,
            audienceId: MAILCHIMP_CONFIG.audienceId,
            datacenter: MAILCHIMP_CONFIG.datacenter
        })
    }).catch(error => {
        console.warn('Mailchimp submission failed (non-blocking):', error);
    });
}

// Function to submit form data to Mailchimp (LEGACY - not used)
async function submitToMailchimp(form) {
    const formData = new FormData(form);
    const email = formData.get('email');
    const name = formData.get('name');
    const phone = formData.get('phone');
    const zip = formData.get('zip');

    // Determine campaign tag from URL path
    const pathParts = window.location.pathname.split('/').filter(p => p);
    const campaign = pathParts[0] || 'general';

    // Prepare data for Mailchimp
    const memberData = {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
            FNAME: name.split(' ')[0] || name,
            LNAME: name.split(' ').slice(1).join(' ') || '',
            PHONE: phone,
            ZIP: zip
        },
        tags: [campaign.toUpperCase()]
    };

    // Submit to Mailchimp in background (don't wait for response)
    fetch('/api/mailchimp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...memberData,
            audienceId: MAILCHIMP_CONFIG.audienceId,
            datacenter: MAILCHIMP_CONFIG.datacenter
        })
    }).then(response => {
        if (response.ok) {
            console.log('Successfully subscribed to Mailchimp');
        } else {
            console.warn('Mailchimp subscription may have failed');
        }
    }).catch(error => {
        console.warn('Error submitting to Mailchimp:', error);
    });

    // Immediately redirect (don't wait for Mailchimp)
    const redirectUrl = form.getAttribute('action');
    const params = new URLSearchParams();
    params.append('name', name);
    params.append('email', email);
    params.append('phone', phone);
    params.append('zip', zip);

    window.location.href = `${redirectUrl}?${params.toString()}`;
}
