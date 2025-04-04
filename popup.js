document.getElementById('start').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'clickConnectButtons' }, (response) => {
      console.log(response.status);
    });
  });

  
  