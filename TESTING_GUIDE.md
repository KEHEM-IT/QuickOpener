# 🧪 Gmail Feature - Visual Testing Guide

## Step-by-Step Testing Instructions

---

## Test 1: Install and Configure

### Step 1.1: Load Extension
```
1. Open Chrome
2. Navigate to: chrome://extensions/
3. Toggle ON: "Developer mode" (top right)
4. Click: "Load unpacked"
5. Select folder: D:\Web\Extensions\CHROME\QuickOpener
6. Extension icon should appear in toolbar ✓
```

**Expected Result:**
- Extension loads without errors
- Icon visible in Chrome toolbar

---

### Step 1.2: Open Options Page
```
1. Right-click extension icon
2. Click "Options"
   OR
1. Click extension icon
2. Click "Options"
```

**Expected Result:**
- Options page opens in new tab
- Dark theme visible
- All sections displayed correctly

---

### Step 1.3: Configure Gmail Settings
```
1. Scroll to "Gmail Settings" section
2. Verify "Gmail Compose" checkbox is checked ✓
3. In CC Email field, enter: your-cc@gmail.com
4. Click "Save Settings" button
5. Wait for success message
```

**Expected Result:**
- Success animation appears
- Button shows "Saved!" temporarily
- Green success message displays

---

## Test 2: Select Email Address

### Step 2.1: Create Test Page
Create a simple HTML file or use this code in browser console:

```html
<!DOCTYPE html>
<html>
<body style="padding: 50px; font-size: 18px;">
  <h1>Test Emails</h1>
  <p>Contact us at <strong>support@example.com</strong> for help.</p>
  <p>Sales: <strong>sales@company.co.uk</strong></p>
  <p>Info: <strong>info.test@website.org</strong></p>
  <p>Admin: <strong>admin+tag@domain.io</strong></p>
</body>
</html>
```

---

### Step 2.2: Test Text Selection
```
1. Open the test page
2. Select "support@example.com" (just the email)
3. Right-click on selected text
4. Hover over "Open with"
5. Look for "Gmail" option
6. Click "Gmail"
```

**Expected Result:**
- Context menu appears
- "Open with" submenu shows
- "Gmail" option visible
- Clicking opens new tab
- Gmail compose loads
- To field contains: support@example.com
- CC field contains: your-cc@gmail.com

---

## Test 3: Mailto Links

### Step 3.1: Create Mailto Test Page
```html
<!DOCTYPE html>
<html>
<body style="padding: 50px; font-size: 18px;">
  <h1>Test Mailto Links</h1>
  <p><a href="mailto:contact@example.com">Email Contact</a></p>
  <p><a href="mailto:info@site.org?subject=Hello">Email Info with Subject</a></p>
  <p><a href="mailto:support+help@domain.com">Email Support</a></p>
</body>
</html>
```

---

### Step 3.2: Test Mailto Links
```
1. Open the test page
2. RIGHT-CLICK (don't left-click) on "Email Contact" link
3. Choose "Open with" → "Gmail"
4. New tab opens
```

**Expected Result:**
- Gmail compose opens
- To field: contact@example.com
- CC field: your-cc@gmail.com (if configured)

**Note:** Left-clicking will open default mail client, we want right-click!

---

## Test 4: Without CC Configuration

### Step 4.1: Clear CC Email
```
1. Open Options page
2. Scroll to Gmail Settings
3. Clear the CC Email field (leave blank)
4. Click "Save Settings"
```

---

### Step 4.2: Test Without CC
```
1. Go to test page
2. Select any email
3. Right-click → "Open with" → "Gmail"
```

**Expected Result:**
- Gmail opens
- To field populated
- CC field EMPTY (not populated)

---

## Test 5: Enable/Disable Gmail

### Step 5.1: Disable Gmail
```
1. Open Options page
2. Uncheck "Gmail Compose" checkbox
3. Click "Save Settings"
4. Go to any webpage
5. Select any text
6. Right-click → "Open with"
```

**Expected Result:**
- Gmail option NOT visible in menu
- Other options (WhatsApp, etc.) still visible

---

### Step 5.2: Re-enable Gmail
```
1. Open Options page
2. Check "Gmail Compose" checkbox ✓
3. Click "Save Settings"
4. Go to any webpage
5. Select any text
6. Right-click → "Open with"
```

**Expected Result:**
- Gmail option VISIBLE again in menu

---

## Test 6: Real-World Scenarios

