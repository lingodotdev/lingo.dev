import { ref } from "vue"
import en from "../../i18n/en.json"
import hi from "../../i18n/hi.json"

const messages = {
  en,
  hi
}

const lang = ref("en")

export function useI18n() {
  const t = (key) => {
    return messages[lang.value][key] || key
  }

  const setLang = (l) => {
    lang.value = l
  }

  return { t, lang, setLang }
}
