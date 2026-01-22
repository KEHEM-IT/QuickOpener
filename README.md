# Quick Opener Chrome Extension

A Chrome extension that allows you to quickly open selected phone numbers in WhatsApp, Telegram, Viber, and Signal.

## Features

- **Right-click context menu**: Select any phone number on a webpage, right-click, and choose "Open with" to see messaging app options
- **Auto country code**: Automatically adds your default country code if the number doesn't include one
- **Multiple apps**: Support for WhatsApp, Telegram, Viber, and Signal
- **Customizable**: Configure default country code and enable/disable specific apps
- **Smart number parsing**: Handles various phone number formats including:
  - International format: +880 1881-024577
  - Local format: 01881-024577
  - With spaces/dashes: +880 1881 024 577

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked"
4. Select the `QuickWhatsapp` folder
5. The extension is now installed!

## Usage

1. **Select a phone number** on any webpage (e.g., +880 1881-024577 or 01881024577)
2. **Right-click** on the selected text
3. Hover over **"Open with"**
4. Choose your preferred messaging app (WhatsApp, Telegram, Viber, or Signal)
5. A new tab will open with the messaging app ready to chat with that number

## Configuration

Click on the extension icon and select "Options" or right-click the extension icon and choose "Options" to:

- Set your default country code (default is 880 for Bangladesh)
- Enable or disable specific messaging apps from the context menu

## Examples

The extension handles these formats automatically:

- `+880 1881-024577` → Opens as 8801881024577
- `01881-024577` → Adds country code → 8801881024577
- `1881024577` → Adds country code → 8801881024577
- `+1 (555) 123-4567` → Opens as 15551234567

## Creating Icons

The extension currently uses placeholder icons. To add proper icons:

1. Create PNG images in the `icons` folder:
   - `icon16.png` (16x16 pixels)
   - `icon48.png` (48x48 pixels)
   - `icon128.png` (128x128 pixels)

2. You can use a WhatsApp logo or create a custom icon with green (#25D366) as the primary color

3. Online tools like [IconGenerator](https://cthedot.de/icongen/) can help create multiple sizes from one image

## Notes

- The extension requires at least 10 digits for a valid phone number
- Numbers are cleaned (spaces, dashes, parentheses removed) before opening
- WhatsApp uses the `wa.me` format for maximum compatibility
- Default country code is set to 880 (Bangladesh) but can be changed in settings

## Support

If you encounter any issues or have suggestions, please report them on the project repository.

## License

Free to use and modify.
