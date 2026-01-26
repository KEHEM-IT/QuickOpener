# Gmail Feature - Test Cases & Examples

## Test Case 1: Select Plain Email Address

### Scenario
User encounters an email address in webpage text.

### Steps
1. Navigate to any webpage with text: "Contact us at support@example.com for help"
2. Select the text: `support@example.com`
3. Right-click on selected text
4. Choose "Open with" → "Gmail"

### Expected Result
- New tab opens with Gmail compose
- "To" field contains: `support@example.com`
- If CC configured, CC field contains configured email
- Cursor ready in message body

### Test Data
```html
Example webpage content:
<p>For inquiries, email us at sales@company.com</p>
<p>Support: help@website.org</p>
<p>Contact: user.name@domain.co.uk</p>
```

---

## Test Case 2: Right-Click on Mailto Link

### Scenario
User finds a clickable mailto link.

### Steps
1. Navigate to webpage with: `<a href="mailto:info@example.com">Email Us</a>`
2. Right-click on the "Email Us" link
3. Choose "Open with" → "Gmail"

### Expected Result
- Gmail compose opens
- "To" field: `info@example.com`
- CC field populated if configured

### Test Data
```html
<a href="mailto:admin@site.com">Contact Admin</a>
<a href="mailto:contact@example.com?subject=Hello">Send Message</a>
```

---

## Test Case 3: Gmail with CC Configured

### Scenario
User has configured CC in extension settings.

### Setup
1. Open extension options
2. Enable Gmail
3. Set CC email: `manager@mycompany.com`
4. Save settings

### Steps
1. Select email: `client@business.com`
2. Right-click → "Open with" → "Gmail"

### Expected Result
- Gmail opens with:
  - To: `client@business.com`
  - CC: `manager@mycompany.com`

### URL Format
```
https://mail.google.com/mail/u/0/#inbox?compose=new&to=client@business.com&cc=manager@mycompany.com
```

---

## Test Case 4: Gmail Without CC

### Scenario
User hasn't configured CC email (default).

### Setup
1. Open extension options
2. Leave CC field empty
3. Save settings

### Steps
1. Select email: `test@example.com`
2. Right-click → "Open with" → "Gmail"

### Expected Result
- Gmail opens with:
  - To: `test@example.com`
  - CC: (empty)

### URL Format
```
https://mail.google.com/mail/u/0/#inbox?compose=new&to=test@example.com
```

---

## Test Case 5: Email in Complex Text

### Scenario
Email address embedded in sentence.

### Test Data
```html
<p>Please reach out to john.doe@company-name.com or jane@example.org for more info</p>
```

### Steps
1. Select just the email: `john.doe@company-name.com`
2. Right-click → "Open with" → "Gmail"

### Expected Result
- Gmail opens with correct email
- Special characters (dots, hyphens) handled properly

---

## Test Case 6: Mailto Link with Parameters

### Scenario
Mailto link includes subject or body.

### Test Data
```html
<a href="mailto:support@company.com?subject=Help%20Request&body=I%20need%20assistance">Get Help</a>
```

### Steps
1. Right-click on link
2. Choose "Open with" → "Gmail"

### Expected Result
- Gmail opens
- To: `support@company.com`
- Subject and body from mailto are ignored (Gmail compose handles this)
- CC added if configured

---

## Test Case 7: Invalid Email Format

### Scenario
Selected text is not a valid email.

### Test Data
```
- "notanemail"
- "@example.com"
- "user@"
- "user @example.com" (space)
```

### Steps
1. Select invalid text
2. Right-click → "Open with" → "Gmail"

### Expected Result
- Nothing happens OR
- Gmail opens without To field populated
- No errors shown to user

---

## Test Case 8: Multiple Gmail Accounts

### Scenario
User has multiple Gmail accounts logged in.

### Current Behavior
- Extension uses `/mail/u/0/` (first account)
- User can change account in Gmail if needed