### Test 6.1: Wikipedia Page
```
1. Go to: https://en.wikipedia.org/wiki/Email
2. Find any email address on the page
3. Select it
4. Right-click → "Open with" → "Gmail"
```

---

### Test 6.2: Google Search Results
```
1. Search: "contact email example.com"
2. Find email addresses in search results
3. Select email
4. Right-click → "Open with" → "Gmail"
```

---

### Test 6.3: Company Website
```
1. Visit any company website with contact page
2. Find email address
3. Select and right-click → Gmail
```

---

## Test 7: Edge Cases

### Test 7.1: Email with Special Characters
```
Test emails:
- john.doe@example.com
- user+tag@domain.org
- admin_test@site.co.uk
- firstname.lastname@company-name.com
```

**All should work!**

---

### Test 7.2: Invalid Emails
```
Test with:
- "notanemail"
- "@example.com"
- "user@"
- "user @example.com" (with space)
```

**Expected:** Nothing happens or Gmail opens without To field

---

### Test 7.3: Multiple Emails in Text
```
Test text: "Contact support@example.com or sales@example.com"
Select: the entire text
```

**Expected:** First email is extracted (support@example.com)

---

## Test 8: Browser Compatibility

### Chrome
```
✓ Should work perfectly
- Latest version: Full support
- Older versions: Should work
```

### Edge
```
✓ Chromium-based
- Should work identically to Chrome
```

### Brave
```
✓ Chromium-based
- May show additional privacy prompts
- Core functionality works
```

---

## Visual Checklist

### Options Page
- [ ] Dark theme loads correctly
- [ ] Gmail Settings section visible
- [ ] Gmail checkbox works
- [ ] CC email input accepts text
- [ ] Save button works
- [ ] Success message appears
- [ ] Icons display correctly
- [ ] Tooltips show on hover

### Context Menu
- [ ] Right-click shows menu
- [ ] "Open with" submenu appears
- [ ] Gmail option visible (when enabled)
- [ ] Gmail option hidden (when disabled)
- [ ] Icons appear next to each option

### Gmail Compose
- [ ] New tab opens
- [ ] Gmail URL correct
- [ ] To field populated
- [ ] CC field populated (when configured)
- [ ] Ready to type message
- [ ] No errors in console

---

## Troubleshooting Tests

### Problem: Context menu not showing
**Test:**
```
1. Reload extension (chrome://extensions/)
2. Toggle extension off/on
3. Try again
```

### Problem: Gmail not opening
**Test:**
```
1. Check if logged into Gmail
2. Try in incognito mode
3. Check browser console for errors
4. Test with different email format
```

### Problem: CC not appearing
**Test:**
```
1. Open Options
2. Verify CC email is saved
3. Re-save settings
4. Test again
```

---

## Console Testing

### Check for Errors
```
1. Open browser console (F12)
2. Go to Console tab
3. Use Gmail feature
4. Look for errors (red text)
```

**Expected:** No errors should appear

---

### Check Storage
```
1. Open console (F12)
2. Go to Application → Storage → Extension
3. Look for settings
4. Verify gmailCC value is saved
```

---

## Performance Testing

### Speed Test
```
Time these actions:
1. Select email → Right-click → Gmail
   Target: < 2 seconds

2. Gmail page load
   Target: < 3 seconds (depends on internet)

3. Options save
   Target: < 1 second
```

---

## Acceptance Criteria

### ✅ Feature is Ready When:
- [ ] All 8 tests pass
- [ ] No console errors
- [ ] Options page saves correctly
- [ ] Context menu appears
- [ ] Gmail opens with parameters
- [ ] CC works when configured
- [ ] Enable/disable works
- [ ] Works on multiple websites
- [ ] Mailto links work
- [ ] Documentation complete

---

## Test Report Template

```
Date: _____________
Tester: ___________
Browser: __________
Version: __________

Test Results:
[ ] Test 1: Install and Configure
[ ] Test 2: Select Email Address
[ ] Test 3: Mailto Links
[ ] Test 4: Without CC
[ ] Test 5: Enable/Disable
[ ] Test 6: Real-World Scenarios
[ ] Test 7: Edge Cases
[ ] Test 8: Browser Compatibility

Issues Found:
1. _______________________________
2. _______________________________
3. _______________________________

Overall Status: [ ] Pass [ ] Fail

Notes:
_________________________________
_________________________________
```

---

## 🎉 Success!

If all tests pass, your Gmail feature is working perfectly! 

**Congratulations! 🚀**
