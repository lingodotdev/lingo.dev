import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function reconstructUrl(urlParam: string | string[]): string {
  const joined = Array.isArray(urlParam) ? urlParam.join('/') : urlParam
  
  let decoded: string
  try {
    decoded = decodeURIComponent(joined)
  } catch {
    decoded = joined
  }
  
  if (decoded.startsWith('http://') || decoded.startsWith('https://')) {
    return decoded
  }
  
  if (decoded.startsWith('http:/') || decoded.startsWith('https:/')) {
    return decoded.replace(/^(https?):\/+/, '$1://')
  }
  
  if (decoded.includes('://')) {
    return decoded.replace(/:\/+/g, '://')
  }
  
  return `https://${decoded}`
}