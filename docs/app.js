// app.js
import { marked } from "https://cdn.jsdelivr.net/npm/marked@13.0.3/lib/marked.esm.js";
import DOMPurify from "https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.es.mjs";

(async () => {
    const errorMessage = document.getElementById('error-message');
    const promptForm = document.getElementById('prompt-form');
    const promptInput = document.getElementById('prompt-input');
    const responseArea = document.getElementById('response-area');

    let session = null;

    // Check for API support
    if (!window.ai || !window.ai.languageModel) {
        errorMessage.textContent = "AI capabilities not available. Please ensure you're using a supported version of Chrome and have enabled the necessary flags.";
        return;
    }

    // Initialize AI session
    async function initSession() {
        try {
            session = await window.ai.languageModel.create();
        } catch (error) {
            errorMessage.textContent = `Failed to initialize AI session: ${error.message}`;
        }
    }

    // Handle form submission
    promptForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const prompt = promptInput.value.trim();
        if (!prompt) return;

        responseArea.textContent = "Processing...";

        try {
            // Initialize session if it hasn't been already
            if (!session) {
                await initSession();
                if (!session) return;
            }

            // Send the prompt to the AI model and get the response
            const responseStream = await session.generate(prompt);

            let finalResponse = '';

            // Collect the streamed response
            for await (const chunk of responseStream) {
                finalResponse += chunk;
            }

            responseArea.textContent = finalResponse;

        } catch (error) {
            responseArea.textContent = `Error: ${error.message}`;
        }
    });

    // Initialize session on page load
    await initSession();
})();


