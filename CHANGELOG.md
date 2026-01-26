# Changelog - Quick Opener Extension

## [Version 1.1.0] - 2026-01-26

### ✨ New Features

#### Gmail Integration
- **Gmail Compose Feature**: Added ability to quickly open Gmail compose window with pre-populated recipient
- **Auto-CC Support**: Optional CC email can be configured in settings to automatically add CC recipient
- **Smart Email Detection**: Automatically extracts emails from:
  - Plain text selections (e.g., "support@example.com")
  - Mailto: links (e.g., `<a href="mailto:user@example.com">`)
- **Context Menu Integration**: New "Gmail" option in "Open with" context menu
- **Settings UI**: New Gmail Settings section in options page with:
  - Enable/disable toggle for Gmail feature
  - Optional CC email input field
  - Helpful tooltips and information

### 🔧 Technical Improvements

#### Code Changes
- **background.js**:
  - Added `extractEmail()` function for email detection
  - Added Gmail context menu creation
  - Implemented Gmail URL construction with parameters
  - Added email regex pattern matching
  - Support for mailto: link parsing
  
- **options.html**:
  - New Gmail Settings card section
  - CC email input field
  - Consistent styling with existing UI
  - Added informational tooltips
  
- **options.js**:
  - Gmail settings loading on page load
  - Gmail settings saving functionality
  - CC email field handling
  
- **manifest.json**:
  - Added `activeTab` permission for better tab handling

### 📚 Documentation

#### New Documentation Files
- **GMAIL_FEATURE.md**: Complete technical documentation
- **GMAIL_TESTS.md**: Comprehensive test cases and examples
- **SETUP_GUIDE.md**: User-friendly setup guide
- **IMPLEMENTATION_SUMMARY.md**: Developer implementation summary
- **QUICK_REFERENCE.md**: Quick reference card for users

#### Updated Files
- **README.md**: Updated with Gmail feature information and usage examples

### 🎯 Use Cases
1. **Quick Customer Email**: Select email on webpage, right-click to compose
2. **Team Collaboration**: Auto-CC manager or team member on all emails
3. **Website Contact**: One-click email composition from contact pages
4. **Mailto: Links**: Right-click mailto: links to open in Gmail

### 🔒 Security & Privacy
- All email processing happens locally in browser
- No emails stored or transmitted by extension
- CC email stored in Chrome sync storage (encrypted)
- No tracking or analytics

---

## [Version 1.0.0] - Initial Release

### Features
- WhatsApp integration (Web, Desktop, wa.me)
- Telegram integration (Web, Desktop)
- Viber integration
- Signal integration
- YouTube Search
- Google Search
- Customizable country code
- Auto-send for WhatsApp Web
- Context menu for all features
- Options page for configuration

---

## Future Roadmap

### Version 1.2.0 (Planned)
- [ ] BCC support for Gmail
- [ ] Subject line templates
- [ ] Message body templates
- [ ] Multiple CC recipients
- [ ] Email validation in settings

### Version 1.3.0 (Planned)
- [ ] Outlook integration
- [ ] Yahoo Mail integration
- [ ] Gmail account selector
- [ ] Keyboard shortcuts
- [ ] Statistics dashboard

### Version 2.0.0 (Future)
- [ ] Custom email providers
- [ ] Template management system
- [ ] Contact book integration
- [ ] Email scheduling
- [ ] Advanced automation

---

## Version History

| Version | Release Date | Key Feature |
|---------|--------------|-------------|
| 1.1.0 | 2026-01-26 | Gmail Integration |
| 1.0.0 | 2025 | Initial Release |

---

## Upgrade Notes

### Upgrading to 1.1.0
1. No breaking changes
2. All existing settings preserved
3. New Gmail setting added (disabled by default for existing users)
4. To enable Gmail:
   - Go to Options
   - Check "Gmail Compose"
   - Optionally add CC email
   - Save settings

### Fresh Installation
- All features enabled by default
- Gmail feature ready to use
- Configure CC email in settings if needed

---

## Known Issues

### Version 1.1.0
- Gmail must be logged in for compose to work (expected behavior)
- Email detection regex may not catch all edge cases
- URL parameters might not work in some Gmail configurations

### Version 1.0.0
- WhatsApp auto-send may fail if page loads slowly
- Desktop app links require apps to be installed

---

## Feedback & Contributions

We welcome feedback and suggestions! Please report issues or suggest features through:
- GitHub Issues (if applicable)
- Extension store reviews
- Direct feedback

---

## Credits

**Developer**: Shuvo (shuvosk572@gmail.com)
**Extension Name**: Quick Opener
**Current Version**: 1.1.0
**Release Date**: January 26, 2026

---

## License

Free to use and modify for personal and commercial purposes.

---

**Thank you for using Quick Opener! 🚀**
