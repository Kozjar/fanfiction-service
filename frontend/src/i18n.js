import i18n from 'i18next'
import XHR from 'i18next-xhr-backend'

import translationEng from './locales/en.json'
import translationRus from './locales/ru.json'

import { setCookie, getCookie } from './workingWithCookie'

i18n.use(XHR)
    .init({
      debug: true,
      lng: 'en',
      fallbackLng: 'en',

      keySeparator: false,

      resources: {
        en: {
          translations: translationEng
        },
        ru: {
          translations: translationRus
        }
      },
      ns: ["translations"],
      defaultNS: "translations"
})

export default i18n;