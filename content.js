let connectButtons = [];
let totalConnections = 0;
let remainingConnections = 0;

let isRunning = false;

function findConnectButtons() {
    const buttons = Array.from(document.querySelectorAll('button'));
    connectButtons = buttons.filter(btn => {
        let isConnect = false;
        if (btn.ariaLabel) {
            isConnect = btn.ariaLabel.endsWith('to connect');
        }
        return isConnect;
    });
    totalConnections = connectButtons.length;
    remainingConnections = totalConnections;
    return remainingConnections;
}

function sendUpdateToPopup() {
    chrome.runtime.sendMessage({
        action: 'connectionUpdate',
        total: totalConnections,
        remaining: remainingConnections,
    });
}


async function clickConnectButtons() {
  if (isRunning) return;
  isRunning = true;
  
  let index = 0;
  for (const btn of connectButtons) {
    if (!isRunning) break;
    
    try {
      const delay = 5000 + Math.random() * 5000;
      await new Promise(resolve => setTimeout(resolve, delay));
      
      btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
      btn.click();
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const dismissBtn = document.querySelector('[aria-label="Dismiss"]');
      if (dismissBtn) {
        dismissBtn.click();
        console.log(`clicked ${index + 1}`);
      } 
    } catch(err) {
      console.error(`error at ${index + 1}:`, err);
    } finally {
      index++;
      remainingConnections--;
      sendUpdateToPopup();
    }
  }
  
  isRunning = false;
  sendUpdateToPopup();
}

function stopConnections() {
  isRunning = false;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Content script received message:", message); // Good for debugging

    if (message.action === 'ping') {
        console.log("Ponging back!");
        sendResponse({ status: 'ready' });
        return true; // Keep channel open for async response
    }

    if (message.action === 'findConnections') {
        const count = findConnectButtons();
        console.log(`Found ${count} buttons`);
        sendResponse({ count: count });
        // Note: If findConnectButtons itself could take time or rely on async
        // operations not shown here, you might need to make this listener async
        // and use await, returning true immediately. For simple DOM querying,
        // it's likely fine.
        return true; // Indicate you might send an async response (good practice)
    }

    if (message.action === 'startConnections') {
        console.log("Starting connections process...");
        clickConnectButtons(); // This is async itself
        sendResponse({ status: 'started' });
        return true; // Indicate async work started
    }
});