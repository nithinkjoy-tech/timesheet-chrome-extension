chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getKekaToken") {
        const accessToken = localStorage.getItem("access_token");
        sendResponse({ token: accessToken });
        return true;
    }

    return false; // No matching action
});
