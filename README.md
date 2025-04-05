# Connectio - LinkedIn Auto-Connect Extension

A Chrome extension that automates sending connection requests on LinkedIn. The extension simulates human-like behavior by scrolling to each "Connect" button, clicking it, and handling modals with random delays to avoid detection.

---

## Features

- Automatically finds and clicks "Connect" buttons on LinkedIn search results.
- Simulates human-like interaction with:
  - Random delays between actions (5–10 seconds).
  - Smooth scrolling to buttons before clicking.
- Handles LinkedIn modals
- Real-time progress updates in the popup UI.


---

## How It Works

1. Injects a content script into the active LinkedIn tab.
2. Finds all "Connect" buttons on the page.
3. Iteratively clicks each button with random delays and updates the progress in the popup UI.
4. Handles modals after clicking "Connect."
5. Stops automatically when all connections are processed or if manually stopped.

---

## Installation

### 1. Clone or Download the Repository

```git clone https://github.com/coderman400/connectio.git```

### 2. Load the Extension in Chrome
1. Open Chrome and navigate to `chrome://extensions/`.
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click **Load unpacked** and select the folder containing this project.

### 3. Use the Extension
1. Open LinkedIn and perform a search (e.g., for people or job titles).
2. Ensure you're on the People page, or that there are results with the 'Connect' button available.
3. Click the extension icon in the Chrome toolbar.
4. Click "Connect Now" in the popup UI.


