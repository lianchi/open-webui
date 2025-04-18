import type { i18n as i18nType } from 'i18next'
import i18next from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import resourcesToBackend from 'i18next-resources-to-backend'
import { writable } from 'svelte/store'

function createI18nStore(i18n: i18nType) {
  const i18nWritable = writable(i18n)

  i18n.on('initialized', () => {
    i18nWritable.set(i18n)
  })
  i18n.on('loaded', () => {
    i18nWritable.set(i18n)
  })
  i18n.on('added', () => i18nWritable.set(i18n))
  i18n.on('languageChanged', () => {
    i18nWritable.set(i18n)
  })
  return i18nWritable
}

function createIsLoadingStore(i18n: i18nType) {
  const isLoading = writable(false)

  // if loaded resources are empty || {}, set loading to true
  i18n.on('loaded', (resources) => {
    // console.log('loaded:', resources);
    Object.keys(resources).length !== 0 && isLoading.set(false)
  })

  // if resources failed loading, set loading to true
  i18n.on('failedLoading', () => {
    isLoading.set(true)
  })

  return isLoading
}

export function initI18n(defaultLocale?: string | undefined) {
  let detectionOrder = defaultLocale
    ? ['querystring', 'localStorage']
    : ['querystring', 'localStorage', 'navigator']
  let fallbackDefaultLocale = defaultLocale ? [defaultLocale] : ['en-US']

  const loadResource = (language: string, namespace: string) =>
    import(`./locales/${language}/${namespace}.json`)

  i18next
    .use(resourcesToBackend(loadResource))
    .use(LanguageDetector)
    .init({
      debug: false,
      detection: {
        order: detectionOrder,
        caches: ['localStorage'],
        lookupQuerystring: 'lang',
        lookupLocalStorage: 'locale',
      },
      fallbackLng: {
        default: fallbackDefaultLocale,
      },
      ns: 'translation',
      returnEmptyString: false,
      interpolation: {
        escapeValue: false, // not needed for svelte as it escapes by default
      },
    })

  const lang = i18next?.language || defaultLocale || 'en-US'
  document.documentElement.setAttribute('lang', lang)
}

const i18n = createI18nStore(i18next)
const isLoadingStore = createIsLoadingStore(i18next)

export async function getLanguages() {
  const languages = (await import(`./locales/languages.json`)).default
  return languages
}
export function changeLanguage(lang: string) {
  document.documentElement.setAttribute('lang', lang)
  i18next.changeLanguage(lang)
}

export default i18n
export const isLoading = isLoadingStore
