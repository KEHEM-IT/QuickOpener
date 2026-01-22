# Quick Opener Chrome Extension

A Chrome extension that allows you to quickly open selected text in various apps and services - WhatsApp, Telegram, Viber, Signal, YouTube, and Google Search.

## Features

- **Right-click context menu**: Select any text on a webpage, right-click, and choose "Open with" to see available options
- **Messaging Apps**: Open phone numbers directly in WhatsApp, Telegram, Viber, and Signal
- **YouTube Search**: Search selected text on YouTube
- **Google Search**: Search selected text on Google
- **Auto country code**: Automatically adds your default country code if phone numbers don't include one
- **Customizable**: Configure default country code and enable/disable specific apps
- **Desktop App Support**: Choose between web or desktop apps for WhatsApp and Telegram
- **Smart parsing**: Handles various formats including:
  - Phone numbers: +880 1881-024577, 01881-024577
  - Telegram usernames: @username
  - Telegram links: t.me/username
  - Any text for YouTube/Google search

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked"
4. Select the extension folder
5. The extension is now installed!

## Usage

### For Phone Numbers
1. **Select a phone number** on any webpage (e.g., +880 1881-024577 or 01881024577)
2. **Right-click** on the selected text
3. Hover over **"Open with"**
4. Choose your preferred messaging app (WhatsApp, Telegram, Viber, or Signal)
5. A new tab will open with the messaging app ready to chat with that number

### For Telegram Usernames/Links
1. **Select** a Telegram username (@username) or link (t.me/username)
2. **Right-click** and choose **"Open with" → Telegram**
3. Opens the user/channel in Telegram Web or Desktop app (based on your settings)

### For YouTube/Google Search
1. **Select any text** you want to search
2. **Right-click** and choose **"Open with" → YouTube** or **"Google Search"**
3. Opens search results in a new tab

## Configuration

Click on the extension icon and select "Options" or right-click the extension icon and choose "Options" to:

- Set your default country code (default is 880 for Bangladesh)
- Enable or disable specific apps from the context menu
- Choose between Web or Desktop app for WhatsApp
- Choose between Web or Desktop app for Telegram
- Enable/disable auto-send for WhatsApp Web

## App Options

### WhatsApp
- **WhatsApp Web**: Opens in browser at web.whatsapp.com
- **WhatsApp Desktop**: Opens in installed desktop application
- **wa.me Link**: Let system choose (may ask which app to use)
- **Auto-send**: Automatically clicks send button (Web only)

### Telegram
- **Telegram Web**: Opens in browser at t.me
- **Telegram Desktop**: Opens in installed desktop application using tg:// protocol
- Supports: phone numbers, @usernames, and t.me links

### Other Apps
- **Viber**: Opens using viber:// protocol (requires Viber installed)
- **Signal**: Opens using signal.me web interface
- **YouTube**: Searches selected text on YouTube
- **Google**: Searches selected text on Google

## Examples

### Phone Numbers
- `+880 1881-024577` → Opens as 8801881024577
- `01881-024577` → Adds country code → 8801881024577
- `1881024577` → Adds country code → 8801881024577
- `+1 (555) 123-4567` → Opens as 15551234567

### Telegram
- `@username` → Opens telegram user/channel
- `t.me/username` → Opens telegram user/channel
- `+880 1881024577` → Opens chat with phone number

### YouTube/Google
- Select any text → Search on YouTube or Google

## Notes

- The extension requires at least 10 digits for valid phone numbers
- Numbers are cleaned (spaces, dashes, parentheses removed) before opening
- Telegram Desktop requires Telegram Desktop app to be installed
- WhatsApp Desktop requires WhatsApp Desktop app to be installed
- Default country code is set to 880 (Bangladesh) but can be changed in settings
- YouTube and Google Search work with any selected text

## Troubleshooting

### Telegram Desktop Not Opening
If Telegram Desktop option doesn't work:
1. Make sure Telegram Desktop is installed on your computer
2. Try the "Telegram Web" option instead
3. Check if your browser allows tg:// protocol links

### WhatsApp Desktop Not Opening
If WhatsApp Desktop option doesn't work:
1. Make sure WhatsApp Desktop is installed
2. Try the "WhatsApp Web" option instead
3. Check if your browser allows whatsapp:// protocol links

## Support

If you encounter any issues or have suggestions, please report them on the project repository.

## License

Free to use and modify.
