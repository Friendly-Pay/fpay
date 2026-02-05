import { InputProps } from '../Input/Input';
import { Country } from '../types';
import { type CountriesData } from './country-data';
import { type FocusEvent } from 'react';

export type { Country } from '../types';

export type AreaItem = Country & {
    isAreaCode: boolean;
    areaCodeLength: number;
};

export type CommonPhoneInputProps = {
    /**
     *  Выбранная страна
     */
    country?: Country;

    /**
     * Список необходимых iso2 стран
     */
    countries?: string[];

    /**
     * Дефолтный код страны
     */
    defaultIso2?: string;

    /**
     * Список правил парсинга номеров телефонов по странам (для переопределения дефолтного)
     */
    customCountriesList?: CountriesData[];

    /**
     * Возможность стереть код страны
     * @default true
     * @description Используйте `'preserve'` для сохранения кода страны при автозаполнении (актуально для Safari). При этом код страны можно удалить в случае использования `true`
     */
    clearableCountryCode?: boolean | 'preserve';

    /**
     *Показывать крестик очистки
     */
    clear?: boolean;

    /**
     * Обработчик события изменения страны
     */
    onCountryChange?: (country?: Country) => void;

    /**
     *  Обработчик изменения номера
     */
    onChange?: (phone: string) => void;

    /**
     * Обработчик блюра поля
     */
    onBlur?: (event: FocusEvent<HTMLDivElement | HTMLInputElement>) => void;

    /**
     * Обработчик фокуса поля
     */
    onFocus?: (event: FocusEvent<HTMLDivElement | HTMLInputElement>) => void;

    /**
     * Включить автозаполнение номера
     *
     * @deprecated Автозаполнение активно всегда. Проп будет удален в следующей мажорной версии
     * @default true
     */
    autoFill?: boolean;
};

export type InternationalPhoneInputProps = CommonPhoneInputProps & Omit<InputProps, 'onFocus' | 'onBlur' | 'onScroll' | 'onInput' | 'onChange'>;