export function searchInterpolation(str: string): string[] {
  return Array.from(str.matchAll(/{{[\w\sа-я]+}}/g), m => m[0])
}

export function replaceInterpolation (string: string, translatedString: string): string {
  const interpolation = searchInterpolation(string)
  const newInterpolation = searchInterpolation(translatedString)
  let str = translatedString
  newInterpolation.forEach((i, k) => {
   str = str.replace(i, interpolation[k])
  })

  return str
}


