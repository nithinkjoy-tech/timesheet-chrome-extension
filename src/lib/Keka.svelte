<script>

    import {storage} from "../services/storage.js";

    let {next} = $props()

    let kekaAccessToken = "";
    let buttonText = $state("Connect")
    let error = $state(false)

    async function handleNext() {
        buttonText = "Connecting..."

        try {
            const newTab = await chrome.tabs.create({
                url: "https://cloverbay.keka.com",
                active: false
            });

            await new Promise(resolve => {
                chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
                    if (tabId === newTab.id && info.status === 'complete') {
                        chrome.tabs.onUpdated.removeListener(listener);
                        setTimeout(resolve, 500);
                    }
                });
            });

            const response = await chrome.tabs.sendMessage(newTab.id, {
                action: "getKekaToken"
            });

            kekaAccessToken = response.token;

            if (!kekaAccessToken) {
                error = true;
                buttonText = "Connect"
                return;
            }
            buttonText = "Connected."
            storage.set({
                keka_token: kekaAccessToken
            });
            next()
        } catch (error) {
            error = true;
        }
    }
</script>

<div>
    <div class="step">Step 2 of 3</div>
    <h1>Connect to Keka</h1>
    <div class="form">
        <button onclick={handleNext}>{ buttonText }</button>
        {#if error}<p class="error">Make sure you have logged into keka and try again.</p>{/if}
    </div>
</div>
