// app.js

import { marked } from 'https://cdn.jsdelivr.net/npm/marked@13.0.3/lib/marked.esm.js';
import DOMPurify from 'https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.esm.js';

(async () => {
  const promptInput = document.getElementById('prompt-input');
  const submitButton = document.getElementById('submit-button');
  const responseArea = document.getElementById('response-area');

  if (!self.ai || !self.ai.languageModel) {
    alert("AI capabilities not available. Please enable Chrome's built-in AI features.");
    return;
  }

  const session = await self.ai.languageModel.create();

  submitButton.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) return;

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
  });
})();