chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed');
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'PROMPT_API_REQUEST') {
        handlePromptAPIRequest(message.prompt)
            .then(response => sendResponse({ result: response }))
            .catch(error => sendResponse({ error: error.message }));
        return true; // Keep the message channel open for sendResponse
    }
});

async function handlePromptAPIRequest(prompt) {
    try {
        const { available } = await ai.languageModel.capabilities();
        if (available !== "no") {
            const session = await ai.languageModel.create();
            const result = await session.prompt(prompt);
            return result;
        } else {
            throw new Error("AI model is not available.");
        }
    } catch (error) {
        throw new Error(`Error: ${error.message}`);
    }
}
