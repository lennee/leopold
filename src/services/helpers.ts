import fs from 'fs'


export const exists = (path: string): boolean => {
  try {
    fs.readFileSync(path)
    return true
  } catch {
    return false
  }
}
