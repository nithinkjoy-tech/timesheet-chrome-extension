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
