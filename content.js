//initializing global variables for connect buttons, UI updates and the flag
let connectButtons = [];
let totalConnections = 0;
let remainingConnections = 0;
let isRunning = false;

//function that searches the DOM for all 'Connect' buttons. 
function findConnectButtons() {
    const buttons = Array.from(document.querySelectorAll('button'));
    connectButtons = buttons.filter(btn => {
        let isConnect = false;
        //if the aria-label attribute ends with 'to connect', its a Connect button
        //typically has the form "Invite X to connect"
        if (btn.ariaLabel) {
            isConnect = btn.ariaLabel.endsWith('to connect');
        }
        return isConnect;
    });

    //get the total number of buttons obtained and also update remainingConnections with the same value
    totalConnections = connectButtons.length;
    remainingConnections = totalConnections;
    return remainingConnections;
}

//send a message to the UI with the updated total and remaining connections
function sendUpdateToPopup() {
    chrome.runtime.sendMessage({
        action: 'connectionUpdate',
        total: totalConnections,
        remaining: remainingConnections,
    });
}

//main function that clicks the connect buttons
async function clickConnectButtons() {
    //check flag to ensure it doesnt run multiple times
    if (isRunning) return;
    isRunning = true;
    
    //iterate through every button
    let index = 0;
    for (const btn of connectButtons) {
        if (!isRunning) break;
        
        try {
            //calculate a random delay of 5-10 seconds and wait that long
            const delay = 5000 + Math.random() * 5000;
            await new Promise(resolve => setTimeout(resolve, delay));
            
            //scroll so that the button is centered vertically.
            btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
            btn.click();
            
            //wait 2 seconds for the modal to pop up after the click
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            //find the connect button and click it. 
            const dismissBtn = document.querySelector('[aria-label="Dismiss"]');
            if (dismissBtn) {
                dismissBtn.click();
                console.log(`clicked ${index + 1}`);
            } 
        } catch(err) {
            console.error(`error at ${index + 1}:`, err);
        } finally {
            
            //update remaining connections, update UI.
            index++;
            remainingConnections--;
            sendUpdateToPopup();
        }
    }
    
    //completion
    isRunning = false;
    sendUpdateToPopup();
}

//message listener to run the correct functions for the corresponding messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //number of buttons is sent to the UI in findConnections, this is displayed
    if (message.action === 'findConnections') {
        const count = findConnectButtons();
        sendResponse({ count: count });
        return true;
    }
    //just an acknowledgement message is sent as response, main stuff happens within the func. 
    if (message.action === 'startConnections') {
        clickConnectButtons();
        sendResponse({ status: 'started' });
        return true;
    }
});