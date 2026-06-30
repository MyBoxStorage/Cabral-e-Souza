/** Divide verbete markdown em seções para abas editoriais */
export function splitArtistBio(bio: string): {
  biografia: string
  mercado: string
} {
  const mercadoIndex = bio.search(/## Mercado/i)
  if (mercadoIndex === -1) {
    return { biografia: bio, mercado: '' }
  }

  const nextSection = bio.slice(mercadoIndex + 1).search(/\n## /)
  const mercadoEnd = nextSection === -1 ? bio.length : mercadoIndex + 1 + nextSection

  return {
    biografia: bio.slice(0, mercadoIndex).trim(),
    mercado: bio.slice(mercadoIndex, mercadoEnd).trim(),
  }
}
