export const lsLanguageKey = 'preferredLanguage';

export const safeLanguageCode = (language: string): string => {
    return language.toLowerCase();
};

export const getPreferredLanguage = () => {
    try {
        const storedLanguage = localStorage.getItem(lsLanguageKey);
        return storedLanguage ? safeLanguageCode(storedLanguage) : '';
    } catch (error) {
        console.error('Unable to parse language code', error);
        return null;
    }
};

export const savePreferredLanguage = (language: string) => {
    const safeLanguage = safeLanguageCode(language);
    try {
        localStorage.setItem(lsLanguageKey, safeLanguage);
    } catch (error) {
        console.error('Unable to save language code', error);
    }
};