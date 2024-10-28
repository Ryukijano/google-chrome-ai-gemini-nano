# Google Chrome Built-in AI Challenge

## Project Description

Dive into the world of cutting-edge AI with the Google Chrome Built-in AI Challenge! This hackathon invites developers to explore new ground by creating web applications or Chrome Extensions that leverage Chrome’s built-in AI APIs and models, including Gemini Nano.

The APIs can give you access to:
- Create dynamic user prompts (Prompt API, Prompt API in Chrome Extensions)
- Distill complex information into clear insights (Summarization API)
- Enable multilingual translation capabilities (Translation API)
- Generate original, engaging text (Write API)
- Improve your content with alternative options (Rewrite API)

Please note: all of these tasks take place in the browser, using the models downloaded to your device without a need for server calls.

This is your opportunity to experiment with these advanced capabilities and create helpful experiences that meet everyday needs. From enriching user interactions to automating intricate processes, this is your chance to explore the uncharted territory of built-in AI and help uncover its true potential.

Whether you're a seasoned web developer or just getting started, the Google Chrome Built-in AI Challenge is the perfect opportunity to showcase your skills, collaborate with others, and infuse the web with your own brand of AI ingenuity. So, gather your team, let your creativity flow, and let’s see what happens when we give the web a brain boost!

## Setup Instructions

### Enabling Gemini Nano and the Prompt API

1. **Acknowledge Google’s Generative AI Prohibited Uses Policy.**
2. **Download Chrome Dev channel (or Canary channel), and confirm that your version is equal or newer than 128.0.6545.0.**
3. **Check that your device meets the requirements.**
   - At least 22 GB of free storage space.
   - Integrated GPU, or discrete GPU (e.g. video card).
   - 4 GB (minimum) Video RAM.
   - A non-metered network connection.
4. **Enable Gemini Nano and the Prompt API:**
   - Open a new tab in Chrome, go to `chrome://flags/#optimization-guide-on-device-model`
   - Select `Enabled BypassPerfRequirement`
   - Go to `chrome://flags/#prompt-api-for-gemini-nano`
   - Select `Enabled`
   - Relaunch Chrome.
5. **Confirm availability of Gemini Nano:**
   - Open DevTools and send `(await ai.languageModel.capabilities()).available;` in the console. If this returns “readily”, then you are all set.
   - If this fails, continue as follows:
     - Force Chrome to recognize that you want to use this API. To do so, open DevTools and send `await ai.languageModel.create();` in the console. This will likely fail but it’s intended.
     - Relaunch Chrome.
     - Open a new tab in Chrome, go to `chrome://components`
     - Confirm that Gemini Nano is either available or is being downloaded. You'll want to see the Optimization Guide On Device Model present with a version greater or equal to 2024.5.21.1031.
     - If there is no version listed, click on `Check for update` to force the download.
     - Once the model has downloaded and has reached a version greater than shown above, open DevTools and send `(await ai.languageModel.capabilities()).available;` in the console. If this returns “readily”, then you are all set.
     - Otherwise, relaunch, wait for a little while, and try again from step 1.

## Early Preview Program

To get started, sign up for the [Early Preview Program](https://chrome.dev/web-ai-demos/prompt-api-playground/) to gain access to previously shared updates, the latest documentation, and stay up-to-date with any new changes, including additional APIs.

## Feedback Submission and Contact Information

We value your feedback! Please share your thoughts and experiences with us to help refine and improve the APIs and models.

- **Feedback form for quality or technical issues:** [Feedback Form](https://goo.gle/chrome-ai-dev-preview-feedback-quality)
- **Report bugs or issues related to Chrome’s behavior / implementation of the Prompt API:** [Chromium Bug Report](https://bugs.chromium.org/)
- **Report ergonomic issues or other problems related to one of the built-in AI APIs:**
  - [Prompt API spec issues](https://github.com/WICG/prompt-api/issues)
  - [Translation API spec issues](https://github.com/WICG/translation-api/issues)
- **Other questions or issues:** Reach out directly by sending an email to the mailing list owners (chrome-ai-dev-preview+owners@chromium.org).

Let's learn and build together!
