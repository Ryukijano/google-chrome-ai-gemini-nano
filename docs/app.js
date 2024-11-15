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
    const summaryOutput = document.getElementById('summary-output');
    const summarizeBtn = document.getElementById('summarize-btn');
    const summaryInput = document.getElementById('summary-input');
    const translateBtn = document.getElementById('translate-btn');
    const enhanceBtn = document.getElementById('enhance-btn');

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
            session = await initializeAI();
        } catch (error) {
            errorMessage.innerHTML = `Failed to initialize AI: ${error.message}`;
            errorMessage.style.display = "block";
        }
    }

    async function initializeAI() {
        if (!self.ai || !self.ai.languageModel) {
            displayError("Chrome AI API not available");
            return;
        }
        const session = await self.ai.languageModel.create({
            temperature: 0.7,
            topK: 40,
            // Add other initialization parameters if necessary
        });
        return session;
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

    // Summarize content
    async function summarizeContent(text) {
        if (!session) {
            await initSession();
        }
        try {
            const stream = await session.summarizeStreaming(text);
            let fullResponse = '';

            for await (const chunk of stream) {
                fullResponse += chunk;
                summaryOutput.innerHTML = DOMPurify.sanitize(marked.parse(fullResponse));
            }
        } catch (error) {
            errorMessage.innerHTML = `Error: ${error.message}`;
            errorMessage.style.display = "block";
        }
    }

    // Translate content
    async function translateContent(text, targetLanguage) {
        if (!session) {
            await initSession();
        }
        try {
            const translation = await session.translate({
                text: text,
                targetLanguage: targetLanguage,
            });
            const translatedOutput = document.getElementById('translated-output');
            translatedOutput.innerHTML = DOMPurify.sanitize(marked.parse(translation));
        } catch (error) {
            errorMessage.innerHTML = `Error: ${error.message}`;
            errorMessage.style.display = "block";
        }
    }

    // Enhance content
    async function enhanceContent(content, tone) {
        if (!session) {
            await initSession();
        }
        try {
            const enhancedText = await session.rewrite({
                text: content,
                style: tone, // e.g., 'formal', 'casual', 'professional'
            });
            const outputArea = document.getElementById('enhanced-output');
            outputArea.innerHTML = DOMPurify.sanitize(marked.parse(enhancedText));
        } catch (error) {
            errorMessage.innerHTML = `Error: ${error.message}`;
            errorMessage.style.display = "block";
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

    summarizeBtn.addEventListener('click', () => {
        const text = summaryInput.value;
        summarizeContent(text);
    });

    translateBtn.addEventListener('click', () => {
        const text = document.getElementById('translate-input').value;
        const targetLanguage = document.getElementById('language-select').value;
        translateContent(text, targetLanguage);
    });

    enhanceBtn.addEventListener('click', () => {
        const content = document.getElementById('content-input').value;
        const tone = document.getElementById('tone-select').value;
        enhanceContent(content, tone);
    });

    // Initialize session on load
    await initSession();
})();


