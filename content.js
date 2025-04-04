const getConnectButtons = ()=>{
    const buttons = Array.from(document.querySelectorAll('button'));
    
    const connectButtons = buttons.filter(btn => {
        let isConnect = false
        if(btn.ariaLabel){
            isConnect = btn.ariaLabel.endsWith('to connect')
        }
        return isConnect
    });
  
    console.log(`found ${connectButtons.length} buttons`);
    connectButtons.forEach((btn, index) => {
      console.log(`button ${index + 1}:`, btn);
    });
  };
  
getConnectButtons()