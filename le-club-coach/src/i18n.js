import React from 'react'
import i18n from 'i18n-js'

const currentNavigatorLanguage = navigator.language.substring(0, 2)
i18n.locale = currentNavigatorLanguage
i18n.fallbacks = 'en'
i18n.translations = {
  fr: require('./locales/fr.json'),
  en: require('./locales/en.json'),
}
