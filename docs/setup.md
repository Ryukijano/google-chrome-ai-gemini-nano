# Setup Instructions for Enabling Gemini Nano and the Prompt API

## Prerequisites

1. **Acknowledge Google’s Generative AI Prohibited Uses Policy.**
2. **Download Chrome Dev channel (or Canary channel), and confirm that your version is equal or newer than 128.0.6545.0.**
3. **Check that your device meets the requirements:**
   - At least 22 GB of free storage space.
   - Integrated GPU, or discrete GPU (e.g. video card).
   - 4 GB (minimum) Video RAM.
   - A non-metered network connection.

## Enabling Gemini Nano and the Prompt API

1. **Enable Gemini Nano and the Prompt API:**
   - Open a new tab in Chrome, go to `chrome://flags/#optimization-guide-on-device-model`
   - Select `Enabled BypassPerfRequirement`
   - Go to `chrome://flags/#prompt-api-for-gemini-nano`
   - Select `Enabled`
   - Relaunch Chrome.

2. **Confirm availability of Gemini Nano:**
   - Open DevTools and send `(await ai.languageModel.capabilities()).available;` in the console. If this returns “readily”, then you are all set.
   - If this fails, continue as follows:
     - Force Chrome to recognize that you want to use this API. To do so, open DevTools and send `await ai.languageModel.create();` in the console. This will likely fail but it’s intended.
     - Relaunch Chrome.
     - Open a new tab in Chrome, go to `chrome://components`
     - Confirm that Gemini Nano is either available or is being downloaded. You'll want to see the Optimization Guide On Device Model present with a version greater or equal to 2024.5.21.1031.
     - If there is no version listed, click on `Check for update` to force the download.
     - Once the model has downloaded and has reached a version greater than shown above, open DevTools and send `(await ai.languageModel.capabilities()).available;` in the console. If this returns “readily”, then you are all set.
     - Otherwise, relaunch, wait for a little while, and try again from step 1.

## Troubleshooting Tips and Common Issues

### Model Download Delay

The browser may not start downloading the model right away. If your computer fulfills all the requirements and you don't see the model download start on `chrome://components` after calling `ai.languageModel.create()`, and Optimization Guide On Device Model shows version 0.0.0.0 / New, leave the browser open for a few minutes to wait for the scheduler to start the download.

### Debug Logs

If everything fails:
1. Open a new tab
2. Go to `chrome://gpu`
3. Download the GPU report
4. Go to `chrome://histograms/#OptimizationGuide.ModelExecution.OnDeviceModelInstallCriteria.AtRegistration.DiskSpace`
   - If you see records for 0, it means that your device doesn’t have enough storage space for the model. Ensure that you have at least 22 GB on the disk with your user profile, and retry the setup steps. If you are still stuck, continue with the other steps below.

On qualifying systems, the histogram should look similar to the following example:

- Histogram: `OptimizationGuide.ModelExecution.OnDeviceModelInstallCriteria.AtRegistration.DiskSpace` recorded 1 samples, mean = 1.0 (flags = 0x41) [#]

5. Go to `chrome://histograms/#OptimizationGuide` and download the histograms report
6. Share both reports with the Early Preview Program coordinators.

### Crash Logs

If you encounter a crash error message such as “the model process crashed too many times for this version.”, then we’ll need a crash ID to investigate the root causes.
1. Ensure that you have enabled crash reporting.
2. Reproduce the issue.
3. Go to `chrome://crashes`
4. Find the most recent crash
5. Hit `Send now` if necessary.
6. Then wait and reload until the Status line changes from `Not uploaded` to `Uploaded`. Note that this could take a while.
7. Copy the ID next to the `Uploaded Crash Report ID` line.
8. Share the ID with the Early Preview Program coordinators.

In the meantime, you’ll need to wait for a new Chrome version to get another chance of trying the Prompt API.
