"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Globe } from "lucide-react"

const languages = [
  { label: "English", value: "en" },
  { label: "Spanish", value: "es" },
  { label: "French", value: "fr" },
  { label: "German", value: "de" },
  { label: "Chinese", value: "zh" },
  { label: "Japanese", value: "ja" },
]

export function LanguageSwitcher() {
  const [value, setValue] = React.useState("en")

  React.useEffect(() => {
    const path = window.location.pathname
    const lang = languages.find(l => path.startsWith(`/${l.value}/`) || path === `/${l.value}`)
    if (lang) {
      setValue(lang.value)
    }
  }, [])

  const handleLanguageChange = (newValue: string) => {
    setValue(newValue)
    const currentPath = window.location.pathname
    const currentLang = languages.find(l => currentPath.startsWith(`/${l.value}/`) || currentPath === `/${l.value}`)?.value

    let newPath = currentPath

    if (currentLang) {
      // Replace existing locale
      if (newValue === 'en') {
         // Remove locale prefix
         newPath = currentPath.replace(`/${currentLang}`, '') || '/'
      } else {
         // Swap locale prefix
         newPath = currentPath.replace(`/${currentLang}`, `/${newValue}`)
      }
    } else {
      // Currently in default locale (en)
      if (newValue !== 'en') {
        newPath = `/${newValue}${currentPath === '/' ? '' : currentPath}`
      }
    }
    
    // Normalize path
    if (newPath === '') newPath = '/'
    
    window.location.href = newPath
  }

  return (
    <Select value={value} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[140px]">
        <Globe className="mr-2 h-4 w-4" />
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((language) => (
          <SelectItem key={language.value} value={language.value}>
            {language.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
