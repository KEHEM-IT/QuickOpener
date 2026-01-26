# Gmail Integration Feature

## Overview
Your Quick Opener extension now supports Gmail integration! Users can quickly compose emails with auto-populated recipient and CC fields.

## What's New

### 1. Gmail Context Menu Option
- New "Gmail" option in the "Open with" context menu
- Works with both selected text and mailto: links
- Extracts email addresses from plain text or mailto: links

### 2. Settings Page Enhancement
- New "Gmail Settings" section in options.html
- Enable/disable Gmail functionality
- Optional CC email field that auto-populates when composing

### 3. Smart Email Detection
The extension now includes an `extractEmail()` function that:
- Detects email addresses in selected text
- Handles mailto: links (e.g., `mailto:user@example.com`)
- Uses regex to find valid email patterns

## How It Works

### User Flow:
1. **Select an email** on any webpage (e.g., `support@example.com`)
   - OR right-click on a mailto: link
2. **Right-click** → **"Open with"** → **"Gmail"**
3. Opens Gmail compose window with:
   - **To:** The selected/clicked email
   - **CC:** Your configured CC email (if set in options)

### Technical Implementation:

#### background.js Changes:
```javascript
// New settings property
gmailCC: '' // Stores the CC email

// New context menu item
if (settings.enabledApps.gmail) {
  chrome.contextMenus.create({
    id: 'gmail',
    parentId: 'openWith',
    title: 'Gmail',
    contexts: ['selection', 'link'] // Works on both text and links
  });
}

// Gmail handler
case 'gmail':
  const email = extractEmail(info.linkUrl || selectedText);
  if (email) {
    url = `https://mail.google.com/mail/u/0/#inbox?compose=new`;
    url += `&to=${encodeURIComponent(email)}`;
    if (settings.gmailCC && settings.gmailCC.trim()) {
      url += `&cc=${encodeURIComponent(settings.gmailCC.trim())}`;
    }
  }
  break;

// Email extraction function
function extractEmail(text) {
  if (!text) return null;
  
  // Handle mailto: links
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
```

#### options.html Changes:
- New Gmail Settings card with:
  - Enable/disable checkbox
  - CC email input field
  - Helpful description and info tooltips

#### options.js Changes:
- Load Gmail settings on page load
- Save Gmail checkbox state and CC email
- Validate and store CC email address

## Use Cases

### 1. Contact Support
User sees: "Contact us at support@company.com"
- Select the email → Right-click → Gmail
- Opens compose with `to=support@company.com`
- Auto-adds CC if configured (e.g., your manager's email)

### 2. Mailto Links
User clicks a mailto link: `<a href="mailto:sales@company.com">Email Sales</a>`
- Right-click on the link → Gmail
- Opens compose with `to=sales@company.com`

### 3. Multiple Recipients
Configure CC in settings as: `manager@mycompany.com`
- Every Gmail compose will automatically include your manager in CC
- Great for keeping someone in the loop on all communications

## Configuration Options

### In Extension Options:
1. **Enable Gmail** - Toggle Gmail functionality on/off
2. **CC Email** - Optional field to always CC someone
   - Example: `yourname@company.com`
   - Leave blank if not needed

### URL Format:
```
https://mail.google.com/mail/u/0/#inbox?compose=new&to=recipient@example.com&cc=cc@example.com
```

## Security & Privacy
- No emails are stored or transmitted by the extension
- All processing happens locally in the browser
- Uses Gmail's official compose URL parameters
- CC email is stored in Chrome's sync storage (encrypted)

## Browser Compatibility
- Works in all Chromium-based browsers (Chrome, Edge, Brave, etc.)
- Requires user to be logged into Gmail
- Opens in a new tab

## Future Enhancements (Ideas)
- Add BCC support
- Pre-fill subject line
- Add default message body template
- Support multiple CC recipients
- Integration with other email providers (Outlook, Yahoo)

## Testing Checklist

✅ Test selecting plain email address
✅ Test right-clicking mailto: link
✅ Test with CC configured
✅ Test with CC empty
✅ Test enabling/disabling Gmail in options
✅ Test email extraction with various formats
✅ Test saving settings
✅ Verify Gmail opens with correct parameters

## Troubleshooting

**Problem:** Gmail doesn't open with pre-filled fields
- **Solution:** Gmail URL parameters might need user to be logged in
- **Workaround:** Ensure you're logged into Gmail first

**Problem:** CC email not appearing
- **Solution:** Check that CC email is saved in options
- **Verify:** Open options page and check if CC field has value

**Problem:** Email not detected
- **Solution:** Ensure email follows standard format (user@domain.com)
- **Note:** Some special characters might not be detected

## Notes
- Gmail's URL parameter handling may vary slightly by browser
- Some Gmail labs features might affect compose window behavior
- The extension respects user's Gmail account selection (u/0 = first account)
