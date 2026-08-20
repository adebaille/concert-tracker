// Utilitaire de recadrage : prend une image source et une zone de crop,
// renvoie un Blob (le fichier image coupé) prêt à être uploadé.

type CropArea = {
  x: number
  y: number
  width: number
  height: number
}

// Charge une image depuis une URL et attend qu'elle soit prête
function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.src = url
  })
}

// Découpe la zone choisie et renvoie le résultat en Blob
export async function getCroppedImage(
  imageSrc: string,
  cropArea: CropArea
): Promise<Blob> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('Contexte canvas indisponible')
  }

  // Le canvas prend la taille exacte de la zone recadrée
  canvas.width = cropArea.width
  canvas.height = cropArea.height

  // On dessine sur le canvas uniquement la portion choisie de l'image d'origine
  ctx.drawImage(
    image,
    cropArea.x,        // point de départ X dans l'image source
    cropArea.y,        // point de départ Y dans l'image source
    cropArea.width,    // largeur à prélever
    cropArea.height,   // hauteur à prélever
    0,                 // destination X sur le canvas
    0,                 // destination Y sur le canvas
    cropArea.width,    // largeur de destination
    cropArea.height    // hauteur de destination
  )

  // On convertit le contenu du canvas en fichier image (Blob)
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob)
      } else {
        reject(new Error('Échec de la conversion en image'))
      }
    }, 'image/jpeg', 0.9)  // JPEG qualité 90%
  })
}