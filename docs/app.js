// app.js
import { marked } from "https://cdn.jsdelivr.net/npm/marked@13.0.3/lib/marked.esm.js";
import DOMPurify from "https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.es.mjs";

(async () => {
    const errorMessage = document.getElementById("error-message");
    const promptInput = document.getElementById("prompt-input");
    const responseArea = document.getElementById("response-area");
    const rawResponse = document.getElementById("raw-response");
    const form = document.querySelector("form");
    const resetButton = document.getElementById("reset-button");

    let session = null;

    // Check for API support
    if (!self.ai || !self.ai.languageModel) {
        errorMessage.style.display = "block";
        errorMessage.innerHTML = `Your browser doesn't support the Prompt API. Enable it in Chrome flags.`;
        return;
    }

    // Initialize AI session
    async function initSession() {
        try {
            session = await self.ai.languageModel.create({
                temperature: 0.7,
                topK: 40,
            });
        } catch (error) {
            displayError(`Failed to initialize AI: ${error.message}`);
        }
    }

    // Handle user input
    async function handlePrompt() {
        const prompt = promptInput.value.trim();
        if (!prompt) return;

        responseArea.innerHTML = "Processing...";
        rawResponse.innerText = "";

        try {
            if (!session) {
                await initSession();
            }

            const stream = await session.promptStreaming(prompt);
            let fullResponse = "";

            for await (const chunk of stream) {
                fullResponse = chunk;
                responseArea.innerHTML = DOMPurify.sanitize(marked.parse(fullResponse));
                rawResponse.innerText = fullResponse;
            }
        } catch (error) {
            displayError(error);
        }
    }

    function displayError(error) {
        responseArea.innerHTML = `Error: ${error.message}`;
    }

    // Event Listeners
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        await handlePrompt();
    });

    resetButton.addEventListener("click", async () => {
        promptInput.value = "";
        responseArea.innerHTML = "";
        rawResponse.innerHTML = "";
        if (session) {
            session.destroy();
            session = null;
        }
        await initSession();
    });

    // Initialize session on load
    await initSession();
})();


