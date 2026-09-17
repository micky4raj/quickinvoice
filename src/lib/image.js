// Uploaded logos are stored as base64 in LocalStorage (no backend to upload
// to), and LocalStorage is typically capped around 5-10MB per origin. A
// straight-from-camera photo used as a "logo" can be several megabytes on
// its own, which risks silently blowing that quota. Downscaling to a sane
// logo size before storing keeps the whole invoice comfortably small.
const MAX_DIMENSION = 320

export function resizeImageFile(file, maxDimension = MAX_DIMENSION) {
  return new Promise((resolve, reject) => {
    if (!file.type || !file.type.startsWith('image/')) {
      reject(new Error('That file does not look like an image.'))
      return
    }

    const reader = new FileReader()
    reader.onerror = () => reject(new Error('Could not read the selected file.'))
    reader.onload = () => {
      const img = new Image()
      img.onerror = () => reject(new Error('Could not decode the selected image.'))
      img.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height))
        const width = Math.max(1, Math.round(img.width * scale))
        const height = Math.max(1, Math.round(img.height * scale))

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        resolve(canvas.toDataURL('image/png'))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}
