chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "clickConnectButtons") {

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];

        chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          files: ['content.js']
        }, () => {
          sendResponse({ status: 'Content script injected' });
        });
      });
      return true;
    }
  });