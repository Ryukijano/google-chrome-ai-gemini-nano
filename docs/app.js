// script.js
import { marked } from "https://cdn.jsdelivr.net/npm/marked@13.0.3/lib/marked.esm.js";
import DOMPurify from "https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.es.mjs";

(async () => {
    const errorMessage = document.getElementById("error-message");
    const promptArea = document.getElementById("prompt-area");
    const promptInput = document.getElementById("prompt-input");
    const responseArea = document.getElementById("response-area");
    const rawResponse = document.querySelector("details div");
    const form = document.querySelector("form");
    const resetButton = document.getElementById("reset-button");

    let session = null;

    // Check for API support
    if (!self.ai || !self.ai.languageModel) {
        errorMessage.style.display = "block";
        errorMessage.innerHTML = `Your browser doesn't support the Prompt API. If you're on Chrome, join the <a href="https://developer.chrome.com/docs/ai/built-in#get_an_early_preview">Early Preview Program</a> to enable it.`;
        return;
    }

    promptArea.style.display = "block";

    // Initialize AI session
    async function initSession() {
        try {
            session = await self.ai.languageModel.create({
                temperature: 0.7,
                topK: 40,
            });
        } catch (error) {
            errorMessage.innerHTML = `Failed to initialize AI: ${error.message}`;
            errorMessage.style.display = "block";
        }
    }

    // Handle prompt submission
    async function handlePrompt() {
        const prompt = promptInput.value.trim();
        if (!prompt) return;

        responseArea.innerHTML = "Generating response...";
        let fullResponse = "";

        try {
            if (!session) {
                await initSession();
            }
            const stream = await session.promptStreaming(prompt);

            for await (const chunk of stream) {
                fullResponse = chunk.trim();
                responseArea.innerHTML = DOMPurify.sanitize(marked.parse(fullResponse));
                rawResponse.innerText = fullResponse;
            }
        } catch (error) {
            responseArea.innerHTML = `Error: ${error.message}`;
        }
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


