document.getElementById('start').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'getConnectButtons' }, (response) => {
      console.log(response.status);
    });
  });

  
  