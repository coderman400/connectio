const clickConnectButtons = async ()=>{
    const buttons = Array.from(document.querySelectorAll('button'));
    
    const connectButtons = buttons.filter(btn => {
        let isConnect = false
        if(btn.ariaLabel){
            isConnect = btn.ariaLabel.endsWith('to connect')
        }
        return isConnect
    });
  
    console.log(`found ${connectButtons.length} buttons`);
    index = 0
    for(const btn of connectButtons) {
      try {
        const delay = 5000 + Math.random() * 5000; 
        await new Promise(resolve => setTimeout(resolve, delay));

        btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        btn.click();
  
        await new Promise(resolve => setTimeout(resolve, 2000));
        const dismissBtn = document.querySelector('[aria-label="Dismiss"]');
        
        if(dismissBtn) {
          dismissBtn.click();
          console.log(`clicked ${index + 1}`);
        } else {
          console.log(`failed at ${index + 1}`);
        }
  
      } catch(err) {
        console.error(`error at ${index + 1}:`, err);
      }finally{
        index+=1
      }
    }
  };
  
clickConnectButtons()