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
  gmailTo: [], // Array of TO emails for Gmail compose
  gmailCC: [] // Array of CC emails for Gmail compose
};

// Function to load settings from storage
function loadSettings(callback) {
  chrome.storage.sync.get(['settings'], (result) => {
    if (result.settings) {
      settings = { ...settings, ...result.settings };
      // Ensure arrays exist
      if (!Array.isArray(settings.gmailTo)) {
        settings.gmailTo = [];
      }
      if (!Array.isArray(settings.gmailCC)) {
        settings.gmailCC = [];
      }
      console.log('Settings loaded:', settings);
    }
    if (callback) callback();
  });
}

// Load settings on startup
loadSettings(() => {
  createContextMenus();
});

chrome.runtime.onInstalled.addListener(() => {
  loadSettings(() => {
    createContextMenus();
  });
});

// Listen for settings changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.settings) {
    console.log('Settings changed:', changes.settings.newValue);
    loadSettings(() => {
      createContextMenus();
    });
  }
});

// Listen for keyboard commands
chrome.commands.onCommand.addListener((command) => {
  console.log('Command received:', command);
  if (command === 'open-quick-menu') {
    openQuickMenu();
  }
});

// Listen for toolbar icon click
chrome.action.onClicked.addListener((tab) => {
  console.log('Toolbar icon clicked');
  openQuickMenu();
});

function openQuickMenu() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      console.log('Sending openQuickMenu to tab:', tabs[0].id);
      chrome.tabs.sendMessage(tabs[0].id, { action: 'openQuickMenu' }, (response) => {
        if (chrome.runtime.lastError) {
          console.error('Error sending message:', chrome.runtime.lastError);
          // Try to inject content script if it's not loaded
          chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            files: ['content.js']
          }, () => {
            if (chrome.runtime.lastError) {
              console.error('Error injecting script:', chrome.runtime.lastError);
            } else {
              // Try again after injection
              setTimeout(() => {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'openQuickMenu' });
              }, 100);
            }
          });
        } else {
          console.log('Message sent successfully:', response);
        }
      });
    }
  });
}

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

// Listen for messages from content script (keyboard shortcut)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openWith') {
    handleOpenWith(request.app, request.text, sender.tab);
    sendResponse({ status: 'ok' });
  }
  return true;
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.selectionText || info.linkUrl) {
    const selectedText = info.selectionText ? info.selectionText.trim() : '';
    handleOpenWith(info.menuItemId, selectedText, tab, info);
  }
});

function handleOpenWith(appId, selectedText, tab, info = null) {
  let url = '';
  
  switch (appId) {
    case 'whatsapp':
      const phoneNumber = cleanPhoneNumber(selectedText);
      if (phoneNumber) {
        if (settings.whatsappOpenMethod === 'desktop') {
          url = `whatsapp://send?phone=${phoneNumber}`;
        } else if (settings.whatsappOpenMethod === 'web') {
          url = `https://web.whatsapp.com/send?phone=${phoneNumber}`;
        } else {
          url = `https://wa.me/${phoneNumber}`;
        }
      }
      break;
      
    case 'telegram':
      if (selectedText.startsWith('@') || selectedText.includes('t.me/')) {
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
      url = `https://www.youtube.com/results?search_query=${encodeURIComponent(selectedText)}`;
      break;
      
    case 'google':
      url = `https://www.google.com/search?q=${encodeURIComponent(selectedText)}`;
      break;
      
    case 'gmail':
      let email = null;
      
      // Check if it's from context menu with link
      if (info && info.linkUrl) {
        email = extractEmail(info.linkUrl);
      }
      // If no link or email not found, try selection text
      if (!email && selectedText) {
        email = extractEmail(selectedText);
      }
      
      if (email) {
        console.log('Building Gmail URL with settings:', settings);
        url = buildGmailUrl(email);
        console.log('Gmail URL:', url);
      }
      break;
  }
  
  if (url) {
    chrome.tabs.create({ url: url }, (newTab) => {
      // If WhatsApp Web and auto-send is enabled, send message to content script
      if (appId === 'whatsapp' && 
          settings.whatsappOpenMethod === 'web' && 
          settings.autoSend) {
        // Wait for tab to load
        chrome.tabs.onUpdated.addListener(function listener(tabId, changeInfo) {
          if (tabId === newTab.id && changeInfo.status === 'complete') {
            chrome.tabs.onUpdated.removeListener(listener);
            chrome.tabs.sendMessage(newTab.id, { action: 'autoSend' });
          }
        });
      }
    });
  }
}

function cleanPhoneNumber(text) {
  let cleaned = text.replace(/[^\d+]/g, '');
  
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  } else if (cleaned.startsWith('00')) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith('0')) {
    cleaned = settings.defaultCountryCode + cleaned.substring(1);
  } else if (!cleaned.startsWith(settings.defaultCountryCode) && cleaned.length < 12) {
    if (cleaned.startsWith('1') && cleaned.length === 10) {
      cleaned = settings.defaultCountryCode + cleaned;
    } else if (cleaned.length > 6) {
      cleaned = settings.defaultCountryCode + cleaned;
    }
  }
  
  if (cleaned.length >= 10 && cleaned.length <= 15) {
    return cleaned;
  }
  
  return null;
}

function extractEmail(text) {
  if (!text) return null;
  
  if (text.startsWith('mailto:')) {
    const email = text.replace('mailto:', '').split('?')[0];
    return email;
  }
  
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
  const match = text.match(emailRegex);
  
  if (match && match[1]) {
    return match[1];
  }
  
  return null;
}

function buildGmailUrl(selectedEmail) {
  let url = 'https://mail.google.com/mail/?view=cm&fs=1';
  
  const toEmails = Array.isArray(settings.gmailTo) ? [...settings.gmailTo] : [];
  if (selectedEmail && !toEmails.includes(selectedEmail)) {
    toEmails.push(selectedEmail);
  }
  
  console.log('TO emails:', toEmails);
  console.log('CC emails:', settings.gmailCC);
  
  if (toEmails.length > 0) {
    url += '&to=' + toEmails.map(e => encodeURIComponent(e)).join(',');
  }
  
  if (Array.isArray(settings.gmailCC) && settings.gmailCC.length > 0) {
    url += '&cc=' + settings.gmailCC.map(e => encodeURIComponent(e)).join(',');
  }
  
  return url;
}