### Potential Enhancement
- Add setting to choose account number
- `/mail/u/0/` = first account
- `/mail/u/1/` = second account
- etc.

---

## Test Case 9: Enable/Disable Gmail

### Scenario A: Gmail Enabled
1. Open options → Enable Gmail checkbox → Save
2. Right-click on any page → "Open with"
3. Should see "Gmail" option

### Scenario B: Gmail Disabled
1. Open options → Disable Gmail checkbox → Save
2. Right-click on any page → "Open with"
3. Should NOT see "Gmail" option

---

## Test Case 10: CC Email Validation

### Test Data for CC Field
```
Valid:
- user@example.com
- john.doe@company.co.uk
- admin+test@site.org

Invalid (but currently accepted):
- notanemail
- @example.com
- user@
```

### Steps
1. Enter various formats in CC field
2. Save settings
3. Use Gmail feature

### Notes
- Consider adding email validation in future
- Currently accepts any text (trimmed)

---

## Email Regex Test Cases

The extraction function uses:
```javascript
/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/
```

### Should Match
✅ `user@example.com`
✅ `john.doe@company.com`
✅ `admin_test@site.org`
✅ `user-name@sub.domain.co.uk`
✅ `test123@example.io`

### Should Not Match
❌ `@example.com` (no username)
❌ `user@` (no domain)
❌ `user @example.com` (space)
❌ `user@domain` (no TLD)

---

## Integration Tests

### Test with Other Features
1. **WhatsApp + Gmail**: Both should work independently
2. **Multiple Apps**: Enable all apps, verify Gmail appears correctly
3. **Settings Sync**: Change settings on one browser, verify sync

### Test Across Pages
1. **Regular webpage**: HTML emails
2. **Gmail webpage**: Emails in Gmail interface
3. **Google Docs**: Emails in document
4. **PDF viewer**: Emails in PDF (if selectable)

---

## Performance Tests

### Load Time
- Extension should load instantly
- Context menu should appear quickly

### Memory Usage
- No memory leaks from Gmail feature
- Settings stored efficiently in chrome.storage.sync

---

## Edge Cases

### 1. Very Long Email
```
verylongemailaddress@verylongdomainnamethatshouldstillwork.com
```
Should work (URL encoding handles length)

### 2. International Characters
```
user@ëxample.com
مستخدم@example.com
```
May or may not work depending on regex

### 3. Multiple Emails Selected
```
"contact@example.com and support@example.com"
```
Currently: Extracts first match only

### 4. Email in URL
```
https://example.com/contact?email=user@example.com
```
Should extract: `user@example.com`

---

## Browser Compatibility Tests

### Chrome
- ✅ Should work perfectly

### Edge
- ✅ Chromium-based, should work

### Brave
- ✅ Chromium-based, should work
- Note: May prompt for site permissions

### Opera
- ✅ Chromium-based, should work

---

## User Experience Tests

### Positive Scenarios
1. Quick email composition
2. Consistent CC addition
3. No extra clicks needed

### Negative Scenarios
1. User not logged into Gmail
   - Result: Gmail login page appears
2. User has Gmail blocked
   - Result: Blocked by browser
3. User on mobile
   - Result: May not work (desktop extension)

---

## Automated Testing Script Ideas

```javascript
// Test email extraction
function testEmailExtraction() {
  const tests = [
    { input: 'mailto:test@example.com', expected: 'test@example.com' },
    { input: 'contact us at info@site.org', expected: 'info@site.org' },
    { input: 'user@domain.co.uk', expected: 'user@domain.co.uk' },
    { input: 'notanemail', expected: null }
  ];
  
  tests.forEach(test => {
    const result = extractEmail(test.input);
    console.assert(result === test.expected, 
      `Failed: ${test.input} -> got ${result}, expected ${test.expected}`);
  });
}
```

---

## Reporting Issues

If users report issues:
1. Check Gmail account is logged in
2. Verify settings are saved
3. Check browser console for errors
4. Test with simple email first
5. Confirm extension is enabled
