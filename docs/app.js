// app.js
import { marked } from "https://cdn.jsdelivr.net/npm/marked@13.0.3/lib/marked.esm.js";
import DOMPurify from "https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.esm.js";

(async () => {
    const errorMessage = document.getElementById("error-message");
    const promptInput = document.getElementById("prompt-input");
    const responseArea = document.getElementById("response-area");
    const rawResponse = document.getElementById("raw-response");
    const form = document.querySelector("form");
    const resetButton = document.getElementById("reset-button");

    // User Preferences Elements
    const targetLanguageInput = document.getElementById("target-language");
    const toneSelect = document.getElementById("tone-select");

    let session = null;

    // Define a system prompt to guide the AI's behavior
    const systemPrompt = "You are an AI assistant that helps users with content creation tasks. You can perform summarization, translation, content enhancement, and idea generation based on the user's request.";

    let conversationHistory = [
        { role: 'system', content: systemPrompt }
    ];

    // User Preferences
    const userPreferences = {
        targetLanguage: 'es', // default to Spanish
        tone: 'professional',
    };

    // Update user preferences based on inputs
    targetLanguageInput.addEventListener('input', () => {
        userPreferences.targetLanguage = targetLanguageInput.value.trim() || 'es';
    });

    toneSelect.addEventListener('change', () => {
        userPreferences.tone = toneSelect.value;
    });

    // Check for API support
    if (!self.ai || !self.ai.languageModel) {
        errorMessage.style.display = "block";
        errorMessage.innerHTML = `Your browser doesn't support the Prompt API. Please ensure you have enabled the necessary flags.`;
        return;
    }

    // Initialize AI session
    async function initSession() {
        try {
            const capabilities = await self.ai.languageModel.capabilities();
            session = await self.ai.languageModel.create({
                temperature: 0.7,
                topK: 40,
                maxOutputTokens: capabilities.maxTokens,
            });
        } catch (error) {
            errorMessage.innerHTML = `Failed to initialize AI: ${error.message}`;
            errorMessage.style.display = "block";
        }
    }

    // Classify Intent
    async function classifyIntent(userInput) {
        const classificationPrompt = `
Determine the user's intent from the following categories: Summarize, Translate, Enhance, Generate Ideas, General Query. Respond with one word indicating the intent.

User input: "${userInput}"

Intent:
`;
        if (!session) {
            await initSession();
        }
        const response = await session.prompt(classificationPrompt);
        return response.trim().toLowerCase();
    }

    // Handle user input
    async function handleUserInput() {
        const userInput = promptInput.value.trim();
        if (!userInput) return;

        responseArea.innerHTML = "Processing...";
        rawResponse.innerText = "";

        if (!session) {
            await initSession();
        }

        try {
            // Get intent
            const intent = await classifyIntent(userInput);

            // Call the appropriate function based on the intent
            if (intent.includes('summarize')) {
                await summarizeContent(userInput);
            } else if (intent.includes('translate')) {
                await translateContent(userInput);
            } else if (intent.includes('enhance')) {
                await enhanceContent(userInput);
            } else if (intent.includes('generate ideas')) {
                await generateIdeas(userInput);
            } else {
                // Default to general assistant response
                await generalResponse(userInput);
            }
        } catch (error) {
            displayError(error);
        }
    }

    // Implement the action functions
    async function summarizeContent(text) {
        try {
            const summary = await session.summarize(text);
            displayResponse(summary, 'summarize');
        } catch (error) {
            displayError(error);
        }
    }

    async function translateContent(text) {
        const targetLanguage = userPreferences.targetLanguage || 'es';
        try {
            const translation = await session.translate({
                text: text,
                targetLanguage: targetLanguage,
            });
            displayResponse(translation, 'translate');
        } catch (error) {
            displayError(error);
        }
    }

    async function enhanceContent(text) {
        const style = userPreferences.tone || 'professional';
        try {
            const enhancedText = await session.rewrite({
                text: text,
                style: style,
            });
            displayResponse(enhancedText, 'enhance');
        } catch (error) {
            displayError(error);
        }
    }

    async function generateIdeas(prompt) {
        try {
            const ideas = await session.prompt(`Generate ideas about: ${prompt}`);
            displayResponse(ideas, 'generate ideas');
        } catch (error) {
            displayError(error);
        }
    }

    async function generalResponse(prompt) {
        try {
            const response = await session.prompt(prompt);
            displayResponse(response, 'general');
        } catch (error) {
            displayError(error);
        }
    }

    function displayResponse(content, intent) {
        responseArea.innerHTML = '';

        const intentHeading = document.createElement('h3');
        intentHeading.textContent = `Action: ${intent.charAt(0).toUpperCase() + intent.slice(1)}`;
        responseArea.appendChild(intentHeading);

        const contentDiv = document.createElement('div');
        contentDiv.innerHTML = DOMPurify.sanitize(marked.parse(content));
        responseArea.appendChild(contentDiv);

        rawResponse.innerText = content;
    }

    function displayError(error) {
        responseArea.innerHTML = `Error: ${error.message}`;
    }

    // Event Listeners
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        await handleUserInput();
    });

    resetButton.addEventListener("click", async () => {
        promptInput.value = "";
        responseArea.innerHTML = "";
        rawResponse.innerHTML = "";
        conversationHistory = [
            { role: 'system', content: systemPrompt }
        ];
        if (session) {
            session.destroy();
            session = null;
        }
        await initSession();
    });

    // Initialize session on load
    await initSession();
})();


