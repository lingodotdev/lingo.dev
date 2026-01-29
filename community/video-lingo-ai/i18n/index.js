import { createI18n } from "vue-i18n"
import en from "./en.json"
import hi from "./hi.json"
import es from "./es.json"
import fr from "./fr.json"

const i18n = createI18n({
  legacy: false,
  locale: "en",
  fallbackLocale: "en",
  messages: { en, hi, es, fr }
})

export default i18n
