# QR Code PNG Download Guide

## Overview

The QR code download functionality allows users to download QR codes as PNG files. The system handles both data URLs (base64) and external URLs, with automatic conversion to PNG format when needed.

## Features

- ✅ Downloads QR codes as PNG files
- ✅ Handles data URLs (base64) and external URLs
- ✅ Automatic format conversion to PNG
- ✅ CORS handling for external images
- ✅ Proper filename formatting with restaurant name
- ✅ Loading states and error handling

## Usage

### In Components

```tsx
import { downloadQRCode } from "@/lib/utils/download"

// Basic usage
await downloadQRCode(imageUrl, code)

// With restaurant name (for better filename)
await downloadQRCode(imageUrl, code, "My Restaurant")
```

### Download Function API

```typescript
downloadQRCode(
  imageUrl: string | null,
  code: string,
  restaurantName?: string
): Promise<void>
```

**Parameters:**
- `imageUrl`: The QR code image URL (data URL or external URL)
- `code`: The QR code identifier
- `restaurantName` (optional): Restaurant name for filename formatting

**Returns:** Promise that resolves when download completes

**Throws:** Error if download fails

### Example Filenames

- Without restaurant name: `qr_qr_ABC123XYZ.png`
- With restaurant name: `my_restaurant_qr_ABC123XYZ.png`

## Implementation Details

### Download Flow

1. **Data URL Detection**: Checks if image is a data URL (base64)
   - If yes: Direct download via anchor element
   - If no: Proceeds to fetch external URL

2. **External URL Handling**:
   - Fetches image with CORS support
   - Converts to PNG if needed using Canvas API
   - Creates blob and triggers download

3. **Error Handling**:
   - Falls back to opening image in new tab if download fails
   - Shows user-friendly error messages

### Browser Compatibility

- ✅ Chrome/Edge: Full support
- ✅ Firefox: Full support
- ✅ Safari: Full support
- ✅ Mobile browsers: Full support

## Components Using Download

### QRCodeCard

The `QRCodeCard` component includes a download button:

```tsx
<QRCodeCard 
  qrCode={qrCode} 
  index={index}
  restaurantName={restaurant.name}
/>
```

The download button:
- Shows loading state while downloading
- Disables during download
- Displays error messages on failure

## Troubleshooting

### Download Not Working

1. **Check image URL**: Ensure `imageUrl` is not null
2. **CORS Issues**: External URLs must allow CORS
3. **Browser Permissions**: Some browsers block automatic downloads

### File Not Saving

- Check browser download settings
- Ensure popup blockers aren't interfering
- Try right-clicking and "Save As" as fallback

## Future Enhancements

- [ ] Multiple format support (SVG, PDF)
- [ ] Bulk download functionality
- [ ] Custom size options
- [ ] Print-friendly versions
