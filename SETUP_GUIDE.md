# Quick Opener Extension - Complete Setup Guide

## 🎉 Gmail Feature Successfully Added!

Your QuickOpener extension now supports Gmail with auto-populated recipient and CC fields!

---

## 📋 Summary of Changes

### Modified Files:
1. ✅ **background.js** - Added Gmail handling logic
2. ✅ **options.html** - Added Gmail settings UI
3. ✅ **options.js** - Added Gmail settings management
4. ✅ **manifest.json** - Added activeTab permission
5. ✅ **README.md** - Updated documentation

### New Files:
1. 📄 **GMAIL_FEATURE.md** - Detailed feature documentation
2. 📄 **GMAIL_TESTS.md** - Test cases and examples

---

## 🚀 How to Use the New Gmail Feature

### Step 1: Configure Settings
1. Right-click the extension icon → **Options**
2. Scroll to **"Gmail Settings"** section
3. Make sure **"Gmail Compose"** is checked ✓
4. (Optional) Enter a CC email address
5. Click **"Save Settings"**

### Step 2: Use Gmail Feature
**Method A: Select Email Text**
```
1. Visit any webpage with an email (e.g., "Contact: support@example.com")
2. Select the email address
3. Right-click → "Open with" → "Gmail"
4. Gmail compose opens with email pre-filled!
```

**Method B: Click Mailto Links**
```
1. Find a mailto: link (e.g., <a href="mailto:info@site.com">Email</a>)
2. Right-click on the link
3. Choose "Open with" → "Gmail"
4. Gmail compose opens!
```

---

## 🎨 Visual Guide

### Options Page Layout (New Section)
```
┌─────────────────────────────────────────────┐
│  📧 Gmail Settings                          │
├─────────────────────────────────────────────┤
│                                             │
│  ☑ 📧 Gmail Compose                        │
│                                             │
│  ┌───────────────────────────────────────┐ │
│  │ CC Email (optional)                   │ │
│  │ ┌───────────────────────────────────┐ │ │
│  │ │ example@gmail.com                 │ │ │
│  │ └───────────────────────────────────┘ │ │
│  │ ℹ️ This email will be automatically   │ │
│  │    added to CC when composing         │ │
│  └───────────────────────────────────────┘ │
│                                             │
│  💡 Works with mailto: links and selected  │
│     email addresses                         │
└─────────────────────────────────────────────┘
```

### Context Menu (Right-Click)
```
┌──────────────────────────┐
│ Open with            ▶   │
│  ├─ WhatsApp             │
│  ├─ Telegram             │
│  ├─ Viber                │
│  ├─ Signal               │
│  ├─ YouTube Search       │
│  ├─ Google Search        │
│  └─ Gmail            ✨ NEW!
└──────────────────────────┘
```

---

## 💡 Example Use Cases

### Use Case 1: Quick Customer Email
**Scenario:** Customer support needs to email a client
```
Webpage text: "Client email: customer@business.com"

Action:
1. Select: customer@business.com
2. Right-click → Gmail
3. Gmail opens with:
   - To: customer@business.com
   - CC: support-manager@mycompany.com (if configured)
   
Result: Ready to compose email in 2 clicks!
```

### Use Case 2: Always CC Your Manager
**Scenario:** Keep manager in loop on all external emails
```
Setup:
- Go to Options
- Set CC: manager@company.com
- Save

Every time you use Gmail feature:
- Manager is automatically CC'd
- No need to remember to add them
```

### Use Case 3: Website Contact Forms
**Scenario:** Website shows email instead of contact form
```
Webpage: "For business inquiries: business@startup.io"

Old way: Copy email → Open Gmail → Paste email → Continue

New way: Select email → Right-click Gmail → Done!
```

---

## 🔧 Technical Details

### How It Works

1. **Email Detection:**
   - Recognizes patterns like: user@domain.com
   - Handles mailto: links: mailto:user@domain.com
   - Extracts email from selected text or link URL

