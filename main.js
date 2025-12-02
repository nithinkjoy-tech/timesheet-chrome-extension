async function handleNext() {
    try {
        // Query for the Keka tab
        const tabs = await chrome.tabs.query({
            url: "*://cloverbay.keka.com/*"
        });

        if (tabs.length === 0) {
            // No Keka tab found, open one
            const newTab = await chrome.tabs.create({
                url: "https://cloverbay.keka.com",
                active: false
            });

            // Wait a bit for the page to load
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Send message to the new tab
            const response = await chrome.tabs.sendMessage(newTab.tabId, {
                action: "getKekaToken"
            });

            kekaAccessToken = response.token;
            console.log("Access Token:", kekaAccessToken);

            // Close the tab if you want
            await chrome.tabs.remove(newTab.tabId);
        } else {
            // Keka tab exists, send message to it
            const response = await chrome.tabs.sendMessage(tabs[0].id, {
                action: "getKekaToken"
            });

            kekaAccessToken = response.token;
            console.log("Access Token:", kekaAccessToken);
        }

        if (!kekaAccessToken) {
            alert("Access token not found. Please log in to Keka first.");
            return;
        }

        // Proceed to next step
        // Your code here...

    } catch (error) {
        console.error("Error getting access token:", error);
        alert("Failed to connect to Keka. Please make sure you're logged in.");
    }
}
