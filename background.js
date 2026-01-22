// Default country code (Bangladesh)
const DEFAULT_COUNTRY_CODE = '880';

// Load settings
let settings = {
  defaultCountryCode: DEFAULT_COUNTRY_CODE,
  enabledApps: {
    whatsapp: true,
    telegram: true,
    viber: true,
    signal: true
  },
  whatsappOpenMethod: 'web', // 'web', 'desktop', or 'wame'
  autoSend: true
};

chrome.runtime.onInstalled.addListener(() => {
  // Load saved settings
  chrome.storage.sync.get(['settings'], (result) => {
    if (result.settings) {
      settings = { ...settings, ...result.settings };
    }
  });

  createContextMenus();
});

// Listen for settings changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.settings) {
    settings = changes.settings.newValue;
    createContextMenus();
  }
});

function createContextMenus() {
  // Remove existing menus
  chrome.contextMenus.removeAll(() => {
    // Create parent menu
    chrome.contextMenus.create({
      id: 'openWith',
      title: 'Open with',
      contexts: ['selection']
    });

    // Create submenu items based on enabled apps
    if (settings.enabledApps.whatsapp) {
      chrome.contextMenus.create({
        id: 'whatsapp',
        parentId: 'openWith',
        title: 'WhatsApp',
        contexts: ['selection']
      });
    }

    if (settings.enabledApps.telegram) {
      chrome.contextMenus.create({
        id: 'telegram',
        parentId: 'openWith',
        title: 'Telegram',
        contexts: ['selection']
      });
    }

    if (settings.enabledApps.viber) {
      chrome.contextMenus.create({
        id: 'viber',
        parentId: 'openWith',
        title: 'Viber',
        contexts: ['selection']
      });
    }

    if (settings.enabledApps.signal) {
      chrome.contextMenus.create({
        id: 'signal',
        parentId: 'openWith',
        title: 'Signal',
        contexts: ['selection']
      });
    }
  });
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.selectionText) {
    const phoneNumber = cleanPhoneNumber(info.selectionText);
    
    if (phoneNumber) {
      let url = '';
      
      switch (info.menuItemId) {
        case 'whatsapp':
          // Choose URL based on settings
          if (settings.whatsappOpenMethod === 'desktop') {
            // WhatsApp Desktop protocol
            url = `whatsapp://send?phone=${phoneNumber}`;
          } else if (settings.whatsappOpenMethod === 'web') {
            // WhatsApp Web
            url = `https://web.whatsapp.com/send?phone=${phoneNumber}`;
          } else {
            // wa.me (lets system choose)
            url = `https://wa.me/${phoneNumber}`;
          }
          break;
        case 'telegram':
          url = `https://t.me/${phoneNumber}`;
          break;
        case 'viber':
          url = `viber://chat?number=${phoneNumber}`;
          break;
        case 'signal':
          url = `https://signal.me/#p/${phoneNumber}`;
          break;
      }
      
      if (url) {
        chrome.tabs.create({ url: url }, (newTab) => {
          // If WhatsApp Web and auto-send is enabled, send message to content script
          if (info.menuItemId === 'whatsapp' && 
              settings.whatsappOpenMethod === 'web' && 
              settings.autoSend) {
            // Wait for tab to load
            chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
              if (tabId === newTab.id && changeInfo.status === 'complete') {
                chrome.tabs.onUpdated.removeListener(listener);
                // Send message to content script to auto-click send
                chrome.tabs.sendMessage(newTab.id, { action: 'autoSend' });
              }
            });
          }
        });
      }
    }
  }
});

function cleanPhoneNumber(text) {
  // Remove all non-digit characters except '+'
  let cleaned = text.replace(/[^\d+]/g, '');
  
  // Check if it starts with '+'
  if (cleaned.startsWith('+')) {
    // Remove the '+' sign
    cleaned = cleaned.substring(1);
  } else if (cleaned.startsWith('00')) {
    // Handle international format starting with 00
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith('0')) {
    // Local format, add default country code
    cleaned = settings.defaultCountryCode + cleaned.substring(1);
  } else if (!cleaned.startsWith(settings.defaultCountryCode) && cleaned.length < 12) {
    // Doesn't have country code and is not international format
    // If it starts with 1 and is 10 digits for Bangladesh mobile
    if (cleaned.startsWith('1') && cleaned.length === 10) {
      cleaned = settings.defaultCountryCode + cleaned;
    } else if (cleaned.length > 6) {
      // For other cases, add default country code
      cleaned = settings.defaultCountryCode + cleaned;
    }
  }
  
  // Validate phone number (should have at least 10 digits)
  if (cleaned.length >= 10 && cleaned.length <= 15) {
    return cleaned;
  }
  
  return null;
}
