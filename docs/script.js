import { marked } from "https://cdn.jsdelivr.net/npm/marked@13.0.3/lib/marked.esm.js";
import DOMPurify from "https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.es.mjs";

(async () => {
  const errorMessage = document.getElementById("error-message");
  const costSpan = document.getElementById("cost");
  const promptArea = document.getElementById("prompt-area");
  const problematicArea = document.getElementById("problematic-area");
  const promptInput = document.getElementById("prompt-input");
  const responseArea = document.getElementById("response-area");
  const copyLinkButton = document.getElementById("copy-link-button");
  const resetButton = document.getElementById("reset-button");
  const copyHelper = document.querySelector("small");
  const rawResponse = document.querySelector("details div");
  const form = document.querySelector("form");
  const maxTokensInfo = document.getElementById("max-tokens");
  const temperatureInfo = document.getElementById("temperature");
  const tokensLeftInfo = document.getElementById("tokens-left");
  const tokensSoFarInfo = document.getElementById("tokens-so-far");
  const topKInfo = document.getElementById("top-k");
  const sessionTemperature = document.getElementById("session-temperature");
  const sessionTopK = document.getElementById("session-top-k");

  promptArea.style.display = "none";
  responseArea.style.display = "none";

  let session = null;

  if (!self.ai || !self.ai.languageModel) {
    errorMessage.style.display = "block";
    errorMessage.innerHTML = `Your browser doesn't support the Prompt API. If you're on Chrome, join the <a href="https://developer.chrome.com/docs/ai/built-in#get_an_early_preview">Early Preview Program</a> to enable it.`;
    return;
  }

  // Check GPU availability
  try {
    const capabilities = await self.ai.getCapabilities();
    console.log("Initial AI Capabilities:", capabilities);
    if (!capabilities.gpu) {
      console.warn("GPU acceleration not available");
      errorMessage.style.display = "block";
      errorMessage.innerHTML += `<br>Warning: GPU acceleration is not available. Performance may be reduced.`;
    }
  } catch (error) {
    console.error("Error checking capabilities:", error);
  }

  // Set default values
  sessionTemperature.value = "0.7";
  sessionTopK.value = "20";

  promptArea.style.display = "block";
  copyLinkButton.style.display = "none";
  copyHelper.style.display = "none";

  const promptModel = async (highlight = false) => {
    console.log("Starting promptModel");
    copyLinkButton.style.display = "none";
    copyHelper.style.display = "none";
    problematicArea.style.display = "none";
    const prompt = promptInput.value.trim();
    console.log("Prompt:", prompt);
    if (!prompt) return;
    responseArea.style.display = "block";
    const heading = document.createElement("h3");
    heading.classList.add("prompt", "speech-bubble");
    heading.textContent = prompt;
    responseArea.append(heading);
    const p = document.createElement("p");
    p.classList.add("response", "speech-bubble");
    p.textContent = "Generating response...";
    responseArea.append(p);
    let fullResponse = "";

    try {
      console.log("Checking session");
      if (!session) {
        console.log("Creating new session");
        await updateSession();
        updateStats();
      }
      console.log("Getting stream");
      const stream = await session.promptStreaming(prompt);
      console.log("Got stream, starting loop");

      for await (const chunk of stream) {
        console.log("Received chunk:", chunk);
        fullResponse = chunk.trim();
        p.innerHTML = DOMPurify.sanitize(marked.parse(fullResponse));
        rawResponse.innerText = fullResponse;
      }
    } catch (error) {
      console.error("Error in promptModel:", error);
      p.textContent = `Error: ${error.message}`;
    } finally {
      if (highlight) {
        problematicArea.style.display = "block";
        problematicArea.querySelector("#problem").innerText =
          decodeURIComponent(highlight).trim();
      }
      copyLinkButton.style.display = "inline-block";
      copyHelper.style.display = "inline";
      updateStats();
    }
  };

  const updateStats = () => {
    if (!session) {
      return;
    }
    const { maxTokens, temperature, tokensLeft, tokensSoFar, topK } = session;
    maxTokensInfo.textContent = new Intl.NumberFormat("en-US").format(
      maxTokens,
    );
    temperatureInfo.textContent = new Intl.NumberFormat("en-US", {
      maximumSignificantDigits: 5,
    }).format(temperature);
    tokensLeftInfo.textContent = new Intl.NumberFormat("en-US").format(
      tokensLeft,
    );
    tokensSoFarInfo.textContent = new Intl.NumberFormat("en-US").format(
      tokensSoFar,
    );
    topKInfo.textContent = new Intl.NumberFormat("en-US").format(topK);
  };

  const params = new URLSearchParams(location.search);
  const urlPrompt = params.get("prompt");
  const highlight = params.get("highlight");
  if (urlPrompt) {
    promptInput.value = decodeURIComponent(urlPrompt).trim();
    await promptModel(highlight);
  }

  form.addEventListener("submit", async (e) => {
    console.log("Form submitted");
    e.preventDefault();
    const currentPrompt = promptInput.value;
    await promptModel();
    promptInput.value = currentPrompt; // Restore the input value
  });

  promptInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      form.dispatchEvent(new Event("submit"));
    }
  });

  promptInput.addEventListener("focus", () => {
    promptInput.select();
  });

  promptInput.addEventListener("input", async () => {
    const value = promptInput.value.trim();
    if (!value) {
      return;
    }
    const cost = await session.countPromptTokens(value);
    if (!cost) {
      return;
    }
    costSpan.textContent = `${cost} token${cost === 1 ? '' : 's'}`;
  });

  const resetUI = () => {
    responseArea.style.display = "none";
    responseArea.innerHTML = "";
    rawResponse.innerHTML = "";
    problematicArea.style.display = "none";
    copyLinkButton.style.display = "none";
    copyHelper.style.display = "none";
    maxTokensInfo.textContent = "";
    temperatureInfo.textContent = "";
    tokensLeftInfo.textContent = "";
    tokensSoFarInfo.textContent = "";
    topKInfo.textContent = "";
    promptInput.focus();
  };

  resetButton.addEventListener("click", () => {
    promptInput.value = "";
    resetUI();
    session.destroy();
    session = null;
    updateSession();
  });

  copyLinkButton.addEventListener("click", () => {
    const prompt = promptInput.value.trim();
    if (!prompt) return;
    const url = new URL(self.location.href);
    url.searchParams.set("prompt", encodeURIComponent(prompt));
    const selection = getSelection().toString() || "";
    if (selection) {
      url.searchParams.set("highlight", encodeURIComponent(selection));
    } else {
      url.searchParams.delete("highlight");
    }
    navigator.clipboard.writeText(url.toString()).catch((err) => {
      alert("Failed to copy link: ", err);
    });
    const text = copyLinkButton.textContent;
    copyLinkButton.textContent = "Copied";
    setTimeout(() => {
      copyLinkButton.textContent = text;
    }, 3000);
  });

  const updateSession = async () => {
    console.log("Creating new session with:", {
      temperature: sessionTemperature.value,
      topK: sessionTopK.value
    });
    try {
      // Check if GPU is available
      const capabilities = await self.ai.getCapabilities();
      console.log("AI Capabilities:", capabilities);
      
      // Create session with GPU acceleration
      session = await self.ai.languageModel.create({
        temperature: Number(sessionTemperature.value),
        topK: Number(sessionTopK.value),
        useGpu: true, // Explicitly request GPU
      });
      console.log("Session created successfully");
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
    resetUI();
    updateStats();
  };

  sessionTemperature.addEventListener("input", async () => {
    await updateSession();
  });

  sessionTopK.addEventListener("input", async () => {
    await updateSession();
  });

  // Initialize the session stats
  updateStats();
})();
