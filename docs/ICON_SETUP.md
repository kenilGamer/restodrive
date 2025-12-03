# Icon Setup Instructions

The PWA manifest requires icon files that are currently missing. You need to create these icon files:

## Required Icons

1. **icon-192.png** (192x192 pixels)
2. **icon-512.png** (512x512 pixels)

## Quick Setup Options

### Option 1: Use an Online Icon Generator
1. Visit https://realfavicongenerator.net/ or https://www.favicon-generator.org/
2. Upload your restaurant logo or create a simple icon
3. Download the generated icons
4. Place them in the `public/` directory

### Option 2: Create Simple Placeholder Icons
You can create simple colored square icons using any image editor:
- Background: `#06b6d4` (cyan theme color)
- Text/Logo: White "RD" or restaurant logo
- Size: 192x192 and 512x512 pixels

### Option 3: Use a Design Tool
- Figma, Canva, or Adobe Illustrator
- Export as PNG with the exact dimensions
- Save to `public/icon-192.png` and `public/icon-512.png`

## Current Status
- ✅ Manifest.json configured
- ⚠️ Icon files need to be created
- ✅ Theme color warnings fixed

Once the icons are created, the PWA will be fully functional!

