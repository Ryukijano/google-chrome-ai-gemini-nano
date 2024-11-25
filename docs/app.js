// app.js

/**
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { marked } from "https://cdn.jsdelivr.net/npm/marked@13.0.3/lib/marked.esm.js";
import DOMPurify from "https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.es.mjs";

(async () => {
  // DOM elements
  const errorMessage = document.getElementById("error-message");
  const costSpan = document.getElementById("cost");
  const promptArea = document.getElementById("prompt-area");
  const problematicArea = document.getElementById("problematic-area");
  const promptInput = document.getElementById("prompt-input");
  const responseArea = document.getElementById("response-area");
  const copyLinkButton = document.getElementById("copy-link-button");
  const resetButton = document.getElementById("reset-button");
  const copyHelper = document.querySelector("small");
  const rawResponse = document.getElementById("raw-response");
  const form = document.getElementById("prompt-form");
  const maxTokensInfo = document.getElementById("max-tokens");
  const temperatureInfo = document.getElementById("temperature");
  const tokensLeftInfo = document.getElementById("tokens-left");
  const tokensSoFarInfo = document.getElementById("tokens-so-far");
  const topKInfo = document.getElementById("top-k");
  const sessionTemperature = document.getElementById("session-temperature");
  const sessionTopK = document.getElementById("session-top-k");

  let session = null;

  // Check if AI capabilities are available
  if (!self.ai || !self.ai.languageModel) {
    errorMessage.classList.remove("hidden");
    errorMessage.innerHTML = `Your browser doesn't support the Prompt API. Please ensure you have enabled it.`;
    return;
  }

  promptArea.classList.remove("hidden");

  // Function to update the session
  const updateSession = async () => {
    try {
      session = await self.ai.languageModel.create({
        temperature: 0.7,
        maxTokens: 1000,
        topK: 40,
      });
      updateStats();
    } catch (error) {
      errorMessage.classList.remove("hidden");
      errorMessage.innerHTML = `Failed to create AI session: ${error.message}`;
    }
  };

  // Function to update statistics
  const updateStats = async () => {
    try {
      const capabilities = await session.capabilities();
      temperatureInfo.textContent = session.options.temperature;
      topKInfo.textContent = session.options.topK;
      tokensLeftInfo.textContent = capabilities.tokensLeft;
      tokensSoFarInfo.textContent = capabilities.tokensUsed;
    } catch (error) {
      console.error("Failed to update stats:", error);
    }
  };

  // Initialize session
  await updateSession();

  // Function to handle prompt submission
  const handlePromptSubmit = async (event) => {
    event.preventDefault();
    const prompt = promptInput.value.trim();
    if (!prompt) return;

    responseArea.classList.remove("hidden");
    responseArea.innerHTML = '';
    
    const heading = document.createElement("h3");
    heading.classList.add("prompt", "speech-bubble");
    heading.textContent = prompt;
    responseArea.appendChild(heading);
    
    const p = document.createElement("p");
    p.classList.add("response", "speech-bubble");
    p.textContent = "Generating response...";
    responseArea.appendChild(p);

    rawResponse.textContent = "";
    problematicArea.classList.add("hidden");
    copyLinkButton.classList.add("hidden");
    copyHelper.classList.add("hidden");

    let fullResponse = "";

    try {
      if (!session) {
        await updateSession();
        updateStats();
      }
      const stream = await session.promptStreaming(prompt);

      for await (const chunk of stream) {
        fullResponse += chunk;
        p.innerHTML = DOMPurify.sanitize(marked.parse(fullResponse));
        rawResponse.textContent = fullResponse;
      }
    } catch (error) {
      p.textContent = `Error: ${error.message}`;
    } finally {
      updateStats();
      copyLinkButton.classList.remove("hidden");
      copyHelper.classList.remove("hidden");
    }
  };

  // Handle form submission
  form.addEventListener("submit", handlePromptSubmit);

  // Handle Enter key without Shift
  promptInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.dispatchEvent(new Event("submit"));
    }
  });

  // Select text on focus
  promptInput.addEventListener("focus", () => {
    promptInput.select();
  });

  // Update cost as user types
  promptInput.addEventListener("input", async () => {
    const value = promptInput.value.trim();
    if (!value) {
      costSpan.textContent = "0";
      return;
    }
    try {
      const cost = await session.countPromptTokens(value);
      costSpan.textContent = `${cost} token${cost === 1 ? '' : 's'}`;
    } catch (error) {
      console.error("Failed to count tokens:", error);
    }
  });

  // Reset session
  resetButton.addEventListener("click", async () => {
    if (session) {
      await session.destroy();
      session = null;
    }
    await updateSession();
    responseArea.classList.add("hidden");
    responseArea.innerHTML = "";
    rawResponse.textContent = "";
    problematicArea.classList.add("hidden");
    copyLinkButton.classList.add("hidden");
    copyHelper.classList.add("hidden");
    promptInput.value = "";
    updateStats();
  });

  // Copy link functionality
  copyLinkButton.addEventListener("click", () => {
    const prompt = encodeURIComponent(promptInput.value.trim());
    const link = `${window.location.origin}${window.location.pathname}?prompt=${prompt}`;
    navigator.clipboard.writeText(link).then(() => {
      copyHelper.classList.remove("hidden");
      setTimeout(() => {
        copyHelper.classList.add("hidden");
      }, 2000);
    }).catch(err => {
      console.error("Failed to copy link:", err);
    });
  });
})();