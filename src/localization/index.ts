import { getPreferredLanguage, safeLanguageCode, savePreferredLanguage } from './helpers';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

const translationModules = import.meta.glob<{
    default: Record<string, string>;
}>('./translates/*.ts');

// Загрузка ts модуля
const fetchTranslationsForLanguage = async (locale: string) => {
    const moduleImporter = translationModules[`./translates/${locale}.ts`];
    if (!moduleImporter) {
        throw new Error(`Translations module for locale "${locale}" not found`);
    }

    const module = await moduleImporter();
    return module.default;
};

const ensureLanguageResources = async (locale: string) => {
    const safeLocale = safeLanguageCode(locale);

    if (safeLocale === 'en') {
        // Для английского можно не подгружать вообще ничего:
        // ключи = английские фразы, i18next вернёт их как есть.
        if (!i18next.language) {
            await i18next.changeLanguage('en');
        }
        return;
    }

    const hasBundle = i18next.hasResourceBundle(safeLocale, 'translates');

    if (!hasBundle) {
        const translations = await fetchTranslationsForLanguage(safeLocale);
        i18next.addResourceBundle(
            safeLocale,
            'translates',
            translations,
            true,  // merge
            true,  // overwrite
        );
    }
};

export const changeLanguageLazy = async (locale: string): Promise<void> => {
    const safeLocale = safeLanguageCode(locale);

    await ensureLanguageResources(safeLocale);
    await i18next.changeLanguage(safeLocale);
    savePreferredLanguage(safeLocale);
};

export const initLocalization = async (userLanguage: string): Promise<string> => {
    const preferredLanguage = getPreferredLanguage();
    const targetLanguage = safeLanguageCode(preferredLanguage || userLanguage);

    // Базовая инициализация: английский как дефолт,
    // ключи — фразы на английском.
    await i18next
        .use(initReactI18next)
        .init({
            lng: 'en',
            fallbackLng: 'en',
            ns: ['translates'],
            defaultNS: 'translates',
            resources: { en: { translates: {} } },
            interpolation: { escapeValue: false, },
            keySeparator: false,
        });

    // Если не английский - загружаем язык
    if (targetLanguage !== 'en') {
        await changeLanguageLazy(targetLanguage);
        return i18next.language;
    }

    await i18next.changeLanguage('en');
    return i18next.language;
};