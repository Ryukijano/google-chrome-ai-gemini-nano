document.getElementById('submit-button').addEventListener('click', async () => {
  const promptInput = document.getElementById('prompt-input');
  const responseArea = document.getElementById('response-area');
  const prompt = promptInput.value.trim();

  if (!prompt) {
    alert('Please enter a prompt.');
    return;
  }

  responseArea.textContent = 'Loading...';

  try {
    // Check if the AI Language Model is available
    if (!window.ai || !window.ai.languageModel) {
      responseArea.textContent = 'AI capabilities not available. Please ensure you are using a compatible version of Chrome with the built-in AI features enabled.';
      return;
    }

    // Create a new session
    const session = await window.ai.languageModel.create();

    // Get the response from the AI model
    const result = await session.prompt(prompt);

    // Display the response
    responseArea.textContent = result;
  } catch (error) {
    responseArea.textContent = `Error: ${error.message}`;
  }
});