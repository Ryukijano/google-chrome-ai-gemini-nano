// script.js

(async () => {
    const errorMessage = document.getElementById('error-message');
    const notepad = document.getElementById('notepad');
    const submitButton = document.getElementById('submit-button');
    const responseArea = document.getElementById('response-area');
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

    // Enhance Writing Function (Simplified)
    async function submitText() {
        const content = notepad.value.trim();
        if (!content) {
            alert('Please enter some text to submit.');
            return;
        }

        responseArea.classList.remove('hidden');
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