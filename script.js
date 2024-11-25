import { marked } from "https://cdn.jsdelivr.net/npm/marked@13.0.3/lib/marked.esm.js";
import DOMPurify from "https://cdn.jsdelivr.net/npm/dompurify@3.1.6/dist/purify.es.mjs";

class ChromeAIAssistant {
  constructor() {
    this.initializeElements();
    this.initializeEventListeners();
    this.checkAISupport();
    this.currentSession = null;
  }

  initializeElements() {
    // Tab elements
    this.tabs = document.querySelectorAll('.tab-btn');
    this.tabContents = document.querySelectorAll('.tab-content');
    
    // Prompt tab elements
    this.promptForm = document.getElementById('prompt-form');
    this.promptInput = document.getElementById('prompt-input');
    this.responseArea = document.getElementById('response-area');
    this.resetButton = document.getElementById('reset-button');
    this.temperatureInput = document.getElementById('temperature-input');
    this.temperatureValue = document.getElementById('temperature-value');
    this.topKInput = document.getElementById('top-k-input');
    this.topKValue = document.getElementById('top-k-value');
    
    // Error message
    this.errorMessage = document.getElementById('error-message');
  }

  initializeEventListeners() {
    // Tab switching
    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => this.switchTab(tab));
    });

    // Prompt form submission
    this.promptForm.addEventListener('submit', (e) => this.handlePromptSubmit(e));
    
    // Reset button
    this.resetButton.addEventListener('click', () => this.resetSession());
    
    // Settings controls
    this.temperatureInput.addEventListener('input', (e) => {
      this.temperatureValue.textContent = e.target.value;
      this.updateSession();
    });
    
    this.topKInput.addEventListener('input', (e) => {
      this.topKValue.textContent = e.target.value;
      this.updateSession();
    });
  }

  async checkAISupport() {
    if (!self.ai?.languageModel) {
      this.errorMessage.style.display = 'block';
      this.errorMessage.innerHTML = `Your browser doesn't support the Prompt API. 
        If you're on Chrome, join the <a href="https://developer.chrome.com/docs/ai/built-in#get_an_early_preview">
        Early Preview Program</a> to enable it.`;
      return false;
    }
    return true;
  }

  switchTab(selectedTab) {
    // Remove active class from all tabs and contents
    this.tabs.forEach(tab => tab.classList.remove('active'));
    this.tabContents.forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    selectedTab.classList.add('active');
    const targetId = selectedTab.dataset.tab + '-tab';
    document.getElementById(targetId).classList.add('active');
  }

  async updateSession() {
    if (!await this.checkAISupport()) return;

    if (this.currentSession) {
      await this.currentSession.destroy();
    }

    this.currentSession = await self.ai.languageModel.createSession({
      temperature: parseFloat(this.temperatureInput.value),
      topK: parseInt(this.topKInput.value),
    });
  }

  async resetSession() {
    this.promptInput.value = '';
    this.responseArea.innerHTML = '';
    await this.updateSession();
  }

  async handlePromptSubmit(event) {
    event.preventDefault();
    if (!await this.checkAISupport()) return;

    const prompt = this.promptInput.value.trim();
    if (!prompt) return;

    // Create prompt bubble
    const promptBubble = document.createElement('div');
    promptBubble.classList.add('speech-bubble', 'prompt');
    promptBubble.textContent = prompt;
    this.responseArea.appendChild(promptBubble);

    // Create response bubble
    const responseBubble = document.createElement('div');
    responseBubble.classList.add('speech-bubble');
    responseBubble.textContent = 'Thinking...';
    this.responseArea.appendChild(responseBubble);

    try {
      if (!this.currentSession) {
        await this.updateSession();
      }

      const stream = await this.currentSession.promptStreaming(prompt);
      let fullResponse = '';

      for await (const chunk of stream) {
        fullResponse = chunk.trim();
        responseBubble.innerHTML = DOMPurify.sanitize(marked.parse(fullResponse));
      }
    } catch (error) {
      responseBubble.textContent = `Error: ${error.message}`;
    }
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  new ChromeAIAssistant();
});
