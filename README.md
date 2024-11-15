# AI-Powered Content Creation Studio

## Project Description

The **AI-Powered Content Creation Studio** is a web application that leverages Google's Chrome built-in AI APIs and models, including Gemini Nano, to assist users in creating and enhancing content seamlessly within the browser. This application operates entirely client-side, using models downloaded to your device without the need for server calls.

### APIs Utilized:

- **Prompt API**: Create dynamic user prompts and interact with the AI model.
- **Summarization API**: Distill complex information into clear insights.
- **Translation API**: Enable multilingual translation capabilities.
- **Rewrite API**: Improve your content with alternative options.

## Features

- **Idea Generation**: Generate blog post ideas, social media captions, or marketing copy based on user-provided keywords or topics.
- **Content Writing**: Utilize AI to create different types of content, such as articles, poems, scripts, or even code.
- **Content Enhancement**: Offer suggestions for improving existing content (e.g., rephrasing sentences, adjusting tone, enhancing clarity).
- **Summarization**: Summarize long pieces of text into concise summaries.
- **Multilingual Support**: Translate content into different languages.

## Demo

Access the live application here: [AI-Powered Content Creation Studio](https://Ryukijano.github.io/google-chrome-ai-gemini-nano)

## Getting Started

### Prerequisites

- **Google Chrome Dev or Canary Channel**: Version 128.0.6545.0 or newer.
- **Enable Chrome's Built-in AI Features**:
  - Open `chrome://flags/#optimization-guide-on-device-model` and set to **Enabled BypassPerfRequirement**.
  - Open `chrome://flags/#prompt-api-for-gemini-nano` and set to **Enabled**.
  - Relaunch Chrome.
  - Confirm availability by running `(await ai.languageModel.capabilities()).available;` in the DevTools console. It should return `"readily"`.

  Project Structure

  google-chrome-ai-gemini-nano/
├── docs/
│   ├── [index.html](http://_vscodecontentref_/1)       # Main HTML file
│   ├── [app.js](http://_vscodecontentref_/2)           # JavaScript logic for AI interactions
│   ├── [style.css](http://_vscodecontentref_/3)        # CSS styling
│   ├── _config.yml      # GitHub Pages configuration
│   └── CNAME            # Custom domain configuration
├── LICENSE              # Project license
├── [package.json](http://_vscodecontentref_/4)         # Project metadata
├── [README.md](http://_vscodecontentref_/5)            # Project documentation
└── [setup.md](http://_vscodecontentref_/6)             # Setup instructions for enabling AI features



### Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/Ryukijano/google-chrome-ai-gemini-nano.git

License
This project is licensed under the Apache License 2.0 - see the LICENSE file for details.

Acknowledgments
Google Chrome Built-in AI Challenge: For inspiring the creation of this project.
Gemini Nano Model: The AI model powering the application.
Prompt API Playground: Served as a foundation for implementing the Prompt API.

## New Features

- **Contextual Memory with System Prompts:** The application now maintains a conversation history and uses a system prompt to guide AI responses.
- **Chrome Extension for In-Page Interaction:** Users can select text on any webpage and perform AI-assisted actions like summarization, translation, and enhancement.
- **Agent Functionality:** The app can interpret commands in the input to perform specific actions, similar to LangChain agents.

## Chrome Extension Usage

1. **Installation:**

   - Clone the repository.
   - Navigate to `ai-content-assistant-extension` directory.
   - Open `chrome://extensions/` in Chrome.
   - Enable **Developer mode**.
   - Click **Load unpacked** and select the extension directory.

2. **Usage:**

   - Highlight text on any webpage.
   - Right-click to open the context menu.
   - Choose an action: **Summarize Selected Text**, **Translate Selected Text**, or **Enhance Selected Text**.
   - An alert will display the AI-generated result.

---

### **6. Important Considerations**

- **Permissions:** Ensure all necessary permissions are declared in `manifest.json`, especially `"host_permissions"` for accessing all URLs.
- **AI Capabilities Availability:** The AI features rely on Chrome's experimental APIs. Ensure users have enabled the necessary flags and are using a compatible version of Chrome.
- **Error Handling:** Include appropriate error messages and guide users on troubleshooting steps if AI capabilities are unavailable.

---

### **7. Next Steps**

To further improve and expand your project:

- **Customizable Settings:** Allow users to select target languages for translation or tones for content enhancement within the extension.
- **GUI Enhancements:** Improve the user interface for better accessibility and user experience.
- **Extension Publishing:** Once tested, consider publishing the extension in the Chrome Web Store for broader access.

---

By integrating these features, your application provides users with powerful, in-browser AI tools for content creation and enhancement without relying on external servers. This setup ensures quick responses and maintains user privacy, as all processing occurs locally within the browser.

If you need assistance with specific implementation details or additional features, feel free to ask!## New Features

- **Contextual Memory with System Prompts:** The application now maintains a conversation history and uses a system prompt to guide AI responses.
- **Chrome Extension for In-Page Interaction:** Users can select text on any webpage and perform AI-assisted actions like summarization, translation, and enhancement.
- **Agent Functionality:** The app can interpret commands in the input to perform specific actions, similar to LangChain agents.

## Chrome Extension Usage

1. **Installation:**

   - Clone the repository.
   - Navigate to `ai-content-assistant-extension` directory.
   - Open `chrome://extensions/` in Chrome.
   - Enable **Developer mode**.
   - Click **Load unpacked** and select the extension directory.

2. **Usage:**

   - Highlight text on any webpage.
   - Right-click to open the context menu.
   - Choose an action: **Summarize Selected Text**, **Translate Selected Text**, or **Enhance Selected Text**.
   - An alert will display the AI-generated result.

---

### **6. Important Considerations**

- **Permissions:** Ensure all necessary permissions are declared in `manifest.json`, especially `"host_permissions"` for accessing all URLs.
- **AI Capabilities Availability:** The AI features rely on Chrome's experimental APIs. Ensure users have enabled the necessary flags and are using a compatible version of Chrome.
- **Error Handling:** Include appropriate error messages and guide users on troubleshooting steps if AI capabilities are unavailable.

---

### **7. Next Steps**

To further improve and expand your project:

- **Customizable Settings:** Allow users to select target languages for translation or tones for content enhancement within the extension.
- **GUI Enhancements:** Improve the user interface for better accessibility and user experience.
- **Extension Publishing:** Once tested, consider publishing the extension in the Chrome Web Store for broader access.

---

By integrating these features, your application provides users with powerful, in-browser AI tools for content creation and enhancement without relying on external servers. This setup ensures quick responses and maintains user privacy, as all processing occurs locally within the browser.

If you need assistance with specific implementation details or additional features, feel free to ask!