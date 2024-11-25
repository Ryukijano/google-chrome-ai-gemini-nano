// app.js

import { marked } from 'https://cdn.jsdelivr.net/npm/marked@4.3.0/marked.min.js';
import DOMPurify from 'https://cdn.jsdelivr.net/npm/dompurify@3.1.1/dist/purify.min.js';

(async () => {
  // DOM elements
  const errorMessage = document.getElementById('error-message');
  const promptArea = document.getElementById('prompt-area');
  const promptForm = document.getElementById('prompt-form');
  const promptInput = document.getElementById('prompt-input');
  const responseArea = document.getElementById('response-area');
  const resetButton = document.getElementById('reset-button');

  let session = null;

  // Check if AI capabilities are available
  if (!self.ai || !self.ai.languageModel) {
    errorMessage.style.display = 'block';
    errorMessage.innerHTML = `Your browser doesn't support the Prompt API. Please ensure you have enabled it.`;
    return;
  }

  promptArea.style.display = 'block';

  // Function to update the session
  const updateSession = async () => {
    session = await self.ai.languageModel.create();
  };

  // Initialize session
  await updateSession();

  // Function to handle prompt submission
  const handlePromptSubmit = async (event) => {
    event.preventDefault();
    const prompt = promptInput.value.trim();
    if (!prompt) return;

    responseArea.style.display = 'block';
    responseArea.innerHTML = 'Generating response...';

    try {
      const stream = await session.promptStreaming(prompt);
      let fullResponse = '';

      for await (const chunk of stream) {
        fullResponse += chunk;
        responseArea.innerHTML = DOMPurify.sanitize(marked.parse(fullResponse));
      }
    } catch (error) {
      responseArea.innerHTML = `Error: ${error.message}`;
    }
  };

  // Handle form submission
  promptForm.addEventListener('submit', handlePromptSubmit);

  // Reset session
  resetButton.addEventListener('click', async () => {
    await session.destroy();
    await updateSession();
    responseArea.style.display = 'none';
    responseArea.innerHTML = '';
    promptInput.value = '';
  });
})();