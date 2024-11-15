// contentScript.js

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if (!window.ai || !window.ai.languageModel) {
    alert("AI capabilities not available. Please enable Chrome's built-in AI features.");
    return;
  }

  const session = await window.ai.languageModel.create();
  let response = "";

  try {
    if (request.action === "summarize") {
      response = await session.summarize(request.text);
    } else if (request.action === "translate") {
      response = await session.translate({
        text: request.text,
        targetLanguage: "es" // Defaulting to Spanish; you can modify as needed
      });
    } else if (request.action === "enhance") {
      response = await session.rewrite({
        text: request.text,
        style: "professional"
      });
    }
    alert(`${request.action.charAt(0).toUpperCase() + request.action.slice(1)} Result:\n\n${response}`);
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
});