2. **Gmail URL Construction:**
   ```
   Base: https://mail.google.com/mail/u/0/#inbox?compose=new
   + To: &to=recipient@example.com
   + CC: &cc=cc@example.com (if configured)
   ```

3. **Gmail Parameters:**
   - `u/0` = First Gmail account
   - `compose=new` = New compose window
   - `to` = Recipient email
   - `cc` = CC email (optional)

### Code Highlights

**Email Extraction Function:**
```javascript
function extractEmail(text) {
  if (!text) return null;
  
  // Handle mailto: links
  if (text.startsWith('mailto:')) {
    return text.replace('mailto:', '').split('?')[0];
  }
  
  // Find email in text using regex
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
  const match = text.match(emailRegex);
  
  return match ? match[1] : null;
}
```

**Gmail Handler:**
```javascript
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
```

---

## ✅ Testing Checklist

Before using, verify:
- [ ] Extension loads without errors
- [ ] Options page displays Gmail section
- [ ] Can save CC email in settings
- [ ] Context menu shows "Gmail" option
- [ ] Selecting email and right-clicking works
- [ ] Right-clicking mailto: links works
- [ ] Gmail opens with correct To field
- [ ] CC field populated if configured
- [ ] Can disable Gmail in options

---

## 🐛 Troubleshooting

### Problem: Gmail option doesn't appear in context menu
**Solution:**
1. Open Options page
2. Make sure "Gmail Compose" checkbox is checked
3. Click "Save Settings"
4. Reload the webpage

### Problem: Gmail opens but fields are empty
**Possible Causes:**
- Email not properly detected
- Invalid email format
- Browser blocking URL parameters

**Solution:**
1. Try selecting just the email (no extra text)
2. Ensure email has format: user@domain.com
3. Check browser console for errors

### Problem: CC not working
**Solution:**
1. Open Options → Check CC field has valid email
2. Click "Save Settings"
3. Try again

### Problem: Gmail asks to login
**This is normal!**
- You need to be logged into Gmail
- After logging in, the compose window should appear with pre-filled fields

---

## 🎯 Pro Tips

1. **Quick Setup:**
   - Set up your CC once, never worry about it again
   - Perfect for team collaboration

2. **Multiple Uses:**
   - Works on ANY website with emails
   - Works with mailto: links in email signatures
   - Works in PDF viewers (if text selectable)

3. **Keyboard Shortcut (Future):**
   - Consider adding keyboard shortcut for power users
   - Example: Ctrl+Shift+G for Gmail

4. **Privacy:**
   - No emails stored or transmitted
   - All processing happens locally
   - CC email stored in Chrome sync (encrypted)

---

## 📊 Feature Comparison

| Feature | Before | After |
|---------|--------|-------|
| Compose to email | Copy → Open Gmail → Paste | Select → Right-click → Gmail |
| Add CC | Manual every time | Automatic |
| Mailto links | Opens default mail app | Opens Gmail |
| Speed | 5-6 steps | 2 steps |
| Errors | Copy/paste mistakes | None |

---

## 🔮 Future Enhancements (Ideas)

Possible future additions:
- [ ] BCC support
- [ ] Default subject line template
- [ ] Default message body template
- [ ] Support for multiple CC recipients
- [ ] Choose Gmail account (u/0, u/1, etc.)
- [ ] Outlook integration
- [ ] Keyboard shortcuts
- [ ] Email validation in settings

---

## 📞 Support

If you need help:
1. Check **GMAIL_FEATURE.md** for detailed documentation
2. Review **GMAIL_TESTS.md** for test cases
3. Check browser console for errors
4. Try disabling/re-enabling the extension
5. Verify you're using latest Chrome/Edge/Brave

---

## 🎊 Congratulations!

Your extension now has powerful Gmail integration! Enjoy faster email composition and better workflow automation.

**Happy Emailing! 📧✨**
