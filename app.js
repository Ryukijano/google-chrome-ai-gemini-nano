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
});
