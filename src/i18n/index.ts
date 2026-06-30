import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { en } from './en'
import { ru } from './ru'
import { uk } from './uk'

void i18n.use(initReactI18next).init({
  resources: {
    ru: { translation: ru },
    uk: { translation: uk },
    en: { translation: en },
  },
  lng: 'ru',
  fallbackLng: 'ru',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
