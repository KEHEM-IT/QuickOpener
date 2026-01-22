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
      
      // Set WhatsApp open method
      const openMethod = settings.whatsappOpenMethod || 'web';
      document.getElementById('openWeb').checked = openMethod === 'web';
      document.getElementById('openDesktop').checked = openMethod === 'desktop';
      document.getElementById('openWaMe').checked = openMethod === 'wame';
      
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
  
  // Get selected open method
  let whatsappOpenMethod = 'web';
  if (document.getElementById('openDesktop').checked) {
    whatsappOpenMethod = 'desktop';
  } else if (document.getElementById('openWaMe').checked) {
    whatsappOpenMethod = 'wame';
  }
  
  const settings = {
    defaultCountryCode: countryCode,
    enabledApps: {
      whatsapp: document.getElementById('whatsapp').checked,
      telegram: document.getElementById('telegram').checked,
      viber: document.getElementById('viber').checked,
      signal: document.getElementById('signal').checked
    },
    whatsappOpenMethod: whatsappOpenMethod,
    autoSend: document.getElementById('autoSend').checked
  };
  
  chrome.storage.sync.set({ settings }, () => {
    showStatus('Settings saved successfully!', true);
  });
});

function showStatus(message, isSuccess) {
  const statusElement = document.getElementById('statusMessage');
  statusElement.textContent = message;
  statusElement.className = 'status-message ' + (isSuccess ? 'success' : 'error');
  
  setTimeout(() => {
    statusElement.style.display = 'none';
  }, 3000);
}
