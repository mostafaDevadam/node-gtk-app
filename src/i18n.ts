
import enTranslation from '../locales/en.json' with { type: 'json' };
import esTranslation from '../locales/es.json' with { type: 'json' };
import deTranslation from '../locales/de.json' with { type: 'json' };
import arTranslation from '../locales/ar.json' with { type: 'json' };
import i18next from 'i18next';


// Simple helper to check the Linux system language environment variable (e.g., "en_US.UTF-8" -> "en")
const systemLang = (process.env.LANG || 'en').split('_')[0].split('.')[0];

async function initI18n() {
    await i18next.init({
        lng: systemLang,       // Use the detected OS language
        fallbackLng: 'en',     // Default to English if system lang isn't supported yet
        resources: {
            en: { translation: enTranslation },
            es: { translation: esTranslation }
        }
    });

    // Make the standard global _() translation macro shortcut accessible anywhere in your code
    (globalThis as any)._ = (key: string) => i18next.t(key);
}

// Call this before building your GTK Windows!
//await initI18n();
