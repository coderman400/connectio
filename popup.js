let isRunning = false;
const UI = {
  startButton: document.getElementById('start'),
  statusText: document.getElementById('status-text'),
  statusIcon: document.getElementById('status-icon'),
  counterContainer: document.getElementById('counter-container'),
  connectionCounter: document.getElementById('connection-counter'),
  progressContainer: document.getElementById('progress-container'),
  progressBar: document.getElementById('progress-bar'),

  reset() {
    this.statusText.textContent = 'Ready to send requests';
    this.statusIcon.className = 'fa-solid fa-truck-fast status-icon';
    this.counterContainer.classList.add('hidden');
    this.progressContainer.classList.add('hidden');
    this.startButton.disabled = false;
    this.connectionCounter.textContent = '0';
    this.progressBar.style.width = '0%';
  },

  update(remaining, total) {
    this.connectionCounter.textContent = remaining;
    this.progressBar.style.width = `${((total - remaining)/total)*100}%`;
  },

  setStatus(text, icon) {
    this.statusText.textContent = text;
    this.statusIcon.className = `fa-solid ${icon} status-icon`;
  }
};

async function startProcess() {
  if (isRunning) return;
  isRunning = true;
  UI.startButton.disabled = true;
  UI.setStatus('Injecting script...', 'fa-cloud-arrow-up');

  try {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    if (!tab) throw new Error('No active tab');
    
    // Always inject first
    await chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: ['content.js']
    });

    // Now handle connections
    UI.setStatus('Finding connections...', 'fa-magnifying-glass');
    const response = await chrome.tabs.sendMessage(tab.id, {action: 'findConnections'});
    
    if (!response?.count) {
      UI.setStatus('No connections found', 'fa-circle-info');
      return;
    }

    UI.counterContainer.classList.remove('hidden');
    UI.progressContainer.classList.remove('hidden');
    UI.setStatus('Sending requests...', 'fa-paper-plane');
    UI.update(response.count, response.count);
    
    await chrome.tabs.sendMessage(tab.id, {action: 'startConnections'});

  } catch (error) {
    console.error('Process failed:', error);
    UI.setStatus(`Error: ${error.message}`, 'fa-triangle-exclamation');
  } finally {
    isRunning = false;
    UI.startButton.disabled = false;
  }
}

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === 'connectionUpdate') {
    UI.update(msg.remaining, msg.total);
    if (msg.remaining === 0) {
      UI.setStatus('Completed!', 'fa-check');
    }
  }
  return true;
});

document.addEventListener('DOMContentLoaded', () => {
  UI.reset();
  UI.startButton.addEventListener('click', startProcess);
});
