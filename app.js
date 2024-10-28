document.addEventListener('DOMContentLoaded', () => {
    // Function to interact with the Prompt API and send results to the background script
    async function interactWithPromptAPI(prompt) {
        try {
            const { available } = await ai.languageModel.capabilities();
            if (available !== "no") {
                const session = await ai.languageModel.create();
                const result = await session.prompt(prompt);
                displayResult(result);
            } else {
                displayError("AI model is not available.");
            }
        } catch (error) {
            displayError(error.message);
        }
    }

    // Function to display the result on the webpage
    function displayResult(result) {
        const featureOutput = document.getElementById('feature-output');
        featureOutput.innerHTML = `<p>${result}</p>`;
    }

    // Function to display error messages on the webpage
    function displayError(message) {
        const featureOutput = document.getElementById('feature-output');
        featureOutput.innerHTML = `<p class="error">${message}</p>`;
    }

    // Load Gemini Nano when the website is opened
    interactWithPromptAPI("Load Gemini Nano");

    // Function to generate blog post ideas, social media captions, or marketing copy
    async function generateIdea() {
        const keywords = document.getElementById('idea-keywords').value;
        interactWithPromptAPI(`Generate ideas for: ${keywords}`);
    }

    // Function to write different types of content
    async function writeContent() {
        const topic = document.getElementById('content-topic').value;
        interactWithPromptAPI(`Write content about: ${topic}`);
    }

    // Function to enhance existing content
    async function enhanceContent() {
        const existingContent = document.getElementById('existing-content').value;
        interactWithPromptAPI(`Enhance the following content: ${existingContent}`);
    }

    // Function to translate content into different languages
    async function translateContent() {
        const content = document.getElementById('content-to-translate').value;
        const targetLanguage = document.getElementById('target-language').value;
        interactWithPromptAPI(`Translate the following content to ${targetLanguage}: ${content}`);
    }
});
