/**
 * Downloads an image as a PNG file
 * Handles both data URLs (base64) and external URLs
 */
export async function downloadImageAsPNG(
  imageUrl: string,
  filename: string = "qr-code.png"
): Promise<void> {
  try {
    // Handle data URLs (base64)
    if (imageUrl.startsWith("data:image")) {
      const link = document.createElement("a")
      link.href = imageUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      return
    }

    // Handle external URLs
    const response = await fetch(imageUrl, {
      mode: "cors",
      cache: "no-cache",
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }

    const blob = await response.blob()
    
    // Ensure it's a PNG
    const pngBlob = blob.type === "image/png" 
      ? blob 
      : await convertToPNG(blob)

    const url = window.URL.createObjectURL(pngBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename.endsWith(".png") ? filename : `${filename}.png`
    link.style.display = "none"
    
    document.body.appendChild(link)
    link.click()
    
    // Cleanup
    setTimeout(() => {
      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)
    }, 100)
  } catch (error) {
    console.error("Error downloading image:", error)
    
    // Fallback: Try opening in new tab
    try {
      window.open(imageUrl, "_blank")
    } catch (fallbackError) {
      console.error("Fallback download also failed:", fallbackError)
      throw new Error("Failed to download image. Please try right-clicking and saving the image.")
    }
  }
}

/**
 * Converts an image blob to PNG format using canvas
 */
async function convertToPNG(blob: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      reject(new Error("Canvas context not available"))
      return
    }

    const url = URL.createObjectURL(blob)

    img.onload = () => {
      try {
        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)
        
        canvas.toBlob(
          (pngBlob) => {
            URL.revokeObjectURL(url)
            if (pngBlob) {
              resolve(pngBlob)
            } else {
              reject(new Error("Failed to convert image to PNG"))
            }
          },
          "image/png",
          1.0
        )
      } catch (error) {
        URL.revokeObjectURL(url)
        reject(error)
      }
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Failed to load image"))
    }

    img.src = url
  })
}

/**
 * Downloads QR code with proper filename formatting
 */
export async function downloadQRCode(
  imageUrl: string | null,
  code: string,
  restaurantName?: string
): Promise<void> {
  if (!imageUrl) {
    throw new Error("QR code image not available")
  }

  const sanitizedName = restaurantName
    ? restaurantName.replace(/[^a-z0-9]/gi, "_").toLowerCase()
    : "qr"
  
  const filename = `${sanitizedName}_qr_${code}.png`
  
  await downloadImageAsPNG(imageUrl, filename)
}

