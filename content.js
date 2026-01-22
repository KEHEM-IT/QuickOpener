// Content script for WhatsApp Web
// This script runs on web.whatsapp.com and automatically clicks the send button

let autoSendEnabled = true;

// Load settings
chrome.storage.sync.get(['settings'], (result) => {
  if (result.settings && result.settings.autoSend !== undefined) {
    autoSendEnabled = result.settings.autoSend;
  }
});

// Listen for settings changes
chrome.storage.onChanged.addListener((changes) => {
  if (changes.settings && changes.settings.newValue.autoSend !== undefined) {
    autoSendEnabled = changes.settings.newValue.autoSend;
  }
});

// Function to find and click the send button
function clickSendButton() {
  if (!autoSendEnabled) return;

  // WhatsApp Web send button selectors (they may change, so we try multiple)
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
      // Find the button element (might be parent of span)
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
    // Check if there's text in the message box
    const messageBox = document.querySelector('div[contenteditable="true"][data-tab="10"]');
    if (messageBox && messageBox.textContent.trim().length === 0) {
      // No text, so this is just opening a chat - don't auto-send
      return;
    }
    
    // Small delay to ensure WhatsApp is ready
    setTimeout(() => {
      sendButton.click();
      console.log('QuickWhatsApp: Message sent automatically');
    }, 500);
  }
}

// Watch for changes in the DOM (when send button appears)
const observer = new MutationObserver((mutations) => {
  // Check if we're on a chat page and send button is visible
  const sendButton = document.querySelector('button[aria-label="Send"]') || 
                     document.querySelector('button span[data-icon="send"]');
  
  if (sendButton) {
    // Check if URL has changed (new chat opened)
    const currentUrl = window.location.href;
    if (currentUrl.includes('web.whatsapp.com') && !observer.lastUrl) {
      observer.lastUrl = currentUrl;
    } else if (currentUrl !== observer.lastUrl) {
      observer.lastUrl = currentUrl;
      // URL changed, wait a bit for page to load
      setTimeout(clickSendButton, 1000);
    }
  }
});

// Start observing
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Also check when page loads
window.addEventListener('load', () => {
  setTimeout(clickSendButton, 1500);
});

// Listen for messages from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'autoSend') {
    setTimeout(clickSendButton, 1000);
    sendResponse({ status: 'ok' });
  }
});
