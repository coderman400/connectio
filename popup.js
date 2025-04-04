let isRunning = false;

//UI object to easily perform updates and resets to the DOM elements
const UI = {
  startButton: document.getElementById('start'),
  statusText: document.getElementById('status-text'),
  statusIcon: document.getElementById('status-icon'),
  counterContainer: document.getElementById('counter-container'),
  connectionCounter: document.getElementById('connection-counter'),
  progressContainer: document.getElementById('progress-container'),
  progressBar: document.getElementById('progress-bar'),

  //method to reset to the default state
  reset() {
    this.statusText.textContent = 'Ready to send requests';
    this.statusIcon.className = 'fa-solid fa-truck-fast status-icon';
    this.counterContainer.classList.add('hidden');
    this.progressContainer.classList.add('hidden');
    this.startButton.disabled = false;
    this.connectionCounter.textContent = '0';
    this.progressBar.style.width = '0%';
  },

  //updating the no. of remaining connections + progressbar
  update(remaining, total) {
    this.connectionCounter.textContent = remaining;
    this.progressBar.style.width = `${((total - remaining)/total)*100}%`;
  },

  //setting current status text/icon, like "Sending requests.."
  setStatus(text, icon) {
    this.statusText.textContent = text;
    this.statusIcon.className = `fa-solid ${icon} status-icon`;
  }
};

//start content injection + connection requests
async function startProcess() {
  if (isRunning) return;
  //set flag 
  isRunning = true;
  UI.startButton.disabled = true;
  UI.setStatus('Injecting script...', 'fa-cloud-arrow-up');

  //inject the content.js script into the current active chrome tab
  try {
    const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
    if (!tab) throw new Error('No active tab');
    
    await chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: ['content.js']
    });

    //after injection, call the findConnections message in the script which will find all connect buttons
    UI.setStatus('Finding connections...', 'fa-magnifying-glass');
    const response = await chrome.tabs.sendMessage(tab.id, {action: 'findConnections'});
    
    if (!response?.count) {
      UI.setStatus('No connections found', 'fa-circle-info');
      return;
    }

    //once we have a list of connect buttons, we start sending requests. 
    UI.counterContainer.classList.remove('hidden');
    UI.progressContainer.classList.remove('hidden');
    UI.setStatus('Sending requests...', 'fa-paper-plane');
    UI.startButton.disabled = true
    UI.update(response.count, response.count);
    
    await chrome.tabs.sendMessage(tab.id, {action: 'startConnections'});

  } catch (error) {
    console.error('Process failed:', error);
    UI.setStatus(`Error: ${error.message}`, 'fa-triangle-exclamation');
    UI.startButton.disabled = false
  } finally {
    isRunning = false;
  }
}
//on completion, set status accordingly and enable start button
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === 'connectionUpdate') {
    UI.update(msg.remaining, msg.total);
    if (msg.remaining === 0) {
      UI.setStatus('Completed!', 'fa-check');
      UI.startButton.disabled = false
    }
  }
  return true;
});

//when the DOM fully loads, set up listener for the start button to execute the script
document.addEventListener('DOMContentLoaded', () => {
  UI.reset();
  UI.startButton.addEventListener('click', startProcess);
});
