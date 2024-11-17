// app.js
import { marked } from "https://cdn.jsdelivr.net/npm/marked@13.0.3/lib/marked.esm.js";
import DOMPurify from "https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.es.mjs";

(async () => {
    const errorMessage = document.getElementById('error-message');
    const userInput = document.getElementById('user-input');
    const submitButton = document.getElementById('submit-button');
    const responseContainer = document.getElementById('response-container');
    const aiResponse = document.getElementById('ai-response');

    let session = null;

    // Check for AI capabilities
    if (!window.ai || !window.ai.languageModel) {
        errorMessage.textContent = `AI capabilities not available. Please ensure you're using a supported version of Chrome and have enabled the necessary flags.`;
        errorMessage.classList.remove('hidden');
        return;
    }

    // Initialize AI session
    async function initSession() {
        try {
            session = await window.ai.languageModel.create();
        } catch (error) {
            errorMessage.textContent = `Failed to initialize AI session: ${error.message}`;
            errorMessage.classList.remove('hidden');
        }
    }

    // Submit Text Function
    async function submitText() {
        const content = userInput.value.trim();
        if (!content) {
            alert('Please enter some text to submit.');
            return;
        }

        responseContainer.classList.remove('hidden');
        aiResponse.textContent = "Generating response...";

        try {
            if (!session) {
                await initSession();
                if (!session) return;
            }

            // Use the streaming API
            const stream = await session.promptStreaming(content);
            let fullResponse = '';

            for await (const chunk of stream) {
                fullResponse += chunk;
                aiResponse.textContent = fullResponse;
            }

        } catch (error) {
            aiResponse.textContent = `Error: ${error.message}`;
        }
    }

    // Event Listener for Submit Button
    submitButton.addEventListener('click', submitText);

    // Initialize session on page load
    await initSession();
})();


