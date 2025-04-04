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
    return totalConnections;
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
    if (message.action === 'findConnections') {
        const count = findConnectButtons();
        sendResponse({ count: count });
        return true;
    }
    
    if (message.action === 'startConnections') {
        clickConnectButtons();
        sendResponse({ status: 'started' });
        return true;
    }
});