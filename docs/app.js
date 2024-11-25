// app.js

import { marked } from 'https://cdn.jsdelivr.net/npm/marked@4.3.0/lib/marked.esm.js';
import DOMPurify from 'https://cdn.jsdelivr.net/npm/dompurify@3.1.1/dist/purify.esm.js';

(async () => {
  const promptInput = document.getElementById('prompt-input');
  const submitButton = document.getElementById('submit-button');
  const resetButton = document.getElementById('reset-button');
  const responseArea = document.getElementById('response-area');
  const temperatureInfo = document.getElementById('temperature-info');
  const tokensInfo = document.getElementById('tokens-info');

  if (!self.ai || !self.ai.languageModel) {
    alert("AI capabilities not available. Please enable Chrome's built-in AI features.");
    return;
  }

  let session = await self.ai.languageModel.create({
    temperature: 0.7,
  });

  temperatureInfo.textContent = session.options.temperature;

  const displayResponse = (content) => {
    responseArea.innerHTML = DOMPurify.sanitize(marked.parse(content));
  };

  let totalTokensUsed = 0;

  submitButton.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) return;

    responseArea.innerHTML = 'Generating response...';

    try {
      const stream = await session.promptStreaming(prompt);
      let fullResponse = '';

      for await (const chunk of stream) {
        fullResponse += chunk;
        displayResponse(fullResponse);
        const tokensUsed = await session.countTokens(chunk);
        totalTokensUsed += tokensUsed;
        tokensInfo.textContent = totalTokensUsed;
      }
    } catch (error) {
      responseArea.innerHTML = `Error: ${error.message}`;
    }
  });

  resetButton.addEventListener('click', async () => {
    await session.destroy();
    session = await self.ai.languageModel.create();
    responseArea.innerHTML = '';
    promptInput.value = '';
  });
})();