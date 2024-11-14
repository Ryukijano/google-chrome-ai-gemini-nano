// script.js
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


