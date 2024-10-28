document.addEventListener('DOMContentLoaded', () => {
    const featureOutput = document.getElementById('feature-output');

    // Function to interact with the Prompt API and display results
    async function interactWithPromptAPI(prompt) {
        try {
            const { available } = await ai.languageModel.capabilities();
            if (available !== "no") {
                const session = await ai.languageModel.create();
                const result = await session.prompt(prompt);
                featureOutput.textContent = result;
            } else {
                featureOutput.textContent = "AI model is not available.";
            }
        } catch (error) {
            featureOutput.textContent = `Error: ${error.message}`;
        }
    }

    // Event listener for user input
    document.getElementById('user-input-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const userInput = document.getElementById('user-input').value;
        interactWithPromptAPI(userInput);
    });
});
