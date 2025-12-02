export async function getInProgressTask(JIRA_CONFIG = {}, project = "SWAD", status = "In-Progress") {
    const jql = `assignee = currentUser() AND project = ${project} AND status = "${status}"`;

    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage(  // Changed from chrome.tabs.sendMessage
            {
                action: 'fetchJira',
                config: JIRA_CONFIG,
                jql: jql
            },
            (response) => {
                if (chrome.runtime.lastError) {
                    resolve([null, chrome.runtime.lastError.message]);
                    return;
                }

                if (!response) {
                    resolve([null, 'Background script not responding']);
                    return;
                }

                if (response.success) {
                    resolve([response.data, null]);
                } else {
                    resolve([null, response.error]);
                }
            }
        );
    });
}
