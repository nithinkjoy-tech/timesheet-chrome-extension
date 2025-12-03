chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received:', request.action);

    if (request.action === 'fetchJira') {
        console.log('Fetching Jira with config:', request.config);

        fetchJiraData(request.config, request.jql)
            .then(data => {
                console.log('Success, sending response');
                sendResponse({ success: true, data });
            })
            .catch(error => {
                console.error('Error:', error);
                sendResponse({ success: false, error: error.message });
            });

        return true;
    }

    return false;
});

async function fetchJiraData(config, jql) {
    const url = `${config.jiraUrl}/rest/api/3/search/jql`;
    const auth = btoa(`${config.jiraEmail}:${config.apiToken}`);

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            jql: jql,
            maxResults: 10,
            fields: ['summary', 'status']
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return await response.json();
}

// Helper functions for PKCE
function generateRandomString(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let result = '';
    const randomValues = crypto.getRandomValues(new Uint8Array(length));
    randomValues.forEach(value => {
        result += chars[value % chars.length];
    });
    return result;
}

async function sha256(plain) {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(hash)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
}

async function generatePKCE() {
    const verifier = generateRandomString(128);
    const challenge = await sha256(verifier);
    return { verifier, challenge };
}

// Main authentication function
async function authenticate() {
    try {
        const { verifier, challenge } = await generatePKCE();

        // Store verifier for later use
        await chrome.storage.local.set({ code_verifier: verifier });

        // Build authorization URL
        const authUrl = new URL('https://orbitone-auth.cloverbaytechnologies.com/realms/orbitone/protocol/openid-connect/auth');
        authUrl.searchParams.append('client_id', 'Timesheet-frontend');
        authUrl.searchParams.append('redirect_uri', 'https://www.orbitone.cloverbaytechnologies.com/');
        authUrl.searchParams.append('response_type', 'code');
        authUrl.searchParams.append('scope', 'openid profile email');
        authUrl.searchParams.append('code_challenge', challenge);
        authUrl.searchParams.append('code_challenge_method', 'S256');

        // Launch OAuth flow
        chrome.identity.launchWebAuthFlow(
            {
                url: authUrl.toString(),
                interactive: true
            },
            async (redirectUrl) => {
                if (chrome.runtime.lastError) {
                    console.error('Auth flow error:', chrome.runtime.lastError);
                    // Notify popup of error
                    chrome.runtime.sendMessage({
                        type: 'AUTH_ERROR',
                        error: chrome.runtime.lastError.message
                    });
                    return;
                }

                // Extract authorization code
                const url = new URL(redirectUrl);
                const code = url.searchParams.get('code');

                if (code) {
                    await exchangeCodeForToken(code);
                } else {
                    console.error('No code in redirect URL');
                    chrome.runtime.sendMessage({
                        type: 'AUTH_ERROR',
                        error: 'No authorization code received'
                    });
                }
            }
        );
    } catch (error) {
        console.error('Authentication error:', error);
        chrome.runtime.sendMessage({
            type: 'AUTH_ERROR',
            error: error.message
        });
    }
}

// Exchange authorization code for tokens
async function exchangeCodeForToken(code) {
    try {
        const { code_verifier } = await chrome.storage.local.get('code_verifier');

        const response = await fetch('https://orbitone-auth.cloverbaytechnologies.com/realms/orbitone/protocol/openid-connect/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                code: code,
                grant_type: 'authorization_code',
                client_id: 'Timesheet-frontend',
                redirect_uri: 'https://www.orbitone.cloverbaytechnologies.com/',
                code_verifier: code_verifier
            })
        });

        const tokens = await response.json();

        if (tokens.access_token) {
            // Store tokens securely
            await chrome.storage.local.set({
                access_token: tokens.access_token,
                refresh_token: tokens.refresh_token,
                expires_at: Date.now() + (tokens.expires_in * 1000),
                authenticated: true
            });

            console.log('Authentication successful!');

            // Notify popup of success
            chrome.runtime.sendMessage({
                type: 'AUTH_SUCCESS',
                tokens: { access_token: tokens.access_token }
            });
        } else {
            console.error('Token exchange failed:', tokens);
            chrome.runtime.sendMessage({
                type: 'AUTH_ERROR',
                error: tokens.error_description || 'Token exchange failed'
            });
        }
    } catch (error) {
        console.error('Token exchange error:', error);
        chrome.runtime.sendMessage({
            type: 'AUTH_ERROR',
            error: error.message
        });
    }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'START_AUTH') {
        authenticate();
        sendResponse({ status: 'started' });
    } else if (request.type === 'CHECK_AUTH') {
        chrome.storage.local.get(['authenticated', 'access_token', 'expires_at'], (result) => {
            const isAuthenticated = result.authenticated &&
                result.access_token &&
                result.expires_at > Date.now();
            sendResponse({ authenticated: isAuthenticated });
        });
        return true; // Keep message channel open for async response
    } else if (request.type === 'LOGOUT') {
        chrome.storage.local.remove(['access_token', 'refresh_token', 'expires_at', 'authenticated', 'code_verifier'], () => {
            sendResponse({ status: 'logged_out' });
        });
        return true;
    }
});
