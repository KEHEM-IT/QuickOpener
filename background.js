// Default country code (Bangladesh)
const DEFAULT_COUNTRY_CODE = '880';

// Load settings
let settings = {
  defaultCountryCode: DEFAULT_COUNTRY_CODE,
  enabledApps: {
    whatsapp: true,
    telegram: true,
    viber: true,
    signal: true,
    youtube: true,
    google: true,
    gmail: true
  },
  whatsappOpenMethod: 'web', // 'web', 'desktop', or 'wame'
  telegramOpenMethod: 'web', // 'web' or 'desktop'
  autoSend: true,
  gmailCC: '' // CC email for Gmail compose
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

    if (settings.enabledApps.youtube) {
      chrome.contextMenus.create({
        id: 'youtube',
        parentId: 'openWith',
        title: 'YouTube Search',
        contexts: ['selection']
      });
    }

    if (settings.enabledApps.google) {
      chrome.contextMenus.create({
        id: 'google',
        parentId: 'openWith',
        title: 'Google Search',
        contexts: ['selection']
      });
    }

    if (settings.enabledApps.gmail) {
      chrome.contextMenus.create({
        id: 'gmail',
        parentId: 'openWith',
        title: 'Gmail',
        contexts: ['selection', 'link']
      });
    }
  });
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.selectionText) {
    const selectedText = info.selectionText.trim();
    let url = '';
    
    switch (info.menuItemId) {
      case 'whatsapp':
        const phoneNumber = cleanPhoneNumber(selectedText);
        if (phoneNumber) {
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
        }
        break;
        
      case 'telegram':
        // Check if it's a phone number or username/link
        if (selectedText.startsWith('@') || selectedText.includes('t.me/')) {
          // Username or link
          let username = selectedText;
          if (selectedText.startsWith('@')) {
            username = selectedText.substring(1);
          } else if (selectedText.includes('t.me/')) {
            username = selectedText.split('t.me/')[1].split('/')[0].split('?')[0];
          }
          
          if (settings.telegramOpenMethod === 'desktop') {
            url = `tg://resolve?domain=${username}`;
          } else {
            url = `https://t.me/${username}`;
          }
        } else {
          // Try as phone number
          const telegramPhone = cleanPhoneNumber(selectedText);
          if (telegramPhone) {
            if (settings.telegramOpenMethod === 'desktop') {
              url = `tg://resolve?phone=${telegramPhone}`;
            } else {
              url = `https://t.me/+${telegramPhone}`;
            }
          }
        }
        break;
        
      case 'viber':
        const viberPhone = cleanPhoneNumber(selectedText);
        if (viberPhone) {
          url = `viber://chat?number=${viberPhone}`;
        }
        break;
        
      case 'signal':
        const signalPhone = cleanPhoneNumber(selectedText);
        if (signalPhone) {
          url = `https://signal.me/#p/${signalPhone}`;
        }
        break;
        
      case 'youtube':
        // Search on YouTube
        url = `https://www.youtube.com/results?search_query=${encodeURIComponent(selectedText)}`;
        break;
        
      case 'google':
        // Search on Google
        url = `https://www.google.com/search?q=${encodeURIComponent(selectedText)}`;
        break;
        
      case 'gmail':
        // Open Gmail compose
        const email = extractEmail(info.linkUrl || selectedText);
        if (email) {
          url = `https://mail.google.com/mail/u/0/#inbox?compose=new`;
          // Add email to URL parameters
          url += `&to=${encodeURIComponent(email)}`;
          // Add CC if configured
          if (settings.gmailCC && settings.gmailCC.trim()) {
            url += `&cc=${encodeURIComponent(settings.gmailCC.trim())}`;
          }
        }
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

function extractEmail(text) {
  if (!text) return null;
  
  // If it's a mailto link, extract the email
  if (text.startsWith('mailto:')) {
    const email = text.replace('mailto:', '').split('?')[0];
    return email;
  }
  
  // Use regex to find email in text
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
  const match = text.match(emailRegex);
  
  if (match && match[1]) {
    return match[1];
  }
  
  return null;
}
