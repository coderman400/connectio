let totalConnections = 0;
let remainingConnections = 0;
let isRunning = false;

const startButton = document.getElementById('start');
const statusText = document.getElementById('status-text');
const statusIcon = document.getElementById('status-icon');
const counterContainer = document.getElementById('counter-container');
const connectionCounter = document.getElementById('connection-counter');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');


function resetUI() {
  statusText.textContent = 'Ready to send requests';
  statusIcon.className = 'fa-solid fa-truck-fast status-icon';
  counterContainer.classList.add('hidden');
  progressContainer.classList.add('hidden');
  startButton.disabled = false;

  totalConnections = 0;
  remainingConnections = 0;

  connectionCounter.textContent = '0';
  progressBar.style.width = '0%';
}


function updateConnectionUI(remaining, total) {
  remainingConnections = remaining;
  totalConnections = total;
  connectionCounter.textContent = remaining;
  const progress = ((total - remaining) / total) * 100;
  progressBar.style.width = `${progress}%`;
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'connectionUpdate') {
    updateConnectionUI(
      message.remaining,
      message.total,
    );
    
    if (message.remaining === 0) {
      statusText.textContent = 'Completed!';
      statusIcon.className = 'fa-solid fa-check status-icon';
      startButton.disabled = false;
      isRunning = false;
    }
    sendResponse({ received: true });
  }
  return true;
});

startButton.addEventListener('click', () => {
  if (isRunning) return;

  startButton.disabled = true;
  isRunning = true;
  statusText.textContent = 'Finding connections...';
  statusIcon.className = 'fa-solid fa-magnifying-glass status-icon';
  
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    
    chrome.tabs.sendMessage(activeTab.id, { action: 'findConnections' }, (response) => {
      if (chrome.runtime.lastError) {
        chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          files: ['content.js']
        }, () => {
          setTimeout(() => {
            chrome.tabs.sendMessage(activeTab.id, { action: 'findConnections' });
          }, 500);
        });
      } else if (response && response.count) {

        counterContainer.classList.remove('hidden');
        progressContainer.classList.remove('hidden');
      
        statusText.textContent = 'Sending connection requests...';
        statusIcon.className = 'fa-solid fa-paper-plane status-icon';
        
        updateConnectionUI(response.count, response.count);
        
        chrome.tabs.sendMessage(activeTab.id, { action: 'startConnections' });
      }
    });
  });
});


document.addEventListener('DOMContentLoaded', resetUI);