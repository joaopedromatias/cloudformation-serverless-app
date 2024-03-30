export function allowOrigin(origin: string): string {
  if (origin.match(/localhost\:3000/) || origin === process.env.WEBSITE_ORIGIN) {
    return origin
  }
  return ''
}
