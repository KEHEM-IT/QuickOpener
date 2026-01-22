// Load saved settings
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(['settings'], (result) => {
    if (result.settings) {
      const settings = result.settings;
      
      // Set country code
      document.getElementById('countryCode').value = settings.defaultCountryCode || '880';
      
      // Set enabled apps
      document.getElementById('whatsapp').checked = settings.enabledApps.whatsapp !== false;
      document.getElementById('telegram').checked = settings.enabledApps.telegram !== false;
      document.getElementById('viber').checked = settings.enabledApps.viber !== false;
      document.getElementById('signal').checked = settings.enabledApps.signal !== false;
      document.getElementById('youtube').checked = settings.enabledApps.youtube !== false;
      document.getElementById('google').checked = settings.enabledApps.google !== false;
      
      // Set WhatsApp open method
      const openMethod = settings.whatsappOpenMethod || 'web';
      document.getElementById('openWeb').checked = openMethod === 'web';
      document.getElementById('openDesktop').checked = openMethod === 'desktop';
      document.getElementById('openWaMe').checked = openMethod === 'wame';
      
      // Set Telegram open method
      const telegramMethod = settings.telegramOpenMethod || 'web';
      document.getElementById('telegramWeb').checked = telegramMethod === 'web';
      document.getElementById('telegramDesktop').checked = telegramMethod === 'desktop';
      
      // Set auto-send
      document.getElementById('autoSend').checked = settings.autoSend !== false;
    }
  });
});

// Save settings
document.getElementById('saveBtn').addEventListener('click', () => {
  const countryCode = document.getElementById('countryCode').value.replace(/[^\d]/g, '');
  
  if (!countryCode) {
    showStatus('Please enter a valid country code', false);
    return;
  }
  
  // Get selected WhatsApp open method
  let whatsappOpenMethod = 'web';
  if (document.getElementById('openDesktop').checked) {
    whatsappOpenMethod = 'desktop';
  } else if (document.getElementById('openWaMe').checked) {
    whatsappOpenMethod = 'wame';
  }
  
  // Get selected Telegram open method
  let telegramOpenMethod = 'web';
  if (document.getElementById('telegramDesktop').checked) {
    telegramOpenMethod = 'desktop';
  }
  
  const settings = {
    defaultCountryCode: countryCode,
    enabledApps: {
      whatsapp: document.getElementById('whatsapp').checked,
      telegram: document.getElementById('telegram').checked,
      viber: document.getElementById('viber').checked,
      signal: document.getElementById('signal').checked,
      youtube: document.getElementById('youtube').checked,
      google: document.getElementById('google').checked
    },
    whatsappOpenMethod: whatsappOpenMethod,
    telegramOpenMethod: telegramOpenMethod,
    autoSend: document.getElementById('autoSend').checked
  };
  
  chrome.storage.sync.set({ settings }, () => {
    showStatus('Settings saved successfully!', true);
    
    // Add a success animation
    const btn = document.getElementById('saveBtn');
    btn.innerHTML = '<i class="fas fa-check mr-2"></i>Saved!';
    btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
    
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-save mr-2"></i>Save Settings';
      btn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }, 2000);
  });
});

function showStatus(message, isSuccess) {
  const statusElement = document.getElementById('statusMessage');
  const messageSpan = statusElement.querySelector('span');
  const icon = statusElement.querySelector('i');
  
  messageSpan.textContent = message;
  
  if (isSuccess) {
    icon.className = 'fas fa-check-circle text-2xl text-green-400 mr-2';
    statusElement.style.background = 'rgba(16, 185, 129, 0.2)';
  } else {
    icon.className = 'fas fa-exclamation-circle text-2xl text-red-400 mr-2';
    statusElement.style.background = 'rgba(239, 68, 68, 0.2)';
  }
  
  statusElement.classList.remove('hidden');
  
  setTimeout(() => {
    statusElement.classList.add('hidden');
  }, 3000);
}
