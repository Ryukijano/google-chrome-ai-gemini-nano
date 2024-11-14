// script.js
import { marked } from "https://cdn.jsdelivr.net/npm/marked@13.0.3/lib/marked.esm.js";
import DOMPurify from "https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.es.mjs";

async function initializeAI() {
    if (!self.ai || !self.ai.languageModel) {
        errorMessage.style.display = "block";
        errorMessage.innerHTML = `Your browser doesn't support the Prompt API...`;
        return;
    }

    try {
        const session = await self.ai.languageModel.create({
            temperature: 0.7,
            topK: 40,
        });
        return session;
    } catch (error) {
        displayError("Failed to initialize AI: " + error.message);
    }
}

async function generateIdeas(prompt) {
    const session = await initializeAI();
    try {
        const stream = await session.promptStreaming(prompt);
        let response = '';
        
        for await (const chunk of stream) {
            response += chunk;
            updateUI(response);
        }
    } catch (error) {
        displayError(error.message);
    }
}

async function generateContent(prompt) {
    const session = await initializeAI();
    try {
        const stream = await session.promptStreaming(prompt);
        const responseArea = document.getElementById('response-area');
        let fullResponse = '';
        
        for await (const chunk of stream) {
            fullResponse += chunk;
            // Parse markdown and sanitize HTML
            const sanitizedHTML = DOMPurify.sanitize(marked.parse(fullResponse));
            responseArea.innerHTML = sanitizedHTML;
        }
    } catch (error) {
        displayError(error.message);
    }
}

async function enhanceContent(content) {
    const session = await initializeAI();
    try {
        const stream = await session.promptStreaming(
            `Enhance this content: ${content}`
        );
        const outputArea = document.getElementById('enhanced-output');
        let fullResponse = '';
        
        for await (const chunk of stream) {
            fullResponse += chunk;
            outputArea.innerHTML = DOMPurify.sanitize(marked.parse(fullResponse));
        }
    } catch (error) {
        displayError(error.message);
    }
}

document.getElementById('generate-btn').addEventListener('click', async () => {
    const prompt = promptInput.value;
    const response = await generateContent(prompt);
    responseArea.innerHTML = response;
});

document.getElementById('enhance-btn').addEventListener('click', async () => {
    const content = promptInput.value;
    const response = await enhanceContent(content);
    responseArea.innerHTML = response;
});

document.getElementById('translate-btn').addEventListener('click', async () => {
    const content = promptInput.value;
    const language = document.getElementById('language-select').value;
    const response = await translateContent(content, language);
    responseArea.innerHTML = response;
});


