import { changeLanguageLazy } from '.';
import en from 'assets/lang/en.svg';
import ru from 'assets/lang/ru.svg';
import th from 'assets/lang/th.svg';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const languageImage = {
    'en': en,
    'ru': ru,
    'th': th
} as const;

const LANGUAGE_ORDER = ['en', 'ru', 'th'] as const;

export const useLanguageSwitcher = () => {
    const { i18n } = useTranslation();
    const [currentLang, setCurrentLang] = useState(i18n.language);
    const [switchPending, setSwitchPending] = useState(false);

    useEffect(() => {
        const handleLanguageChanged = (lang: string) => {
            setCurrentLang(lang);
        };

        i18n.on('languageChanged', handleLanguageChanged);

        return () => {
            i18n.off('languageChanged', handleLanguageChanged);
        };
    }, [i18n]);

    const getNextLanguage = () => {
        const currentIndex = LANGUAGE_ORDER.indexOf(currentLang as any);
        const nextIndex = (currentIndex + 1) % LANGUAGE_ORDER.length;
        return LANGUAGE_ORDER[nextIndex];
    };

    const switchToNextLanguage = async () => {
        setSwitchPending(true);
        const nextLang = getNextLanguage();
        try {
            await changeLanguageLazy(nextLang);
        } finally {
            setSwitchPending(false);
        }
    };

    const currentIcon = languageImage[currentLang as keyof typeof languageImage];

    return { currentLang, currentIcon, switchPending, switchToNextLanguage };
};