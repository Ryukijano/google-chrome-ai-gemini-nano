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