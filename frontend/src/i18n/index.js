import i18next from 'i18next'
import { eng } from './en'
import { esp } from './es'

i18next
    .init({ 
        interpolation: {
            escapeValue: false,
        },
        lng: window.localStorage.getItem('lan') ? window.localStorage.getItem('lan') : 'es',
        resources: {
            // Idiomas que se utilizarán en la página
            en: {
                translation: eng,
            },
            es: {
                translation: esp,
            },
        },
    })


export default i18next