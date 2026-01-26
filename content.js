// Content script for Quick Opener
// Handles WhatsApp auto-send and keyboard shortcut menu

let autoSendEnabled = true;
let settings = {};
let menuVisible = false;
let selectedIndex = 0;
let selectedText = '';

// Load settings
chrome.storage.sync.get(['settings'], (result) => {
  if (result.settings) {
    settings = result.settings;
    if (settings.autoSend !== undefined) {
      autoSendEnabled = settings.autoSend;
    }
  }
  console.log('Quick Opener content script loaded with settings:', settings);
});

// Listen for settings changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.settings && changes.settings.newValue) {
    settings = changes.settings.newValue;
    if (settings.autoSend !== undefined) {
      autoSendEnabled = settings.autoSend;
    }
  }
});

// WhatsApp auto-send functionality
if (window.location.hostname === 'web.whatsapp.com') {
  // Function to find and click the send button
  function clickSendButton() {
    if (!autoSendEnabled) return;

    const selectors = [
      'button[aria-label="Send"]',
      'button[data-tab="11"]',
      'span[data-icon="send"]',
      'button span[data-icon="send"]'
    ];

    let sendButton = null;
    
    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      for (const element of elements) {
        if (element.tagName === 'BUTTON') {
          sendButton = element;
          break;
        } else if (element.closest('button')) {
          sendButton = element.closest('button');
          break;
        }
      }
      if (sendButton) break;
    }

    if (sendButton && !sendButton.disabled) {
      const messageBox = document.querySelector('div[contenteditable="true"][data-tab="10"]');
      if (messageBox && messageBox.textContent.trim().length === 0) {
        return;
      }
      
      setTimeout(() => {
        sendButton.click();
        console.log('QuickOpener: Message sent automatically');
      }, 500);
    }
  }

  const observer = new MutationObserver((mutations) => {
    const sendButton = document.querySelector('button[aria-label="Send"]') || 
                       document.querySelector('button span[data-icon="send"]');
    
    if (sendButton) {
      const currentUrl = window.location.href;
      if (currentUrl.includes('web.whatsapp.com') && !observer.lastUrl) {
        observer.lastUrl = currentUrl;
      } else if (currentUrl !== observer.lastUrl) {
        observer.lastUrl = currentUrl;
        setTimeout(clickSendButton, 1000);
      }
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  window.addEventListener('load', () => {
    setTimeout(clickSendButton, 1500);
  });
}

// Keyboard shortcut menu functionality
const apps = [
  { id: 'whatsapp', name: 'WhatsApp', icon: '💬', color: '#25D366' },
  { id: 'telegram', name: 'Telegram', icon: '✈️', color: '#0088cc' },
  { id: 'viber', name: 'Viber', icon: '📞', color: '#7360f2' },
  { id: 'signal', name: 'Signal', icon: '🔒', color: '#3a76f0' },
  { id: 'youtube', name: 'YouTube Search', icon: '▶️', color: '#ff0000' },
  { id: 'google', name: 'Google Search', icon: '🔍', color: '#4285f4' },
  { id: 'gmail', name: 'Gmail', icon: '📧', color: '#ea4335' }
];

function getSelectedText() {
  const selection = window.getSelection();
  return selection.toString().trim();
}

function createMenu(text) {
  const existingMenu = document.getElementById('quick-opener-menu');
  if (existingMenu) {
    existingMenu.remove();
  }

  const menu = document.createElement('div');
  menu.id = 'quick-opener-menu';
  
  const header = document.createElement('div');
  header.className = 'menu-header';
  header.textContent = text ? `Open "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"` : 'Select text first';
  menu.appendChild(header);

  apps.forEach((app, index) => {
    const isEnabled = settings.enabledApps && settings.enabledApps[app.id];
    
    const item = document.createElement('div');
    item.className = `menu-item ${!text || !isEnabled ? 'disabled' : ''} ${index === 0 ? 'selected' : ''}`;
    item.dataset.index = index;
    item.dataset.appId = app.id;
    
    const icon = document.createElement('span');
    icon.textContent = app.icon;
    icon.style.fontSize = '18px';
    
    const name = document.createElement('span');
    name.textContent = app.name;
    name.style.flex = '1';
    
    item.appendChild(icon);
    item.appendChild(name);
    menu.appendChild(item);

    if (text && isEnabled) {
      item.addEventListener('click', () => {
        selectApp(app.id, text);
      });
    }
  });

  // Position menu near cursor or center of screen
  const selection = window.getSelection();
  if (selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    menu.style.left = Math.min(rect.left, window.innerWidth - 270) + 'px';
    menu.style.top = (rect.bottom + 10) + 'px';
  } else {
    menu.style.left = '50%';
    menu.style.top = '50%';
    menu.style.transform = 'translate(-50%, -50%)';
  }

  document.body.appendChild(menu);
  return menu;
}

function selectApp(appId, text) {
  closeMenu();
  // Send message to background script
  chrome.runtime.sendMessage({
    action: 'openWith',
    app: appId,
    text: text
  });
}

function closeMenu() {
  const menu = document.getElementById('quick-opener-menu');
  if (menu) {
    menu.remove();
  }
  menuVisible = false;
  selectedIndex = 0;
}

function moveSelection(direction) {
  const menu = document.getElementById('quick-opener-menu');
  if (!menu) return;

  const items = Array.from(menu.querySelectorAll('.menu-item:not(.disabled)'));
  if (items.length === 0) return;

  const currentSelected = menu.querySelector('.menu-item.selected');
  if (currentSelected) {
    currentSelected.classList.remove('selected');
  }

  if (direction === 'down') {
    selectedIndex = (selectedIndex + 1) % items.length;
  } else if (direction === 'up') {
    selectedIndex = (selectedIndex - 1 + items.length) % items.length;
  }

  items[selectedIndex].classList.add('selected');
  items[selectedIndex].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

function activateSelected() {
  const menu = document.getElementById('quick-opener-menu');
  if (!menu) return;

  const selected = menu.querySelector('.menu-item.selected');
  if (selected && !selected.classList.contains('disabled')) {
    const appId = selected.dataset.appId;
    selectApp(appId, selectedText);
  }
}

// Keyboard event handlers
document.addEventListener('keydown', (e) => {
  if (menuVisible) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closeMenu();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveSelection('down');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveSelection('up');
    } else if (e.key === 'Enter') {
      e.preventDefault();
      activateSelected();
    }
  }
});

// Click outside to close
document.addEventListener('click', (e) => {
  if (menuVisible) {
    const menu = document.getElementById('quick-opener-menu');
    if (menu && !menu.contains(e.target)) {
      closeMenu();
    }
  }
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Content script received message:', request);
  
  if (request.action === 'autoSend') {
    setTimeout(clickSendButton, 1000);
    sendResponse({ status: 'ok' });
  } else if (request.action === 'openQuickMenu') {
    console.log('Opening quick menu...');
    selectedText = getSelectedText();
    selectedIndex = 0;
    
    console.log('Selected text:', selectedText);
    
    if (menuVisible) {
      closeMenu();
    } else {
      createMenu(selectedText);
      menuVisible = true;
    }
    sendResponse({ status: 'ok', text: selectedText });
  }
  return true;
});
