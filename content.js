document.addEventListener('DOMContentLoaded', () => {
    // Function to interact with the Prompt API and send results to the background script
    async function interactWithPromptAPI(prompt) {
        try {
            const { available } = await ai.languageModel.capabilities();
            if (available !== "no") {
                const session = await ai.languageModel.create();
                const result = await session.prompt(prompt);
                chrome.runtime.sendMessage({ type: 'PROMPT_API_RESPONSE', result });
            } else {
                chrome.runtime.sendMessage({ type: 'PROMPT_API_RESPONSE', error: "AI model is not available." });
            }
        } catch (error) {
            chrome.runtime.sendMessage({ type: 'PROMPT_API_RESPONSE', error: error.message });
        }
    }

    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === 'PROMPT_API_REQUEST') {
            interactWithPromptAPI(message.prompt);
        }
    });
});
