document.addEventListener('DOMContentLoaded', async () => {
  const promptInput = document.getElementById('prompt-input');
  const responseArea = document.getElementById('response-area');
  const submitButton = document.getElementById('submit-button');
  const errorMessage = document.getElementById('error-message');

  // Check if the AI Language Model is available
  if (!window.ai || !window.ai.languageModel) {
    errorMessage.textContent = 'AI capabilities are not available. Please ensure you are using a supported version of Chrome with built-in AI features enabled.';
    return;
  }

  // Create a new AI session
  let session;
  try {
    session = await window.ai.languageModel.create();
  } catch (error) {
    errorMessage.textContent = `Error initializing AI model: ${error.message}`;
    return;
  }

  // Handle prompt submission
  submitButton.addEventListener('click', async () => {
    const prompt = promptInput.value.trim();
    if (!prompt) {
      alert('Please enter a prompt.');
      return;
    }

    responseArea.textContent = 'Generating response...';

    try {
      // Get the response from the AI model
      const result = await session.prompt(prompt);

      // Display the response
      responseArea.textContent = result;
    } catch (error) {
      responseArea.textContent = `Error: ${error.message}`;
    }
  });
});