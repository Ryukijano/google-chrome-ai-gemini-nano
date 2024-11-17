# AI Response App

## Project Description

The **AI Response App** is a simple web application that leverages Google's Chrome built-in AI APIs to assist users in generating AI-driven responses directly within the browser. This application operates entirely client-side, using models downloaded to your device without the need for server calls.

## Features

- **AI Interaction:** Submit your prompts to receive AI-generated responses.
- **Streaming Responses:** Receive real-time responses as the AI generates them.
- **Error Handling:** Displays error messages if AI capabilities are unavailable or if other issues occur.

## Getting Started

### Prerequisites

- **Google Chrome Dev or Canary Channel:** Version **128.0.6545.0** or newer.
- **Enable Chrome's Built-in AI Features:**
  1. Open `chrome://flags/#optimization-guide-on-device-model` and set to **Enabled BypassPerfRequirement**.
  2. Open `chrome://flags/#prompt-api-for-gemini-nano` and set to **Enabled**.
  3. Relaunch Chrome.

### Installation

1. **Clone the Repository:**

    ```bash
    git clone https://github.com/your-username/ai-response-app.git
    ```

2. **Navigate to the Project Directory:**

    ```bash
    cd ai-response-app
    ```

3. **Open `index.html` in Chrome:**

    - You can simply double-click the `index.html` file or use the following command:

    ```bash
    open index.html
    ```

## Usage

1. **Enter Your Prompt:**

    - Type your prompt or text into the large text area.

2. **Submit the Prompt:**

    - Click the **Submit** button to send your prompt to the AI.

3. **View AI Response:**

    - The AI's response will appear below the input area in real-time.

## Troubleshooting

- **AI Capabilities Not Available:**
  - Ensure you're using the **Chrome Dev or Canary** channel.
  - Verify that the necessary flags are enabled (`chrome://flags`).
  - Restart Chrome after enabling flags.

- **Errors During AI Interaction:**
  - Check the console for detailed error messages.
  - Ensure a stable internet connection if required by the AI API.

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- Powered by [Chrome's Built-in AI](https://developer.chrome.com/docs/ai/built-in).