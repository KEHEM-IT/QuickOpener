// Arrays to hold email lists
let toEmails = [];
let ccEmails = [];

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
      document.getElementById('gmail').checked = settings.enabledApps.gmail !== false;
      
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
      
      // Load TO and CC emails
      toEmails = Array.isArray(settings.gmailTo) ? settings.gmailTo : [];
      ccEmails = Array.isArray(settings.gmailCC) ? settings.gmailCC : 
                 (settings.gmailCC && typeof settings.gmailCC === 'string' && settings.gmailCC.trim() 
                  ? [settings.gmailCC.trim()] : []);
      
      renderEmailLists();
    }
  });
  
  // Add event listeners
  document.getElementById('addToEmail').addEventListener('click', addToEmail);
  document.getElementById('addCcEmail').addEventListener('click', addCcEmail);
  
  // Allow adding emails with Enter key
  document.getElementById('toEmailInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addToEmail();
    }
  });
  
  document.getElementById('ccEmailInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCcEmail();
    }
  });
});

function addToEmail() {
  const input = document.getElementById('toEmailInput');
  const email = input.value.trim();
  
  if (email && validateEmail(email)) {
    if (!toEmails.includes(email)) {
      toEmails.push(email);
      renderEmailLists();
      input.value = '';
    } else {
      showStatus('Email already in TO list', false);
    }
  } else {
    showStatus('Please enter a valid email address', false);
  }
}

function addCcEmail() {
  const input = document.getElementById('ccEmailInput');
  const email = input.value.trim();
  
  if (email && validateEmail(email)) {
    if (!ccEmails.includes(email)) {
      ccEmails.push(email);
      renderEmailLists();
      input.value = '';
    } else {
      showStatus('Email already in CC list', false);
    }
  } else {
    showStatus('Please enter a valid email address', false);
  }
}

function removeToEmail(email) {
  toEmails = toEmails.filter(e => e !== email);
  renderEmailLists();
}

function removeCcEmail(email) {
  ccEmails = ccEmails.filter(e => e !== email);
  renderEmailLists();
}

function validateEmail(email) {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+$/;
  return regex.test(email);
}

function renderEmailLists() {
  // Render TO emails
  const toList = document.getElementById('toEmailsList');
  if (toEmails.length === 0) {
    toList.innerHTML = '<div class="text-xs text-gray-500 italic">No TO recipients added</div>';
  } else {
    toList.innerHTML = toEmails.map(email => `
      <div class="flex items-center gap-2 bg-slate-900 p-2 rounded">
        <i class="fas fa-envelope text-purple-400 text-sm"></i>
        <span class="flex-1 text-white text-sm">${email}</span>
        <button 
          class="remove-to-email text-red-400 hover:text-red-300 transition"
          type="button"
          data-email="${email}"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
    `).join('');
  }
  
  // Render CC emails
  const ccList = document.getElementById('ccEmailsList');
  if (ccEmails.length === 0) {
    ccList.innerHTML = '<div class="text-xs text-gray-500 italic">No CC recipients added</div>';
  } else {
    ccList.innerHTML = ccEmails.map(email => `
      <div class="flex items-center gap-2 bg-slate-900 p-2 rounded">
        <i class="fas fa-envelope text-blue-400 text-sm"></i>
        <span class="flex-1 text-white text-sm">${email}</span>
        <button 
          class="remove-cc-email text-red-400 hover:text-red-300 transition"
          type="button"
          data-email="${email}"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
    `).join('');
  }
  
  // Add event listeners for remove buttons
  document.querySelectorAll('.remove-to-email').forEach(btn => {
    btn.addEventListener('click', function() {
      removeToEmail(this.getAttribute('data-email'));
    });
  });
  
  document.querySelectorAll('.remove-cc-email').forEach(btn => {
    btn.addEventListener('click', function() {
      removeCcEmail(this.getAttribute('data-email'));
    });
  });
}

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
      google: document.getElementById('google').checked,
      gmail: document.getElementById('gmail').checked
    },
    whatsappOpenMethod: whatsappOpenMethod,
    telegramOpenMethod: telegramOpenMethod,
    autoSend: document.getElementById('autoSend').checked,
    gmailTo: toEmails,
    gmailCC: ccEmails
  };
  
  chrome.storage.sync.set({ settings }, () => {
    showStatus('Settings saved successfully!', true);
    
    // Add a success animation
    const btn = document.getElementById('saveBtn');
    btn.innerHTML = '<i class="fas fa-check mr-2"></i>Saved!';
    btn.style.background = '#10b981';
    
    setTimeout(() => {
      btn.innerHTML = '<i class="fas fa-save mr-2"></i>Save Settings';
      btn.style.background = '';
    }, 2000);
  });
});

function showStatus(message, isSuccess) {
  const statusElement = document.getElementById('statusMessage');
  const messageSpan = statusElement.querySelector('span');
  const icon = statusElement.querySelector('i');
  
  messageSpan.textContent = message;
  
  if (isSuccess) {
    icon.className = 'fas fa-check-circle text-green-400 mr-2';
    statusElement.style.background = 'rgba(16, 185, 129, 0.2)';
  } else {
    icon.className = 'fas fa-exclamation-circle text-red-400 mr-2';
    statusElement.style.background = 'rgba(239, 68, 68, 0.2)';
  }
  
  statusElement.classList.remove('hidden');
  
  setTimeout(() => {
    statusElement.classList.add('hidden');
  }, 3000);
}
